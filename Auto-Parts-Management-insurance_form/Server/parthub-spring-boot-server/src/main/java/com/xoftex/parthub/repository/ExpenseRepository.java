package com.xoftex.parthub.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Expense;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByCompanyIdOrderByIdDesc(long companyId);

    int countByCompanyIdOrderByIdDesc(long companyId);

    List<Expense> findByCompanyIdOrderByIdDesc(long companyId, Pageable withPage);

    @Query(value = "Select count(*) from expenses a where a.company_id=?1 and upper(a.comments) rlike ?2", nativeQuery = true)
    int coutCommentsIn(long companyId, String names);

    @Query(value = "select * from expenses a where a.company_id=?1 and upper(a.comments) rlike ?2", nativeQuery = true)
    List<Expense> findCommentsIn(long companyId, String names,
            Pageable withPage);

    int countByCompanyIdAndCommentsIgnoreCaseOrderByIdDesc(long companyId, String comments);

    List<Expense> findByCompanyIdAndCommentsIgnoreCaseOrderByIdDesc(long companyId, String comments, Pageable withPage);

    List<Expense> findByCompanyIdAndCreatedAtBetween(long companyId, Date from, Date to);

    List<Expense> findByCompanyIdAndExpenseTypeIdAndCreatedAtBetweenOrderByIdDesc(long companyId, long expenseId,
            Date from, Date to);

    List<Expense> findByCompanyIdAndVendorIdAndCreatedAtBetweenOrderByIdDesc(long companyId, long vendorId, Date from,
            Date to);

    List<Expense> findByCompanyIdAndPaymentMethodIdAndCreatedAtBetweenOrderByIdDesc(long companyId,
            long paymentMethodId, Date from, Date to);

    @Query(value = "SELECT expense_type_id, SUM(subtotal) as count FROM expenses WHERE company_id=:companyId AND created_at BETWEEN :from AND :to GROUP BY expense_type_id ORDER BY count asc ", nativeQuery = true)
    List<Object[]> getExpenseTypeReport(@Param("companyId") long companyId, @Param("from") Date from,
            @Param("to") Date to);

    @Query(value = "SELECT vendor_id, SUM(subtotal) as count FROM expenses WHERE company_id=:companyId AND created_at BETWEEN :from AND :to GROUP BY vendor_id ORDER BY count asc ", nativeQuery = true)
    List<Object[]> getVendorReport(@Param("companyId") long companyId, @Param("from") Date from,
            @Param("to") Date to);

    @Query(value = "SELECT payment_method_id, SUM(subtotal) as count FROM expenses WHERE company_id=:companyId AND created_at BETWEEN :from AND :to GROUP BY payment_method_id ORDER BY count asc ", nativeQuery = true)
    List<Object[]> getPaymentMethodReport(@Param("companyId") long companyId, @Param("from") Date from,
            @Param("to") Date to);

    int countByCompanyIdNot(long companyId);

    int countByCompanyIdAndPaidOrderByIdDesc(int companyId, boolean b);

    List<Expense> findByCompanyIdAndPaidOrderByIdDesc(int companyId, boolean b, Pageable withPage);

 

}
