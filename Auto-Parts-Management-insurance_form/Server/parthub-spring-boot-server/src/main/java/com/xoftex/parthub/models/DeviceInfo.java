package com.xoftex.parthub.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Table;

@Entity
@Table(name = "deviceinfos")
public class DeviceInfo extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String brand;
    private String manufacturer;
    private String modelName;
    private String deviceName;
    private String osName;
    private String osVersion;
    private String platformApiLevel;
    private long totalMemory;

    private boolean isDevice;

    private long companyId = 0;
    private long userId;
    private int counts;


    public DeviceInfo(long id, String brand, String manufacturer, String modelName, String deviceName, String osName,
            String osVersion, String platformApiLevel, long totalMemory, boolean isDevice, long companyId, long userId,
            int counts) {
        this.id = id;
        this.brand = brand;
        this.manufacturer = manufacturer;
        this.modelName = modelName;
        this.deviceName = deviceName;
        this.osName = osName;
        this.osVersion = osVersion;
        this.platformApiLevel = platformApiLevel;
        this.totalMemory = totalMemory;
        this.isDevice = isDevice;
        this.companyId = companyId;
        this.userId = userId;
        this.counts = counts;
    }

    @Override
    public String toString() {
        return "DeviceInfo [id=" + id + ", brand=" + brand + ", manufacturer=" + manufacturer + ", modelName="
                + modelName + ", deviceName=" + deviceName + ", osName=" + osName + ", osVersion=" + osVersion
                + ", platformApiLevel=" + platformApiLevel + ", totalMemory=" + totalMemory + ", companyId=" + companyId
                + ", userId=" + userId + ", counts=" + counts + "]";
    }

    public DeviceInfo() {
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public void setOsName(String osName) {
        this.osName = osName;
    }

    public void setOsVersion(String osVersion) {
        this.osVersion = osVersion;
    }

    public void setPlatformApiLevel(String platformApiLevel) {
        this.platformApiLevel = platformApiLevel;
    }

    public void setTotalMemory(long totalMemory) {
        this.totalMemory = totalMemory;
    }

    public void setCompanyId(long companyId) {
        this.companyId = companyId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public void setCounts(int counts) {
        this.counts = counts;
    }

    public long getId() {
        return id;
    }

    public String getBrand() {
        return brand;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public String getModelName() {
        return modelName;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public String getOsName() {
        return osName;
    }

    public String getOsVersion() {
        return osVersion;
    }

    public String getPlatformApiLevel() {
        return platformApiLevel;
    }

    public long getTotalMemory() {
        return totalMemory;
    }

    public long getCompanyId() {
        return companyId;
    }

    public long getUserId() {
        return userId;
    }

    public int getCounts() {
        return counts;
    }

    public boolean isDevice() {
        return isDevice;
    }

    public void setDevice(boolean isDevice) {
        this.isDevice = isDevice;
    }

}
