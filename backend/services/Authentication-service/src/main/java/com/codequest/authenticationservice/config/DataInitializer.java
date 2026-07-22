package com.codequest.authenticationservice.config;

import com.codequest.authenticationservice.model.Role; // adjust to your Role entity package
import com.codequest.authenticationservice.repository.RoleRepository; // adjust to your Role repository package
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByName("ROLE_APPLICANT").isEmpty()) {
            Role role = new Role();
            role.setName("ROLE_APPLICANT");
            roleRepository.save(role);
        }
    }
}