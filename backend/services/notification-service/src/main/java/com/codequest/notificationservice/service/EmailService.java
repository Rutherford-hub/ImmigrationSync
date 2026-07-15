package com.codequest.notificationservice.service;

import com.codequest.notificationservice.dto.EmailRequest;
import com.codequest.notificationservice.dto.NotificationResponse;
import com.codequest.notificationservice.model.Notification;
import com.codequest.notificationservice.model.NotificationType;
import com.codequest.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public NotificationResponse sendEmail(EmailRequest request) {
        log.info("Preparing to send email to: {}", request.getRecipientEmail());

        // 1. Set up Notification Record
        Notification notification = Notification.builder()
                .recipientEmail(request.getRecipientEmail())
                .subject(request.getSubject())
                .content(request.getContent())
                .notificationType(NotificationType.EMAIL)
                .sent(false)
                .build();

        // Save initial record
        Notification savedNotification = notificationRepository.save(notification);

        // 2. Perform Mock sending (Upgrade with JavaMailSender logic here)
        boolean sendSuccess = mockSend(request.getRecipientEmail(), request.getSubject(), request.getContent());

        if (sendSuccess) {
            savedNotification.setSent(true);
            savedNotification.setSentAt(LocalDateTime.now());
            notificationRepository.save(savedNotification);
            log.info("Notification sent successfully to: {}", request.getRecipientEmail());
        } else {
            log.error("Failed sending simulation to: {}", request.getRecipientEmail());
        }

        return mapToResponse(savedNotification);
    }

    public List<NotificationResponse> getNotificationHistory(String email) {
        return notificationRepository.findByRecipientEmail(email).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private boolean mockSend(String to, String subject, String content) {
        // Logging simulate terminal output
        System.out.println("----------------------------------------");
        System.out.println("[SMTP SIMULATOR] SENDING OUT EMAIL...");
        System.out.println("To:      " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body:    " + content);
        System.out.println("----------------------------------------");
        return true;
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .recipientEmail(notification.getRecipientEmail())
                .subject(notification.getSubject())
                .notificationType(notification.getNotificationType().name())
                .sent(notification.isSent())
                .sentAt(notification.getSentAt())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}