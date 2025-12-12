import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';
import { ActivatedRoute } from '@angular/router';
import { AutopartService } from '../_services/autopart.service';
import * as jsonData from '../../assets/car-list.json';
import { Brand } from '../models/brand.model';
import { AutoPart } from '../models/autopart.model';
import { VehicleService } from '../_services/vehicle.service';
import { ScrollService } from '../_services/scroll.service';
import { SavedItemService } from '../_services/saveditem.service';
import { Job } from '../models/job.model';
import { JobService } from '../_services/job.service';
import { GroupBy } from '../models/groupBy.model';
import { VehicleHistoryService } from '../_services/vehicle.history.service';
import { VehicleHistory } from '../models/vehicle.history.model';
import { Config } from '../models/config.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { PaymentService } from '../_services/payment.service';
import { Payment } from '../models/payment.model';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NoteService } from '../_services/note.service';
import { Note } from '../models/note.model';
import { ReceiptService } from '../_services/receipt.service';
import { Receipt } from '../models/receipt.model';
import { jsPDF } from "jspdf";
import htmlToPdfmake from 'html-to-pdfmake';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AuthService } from '../_services/auth.service';
import { PurchaseOrder } from '../models/purchase.order.model';
import { ReportCarrier } from '../models/report.carrier.model';
import { CounterInvoice } from '../models/counter.invoice.model';
import { CounterInvoiceItem } from '../models/counter.invoice.item.model';
import { PurchaseOrderService } from '../_services/purchase.order.service';
import { ZipToCityService } from '../_services/zip.to.city.service';
import { CounterInvoiceService } from '../_services/counter.invoice.service';
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
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import { ItemType } from '../models/item.type.model';
import { ItemTypeService } from '../_services/item.type.service';
declare var bootstrap: any;
@Component({
  selector: 'app-item-type',
  templateUrl: './item-type.component.html',
  styleUrls: ['./item-type.component.css']
})
export class ItemTypeComponent implements OnInit, AfterViewInit {

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";



  setting: Setting = new Setting();

  company: Company = new Company();
  companies: Company[] = new Array();



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

  itemTypes: ItemType[] = new Array();
  itemType: ItemType = new ItemType();

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
  messageEmployee?: any = "";
  messageVehicleLocation?: any = "";
  messagePaymentStatus?: any = "";
  messagePaymentMethod?: any = "";
  messagePaymentType?: any = "";
  messageJobRequestType?: any = "";
  messageRental?: any = "";
  messageCustomer?: any = "";

  messageCount?: any = "";


  currentUserUser: User = new User();

  iconString?: any;

  htmlContent = '';



  currentUser: any;

  content?: string;

  form: any = {
    newPassword: null,
    newPasswordComfirmed: null,
    id: null,
    firstName: null,
    lastName: null,

    username: null,
    email: null,
    password: null,
    role: null,

    phone: null,

    message: null,
    bussinessname: null,
    street: null,
    city: null,
    state: null,
    zip: null

  };

  storageData: any = {
    id: null,
    activated: null,
    username: null,
    email: null,
    roles: [],
  };

  isSuccessful = false;
  isUpdateFailed = false;


  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      right: 'today,prev,next',
      center: 'title',
      left: 'dayGridMonth,dayGridWeek,dayGridDay' // user can switch between the two
    },
    contentHeight: 'auto',
    weekends: true,
    eventColor: 'white',

    eventClick: (info: any) => {
      info.jsEvent.preventDefault();
      if (info.event.url) {
        //console.log(info.event.url);
        //this.getDetailCalendar(info.event.url);
      }
    },
    eventDidMount: function (info) {
      if (info.event.extendedProps['background']) {
        info.el.style.background = info.event.extendedProps['background'];
      }
      if (info.event.extendedProps['color']) {
        info.el.style.color = info.event.extendedProps['color'];
      }
    },

  };


  filterOff: boolean = false;
  jobCompletedCount: any = 0;
  disclaimerId: any = 0;
  disclaimerText: any = "";
  currentPaymentId: any;
  cindexUserJob: number = 0;
  vehiclesJob: Vehicle[] = new Array();
  vehicleJob: Vehicle = new Vehicle();
  autopart?: AutoPart;
  currentEmplyeeId: any;
  vehicleJobsOnly: boolean = false;
  // userService: any;
  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private settingService: SettingService,
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService,
    private el: ElementRef,
    private renderer: Renderer2,
    private eventBusService: EventBusService,
    private itemTypeService: ItemTypeService
  ) {


  }
  ngAfterViewInit(): void {
    this.addNewUser();
    try {
      var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      })

      // this.getCurrentUserFromUser(this.currentUser.id);
      // this.getAllUsers();
    } catch (e) {

    }
  }
  ngOnInit(): void {
    this.checkWindowWidth();
    //this.getAllCustomerStartingPage(0, this.optionsLetter[0], this.pageSize);
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




    this.currentUser = this.storageService.getUser();
    if (this.currentUser == null) {
      this.router.navigate(['/login']);
    }
    if (this.currentUser.username) {

      this.userService.getUser(this.currentUser.username).subscribe({
        next: data => {
          //console.log("profile/user" + data);
          if (data != null) {
            this.currentUser = data;
            this.form.id = this.currentUser.id;
            this.form.password = "";
            this.form.newPassword = "";
            this.form.newPasswordComfirmed = "";
            this.form.firstName = this.currentUser.firstName;

            this.form.lastName = this.currentUser.lastName;

            this.form.username = this.currentUser.email;
            this.form.email = this.currentUser.email;
            this.form.phone = this.currentUser.phone;
            // this.form.password = this.currentUser.password;
            this.form.bussinessname = this.currentUser.bussinessname;

            for (var i = 0; i < this.currentUser.roles.length; i++) {
              this.form.role = this.currentUser.roles[i].name;
            }

            for (var i = 0; i < this.currentUser.addresses.length; i++) {
              this.form.street = this.currentUser.addresses[i].street;
              this.form.city = this.currentUser.addresses[i].city;
              this.form.state = this.currentUser.addresses[i].state;
              this.form.zip = this.currentUser.addresses[i].zip;
            }
          }
        },
        error: err => {
          if (err.error) {
            try {
              const res = JSON.parse(err.error);
              this.content = res.message;
            } catch {
              this.content = `Error with status: ${err.status} - ${err.statusText}`;
            }
          } else {
            this.content = `Error with status: ${err.status}`;
          }
        }
      });
    }

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

  getCurrentUserFromUser(userId: any): void {

    console.log("getCurrentUserFromUser");
    this.userService.getUserById(userId).subscribe({
      next: result => {

        console.log(result);
        this.currentUserUser = result;
        this.user = this.currentUserUser;

        if (this.user.partMarketOnly == true) {
          this.router.navigate(['/autoparts']);
        }

        if (this.user.shopDisplayUser == true) {
          this.router.navigate(['/shopdisplay']);
        }


        for (let i = 0; i < this.currentUserUser.roles.length; i++) {
          if (this.currentUserUser.roles[i].name == 'ROLE_ADMIN') {



          }
          if (this.currentUserUser.roles[i].name == 'ROLE_SHOP' || this.currentUserUser.roles[i].name == 'ROLE_RECYCLER') {

            this.getCompany(this.currentUserUser.companyId);
            //this.getSettings(this.currentUserUser.companyId);

          }
        }
      }
    })
  }

  deleteItemType(): void {

    this.itemTypeService.deleteItemType(this.itemType.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllItemType(this.company.id);

      }
    })
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
      }
    });

  }

  getSettings(companyId: any): void {

    this.settingService.getSetting(companyId).subscribe({
      next: result => {
        if (result) {

          this.setting = result;

          this.itemTypes = this.setting.itemTypes;
          this.company = this.setting.company;
          this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
        }
      }
    })
  }


  logout(): void {

    console.log(" logging out ");
    this.authService.logout().subscribe({

      next: res => {
        console.log(res);
        this.storageService.clean();
        //this.isLoggedIn = this.storageService.isLoggedIn();
        // this.isLoggedIn = false;
        //this.isLoggedIn= false;
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }




  toggleClass(): void {
    const mainContent = document.querySelector('.main-content');
    const mainContent2 = document.querySelector('.reminders-box');

    if (mainContent) {
      mainContent.classList.toggle('my-fluid-col');
    }
    if (mainContent2) {
      mainContent2.classList.toggle('reminders-toggle');
    }
  }


  reload(): void {

    this.isSuccessful = false;
  }


  checkWindowWidth(): void {
    const windowWidth = this.renderer.parentNode(this.el.nativeElement).clientWidth;

    if (windowWidth < 767) {
      $('.reminders-box').addClass("reminders-toggle");
      $('.main-content').removeClass("my-fluid-col");
    }
  }




  onSubmit(): void {
    const { id, username, email, password, role, phone, bussinessname, street, city, state, zip } = this.form;

    this.currentUser.firstName = this.form.firstName;
    this.currentUser.lastName = this.form.lastName;

    this.currentUser.username = this.form.email;
    this.currentUser.email = this.form.email;
    this.currentUser.phone = this.form.phone;
    this.currentUser.bussinessname = this.form.bussinessname;


    for (var i = 0; i < this.currentUser.addresses.length; i++) {
      this.currentUser.addresses[i].street = this.form.street;
      this.currentUser.addresses[i].city = this.form.city;
      this.currentUser.addresses[i].state = this.form.state;
      this.currentUser.addresses[i].zip = this.form.zip;
    }
    console.log(" updateUser ");
    this.userService.updateUser(this.currentUser.id, this.currentUser
    ).subscribe({
      next: data => {
        console.log("profile/user" + data);

        if (data.message != null) {
          this.errorMessageProfile = data.message;
          this.isUpdateFailed = true;
          this.isSuccessful = false;
          return;
        } else {
          this.currentUser = data;
        }


        this.form.id = this.currentUser.id;
        var currentUserName = this.storageService.getUser().username;
        if (this.form.username != currentUserName) {
          this.storageData.id = this.currentUser.id;
          this.storageData.username = this.currentUser.username;
          this.storageData.email = this.currentUser.email,
            this.storageData.roles.push(this.form.role);
          this.storageData.activated = true;

          var tests = this.storageService.getUser();
          this.storageService.saveUser(this.storageData);
          var tests2 = this.storageService.getUser();

          this.eventBusService.emit(new EventData('username', this.currentUser.username));
        }
        this.form.username = this.currentUser.username;
        this.form.firstName = this.currentUser.firstName;
        this.form.lastName = this.currentUser.lastName;
        this.form.email = this.currentUser.email;
        this.form.phone = this.currentUser.phone;
        // this.form.password = this.currentUser.password;
        this.form.bussinessname = this.currentUser.bussinessname;

        for (var i = 0; i < this.currentUser?.roles?.length; i++) {
          this.form.role = this.currentUser.roles[i].name;
        }

        for (var i = 0; i < this.currentUser?.addresses?.length; i++) {
          this.form.street = this.currentUser.addresses[i].street;
          this.form.city = this.currentUser.addresses[i].city;
          this.form.state = this.currentUser.addresses[i].state;
          this.form.zip = this.currentUser.addresses[i].zip;
        }
        this.isSuccessful = true;
        //this.isSignUpFailed = false;

      },
      error: err => {
        this.errorMessageProfile = err.error.message;
        this.isUpdateFailed = true;

      }
    });


  }

  changePasswordRequest(): void {

    if (this.form.password == this.form.newPassword) {
      this.errorMessageResetPassword = "Same password";
      return;
    }

    if (this.form.newPassword != this.form.newPasswordComfirmed) {
      this.errorMessageResetPassword = "New passward is not matching with the confirmed password";
      return;
    }

    var passwordChangeRequest = {
      oldPassword: this.form.password,
      newPassword: this.form.newPassword
    }

    console.log(" reset pasword ");
    this.userService.passwordChangeRequest(this.currentUser.id, passwordChangeRequest
    ).subscribe({
      next: data => {
        console.log("reset pasword response:" + data.message);

        this.errorMessageResetPassword = data.message;

      },
      error: err => {
        this.errorMessageResetPassword = err.error.message;
        this.isUpdateFailed = true;

      }
    });

  }

  addNewItemType(): void {
    this.itemType = new ItemType();
    this.messageItemType = "";
  }


  createItemType(itemType: ItemType): void {

    itemType.companyId = this.company.id;

    if (itemType.name == null || itemType.name == '') {
      this.messageItemType = "Item Type Name is required";
      return;
    }

    if (itemType.name != null && itemType.name != '' && itemType.name.length < 2) {

      this.messageItemType = "Item Type Name is too short";
      return;
    }

    if (itemType.name != null && itemType.name != '' && itemType.name.length > 255) {

      this.messageItemType = "Item Type Name is too long";
      return;
    }

    if (itemType.comments != null && itemType.comments != '' && itemType.comments.length < 2) {

      this.messageItemType = "Pament Method Comments are too short";
      return;
    }


    if (itemType.comments != null && itemType.comments != '' && itemType.comments.length > 255) {

      this.messageItemType = "Pament Method Comments are too long";
      return;
    }

    var newEntry: boolean = false;
    if (itemType.id == null || itemType.id == 0)
      newEntry = true;

    this.itemTypeService.createItemType(this.currentUser.id, itemType).subscribe({
      next: result => {
        this.itemType = result;
        if (newEntry == true)
          this.messageItemType = "Successfully Created";
        else
          this.messageItemType = "Successfully Updated";
        this.getAllItemType(this.company.id);
      }
    })
  }
  messageItemType: any = "";

  getItemTypeDetail(itemType: ItemType, index: any): void {

    this.itemType = itemType;
    this.cindex = index;
    this.messageItemType = "";
  }


  getAllItemType(companyId: any): void {

    this.itemTypes = new Array();

    this.itemTypeService.getAllCompanyItemType(companyId).subscribe({
      next: result => {

        //console.log(result);
        if (result)
          this.itemTypes = result;
      }
    })
  }
}
