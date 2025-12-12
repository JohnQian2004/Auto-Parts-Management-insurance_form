package com.xoftex.parthub.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.xoftex.parthub.models.Supplement;

public interface SupplementRepository extends JpaRepository<Supplement, Long> {
    List<Supplement> findByVehicleId(Long vehicle);
}