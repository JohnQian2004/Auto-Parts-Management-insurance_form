package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

  List<Payment> findByVehicleIdOrderByNameAsc(long companyId);

  List<Payment> findByVehicleId(long vehicleId);

  int countByVehicleIdNot(long vehicleId);

  // SELECT p.* FROM payments p LEFT JOIN vehicles v on v.id = p.vehicle_id WHERE
  // v.company_id=1 AND YEARWEEK(p.date, 3) = 202522 ORDER BY DAYOFWEEK(p.date);
  @Query(value = "SELECT p.* FROM payments p LEFT JOIN vehicles v on v.id = p.vehicle_id WHERE v.company_id=?1 AND  YEARWEEK(p.date, 3) = ?2 ORDER BY DAYOFWEEK(p.date)", nativeQuery = true)
  List<Payment> findByYearWeek(long companyId, int yearWeek);

  @Query(value = "SELECT SUM(p.amount) FROM payments p LEFT JOIN vehicles v on v.id = p.vehicle_id WHERE v.company_id=?1 AND  YEARWEEK(p.date, 3) = ?2 ORDER BY DAYOFWEEK(p.date)", nativeQuery = true)
  Double findSumByYearWeek(long companyId, int yearWeek);

}
