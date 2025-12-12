package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xoftex.parthub.models.ImageModelPayment;

public interface ImageModelPaymentRepository extends JpaRepository<ImageModelPayment, Long> {
    
    List<ImageModelPayment> findByVehicleId(Long vehicle);

    public List<ImageModelPayment> findByPaymentId(long jobId);
}