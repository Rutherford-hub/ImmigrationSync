package com.codequest.authenticationservice.repository;

import com.codequest.authenticationservice.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Removed unnecessary @Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(String name);
}