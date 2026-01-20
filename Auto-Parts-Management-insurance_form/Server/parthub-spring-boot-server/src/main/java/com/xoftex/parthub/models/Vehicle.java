package com.xoftex.parthub.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "vehicles")
public class Vehicle extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "insurance_company_id")
    private Long insuranceCompanyId;

    @Column(name = "title")
    private String title;

    @Column(name = "year")
    private int year;

    @Column(name = "make")
    private String make;

    @Column(name = "model")
    private String model;

    // @Column(name = "trim")
    // private String trim;

    // public String getTrim() {
    // return trim;
    // }

    // public void setTrim(String trim) {
    // this.trim = trim;
    // }

    // @Column(name = "submodel")
    // private String submodel;

    // @Column(name = "engine_desc")
    // private String engineDesc;

    // public String getSubmodel() {
    // return submodel;
    // }

    // public void setSubmodel(String submodel) {
    // this.submodel = submodel;
    // }

    // public String getEngineDesc() {
    // return engineDesc;
    // }

    // public void setEngineDesc(String engineDesc) {
    // this.engineDesc = engineDesc;
    // }

    @Column(name = "color")
    private String color;

    public Long getInsuranceCompanyId() {
        return insuranceCompanyId;
    }

    public void setInsuranceCompanyId(Long insuranceCompanyId) {
        this.insuranceCompanyId = insuranceCompanyId;
    }

    // @Column(name = "engine")
    // private Double engine;
    // @Column(name = "transmission")
    // private String transmission;
    @Column(name = "description")
    private String description;

    @Column(name = "vin")
    private String vin;

    @Column(name = "plate")
    private String plate;

    @Column(name = "price")
    private float price;

    @Column(name = "supplyment_price")
    private float supplymentPrice = 0;

    @Column(name = "markup_precentage")
    private int markupPrecentage = 0;

    @Column(name = "discount_percentage")
    private int discountPercentage = 0;

    @Column(name = "comments")
    @Size(max = 2000)
    private String comments = "";

    @Column(name = "claim_number")
    private String claimNumber = "";

    @Column(name = "stock_number")
    private String stocknumber;

    @Column(name = "special")
    private boolean special = false;

    @Column(name = "archived")
    private boolean archived = false;

    @Column(name = "prior_damage", nullable = true)
    @Size(max = 1000)
    private String priorDamage = "";

    @Column(name = "paid")
    private boolean paid = false;

    @Column(name = "payment_status")
    private int paymentStatus = 0;

    @Column(name = "current_job_number")
    private int currentJobNumber = 0;

    @Column(name = "payment_method")
    private int paymentMethod = 0;

    @Column(name = "job_request_type")
    private int jobRequestType = 0;

    @Column(name = "approval_status")
    private int approvalStatus = 0;

    @Column(name = "status")
    private int status = 0;
    // 0: new
    // 1: approved
    // 2: teardown
    // 4: supplyment
    // 5: orderPart
    // 6:mechanic
    // 7:bodyworkRegular
    // 8:bodyworkFrameMachine
    // 9:painting
    // 10: putTogether
    // 11: delivered
    // 12: archived

    @Column(name = "view_count")
    private int viewCount = 0;

    @Column(name = "miles")
    private String miles;

    // @Column(name = "miles_out", nullable = true)
    // private String milesOut;
    @Column(name = "damages")
    private String damages;

    @Column(name = "location")
    private int location;

    @Column(name = "in_take_way")
    private int inTakeWay = 0;

    @Column(name = "key_location")
    private int keyLocation = 0; // employeeId

    @Column(name = "assigned_to")
    private int assignedTo = 0; // employeeId

    @Column(name = "service_manager")
    private int serviceManager = 0; // employeeId

    @Column(name = "target_date", nullable = true)
    private Date targetDate = new Date();

    @Column(name = "target_date_change_reason", nullable = true)
    private String targetDateChangeReason = "";

    @Column(name = "rental_date", nullable = true)
    private Date rentalDate = new Date();

    @Column(name = "token", length = 36)
    // @JsonIgnore
    private String token;

    @Transient
    private String reason;

    @Transient
    private String jobReqeustTypeString;

    @Transient
    private String statusString;

    @Transient
    private String lastUpdateObjectName;

    @Transient
    private String lastUpdateIconName;

    @Transient
    private VehicleHistory lastVehicleHistory;

    @Transient
    private List<VehicleHistory> vehicleHistories;

    @Transient
    private String employeeString;

    @Transient
    public String[] damageStrings;

    @Transient
    public List<Status> statuss;

    @Transient
    public List<Employee> employees;

    @Transient
    public List<Autopart> autoparts;

    @Transient
    public byte[] picByte;

    @Transient
    public int daysInShop;

    @Transient
    public int rentalCountDown;

    @Transient
    public int daysInShopPrecentage;

    @Transient
    public int daysWithLoaner;

    @Transient
    public int targetDateCountDown;

    @Transient
    public String serachString;

    @Transient
    public int searchCount;

    @Transient
    public List<Job> jobs = new ArrayList<Job>();

    @Transient
    public List<Job> jobs2 = new ArrayList<Job>();

    @Transient
    public List<Payment> payments = new ArrayList<Payment>();

    @Transient
    public List<Receipt> receipts = new ArrayList<Receipt>();

    @Column(name = "loaner_car_name")
    public String loanerCarName;

    @Column(name = "insurance_company")
    public String insuranceCompany;

    public String getLastUpdateIconName() {
        return lastUpdateIconName;
    }

    public int getServiceManager() {
        return serviceManager;
    }

    public void setServiceManager(int serviceManager) {
        this.serviceManager = serviceManager;
    }

    public List<VehicleHistory> getVehicleHistories() {
        return vehicleHistories;
    }

    public void setVehicleHistories(List<VehicleHistory> vechicleHistories) {
        this.vehicleHistories = vechicleHistories;
    }

    public void setJobs2(List<Job> jobs2) {
        this.jobs2 = jobs2;
    }

    public List<Job> getJobs2() {
        return jobs2;
    }

    public void setLastUpdateIconName(String lastUpdateIconName) {
        this.lastUpdateIconName = lastUpdateIconName;
    }

    public void setStatuss(List<Status> statuss) {
        this.statuss = statuss;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }

    public List<Status> getStatuss() {
        return statuss;
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    public VehicleHistory getLastVehicleHistory() {
        return lastVehicleHistory;
    }

    public void setLastVehicleHistory(VehicleHistory lastVehicleHistory) {
        this.lastVehicleHistory = lastVehicleHistory;
    }

    public String getLastUpdateObjectName() {
        return lastUpdateObjectName;
    }

    public void setLastUpdateObjectName(String lastUpdateObjectName) {
        this.lastUpdateObjectName = lastUpdateObjectName;
    }

    public void setJobReqeustTypeString(String jobReqeustTypeString) {
        this.jobReqeustTypeString = jobReqeustTypeString;
    }

    public void setStatusString(String statusString) {
        this.statusString = statusString;
    }

    public String getJobReqeustTypeString() {
        return jobReqeustTypeString;
    }

    public String getStatusString() {
        return statusString;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setRentalCountDown(int rentalCountDown) {
        this.rentalCountDown = rentalCountDown;
    }

    public int getRentalCountDown() {
        return rentalCountDown;
    }

    public void setPicByte(byte[] picByte) {
        this.picByte = picByte;
    }

    public String getClaimNumber() {
        return claimNumber;
    }

    public void setDaysInShop(int daysInShop) {
        this.daysInShop = daysInShop;
    }

    public void setDaysWithLoaner(int daysWithLoaner) {
        this.daysWithLoaner = daysWithLoaner;
    }

    public void setLoanerCarName(String loanerCarName) {
        this.loanerCarName = loanerCarName;
    }

    public byte[] getPicByte() {
        return picByte;
    }

    public int getDaysInShop() {
        return daysInShop;
    }

    public int getDaysWithLoaner() {
        return daysWithLoaner;
    }

    public String getLoanerCarName() {
        return loanerCarName;
    }

    @Column(name = "work_request")
    private String workRequest;

    @ManyToOne(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = true)
    // @JsonIgnore
    public Customer customer;

    @OneToMany(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, mappedBy = "vehicle")
    private Set<ImageModelVehicle> imageModels = new HashSet<>();

    @OneToMany(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, mappedBy = "vehicle")
    private Set<PdfFile> pdfFiles = new HashSet<>();

    @OneToMany(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, mappedBy = "vehicle")
    private Set<Supplement> supplements = new HashSet<>();

    @Transient
    public long showInSearchImageId;

    // @OneToMany(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, mappedBy =
    // "vehicle")
    // @ManyToMany(fetch = FetchType.LAZY)
    // @JoinTable(name = "vehicle_employees", joinColumns = @JoinColumn(name =
    // "vehicle_id"), inverseJoinColumns = @JoinColumn(name = "employee_id"))
    // @OneToMany(cascade = CascadeType.DETACH, fetch = FetchType.LAZY, mappedBy =
    // "vehicle")
    // @ManyToMany(fetch = FetchType.LAZY, cascade = {
    // CascadeType.MERGE,
    // CascadeType.PERSIST,
    // CascadeType.REFRESH,
    // CascadeType.DETACH })
    // @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST,
    // CascadeType.DETACH})
    // @JoinTable(name = "vehicle_services", joinColumns = @JoinColumn(name =
    // "vehicle_id"), inverseJoinColumns = @JoinColumn(name = "service_id"))
    // @OrderBy("name ASC")
    // @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.DETACH })
    // @ManyToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST,
    // CascadeType.REFRESH })
    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST,
            CascadeType.DETACH })
    @JoinTable(name = "vehicle_services", joinColumns = @JoinColumn(name = "vehicle_id"), inverseJoinColumns = @JoinColumn(name = "service_id"))
    // @JoinColumn(name = "service_id", nullable = false)
    @OrderBy("name ASC")
    private Set<Service> services = new HashSet<>();

    @Column(name = "sequence_number")
    private int sequenceNumber;

    public long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public int getYear() {
        return year;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    public String getDescription() {
        return description;
    }

    public String getVin() {
        return vin;
    }

    public String getPlate() {
        return plate;
    }

    public float getPrice() {
        return price;
    }

    public String getStocknumber() {
        return stocknumber;
    }

    public boolean isArchived() {
        return archived;
    }

    public int getStatus() {
        return status;
    }

    public int getViewCount() {
        return viewCount;
    }

    public String getMiles() {
        return miles;
    }

    public String getDamages() {
        return damages;
    }

    public String[] getDamageStrings() {
        return damageStrings;
    }

    public String getWorkRequest() {
        return workRequest;
    }

    public Customer getCustomer() {
        return customer;
    }

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public void setStocknumber(String stocknumber) {
        this.stocknumber = stocknumber;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

    public void setMiles(String miles) {
        this.miles = miles;
    }

    public void setDamages(String damages) {
        this.damages = damages;
    }

    public void setDamageStrings(String[] damageStrings) {
        this.damageStrings = damageStrings;
    }

    public void setWorkRequest(String workRequest) {
        this.workRequest = workRequest;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Set<ImageModelVehicle> getImageModels() {
        return imageModels;
    }

    public void setImageModels(Set<ImageModelVehicle> imageModels) {
        this.imageModels = imageModels;
    }

    public void setSearchCount(int searchCount) {
        this.searchCount = searchCount;
    }

    public void setPdfFiles(Set<PdfFile> pdfFiles) {
        this.pdfFiles = pdfFiles;
    }

    public void setShowInSearchImageId(long showInSearchImageId) {
        this.showInSearchImageId = showInSearchImageId;
    }

    public Set<PdfFile> getPdfFiles() {
        return pdfFiles;
    }

    public long getShowInSearchImageId() {
        return showInSearchImageId;
    }

    public void setDaysInShopPrecentage(int daysInShopPrecentage) {
        this.daysInShopPrecentage = daysInShopPrecentage;
    }

    public int getDaysInShopPrecentage() {
        return daysInShopPrecentage;
    }

    public String getInsuranceCompany() {
        return insuranceCompany;
    }

    public void setInsuranceCompany(String insuranceCompany) {
        this.insuranceCompany = insuranceCompany;
    }

    public Set<Service> getServices() {
        return services;
    }

    public void setServices(Set<Service> services) {
        this.services = services;
    }

    public String getSerachString() {
        return serachString;
    }

    public void setSerachString(String serachString) {
        this.serachString = serachString;
    }

    public int getLocation() {
        return location;
    }

    public void setLocation(int location) {
        this.location = location;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getComments() {
        return comments;
    }

    public boolean isSpecial() {
        return special;
    }

    public void setSpecial(boolean special) {
        this.special = special;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public void setPaymentStatus(int paymentSatus) {
        this.paymentStatus = paymentSatus;
    }

    public int getPaymentStatus() {
        return paymentStatus;
    }

    public int getJobRequestType() {
        return jobRequestType;
    }

    public void setJobRequestType(int jobRequestType) {
        this.jobRequestType = jobRequestType;
    }

    public int getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(int paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Date getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(Date targetDate) {
        this.targetDate = targetDate;
    }

    public List<Job> getJobs() {
        return jobs;
    }

    public void setJobs(List<Job> jobs) {
        this.jobs = jobs;
    }

    public String getPriorDamage() {
        return priorDamage;
    }

    public void setPriorDamage(String priorDamage) {
        this.priorDamage = priorDamage;
    }

    public int getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(int approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public int getInTakeWay() {
        return inTakeWay;
    }

    public void setInTakeWay(int inTakeWay) {
        this.inTakeWay = inTakeWay;
    }

    public int getKeyLocation() {
        return keyLocation;
    }

    public void setKeyLocation(int keyLocation) {
        this.keyLocation = keyLocation;
    }

    public float getSupplymentPrice() {
        return supplymentPrice;
    }

    public void setSupplymentPrice(float supplymentPrice) {
        this.supplymentPrice = supplymentPrice;
    }

    public int getMarkupPrecentage() {
        return markupPrecentage;
    }

    public void setMarkupPrecentage(int markupPrecentage) {
        this.markupPrecentage = markupPrecentage;
    }

    public int getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(int discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public void setClaimNumber(String claimNumber) {
        this.claimNumber = claimNumber;
    }

    public int getCurrentJobNumber() {
        return currentJobNumber;
    }

    public void setCurrentJobNumber(int currentJobNumber) {
        this.currentJobNumber = currentJobNumber;
    }

    public Date getRentalDate() {
        return rentalDate;
    }

    public void setRentalDate(Date rentalDate) {
        this.rentalDate = rentalDate;
    }

    public int getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(int assignedTo) {
        this.assignedTo = assignedTo;
    }

    public int getTargetDateCountDown() {
        return targetDateCountDown;
    }

    public void setTargetDateCountDown(int targetDateCountDown) {
        this.targetDateCountDown = targetDateCountDown;
    }

    public String getTargetDateChangeReason() {
        return targetDateChangeReason;
    }

    public void setTargetDateChangeReason(String targetDateChangeReason) {
        this.targetDateChangeReason = targetDateChangeReason;
    }

    public int getSearchCount() {
        return searchCount;
    }

    public String getEmployeeString() {
        return employeeString;
    }

    public void setEmployeeString(String employeeString) {
        this.employeeString = employeeString;
    }

    public Set<Supplement> getSupplements() {
        return supplements;
    }

    public void setSupplements(Set<Supplement> supplements) {
        this.supplements = supplements;
    }

}
