import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Company } from '../models/company.model'
import { ImageModel } from '../models/imageModel.model';
import { CompanyService } from '../_services/company.service';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';
import { Employee } from '../models/employee.model';
import { EmployeeService } from '../_services/employee.service';
import { ServiceService } from '../_services/service.service';
import { Service } from '../models/service.model';
import { User } from '../models/user.model';
import { Status } from '../models/status.model';
import { StatusService } from '../_services/status.service';
import { LocationService } from '../_services/location.service';
import { Location } from '../models/location.model';
import { Router } from '@angular/router';
import { PaymentStatus } from '../models/payment.status.model';
import { PaymentStatusService } from '../_services/payment.status.service';
import { JobRequestType } from '../models/job.request.type.model';
import { JobRequestTypeService } from '../_services/job.request.type.service';
import { PaymentMethod } from '../models/payment.method.model';
import { PaymentMethodService } from '../_services/payment.method.service';
import { ApprovalStatusService } from '../_services/approval.status.service';
import { ApprovalStatus } from '../models/approval.status.model';
import { EmployeeRole } from '../models/employee.role.model';
import { EmployeeRoleService } from '../_services/employee.role.service';
import { Role } from '../models/role.model';
import { Address } from '../models/address.model';

import { PaymentTypeService } from '../_services/payment.type.service';
import { PaymentType } from '../models/payment.type.model';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../_services/custmer.service';
import { error } from 'jquery';
import { Insurancer } from '../models/insurancer.model';
import { InsurancerService } from '../_services/insurancer.service';
import { InTakeWay } from '../models/in.take.way.model';
import { InTakeWayService } from '../_services/in.take.way.service';
import { SettingService } from '../_services/setting.service';
import { Setting } from '../models/setting.model';
import { Rental } from '../models/rental.model';
import { RentalService } from '../_services/rental.service';
import { VendorService } from '../_services/vendor.service';
import { Vendor } from '../models/vendor.model';
import { Disclaimer } from '../models/disclaimer.model';
import { DisclaimerService } from '../_services/disclaimer.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-company-editor',
  templateUrl: './company-editor.component.html',
  styleUrls: ['./company-editor.component.css']
})
export class CompanyEditorComponent implements OnInit, AfterViewInit {

  currantPageNumber?: any;
  currantLetter?: any = 'A';

  searchCount?: any;
  totalCount?: any;

  pageSize: number = 10;
  pages: number = 1;
  showSearchByNmberForm: boolean = false;

  pagesArray: number[] = new Array();

  setting: Setting = new Setting();

  company: Company = new Company();
  companies: Company[] = new Array();

  services: Service[] = new Array();
  service: Service = new Service();

  statuss: Status[] = new Array();
  status: Status = new Service();

  locations: Location[] = new Array();
  location: Location = new Location();

  insurancers: Insurancer[] = new Array();
  insurancer: Insurancer = new Insurancer();

  inTakeWays: InTakeWay[] = new Array();
  inTakeWay: InTakeWay = new InTakeWay();

  vendors: Vendor[] = new Array();
  vendor: Vendor = new Vendor();

  disclaimers: Disclaimer[] = new Array();
  disclaimer: Disclaimer = new Disclaimer();

  paymentStatuss: PaymentStatus[] = new Array();
  paymentStatus: PaymentStatus = new PaymentStatus();

  jobRequestTypes: JobRequestType[] = new Array();
  jobRequestType: JobRequestType = new JobRequestType();

  rentals: Rental[] = new Array();
  rental: Rental = new Rental();

  approvalStatuss: ApprovalStatus[] = new Array();
  approvalStatus: ApprovalStatus = new ApprovalStatus();

  paymentMethods: PaymentMethod[] = new Array();
  paymentMethod: PaymentMethod = new PaymentMethod();

  paymentTypes: PaymentType[] = new Array();
  paymentType: PaymentType = new PaymentType();

  employeeRoles: EmployeeRole[] = new Array();
  employeeRole: EmployeeRole = new EmployeeRole();

  employee: Employee = new Employee();
  employees: Employee[] = new Array();

  users: User[] = new Array();
  user: User = new User();

  customers: Customer[] = new Array();
  customer: Customer = new Customer();


  role: any;

  optionsType: string[] = ["Body Mechanic", "Machenic", "Manager", "Owner", "Painter", "Preper", "Writer",];
  optionsStatus: string[] = ["Active", "Suspended", "Terminated"];
  optionsTitle: string[] = ["Miss", "Mr", "Mrs.", "Ms", "Others"];
  optionsLetter: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  cindex: any;

  message?: any = "";
  messageCompany?: any = "";
  messageUser?: any = "";
  messageEmployeeRole?: any = "";
  messageApprovalStatus?: any = "";
  messageInsurancer?: any = "";
  messageVendor?: any = "";

  messageInTakeWay?: any = "";
  messageDisclaimer?: any = "";
  messagePredefinedJobs?: any = "";
  messageVehicleStatus?: any = "";
  messageEmployee?:any = "";
  messageVehicleLocation?: any = "";
  messagePaymentStatus?: any = "";
  messagePaymentMethod?: any = "";
  messagePaymentType?: any = "";
  messageJobRequestType?: any = "";
  messageRental?: any = "";
  messageCustomer?: any = "";

  messageCount?: any = "";

  currentUser?: any;

  currentUserUser: User = new User();

  iconString?: any;

  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '55rem',
    minHeight: '35rem',
    placeholder: 'Disclaimer text ...',
    translate: 'no',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  }

  configSlogan: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '10rem',
    placeholder: 'Slogan text ...',
    translate: 'no',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  }

  constructor(
    private companyService: CompanyService,
    private settingService: SettingService,
    private storageService: StorageService,
    private employeeService: EmployeeService,
    private serviceService: ServiceService,
    private statusService: StatusService,
    private router: Router,
    private locationService: LocationService,
    private insurancerService: InsurancerService,
    private rentalService: RentalService,
    private inTakeWayService: InTakeWayService,
    private jobRequestTypeService: JobRequestTypeService,
    private paymentStatusService: PaymentStatusService,
    private paymentMethodService: PaymentMethodService,
    private paymentTypeService: PaymentTypeService,
    private employeeRoleService: EmployeeRoleService,
    private approvalStatusService: ApprovalStatusService,
    private customerService: CustomerService,
    private vendorService: VendorService,
    private disclaimerService: DisclaimerService,

    private userService: UserService
  ) {

  }
  ngAfterViewInit(): void {
    try {
      console.log("ngAfterViewInit");
      // this.getCurrentUserFromUser(this.currentUser.id);
      // this.getAllUsers();
    } catch (e) {

    }
  }
  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: data => {
        // this.content = data;
        this.currentUser = this.storageService.getUser();

        if (this.currentUser == null)
          this.router.navigate(['/login']);

        // this.getCompany(1);
        this.getCurrentUserFromUser(this.currentUser.id);
        //  this.getAllUsers();
        //  this.getAllCompany();
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            //this.content = res.message;
          } catch {
            //this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          //this.content = `Error with status: ${err.status}`;
        }
      }
    });

  }

  deleteEmployee(): void {

    this.employeeService.deleteEmployee(this.employee.id).subscribe({
      next: result => {
        console.log(result);
        this.getAllComponyEmployees(this.company.id);

      }
    })
  }

  deleteCustomer(customer: Customer): void {

    this.customerService.deleteCustomer(customer.id).subscribe({
      next: result => {

        this.getAllCustomerPage(this.currantPageNumber, this.pageSize);
      }
    })
  }

  getCurrentUserFromUser(userId: any): void {

    console.log("getCurrentUserFromUser");
    this.userService.getUserById(userId).subscribe({
      next: result => {

        console.log(result);
        this.currentUserUser = result;
        this.user = this.currentUserUser;
        for (let i = 0; i < this.currentUserUser.roles.length; i++) {
          if (this.currentUserUser.roles[i].name == 'ROLE_ADMIN') {

            this.getAllUsers();
            this.getAllCompany();


          }
          if (this.currentUserUser.roles[i].name == 'ROLE_SHOP' || this.currentUserUser.roles[i].name == 'ROLE_RECYCLER') {

            this.getCompany(this.currentUserUser.companyId);
            //this.getSettings(this.currentUserUser.companyId);

          }
        }
      }
    })
  }

  onSelectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          this.company.iconString = e.target.result;

          if (e.target.result.length > 400000)
            this.message = "This image is too large";
          else
            this.message = '';

          //this.company.icon = e.target.result;
          var img = new Image();
          img.src = e.target.result;

          img.addEventListener('load', function () {

            console.log(" width ", img.width);
            console.log(" height ", img.height);

          });


        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  createCompany(company: Company): void {
    console.log("createCompany");
    this.messageCompany = "";
    if (this.company.iconString != null && this.message.length < 10) {
      //this.company.iconString = this.iconString;
      this.companyService.createCompany(this.currentUser.id, company).subscribe({
        next: result => {

          console.log(result);
          this.company = result;
          this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
          this.messageCompany = "Successfully Updated";
        }, error: error => {
          this.messageCompany = "failed to Updat";
        }
      })
    } else {
      this.message = "Please select an icon image";
    }

  }

  resentRegistrationLink(): void {

    this.companyService.resentRegistrationLink(this.company.id).subscribe({
      next: result => {
        if (result) {
          const returnMsg = result;
          this.messageCompany = "Registration link is sent";
        }

      }
    })
  }

  createEmployee(employee: Employee): void {

    console.log("createEmployee");
    employee.companyId = this.company.id;

    if (employee.companyId == 0)
      this.message = "Please select a company";
    else {
      employee.companyId = this.company.id;


      this.employeeService.createEmployee(this.currentUser.id, employee).subscribe({
        next: result => {

          console.log(result);
          this.employee = result;
          this.getAllComponyEmployees(this.company.id);

        }
      })
    }

  }

  addNewService(): void {
    this.service = new Service();
  }

  addNewUser(): void {

    this.messageUser = "";
    this.user = new User();
    this.user.id = 0;
    this.user.companyId = this.company.id;
    var role: Role = new Role();
    role.name = "ROLE_USER";
    role.id = 1;
    this.user.roles.push(role);
    var address: Address = new Address();
    address.name = 'ADDRESS_TYPE_DEFAULT';
    this.user.addresses.push(address);

  }

  addNewStatus(): void {
    this.status = new Status();
    this.messageVehicleStatus = "";
  }

  addNewLocation(): void {
    this.location = new Location();
    this.messageVehicleLocation = "";
  }

  addNewInsurancer(): void {
    this.insurancer = new Insurancer();
    this.messageInsurancer = "";
  }

  addNewVendor(): void {
    this.vendor = new Vendor();
    this.messageVendor = "";
  }

  addNewRental(): void {
    this.rental = new Rental();
    this.messageRental = "";
  }

  addNewPaymentStatus(): void {
    this.paymentStatus = new PaymentStatus();
    this.messagePaymentStatus = "";
  }

  addNewPaymentMethod(): void {
    this.paymentMethod = new PaymentMethod();
    this.messagePaymentMethod = "";
  }

  addNewPaymentType(): void {
    this.paymentType = new PaymentType();
    this.messagePaymentType = "";
  }

  addNewEmployeeRole(): void {
    this.employeeRole = new EmployeeRole();
    this.messageEmployeeRole = "";
  }

  addNewJobRequestType(): void {
    this.jobRequestType = new JobRequestType();
  }

  addNewApprovalStatus(): void {
    this.approvalStatus = new ApprovalStatus();
    this.messageJobRequestType = "";
  }

  addNewInTakeWay(): void {
    this.inTakeWay = new InTakeWay();
    this.messageInTakeWay = "";
  }

  addNewDisclaimer(): void {
    this.disclaimer = new Disclaimer();
    this.messageDisclaimer = "";
  }

  createService(service: Service): void {

    service.companyId = this.company.id;

    this.serviceService.createService(this.currentUser.id, service).subscribe({
      next: result => {
        this.service = result;
        this.messagePredefinedJobs = "Successfully Updated";
        this.getAllService(this.company.id);
      }
    })
  }

  createJobRequestType(jobRequestType: JobRequestType): void {

    jobRequestType.companyId = this.company.id;

    this.jobRequestTypeService.createJobRequestType(this.currentUser.id, jobRequestType).subscribe({
      next: result => {
        this.jobRequestType = result;
        this.messageJobRequestType = "Successfully Updated";
        this.getAllJobRequestType(this.company.id);
      }
    })
  }

  createInTakeWay(inTakeWay: InTakeWay): void {

    inTakeWay.companyId = this.company.id;

    this.inTakeWayService.createInTakeWay(this.currentUser.id, inTakeWay).subscribe({
      next: result => {
        this.inTakeWay = result;
        this.messageInTakeWay = "Successfully Updated";
        this.getAllInTakeWay(this.company.id);
      }
    })
  }

  createDisclaimer(disclaimer: Disclaimer): void {

    disclaimer.companyId = this.company.id;

    if (disclaimer.id == 0 && this.disclaimers.length == 0)
      disclaimer.isDefault = true;

    if (disclaimer.id > 0 && this.disclaimers.length == 1)
      disclaimer.isDefault = true;

    this.disclaimerService.createDisclaimer(this.currentUser.id, disclaimer).subscribe({
      next: result => {
        this.disclaimer = result;
        this.messageDisclaimer = "Successfully Updated";
        this.getAllDisclaimer(this.company.id);
      }
    })
  }

  createEmployeeRole(employeeRole: EmployeeRole): void {

    employeeRole.companyId = this.company.id;

    this.employeeRoleService.createEmployeeRole(this.currentUser.id, employeeRole).subscribe({
      next: result => {
        this.employeeRole = result;
        this.messageEmployeeRole = "Successfully Updated";
        var hasIt = false;
        for (let employeeRole1 of this.employeeRoles) {
          if (employeeRole1.id == employeeRole.id) {
            employeeRole1 = this.employeeRole;
            hasIt = true;
          }
        }
        if (hasIt == false) {
          this.employeeRoles.push(this.employeeRole);
        }

      }
    })
  }

  getAllJobRequestType(companyId: any): void {

    this.jobRequestTypes = new Array();

    this.jobRequestTypeService.getAllCompanyJobRequestType(companyId).subscribe({
      next: result => {
        if (result)
          this.jobRequestTypes = result;
      }
    })
  }

  getAllInTakeWay(companyId: any): void {

    this.inTakeWays = new Array();

    this.inTakeWayService.getAllCompanyInTakeWay(companyId).subscribe({
      next: result => {
        if (result)
          this.inTakeWays = result;
      }
    })
  }

  getAllDisclaimer(companyId: any): void {

    this.disclaimers = new Array();

    this.disclaimerService.getAllCompanyDisclaimer(companyId).subscribe({
      next: result => {
        if (result)
          this.disclaimers = result;
      }
    })
  }



  getAllService(companyId: any): void {

    this.services = new Array();

    this.serviceService.getAllServices(companyId).subscribe({
      next: result => {
        if (result != null)
          this.services = result;
      }
    })
  }

  getAllCustomer(companyId: any): void {

    this.customers = new Array();

    this.customerService.getAllCustomers(companyId).subscribe({
      next: result => {
        if (result != null)
          this.customers = result;
      }
    })
  }

  formatPhoneNumber(phoneNumberString: any): string {
    var formattedNumber = "";
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      formattedNumber = '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return formattedNumber;
  }

  getAllCustomerPage(pageNumber: any, pageSize: any): void {

    this.currantPageNumber = pageNumber;
    this.messageCount = "";

    const data = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    this.showSearchByNmberForm = false;
    this.customerService.getAllCustomersWithPage(this.user.companyId, data).subscribe({
      next: result => {
        this.customers = result;
        if (this.customers.length > 0) {
          //this.searchCount = 0;
          this.totalCount = this.customers[0].totalCount;
          this.searchCount = this.customers[0].serachCount;
          this.messageCount = this.searchCount + " found from " + this.totalCount;
          this.pagesArray = new Array();
          this.pages = this.searchCount / pageSize;

          for (let i = 1; i < this.pages + 1; i++) {
            this.pagesArray.push(i);
          }
        }

      }
    })
  }

  getAllCustomerStartingPage(pageNumber: any, letter: any, pageSize: any): void {

    this.currantPageNumber = pageNumber;
    this.messageCount = "";
    this.currantLetter = letter;

    const data = {
      partName: letter,
      pageNumber: pageNumber,
      pageSize: pageSize

    };
    this.pagesArray = new Array();
    this.showSearchByNmberForm = false;
    this.customerService.getAllCustomersStringWithPage(this.user.companyId, data).subscribe({
      next: result => {
        this.customers = result;
        if (this.customers.length > 0) {
          //this.searchCount = 0;

          this.totalCount = this.customers[0].totalCount;
          this.searchCount = this.customers[0].serachCount;
          this.messageCount = this.searchCount + " found from " + this.totalCount;
          this.pagesArray = new Array();
          this.pages = this.searchCount / pageSize;

          for (let i = 1; i < this.pages + 1; i++) {
            this.pagesArray.push(i);
          }
        }

      }
    })
  }

  onSearchChangeCustomer($event: any): void {
    console.log($event.target.value);

    this.customers = new Array();
    this.pagesArray = new Array();

    this.customerService.searchCustomersByLastName(this.user.companyId, $event.target.value).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.customers = result;
          if (this.customers.length > 0) {
            this.totalCount = this.customers[0].totalCount;
            this.searchCount = this.customers[0].serachCount;
            this.messageCount = this.customers.length + " found";
          }
        }
      }
    })
  }



  getAllApprovalStatus(companyId: any): void {

    this.approvalStatuss = new Array();

    this.approvalStatusService.getAllCompanyApprovalStatus(companyId).subscribe({
      next: result => {
        if (result != null)
          this.approvalStatuss = result;
      }
    })
  }

  getAllStatus(companyId: any): void {

    this.statuss = new Array();

    this.statusService.getAllCompanyStatus(companyId).subscribe({
      next: result => {
        if (result)
          this.statuss = result;
      }
    })
  }

  getAllLocation(companyId: any): void {

    this.locations = new Array();

    this.locationService.getAllCompanyLocation(companyId).subscribe({
      next: result => {
        if (result)
          this.locations = result;
      }
    })
  }

  getAllInsurancer(companyId: any): void {

    this.insurancers = new Array();

    this.insurancerService.getAllCompanyInsurancer(companyId).subscribe({
      next: result => {
        if (result)
          this.insurancers = result;
      }
    })
  }

  getAllVendor(companyId: any): void {

    this.vendors = new Array();

    this.vendorService.getAllCompanyVendor(companyId).subscribe({
      next: result => {
        if (result)
          this.vendors = result;
      }
    })
  }

  getAllRental(companyId: any): void {

    this.rentals = new Array();

    this.rentalService.getAllCompanyRental(companyId).subscribe({
      next: result => {
        if (result)
          this.rentals = result;
      }
    })
  }


  getAllPaymentStatus(companyId: any): void {

    this.paymentStatuss = new Array();

    this.paymentStatusService.getAllCompanyPaymentStatus(companyId).subscribe({
      next: result => {

        //console.log(result);
        if (result)
          this.paymentStatuss = result;
      }
    })
  }

  getAllPaymentType(companyId: any): void {

    this.paymentStatuss = new Array();

    this.paymentTypeService.getAllCompanyPaymentType(companyId).subscribe({
      next: result => {

        //console.log(result);
        if (result)
          this.paymentTypes = result;
      }
    })
  }

  getAllEmployeeRole(companyId: any): void {

    this.employeeRoles = new Array();

    this.employeeRoleService.getAllCompanyEmployeeRole(companyId).subscribe({
      next: result => {

        //console.log(result);
        if (result)
          this.employeeRoles = result;
      }
    })
  }

  getAllPaymentMethod(companyId: any): void {

    this.paymentMethods = new Array();

    this.paymentMethodService.getAllCompanyPaymentmethod(companyId).subscribe({
      next: result => {

        //console.log(result);
        if (result)
          this.paymentMethods = result;
      }
    })
  }

  createStatus(status: Status): void {

    status.companyId = this.company.id;

    this.statusService.createStatus(this.currentUser.id, status).subscribe({
      next: result => {
        this.status = result;
        this.messageVehicleStatus = "Successfully Updated";
        this.getAllStatus(this.company.id);
      }
    })
  }

  createLocation(location: Location): void {

    location.companyId = this.company.id;

    this.locationService.createLocation(this.currentUser.id, location).subscribe({
      next: result => {
        this.status = result;
        this.messageVehicleLocation = "Successfully Updated";
        this.getAllLocation(this.company.id);
      }
    })
  }

  createInsurancer(insurancer: Insurancer): void {

    insurancer.companyId = this.company.id;

    this.insurancerService.createInsurancer(this.currentUser.id, insurancer).subscribe({
      next: result => {
        this.insurancer = result;
        this.messageInsurancer = "Successfully Updated";
        this.getAllInsurancer(this.company.id);
      }
    })
  }

  createVendor(vendor: Vendor): void {

    vendor.companyId = this.company.id;

    this.vendorService.createVendor(this.currentUser.id, vendor).subscribe({
      next: result => {
        this.vendor = result;
        this.messageVendor = "Successfully Updated";
        this.getAllVendor(this.company.id);
      }
    })
  }

  createRental(rental: Rental): void {

    rental.companyId = this.company.id;

    this.rentalService.createRental(this.currentUser.id, rental).subscribe({
      next: result => {
        this.insurancer = result;
        this.messageRental = "Successfully Updated";
        this.getAllRental(this.company.id);
      }
    })
  }


  createPaymentStatus(paymentStatus: PaymentStatus): void {

    paymentStatus.companyId = this.company.id;

    this.paymentStatusService.createPaymentStatus(this.currentUser.id, paymentStatus).subscribe({
      next: result => {
        this.paymentStatus = result;
        this.messagePaymentStatus = "Successfully Updated";
        this.getAllPaymentStatus(this.company.id);
      }
    })
  }

  createApprovalStatus(approvalStatus: ApprovalStatus): void {

    approvalStatus.companyId = this.company.id;

    this.approvalStatusService.createApprovalStatus(this.currentUser.id, approvalStatus).subscribe({
      next: result => {
        this.approvalStatus = result;
        this.messageApprovalStatus = "Successfully Updated"
        this.getAllApprovalStatus(this.company.id);
      }
    })
  }


  createPaymentMethod(paymentMethod: PaymentMethod): void {

    paymentMethod.companyId = this.company.id;

    this.paymentMethodService.createPaymentmethod(this.currentUser.id, paymentMethod).subscribe({
      next: result => {
        this.paymentMethod = result;
        this.messagePaymentMethod = "Successfully Updated";
        this.getAllPaymentMethod(this.company.id);
      }
    })
  }

  createPaymentType(paymentType: PaymentType): void {

    paymentType.companyId = this.company.id;

    this.paymentTypeService.createPaymentType(this.currentUser.id, paymentType).subscribe({
      next: result => {
        this.paymentType = result;
        this.messagePaymentType = "Successfully Updated";
        this.getAllPaymentType(this.company.id);
      }
    })
  }

  getServiceDetail(service: Service, index: any): void {

    this.service = service;
    this.cindex = index;
    this.messagePredefinedJobs = "";
  }

  getApprovalStatusDetail(approvalStatus: ApprovalStatus, index: any): void {

    this.approvalStatus = approvalStatus;
    this.cindex = index;
    this.messageApprovalStatus = "";
  }



  getLocationDetail(location: Location, index: any): void {

    this.location = location;
    this.cindex = index;
    this.messageVehicleLocation = "";
  }

  getInsurancerDetail(insurancer: Insurancer, index: any): void {

    this.insurancer = insurancer;
    this.cindex = index;
    this.messageInsurancer = "";
  }

  getVendorDetail(vendor: Vendor, index: any): void {

    this.vendor = vendor;
    this.cindex = index;
    this.messageVendor = "";
  }


  getRentalDetail(rental: Rental, index: any): void {

    this.rental = rental;
    this.cindex = index;
    this.messageRental = "";
  }

  getPaymentStatusDetail(paymentStatus: PaymentStatus, index: any): void {

    this.paymentStatus = paymentStatus;
    this.cindex = index;
    this.messagePaymentStatus = "";
  }

  getPaymentMethodDetail(paymentMethod: PaymentMethod, index: any): void {
    this.cindex = index;
    this.paymentMethod = paymentMethod;
    this.messagePaymentMethod = "";
  }

  getPaymentTypeDetail(paymentType: PaymentType, index: any): void {

    this.paymentType = paymentType;
    this.cindex = index;
    this.messagePaymentType = "";
  }

  getJobRequestTypeDetail(jobRequestType: JobRequestType, index: any): void {
    this.jobRequestType = jobRequestType;
    this.cindex = index;
    this.messageJobRequestType = "";
  }

  getInTakeWayDetail(inTakeWay: InTakeWay, index: any): void {
    this.inTakeWay = inTakeWay;
    this.cindex = index;
    this.messageInTakeWay = "";
  }

  getDisclaimerDetail(disclaimer: Disclaimer, index: any): void {
    this.disclaimer = disclaimer;
    this.cindex = index;
    this.messageDisclaimer = "";
  }




  getStatusDetail(status: Status, index: any): void {

    this.status = status;
    this.cindex = index;
    this.messageVehicleStatus = "";
  }


  getEmployeeDetail(employee: Employee, index:any): void {

    this.employee = employee;
    this.cindex = index;
    this.messageEmployee = "";

  }
  addNewEmployee() {

    this.employee = new Employee();
    this.messageEmployee = "";
  }

  getCompany(companyId: any): void {

    console.log("getCompany");
    //this.companies = new Array();
    this.companyService.getCompany(companyId).subscribe({
      next: result => {

        this.company = result;
        this.company.iconString = "data:image/jpeg;base64," + this.company.icon;

        if (this.companies.length == 0)
          this.companies.push(this.company);

        this.getSettings(this.company.id);
        // this.getAllEmployeeRole(this.company.id);
        // this.getAllComponyEmployees(this.company.id);
        // this.getAllService(this.company.id);
        // this.getAllStatus(this.company.id);
        // this.getAllLocation(this.company.id);
        // this.getAllInsurancer(this.company.id);
        // this.getAllInTakeWay(this.company.id);
        // this.getAllPaymentStatus(this.company.id);

        // this.getAllPaymentMethod(this.company.id);
        // this.getAllPaymentType(this.company.id);
        // this.getAllJobRequestType(this.company.id);
        // this.getAllApprovalStatus(this.company.id);
        this.getAllComponyEmployees(this.company.id);
        this.getAllComponyUsers(this.company.id);
      }
    });

  }

  getSettings(companyId: any): void {

    this.settingService.getSetting(companyId).subscribe({
      next: result => {
        if (result) {

          this.setting = result;
          this.employeeRoles = this.setting.employeeRoles;
          this.jobRequestTypes = this.setting.JobRequestTypes;
          this.paymentMethods = this.setting.paymentMethods;
          this.approvalStatuss = this.setting.approvalStatuss;
          this.paymentStatuss = this.setting.paymentStatuss;
          this.services = this.setting.services;
          this.locations = this.setting.locations;
          this.insurancers = this.setting.insurancers;
          this.inTakeWays = this.setting.inTakeWays;
          this.statuss = this.setting.statuss;
          this.rentals = this.setting.rentals;
          this.vendors = this.setting.vendors;
          this.disclaimers = this.setting.disclaimers;
          this.paymentTypes = this.setting.paymentTypes;
          this.company = this.setting.company;
          this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
        }
      }
    })
  }

  getAllComponyUsers(companyId: any): void {

    this.userService.getAllCompanyUsers(this.company.id).subscribe({
      next: result => {
        this.users = result;
      }
    });
  }

  getAllComponyEmployees(companyId: any): void {

    this.employees = new Array();
    this.employeeService.getComponyEmployees(this.company.id).subscribe({
      next: result => {
        if (result)
          this.employees = result;
      }
    });
  }

  deleteUser(user: User): void {

    this.userService.deleteUser(this.currentUser.id, user.id).subscribe({
      next: result => {
        console.log(result);
        this.getAllComponyUsers(this.company.id);
      }
    })
  }

  shallDisplay(): boolean {

    if (this.currentUserUser.roles && this.currentUserUser.roles[0].name == "ROLE_ADMIN")
      return true;
    else
      return false;
  }
  getAllCompany(): void {

    this.companyService.getAllCompany().subscribe({
      next: result => {

        console.log(result);
        this.companies = result;
        for (let i = 0; i < this.companies.length; i++) {
          this.companies[i].iconString = "data:image/jpeg;base64," + this.company.icon;
        }

      }
    });

  }

  getDetail(company: Company): void {
    // this.company = company;
    // this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
    this.getCompany(company.id);
  }

  deleteCompany(company: Company) {

    // this.companyService.deleteCompany(company.id).subscribe({
    //   next: result => {
    //     console.log(result);
    //     this.getAllCompany();

    //   }
    // })
  }

  addNew(): void {

    this.company = new Company();
  }

  getAllUsers(): void {

    this.userService.getAllUsers(this.currentUser.id).subscribe({
      next: result => {

        console.log(result);
        if (result)
          this.users = result;
        if (this.users.length > 0)
          this.user = this.users[0];

      }
    })

  }

  deleteService(): void {

    this.serviceService.deleteService(this.service.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllService(this.company.id);

      }
    })
  }

  deleteStatus(): void {

    this.statusService.deleteStatus(this.status.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllStatus(this.company.id);

      }
    })
  }


  deleteLocation(): void {

    this.locationService.deleteLocation(this.location.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllLocation(this.company.id);

      }
    })
  }

  deleteInsurancer(): void {

    this.insurancerService.deleteInsurancer(this.insurancer.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllInsurancer(this.company.id);

      }
    })
  }

  deleteVendor(): void {

    this.vendorService.deleteVendor(this.vendor.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllVendor(this.company.id);

      }
    })
  }


  deleteRental(): void {

    this.rentalService.deleteRental(this.rental.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllRental(this.company.id);

      }
    })
  }


  deleteEmployeeRole(): void {

    this.employeeRoleService.deleteEmployeeRole(this.employeeRole.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllEmployeeRole(this.company.id);

      }
    })
  }


  deletePaymentStatus(): void {

    this.paymentStatusService.deletePaymentStatus(this.paymentStatus.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllPaymentStatus(this.company.id);

      }
    })
  }

  deletePaymentMethod(): void {

    this.paymentMethodService.deletePaymentmethod(this.paymentMethod.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllPaymentMethod(this.company.id);

      }
    })
  }

  deletePaymentType(): void {

    this.paymentTypeService.deletePaymentType(this.paymentType.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllPaymentType(this.company.id);

      }
    })
  }


  deleteJobRequestType(): void {

    this.jobRequestTypeService.deleteJobRequestType(this.jobRequestType.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllJobRequestType(this.company.id);

      }
    })
  }

  deleteApprovalStatus(): void {

    this.approvalStatusService.deleteApprovalStatus(this.approvalStatus.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllApprovalStatus(this.company.id);

      }
    })
  }

  deleteInTakeWay(): void {

    this.inTakeWayService.deleteInTakeWay(this.inTakeWay.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllInTakeWay(this.company.id);

      }
    })
  }

  deleteDisclaimer(): void {

    this.disclaimerService.deleteDisclaimer(this.disclaimer.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllDisclaimer(this.company.id);

      }
    })
  }

  getJobRequestDetail(jobRequestType: any): void {

    this.jobRequestType = jobRequestType;
  }

  getEmployeeRoleDetail(employeeRole: any, index: any): void {

    this.employeeRole = employeeRole;
    this.cindex = index;
    this.messageEmployeeRole = "";

  }

  getUserDetail(user: any, index: any): void {

    this.user = user;
    this.role = this.user.roles[0];
    this.cindex = index;
    this.messageUser = "";
  }

  getCustomerDetail(customer: any, index: any): void {

    this.customer = customer;

    this.cindex = index;
    this.messageCustomer = "";
  }

  saveCustomer(customer: Customer): void {

    this.customerService.createCustomer(this.user.id, customer).subscribe({
      next: result => {
        this.customer = result;
        this.messageCustomer = "Successfully Updated";
      }
    })
  }

  saveUser(user: any): void {

    if (user.id == 0) {
      this.userService.AddNewUser(user.id, user).subscribe({
        next: result => {
          if (result.message != null) {
            this.messageUser = result.message;
          } else {
            console.log(result);
            this.messageUser = "Successfully Updated";

            this.user = result;
            var hasIt = false;
            for (let i = 0; i < this.users.length; i++) {
              if (this.user.id == this.users[i].id) {
                hasIt = true;
              }
            }
            if (!hasIt) {
              this.users.push(this.user);
            }
          }
        }
      })
    } else {


      this.userService.updateUser(user.id, user).subscribe({
        next: result => {
          if (result.message != null) {
            this.messageUser = result.message;

          } else {
            console.log(result);
            this.messageUser = "Successfully Updated";
            this.user = user;
            var hasIt = false;
            for (let i = 0; i < this.users.length; i++) {
              if (this.user.id == this.users[i].id) {
                hasIt = true;
              }
            }
            if (!hasIt) {
              this.users.push(this.user);
            }
          }
        }
      })
    }
  }
}
