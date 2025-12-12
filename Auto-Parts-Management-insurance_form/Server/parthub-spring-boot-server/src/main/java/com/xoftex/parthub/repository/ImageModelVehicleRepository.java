package com.xoftex.parthub.repository;

import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.xoftex.parthub.models.ImageModelVehicle;

public interface ImageModelVehicleRepository extends JpaRepository<ImageModelVehicle, Long> {
    
    List<ImageModelVehicle> findByVehicleId(Long vehicle);

    int countByVehicleIdNot(long vehicleId);

    long countByCreatedAtBetween(Date from, Date to);

}