package com.xoftex.parthub.repository;

 

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.xoftex.parthub.models.DocType;


@Repository
public interface DocTypeRepository extends JpaRepository<DocType, Long> {

    List<DocType> findByCompanyIdOrderByNameAsc(long compayId);

}
