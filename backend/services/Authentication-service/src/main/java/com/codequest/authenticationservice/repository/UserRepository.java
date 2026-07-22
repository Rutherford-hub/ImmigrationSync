package com.codequest.authenticationservice.repository;

import com.codequest.authenticationservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Removed unnecessary @Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}