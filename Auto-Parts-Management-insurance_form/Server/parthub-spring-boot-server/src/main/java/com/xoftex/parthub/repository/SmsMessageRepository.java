package com.xoftex.parthub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.xoftex.parthub.models.SmsMessage;

public interface SmsMessageRepository extends JpaRepository<SmsMessage, Long> {

    @Query("SELECT s FROM SmsMessage s WHERE s.vehicleId = :vehicleId ORDER BY s.createdAt DESC")
    List<SmsMessage> findByVehicleIdOrderByCreatedAtDesc(@Param("vehicleId") long vehicleId);

    @Query("SELECT s FROM SmsMessage s WHERE s.phoneNumber = :phoneNumber ORDER BY s.createdAt DESC")
    List<SmsMessage> findByPhoneNumberOrderByCreatedAtDesc(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT DISTINCT s.vehicleId FROM SmsMessage s WHERE s.phoneNumber = :phoneNumber ORDER BY s.createdAt DESC")
    List<Long> findVehicleIdsByPhoneNumber(@Param("phoneNumber") String phoneNumber);
}
