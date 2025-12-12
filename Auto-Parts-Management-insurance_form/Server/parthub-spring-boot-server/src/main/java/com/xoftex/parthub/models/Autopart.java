package com.xoftex.parthub.models;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "autoparts")
public class Autopart extends AuditModel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "token", length = 36)
    private String token;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "company_id")
    private Long companyId = 0L;

    @Column(name = "employee_id")
    private Long employeeId = 0L;

    @Column(name = "vehicle_id", nullable = true)
    private Long vehicleId;

    @Column(name = "purchase_order_id")
    private Long purchaseOrderId = 0L;

    @Column(name = "claim_id")
    private Long claimId = 0L;

    @Column(name = "vendor_id")
    private Long vendorId = 0L;

    @Column(name = "payment_method_id")
    private Long paymentMethodId = 0L;

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

    @Column(name = "engine")
    private Double engine;

    @Column(name = "transmission")
    private String transmission;

    @Column(name = "partName")
    private String partName;

    @Column(name = "location")
    private int location;

    @Column(name = "price")
    private float price;

    @Column(name = "sale_price", nullable = true)
    private float salePrice;

    @Column(name = "grade")
    private String grade;

    @Column(name = "shipping")
    private String shipping;

    @Column(name = "warranty")
    private String warranty;

    @Column(name = "stock_number")
    private String stocknumber;

    @Column(name = "comments")
    @Size(max = 2000)
    private String comments;

    @Column(name = "source")
    @Size(max = 1000)
    private String source;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "approved_at", nullable = true)
    private Date approvedAt;

    @Column(name = "approved_by", nullable = true)
    private long approvedBy = 0;

    @Column(name = "archived")
    private boolean archived = false;

    @Column(name = "ordered", nullable = true)
    private boolean ordered = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "ordered_at", nullable = true)
    private Date orderedAt;

    @Column(name = "received", nullable = true)
    private boolean received = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "received_at", nullable = true)
    private Date receivedAt;

    @Column(name = "returned", nullable = true)
    private boolean returned = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "returned_at", nullable = true)
    private Date returnedAt;

    @Column(name = "fitmented")
    private boolean fitmented = false;

    @Column(name = "published")
    private boolean published;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "posting_at", nullable = true)
    private Date postingAt;

    @Column(name = "status")
    private int status = 0; // 0: created 1: return 2: inventory archived is done with archived flag

    @Column(name = "purchase_status")
    private int purchaseStatus = 0; // 0: created 1: for approval 2: approved

    @Column(name = "view_count")
    private int viewCount = 0;

    @Column(name = "sequence_number")
    private int sequenceNumber;

    @Transient
    public String bussinessName;

    @Transient
    public String reason;

    @Transient
    public String bussinessUrl;

    @Transient
    public String phone;

    @Transient
    public String street;

    @Transient
    public String city;

    @Transient
    public String state;

    @Transient
    public String zip;

    @Transient
    public float lat;

    @Transient
    public float lng;

    @Transient
    private String userName;

    @Transient
    public int index;

    @Transient
    public List<Fitment> fitments;

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setPurchaseOrderId(Long purchaseOrderId) {
        this.purchaseOrderId = purchaseOrderId;
    }

    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }

    public void setFitments(List<Fitment> fitments) {
        this.fitments = fitments;
    }

    public Long getPurchaseOrderId() {
        return purchaseOrderId;
    }

    public Long getClaimId() {
        return claimId;
    }

    public List<Fitment> getFitments() {
        return fitments;
    }

    public void setReturned(boolean returned) {
        this.returned = returned;
    }

    public void setReturnedAt(Date returnedAt) {
        this.returnedAt = returnedAt;
    }

    public void setOrdered(boolean ordered) {
        this.ordered = ordered;
    }

    public boolean isReturned() {
        return returned;
    }

    public Date getReturnedAt() {
        return returnedAt;
    }

    public void setOrderedAt(Date orderedAt) {
        this.orderedAt = orderedAt;
    }

    public boolean isOrdered() {
        return ordered;
    }

    public Date getOrderedAt() {
        return orderedAt;
    }

    public void setReceived(boolean received) {
        this.received = received;
    }

    public void setReceivedAt(Date receivedAt) {
        this.receivedAt = receivedAt;
    }

    public boolean isReceived() {
        return received;
    }

    public Date getReceivedAt() {
        return receivedAt;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public String getStreet() {
        return street;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public void setSalePrice(float salePrice) {
        this.salePrice = salePrice;
    }

    public void setFitmented(boolean isFitment) {
        this.fitmented = isFitment;
    }

    public void setShowInSearchImageId(long showInSearchImageId) {
        this.showInSearchImageId = showInSearchImageId;
    }

    public void setInSavedItem(boolean inSavedItem) {
        this.inSavedItem = inSavedItem;
    }

    public void setSearchCount(int searchCount) {
        this.searchCount = searchCount;
    }

    public float getSalePrice() {
        return salePrice;
    }

    public long getShowInSearchImageId() {
        return showInSearchImageId;
    }

    public boolean isInSavedItem() {
        return inSavedItem;
    }

    public int getSearchCount() {
        return searchCount;
    }

    public void setPurchaseStatus(int purchaseStatus) {
        this.purchaseStatus = purchaseStatus;
    }

    public int getPurchaseStatus() {
        return purchaseStatus;
    }

    public void setApprovedBy(long approvedBy) {
        this.approvedBy = approvedBy;
    }

    public long getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedAt(Date approvalAt) {
        this.approvedAt = approvalAt;
    }

    public Date getApprovedAt() {
        return approvedAt;
    }

    public void setSource(String souce) {
        this.source = souce;
    }

    public String getSource() {
        return source;
    }

    public void setSequenceNumber(int sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public int getSequenceNumber() {
        return sequenceNumber;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getComments() {
        return comments;
    }

    public void setPaymentMethodId(Long paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public Long getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

    public int getViewCount() {
        return viewCount;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public boolean isArchived() {
        return archived;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public float getLat() {
        return lat;
    }

    public float getLng() {
        return lng;
    }

    public void setLat(float lat) {
        this.lat = lat;
    }

    public void setLng(float lng) {
        this.lng = lng;
    }

    @Transient
    public long showInSearchImageId;

    @Transient
    public boolean inSavedItem;

    @Transient
    public long distance;

    @Transient
    public int searchCount;

    public void setBussinessName(String bussinessName) {
        this.bussinessName = bussinessName;
    }

    public void setBussinessUrl(String bussinessUrl) {
        this.bussinessUrl = bussinessUrl;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getShipping() {
        return shipping;
    }

    public String getWarranty() {
        return warranty;
    }

    public String getBussinessName() {
        return bussinessName;
    }

    public String getBussinessUrl() {
        return bussinessUrl;
    }

    @Column(name = "partNumber")
    private String partNumber;

    @Column(name = "description")
    @Size(max = 2000)
    private String description;

    public void setShipping(String shipping) {
        this.shipping = shipping;
    }

    public void setWarranty(String warranty) {
        this.warranty = warranty;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStocknumber() {
        return stocknumber;
    }

    public void setStocknumber(String stockNumber) {
        this.stocknumber = stockNumber;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public void setDistance(long distance) {
        this.distance = distance;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZip() {
        return zip;
    }

    public long getDistance() {
        return distance;
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

    public void setEngine(Double engine) {
        this.engine = engine;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public void setPartName(String partName) {
        this.partName = partName;
    }

    public void setPartNumber(String partNumber) {
        this.partNumber = partNumber;
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

    public Double getEngine() {
        return engine;
    }

    public String getTransmission() {
        return transmission;
    }

    public String getPartName() {
        return partName;
    }

    public String getPartNumber() {
        return partNumber;
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "autopart")
    private Set<ImageModel> imageModels = new HashSet<>();

    public Autopart() {

    }

    public void setId(long id) {
        this.id = id;
    }

    public Autopart(String title, String description, boolean published) {
        this.title = title;
        this.description = description;
        this.published = published;
    }

    public long getId() {
        return id;
    }

    public Set<ImageModel> getImageModels() {
        return imageModels;
    }

    public String getTitle() {
        return title;
    }

    public void setImageModels(Set<ImageModel> imageModels) {
        this.imageModels = imageModels;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean isPublished) {
        this.published = isPublished;
    }

    @Override
    public String toString() {
        return "Autopart [id=" + id + ", title=" + title + ", desc=" + description + ", published=" + published + "]";
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public float getPrice() {
        return price;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Date getPostingAt() {
        return postingAt;
    }

    public void setPostingAt(Date postingAt) {
        this.postingAt = postingAt;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public boolean isFitmented() {
        return fitmented;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getUserName() {
        return userName;
    }

    // public String getTrim() {
    // return trim;
    // }

    // public void setTrim(String trim) {
    // this.trim = trim;
    // }

    public int getLocation() {
        return location;
    }

    public void setLocation(int location) {
        this.location = location;
    }
}
