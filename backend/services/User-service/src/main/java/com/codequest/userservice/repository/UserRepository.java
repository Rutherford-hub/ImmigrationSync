package com.codequest.userservice.repository;

import com.codequest.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGhanaCard(String ghanaCard);
    Optional<User> findByEmailOrGhanaCard(String email, String ghanaCard);
    
    boolean existsByEmail(String email);
}
