package com.codequest.notificationservice.controller;

import com.codequest.notificationservice.dto.EmailRequest;
import com.codequest.notificationservice.dto.NotificationResponse;
import com.codequest.notificationservice.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @PostMapping("/send-email")
    public ResponseEntity<NotificationResponse> sendEmail(@Valid @RequestBody EmailRequest request) {
        NotificationResponse response = emailService.sendEmail(request);
        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @GetMapping("/history")
    public ResponseEntity<List<NotificationResponse>> getHistoryByRecipient(@RequestParam("email") String email) {
        List<NotificationResponse> history = emailService.getNotificationHistory(email);
        return ResponseEntity.ok(history);
    }
}