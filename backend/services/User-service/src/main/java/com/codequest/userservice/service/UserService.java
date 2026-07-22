package com.codequest.userservice.service;


import com.codequest.userservice.dto.UserResponse;
import com.codequest.userservice.model.Role;
import com.codequest.userservice.model.User;
import com.codequest.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // Automatically injects UserRepository via constructor
public class UserService {

    private final UserRepository userRepository;



    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .appId(user.getAppId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .ghanaCard(user.getGhanaCard())
                .age(user.getAge())
                .isVerified(user.getIsVerified())
                .avatar(user.getAvatar())
                .role(user.getRoles().isEmpty() ? "" : user.getRoles().iterator().next().getName())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
