package com.xoftex.parthub.repository;

 

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Address;


@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
  //Optional<Address> findByUserId(String addressId);

}
