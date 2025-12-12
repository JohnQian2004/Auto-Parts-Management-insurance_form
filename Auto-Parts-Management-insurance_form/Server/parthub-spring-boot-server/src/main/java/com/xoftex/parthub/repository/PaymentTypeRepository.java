package com.xoftex.parthub.repository;

 

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.xoftex.parthub.models.PaymentType;


@Repository
public interface PaymentTypeRepository extends JpaRepository<PaymentType, Long> {

    List<PaymentType> findByCompanyIdOrderByNameAsc(long compayId);

}
