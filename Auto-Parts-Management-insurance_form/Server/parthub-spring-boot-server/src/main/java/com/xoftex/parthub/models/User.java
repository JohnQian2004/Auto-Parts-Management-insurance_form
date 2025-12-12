package com.xoftex.parthub.models;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "username"),
    @UniqueConstraint(columnNames = "email")
})
public class User extends AuditModel {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String firstName;
  private String lastName;

  @NotBlank
  @Size(max = 50)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(max = 120)
  @JsonIgnore
  private String password;

  @Transient
  private String newPassword;

  @Transient
  private int counts;

  @Column(name = "employee_role_Id")
  private long employeeRoleId = 0;

  @Column(name = "verification_code", length = 36)
  @JsonIgnore
  private String verificationCode;

  @Column(name = "activated")
  // @JsonIgnore
  private boolean activated = false;

  @Column(name = "archived")
  private boolean archived = false;

  @Transient
  private String companyUuid = "";

  @Transient
  private String token = "";

  @Transient
  private String companyName = "";

  private long companyId = 0;

  private boolean partMarketOnly = false;

  private boolean allowAddCompany = false;
  private boolean allowAssignUser = false;
  private boolean allowAddEmployee = false;

  private boolean allowMainPage = false;
  // allow_archive_vehicle
  private boolean allowArchiveVehicle = false;

  private boolean shopDisplayUser = false;

  private boolean allowAddExpense = false;

  public boolean isShopDisplayUser() {
    return shopDisplayUser;
  }

  public void setShopDisplayUser(boolean shopDisplayUser) {
    this.shopDisplayUser = shopDisplayUser;
  }

  private boolean allowAddService = false;
  private boolean allowAddPayment = false;

  private boolean allowVerifyPayment = false;

  private boolean allowChangeJobTargetDate = false;

  private boolean allowUpdateJobStatus = false;

  private boolean allowUpdateUser = false;

  private boolean allowAddNotes = false;

  private boolean allowAddReceipt = false;
  private boolean allowAddCounterInvoice = false;

  private boolean allowAddAndUpdateVehicle = false;
  private boolean allowUpdateCustomerInfo = false;
  private boolean allowUpdateVehicleStatus = false;

  private boolean allowAddUpdateAutopart = false;

  private boolean allowAddUpdatePurchaseOrder = false;

  private boolean allowApproveRejectPurchaseOrder = false;

  private boolean allowAddUpdateEstimate = false;
  private boolean allowLockEstimate = false;
  private boolean allowUnlockEstimate = false;

  private boolean allowViewReport = false;
  private boolean allowAddAndUpdateReport = false;

  @Column(name = "stripe_customer_id")
  private String stripeCustomerId;

  public String getStripeCustomerId() {
    return stripeCustomerId;
  }

  public void setStripeCustomerId(String stripeCustomerId) {
    this.stripeCustomerId = stripeCustomerId;
  }

  public boolean isAllowViewReport() {
    return allowViewReport;
  }

  public void setAllowViewReport(boolean allowViewReport) {
    this.allowViewReport = allowViewReport;
  }

  public boolean isAllowAddAndUpdateReport() {
    return allowAddAndUpdateReport;
  }

  public void setAllowAddAndUpdateReport(boolean allowAddAndUpdateReport) {
    this.allowAddAndUpdateReport = allowAddAndUpdateReport;
  }

  public boolean isAllowArchiveVehicle() {
    return allowArchiveVehicle;
  }

  public void setAllowArchiveVehicle(boolean allowArchiveVehicle) {
    this.allowArchiveVehicle = allowArchiveVehicle;
  }

  public void setAllowMainPage(boolean allowMainPage) {
    this.allowMainPage = allowMainPage;
  }

  public void setSerachCount(int serachCount) {
    this.serachCount = serachCount;
  }

  public void setTotalCount(int totalCount) {
    this.totalCount = totalCount;
  }

  public void setTotalCountListed(long totalCountListed) {
    this.totalCountListed = totalCountListed;
  }

  public void setTotalCountArchived(long totalCountArchived) {
    this.totalCountArchived = totalCountArchived;
  }

  public boolean isAllowMainPage() {
    return allowMainPage;
  }

  public int getSerachCount() {
    return serachCount;
  }

  public int getTotalCount() {
    return totalCount;
  }

  public long getTotalCountListed() {
    return totalCountListed;
  }

  public long getTotalCountArchived() {
    return totalCountArchived;
  }

  public void setAllowAddUpdateEstimate(boolean allowAddUpdateEstimate) {
    this.allowAddUpdateEstimate = allowAddUpdateEstimate;
  }

  public boolean isAllowAddUpdateEstimate() {
    return allowAddUpdateEstimate;
  }

  public void setAllowLockEstimate(boolean allowlockEstimate) {
    this.allowLockEstimate = allowlockEstimate;
  }

  public void setAllowUnlockEstimate(boolean allowUnlockEstimate) {
    this.allowUnlockEstimate = allowUnlockEstimate;
  }

  public boolean isAllowLockEstimate() {
    return allowLockEstimate;
  }

  public boolean isAllowUnlockEstimate() {
    return allowUnlockEstimate;
  }

  public void setCompanyName(String companyName) {
    this.companyName = companyName;
  }

  public boolean isArchived() {
    return archived;
  }

  public String getCompanyName() {
    return companyName;
  }

  public void setCompanyUuid(String companyUuid) {
    this.companyUuid = companyUuid;
  }

  public String getCompanyUuid() {
    return companyUuid;
  }

  public void setArchived(boolean archived) {
    this.archived = archived;
  }

  public void setAllowAddUpdatePurchaseOrder(boolean allowAddUpdatePurchaseOrder) {
    this.allowAddUpdatePurchaseOrder = allowAddUpdatePurchaseOrder;
  }

  public void setAllowApproveRejectPurchaseOrder(boolean allowApproveRejectPurchaseOrder) {
    this.allowApproveRejectPurchaseOrder = allowApproveRejectPurchaseOrder;
  }

  public boolean isAllowAddUpdatePurchaseOrder() {
    return allowAddUpdatePurchaseOrder;
  }

  public boolean isAllowApproveRejectPurchaseOrder() {
    return allowApproveRejectPurchaseOrder;
  }

  public void setAllowAddAndUpdateVehicle(boolean allowAddAndUpdateVehicle) {
    this.allowAddAndUpdateVehicle = allowAddAndUpdateVehicle;
  }

  public void setAllowUpdateCustomerInfo(boolean allowUpdateCustomerInfo) {
    this.allowUpdateCustomerInfo = allowUpdateCustomerInfo;
  }

  public void setAllowUpdateVehicleStatus(boolean allowUpdateVehicleStatus) {
    this.allowUpdateVehicleStatus = allowUpdateVehicleStatus;
  }

  public boolean isAllowAddAndUpdateVehicle() {
    return allowAddAndUpdateVehicle;
  }

  public boolean isAllowUpdateCustomerInfo() {
    return allowUpdateCustomerInfo;
  }

  public boolean isAllowUpdateVehicleStatus() {
    return allowUpdateVehicleStatus;
  }

  public void setAllowAddCompany(boolean allowAddCompany) {
    this.allowAddCompany = allowAddCompany;
  }

  public void setAllowAssignUser(boolean allowAssignUser) {
    this.allowAssignUser = allowAssignUser;
  }

  public void setAllowAddEmployee(boolean allowAddEmployee) {
    this.allowAddEmployee = allowAddEmployee;
  }

  public void setAllowAddService(boolean allowAddService) {
    this.allowAddService = allowAddService;
  }

  public void setAllowUpdateJobStatus(boolean allowUpdateJobStatus) {
    this.allowUpdateJobStatus = allowUpdateJobStatus;
  }

  public void setAllowUpdateUser(boolean allowUpdateUser) {
    this.allowUpdateUser = allowUpdateUser;
  }

  public boolean isAllowAddCompany() {
    return allowAddCompany;
  }

  public boolean isAllowAssignUser() {
    return allowAssignUser;
  }

  public boolean isAllowAddEmployee() {
    return allowAddEmployee;
  }

  public boolean isAllowAddService() {
    return allowAddService;
  }

  public boolean isAllowUpdateJobStatus() {
    return allowUpdateJobStatus;
  }

  public boolean isAllowUpdateUser() {
    return allowUpdateUser;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

  @Size(max = 200)
  private String bussinessname;

  @Column(name = "bussiness_url")
  @Size(max = 200)
  private String bussinessUrl;

  @Size(max = 100)
  private String phone;

  @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinTable(name = "user_addresses", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "address_id"))
  private Set<Address> addresses = new HashSet<>();

  @Transient
  public int serachCount;

  @Transient
  public int totalCount;

  @Transient
  public long totalCountListed;

  @Transient
  public long totalCountArchived;

  public User() {
  }

  public User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  public String getVerificationCode() {
    return verificationCode;
  }

  public void setVerificationCode(String verificationCode) {
    this.verificationCode = verificationCode;
  }

  public boolean isActivated() {
    return activated;
  }

  public void setActivated(boolean activated) {
    this.activated = activated;
  }

  public String getPhone() {
    return phone;
  }

  public Set<Address> getAddresses() {
    return addresses;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public void setAddresses(Set<Address> addresses) {
    this.addresses = addresses;
  }

  public String getBussinessname() {
    return bussinessname;
  }

  public void setBussinessname(String bussinessname) {
    this.bussinessname = bussinessname;
  }

  public String getBussinessUrl() {
    return bussinessUrl;
  }

  public void setBussinessUrl(String bussinessUrl) {
    this.bussinessUrl = bussinessUrl;
  }

  public long getCompanyId() {
    return companyId;
  }

  public void setCompanyId(long companyId) {
    this.companyId = companyId;
  }

  public void setAllowChangeJobTargetDate(boolean allowChangeJobTargetDate) {
    this.allowChangeJobTargetDate = allowChangeJobTargetDate;
  }

  public boolean isAllowChangeJobTargetDate() {
    return allowChangeJobTargetDate;
  }

  public void setEmployeeRoleId(long employeeRoleId) {
    this.employeeRoleId = employeeRoleId;
  }

  public long getEmployeeRoleId() {
    return employeeRoleId;
  }

  public String getNewPassword() {
    return newPassword;
  }

  public void setNewPassword(String newPassword) {
    this.newPassword = newPassword;
  }

  public boolean isAllowAddPayment() {
    return allowAddPayment;
  }

  public void setAllowAddPayment(boolean allowAddPayment) {
    this.allowAddPayment = allowAddPayment;
  }

  public boolean isAllowAddNotes() {
    return allowAddNotes;
  }

  public void setAllowAddNotes(boolean allowAddNotes) {
    this.allowAddNotes = allowAddNotes;
  }

  public boolean isAllowAddReceipt() {
    return allowAddReceipt;
  }

  public void setAllowAddReceipt(boolean allowAddReceipt) {
    this.allowAddReceipt = allowAddReceipt;
  }

  public boolean isAllowAddCounterInvoice() {
    return allowAddCounterInvoice;
  }

  public void setAllowAddCounterInvoice(boolean allowAddCounterInvoice) {
    this.allowAddCounterInvoice = allowAddCounterInvoice;
  }

  public boolean isAllowAddUpdateAutopart() {
    return allowAddUpdateAutopart;
  }

  public void setAllowAddUpdateAutopart(boolean allowAddUpdateAutopart) {
    this.allowAddUpdateAutopart = allowAddUpdateAutopart;
  }

  public boolean isAllowVerifyPayment() {
    return allowVerifyPayment;
  }

  public void setAllowVerifyPayment(boolean allowVerifyPayment) {
    this.allowVerifyPayment = allowVerifyPayment;
  }

  public boolean isPartMarketOnly() {
    return partMarketOnly;
  }

  public void setPartMarketOnly(boolean partMarketOnly) {
    this.partMarketOnly = partMarketOnly;
  }

  public int getCounts() {
    return counts;
  }

  public void setCounts(int counts) {
    this.counts = counts;
  }

  public boolean isAllowAddExpense() {
    return allowAddExpense;
  }

  public void setAllowAddExpense(boolean allowAddExpense) {
    this.allowAddExpense = allowAddExpense;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }
}
