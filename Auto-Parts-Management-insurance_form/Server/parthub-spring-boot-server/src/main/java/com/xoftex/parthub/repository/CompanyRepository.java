package com.xoftex.parthub.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Company;
import com.xoftex.parthub.models.Expense;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByToken(String uuid);

    // total count
    int countByIdNot(int id);

    List<Company> findByIdNot(long companyId, Pageable withPage);

    long countByIdNotAndCreatedAtBetween(int i, Date from, Date to);

    @Query(value = "SELECT UPPER(LEFT(name, 1)) AS name_first_letter, COUNT(*) AS letter_count FROM comapanies WHERE id > 0 GROUP BY UPPER(LEFT(name, 1)) ORDER BY letter_count DESC, name_first_letter", nativeQuery = true)
    List<Object[]> reportNameCounts();

    int countByNameContainingIgnoreCase(String name);

    List<Company> findByNameContainingIgnoreCaseOrderByIdDesc(String name, Pageable withPage);

    @Query(value = "Select count(*) from comapanies a where upper(a.name) rlike ?1", nativeQuery = true)
    int coutNamesIn(String names);

    @Query(value = "select * from comapanies a where upper(a.name) rlike ?1", nativeQuery = true)
    List<Company> findNamesIn(String names, Pageable withPage);

}
