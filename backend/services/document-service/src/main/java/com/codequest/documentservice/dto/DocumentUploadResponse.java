package com.codequest.documentservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentUploadResponse {
    private Long id;
    private Long applicationId;
    private Long userId;
    private String fileName;
    private String fileType;
    private String status;
    private LocalDateTime createdAt;
}