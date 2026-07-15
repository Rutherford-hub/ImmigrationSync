package com.codequest.documentservice.controller;

import com.codequest.documentservice.dto.DocumentStatusUpdateRequest;
import com.codequest.documentservice.dto.DocumentUploadResponse;
import com.codequest.documentservice.service.DocumentStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentStorageService storageService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentUploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("applicationId") Long applicationId,
            @RequestParam("userId") Long userId) {
        
        DocumentUploadResponse response = storageService.uploadDocument(file, applicationId, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<DocumentUploadResponse>> getByApplication(@PathVariable Long applicationId) {
        List<DocumentUploadResponse> responses = storageService.getDocumentsByApplication(applicationId);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DocumentUploadResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody DocumentStatusUpdateRequest request) {
        
        DocumentUploadResponse response = storageService.updateStatus(id, request);
        return ResponseEntity.ok(response);
    }
}