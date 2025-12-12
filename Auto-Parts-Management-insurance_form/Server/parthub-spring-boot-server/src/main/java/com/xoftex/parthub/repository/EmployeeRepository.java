package com.xoftex.parthub.repository;

 

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Employee;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByCompanyId(long companyId);

    List<Employee> findAllByOrderByFirstNameAsc();
 
    List<Employee> findByCompanyIdOrderByFirstNameAsc(long companyId);

    Optional<Employee> findByToken(String uuid);

    public Optional<Employee> getByToken(String uuidEmployee);


    
}
