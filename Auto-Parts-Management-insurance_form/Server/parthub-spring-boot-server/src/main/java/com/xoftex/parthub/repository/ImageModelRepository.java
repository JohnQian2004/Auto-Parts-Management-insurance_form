package  com.xoftex.parthub.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xoftex.parthub.models.ImageModel;
 

public interface ImageModelRepository extends JpaRepository<ImageModel, Long> {
    List<ImageModel> findByAutopartId(Long autopartId);

    long countByCreatedAtBetween(Date from, Date to);

    long countByAutopartIdNot(int id);

}