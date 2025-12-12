package com.xoftex.parthub.repository;

 

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.xoftex.parthub.models.ItemType;


@Repository
public interface ItemTypeRepository extends JpaRepository<ItemType, Long> {

    List<ItemType> findByCompanyIdOrderByNameAsc(long compayId);

}
