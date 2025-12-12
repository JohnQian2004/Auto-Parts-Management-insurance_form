package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.CounterInvoice;

@Repository
public interface CounterInvoiceRepository extends JpaRepository<CounterInvoice, Long> {

  List<CounterInvoice> findFirst20ByCustomerIdOrderByIdDesc(long customerId);

  List<CounterInvoice> findByCompanyIdAndInvoiceNumber(long companyId, String invoiceNumber);

  List<CounterInvoice> findByCompanyIdOrderByIdDesc(long companyId, Pageable withPage);

  int countByCompanyId(long companyId);

}
