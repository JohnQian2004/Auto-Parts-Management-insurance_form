import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';
// import { ActivatedRoute } from '@angular/router';
// import { AutopartService } from '../_services/autopart.service';
import * as jsonData from '../../assets/car-list.json';
import { Brand } from '../models/brand.model';
import { AutoPart } from '../models/autopart.model';
// import { VehicleService } from '../_services/vehicle.service';
// import { ScrollService } from '../_services/scroll.service';
// import { SavedItemService } from '../_services/saveditem.service';
// import { Job } from '../models/job.model';
// import { JobService } from '../_services/job.service';
// import { GroupBy } from '../models/groupBy.model';
// import { VehicleHistoryService } from '../_services/vehicle.history.service';
// import { ServiceTypeService } from '../_services/service.type.service';
// import { VehicleHistory } from '../models/vehicle.history.model';
import { Config } from '../models/config.model';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// import { SequenceCarrier } from '../models/sequence.carrier.model';
// import { PaymentService } from '../_services/payment.service';
// import { Payment } from '../models/payment.model';
// import { CalendarOptions } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import { NoteService } from '../_services/note.service';
// import { Note } from '../models/note.model';
// import { ReceiptService } from '../_services/receipt.service';
// import { Receipt } from '../models/receipt.model';
// import { jsPDF } from "jspdf";
// import htmlToPdfmake from 'html-to-pdfmake';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AuthService } from '../_services/auth.service';
// import { PurchaseOrder } from '../models/purchase.order.model';
import { ReportCarrier } from '../models/report.carrier.model';
// import { CounterInvoice } from '../models/counter.invoice.model';
// import { CounterInvoiceItem } from '../models/counter.invoice.item.model';
// import { PurchaseOrderService } from '../_services/purchase.order.service';
// import { ZipToCityService } from '../_services/zip.to.city.service';
// import { CounterInvoiceService } from '../_services/counter.invoice.service';
import { Company } from '../models/company.model'
import { ImageModel } from '../models/imageModel.model';
import { CompanyService } from '../_services/company.service';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';
// import { Employee } from '../models/employee.model';
// import { EmployeeService } from '../_services/employee.service';
// import { ServiceService } from '../_services/service.service';
//import { Service } from '../models/service.model';
import { User } from '../models/user.model';
// import { Status } from '../models/status.model';
// import { StatusService } from '../_services/status.service';
// import { LocationService } from '../_services/location.service';
// import { Location } from '../models/location.model';
import { Router } from '@angular/router';
// import { PaymentStatus } from '../models/payment.status.model';
// import { PaymentStatusService } from '../_services/payment.status.service';
// import { JobRequestType } from '../models/job.request.type.model';
// import { JobRequestTypeService } from '../_services/job.request.type.service';
// import { PaymentMethod } from '../models/payment.method.model';
// import { PaymentMethodService } from '../_services/payment.method.service';
// import { ApprovalStatusService } from '../_services/approval.status.service';
// import { ApprovalStatus } from '../models/approval.status.model';
// import { EmployeeRole } from '../models/employee.role.model';
// import { EmployeeRoleService } from '../_services/employee.role.service';
// import { Role } from '../models/role.model';
// import { Address } from '../models/address.model';

// import { PaymentTypeService } from '../_services/payment.type.service';
// import { PaymentType } from '../models/payment.type.model';
import { Customer } from '../models/customer.model';
// import { CustomerService } from '../_services/custmer.service';
// import { error } from 'jquery';
// import { Insurancer } from '../models/insurancer.model';
// import { InsurancerService } from '../_services/insurancer.service';
// import { InTakeWay } from '../models/in.take.way.model';
// import { InTakeWayService } from '../_services/in.take.way.service';
import { SettingService } from '../_services/setting.service';
import { Setting } from '../models/setting.model';
// import { Rental } from '../models/rental.model';
// import { RentalService } from '../_services/rental.service';
// import { VendorService } from '../_services/vendor.service';
// import { Vendor } from '../models/vendor.model';
// import { Disclaimer } from '../models/disclaimer.model';
// import { DisclaimerService } from '../_services/disclaimer.service';
// import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
// import { ServiceType } from '../models/service.type.model';
import { FeedbackService } from '../_services/feedback.service';
import { Feedback } from '../models/feedback.model';


declare var bootstrap: any;

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, AfterViewInit {

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";

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


  users: User[] = new Array();
  user: User = new User();


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

  // config: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: '55rem',
  //   minHeight: '35rem',
  //   placeholder: 'Disclaimer text ...',
  //   translate: 'no',
  //   customClasses: [
  //     {
  //       name: "quote",
  //       class: "quote",
  //     },
  //     {
  //       name: 'redText',
  //       class: 'redText'
  //     },
  //     {
  //       name: "titleText",
  //       class: "titleText",
  //       tag: "h1",
  //     },
  //   ]
  // }

  // configSlogan: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: '10rem',
  //   minHeight: '10rem',
  //   placeholder: 'Slogan text ...',
  //   translate: 'no',
  //   customClasses: [
  //     {
  //       name: "quote",
  //       class: "quote",
  //     },
  //     {
  //       name: 'redText',
  //       class: 'redText'
  //     },
  //     {
  //       name: "titleText",
  //       class: "titleText",
  //       tag: "h1",
  //     },
  //   ]
  // }
  message1 = '';
  fileToUpload: any;
  imageUrl: any;
  selectedImage: any;
  headingName = "Item";
  headingDescription = "Description";
  headingQuantity = "Qty";
  headingAmount = "Price($)";
  headingSubtotal = "Subtotal";
  displayStyle = "none";
  messageReasonRejection = "";
  displayStyleMarket = "none";
  messageReasonMarket = "";
  formTitle: any = "Part Info";
  forPurchaseOrder: boolean = false;
  companyDefaultTaxRate: any = 0;
  imageModels: ImageModel[] = new Array();
  currantPageNumberInventory?: any;
  currantPageNumberArchived?: any;
  searchInputCounterInvoiceNumber?: any = "";
  searchInputAutopart?: any = "";
  searchInputAutopartInventory?: any = "";
  searchInputAutopartReceived?: any = "";
  searchInputAutopartArchived?: any = "";
  searchCountInventory?: any;
  totalCountInventory?: any;
  searchCountArchived?: any;
  totalCountArchived?: any;
  messageCountInventory?: any = "";
  messageCountArchived?: any = "";
  pageSizeInventory: number = 10;
  pageSizeArchived: number = 10;
  pagesInventory: number = 1;
  pagesArchived: number = 1;
  pagesArrayInventory: number[] = new Array();
  pagesArrayArchived: number[] = new Array();
  currentReceiptId: any;
  currentDate = new Date();
  reportCarrier: ReportCarrier = new ReportCarrier();
  step: any = 5;
  editModeCustomer: boolean = false;
  editModeVehicle: boolean = false;
  showAccordian: boolean = true;
  today: Date = new Date();
  searchInput: any = "";

  archived: boolean = false;
  showIt: boolean = true;

  selectedEmployee: any;

  currentJobId: any;



  cindexCustomer: number = 0;
  cindexCounterInvoice: number = 0;
  cindexAutopart: number = 0;
  messageAlert: any;
  messagePart: any = "";

  errorMessageCounterInvoiceSearch: any = "";
  warnMessageCounterInvoice: any = "Please select a customer";

  errorMessage: any = "";
  successMessage: any;

  successMessageVehicle: any;
  errorMessageVehicle: any;

  base64Image: any;

  vin: string = "ZPBUA1ZL9KLA00848";
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
  vehicle: any = {
    id: 0,
    year: 2023,
    make: "",
    model: "",
    color: "",
    miles: "",
    vin: "ZPBUA1ZL9KLA00848",
    workRequest: "",
    description: "",
    stocknumber: "",
    archived: false,
    userId: 0,
    customerId: 0,
    picByte: "",
    comments: "",
    special: false,
    customer: new Customer()
  };
  optionsYear: string[] = new Array();
  optionsMake: string[] = new Array();
  optionsModel: string[] = new Array();
  optionsColor: string[] = new Array();
  optionsStatus: string[] = ["Intake", "Approval", "In Shop->Tear Down", "Supplyment", "In Shop->Machenic", "In Shop->Body Work", "In Shop->Frame",
    "In Shop->Painting", "In Shop->Assemble", "Wash & Clean", "Waiting Payment", "Delivered"];
  optoinsLoaner: String[] = ["Auto Point", "Alamo", "Budget", "Enterprise", "Hertz", "NextCar"];
  optionsInsuranceCompany: String[] = ["$CASH", "AllState", "Farmers", "GEICO", "NationWide", "Progressive", "State Farm"];
  optionsDamage: string[] = ["LFB", "RFB", "LHF", "LFT", "LRT", "LRQP", "LRD", "LFD"];
  optionsLocation: string[] = ["Lot 1", "Lot 2", "Front", "Back", "In Shop", "Yard", "Others"]
  optionsShotCodes: string[] = new Array();
  optoinsVehicleHistoryType: string[] = new Array();
  damages: string[] = new Array();
  carList: any = jsonData;
  carListStringList: Brand[];



  showSearchVin: boolean = false;
  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/getImage';
  baseUrlResizeImage = this.config.baseUrl + '/getResize';
  displayStyleTargetReason = "none";
  messageTargetDateReason = "";
  targetDateOriginal: Date = new Date();


  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
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
    private eventBusService: EventBusService,
    private userService: UserService,
    private companyService: CompanyService,
    private settingService: SettingService,
    private storageService: StorageService,
    // private employeeService: EmployeeService,
    // private serviceService: ServiceService,
    // private statusService: StatusService,
    private router: Router,
    // private locationService: LocationService,
    // private insurancerService: InsurancerService,
    // private rentalService: RentalService,
    // private inTakeWayService: InTakeWayService,
    // private jobRequestTypeService: JobRequestTypeService,
    // private paymentStatusService: PaymentStatusService,
    // private paymentMethodService: PaymentMethodService,
    // private paymentTypeService: PaymentTypeService,
    // private employeeRoleService: EmployeeRoleService,
    // private approvalStatusService: ApprovalStatusService,
    // private customerService: CustomerService,
    // private vendorService: VendorService,
    // private disclaimerService: DisclaimerService,
    // private serviceTypeService: ServiceTypeService,

    private el: ElementRef,
    // private vehicleService: VehicleService,
    // private jobService: JobService,
    // private vehicleHistoryService: VehicleHistoryService,
    // private paymentService: PaymentService,
    // private autopartService: AutopartService,
    // private noteService: NoteService,
    // private receiptService: ReceiptService,
    private authService: AuthService,
    // private scrollService: ScrollService,
    // private savedItemService: SavedItemService,
    // private route: ActivatedRoute,
    // private elementRef: ElementRef,
    // private counterInvoiceService: CounterInvoiceService,
    // private zipToCityService: ZipToCityService,
    // private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    // private purchseOrderService: PurchaseOrderService,
    private feedbackService: FeedbackService

  ) {

    for (let i = 1950; i <= 2026; i++) {
      this.optionsYear.push("" + i);
    }

    this.optionsMake = this.config.optionsMake;

    this.optionsColor = [
      "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"
    ];

    this.optionsModel = [
      "not selected"
    ];

    this.carListStringList = [];

  }

  //declare var bootstrap: any;
  // ngAfterViewInit(): void {

  //   var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  //   var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  //     return new bootstrap.Tooltip(tooltipTriggerEl)
  //   })
  // }

  ngAfterViewInit(): void {

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    // this.addNewUser();
    try {
      console.log("ngAfterViewInit");
      // this.getCurrentUserFromUser(this.currentUser.id);
      // this.getAllUsers();
    } catch (e) {

    }
  }
  ngOnInit(): void {
    this.checkWindowWidth();
    //   this.getAllCustomerStartingPage(0, this.optionsLetter[0], this.pageSize);
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

    //console.log('Data', this.carList);
    this.carListStringList = this.carList as Brand[];


    for (var i = 0; i < this.carListStringList.length; i++) {
      //console.log('Data2', this.carListStringList[i].brand);
      //console.log('Data3', this.carListStringList[i].models);
    }

    this.optionsModel = [
      "not selected"
    ];





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

            $('.reminders-box').addClass("reminders-toggle");
            $('.main-content').removeClass("my-fluid-col");
            //this.getAllServiceTypes();
            this.getAllFeedbacks(0, this.pageSize);
            //this.getAllUsers();
            //this.getAllCompany();


          }
          if (this.currentUserUser.roles[i].name == 'ROLE_SHOP' || this.currentUserUser.roles[i].name == 'ROLE_RECYCLER') {

            this.getCompany(this.currentUserUser.companyId);
            //this.getSettings(this.currentUserUser.companyId);

          }
        }
      }
    })
  }

  feedbacks: Feedback[] = new Array();
  feedback: Feedback = new Feedback();
  // currantPageNumber?: any;
  // searchCount?: any
  // pageSize: number = 10;
  // pages: number = 1;

  // pagesArray: number[] = new Array();


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
        //this.getAllComponyEmployees(this.company.id);
        //this.getAllComponyUsers(this.company.id);
      }
    });

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
    for (let i = 0; i < this.user.roles.length; i++) {
      if (this.user.roles[i].name == 'ROLE_ADMIN') {

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
    }



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


  getUserById(userId: any): void {

    this.userService.getUserById(userId).subscribe({
      next: result => {
        console.log(result);
        this.user = result;

        if (this.user.companyId != 0) {
          //this.getAllComponyEmployees(this.user.companyId);
          //this.getAllComponyUsers(this.user.companyId);
          this.getSettings(this.user.companyId);

          //this.getAllNotes(this.user.companyId);
          //this.getProductionOverview();
          //this.searchVehicle(5);
        }

      }
    })

  }

  getSettings(companyId: any): void {

    this.settingService.getSetting(companyId).subscribe({
      next: result => {
        if (result) {

          this.setting = result;
          // this.employeeRoles = this.setting.employeeRoles;
          // this.jobRequestTypes = this.setting.JobRequestTypes;
          // this.paymentMethods = this.setting.paymentMethods;
          // this.approvalStatuss = this.setting.approvalStatuss;
          // this.paymentStatuss = this.setting.paymentStatuss;
          // this.services = this.setting.services;
          // this.locations = this.setting.locations;
          // this.insurancers = this.setting.insurancers;
          // this.inTakeWays = this.setting.inTakeWays;
          // this.statuss = this.setting.statuss;
          // this.paymentTypes = this.setting.paymentTypes;
          // this.rentals = this.setting.rentals;
          // this.disclaimers = this.setting.disclaimers;

          // for (let disclaimer of this.disclaimers) {
          //   if (disclaimer.isDefault == true) {
          //     this.disclaimerId = disclaimer.id;
          //     this.disclaimerText = disclaimer.text;
          //   }
          // }
          this.company = this.setting.company;
          this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
          this.companyDefaultTaxRate = this.company.taxRate;
        }
      }
    })
  }

  icons = ['car', 'car-side', 'car-on', 'car-tunnel', 'car-burst'];
  backgroundColors = ['alert-primary', 'alert-success', 'alert-secondary', 'alert-danger', 'alert-warning'];
  textColors = ['text-primary-abs', 'text-success', 'text-secondary', 'text-danger', 'text-warning'];
  activeIndex: number | null = null;


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

  resetUser(user: User): void {

    if (this.user.companyId != 0) {

      //  this.getAllComponyEmployees(this.user.companyId);
      this.getSettings(this.user.companyId);
      //this.getAllNotes(this.user.companyId);
      //this.searchVehicle(5);

    }
  }


  formatPhoneNumber(phoneNumberString: any): string {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');

    // Check if the cleaned number has an extension
    const hasExtension = cleaned.length > 10;

    if (hasExtension) {
      // Extract the main number and extension
      const mainNumber = cleaned.slice(0, 10);
      const extension = cleaned.slice(10);

      // Format with extension
      return `(${mainNumber.slice(0, 3)}) ${mainNumber.slice(3, 6)} ${mainNumber.slice(6)}-${extension}`;
    } else {
      // Format without extension
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }

    // Return an empty string if no valid format found
    return '';
  }


  onChange($event: any, make: string) {

    this.optionsModel = [
      "not selected", "asd"
    ];

    this.carListStringList = this.carList as Brand[];
    for (var i = 0; i < this.carListStringList.length; i++) {
      //console.log('Data2', this.carListStringList[i].brand);
      //console.log('Data3', this.carListStringList[i].models);
      if (this.carListStringList[i].brand == make) {
        this.optionsModel = this.carListStringList[i].models;
      }


    }

  }

  randomString(): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZABCDEFGHIJKLMNOPQRSTUVWXTZ';
    const stringLength = 7;
    let randomstring = '';
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      if (i == 3)
        randomstring += "-";
      else
        randomstring += chars.substring(rnum, rnum + 1);
    }

    return randomstring;
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

  deleteFeedback(): void {

    this.feedbackService.deleteFeedback(this.feedback.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllFeedbacks(0, this.pageSize);

      }
    })
  }

  errorMessageFeedback: any = "";

  replyFeedback(): void {
    console.log(this.feedback.comments);
    if (this.feedback.name == undefined) {
      this.errorMessageFeedback = "Please select a Category";
    }

    if (this.feedback.comments != null && this.feedback.comments.length < 2) {
      this.errorMessageFeedback = "Comments are too short";
    }

    if (this.feedback.comments != null && this.feedback.comments.length > 2000) {
      this.errorMessageFeedback = "Comments are too long";
    }

    if (this.feedback.reply != null && this.feedback.reply.length < 2) {
      this.errorMessageFeedback = "Reply are too short";
    }

    if (this.feedback.reply != null && this.feedback.reply.length > 2000) {
      this.errorMessageFeedback = "Reply are too long";
    }


    this.feedback.reason = "reply";

    this.feedbackService.createFeedback(this.user.id, this.feedback).subscribe({
      next: result => {
        this.feedback = result;
        console.log(result);
        if (this.feedback.id > 0) {
          this.errorMessageFeedback = "Submitted succesfully";
        }
      }
    })

  }

  getFeedbackDetail(feedback: any, index: any): void {

    this.feedback = feedback;
    this.cindex = index;
    this.errorMessageFeedback = "";

  }

  getAllFeedbacks(pageNumber: any, pageSize: any): void {

    this.currantPageNumber = pageNumber;

    var searchCarrier = {
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize
    }

    this.feedbackService.getAllFeedbacks(searchCarrier).subscribe({
      next: result => {
        console.log(result);
        this.feedbacks = result;

        if (this.feedbacks.length > 0) {
          //this.searchCount = 0;
          this.totalCount = this.feedbacks[0].totalCount;
          this.searchCount = this.feedbacks[0].searchCount;
          console.log(this.searchCount);
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

}
