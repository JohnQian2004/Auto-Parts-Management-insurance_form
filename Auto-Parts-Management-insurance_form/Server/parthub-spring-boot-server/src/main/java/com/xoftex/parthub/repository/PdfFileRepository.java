package com.xoftex.parthub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.xoftex.parthub.models.PdfFile;

public interface PdfFileRepository extends JpaRepository<PdfFile, Long> {
    
    List<PdfFile> findByVehicleId(Long vehicle);

    Optional<PdfFile> findByToken(String pdfFileUuid);
}