package com.codequest.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private List<String> roles;
    private String name;
    private String appId;
    private String phone;
    private String ghanaCard;
    private Integer age;
    private Boolean isVerified;
    private String avatar;
}
