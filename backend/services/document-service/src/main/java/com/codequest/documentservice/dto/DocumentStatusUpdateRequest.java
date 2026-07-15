package com.codequest.documentservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status; // Expecting VERIFIED or REJECTED
}