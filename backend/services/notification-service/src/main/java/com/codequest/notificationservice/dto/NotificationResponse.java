package com.codequest.notificationservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String recipientEmail;
    private String subject;
    private String notificationType;
    private boolean sent;
    private LocalDateTime sentAt;
    private LocalDateTime createdAt;
}