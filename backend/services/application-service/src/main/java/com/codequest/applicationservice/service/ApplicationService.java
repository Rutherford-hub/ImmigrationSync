package com.codequest.applicationservice.service;

import com.codequest.applicationservice.dto.ApplicationRequest;
import com.codequest.applicationservice.dto.StatusUpdateRequest;
import com.codequest.applicationservice.model.Application;
import com.codequest.applicationservice.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Transactional
    public Application createApplication(ApplicationRequest request) {
        Application application = Application.builder()
                .userId(request.getUserId())
                .visaType(request.getVisaType())
                .formData(request.getFormData())
                .status("DRAFT")
                .build();
        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByUserId(Long userId) {
        return applicationRepository.findByUserId(userId);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with ID: " + id));
    }

    @Transactional
    public Application updateApplicationStatus(Long id, StatusUpdateRequest request) {
        Application application = getApplicationById(id);
        
        String newStatus = request.getStatus().toUpperCase();
        
        // Status State Validation check
        if (!newStatus.equals("DRAFT") && !newStatus.equals("SUBMITTED") && 
            !newStatus.equals("UNDER_REVIEW") && !newStatus.equals("APPROVED") && 
            !newStatus.equals("REJECTED")) {
            throw new IllegalArgumentException("Invalid status value: " + request.getStatus());
        }
        
        application.setStatus(newStatus);
        return applicationRepository.save(application);
    }
}