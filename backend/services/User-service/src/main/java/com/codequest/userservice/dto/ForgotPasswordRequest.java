package com.codequest.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @NotBlank(message = "Identifier (Email or National ID) is required")
    private String identifier;
}
