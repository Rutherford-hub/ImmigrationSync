package com.codequest.userservice.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String appId;
    private String fullName;
    private String email;
    private String phone;
    private String ghanaCard;
    private Integer age;
    private Boolean isVerified;
    private String avatar;
    private String role;
    private LocalDateTime createdAt;
}
