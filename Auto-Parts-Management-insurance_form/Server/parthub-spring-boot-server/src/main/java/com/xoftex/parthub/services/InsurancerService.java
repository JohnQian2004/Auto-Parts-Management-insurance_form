package com.xoftex.parthub.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xoftex.parthub.models.Insurancer;
import com.xoftex.parthub.repository.InsurancerRepository;

@Service
@Transactional
public class InsurancerService {
    
    private static final Logger LOG = LoggerFactory.getLogger(InsurancerService.class);
    
    @Autowired
    private InsurancerRepository insurancerRepository;
    
    // Basic CRUD operations
    public Insurancer createInsurancer(Long userId, Insurancer insurancer) {
        LOG.info("Creating insurancer for user: {}", userId);
        
        // Generate unique token if not provided
        if (insurancer.getToken() == null || insurancer.getToken().trim().isEmpty()) {
            insurancer.setToken(generateUniqueToken());
        }
        
        // Validate token uniqueness
        if (!isTokenUnique(insurancer.getToken())) {
            throw new RuntimeException("Token already exists: " + insurancer.getToken());
        }
        
        insurancer.setUserId(userId);
        return insurancerRepository.save(insurancer);
    }
    
    public Optional<Insurancer> getInsurancer(Long insurancerId) {
        LOG.debug("Getting insurancer with ID: {}", insurancerId);
        return insurancerRepository.findById(insurancerId);
    }
    
    public Insurancer updateInsurancer(Long insurancerId, Insurancer insurancer) {
        LOG.info("Updating insurancer with ID: {}", insurancerId);
        
        Optional<Insurancer> existingInsurancer = insurancerRepository.findById(insurancerId);
        if (!existingInsurancer.isPresent()) {
            throw new RuntimeException("Insurancer not found with ID: " + insurancerId);
        }
        
        Insurancer current = existingInsurancer.get();
        
        // Update fields
        if (insurancer.getName() != null) current.setName(insurancer.getName());
        if (insurancer.getContactFirstName() != null) current.setContactFirstName(insurancer.getContactFirstName());
        if (insurancer.getContactLastName() != null) current.setContactLastName(insurancer.getContactLastName());
        if (insurancer.getUrl() != null) current.setUrl(insurancer.getUrl());
        if (insurancer.getPhone() != null) current.setPhone(insurancer.getPhone());
        if (insurancer.getPhone2() != null) current.setPhone2(insurancer.getPhone2());
        if (insurancer.getPhone3() != null) current.setPhone3(insurancer.getPhone3());
        if (insurancer.getEmail() != null) current.setEmail(insurancer.getEmail());
        if (insurancer.getNotes() != null) current.setNotes(insurancer.getNotes());
        
        return insurancerRepository.save(current);
    }
    
    public boolean deleteInsurancer(Long insurancerId) {
        LOG.info("Deleting insurancer with ID: {}", insurancerId);
        
        Optional<Insurancer> insurancer = insurancerRepository.findById(insurancerId);
        if (!insurancer.isPresent()) {
            return false;
        }
        
        insurancerRepository.deleteById(insurancerId);
        return true;
    }
    
    public List<Insurancer> getAllCompanyInsurancers(Long companyId) {
        LOG.debug("Getting all insurancers for company: {}", companyId);
        return insurancerRepository.findByCompanyIdOrderByNameAsc(companyId);
    }
    
    // Insurance system specific operations
    public Optional<Insurancer> getInsurancerByToken(String token) {
        LOG.debug("Getting insurancer by token: {}", token);
        return insurancerRepository.findByToken(token);
    }
    
    public Optional<Insurancer> getInsurancerByName(String name) {
        LOG.debug("Getting insurancer by name: {}", name);
        return insurancerRepository.findByName(name);
    }
    
    public Insurancer updateInsurancerToken(Long insurancerId, String token) {
        LOG.info("Updating token for insurancer: {}", insurancerId);
        
        // Validate token uniqueness
        if (!isTokenUnique(token)) {
            throw new RuntimeException("Token already exists: " + token);
        }
        
        Optional<Insurancer> insurancerOptional = insurancerRepository.findById(insurancerId);
        if (!insurancerOptional.isPresent()) {
            throw new RuntimeException("Insurancer not found with ID: " + insurancerId);
        }
        
        Insurancer insurancer = insurancerOptional.get();
        insurancer.setToken(token);
        return insurancerRepository.save(insurancer);
    }
    
    // Utility operations
    public boolean isTokenUnique(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }
        
        Optional<Insurancer> existing = insurancerRepository.findByToken(token);
        return !existing.isPresent();
    }
    
    public String generateUniqueToken() {
        String token;
        int attempts = 0;
        int maxAttempts = 10;
        
        do {
            token = UUID.randomUUID().toString();
            attempts++;
            
            if (attempts > maxAttempts) {
                throw new RuntimeException("Unable to generate unique token after " + maxAttempts + " attempts");
            }
        } while (!isTokenUnique(token));
        
        LOG.debug("Generated unique token: {} after {} attempts", token, attempts);
        return token;
    }
    
    public List<Insurancer> searchInsurancers(String searchTerm, Long companyId) {
        LOG.debug("Searching insurancers with term: '{}' for company: {}", searchTerm, companyId);
        
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllCompanyInsurancers(companyId);
        }
        
        // Get all company insurancers and filter by search term
        List<Insurancer> allInsurancers = getAllCompanyInsurancers(companyId);
        
        return allInsurancers.stream()
            .filter(insurancer -> 
                (insurancer.getName() != null && insurancer.getName().toLowerCase().contains(searchTerm.toLowerCase())) ||
                (insurancer.getContactFirstName() != null && insurancer.getContactFirstName().toLowerCase().contains(searchTerm.toLowerCase())) ||
                (insurancer.getContactLastName() != null && insurancer.getContactLastName().toLowerCase().contains(searchTerm.toLowerCase())) ||
                (insurancer.getEmail() != null && insurancer.getEmail().toLowerCase().contains(searchTerm.toLowerCase()))
            )
            .collect(java.util.stream.Collectors.toList());
    }
}
