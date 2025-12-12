package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xoftex.parthub.models.ImageModelJob;

public interface ImageModelJobRepository extends JpaRepository<ImageModelJob, Long> {
    
    List<ImageModelJob> findByVehicleId(Long vehicle);

    public List<ImageModelJob> findByJobId(long jobId);
}