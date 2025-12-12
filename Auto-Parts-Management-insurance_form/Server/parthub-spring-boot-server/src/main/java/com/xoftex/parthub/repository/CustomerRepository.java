package com.xoftex.parthub.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

        List<Customer> findByPhoneAndCompanyId(String phone, long companyId);

        List<Customer> findByLastNameAndCompanyId(String lastName, long companyId);

        List<Customer> findByCompanyId(long companyId);

        List<Customer> findByCompanyIdAndArchived(long companyId, boolean archived, Pageable withPage);

        List<Customer> findByCompanyIdAndArchivedAndLastNameStartingWithIgnoreCase(long companyId, boolean archived,
                        String lastName,
                        Pageable withPage);

        int countByCompanyIdAndArchived(long companyId, boolean archived);

        int countByCompanyIdAndArchivedAndLastNameStartingWithIgnoreCase(long companyId, boolean archived,
                        String partName);

        long countByCompanyIdAndArchivedAndCreatedAtBetween(long companyId, boolean achived, Date from, Date to);

        List<Customer> findByCompanyIdAndArchivedAndCreatedAtBetween(long companyId, boolean archived, Date from,
                        Date to);

        int countByCompanyIdNot(long companyId);

        long countByCompanyIdNotAndCreatedAtBetween(int i, Date from, Date to);

}
