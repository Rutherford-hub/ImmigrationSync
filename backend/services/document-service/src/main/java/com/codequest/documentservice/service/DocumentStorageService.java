package com.codequest.documentservice.service;

import com.codequest.documentservice.dto.DocumentStatusUpdateRequest;
import com.codequest.documentservice.dto.DocumentUploadResponse;
import com.codequest.documentservice.model.Document;
import com.codequest.documentservice.model.DocumentStatus;
import com.codequest.documentservice.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentStorageService {

    private final DocumentRepository documentRepository;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Transactional
    public DocumentUploadResponse uploadDocument(MultipartFile file, Long applicationId, Long userId) {
        try {
            // 1. Create upload folder if it doesn't exist
            Path root = Paths.get(uploadDir);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            // 2. Generate a unique file name to avoid collisions
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            Path targetPath = root.resolve(uniqueFileName);

            // 3. Save physical file to local disk
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // 4. Save metadata in PostgreSQL database
            Document document = Document.builder()
                    .applicationId(applicationId)
                    .userId(userId)
                    .fileName(originalFileName != null ? originalFileName : uniqueFileName)
                    .fileType(file.getContentType())
                    .storagePath(targetPath.toString())
                    .status(DocumentStatus.PENDING)
                    .build();

            Document savedDocument = documentRepository.save(document);
            return mapToResponse(savedDocument);

        } catch (IOException e) {
            throw new RuntimeException("Failed to store physical file. Error: " + e.getMessage(), e);
        }
    }

    public List<DocumentUploadResponse> getDocumentsByApplication(Long applicationId) {
        return documentRepository.findByApplicationId(applicationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DocumentUploadResponse updateStatus(Long documentId, DocumentStatusUpdateRequest request) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with ID: " + documentId));

        try {
            DocumentStatus newStatus = DocumentStatus.valueOf(request.getStatus().toUpperCase());
            document.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value. Must be PENDING, VERIFIED, or REJECTED.");
        }

        Document updatedDocument = documentRepository.save(document);
        return mapToResponse(updatedDocument);
    }

    private DocumentUploadResponse mapToResponse(Document document) {
        return DocumentUploadResponse.builder()
                .id(document.getId())
                .applicationId(document.getApplicationId())
                .userId(document.getUserId())
                .fileName(document.getFileName())
                .fileType(document.getFileType())
                .status(document.getStatus().name())
                .createdAt(document.getCreatedAt())
                .build();
    }
}