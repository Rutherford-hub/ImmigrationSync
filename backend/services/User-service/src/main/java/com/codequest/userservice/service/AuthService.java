package com.codequest.userservice.service;

import com.codequest.userservice.dto.AuthResponse;
import com.codequest.userservice.dto.LoginRequest;
import com.codequest.userservice.dto.RegisterRequest;
import com.codequest.userservice.model.Role;
import com.codequest.userservice.model.User;
import com.codequest.userservice.repository.RoleRepository;
import com.codequest.userservice.repository.UserRepository;
import com.codequest.userservice.config.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final com.codequest.userservice.client.NotificationClient notificationClient;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager,
                       com.codequest.userservice.client.NotificationClient notificationClient) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.notificationClient = notificationClient;
    }

    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered!");
        }

        Role defaultRole = roleRepository.findByName("ROLE_APPLICANT")
                .orElseThrow(() -> new IllegalStateException("Default role ROLE_APPLICANT not found."));

        String generatedAppId = "GHA-APP-" + (int)(Math.random() * 900000 + 100000);

        User user = User.builder()
                .appId(generatedAppId)
                .fullName(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .ghanaCard(request.getGhanaCard())
                .age(request.getAge())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(new HashSet<>(Collections.singletonList(defaultRole)))
                .build();

        userRepository.save(user);
        return "User registered successfully!";
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user);

        List<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new AuthResponse(
                token, 
                user.getEmail(), 
                roles,
                user.getFullName(),
                user.getAppId(),
                user.getPhone(),
                user.getGhanaCard(),
                user.getAge(),
                user.getIsVerified(),
                user.getAvatar()
        );
    }
    
    @Transactional
    public String forgotPassword(String identifier) {
        User user = userRepository.findByEmailOrGhanaCard(identifier, identifier)
                .orElseThrow(() -> new IllegalArgumentException("Account not found with this identifier"));

        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setResetOtp(otp);
        user.setResetOtpExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        try {
            java.util.Map<String, String> emailRequest = new java.util.HashMap<>();
            emailRequest.put("recipientEmail", user.getEmail());
            emailRequest.put("subject", "Password Reset Verification Code");
            emailRequest.put("content", "Your password reset code is: " + otp + ". This code expires in 15 minutes.");
            notificationClient.sendEmail(emailRequest);
        } catch (Exception e) {
            // Log error, but don't fail the request entirely in a dev environment if email fails
            System.err.println("Failed to send email to " + user.getEmail() + ": " + e.getMessage());
        }

        return "Password reset code sent to registered email.";
    }

    @Transactional
    public String verifyOtp(String identifier, String otp) {
        User user = userRepository.findByEmailOrGhanaCard(identifier, identifier)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        if (user.getResetOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired");
        }

        return "OTP Verified";
    }

    @Transactional
    public String resetPassword(String identifier, String otp, String newPassword) {
        User user = userRepository.findByEmailOrGhanaCard(identifier, identifier)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp)) {
            throw new IllegalArgumentException("Invalid OTP");
        }
        
        if (user.getResetOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);
        userRepository.save(user);

        return "Password successfully reset";
    }
}
