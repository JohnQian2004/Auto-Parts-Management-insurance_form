package com.xoftex.parthub.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xoftex.parthub.models.DeviceInfo;
 
 


@Repository
public interface DeviceInfoRepository extends JpaRepository<DeviceInfo, Long> {

    Optional<DeviceInfo> findByBrandAndDeviceNameAndManufacturerAndCompanyId(String brand, String deviceName,
            String manufacturer, long companyId);


}
