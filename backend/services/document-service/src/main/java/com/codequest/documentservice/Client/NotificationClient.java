package com.codequest.documentservice.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

@FeignClient(name = "notification-service", url = "${NOTIFICATION_SERVICE_URL:http://localhost:8084/api/v1/notifications}")
public interface NotificationClient {

    @PostMapping("/send-email")
    void sendEmail(@RequestBody Map<String, String> emailRequest);
}