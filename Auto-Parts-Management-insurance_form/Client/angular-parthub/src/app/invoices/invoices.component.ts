import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AutopartService } from '../_services/autopart.service';
import { SavedItemService } from '../_services/saveditem.service';
import { ScrollService } from '../_services/scroll.service';
import { StorageService } from '../_services/storage.service';
import { UserService } from '../_services/user.service';
import * as jsonData from '../../assets/car-list.json';
import { Brand } from '../models/brand.model';
import { AutoPart } from '../models/autopart.model';
import { DOCUMENT } from '@angular/common';
//import { data, map, type } from 'jquery';
import { VehicleService } from '../_services/vehicle.service';
import { Customer } from '../models/customer.model';

import html2canvas from 'html2canvas';

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

import { CompanyService } from '../_services/company.service';
import { EmployeeService } from '../_services/employee.service';
import { Company } from '../models/company.model';
import { Employee } from '../models/employee.model';
import { ServiceService } from '../_services/service.service';
import { Service } from '../models/service.model';
import { Job } from '../models/job.model';
import { JobService } from '../_services/job.service';
import { GroupBy } from '../models/groupBy.model';
import { CustomerService } from '../_services/custmer.service';
import { User } from '../models/user.model';
import { VehicleHistoryService } from '../_services/vehicle.history.service';
import { VehicleHistory } from '../models/vehicle.history.model';
import { Config } from '../models/config.model';
import { Status } from '../models/status.model';
import { StatusService } from '../_services/status.service';
import { LocationService } from '../_services/location.service';
import { Location } from '../models/location.model';
import { PaymentStatus } from '../models/payment.status.model';
import { PaymentStatusService } from '../_services/payment.status.service';
import { JobRequestTypeService } from '../_services/job.request.type.service';
import { JobRequestType } from '../models/job.request.type.model';
import { PaymentMethodService } from '../_services/payment.method.service';
import { PaymentMethod } from '../models/payment.method.model';
import { ApprovalStatusService } from '../_services/approval.status.service';
import { ApprovalStatus } from '../models/approval.status.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { PaymentTypeService } from '../_services/payment.type.service';
import { PaymentType } from '../models/payment.type.model';
import { PaymentService } from '../_services/payment.service';
import { Payment } from '../models/payment.model';
import { InsurancerService } from '../_services/insurancer.service';
import { Insurancer } from '../models/insurancer.model';
import { Note } from '../models/note.model';
import { NoteService } from '../_services/note.service';
import { ReportCarrier } from '../models/report.carrier.model';
import { InTakeWayService } from '../_services/in.take.way.service';
import { InTakeWay } from '../models/in.take.way.model';
import { SettingService } from '../_services/setting.service';
import { Setting } from '../models/setting.model';
import { Rental } from '../models/rental.model';
import { Receipt } from '../models/receipt.model';
import { ReceiptService } from '../_services/receipt.service';
import { CounterInvoiceService } from '../_services/counter.invoice.service';
import { CounterInvoice } from '../models/counter.invoice.model';
import { CounterInvoiceItem } from '../models/counter.invoice.item.model';
import { Vendor } from '../models/vendor.model';
import { ImageModel } from '../models/imageModel.model';
import { Disclaimer } from '../models/disclaimer.model';
import { ZipToCityService } from '../_services/zip.to.city.service';
import { PurchaseOrderService } from '../_services/purchase.order.service';
import { PurchaseOrder } from '../models/purchase.order.model';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EmployeeRole } from '../models/employee.role.model';
import { jsPDF } from "jspdf";
import htmlToPdfmake from 'html-to-pdfmake';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AuthService } from '../_services/auth.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
declare var bootstrap: any;

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // console.log(event.target.innerWidth);
  }

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";

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
  currantPageNumber?: any;
  currantPageNumberInventory?: any;
  currantPageNumberArchived?: any;
  searchInputCounterInvoiceNumber?: any = "";
  searchInputAutopart?: any = "";
  searchInputAutopartInventory?: any = "";
  searchInputAutopartReceived?: any = "";
  searchInputAutopartArchived?: any = "";
  searchCount?: any;
  totalCount?: any;
  messageCount?: any = "";
  searchCountInventory?: any;
  totalCountInventory?: any;
  searchCountArchived?: any;
  totalCountArchived?: any;
  messageCountInventory?: any = "";
  messageCountArchived?: any = "";
  pageSize: number = 10;
  pages: number = 1;
  pageSizeInventory: number = 10;
  pageSizeArchived: number = 10;
  pagesInventory: number = 1;
  pagesArchived: number = 1;
  showSearchByNmberForm: boolean = false;
  pagesArray: number[] = new Array();
  pagesArrayInventory: number[] = new Array();
  pagesArrayArchived: number[] = new Array();
  setting: Setting = new Setting();
  company: Company = new Company();
  currentReceiptId: any;
  currentDate = new Date();
  reportCarrier: ReportCarrier = new ReportCarrier();
  step: any = 5;
  editModeCustomer: boolean = false;
  editModeVehicle: boolean = false;
  showAccordian: boolean = true;
  today: Date = new Date();
  searchInput: any = "";
  vehicleHistories: VehicleHistory[] = new Array();
  showVehicleHistory: boolean = false;
  archived: boolean = false;
  user: User = new User();
  users: User[] = new Array();
  showIt: boolean = true;
  statusOverview: GroupBy[] = new Array();
  locationOverview: GroupBy[] = new Array();
  customer: Customer = new Customer();
  customers: Customer[] = new Array();
  companies: Company[] = new Array();
  employees: Employee[] = new Array();
  services: Service[] = new Array();
  service: Service = new Service();
  statuss: Status[] = new Array();
  status: Status = new Service();
  locations: Location[] = new Array();
  location: Location = new Location();
  insurancers: Insurancer[] = new Array();
  insurancer: Insurancer = new Insurancer();
  vendors: Vendor[] = new Array();
  vendor: Vendor = new Vendor();
  disclaimers: Disclaimer[] = new Array();
  disclaimer: Disclaimer = new Disclaimer();

  inTakeWays: InTakeWay[] = new Array();
  inTakeWay: InTakeWay = new InTakeWay();
  paymentStatuss: PaymentStatus[] = new Array();
  paymentStatus: PaymentStatus = new PaymentStatus();

  paymentMethods: PaymentMethod[] = new Array();
  paymentMethod: PaymentMethod = new PaymentMethod();

  paymentTypes: PaymentType[] = new Array();
  paymentType: PaymentType = new PaymentType();

  jobRequestTypes: JobRequestType[] = new Array();
  jobRequestType: JobRequestType = new JobRequestType();

  counterInvoices: CounterInvoice[] = new Array();
  counterInvoice: CounterInvoice = new CounterInvoice();

  counterInvoiceItems: CounterInvoiceItem[] = new Array();
  counterInvoiceItem: CounterInvoiceItem = new CounterInvoiceItem();

  rentals: Rental[] = new Array();
  rental: Rental = new Rental();

  receipts: Receipt[] = new Array();
  receipt: Receipt = new Receipt();

  approvalStatuss: ApprovalStatus[] = new Array();
  approvalStatus: ApprovalStatus = new ApprovalStatus();

  notes: Note[] = new Array();
  note: Note = new Note();

  selectedEmployee: any;

  currentJobId: any;

  serviceJobs: Service[] = new Array();

  job: Job = new Job();
  jobs: Job[] = new Array();

  payment: Payment = new Payment();
  payments: Payment[] = new Array();

  cindex: number = 0;
  cindexCustomer: number = 0;
  cindexCounterInvoice: number = 0;
  cindexAutopart: number = 0;
  message: any;
  messageAlert: any;
  messagePart: any = "";

  errorMessageCounterInvoiceSearch: any = "";
  warnMessageCounterInvoice: any = "Please select a customer";
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
  errorMessage: any;
  successMessage: any;

  successMessageVehicle: any;
  errorMessageVehicle: any;

  base64Image: any;

  vin: string = "ZPBUA1ZL9KLA00848";
  vehicles: Vehicle[] = new Array();
  vehiclesToday: Vehicle[] = new Array();

  vehiclesOriginal: Vehicle[] = new Array();

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
  optionsTitle: string[] = ["Miss", "Mr", "Mrs.", "Ms", "Others"]
  optionsShotCodes: string[] = new Array();
  optoinsVehicleHistoryType: string[] = new Array();
  damages: string[] = new Array();
  carList: any = jsonData;
  carListStringList: Brand[];
  autopart: AutoPart = new AutoPart();
  autopartReturned: AutoPart = new AutoPart();

  autoparts: AutoPart[] = new Array();
  autopartsInventory: AutoPart[] = new Array();
  autopartsArchived: AutoPart[] = new Array();
  purchaseOrders: PurchaseOrder[] = new Array();
  purchaseOrder: PurchaseOrder = new PurchaseOrder();
  showSearchVin: boolean = false;
  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/getImage';
  baseUrlResizeImage = this.config.baseUrl + '/getResize';
  displayStyleTargetReason = "none";
  messageTargetDateReason = "";
  targetDateOriginal: Date = new Date();
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
        this.getDetailCalendar(info.event.url);
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

  calendarOptionsJob1: CalendarOptions = {
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

    droppable: true,

    eventClick: (info: any) => {
      info.jsEvent.preventDefault();
      if (info.event.url) {
        //console.log(info.event.url);
        this.getDetailCalendar(info.event.url);
      }
      if (info.event.groupId) {
        //console.log(info.event.url);
        this.setJobId(info.event.groupId);
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
  employeeRoles: EmployeeRole[] = new Array();
  employeeRole: EmployeeRole = new EmployeeRole();
  currentPaymentId: any;
  cindexUserJob: number = 0;
  vehiclesJob: Vehicle[] = new Array();
  vehicleJob: Vehicle = new Vehicle();
  currentEmplyeeId: any;
  vehicleJobsOnly: boolean = false;
  disclaimerId?: any;
  disclaimerText?: any;


  constructor(
    private eventBusService: EventBusService,
    private userService: UserService,
    private storageService: StorageService,
    private router: Router,
    private el: ElementRef,
    private vehicleService: VehicleService,
    private employeeService: EmployeeService,
    private serviceService: ServiceService,
    private jobService: JobService,
    private customerService: CustomerService,
    private vehicleHistoryService: VehicleHistoryService,
    private statusService: StatusService,
    private locationService: LocationService,
    private paymentStatusService: PaymentStatusService,
    private paymentMethodService: PaymentMethodService,
    private paymentTypeService: PaymentTypeService,
    private paymentService: PaymentService,
    private jobRequestTypeService: JobRequestTypeService,
    private approvalStatusService: ApprovalStatusService,
    private autopartService: AutopartService,
    private settingService: SettingService,
    private noteService: NoteService,
    private receiptService: ReceiptService,
    private authService: AuthService,
    private scrollService: ScrollService,
    private savedItemService: SavedItemService,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private companyService: CompanyService,
    private insurancerService: InsurancerService,
    private inTakeWayService: InTakeWayService,
    private counterInvoiceService: CounterInvoiceService,
    private zipToCityService: ZipToCityService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private purchseOrderService: PurchaseOrderService
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


  ngAfterViewInit(): void {


    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    // var s1 = document.createElement("script");
    // s1.type = "text/javascript";
    // s1.src = "../../assets/test.js";
    // this.elementRef.nativeElement.appendChild(s1);

    this.refresh();

    if (this.currentUser != null) {
      this.getUserById(this.currentUser.id);
    }
    setTimeout(() => {

      try {
        if (this.currentUser != null) {
          this.getUserById(this.currentUser.id);
        }
      } catch (ex) { }
    }, 50);


  }

  refresh(): void {

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 400);

  }

  ngOnInit(): void {



    this.checkWindowWidth();
    this.userService.getPublicContent().subscribe({
      next: data => {
        // this.content = data;
        this.currentUser = this.storageService.getUser();
        try {
          if (this.currentUser != null) {
            this.getUserById(this.currentUser.id);
          } else {
            this.router.navigate(['/login']);
          }
        } catch (ex) { }

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


    // var s1 = document.createElement("script");
    // s1.type = "text/javascript";
    // s1.src = "../../assets/jquery.imagemapster.js";
    // this.elementRef.nativeElement.appendChild(s1);

    // var s1 = document.createElement("script");
    // s1.type = "text/javascript";
    // s1.src = "../../assets/test.js";
    // this.elementRef.nativeElement.appendChild(s1);

    if (!this.config.consoleLog) {
      console.log = function () { }
    }


    this.userService.getPublicContent().subscribe({
      next: data => {
        // this.content = data;
        this.currentUser = this.storageService.getUser();
        try {
          if (this.currentUser != null) {
            //this.storageService.saveUser(this.currentUser);
            this.getUserById(this.currentUser.id);
          } else {
            this.router.navigate(['/login']);
          }
        } catch (ex) { }

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

  getMyJobs(userId: any): void {

    this.currentEmplyeeId = userId;
    this.vehicleJobsOnly = false;

    this.jobService.getAllJobsForUser(userId).subscribe({
      next: result => {
        this.vehiclesJob = result;
        if (result) {
          if (this.vehiclesJob.length > 0) {

            this.filterVehicleJobs();

          }
        } else {
          this.vehiclesJob = new Array();
          this.calendarOptionsJob1 = {
            plugins: [dayGridPlugin],
            initialView: 'dayGridMonth',
            weekends: true,
            events: new Array(),
          };
        }

      }
    })
  }

  setWeek($event: any) {
    console.log($event.target.value);
    var year = $event.target.value.substring(0, 4);
    var week = $event.target.value.substring(6);

    week = +week;

    console.log("year " + year + " week " + week);
    var from = this.weekToDate(year, week);
    var to = this.weekToDate(year, week + 1);
    to.setDate(to.getDate() - 1);
    console.log(from);
    console.log(to);
  }

  weekToDate(year: any, week: any) {

    // Create a date for 1 Jan in required year
    var d = new Date(year, 0);
    // Get day of week number, sun = 0, mon = 1, etc.
    var dayNum = d.getDay();
    // Get days to add
    var requiredDate = --week * 7;

    // For ISO week numbering
    // If 1 Jan is Friday to Sunday, go to next week 
    if (dayNum != 0 || dayNum > 4) {
      requiredDate += 7;
    }

    // Add required number of days
    d.setDate(1 - d.getDay() + ++requiredDate);
    return d;
  }

  filterVehicleJobs(): void {

    if (this.vehiclesJob.length > 0) {

      if (this.filterOff == true) {
        for (let i = 0; i < this.vehiclesJob.length; i++) {
          this.vehiclesJob[i].shallDisplay = false;
          var hasUnfinished = false;
          for (let job of this.vehiclesJob[i].jobs) {
            if (job.status == 0) {
              hasUnfinished = true;
            }
          }

          if (hasUnfinished == true)
            this.vehiclesJob[i].shallDisplay = true;

          this.vehiclesJob[i].jobs = this.vehiclesJob[i].jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      } else {

        for (let i = 0; i < this.vehiclesJob.length; i++) {
          this.vehiclesJob[i].shallDisplay = true;
          this.vehiclesJob[i].jobs = this.vehiclesJob[i].jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    }

    if (this.vehicleJobsOnly == true) {
      this.fillCalendarVehicleJob();
    } else {
      this.fillCalendarJob();
    }
  }

  resetEmployeeJobs(): void {
    this.vehiclesJob = new Array();
    this.currentEmplyeeId = -1;
    this.fillCalendarVehicleJob();
  }

  setJobId(jobId: any) {
    this.currentJobId = jobId;
    console.log(this.currentJobId);
    if (this.vehicleJobsOnly == true) {
      this.fillCalendarVehicleJob();
    } else {
      this.fillCalendarJob();
    }
  }

  setDisclaimerText(disclaimerId: any): void {

    this.disclaimerText = "";
    for (let disclaimer of this.disclaimers) {
      if (disclaimer.id == disclaimerId) {
        this.disclaimerText = disclaimer.text;
      }
    }

  }
  setReceiptId(receiptId: any): void {
    this.currentReceiptId = receiptId;
    console.log(this.currentReceiptId);
  }

  setPaymentId(paymentId: any) {
    this.currentPaymentId = paymentId;
  }

  getVehicleHistory(vehicleId: any): void {
    console.log("getVehicleHistory");
    //this.showVehicleHistory = !this.showVehicleHistory;
    // if (this.showVehicleHistory == true)
    {
      this.vehicleHistoryService.getVehicleHistory(vehicleId).subscribe({
        next: result => {
          console.log(result);
          this.vehicleHistories = result;
        }
      })
    }
  }
  clearCustomers(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.customers = new Array();
    this.customer = new Customer();
  }
  getVehicle(vehicleId: any): void {

    this.vehicleService.getVehicle(vehicleId).subscribe({

      next: result => {

        console.log(result);
        this.vehicle = result;
        if (this.vehicles.length > 0) {
          for (let i = 0; i < this.vehicles.length; i++) {
            if (this.vehicle.id == this.vehicles[i].id) {
              this.vehicles[i] = this.vehicle;
            }
          }
        }
        console.log(this.vehicle.damages);
        this.labelList(this.vehicle.damageStrings);

      }
    });


  }

  onSearchChange($event: any): void {
    // console.log($event.target.value);

    if (this.vehiclesOriginal.length > 0)
      this.vehicles = this.vehiclesOriginal.filter(vehicle => vehicle.serachString.toLowerCase().includes($event.target.value));

  }
  onSearchChangeCustomer($event: any): void {
    console.log($event.target.value);

    if ($event.target.value.length > 0) {
      this.customers = new Array();
      this.customerService.searchCustomersByLastName(this.user.companyId, $event.target.value).subscribe({
        next: result => {
          if (result) {
            console.log(result);
            this.customers = result;
          }
        }
      })
    }
  }

  onSearchChangeCustomerVehicle($event: any): void {
    console.log($event.target.value);

    this.vehicles = new Array();
    this.vehicleService.searchLastName(this.user.companyId, $event.target.value).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.vehicles = result;
        }
      }
    })
  }


  private labelList(damageStrings: string[]) {
    this.optionsShotCodes = new Array();
    for (let damage of damageStrings) {
      const element = <HTMLInputElement>document.querySelector("[id='" + damage + "']");
      //console.log("checked ", element.checked);
      element.click();
    }
  }

  private unLabelList() {
    this.optionsShotCodes = new Array();
    for (let damage of this.optionsDamage) {
      const element = <HTMLInputElement>document.querySelector("[id='" + damage + "']");
      //console.log("checked ", element.checked);
      try {
        if (element.checked == true) {
          element.click();
        }
      } catch { }
    }
  }

  private LabelListTest(damageStrings: string[]) {
    this.optionsShotCodes = new Array();
    for (let damage of this.optionsDamage) {
      const element = <HTMLInputElement>document.querySelector("[id='" + damage + "']");
      //console.log("checked ", element.checked);
      if (damageStrings.includes(damage)) {
        if (element.checked == true) {

        } else {
          element.click();
        }
      } else {
        if (element.checked == true) {
          element.click();
        }
      }
    }
  }

  getUserById(userId: any): void {

    this.userService.getUserById(userId).subscribe({
      next: result => {
        console.log(result);
        this.user = result;

        if (this.user.partMarketOnly == true) {
          this.router.navigate(['/autoparts']);
        }

        if (this.user.shopDisplayUser == true) {
          this.router.navigate(['/shopdisplay']);
        }

        if (this.user.companyId != 0) {
          this.getAllComponyEmployees(this.user.companyId);
          this.getAllComponyUsers(this.user.companyId);
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
          this.paymentTypes = this.setting.paymentTypes;
          this.rentals = this.setting.rentals;
          this.disclaimers = this.setting.disclaimers;

          for (let disclaimer of this.disclaimers) {
            if (disclaimer.isDefault == true) {
              this.disclaimerId = disclaimer.id;
              this.disclaimerText = disclaimer.text;
            }
          }
          this.company = this.setting.company;
          this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
          this.companyDefaultTaxRate = this.company.taxRate;
        }
      }
    })
  }
  onSaveNote($event: any): void {

    const note = {
      notes: $event.target.value,
      color: this.note.color,
      userId: this.user.id,
      companyId: this.user.companyId,
      id: this.note.id
    }

    this.noteService.createNote(this.currentUser.id, note).subscribe({
      next: result => {
        if (result) {
          this.note = result;
          var hasIt: boolean = false;
          for (let note of this.notes) {
            if (note.id == this.note.id) {
              hasIt = true;
            }
          }
          if (hasIt == false)
            this.notes.unshift(this.note);

          this.note = new Note();
        }
      }
    })

  }
  icons = ['car', 'car-side', 'car-on', 'car-tunnel', 'car-burst'];
  backgroundColors = ['alert-primary', 'alert-success', 'alert-secondary', 'alert-danger', 'alert-warning'];
  textColors = ['text-primary-abs', 'text-success', 'text-secondary', 'text-danger', 'text-warning'];
  activeIndex: number | null = null;

  saveNote(note: Note): void {

    this.noteService.createNote(this.currentUser.id, note).subscribe({
      next: result => {
        if (result) {
          this.note = result;
          var hasIt: boolean = false;
          for (let note of this.notes) {
            if (note.id == this.note.id) {
              hasIt = true;
            }
          }
          if (hasIt == false)
            this.notes.unshift(this.note);

          this.note = new Note();
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

  addNewNote(): void {
    this.note = new Note();
  }

  getAllComponyUsers(companyId: any): void {

    this.userService.getAllCompanyUsers(companyId).subscribe({
      next: result => {
        this.users = result;
      }
    });
  }


  getAllComponyEmployees(companyId: any): void {

    this.employeeService.getComponyEmployees(companyId).subscribe({
      next: result => {
        if (result)
          //this.users = result;
          this.employees = result;
      }
    });
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

  getAllNotes(companyId: any): void {

    this.notes = new Array();

    this.noteService.getAllCompanyNote(companyId).subscribe({
      next: result => {
        if (result != null)
          this.notes = result;
        this.notes = this.notes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
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

  getAllStatus(companyId: any): void {

    this.statuss = new Array();

    this.statusService.getAllCompanyStatus(companyId).subscribe({
      next: result => {

        if (result) {
          console.log(result);
          this.statuss = result;
        }
      }
    })
  }

  getAllLocations(companyId: any): void {

    this.locations = new Array();

    this.locationService.getAllCompanyLocation(companyId).subscribe({
      next: result => {

        if (result) {
          console.log(result);
          this.locations = result;
        }
      }
    })
  }

  resetUser(user: User): void {

    if (this.user.companyId != 0) {

      this.getAllComponyEmployees(this.user.companyId);
      this.getSettings(this.user.companyId);
      this.getAllNotes(this.user.companyId);
      this.searchVehicle(5);

    }
  }
  getAllUsers(): void {
    for (let i = 0; i < this.user.roles.length; i++) {
      if (this.user.roles[i].name == 'ROLE_ADMIN') {

        this.userService.getAllUsers(this.currentUser.id).subscribe({
          next: result => {
            console.log(result);
            this.users = result;
          }
        })
      }
    }
  }

  allowUpdateVehicleStatus(): boolean {

    if (this.user.allowAddAndUpdateVehicle)
      return false;
    else
      return true;
  }

  setStep(step: any): void {
    this.step = step;
  }

  special(vehicle: Vehicle): void {

    vehicle.reason = "special";
    vehicle.special = !vehicle.special;
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
      next: result => {
        console.log(result);
        this.vehicle = result;
        this.vehicle.reason = "";
      }
    })
  }

  createVehicle(vehicle: Vehicle): void {

    this.errorMessage = "";
    this.successMessage = "";
    this.successMessageVehicle = "";
    this.errorMessageVehicle = "";
    console.log("createVehicle");
    var isNewVehicle: boolean = false;

    console.log("createVehicle: " + this.step);


    if (this.vehicle.customer.firstName == null
      || this.vehicle.customer.firstName == ""
      || this.vehicle.customer.lastName == null
      || this.vehicle.customer.lastName == ""
      || this.vehicle.customer.phone == null
      || this.vehicle.customer.phone == ""
      || this.vehicle.customer.street == null
      || this.vehicle.customer.stree == ""
      || this.vehicle.customer.city == null
      || this.vehicle.customer.city == ""
      || this.vehicle.customer.state == null
      || this.vehicle.customer.state == ""
      || this.vehicle.customer.zip == null
      || this.vehicle.customer.zip == "") {
      this.errorMessage = "Please fill the form";
      //alert(this.errorMessage);
      // if (window.confirm('Please fill the form')) 

      return;


    } else {

      if (this.step != 0) {
        const element = <HTMLButtonElement>document.querySelector("[id='nav-vehicle-tab']");
        if (element)
          element.click();

        this.refresh();
      }

      if (vehicle.id == 0) {
        isNewVehicle = true;
        vehicle.reason = "new";
      } else {
        vehicle.reason = "update";
      }
      //vehicle.customerId = 1;
      this.optionsShotCodes = new Array();
      for (let damage of this.optionsDamage) {
        const element = <HTMLInputElement>document.querySelector("[id='" + damage + "']");
        //console.log("checked ", element.checked);
        try {
          if (element.checked == true) {
            this.optionsShotCodes.push(damage);
          }
        } catch { }

        this.vehicle.damages = this.optionsShotCodes.toLocaleString();
        // console.log(this.vehicle.damages);
      }



      vehicle.sequenceNumber = 0;

      vehicle.companyId = this.user.companyId;
      vehicle.customer.companyId = this.user.companyId;

      this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({

        next: async result => {

          console.log(result);

          this.vehicle = result;

          this.base64Image = "";

        }
      });

    }
  }

  getPriorDamageWordCount(): number {

    if (this.vehicle.priorDamage) {

      var words = this.vehicle.priorDamage.split(/\s+/);
      if (words)
        return words.length;
    }

    return 0;
  }
  getDetail(vehicle: Vehicle, index: any): void {

    this.vehicle = vehicle;
    this.vehicleJob = vehicle;
    this.targetDateOriginal = vehicle.targetDate;
    this.errorMessage = "";
    this.successMessage = "";
    this.errorMessageVehicle = "";
    this.successMessageVehicle = "";
    //this.getVehicle(vehicle.id);

    for (var i = 0; i < this.carListStringList.length; i++) {
      if (this.carListStringList[i].brand == this.vehicle.make) {
        this.optionsModel = this.carListStringList[i].models;
      }

    }

    var hasItMake = false;
    for (let make of this.optionsMake) {
      if (make == this.vehicle.make) {
        hasItMake = true;
      }
    }

    if (!hasItMake) {
      this.optionsMake.push(this.vehicle.make);
    }


    var hasIt = false;
    for (let model of this.optionsModel) {
      if (model == this.vehicle.model) {
        hasIt = true;
      }
    }
    if (!hasIt) {
      this.optionsModel.push(this.vehicle.model);
    }
    // this.unLabelList();
    // this.labelList(this.vehicle.damageStrings);

    //this.LabelListTest(this.vehicle.damageStrings);

    this.cindex = index;

    this.vehicleHistories = new Array();
    this.getVehicleJobs2(vehicle.id);
    this.getVehiclePayments(vehicle.id);
    this.getAllVehicleReceipt(vehicle.id);


    // this.getVehicleJobs(vehicle.id);


  }

  getDetail2(vehicle: Vehicle, index: any): void {

    this.vehicle = vehicle;
    this.errorMessage = "";
    this.successMessage = "";
    this.errorMessageVehicle = "";
    this.successMessageVehicle = "";
    this.vehicles = new Array();
    //this.getVehicle(vehicle.id);

    for (var i = 0; i < this.carListStringList.length; i++) {
      if (this.carListStringList[i].brand == this.vehicle.make) {
        this.optionsModel = this.carListStringList[i].models;
      }

    }

    this.cindex = index;

    this.vehicleHistories = new Array();
    this.getVehicleJobs2(vehicle.id);
    this.getVehiclePayments(vehicle.id);
    // this.getVehicleJobs(vehicle.id);


  }

  isInVehicleJobs(employeeId: any, serviceId: any): boolean {

    for (let job of this.jobs) {
      if (job.employeeId == employeeId && job.serviceId == serviceId)
        return true;
    }
    return false;
  }


  onChangeCalendar($event: any, job: Job): void {


    //job.targetDate = $event.target.value;
    const date: Date = new Date($event.target.value);

    job.targetDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    job.reason = "calender"
    console.log($event.target.value);
    console.log("onChangeCalendar");
    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        console.log(result);
        this.job = result;
        job.reason = "";
        this.syncJob(job);
        if (this.vehicleJobsOnly == true) {
          this.fillCalendarVehicleJob();
        } else {
          this.fillCalendarJob();
        }
      }
    })
  }

  onChangeVehiclePaymentCalendar($event: any, payment: Payment): void {

    payment.date = $event.target.value;
    payment.reason = "calender"
    console.log($event.target.value);
    console.log("onChangeVehiclePaymentCalendar");
    this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
      next: result => {
        console.log(result);
        this.payment = result;
        payment.reason = "";
      }
    })
  }

  onChangeVehiclePaymentCalendarVerified($event: any, payment: Payment): void {

    payment.dateVerified = $event.target.value;
    payment.userIdVerified = this.user.id;
    payment.reason = "calender Verified"
    console.log($event.target.value);
    console.log("onChangeVehiclePaymentCalendarVerified");
    this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
      next: result => {
        console.log(result);
        this.payment = result;
        payment.reason = "";
      }
    })
  }

  onChangeVehicleCalendar($event: any, vehicle: Vehicle): void {



    vehicle.targetDate = $event.target.value;
    this.displayStyleTargetReason = "block";

  }

  onChangeVehicleCalendarRental($event: any, vehicle: Vehicle): void {
    vehicle.rentalDate = $event.target.value;
    if (vehicle.id > 0) {

      vehicle.reason = "rentalDate";
      this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
        next: result => {
          if (result) {
            this.vehicle = result;
            vehicle = this.vehicle;
            vehicle.reason = "";
          }
        }
      })
    }
  }

  onSavePriorDamage(vehicle: Vehicle): void {
    vehicle.reason = "Prior Damage";
    if (vehicle.id > 0) {

      vehicle.reason = "targetDate";
      this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
        next: result => {
          if (result) {
            this.vehicle = result;
            vehicle = this.vehicle;
            vehicle.reason = "";
          }
        }
      })
    }
  }

  onChangeVehicleCalendar2($event: any, vehicle: Vehicle): void {
    vehicle.targetDate = $event.target.value;
    vehicle.reason = "targetDate";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
      next: result => {
        if (result) {
          this.vehicle = result;
          vehicle = this.vehicle;
          vehicle.reason = "";
        }
      }
    })
  }

  getVehicleJobs(vehicleId: any): void {
    this.jobs = new Array();

    this.jobService.getAllVehicleJobs(vehicleId).subscribe({
      next: result => {
        //this.jobs = result;
        if (result != null)
          this.serviceJobs = result;
        else {
          this.serviceJobs = new Array();
        }
        //console.log("getVehicleJobs", this.serviceJobs);
      },
      error: (e) => console.error(e)
    })
  }

  isChecked(service: Service): boolean {

    if (service.job.status != 0)
      return true;
    return false;
  }

  isJobChecked(job: Job): boolean {

    if (job.status != 0)
      return true;
    return false;
  }

  getLinkPicture() {
    //return "../../assets/3d.jpg";
    //return "assets/3d.jpg";
    return "assets/2dCar4.jpg";
    //return "assets/2dCar3.jpg";
  }

  updateJobStatus(job: Job): void {
    console.log("updateJobStatus");
    this.jobService.updateJobStatus(job.id).subscribe({
      next: result => {

        this.job = result;
        var i = 0;
        for (let job1 of this.jobs) {
          if (job1.id == this.job.id) {
            this.jobs[i] = this.job;
          }
          i++;
        }
        this.jobCompletedCount = this.getJobStatus();

        this.syncJob(this.job);
        this.filterVehicleJobs();

        //this.getVehicleJobs(this.vehicle.id);
        //this.getVehicleJobs2(this.vehicle.id);
      }, error: (e) => console.log(e)
    })
  }


  private syncJob(job: Job) {
    if (this.vehiclesJob.length > 0) {
      for (let j = 0; j < this.vehiclesJob.length; j++) {
        for (let k = 0; k < this.vehiclesJob[j].jobs.length; k++) {
          if (this.vehiclesJob[j].jobs[k].id == job.id) {
            this.vehiclesJob[j].jobs[k] = job;
          }
        }
      }
    }
  }

  saveJobNotes(job: Job): void {

    job.reason = "notes";
    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        this.job = result;
        // this.getVehicleJobs(this.vehicle.id);
        this.syncJob(this.job);
      }, error: (e) => console.log(e)
    })

  }


  savePayment(payment: Payment): void {

    payment.reason = "updates";
    this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
      next: result => {
        this.payment = result;
        // this.getVehicleJobs(this.vehicle.id);
      }, error: (e) => console.log(e)
    })

  }


  onEnter(reason: any, job: Job): void {
    job.reason = reason;
    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        this.job = result;
        this.syncJob(this.job);
        // this.getVehicleJobs(this.vehicle.id);
      }, error: (e) => console.log(e)
    })
  }

  onEnterPayment(reason: any, payment: Payment): void {

    payment.reason = reason;
    this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
      next: result => {
        if (result)
          this.payment = result;
        // this.getVehiclePayments(this.vehicle.id);
      }
    })
  }

  onEnterReceipt(reason: any, receipt: Receipt): void {

    receipt.reason = reason;
    this.receiptService.createReceipt(this.currentUser.id, receipt).subscribe({
      next: result => {
        if (result)
          this.receipt = result;
        // this.getVehiclePayments(this.vehicle.id);
      }
    })
  }

  getVehicleJobs2(vehicleId: any): void {

    this.serviceJobs = new Array();
    this.jobCompletedCount = 0;
    this.jobService.getAllVehicleJobs2(vehicleId).subscribe({
      next: result => {
        if (result) {
          this.jobs = result;
          this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          for (let i = 0; i < this.vehicles.length; i++) {
            if (this.vehicles[i].id == vehicleId) {
              this.vehicles[i].jobs = this.jobs;
            }
          }
          this.jobCompletedCount = this.getJobStatus();

          if (this.vehicleJobsOnly == true) {
            this.fillCalendarVehicleJob();
          }

        } else {
          this.jobs = new Array();
          if (this.vehicleJobsOnly == true) {
            this.fillCalendarVehicleJob();
          }
        }
        // this.serviceJobs = result;
        //console.log("getVehicleJobs", this.jobs);
      }


    })


  }


  getVehiclePayments(vehicleId: any): void {

    this.payments = new Array();
    this.paymentService.getAllVehiclePayments(vehicleId).subscribe({
      next: result => {
        if (result) {
          this.payments = result;
          this.payments = this.payments.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        } else {
          this.payments = new Array();
        }
        // this.serviceJobs = result;
        // console.log("getVehiclePayments", this.payments);
      }


    })
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

  applyStatusfilter(status: any): void {

    if (status == 'All')
      this.vehicles = this.vehiclesOriginal;
    else
      this.vehicles = this.vehiclesOriginal.filter(vehicle => vehicle.status === status);
  }

  applyLocationfilter(location: any): void {
    console.log("applyLocationfilter: ", location);
    if (location == 'All')
      this.vehicles = this.vehiclesOriginal;
    else
      this.vehicles = this.vehiclesOriginal.filter(vehicle => vehicle.location == location);
  }

  counter: any = 0;

  sortList(fieldName: any): void {
    this.counter++;

    if (fieldName == 'id') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.id - b.id);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.id - a.id);
    }

    if (fieldName == 'daysInShop') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.daysInShop - b.daysInShop);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.daysInShop - a.daysInShop);
    }

    if (fieldName == 'inTakeWay') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.inTakeWay - b.inTakeWay);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.inTakeWay - a.inTakeWay);
    }

    if (fieldName == 'status') {

      for (let vehicle of this.vehicles) {
        vehicle.sortStr = "";
        for (let status of this.statuss) {
          if (status.id == vehicle.status) {
            vehicle.sortStr = status.name;
          }
        }
      }
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));

    }

    if (fieldName == 'year') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.year - b.year);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.year - a.year);
    }

    if (fieldName == 'make') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['make'].localeCompare(b['make']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['make'].localeCompare(a['make']));
    }

    if (fieldName == 'model') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['model'].localeCompare(b['model']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['model'].localeCompare(a['model']));
    }

    if (fieldName == 'color') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['color'].localeCompare(b['color']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['color'].localeCompare(a['color']));
    }

    if (fieldName == 'insuranceCompany') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['insuranceCompany'].localeCompare(b['insuranceCompany']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['insuranceCompany'].localeCompare(a['insuranceCompany']));
    }

    if (fieldName == 'price') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.price - b.price);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.price - a.price);
    }

    if (fieldName == 'paid') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => Number(a.paid) - Number(b.paid));
      else
        this.vehicles = this.vehicles.sort((a, b) => Number(b.paid) - Number(a.paid));
    }

    if (fieldName == 'paymentStatus') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.paymentStatus - b.paymentStatus);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.paymentStatus - a.paymentStatus);
    }

    if (fieldName == 'paymentMethod') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.paymentMethod - b.paymentMethod);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.paymentMethod - a.paymentMethod);
    }

    if (fieldName == 'approvalStatus') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.approvalStatus - b.approvalStatus);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.approvalStatus - a.approvalStatus);
    }

    if (fieldName == 'jobRequestType') {
      for (let vehicle of this.vehicles) {
        vehicle.sortStr = "";
        for (let jobRequstType of this.jobRequestTypes) {
          if (jobRequstType.id == vehicle.jobRequestType) {
            vehicle.sortStr = jobRequstType.name;
          }
        }
      }
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    }


    if (fieldName == 'targetDateCountDown') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.targetDateCountDown - b.targetDateCountDown);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.targetDateCountDown - a.targetDateCountDown);
    }

    if (fieldName == 'rentalCountDown') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.rentalCountDown - b.rentalCountDown);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.rentalCountDown - a.rentalCountDown);
    }

    if (fieldName == 'assignedTo') {

      for (let vehicle of this.vehicles) {
        vehicle.sortStr = "";
        for (let employee of this.employees) {
          if (employee.id == vehicle.assignedTo) {
            vehicle.sortStr = employee.firstName + employee.lastName;
          }
        }
      }

      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    }

    if (fieldName == 'keyLocation') {
      for (let vehicle of this.vehicles) {
        vehicle.sortStr = "";
        for (let employee of this.employees) {
          if (employee.id == vehicle.keyLocation) {
            vehicle.sortStr = employee.firstName + employee.lastName;
          }
        }
      }
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    }


    if (fieldName == 'location') {

      for (let vehicle of this.vehicles) {
        vehicle.sortStr = "";
        for (let location of this.locations) {
          if (location.id == vehicle.location) {
            vehicle.sortStr = location.name;
          }
        }
      }

      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    }

    if (fieldName == 'createdAt') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      else
        this.vehicles = this.vehicles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

  }


  dropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.jobs,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.jobs.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.jobs[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.jobService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.jobs = result;
          this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    })

    if (this.vehicleJobsOnly == true) {
      this.fillCalendarVehicleJob();
    }
  }

  onChangeNoTax($event: any): void {

    var isCheck: boolean = $event.target.checked;
    if (isCheck == true) {
      this.company.taxRate = 0.00;
    } else {
      this.company.taxRate = this.companyDefaultTaxRate;
    }

  }

  // getSubtotal(): number {
  //   var total: number = 0;
  //   for (let receipt of this.receipts) {
  //     total += receipt.amount;
  //   }

  //   return total;
  // }

  // getTax(): number {
  //   var total: number = 0;
  //   for (let receipt of this.receipts) {
  //     total += receipt.amount;
  //   }
  //   //(Math.round(2.782061 * 100) / 100).toFixed(2)
  //   return +(Math.round(total * this.company.taxRate)).toFixed(2);
  // }

  // getTotal(): number {
  //   return this.getSubtotal() + this.getTax();
  // }

  droppedReceipt(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.receipts,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.receipts.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.receipts[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.receiptService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.receipts = result;
          this.receipts = this.receipts.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    })

  }

  droppedTest(event: CdkDragDrop<string[]>) {


    console.log("" + event.previousIndex)
    console.log("" + event.currentIndex)
  }


  droppedPayment(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.payments,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.payments.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.payments[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.paymentService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.payments = result;
          this.payments = this.payments.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    })
  }

  droppedNote(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.notes,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.notes.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.notes[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.noteService.updateSeqence(this.user.companyId, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.notes = result;
          this.notes = this.notes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    })
  }

  droppedVehicle(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.vehicles,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.vehicles.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.vehicles[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.vehicleService.updateSeqence(this.user.companyId, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.vehicles = result;
          this.vehicles = this.vehicles.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    })
  }


  addDamage(shortCode: any, area: string): void {

    console.log(area);
    this.vehicle.workRequest = this.vehicle.workRequest + " " + area;

    if (this.damages.length == 0) {
      this.damages.push(area);
    } else {

      let dupFound: boolean = false;

      for (let i = 0; i < this.damages.length; i++) {
        if (this.damages[i] == area) {
          dupFound = true;
          this.damages.splice(i, 1);
        }
      }
      if (dupFound == false) {
        this.damages.push(area);
      }
    }

    this.vehicle.workRequest = this.damages.toString();
  }

  addDamageEvent($event: any): void {

    // const element = <HTMLElement>document.querySelector("[id='FRB']");

    for (let damage of this.optionsDamage) {
      const element = <HTMLInputElement>document.querySelector("[id='" + damage + "']");
      console.log("checked ", element.checked);
      element.click();
    }


    console.log($event.value);
    this.vehicle.workRequest = this.vehicle.workRequest + " " + $event.value;

    if (this.damages.length == 0) {
      this.damages.push($event.value);
    } else {

      let dupFound: boolean = false;

      for (let i = 0; i < this.damages.length; i++) {
        if (this.damages[i] == $event.value) {
          dupFound = true;
          this.damages.splice(i, 1);
        }
      }
      if (dupFound == false) {
        this.damages.push($event.value);
      }
    }

    this.vehicle.workRequest = this.damages.toString();
  }

  deleteVehicleJob($event: any, job: Job) {
    console.log("deleteVehicleJob " + job.id);

    this.jobService.deleteJob(job.id).subscribe({
      next: result => {

        console.log(result);
        this.getVehicleJobs2(this.vehicle.id);
        if (this.currentEmplyeeId == job.employeeId && this.vehiclesJob.length > 0) {
          this.getMyJobs(this.currentEmplyeeId);
        }
      }
    })

  }

  deleteVehicleReceipt($event: any, receipt: Receipt) {
    console.log("deleteVehicleReceipt" + receipt.id);

    this.receiptService.deleteReceipt(receipt.id).subscribe({
      next: result => {
        console.log(result);
        this.getAllVehicleReceipt(this.vehicle.id);
      }
    })

  }

  getNoteDetail(note: Note): void {
    this.note = note;
  }

  deleteNote(note: Note): void {

    this.noteService.deleteNote(note.id).subscribe({
      next: result => {

        var index: any = 0;
        for (let note1 of this.notes) {
          if (note1.id == note.id) {
            this.notes.splice(index, 1);
          }

          index++;
        }
        this.note = new Note();
      }
    });
  }

  getJobStatus(): any {
    var counts = 0;
    for (let job of this.jobs) {
      if (job.status == 1)
        counts++;
    }
    return counts;

  }
  deleteVehiclePayment($event: any, payment: Payment) {
    console.log("deleteVehiclePayment " + payment.id);

    this.paymentService.deletePayment(payment.id).subscribe({
      next: result => {
        console.log(result);

        var i = 0;
        for (let payment1 of this.payments) {
          if (payment1.id == payment.id) {
            this.payments.splice(i, 1);
          }
          i++;
        }



        //this.getVehiclePayments(this.vehicle.id);

      }
    })

  }



  deleteVehicleService($event: any, serviceId: any, vehicleId: any) {

    console.log("deleteService " + serviceId);
    this.serviceService.deleteVehicleService(vehicleId, serviceId).subscribe({
      next: result => {
        console.log(result);
        this.getVehicle(this.vehicle.id);
        this.getVehicleJobs(vehicleId);

      }
    })

  }
  addVehicleService(serviceId: any): void {
    console.log("addVehicleService");
    this.serviceService.addVehicleService(this.vehicle.id, serviceId).subscribe({
      next: result => {
        console.log(result);
        this.getVehicle(this.vehicle.id);
        this.getVehicleJobs(this.vehicle.id);
        this.getVehicleJobs2(this.vehicle.id);

      }
    })
  }

  addVehicleService2(serviceId: any): void {
    console.log("addVehicleService");
    this.serviceService.addVehicleService(this.vehicle.id, serviceId).subscribe({
      next: result => {
        console.log(result);
        if (result) {
          this.getVehicleJobs2(this.vehicle.id);
        }
      }
    })
  }

  isInVehicleService(serviveId: any): any {

    if (this.vehicle.services != null) {
      for (let service of this.vehicle.services) {
        if (service.id == serviveId) {
          return true;
        }

      }
    }
    return false;
  }

  isInVehicleService2(serviveId: any): any {

    if (serviveId == 0)
      return false;

    if (this.vehicle.services != null) {
      for (let service of this.vehicle.services) {
        if (service.id == serviveId) {
          return true;
        }

      }
    }
    return false;
  }

  reset(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.successMessageVehicle = "";
    this.errorMessageVehicle = "";
    this.vehicle = new Vehicle();
    this.vehicle.customer = new Customer();

    if (this.editModeCustomer == false)
      this.editModeCustomer = true;

    this.vehicles = new Array();
    //this.unLabelList();
  }



  deleteCustomer(custmerId: any): void {


    if (window.confirm("Are you sure to remove this customer ?")) {
      this.customerService.deleteCustomer(custmerId).subscribe({
        next: result => {
          if (result)
            this.successMessage = "Successfully Removed";
        }
      })

    }

  }
  onChangeEmployee2($event: any, employeeId: any, job: Job) {

    job.employeeId = employeeId;
    job.reason = "assign";
    console.log("onChangeEmployee2");
    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        this.job = result;
        console.log(this.job);
        for (let job of this.jobs) {
          if (job.id == this.job.id)
            job = this.job;
        }
        //this.getVehicleJobs(this.vehicle.id);
        this.getVehicleJobs2(this.vehicle.id);

        if (this.currentEmplyeeId == employeeId) {
          this.getMyJobs(employeeId);
        }

        this.syncJob(this.job);
      }
    })

  }

  onChangeEmployee($event: any, employeeId: any, service: Service, jobId: any, notes: any) {

    console.log(" employeeID ", employeeId);
    console.log("service name ", service.name);
    console.log("service ", service.id);
    console.log("jobId ", jobId);

    if (!notes)
      notes = "";
    const job = {
      id: jobId,
      userId: this.currentUser.id,
      name: service.name,
      serviceId: service.id,
      vehicleId: this.vehicle.id,
      employeeId: employeeId,

      notes: notes,
      reason: "assign",
      imageModels: new Array(),
      paymentMethod: 0,
      jobRequestType: 0
      // targetDate: new Date()
    };


    console.log("onChangeEmployee");
    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        this.job = result;

        this.getVehicleJobs(this.vehicle.id);

        // this.getVehicleJobs2(this.vehicle.id);
      }
    })

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
  closePopupYes(): void {
    this.displayStyle = "none";
    console.log("archiveVehicle");
    this.vehicle.archived = true;
    this.vehicle.reason = "archive";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("archiveVehicle", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        this.searchVehicle(5);
      }
    })
  }

  closePopup(): void {
    this.displayStyle = "none";
  }

  closePopupYesTargetDateReason(): void {

    if (this.vehicle.targetDateChangeReason == null || this.vehicle.targetDateChangeReason == '') {
      this.messageTargetDateReason = "Please provide a reason to change the target date to " + this.vehicle.targetDate;
      return;
    }

    this.displayStyleTargetReason = "none";
    console.log("change target date");

    this.vehicle.reason = "change targetDate";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("change target date", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        //this.searchVehicle(5);
      }
    })
  }

  closePopupTargetDateReason(): void {
    this.vehicle.targetDate = this.targetDateOriginal;

    this.displayStyleTargetReason = "none";
  }

  archiveVehicle(vehicle: Vehicle): void {
    this.displayStyle = "block";
    console.log("archiveVehicle");

  }

  onChangeCurrentJob($event: any, jobId: any): void {

    console.log("onChangeCurrentJob");
    this.vehicle.currentJobNumber = jobId;
    this.vehicle.reason = "assign current job";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeCurrentJob", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        //this.getStatusOverview(this.user.companyId);
      }
    })

  }


  onChangeStatus($event: any, status: string): void {

    console.log("onChangeStatus");
    this.vehicle.status = status;
    this.vehicle.reason = "status";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeStatus", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        this.getStatusOverview(this.user.companyId);
      }
    })
  }

  onChangeAssignedTo($event: any, employeeId: any): void {

    console.log("onChangeAssignedTo");
    this.vehicle.assignedTo = employeeId;
    this.vehicle.reason = "assigned To";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeAssignedTo", result);
        this.vehicle = result;
        this.vehicle.reason = "";

      }
    })
  }



  onChangeJobRequestType($event: any, jobRequestType: any): void {

    console.log("onChangeJobRequestType");
    this.vehicle.jobRequestType = jobRequestType;
    this.vehicle.reason = "job request type";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeJobRequestType", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        //this.getStatusOverview(this.user.companyId);
      }
    })
  }

  onChangeApprovalStatus($event: any, approvalStatus: any): void {

    console.log("onChangeJobRequestType");
    this.vehicle.approvalStatus = approvalStatus;
    this.vehicle.reason = "approval status";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeJobRequestType", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        //this.getStatusOverview(this.user.companyId);
      }
    })
  }

  onChangeInTakeWay($event: any, inTakeWay: any): void {

    console.log("onChangeInTakeWay");
    this.vehicle.inTakeWay = inTakeWay;
    this.vehicle.reason = "inTake Way";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeInTakeWay", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        //this.getStatusOverview(this.user.companyId);
      }
    })
  }

  onChangeKeyLocation($event: any, keyLocation: any): void {

    console.log("onChangeKeyLocation");
    this.vehicle.keyLocation = keyLocation;
    this.vehicle.reason = "key Location";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeKeyLocation", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        //this.getStatusOverview(this.user.companyId);
      }
    })
  }


  onChangeJobJobRequestType($event: any, jobRequestType: any, job: Job): void {

    console.log("onChangeJobJobRequestType");
    job.jobRequestType = jobRequestType;
    job.reason = "job request type";
    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        console.log("onChangeJobJobRequestType", result);
        this.job = result;
        this.job.reason = "";

      }
    })
  }

  onChangePaymentMethodId($event: any, paymentMethodId: any, payment: Payment): void {

    console.log("onChangePaymentMethodId");
    payment.paymentMethodId = paymentMethodId;
    payment.reason = "Payment Method";
    this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
      next: result => {
        console.log("onChangePaymentMethodId", result);
        this.payment = result;
        this.payment.reason = "";

      }
    })
  }

  onChangeVehiclePaymentMethod($event: any, paymentMethodId: any): void {

    console.log("onChangeVehiclePaymentMethod");
    this.vehicle.paymentMethodId = paymentMethodId;
    this.vehicle.reason = "Payment Method";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeVehiclePaymentMethod", result);
        this.vehicle = result;
        this.vehicle.reason = "";

      }
    })
  }



  onChangePaymentStatusId($event: any, paymentStatusId: any, payment: Payment): void {

    console.log("onChangePaymentStatusId");
    payment.paymentStatusId = paymentStatusId;
    payment.reason = "Payment Status";
    this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
      next: result => {
        console.log("onChangePaymentStatusId", result);
        this.payment = result;
        this.payment.reason = "";

      }
    })
  }



  changePaidStatus(vehicle: Vehicle, paid: boolean): void {

    console.log("changePaidStatus");
    vehicle.paid = paid;

    if (paid == true)
      vehicle.reason = "unpaid";
    else
      vehicle.reason = "paid";

    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
      next: result => {
        console.log("changePaidStatus", result);
        this.vehicle = result;

        this.vehicle.reason = "";

      }
    })
  }

  setSpecialFlag($event: any): void {
    console.log("setSpecialFlag");
    this.vehicle.reason = "special";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("setSpecialFlag", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        //this.getStatusOverview(this.user.companyId);
      }
    })

  }
  onChangeLocation($event: any, location: string): void {

    console.log("onChangeLocation");
    this.vehicle.location = location;
    this.vehicle.reason = "location";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeLocation", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        this.getLocationOverview(this.user.companyId);
      }
    })
  }

  onChangePaymentStatus($event: any, paymentStatus: any): void {

    console.log("onChangePaymentStatus");
    this.vehicle.paymentStatus = paymentStatus;
    this.vehicle.reason = "paymentStatus";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangePaymentStatus", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        // this.getLocationOverview(this.user.companyId);
      }
    })
  }


  onChangePaymentMethod($event: any, paymentMethod: any): void {

    console.log("onChangePaymentMethod");
    this.vehicle.paymentMethod = paymentMethod;
    this.vehicle.reason = "paymentMethod";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangePaymentMethod", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        // this.getLocationOverview(this.user.companyId);
      }
    })
  }



  onChangeJobPaymentMethod($event: any, paymentMethod: any, job: Job): void {

    console.log("onChangeJobPaymentMethod");
    job.paymentMethod = paymentMethod;
    job.reason = "paymentMethod";
    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        console.log("onChangeJobPaymentMethod", result);
        this.job = result;
        this.job.reason = "";
        // this.getLocationOverview(this.user.companyId);
      }
    })
  }

  searchVin(): void {

    this.autopartService.getVin(this.vehicle.vin).subscribe({
      next: (res) => {
        console.log(res);
        var tempAutopart: AutoPart = res;

        if (tempAutopart.year > 0 && tempAutopart.make != "" && tempAutopart.model != "") {
          this.autopart = res;
          this.vehicle.year = this.autopart.year;
          this.vehicle.make = this.autopart.make;
          this.vehicle.model = this.autopart.model;
          this.vehicle.description = this.autopart.description;

          this.showSearchVin = false;

          for (var i = 0; i < this.carListStringList.length; i++) {
            if (this.carListStringList[i].brand == this.autopart.make) {
              this.optionsModel = this.carListStringList[i].models;
            }

          }

          var hasItMake = false;
          for (let make of this.optionsMake) {
            if (make == this.vehicle.make) {
              hasItMake = true;
            }
          }
          if (!hasItMake) {
            this.optionsMake.push(this.vehicle.make);
          }


          var hasIt = false;
          for (let model of this.optionsModel) {
            if (model == this.vehicle.model) {
              hasIt = true;
            }
          }
          if (!hasIt) {
            this.optionsModel.push(this.vehicle.model);
          }
        }
        // this.vinSearched = true;

      },
      error: (e) => console.error(e)
    });
  }

  searchVehicle(type: number): void {

    this.errorMessage = "";
    this.successMessageVehicle = "";
    this.errorMessageVehicle = "";

    const data = {
      type: type,
      year: this.vehicle.year,
      make: this.vehicle.make,
      model: this.vehicle.model,
      color: this.vehicle.color,
      archived: this.archived,
      companyId: this.user.companyId,
      partNumber: "placeholder",
    };

    console.log(data);

    this.vehicleService.searchByYearMakeModelColor(data).subscribe({
      next: (res) => {
        // console.log(res);
        this.vehicles = res;
        this.vehicles = this.vehicles.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        this.vehiclesOriginal = res;

        if (this.vehicles.length == 0)
          this.message = "No Match Found!"
        else
          this.message = "[ " + this.vehicles.length + " ] found:"

        console.log("====", this.vehicles.length);
        //console.log("====", this.vehicles);

        if (type === 5) {
          //   this.getCompanyEmployee(this.user.companyId);
          //   this.getAllService(this.user.companyId);


        }
      },
      error: (e) => {
        console.log("No Match Found");
        this.message = e.error.message;
        console.error(e);
      }

    },
    );
  }

  calendarKicker(): void {
    setTimeout(function () {
      window.dispatchEvent(new Event('resize'))
    }, 50);
  }

  fillCalendar(): void {

    // const element = <HTMLInputElement>document.querySelector("[id='fullcalendar']");
    // if (element)
    //   element.click();

    setTimeout(function () {
      window.dispatchEvent(new Event('resize'))
    }, 10);

    var events = new Array();
    var event;

    for (let vehicle of this.vehicles) {
      var background = "#0071c5";
      var description: any = "";
      var locationStr: any = "";
      var jobRequestTypeStr: any = "";

      if (vehicle.paid)
        background = "grey";

      for (let status of this.statuss) {
        if (vehicle.status == status.id)
          description = status.name;
      }

      for (let location of this.locations) {
        if (vehicle.location == location.id)
          locationStr = location.name;
      }

      for (let jobRequestType of this.jobRequestTypes) {
        if (vehicle.jobRequestType == jobRequestType.id)
          jobRequestTypeStr = jobRequestType.name;
      }


      event = {
        title: '#' + vehicle.id + ' ' + vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model,
        url: vehicle.id,
        background: background,
        description: description,
        location: locationStr,
        days: vehicle.daysInShop,
        jobRequestType: jobRequestTypeStr,
        // background : 'lightgrey',
        start: vehicle.targetDate
      };


      events.push(event);
    }

    this.calendarOptions = {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      weekends: true,
      events: events,
    };



  }

  getAllVehicleReceipt(vehicleId: any): void {

    // console.log("getAllVehicleReceipt")
    this.receiptService.getAllVehicleReceipts(vehicleId).subscribe({
      next: result => {
        if (result) {
          this.receipts = result;
          this.receipts = this.receipts.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          // console.log(this.receipts);
        } else {
          this.receipts = new Array();
        }

      }
    })
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

  createReceipt(): void {

    let receipt: Receipt = new Receipt();
    receipt.name = "change Me";
    receipt.userId = this.user.id;
    receipt.amount = 0;
    receipt.vehicleId = this.vehicle.id;
    receipt.notes = "Please specify";
    receipt.invoiceNumber = this.randomString();

    this.receiptService.createReceipt(this.user.id, receipt).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.getAllVehicleReceipt(this.vehicle.id);
        }
      }
    })

  }

  printPage(componentId: string, title: any) {

    const elementImage = <HTMLElement>document.querySelector("[id='" + componentId + "']");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt?.document.write('<title>' + title + '</title>');
    WindowPrt?.document.write("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">")
    WindowPrt?.document.write("<link href=\"../styles.css\" rel=\"stylesheet\">")
    //WindowPrt?.document.write('<style type=\"text/css\">th{color: white;background: rgb(13, 173, 226);}</style>');
    WindowPrt?.document.write(elementImage.innerHTML);
    WindowPrt?.document.write('<script>onload = function() { window.print(); }</script>');
    WindowPrt?.document.close();
    WindowPrt?.focus();


  }

  printPdf(componentId: any): void {

    const elementImage = <HTMLElement>document.querySelector("[id='" + componentId + "']");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt?.document.write('<title>Receipt</title>');
    WindowPrt?.document.write("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">")
    WindowPrt?.document.write("<link href=\"../styles.css\" rel=\"stylesheet\">")
    WindowPrt?.document.write('<style type=\"text/css\">th{color: white;background: rgb(13, 173, 226);}</style>');
    WindowPrt?.document.write(elementImage.innerHTML);
    var html = htmlToPdfmake(elementImage.innerHTML, { tableAutoSize: false });
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

    const documentDefinition = { content: html };
    //pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(documentDefinition).download();
  }

  printPdf2(componentId: any): void {

    const elementImage = <HTMLElement>document.querySelector("[id='" + componentId + "']");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt?.document.write('<title>Receipt</title>');
    WindowPrt?.document.write("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">")
    WindowPrt?.document.write("<link href=\"./stylecss\" rel=\"stylesheet\">")
    WindowPrt?.document.write('<style type=\"text/css\">th{color: white;background: rgb(13, 173, 226);}</style>');
    WindowPrt?.document.write(elementImage.innerHTML);

    var doc = new jsPDF('p', 'pt', 'a4');
    // doc.internal.scaleFactor = 2.25;
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();
    doc.html(WindowPrt!.document.documentElement, {
      // doc.html(elementImage.innerHTML, {
      // width: pdfWidth,
      width: pdfWidth,
      windowWidth: 500,
      // height: pdfHeight,
      callback(rst) {
        rst.save('one.pdf');
      },
      x: 10,
      y: 10
    });

  }
  fillCalendarVehicleJob(): void {


    this.vehicleJobsOnly = true;

    setTimeout(function () {
      window.dispatchEvent(new Event('resize'))
    }, 10);

    var events = new Array();
    var event;

    var counter = 0;

    if (this.vehicle) {

      // var background = "#0071c5";
      var background = "grey";
      var description: any = "";
      var locationStr: any = "";
      var jobRequestTypeStr: any = "";

      // if (vehicle.paid)
      //   background = "grey";

      // for (let status of this.statuss) {
      //   if (vehicle.status == status.id)
      //     description = status.name;
      // }

      for (let location of this.locations) {
        if (this.vehicle.location == location.id)
          locationStr = location.name;
      }

      for (let jobRequestType of this.jobRequestTypes) {
        if (this.vehicle.jobRequestType == jobRequestType.id)
          jobRequestTypeStr = jobRequestType.name;
      }

      var index = 1;
      for (let job of this.jobs) {
        background = "grey";
        if (job.targetDate != null) {

          if (job.id == this.currentJobId)
            background = "#0071c5";

          let employeeName = "";
          for (let employee of this.employees) {
            if (employee.id == job.employeeId) {
              employeeName = employee.firstName + " " + employee.lastName;
            }
          }
          event = {
            // title: '#' + this.vehicle.id + ' ' + this.vehicle.year + ' ' + this.vehicle.make + ' ' + this.vehicle.model,
            title: "# " + index + " " + job.name + " => " + job.notes,
            url: this.vehicle.id,
            groupId: job.id,
            background: background,
            description: employeeName,
            location: locationStr,
            days: this.vehicle.daysInShop,
            jobRequestType: jobRequestTypeStr,
            // background : 'lightgrey',
            start: job.targetDate
          };

          events.push(event);
        }
        index++;
      }

    }


    this.calendarOptionsJob1 = {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      weekends: true,
      events: events,
    };



  }

  fillCalendarJob(): void {


    setTimeout(function () {
      window.dispatchEvent(new Event('resize'))
    }, 10);

    var events = new Array();
    var event;

    var counter = 0;
    for (let vehicle of this.vehiclesJob) {
      if (vehicle.shallDisplay) {

        // var background = "#0071c5";
        var background = "grey";
        var description: any = "";
        var locationStr: any = "";
        var jobRequestTypeStr: any = "";

        // if (vehicle.paid)
        //   background = "grey";

        // for (let status of this.statuss) {
        //   if (vehicle.status == status.id)
        //     description = status.name;
        // }

        for (let location of this.locations) {
          if (vehicle.location == location.id)
            locationStr = location.name;
        }

        for (let jobRequestType of this.jobRequestTypes) {
          if (vehicle.jobRequestType == jobRequestType.id)
            jobRequestTypeStr = jobRequestType.name;
        }

        for (let job of vehicle.jobs) {
          background = "grey";
          if (job.status == 0 && job.targetDate != null) {

            if (job.id == this.currentJobId)
              background = "#0071c5";

            event = {
              title: '#' + vehicle.id + ' ' + vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model,
              url: vehicle.id,
              groupId: job.id,
              background: background,
              description: job?.name + " => " + job?.notes,
              location: locationStr,
              days: vehicle.daysInShop,
              jobRequestType: jobRequestTypeStr,
              // background : 'lightgrey',
              start: job.targetDate
            };

            events.push(event);
          }
        }


      }
    }

    this.calendarOptionsJob1 = {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      weekends: true,
      events: events,
    };



  }

  getDetailCalendar(vehicleId: any): void {



    this.errorMessage = "";
    this.successMessage = "";
    this.errorMessageVehicle = "";
    this.successMessageVehicle = "";
    //this.getVehicle(vehicle.id);
    var index = 0;
    for (let vehicle of this.vehicles) {
      if (vehicle.id == vehicleId) {
        this.vehicle = vehicle;
        this.cindex = index;
      }
      index++;
    }



    //console.log(this.cindex);
    for (var i = 0; i < this.carListStringList.length; i++) {
      if (this.carListStringList[i].brand == this.vehicle.make) {
        this.optionsModel = this.carListStringList[i].models;
      }

    }

    var hasIt = false;
    for (let model of this.optionsModel) {
      if (model == this.vehicle.model) {
        hasIt = true;
      }
    }
    if (!hasIt) {
      this.optionsModel.push(this.vehicle.model);
    }

    this.vehicleHistories = new Array();
    this.getVehicleJobs2(this.vehicle.id);
    this.getVehiclePayments(this.vehicle.id);
    this.getAllVehicleReceipt(this.vehicle.id);

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

  getLocationOverviews(): void {

    this.getLocationOverview(this.user.companyId);
  }
  getProductionOverview(): void {

    this.getStatusOverview(this.user.companyId);
  }
  getStatusOverview(companyId: any): void {
    //console.log("getOverview");
    this.vehicleService.getOverview(companyId).subscribe({
      next: result => {
        //console.log(result);
        this.statusOverview = result;
        this.statusOverview = this.statusOverview.sort((a, b) => b.count - a.count);
      }, error: (e) => console.log(e)
    })
  }

  getLocationOverview(companyId: any): void {
    console.log("getLocationOverview");
    this.vehicleService.getLocationOverview(companyId).subscribe({
      next: result => {
        console.log(result);
        this.locationOverview = result;

      }, error: (e) => console.log(e)
    })
  }


  getAllService(companyId: any): void {

    this.serviceService.getAllServices(companyId).subscribe({
      next: result => {
        this.services = result;
      }
    })
  }

  addVehicleJob(service: Service): void {

    console.log("addVehicleJob");
    var job = {
      id: 0,
      name: service.name,
      employeeId: 0,
      serviceId: service.id,
      notes: "Please specify",
      status: 0,
      imageModels: new Array(),
      vehicleId: this.vehicle.id,
      jobRequestType: 0,
      paymentMethod: 0
    }

    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.job = result;
          if (this.jobs) {
            this.jobs.unshift(this.job);
          }
        }
      }

    })
  }

  addVehiclePayment(paymentType: PaymentType): void {

    console.log("addVehiclePayment");
    var payment = {
      id: 0,
      name: paymentType.name,
      notes: "Please specify",
      paymentTypeId: paymentType.id,
      vehicleId: this.vehicle.id,
      paymentStatusId: 0,
      paymentMethodId: 0
    }

    this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.payment = result;
          if (this.payments) {
            this.payments.unshift(this.payment);
          }
        }
      }

    })
  }
  getCustomerDetail(customer: any, index: any): void {

    this.cindexCustomer = index;
    this.customer = customer;
    this.vehicle.customer = customer;
    //this.clearCustomers();
    this.errorMessage = "";
    this.successMessage = "";
    this.customers = new Array();
    this.getCutomerCounterInvoice(this.customer.id);

  }

  saveCustomerInfo(customer: any): void {

    console.log("saveCustomerInfo");
    this.errorMessage = "";
    if (this.vehicle.customer.firstName == null
      || this.vehicle.customer.firstName == ""
      || this.vehicle.customer.lastName == null
      || this.vehicle.customer.lastName == ""
      || this.vehicle.customer.phone == null
      || this.vehicle.customer.phone == ""
      || this.vehicle.customer.street == null
      || this.vehicle.customer.stree == ""
      || this.vehicle.customer.city == null
      || this.vehicle.customer.city == ""
      || this.vehicle.customer.state == null
      || this.vehicle.customer.state == ""
      || this.vehicle.customer.zip == null
      || this.vehicle.customer.zip == ""
    ) {
      this.errorMessage = "Please fill the form";
      return;
    }
    customer.companyId = this.user.companyId;
    this.errorMessage = "";
    this.successMessage = "";
    this.customerService.createCustomer(this.currentUser.id, customer).subscribe({
      next: result => {
        console.log(result);
        this.customer = result;
        this.vehicle.customer = this.customer;
        this.successMessage = "Successfully updated";
        this.editModeCustomer = false;
      }
    })

  }
  searchCustomerByPhoneOnly(phone: any): void {

    console.log("searchCustomerByPhoneOnly");
    // this.unLabelList();
    this.vehicles = new Array();
    this.customers = new Array();
    this.customerService.searchCustomersByPhone(this.user.companyId, phone).subscribe({
      next: result => {
        console.log(result);
        this.customers = result;
        this.vehicle = new Vehicle();
        this.vehicle.customer = new Customer();
        this.vehicle.customer.phone = phone;
      }
    })

  }

  searchCustomerByLastName(lastName: any): void {

    console.log("searchCustomerByLastName");
    // this.unLabelList();
    this.vehicles = new Array();
    this.customers = new Array();
    this.customerService.searchCustomersByLastName(this.user.companyId, lastName).subscribe({
      next: result => {
        console.log(result);
        this.customers = result;
        this.vehicle = new Vehicle();
        this.vehicle.customer = new Customer();
        this.vehicle.customer.lastName = lastName;
      }
    })

  }

  searchPhone(phone: string) {

    console.log("===== searchPhone");

    this.vehicle = new Vehicle();
    this.vehicles = new Array();
    this.vehicle.customer = new Customer();
    this.vehicle.customer.phone = phone;
    // this.unLabelList();
    this.vehicleService.searchPhone(this.user.companyId, phone).subscribe({
      next: result => {

        this.vehicles = result;
        console.log("=====", this.vehicles);
        if (this.vehicles.length == 1) {
          this.vehicle = this.vehicles[0];
          for (var i = 0; i < this.carListStringList.length; i++) {
            if (this.carListStringList[i].brand == this.vehicle.make) {
              this.optionsModel = this.carListStringList[i].models;
            }

          }
          this.labelList(this.vehicle.damageStrings);
        }
      }
    });
  }


  searchLastName(lastName: string) {

    console.log("===== searchPhone");

    this.vehicle = new Vehicle();
    this.vehicles = new Array();
    this.vehicle.customer = new Customer();
    this.vehicle.customer.lastName = lastName;

    // this.unLabelList();
    this.vehicleService.searchLastName(this.user.companyId, lastName).subscribe({
      next: result => {

        if (result) {
          this.vehicles = result;
          console.log("=====", this.vehicles);
          if (this.vehicles.length == 1) {
            this.vehicle = this.vehicles[0];
            for (var i = 0; i < this.carListStringList.length; i++) {
              if (this.carListStringList[i].brand == this.vehicle.make) {
                this.optionsModel = this.carListStringList[i].models;
              }

            }
            //  this.labelList(this.vehicle.damageStrings);
          }
        }
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
  calculateDiff(date: string) {
    let d2: Date = new Date();
    let d1 = Date.parse(date); //time in milliseconds
    var timeDiff = d2.getTime() - d1;
    var diff = timeDiff / (1000 * 3600 * 24);
    return Math.floor(diff);
  }
  searchZip(zipCode: any, vehicle: Vehicle): void {

    this.zipToCityService.getZipInfo(zipCode).subscribe({
      next: result => {
        var data = result;
        if (data.city != '' && data.state != '') {
          vehicle.customer.city = data.city;
          vehicle.customer.state = data.state;
        }
      }
    })
  }






  checkWindowWidth(): void {
    const windowWidth = this.renderer.parentNode(this.el.nativeElement).clientWidth;

    if (windowWidth < 767) {
      $('.reminders-box').addClass("reminders-toggle");
      $('.main-content').removeClass("my-fluid-col");
    }
  }




  getVehiclesToday($event: any): void {

    this.today = new Date();
    var year = this.today.getFullYear();
    this.vehiclesToday = new Array();
    if ($event != null) {
      this.today = $event.target.value;
      this.today = new Date(this.today);
    }
    // convert to UTC
    this.today = new Date(this.today.getTime() + this.today.getTimezoneOffset() * 60000);

    var dateCarrier = {
      from: this.today,
      to: this.today,
      year: year
    };

    this.vehicleService.getAllVehiclesDate(this.user.companyId, dateCarrier).subscribe({
      next: result => {
        // console.log(result);
        if (result)
          this.vehiclesToday = result;
      }
    })
  }

  sortListPurchaseOrder(fieldName: any): void {
    this.counter++;

    if (fieldName == 'title') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a['title'].localeCompare(b['title']));
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b['title'].localeCompare(a['title']));
    }

    if (fieldName == 'description') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a['description'].localeCompare(b['description']));
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b['description'].localeCompare(a['description']));
    }

    if (fieldName == 'partNumber') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a['partNumber'].localeCompare(b['partNumber']));
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b['partNumber'].localeCompare(a['partNumber']));
    }

    if (fieldName == 'price') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.price - b.price);
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.price - a.price);
    }

    if (fieldName == 'paymentMethodId') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.paymentMethodId - b.paymentMethodId);
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.paymentMethodId - a.paymentMethodId);
    }

    if (fieldName == 'vendorId') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.vendorId - b.vendorId);
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.vendorId - a.vendorId);
    }

    if (fieldName == 'grade') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a['grade'].localeCompare(b['grade']));
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b['grade'].localeCompare(a['grade']));
    }

    if (fieldName == 'createdAt') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    if (fieldName == 'userId') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.userId - b.userId);
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.userId - a.userId);
    }
  }

  sortListAutopart(fieldName: any): void {
    this.counter++;

    if (fieldName == 'title') {
      if (this.counter % 2 == 1)
        this.autoparts = this.autoparts.sort((a, b) => a['title'].localeCompare(b['title']));
      else
        this.autoparts = this.autoparts.sort((a, b) => b['title'].localeCompare(a['title']));
    }

    if (fieldName == 'description') {
      if (this.counter % 2 == 1)
        this.autoparts = this.autoparts.sort((a, b) => a['description'].localeCompare(b['description']));
      else
        this.autoparts = this.autoparts.sort((a, b) => b['description'].localeCompare(a['description']));
    }

    if (fieldName == 'partNumber') {
      if (this.counter % 2 == 1)
        this.autoparts = this.autoparts.sort((a, b) => a['partNumber'].localeCompare(b['partNumber']));
      else
        this.autoparts = this.autoparts.sort((a, b) => b['partNumber'].localeCompare(a['partNumber']));
    }

    if (fieldName == 'price') {
      if (this.counter % 2 == 1)
        this.autoparts = this.autoparts.sort((a, b) => a.price - b.price);
      else
        this.autoparts = this.autoparts.sort((a, b) => b.price - a.price);
    }

    if (fieldName == 'paymentMethodId') {
      if (this.counter % 2 == 1)
        this.autoparts = this.autoparts.sort((a, b) => a.paymentMethodId - b.paymentMethodId);
      else
        this.autoparts = this.autoparts.sort((a, b) => b.paymentMethodId - a.paymentMethodId);
    }

    if (fieldName == 'vendorId') {
      if (this.counter % 2 == 1)
        this.autoparts = this.autoparts.sort((a, b) => a.vendorId - b.vendorId);
      else
        this.autoparts = this.autoparts.sort((a, b) => b.vendorId - a.vendorId);
    }

    if (fieldName == 'grade') {
      if (this.counter % 2 == 1)
        this.autoparts = this.autoparts.sort((a, b) => a['grade'].localeCompare(b['grade']));
      else
        this.autoparts = this.autoparts.sort((a, b) => b['grade'].localeCompare(a['grade']));
    }

    if (fieldName == 'createdAt') {
      if (this.counter % 2 == 1)
        this.autoparts = this.autoparts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      else
        this.autoparts = this.autoparts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    if (fieldName == 'userId') {
      if (this.counter % 2 == 1)
        this.autoparts = this.autoparts.sort((a, b) => a.userId - b.userId);
      else
        this.autoparts = this.autoparts.sort((a, b) => b.userId - a.userId);
    }
  }

  getCompanyAutopart(comapnyId: any, status: any): void {

    this.autopartService.getCompanyAutopart(comapnyId, status).subscribe({
      next: result => {
        // console.log(result);
        this.autoparts = result;
      }
    })
  }

  getCompanyPurchaseOrder(comapnyId: any, status: any): void {

    this.purchseOrderService.getCompanyPurchaseOrders(comapnyId, status).subscribe({
      next: result => {
        console.log(result);
        this.purchaseOrders = result;
      }
    })
  }


  getAllAutopartsWithPage(pageNumber: any, pageSize: any, status: any, archived: boolean): void {

    if (archived == true)
      this.currantPageNumberArchived = pageNumber;
    else
      this.currantPageNumberInventory = pageNumber;

    this.messageCount = "";

    const data = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      companyId: this.user.companyId,
      status: status,
      archived: archived
    };

    this.showSearchByNmberForm = false;
    this.autopartService.getCompanyAutopartStatusWithPage(data).subscribe({
      next: result => {

        if (archived == false) {
          this.autopartsInventory = result;
          if (this.autopartsInventory.length > 0) {

            this.totalCountInventory = this.autopartsInventory[0].searchCount;
            this.searchCountInventory = this.autopartsInventory.length;
            this.messageCountInventory = this.searchCountInventory + " found from " + this.totalCountInventory;
            this.pagesArrayInventory = new Array();
            this.pagesInventory = this.totalCountInventory / pageSize;

            for (let i = 1; i < this.pagesInventory + 1; i++) {
              this.pagesArrayInventory.push(i);
            }
          }
        } else {
          this.autopartsArchived = result;
          if (this.autopartsArchived.length > 0) {

            this.totalCountArchived = this.autopartsArchived[0].searchCount;
            this.searchCountArchived = this.autopartsArchived.length;
            this.messageCountArchived = this.searchCountArchived + " found from " + this.totalCountArchived;
            this.pagesArrayArchived = new Array();
            this.pagesArchived = this.totalCountArchived / pageSize;

            for (let i = 1; i < this.pagesArchived + 1; i++) {
              this.pagesArrayArchived.push(i);
            }
          }

        }
      }
    })
  }

  getAutopartDetail(autopart: any, index: any, forPurchaseOrder: boolean): void {

    this.autopart = autopart;
    this.cindexAutopart = index;
    this.messagePart = "";
    for (var i = 0; i < this.carListStringList.length; i++) {
      if (this.carListStringList[i].brand == this.autopart.make) {
        this.optionsModel = this.carListStringList[i].models;
      }
    }

    this.forPurchaseOrder = forPurchaseOrder;

    if (forPurchaseOrder == false) {
      this.formTitle = "Part Info";
      this.selectedImage = null;
    } else {
      this.formTitle = "Purchase Order";
    }

  }
  onEnterAutopart(reason: any, autopart: AutoPart): void {

    this.getCompanyAutopart(this.user.companyId, 3);

  }

  deleteAutopart(autopart: AutoPart): void {
    this.autopartService.delete(autopart.id).subscribe({
      next: result => {
        this.getCompanyAutopart(this.user.companyId, 3);
      }
    })
  }

  deletePurchseOrder(purchaseOrder: PurchaseOrder): void {
    this.purchseOrderService.delete(purchaseOrder.id).subscribe({
      next: result => {
        this.getCompanyPurchaseOrder(this.user.companyId, 3);
      }
    })
  }

  archiveAutopart(autopart: AutoPart, archive: boolean, reason: any): void {

    autopart.archived = archive;
    autopart.comments = autopart.comments + " " + reason;

    this.autopartService.update(autopart.id, autopart).subscribe({
      next: result => {
        this.getCompanyAutopart(this.user.companyId, 3);
        if (archive == false) {
          this.getAllAutopartsWithPage(this.currantPageNumberArchived, this.pageSizeArchived, 0, true)
        }
      }
    })
  }

  archivePurchaseOrder(purchaseOrder: PurchaseOrder, archive: boolean, reason: any): void {

    purchaseOrder.archived = archive;
    purchaseOrder.comments = purchaseOrder.comments + " " + reason;

    this.purchseOrderService.update(purchaseOrder.id, purchaseOrder).subscribe({
      next: result => {
        this.getCompanyPurchaseOrder(this.user.companyId, 4);
        if (archive == true) {
          this.autopart.id = 0;
          this.forPurchaseOrder = false;
          this.autopart.status = 0;
          this.saveAutopart();
        }
      }
    })
  }



  publishAutopart(autopart: AutoPart): void {

    this.displayStyleMarket = "block";

  }


  returnAutopart(autopart: AutoPart): void {
    if (autopart.status == 1)
      autopart.status = 0;
    else if (autopart.status == 0)
      autopart.status = 1;

    this.autopartService.update(autopart.id, autopart).subscribe({
      next: result => {
        this.autopart = result;
        this.getCompanyAutopart(this.user.companyId, 3);
      }
    })
  }

  setAutopartStatus(autopart: AutoPart, status: any): void {

    autopart.status = status;

    if (autopart.published == true)
      autopart.published = false;

    this.autopartService.update(autopart.id, autopart).subscribe({
      next: result => {
        this.autopart = result;
        this.getCompanyAutopart(this.user.companyId, 3);
      }
    })
  }

  // closePopupYes(): void {

  //   if (this.autopart.reason == null || this.autopart.reason == '') {
  //     this.messageReasonRejection = "Please provide a reason ...";
  //     return;
  //   }
  //   this.displayStyle = "none";
  //   console.log("reject purchse order");

  //   this.purchseOrderService.update(this.autopart.id, this.autopart).subscribe({
  //     next: result => {
  //       this.autopart = result;
  //       this.getCompanyPurchaseOrder(this.user.companyId, 4);
  //     }
  //   })

  // }

  // closePopup(): void {
  //   this.displayStyle = "none";
  //   console.log("cloase purchse order");

  // }

  closePopupYesMarket(): void {

    if (this.autopart.salePrice == null || this.autopart.salePrice == 0) {
      this.messageReasonMarket = "Please enter a sale price ...";
      return;
    }
    this.displayStyleMarket = "none";
    console.log("posting to market");
    this.autopart.reason = "posting";
    this.autopart.published = true;
    this.autopartService.update(this.autopart.id, this.autopart).subscribe({
      next: result => {
        this.autopart = result;

        for (let i = 0; i < this.autoparts.length; i++) {
          if (this.autoparts[i].id == this.autopart.id) {
            this.autoparts[i] = this.autopart;
          }
        }
        // this.getCompanyPurchaseOrder(this.user.companyId, 4);
      }
    })

  }

  closePopupMarket(): void {
    this.displayStyleMarket = "none";
    console.log("cloase posting to market");

  }

  setPurchaseOrderStatus(purchaseOrder: PurchaseOrder, status: any): void {

    if (status == 0) {
      this.displayStyle = "block";
      return;
    }

    purchaseOrder.status = status;

    if (status == 2) {
      purchaseOrder.approvedAt = new Date();
      purchaseOrder.approvedBy = this.user.id;
    }



    this.purchseOrderService.update(purchaseOrder.id, purchaseOrder).subscribe({
      next: result => {
        this.autopart = result;
        this.getCompanyPurchaseOrder(this.user.companyId, 4);
      }
    })
  }


  searchPartNumberOrTitleInventory(partNumber: any, status: any, archived: boolean): void {

    const data = {
      year: 0,
      make: "",
      model: "",
      partName: "",
      title: partNumber,
      companyId: this.user.companyId,
      partNumber: partNumber,
      status: status,
      archived: archived
      //zipcode: this.zipcode,
      //pageNumber: pageNumber,
      //pageSize: pageSize
    };

    this.autopartService.searchPartWithYearMakeModel(data).subscribe({
      next: result => {
        if (result) {
          if (archived == false)
            this.autopartsInventory = result;
          else
            this.autopartsArchived = result;
        }
        else
          this.messagePart = "No Match Found";
      }
    })

  }

  searchPartWithYearMakeModel(type: any): void {

    const data = {
      type: type,
      year: this.autopart.year,
      make: this.autopart.make,
      model: this.autopart.model,
      partName: "",
      partNumber: "",
      companyId: this.user.companyId,
      //zipcode: this.zipcode,
      //pageNumber: pageNumber,
      //pageSize: pageSize
    };

    if (this.forPurchaseOrder == false) {
      this.autopartService.searchPartWithYearMakeModel(data).subscribe({
        next: result => {
          if (result) {

            var tempArray: AutoPart[] = new Array();
            tempArray = result;
            // need to separate the inventory's
            this.autoparts = tempArray.filter(autopart => { return autopart.status == 0 || autopart.status == 1 });
            this.autopartsInventory = tempArray.filter(autopart => autopart.status == 2);

          }
          else
            this.messagePart = "No Match Found";
        }
      })
    } else {

      this.purchseOrderService.searchPartWithYearMakeModel(data).subscribe({
        next: result => {
          if (result) {

            var tempArray: AutoPart[] = new Array();
            tempArray = result;
            // need to separate the inventory's
            this.purchaseOrders = result;
            // this.autoparts = tempArray.filter(autopart => { return autopart.status == 0 || autopart.status == 1 });
            // this.autopartsInventory = tempArray.filter(autopart => autopart.status == 2);

          }
          else
            this.messagePart = "No Match Found";
        }
      })
    }

  }

  searchPartNumberOrTitle(partNumber: any): void {

    const data = {
      year: 0,
      make: "",
      model: "",
      partName: "",
      title: partNumber,
      companyId: this.user.companyId,
      partNumber: partNumber,
      //zipcode: this.zipcode,
      //pageNumber: pageNumber,
      //pageSize: pageSize
    };

    if (this.forPurchaseOrder == false) {
      this.autopartService.searchPartWithYearMakeModel(data).subscribe({
        next: result => {
          if (result)
            this.autoparts = result;
          else
            this.messagePart = "No Match Found";
        }
      })
    } else {
      this.purchseOrderService.searchPartWithYearMakeModel(data).subscribe({
        next: result => {
          if (result)
            this.purchaseOrders = result;
          else
            this.messagePart = "No Match Found";
        }
      })
    }

  }
  createNewAutopart(forPurchaseOrder: boolean): void {

    this.autopart = new AutoPart();
    this.messagePart = "";

    this.forPurchaseOrder = forPurchaseOrder;

    if (forPurchaseOrder == true) {
      this.formTitle = "Purchase Order";
    } else {
      this.formTitle = "Part Info";
    }

  }

  filterAutoparts(status: any): AutoPart[] {

    return this.autoparts.filter(autopart => autopart.status === status);
  }

  filterPurchaseOrders(status: any): any[] {

    return this.purchaseOrders.filter(autopart => autopart.status === status);
  }

  filterAutopartsInventory(status: any): AutoPart[] {

    return this.autopartsInventory.filter(autopart => autopart.status === status);
  }

  onSearchReceivedPart(searchString: any) {


  }

  openSourceLink(url: any): void {

    window.open(url, '_blank', 'location=yes,height=1000,width=800,scrollbars=yes,status=yes');
  }

  previewAutopart() {
    window.open("#/detail/" + this.autopart.id, '_blank', 'location=yes,height=1000,width=800,scrollbars=yes,status=yes');
  }


  exitPreview(): void {
    this.selectedImage = null;
  }

  saveAutopart(): void {

    console.log("saveAutopart");

    this.autopart.companyId = this.user.companyId;

    if (this.autopart.title == null || this.autopart.title == '' ||
      this.autopart.paymentMethodId == null || this.autopart.paymentMethodId == 0) {

      this.messagePart = "Please fill the form";
      return;
    }

    if (this.autopart.id > 0) {

      if (this.forPurchaseOrder == false) {
        this.autopartService.update(this.autopart.id, this.autopart).subscribe({
          next: result => {
            this.autopart = result;
            this.messagePart = "Successfully Updated";
            for (let i = 0; i < this.autoparts.length; i++) {
              if (this.autoparts[i].id == this.autopart.id) {
                this.autoparts[i] = this.autopart;
              }
            }
          }
        })
      } else {
        this.purchseOrderService.update(this.autopart.id, this.autopart).subscribe({
          next: result => {
            this.autopart = result;
            this.messagePart = "Successfully Updated";

            for (let i = 0; i < this.purchaseOrders.length; i++) {
              if (this.autopart.id == this.purchaseOrders[i].id)
                this.purchaseOrders[i] = this.autopart;
            }
          }
        })
      }
    } else {

      if (this.forPurchaseOrder == false) {
        this.autopartService.create(this.autopart).subscribe({
          next: (res) => {
            //   console.log(res);
            this.autopartReturned = res;
            this.autopart = res;
            this.messagePart = "Successfully Updated";

            // if (this.imageModels.length > 0) {
            //   for (let i = 0; i < this.imageModels.length; i++) {
            //     this.uploadImageWithFile(this.autopartReturned.id, this.imageModels[i]);
            //   }
            // }
            // if (this.imageModels.length > 0) {
            //   setTimeout(() => {
            //     window.open(`#/detail/` + this.autopartReturned.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
            //     this.message = "Posted Successfully ";
            //   }, 2000);
            // }
            this.getCompanyAutopart(this.user.companyId, 3);
          },
          error: (e) => console.error(e)
        });
      } else {
        this.purchseOrderService.create(this.autopart).subscribe({
          next: (res) => {
            //   console.log(res);
            // this.autopartReturned = res;
            this.autopart = res;
            this.messagePart = "Successfully Updated";
            this.getCompanyPurchaseOrder(this.user.companyId, 4);

          },
          error: (e) => console.error(e)
        });
      }
    }
  }

  setImage(index: any): void {

    this.selectedImage = this.autopart.imageModels[index].id;
  }

  setImageForSearch(autopartId: any, imageId: any) {


    console.log("setImageForSearch");

    this.autopartService.setImageForSearch(imageId, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.autopartService.get(autopartId).subscribe({
          next: (result => {
            console.log(result);
            this.autopart = result;
            this.selectedImage = this.autopart.showInSearchImageId;

          })
        });
      }
    });
  }

  deleteImage(autopartId: any, imageId: any) {


    console.log("deleteImage");

    this.autopartService.deleteImage(imageId, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.autopartService.get(autopartId).subscribe({
          next: (result => {
            console.log(result);
            this.autopart = result;
            this.selectedImage = this.autopart.showInSearchImageId;

          })
        });
      }
    });
  }

  setShowInSearch(index: any): void {

    for (let i = 0; i < this.imageModels.length; i++) {

      this.imageModels[i].showInSearch = false;
      if (i == index) {
        this.imageModels[i].showInSearch = true;
        this.imageUrl = this.imageModels[i].picByte;
      }
      else
        this.imageModels[i].showInSearch = false;
    }

  }

  onSelectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;

          this.uploadImage(this.autopart.id, imageModel);

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

  uploadImage(autopartId: any, imageModel: ImageModel) {

    this.autopartService.uploadImage(imageModel, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.autopart.imageModels.push(result);
      }
    });
  }


  private uploadImageWithFile(autopartId: any, imageModel: ImageModel) {

    //this.submitted = true;
    console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', autopartId) //other param
    // formData.append('path', 'temp/') //other param

    this.autopartService.uploadImageWithFile(formData, autopartId).subscribe({
      next: (result) => {
        console.log(result);
      }
    });


  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }


  getVehiclesTodayString(dateString: any): void {

    this.today = new Date(dateString);

    var year = this.today.getFullYear();
    this.vehiclesToday = new Array();
    // convert to UTC
    this.today = new Date(this.today.getTime() + this.today.getTimezoneOffset() * 60000);

    var dateCarrier = {
      from: this.today,
      to: this.today,
      year: year
    };

    this.vehicleService.getAllVehiclesDate(this.user.companyId, dateCarrier).subscribe({
      next: result => {
        console.log(result);
        if (result)
          this.vehiclesToday = result;
      }
    })
  }

  // onSaveNote($event: any): void {

  //   const note = {
  //     notes: $event.target.value,
  //     color: this.note.color,
  //     userId: this.user.id,
  //     companyId: this.user.companyId,
  //     id: this.note.id
  //   }

  //   this.noteService.createNote(this.currentUser.id, note).subscribe({
  //     next: result => {
  //       if (result) {
  //         this.note = result;
  //         var hasIt: boolean = false;
  //         for (let note of this.notes) {
  //           if (note.id == this.note.id) {
  //             hasIt = true;
  //           }
  //         }
  //         if (hasIt == false)
  //           this.notes.unshift(this.note);

  //         this.note = new Note();
  //       }
  //     }
  //   })

  // }

  // getNoteDetail(note: Note): void {
  //   this.note = note;
  // }

  // deleteNote(note: Note): void {

  //   this.noteService.deleteNote(note.id).subscribe({
  //     next: result => {

  //       var index: any = 0;
  //       for (let note1 of this.notes) {
  //         if (note1.id == note.id) {
  //           this.notes.splice(index, 1);
  //         }

  //         index++;
  //       }
  //       this.note = new Note();
  //     }
  //   });
  // }

  // droppedNote(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(
  //     this.notes,
  //     event.previousIndex,
  //     event.currentIndex
  //   );

  //   var sequenceCarriers: SequenceCarrier[] = new Array();
  //   for (let i = 0; i < this.notes.length; i++) {
  //     let sequenceCarrier = new SequenceCarrier();
  //     sequenceCarrier.id = this.notes[i].id;
  //     sequenceCarrier.index = i;
  //     sequenceCarriers.push(sequenceCarrier);
  //   }

  //   this.noteService.updateSeqence(this.user.companyId, sequenceCarriers).subscribe({
  //     next: result => {

  //       if (result) {
  //         this.notes = result;
  //         this.notes = this.notes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  //       }
  //     }
  //   })
  // }

  // getAllNotes(companyId: any): void {

  //   this.notes = new Array();

  //   this.noteService.getAllCompanyNote(companyId).subscribe({
  //     next: result => {
  //       if (result != null)
  //         this.notes = result;
  //       this.notes = this.notes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  //     }
  //   })
  // }

  // addNewNote(): void {
  //   this.note = new Note();
  // }
  // setJobId(jobId: any) {
  //   this.currentJobId = jobId;
  // }

  // randomString(): string {
  //   const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZABCDEFGHIJKLMNOPQRSTUVWXTZ';
  //   const stringLength = 7;
  //   let randomstring = '';
  //   for (let i = 0; i < stringLength; i++) {
  //     const rnum = Math.floor(Math.random() * chars.length);
  //     if (i == 3)
  //       randomstring += "-";
  //     else
  //       randomstring += chars.substring(rnum, rnum + 1);
  //   }

  //   return randomstring;
  // }

  randomStringCounterInvoice(): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZABCDEFGHIJKLMNOPQRSTUVWXTZ';
    const stringLength = 11;
    let randomstring = '';
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      if (i == 3 || i == 7)
        randomstring += "-";
      else
        randomstring += chars.substring(rnum, rnum + 1);
    }

    return randomstring;
  }

  createCounterInvoiceItem(counterInvoiceId: any): void {

    let counterInvoiceItem: CounterInvoiceItem = new CounterInvoiceItem();
    counterInvoiceItem.name = "change Me";
    counterInvoiceItem.userId = this.user.id;
    counterInvoiceItem.amount = 0;
    counterInvoiceItem.quantity = 1;
    counterInvoiceItem.counterInvoiceId = counterInvoiceId;
    counterInvoiceItem.notes = "Please specify";
    counterInvoiceItem.invoiceNumber = this.randomString();

    this.counterInvoiceService.createCounterInvoiceItem(this.user.id, counterInvoiceItem).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.counterInvoiceItem = result;
          this.getAllCounterInvoiceItems(counterInvoiceId);
        }
      }
    })

  }

  getAllCounterInvoiceItems(counterInvoiceId: any): void {

    this.counterInvoiceItems = new Array();
    this.counterInvoiceService.getCounterInvoiceItem(counterInvoiceId).subscribe({
      next: result => {
        // console.log(result);
        if (result)
          this.counterInvoiceItems = result;
        else
          this.counterInvoiceItems = new Array();

        if (this.counterInvoice.id > 0) {
          var total = this.getTotal();
          if (this.counterInvoice.amount != total) {
            this.counterInvoice.amount = this.getTotal();

            this.counterInvoiceService.createCounterInvoice(this.currentUser.id, this.counterInvoice).subscribe({
              next: result => {
                if (result)
                  this.counterInvoice = result;
                this.syncCounterInvoice();
              }
            })

          }

        }
      }
    })
  }

  onChangeCounterInvoicePaymentMethod($event: any, paymentMethodId: any, counterInvoice: CounterInvoice): void {

    counterInvoice.paymentMethod = paymentMethodId;
    counterInvoice.reason = "payment method";
    this.counterInvoiceService.createCounterInvoice(this.currentUser.id, counterInvoice).subscribe({
      next: result => {
        if (result)
          this.counterInvoice = result;

        this.syncCounterInvoice();

      }
    })

  }
  private syncCounterInvoice() {
    if (this.counterInvoices.length > 0) {
      for (let i = 0; i < this.counterInvoices.length; i++) {
        if (this.counterInvoice.id == this.counterInvoices[i].id)
          this.counterInvoices[i] = this.counterInvoice;
      }
    }
  }

  onSearchInvoiceNumber($event: any, invoiceNumberIn: any): void {

    this.errorMessageCounterInvoiceSearch = "";
    var invoiceNumber = invoiceNumberIn.toUpperCase();
    if (invoiceNumber.length == 11) {
      this.counterInvoiceService.searchCounterInvoice(this.user.companyId, invoiceNumber).subscribe({
        next: result => {
          console.log(result);
          if (result) {
            this.counterInvoices = result;
            for (let counterInvoice1 of this.counterInvoices) {
              // this.vehicle.customer = counterInvoice1.customer;
            }
          } else {
            this.errorMessageCounterInvoiceSearch = "No Match Found";
          }
        }
      })

    } else {
      this.errorMessageCounterInvoiceSearch = "11 characters required eg. GZ2-7HJ-EMG";
    }
  }

  getAllCounterInvoiceWithPage(pageNumber: any, pageSize: any): void {

    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    this.currantPageNumber = pageNumber;
    this.messageCount = "";

    const data = {
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize
    };

    this.vehicle.customer = new Customer();
    this.customer = new Customer();

    this.showSearchByNmberForm = false;
    this.counterInvoiceService.searchCounterInvoiceWithPage(this.user.companyId, data).subscribe({
      next: result => {
        this.counterInvoices = result;
        if (this.counterInvoices.length > 0) {

          this.totalCount = this.counterInvoices[0].totalCount;
          this.searchCount = this.counterInvoices[0].searchCount;
          this.messageCount = this.searchCount + " found from " + this.totalCount;
          this.pagesArray = new Array();
          this.pages = this.totalCount / pageSize;

          for (let i = 1; i < this.pages + 1; i++) {
            this.pagesArray.push(i);
          }
        }

      }
    })
  }

  createCounterInvoice(customerId: any): void {

    let counterInvoice: CounterInvoice = new CounterInvoice();
    counterInvoice.type = "Invoice";
    counterInvoice.name = "change Me";
    counterInvoice.userId = this.user.id;
    counterInvoice.companyId = this.user.companyId;
    counterInvoice.amount = 0;
    counterInvoice.customerId = customerId;
    // counterInvoice.customerId = this.customer.id;
    counterInvoice.notes = "Please specify";
    counterInvoice.invoiceNumber = this.randomStringCounterInvoice();
    counterInvoice.headingName = this.headingName;
    counterInvoice.headingDescription = this.headingDescription;
    counterInvoice.headingQuantity = this.headingQuantity;
    counterInvoice.headingSubtotal = this.headingSubtotal;

    this.errorMessageCounterInvoiceSearch = "";

    this.counterInvoiceItems = new Array();

    this.counterInvoiceService.createCounterInvoice(this.user.id, counterInvoice).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.counterInvoice = result;

          //this.getCutomerCounterInvoice(customerId);
          this.counterInvoiceService.getAllCustomerCounterInvoices(customerId).subscribe({
            next: result => {
              console.log(result);
              if (result)
                this.counterInvoices = result;
              this.counterInvoices = this.counterInvoices.sort((a, b) => a.id - b.id);
            }
          })
          const element = <HTMLInputElement>document.querySelector("[id='openModalButton']");
          if (element != null) {
            console.log("found it ====== " + this.counterInvoice.id);
            element.click();
          }
          //this.getCounterInvoiceDetailNoIndex(this.counterInvoice);
          //  document.getElementById("openModalButton").click();
        }
      }
    })


  }

  // printPage(componentId: string, title: any) {

  //   const elementImage = <HTMLElement>document.querySelector("[id='" + componentId + "']");
  //   const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
  //   WindowPrt?.document.write('<title>' + title + '</title>');
  //   WindowPrt?.document.write("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">")
  //   //WindowPrt?.document.write("<link href=\"./stylecss\" rel=\"stylesheet\">")
  //   WindowPrt?.document.write('<style type=\"text/css\">th{color: white;background: rgb(13, 173, 226);}</style>');
  //   WindowPrt?.document.write(elementImage.innerHTML);
  //   WindowPrt?.document.write('<script>onload = function() { window.print(); }</script>');
  //   WindowPrt?.document.close();
  //   WindowPrt?.focus();

  // }

  getSubtotal(): number {
    var total: number = 0;
    for (let counterInvoiceItem of this.counterInvoiceItems) {
      // if (counterInvoiceItem.id == 504)
      //   total += (counterInvoiceItem.quantity) * (counterInvoiceItem.amount) ;
      // else
      total += ((counterInvoiceItem.quantity) * (counterInvoiceItem.amount));
    }

    return +total.toFixed(2);
  }

  getTax(): number {
    var total: number = 0;
    for (let counterInvoiceItem of this.counterInvoiceItems) {
      total += ((counterInvoiceItem.quantity) * (counterInvoiceItem.amount));
    }
    //(Math.round(2.782061 * 100) / 100).toFixed(2)
    return +(Math.round(total * this.company.taxRate)).toFixed(2);
  }

  getTotal(): number {
    return +(this.getSubtotal() + this.getTax()).toFixed(2);
  }

  onChangeCounterInvoiceDate($event: any): void {

    if (this.counterInvoice != null) {
      this.counterInvoice.createdAt = $event.target.value;
    }
  }

  // onChangeNoTax($event: any): void {

  //   var isCheck: boolean = $event.target.checked;
  //   if (isCheck == true) {
  //     this.company.taxRate = 0.00;
  //   } else {
  //     this.company.taxRate = this.companyDefaultTaxRate;
  //   }

  // }

  deleteCounterInvoiceItem($event: any, counterInvoiceItem: CounterInvoiceItem) {
    console.log("deleteCounterInvoiceItem" + counterInvoiceItem.id);

    this.counterInvoiceService.deleteCounterInvoiceItem(counterInvoiceItem.id).subscribe({
      next: result => {
        console.log(result);
        this.getAllCounterInvoiceItems(this.counterInvoice.id);

      }
    })

  }

  deleteCounterInvoice($event: any, counterInvoice: CounterInvoice) {
    console.log("deleteCounterInvoice" + counterInvoice.id);
    this.counterInvoice = new CounterInvoice();
    this.counterInvoiceItems = new Array();
    this.counterInvoiceService.deleteCounterInvoice(counterInvoice.id).subscribe({
      next: result => {
        console.log(result);
        let index = 0;
        for (let counterInvoice2 of this.counterInvoices) {
          if (counterInvoice.id == counterInvoice2.id) {
            this.counterInvoices.splice(index, 1);
          }

          index++;
        }
        // this.getCutomerCounterInvoice(this.vehicle.customer.id);

      }
    })

  }



  onEnterCounterInvoice(reason: any, counterInvoice: CounterInvoice): void {

    counterInvoice.reason = reason;
    this.counterInvoiceService.createCounterInvoice(this.currentUser.id, counterInvoice).subscribe({
      next: result => {
        if (result)
          this.counterInvoice = result;
        this.syncCounterInvoice();
      }
    })
  }

  onEnterCounterInvoiceItem(reason: any, counterInvoiceItem: CounterInvoiceItem): void {

    counterInvoiceItem.reason = reason;
    this.counterInvoiceService.createCounterInvoiceItem(this.currentUser.id, counterInvoiceItem).subscribe({
      next: result => {
        if (result)
          this.counterInvoiceItem = result;
        if (this.counterInvoice.id > 0) {
          var total = this.getTotal();
          if (this.counterInvoice.amount != total) {
            this.counterInvoice.amount = this.getTotal();

            this.counterInvoiceService.createCounterInvoice(this.currentUser.id, this.counterInvoice).subscribe({
              next: result => {
                if (result)
                  this.counterInvoice = result;
                this.syncCounterInvoice();
              }
            })

          }

        }

      }
    })
  }

  setCounterInvoice(counterInvoiceId: any): void {
    this.currentReceiptId = counterInvoiceId;
    //  console.log(this.currentReceiptId);
  }

  droppedCounterInvoiceItem(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.counterInvoiceItems,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.counterInvoiceItems.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.counterInvoiceItems[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.counterInvoiceService.updateSeqence(this.counterInvoice.id, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.counterInvoiceItems = result;
          this.counterInvoiceItems = this.counterInvoiceItems.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    })

  }

  // getVehicleHistory(vehicleId: any): void {
  //   console.log("getVehicleHistory");
  //   this.showVehicleHistory = !this.showVehicleHistory;
  //   if (this.showVehicleHistory == true) {
  //     this.vehicleHistoryService.getVehicleHistory(vehicleId).subscribe({
  //       next: result => {
  //         console.log(result);
  //         this.vehicleHistories = result;
  //       }
  //     })
  //   }
  // }
  // clearCustomers(): void {
  //   this.errorMessage = "";
  //   this.successMessage = "";
  //   this.customers = new Array();
  //   this.customer = new Customer();
  // }
  // getVehicle(vehicleId: any): void {

  //   this.vehicleService.getVehicle(vehicleId).subscribe({

  //     next: result => {

  //       console.log(result);
  //       this.vehicle = result;
  //       if (this.vehicles.length > 0) {
  //         for (let i = 0; i < this.vehicles.length; i++) {
  //           if (this.vehicle.id == this.vehicles[i].id) {
  //             this.vehicles[i] = this.vehicle;
  //           }
  //         }
  //       }
  //       console.log(this.vehicle.damages);
  //       this.labelList(this.vehicle.damageStrings);

  //     }
  //   });


  // }

  // onSearchChange($event: any): void {
  //   // console.log($event.target.value);

  //   if (this.vehiclesOriginal.length > 0)
  //     this.vehicles = this.vehiclesOriginal.filter(vehicle => vehicle.serachString.toLowerCase().includes($event.target.value));

  // }
  // onSearchChangeCustomer($event: any): void {

  //   var input = $event.target.value;
  //   console.log(input);
  //   if (input.length > 1) {
  //     console.log($event.target.value);

  //     this.customers = new Array();
  //     this.customerService.searchCustomersByLastName(this.user.companyId, $event.target.value).subscribe({
  //       next: result => {
  //         if (result) {
  //           console.log(result);
  //           // this.vehicle = new Vehicle();
  //           this.customers = result;
  //         }
  //       }
  //     })
  //   }
  // }

  // onSearchChangeCustomerVehicle($event: any): void {
  //   var input = $event.target.value;
  //   console.log(input);
  //   if (input.length > 1) {
  //     this.vehicles = new Array();
  //     this.vehicleService.searchLastName(this.user.companyId, $event.target.value).subscribe({
  //       next: result => {
  //         if (result) {
  //           console.log(result);
  //           this.vehicles = result;
  //         }
  //       }
  //     })
  //   }
  // }


  onSearchChangeVehicleVin($event: any): void {
    console.log($event.target.value);

    if ($event.target.value.length == 8) {
      this.vehicles = new Array();
      this.vehicleService.searchVehicleVin6(this.user.companyId, $event.target.value).subscribe({
        next: result => {
          if (result) {
            console.log(result);
            this.vehicles = result;
          }
        }
      })
    }
  }

  // private labelList(damageStrings: string[]) {
  //   this.optionsShotCodes = new Array();
  //   for (let damage of damageStrings) {
  //     const element = <HTMLInputElement>document.querySelector("[id='" + damage + "']");
  //     //console.log("checked ", element.checked);
  //     element.click();
  //   }
  // }

  // private unLabelList() {
  //   this.optionsShotCodes = new Array();
  //   for (let damage of this.optionsDamage) {
  //     const element = <HTMLInputElement>document.querySelector("[id='" + damage + "']");
  //     //console.log("checked ", element.checked);
  //     try {
  //       if (element.checked == true) {
  //         element.click();
  //       }
  //     } catch { }
  //   }
  // }

  // private LabelListTest(damageStrings: string[]) {
  //   this.optionsShotCodes = new Array();
  //   for (let damage of this.optionsDamage) {
  //     const element = <HTMLInputElement>document.querySelector("[id='" + damage + "']");
  //     //console.log("checked ", element.checked);
  //     if (damageStrings.includes(damage)) {
  //       if (element.checked == true) {

  //       } else {
  //         element.click();
  //       }
  //     } else {
  //       if (element.checked == true) {
  //         element.click();
  //       }
  //     }
  //   }
  // }

  // getUserById(userId: any): void {

  //   this.userService.getUserById(userId).subscribe({
  //     next: result => {
  //       //console.log(result);
  //       this.user = result;

  //       if (this.user.companyId != 0) {
  //         this.getAllComponyUsers(this.user.companyId);
  //         this.getAllComponyEmployees(this.user.companyId);
  //         this.getSettings(this.user.companyId);
  //         // this.getAllService(this.user.companyId);
  //         // this.getAllStatus(this.user.companyId);
  //         // this.getAllLocations(this.user.companyId);
  //         // this.getAllNotes(this.user.companyId);
  //         // this.getAllInsurancer(this.user.companyId);
  //         // this.getAllInTakeWay(this.user.companyId);
  //         // this.getAllPaymentStatus(this.user.companyId);
  //         // this.getAllPaymentMethod(this.user.companyId);
  //         // this.getAllPaymentType(this.user.companyId);
  //         // this.getAllJobRequestType(this.user.companyId);
  //         // this.getAllApprovalStatus(this.user.companyId);
  //         this.getAllNotes(this.user.companyId);
  //         this.getVehiclesToday(null);
  //         this.getVehicleReportDail(this.user.companyId);
  //       }

  //     }
  //   })

  // }

  // getSettings(companyId: any): void {

  //   this.settingService.getSetting(companyId).subscribe({
  //     next: result => {
  //       if (result) {

  //         this.setting = result;
  //         // this.employeeRoles = this.setting.employeeRoles;
  //         this.jobRequestTypes = this.setting.JobRequestTypes;
  //         this.paymentMethods = this.setting.paymentMethods;
  //         this.approvalStatuss = this.setting.approvalStatuss;
  //         this.paymentStatuss = this.setting.paymentStatuss;
  //         this.services = this.setting.services;
  //         this.locations = this.setting.locations;
  //         this.insurancers = this.setting.insurancers;
  //         this.vendors = this.setting.vendors;
  //         this.inTakeWays = this.setting.inTakeWays;
  //         this.statuss = this.setting.statuss;
  //         this.rentals = this.setting.rentals;
  //         this.paymentTypes = this.setting.paymentTypes;
  //         this.disclaimers = this.setting.disclaimers;

  //         for (let disclaimer of this.disclaimers) {
  //           if (disclaimer.isDefault == true) {
  //             this.disclaimerId = disclaimer.id;
  //             this.disclaimerText = disclaimer.text;
  //           }
  //         }

  //         this.company = this.setting.company;
  //         this.companyDefaultTaxRate = this.company.taxRate;
  //         this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
  //       }
  //     }
  //   })
  // }

  // setDisclaimerText(disclaimerId: any): void {

  //   this.disclaimerText = "";
  //   for (let disclaimer of this.disclaimers) {
  //     if (disclaimer.id == disclaimerId) {
  //       this.disclaimerText = disclaimer.text;
  //     }
  //   }

  // }

  getAllInTakeWay(comapnyId: any): void {

    this.inTakeWayService.getAllCompanyInTakeWay(comapnyId).subscribe({
      next: result => {
        this.inTakeWays = result;
      }
    })
  }
  getVehicleReportDail(companyId: any): void {

    var data = {
      from: new Date(),
      range: 10,
    }
    this.vehicleService.getVehicleCountDaily(companyId, data).subscribe({
      next: result => {
        if (result) {
          //   console.log(result);
          this.reportCarrier = result;
        }
      }
    })
  }

  getAllInsurancer(companyId: any): void {

    this.insurancerService.getAllCompanyInsurancer(companyId).subscribe({
      next: result => {
        this.insurancers = result;
      }
    })
  }
  // getAllComponyUsers(companyId: any): void {

  //   this.userService.getAllCompanyUsers(companyId).subscribe({
  //     next: result => {
  //       if (result)
  //         this.users = result;
  //       // this.employees = result;
  //     }
  //   });
  // }

  // getAllComponyEmployees(companyId: any): void {

  //   this.employeeService.getComponyEmployees(companyId).subscribe({
  //     next: result => {
  //       if (result)
  //         //this.users = result;
  //         this.employees = result;
  //     }
  //   });
  // }


  // getAllPaymentType(companyId: any): void {

  //   this.paymentStatuss = new Array();

  //   this.paymentTypeService.getAllCompanyPaymentType(companyId).subscribe({
  //     next: result => {

  //       //console.log(result);
  //       if (result)
  //         this.paymentTypes = result;
  //     }
  //   })
  // }

  // getAllApprovalStatus(companyId: any): void {

  //   this.approvalStatuss = new Array();

  //   this.approvalStatusService.getAllCompanyApprovalStatus(companyId).subscribe({
  //     next: result => {
  //       if (result != null)
  //         this.approvalStatuss = result;
  //     }
  //   })
  // }

  // getAllPaymentMethod(companyId: any): void {

  //   this.paymentMethods = new Array();

  //   this.paymentMethodService.getAllCompanyPaymentmethod(companyId).subscribe({
  //     next: result => {

  //       //console.log(result);
  //       if (result)
  //         this.paymentMethods = result;
  //     }
  //   })
  // }

  // getAllPaymentStatus(companyId: any): void {

  //   this.paymentStatuss = new Array();

  //   this.paymentStatusService.getAllCompanyPaymentStatus(companyId).subscribe({
  //     next: result => {

  //       //console.log(result);
  //       if (result)
  //         this.paymentStatuss = result;
  //     }
  //   })
  // }

  // getAllStatus(companyId: any): void {

  //   this.statuss = new Array();

  //   this.statusService.getAllCompanyStatus(companyId).subscribe({
  //     next: result => {

  //       if (result) {
  //         console.log(result);
  //         this.statuss = result;
  //       }
  //     }
  //   })
  // }

  // getAllLocations(companyId: any): void {

  //   this.locations = new Array();

  //   this.locationService.getAllCompanyLocation(companyId).subscribe({
  //     next: result => {

  //       if (result) {
  //         console.log(result);
  //         this.locations = result;
  //       }
  //     }
  //   })
  // }

  // resetUser(user: User): void {

  //   if (this.user.companyId != 0) {
  //     this.getAllStatus(user.companyId);
  //     this.getAllLocations(user.companyId);
  //     this.getAllPaymentStatus(user.companyId);
  //     this.getAllPaymentMethod(user.companyId);
  //     this.getAllJobRequestType(this.user.companyId);

  //   }
  // }
  // getAllUsers(): void {
  //   for (let i = 0; i < this.user.roles.length; i++) {
  //     if (this.user.roles[i].name == 'ROLE_ADMIN') {

  //       this.userService.getAllUsers(this.currentUser.id).subscribe({
  //         next: result => {
  //           console.log(result);
  //           this.users = result;
  //         }
  //       })
  //     }
  //   }
  // }

  // allowUpdateVehicleStatus(): boolean {

  //   if (this.user.allowAddAndUpdateVehicle)
  //     return false;
  //   else
  //     return true;
  // }

  // setStep(step: any): void {
  //   this.step = step;
  // }


  // createVehicle(vehicle: Vehicle): void {

  //   this.errorMessage = "";
  //   this.successMessage = "";
  //   this.successMessageVehicle = "";
  //   this.errorMessageVehicle = "";
  //   console.log("createVehicle");
  //   var isNewVehicle: boolean = false;

  //   console.log("createVehicle: " + this.step);

  //   if (this.vehicle.customer.firstName == null
  //     || this.vehicle.customer.firstName == ""
  //     || this.vehicle.customer.lastName == null
  //     || this.vehicle.customer.lastName == ""
  //     || this.vehicle.customer.phone == null
  //     || this.vehicle.customer.phone == ""
  //     || this.vehicle.customer.street == null
  //     || this.vehicle.customer.stree == ""
  //     || this.vehicle.customer.city == null
  //     || this.vehicle.customer.city == ""
  //     || this.vehicle.customer.state == null
  //     || this.vehicle.customer.state == ""
  //     || this.vehicle.customer.zip == null
  //     || this.vehicle.customer.zip == "") {
  //     this.errorMessage = "Please fill the form";
  //     return;
  //   }



  //   if (this.vehicle.year == null
  //     || this.vehicle.year == ""
  //     || this.vehicle.make == null
  //     || this.vehicle.make == ""
  //     || this.vehicle.model == null
  //     || this.vehicle.model == ""
  //     || this.vehicle.color == null
  //     || this.vehicle.color == ""
  //     || this.vehicle.workRequest == null
  //     || this.vehicle.workRequest == ""
  //     || this.vehicle.price == null
  //     || this.vehicle.price == ""
  //     || this.vehicle.jobRequestType == null
  //     || this.vehicle.jobRequestType == "") {

  //     this.errorMessageVehicle = "Please fill the form, Year/Make/Model/Color/Work Request/Price/Job Request Type are required";
  //     return;
  //   }






  //   // if (this.step != 0) {
  //   //   const element = <HTMLButtonElement>document.querySelector("[id='nav-vehicle-tab']");
  //   //   if (element)
  //   //     element.click();

  //   //   this.refresh();
  //   // }

  //   if (vehicle.id == 0) {
  //     isNewVehicle = true;
  //     vehicle.reason = "new";
  //   } else {
  //     vehicle.reason = "update";
  //   }
  //   //vehicle.customerId = 1;
  //   // this.optionsShotCodes = new Array();
  //   // for (let damage of this.optionsDamage) {
  //   //   const element = <HTMLInputElement>document.querySelector("[id='" + damage + "']");
  //   //   //console.log("checked ", element.checked);
  //   //   try {
  //   //     if (element.checked == true) {
  //   //       this.optionsShotCodes.push(damage);
  //   //     }
  //   //   } catch { }

  //   //   this.vehicle.damages = this.optionsShotCodes.toLocaleString();
  //   //   // console.log(this.vehicle.damages);
  //   // }



  //   vehicle.sequenceNumber = 0;

  //   vehicle.companyId = this.user.companyId;
  //   vehicle.customer.companyId = this.user.companyId;

  //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({

  //     next: async result => {

  //       console.log(result);

  //       this.vehicle = result;

  //       this.base64Image = "";

  //       this.successMessageVehicle = "Successfully updated";

  //       this.editModeCustomer = false;
  //       this.editModeVehicle = false;

  //       // setTimeout(() => {

  //       //   const elementImage = <HTMLElement>document.querySelector("[id='usa_image3']");

  //       //   var backgroundColorHex = " #FFFFFF";
  //       //   htmlToImage.toJpeg(elementImage, { backgroundColor: backgroundColorHex })
  //       //     .then((dataUrl) => {

  //       //       const imageModel = {
  //       //         id: this.vehicle.imageModels[0]?.id,
  //       //         vehicleIdIn: this.vehicle.id,
  //       //         picByte: dataUrl
  //       //       }

  //       //       this.vehicleService.uploadImage(imageModel, this.vehicle.id).subscribe({
  //       //         next: result => {
  //       //           console.log("uploadImage");
  //       //           console.log(result);
  //       //           if (isNewVehicle == true && this.vehicles) {
  //       //             this.vehicle.imageModels.push(result);
  //       //             this.vehicles.unshift(this.vehicle);
  //       //           }

  //       //           this.successMessageVehicle = "Successfully updated";
  //       //         }
  //       //       });

  //       //       // document.body.appendChild(img);
  //       //     })
  //       //     .catch(function (error) {
  //       //       console.error('oops, something went wrong!', error);
  //       //     });

  //       // }, 100);
  //     }
  //   });


  // }

  // getPriorDamageWordCount(): number {

  //   if (this.vehicle.priorDamage) {

  //     var words = this.vehicle.priorDamage.split(/\s+/);
  //     if (words)
  //       return words.length;
  //   }

  //   return 0;
  // }
  // getDetail(vehicle: Vehicle, index: any): void {

  //   this.vehicle = vehicle;
  //   this.errorMessage = "";
  //   this.successMessage = "";
  //   this.errorMessageVehicle = "";
  //   this.successMessageVehicle = "";
  //   //this.getVehicle(vehicle.id);

  //   for (var i = 0; i < this.carListStringList.length; i++) {
  //     if (this.carListStringList[i].brand == this.vehicle.make) {
  //       this.optionsModel = this.carListStringList[i].models;
  //     }

  //   }

  //   var hasItMake = false;
  //   for (let make of this.optionsMake) {
  //     if (make == this.vehicle.make) {
  //       hasItMake = true;
  //     }
  //   }
  //   if (!hasItMake) {
  //     this.optionsMake.push(this.vehicle.make);
  //   }


  //   var hasIt = false;
  //   for (let model of this.optionsModel) {
  //     if (model == this.vehicle.model) {
  //       hasIt = true;
  //     }
  //   }
  //   if (!hasIt) {
  //     this.optionsModel.push(this.vehicle.model);
  //   }

  //   // this.unLabelList();
  //   // this.labelList(this.vehicle.damageStrings);

  //   //this.LabelListTest(this.vehicle.damageStrings);

  //   this.cindex = index;

  //   this.vehicleHistories = new Array();
  //   this.getVehicleJobs2(vehicle.id);
  //   this.getVehiclePayments(vehicle.id);

  //   // this.getVehicleJobs(vehicle.id);


  // }

  // getDetail2(vehicle: Vehicle, index: any): void {

  //   this.vehicle = vehicle;
  //   this.errorMessage = "";
  //   this.successMessage = "";
  //   this.errorMessageVehicle = "";
  //   this.successMessageVehicle = "";
  //   this.vehicles = new Array();
  //   //this.getVehicle(vehicle.id);

  //   for (var i = 0; i < this.carListStringList.length; i++) {
  //     if (this.carListStringList[i].brand == this.vehicle.make) {
  //       this.optionsModel = this.carListStringList[i].models;
  //     }

  //   }

  //   var hasIt = false;
  //   for (let model of this.optionsModel) {
  //     if (model == this.vehicle.model) {
  //       hasIt = true;
  //     }
  //   }
  //   if (!hasIt) {
  //     this.optionsModel.push(this.vehicle.model);
  //   }
  //   // this.unLabelList();
  //   // this.labelList(this.vehicle.damageStrings);

  //   //this.LabelListTest(this.vehicle.damageStrings);

  //   this.cindex = index;

  //   this.vehicleHistories = new Array();
  //   this.getVehicleJobs2(vehicle.id);
  //   this.getVehiclePayments(vehicle.id);
  //   // this.getVehicleJobs(vehicle.id);


  // }

  // isInVehicleJobs(employeeId: any, serviceId: any): boolean {

  //   for (let job of this.jobs) {
  //     if (job.employeeId == employeeId && job.serviceId == serviceId)
  //       return true;
  //   }
  //   return false;
  // }

  // createJob(vehicleId: any, serviceName: any, serviceId: any, employeeId: any): void {

  //   const job = {
  //     userId: this.currentUser.id,
  //     name: serviceName,
  //     serviceId: serviceId,
  //     vehicleId: vehicleId,
  //     employeeId: employeeId,
  //     notes: "",
  //     targetDate: new Date()
  //   };

  //   console.log("createJob");
  //   this.jobService.createJob(this.currentUser.id, job).subscribe({
  //     next: result => {
  //       this.job = result;
  //     }
  //   })
  // }

  // onChangeCalendar($event: any, job: Job): void {

  //   job.targetDate = $event.target.value;
  //   job.reason = "calender"
  //   console.log($event.target.value);
  //   console.log("onChangeCalendar");
  //   this.jobService.createJob(this.currentUser.id, job).subscribe({
  //     next: result => {
  //       console.log(result);
  //       this.job = result;
  //       job.reason = "";
  //     }
  //   })
  // }

  // onChangeVehiclePaymentCalendar($event: any, payment: Payment): void {

  //   payment.date = $event.target.value;
  //   payment.reason = "calender"
  //   console.log($event.target.value);
  //   console.log("onChangeVehiclePaymentCalendar");
  //   this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
  //     next: result => {
  //       console.log(result);
  //       this.payment = result;
  //       payment.reason = "";
  //     }
  //   })
  // }

  // onChangeVehicleCalendar($event: any, vehicle: Vehicle): void {
  //   vehicle.targetDate = $event.target.value;
  //   if (vehicle.id > 0) {

  //     vehicle.reason = "targetDate";
  //     this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
  //       next: result => {
  //         if (result) {
  //           this.vehicle = result;
  //           vehicle = this.vehicle;
  //           vehicle.reason = "";
  //         }
  //       }
  //     })
  //   }
  // }

  // onChangeVehicleCalendarRental($event: any, vehicle: Vehicle): void {
  //   vehicle.rentalDate = $event.target.value;
  //   if (vehicle.id > 0) {

  //     vehicle.reason = "rentalDate";
  //     this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
  //       next: result => {
  //         if (result) {
  //           this.vehicle = result;
  //           vehicle = this.vehicle;
  //           vehicle.reason = "";
  //         }
  //       }
  //     })
  //   }
  // }

  // onSavePriorDamage(vehicle: Vehicle): void {
  //   vehicle.reason = "Prior Damage";
  //   if (vehicle.id > 0) {

  //     vehicle.reason = "targetDate";
  //     this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
  //       next: result => {
  //         if (result) {
  //           this.vehicle = result;
  //           vehicle = this.vehicle;
  //           vehicle.reason = "";
  //         }
  //       }
  //     })
  //   }
  // }

  // onChangeVehicleCalendar2($event: any, vehicle: Vehicle): void {
  //   vehicle.targetDate = $event.target.value;
  //   vehicle.reason = "targetDate";
  //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
  //     next: result => {
  //       if (result) {
  //         this.vehicle = result;
  //         vehicle = this.vehicle;
  //         vehicle.reason = "";
  //       }
  //     }
  //   })
  // }

  // getVehicleJobs(vehicleId: any): void {
  //   this.jobs = new Array();

  //   this.jobService.getAllVehicleJobs(vehicleId).subscribe({
  //     next: result => {
  //       //this.jobs = result;
  //       if (result != null)
  //         this.serviceJobs = result;
  //       else {
  //         this.serviceJobs = new Array();
  //       }
  //       //console.log("getVehicleJobs", this.serviceJobs);
  //     },
  //     error: (e) => console.error(e)
  //   })
  // }

  // isChecked(service: Service): boolean {

  //   if (service.job.status != 0)
  //     return true;
  //   return false;
  // }

  // isJobChecked(job: Job): boolean {

  //   if (job.status != 0)
  //     return true;
  //   return false;
  // }

  // getLinkPicture() {
  //   //return "../../assets/3d.jpg";
  //   //return "assets/3d.jpg";
  //   return "assets/2dCar4.jpg";
  //   //return "assets/2dCar3.jpg";
  // }

  // updateJobStatus(job: Job): void {
  //   console.log("updateJobStatus");
  //   this.jobService.updateJobStatus(job.id).subscribe({
  //     next: result => {

  //       this.job = result;
  //       //this.getVehicleJobs(this.vehicle.id);
  //       //this.getVehicleJobs2(this.vehicle.id);
  //     }, error: (e) => console.log(e)
  //   })
  // }


  // saveJobNotes(job: Job): void {

  //   job.reason = "notes";
  //   this.jobService.createJob(this.currentUser.id, job).subscribe({
  //     next: result => {
  //       this.job = result;
  //       // this.getVehicleJobs(this.vehicle.id);
  //     }, error: (e) => console.log(e)
  //   })

  // }


  // savePayment(payment: Payment): void {

  //   payment.reason = "updates";
  //   this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
  //     next: result => {
  //       this.payment = result;
  //       // this.getVehicleJobs(this.vehicle.id);
  //     }, error: (e) => console.log(e)
  //   })

  // }


  // onEnter(reason: any, job: Job): void {
  //   job.reason = reason;
  //   this.jobService.createJob(this.currentUser.id, job).subscribe({
  //     next: result => {
  //       this.job = result;
  //       // this.getVehicleJobs(this.vehicle.id);
  //     }, error: (e) => console.log(e)
  //   })
  // }

  // onEnterPayment(reason: any, payment: Payment): void {

  //   payment.reason = reason;
  //   this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
  //     next: result => {
  //       if (result)
  //         this.payment = result;
  //       // this.getVehiclePayments(this.vehicle.id);
  //     }
  //   })
  // }

  // getVehicleJobs2(vehicleId: any): void {

  //   this.serviceJobs = new Array();
  //   this.jobService.getAllVehicleJobs2(vehicleId).subscribe({
  //     next: result => {
  //       if (result) {
  //         this.jobs = result;
  //         this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  //       } else {
  //         this.jobs = new Array();
  //       }
  //       // this.serviceJobs = result;
  //       console.log("getVehicleJobs", this.jobs);
  //     }


  //   })
  // }


  // getVehiclePayments(vehicleId: any): void {

  //   this.payments = new Array();
  //   this.paymentService.getAllVehiclePayments(vehicleId).subscribe({
  //     next: result => {
  //       if (result) {
  //         this.payments = result;
  //         this.payments = this.payments.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  //       } else {
  //         this.payments = new Array();
  //       }
  //       // this.serviceJobs = result;
  //       console.log("getVehiclePayments", this.payments);
  //     }


  //   })
  // }


  // applyStatusfilter(status: any): void {

  //   if (status == 'All')
  //     this.vehicles = this.vehiclesOriginal;
  //   else
  //     this.vehicles = this.vehiclesOriginal.filter(vehicle => vehicle.status === status);
  // }

  // applyLocationfilter(location: any): void {
  //   console.log("applyLocationfilter: ", location);
  //   if (location == 'All')
  //     this.vehicles = this.vehiclesOriginal;
  //   else
  //     this.vehicles = this.vehiclesOriginal.filter(vehicle => vehicle.location == location);
  // }

  // counter: any = 0;

  // sortList(fieldName: any): void {
  //   this.counter++;
  //   if (fieldName == 'daysInShop') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a.daysInShop - b.daysInShop);
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b.daysInShop - a.daysInShop);
  //   }

  //   if (fieldName == 'status') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a.status - b.status);
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b.status - a.status);
  //   }

  //   if (fieldName == 'year') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a.year - b.year);
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b.year - a.year);
  //   }

  //   if (fieldName == 'make') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a['make'].localeCompare(b['make']));
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b['make'].localeCompare(a['make']));
  //   }

  //   if (fieldName == 'model') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a['model'].localeCompare(b['model']));
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b['model'].localeCompare(a['model']));
  //   }

  //   if (fieldName == 'color') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a['color'].localeCompare(b['color']));
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b['color'].localeCompare(a['color']));
  //   }

  //   if (fieldName == 'insuranceCompany') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a['insuranceCompany'].localeCompare(b['insuranceCompany']));
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b['insuranceCompany'].localeCompare(a['insuranceCompany']));
  //   }

  //   if (fieldName == 'price') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a.price - b.price);
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b.price - a.price);
  //   }

  //   if (fieldName == 'paid') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => Number(a.paid) - Number(b.paid));
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => Number(b.paid) - Number(a.paid));
  //   }

  //   if (fieldName == 'paymentStatus') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a.paymentStatus - b.paymentStatus);
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b.paymentStatus - a.paymentStatus);
  //   }

  //   if (fieldName == 'paymentMethod') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a.paymentMethod - b.paymentMethod);
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b.paymentMethod - a.paymentMethod);
  //   }

  //   if (fieldName == 'approvalStatus') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a.approvalStatus - b.approvalStatus);
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b.approvalStatus - a.approvalStatus);
  //   }

  //   if (fieldName == 'jobRequestType') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => a.jobRequestType - b.jobRequestType);
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => b.jobRequestType - a.jobRequestType);
  //   }


  //   if (fieldName == 'createdAt') {
  //     if (this.counter % 2 == 1)
  //       this.vehicles = this.vehicles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  //     else
  //       this.vehicles = this.vehicles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  //   }

  // }

  // dropped(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(
  //     this.jobs,
  //     event.previousIndex,
  //     event.currentIndex
  //   );

  //   var sequenceCarriers: SequenceCarrier[] = new Array();
  //   for (let i = 0; i < this.jobs.length; i++) {
  //     let sequenceCarrier = new SequenceCarrier();
  //     sequenceCarrier.id = this.jobs[i].id;
  //     sequenceCarrier.index = i;
  //     sequenceCarriers.push(sequenceCarrier);
  //   }

  //   this.jobService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
  //     next: result => {

  //       if (result) {
  //         this.jobs = result;
  //         this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  //       }
  //     }
  //   })
  // }


  // droppedPayment(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(
  //     this.payments,
  //     event.previousIndex,
  //     event.currentIndex
  //   );

  //   var sequenceCarriers: SequenceCarrier[] = new Array();
  //   for (let i = 0; i < this.payments.length; i++) {
  //     let sequenceCarrier = new SequenceCarrier();
  //     sequenceCarrier.id = this.payments[i].id;
  //     sequenceCarrier.index = i;
  //     sequenceCarriers.push(sequenceCarrier);
  //   }

  //   this.paymentService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
  //     next: result => {

  //       if (result) {
  //         this.payments = result;
  //         this.payments = this.payments.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  //       }
  //     }
  //   })
  // }



  // addDamage(shortCode: any, area: string): void {

  //   // this.base64Image = "";
  //   // const elementImage = <HTMLElement>document.querySelector("[id='usa_image2']");

  //   // html2canvas(elementImage).then(canvas => {

  //   //   this.base64Image = canvas.toDataURL();
  //   //   this.vehicle.picByte = this.base64Image;

  //   //   console.log(this.base64Image);
  //   // });

  //   console.log(area);
  //   this.vehicle.workRequest = this.vehicle.workRequest + " " + area;

  //   if (this.damages.length == 0) {
  //     this.damages.push(area);
  //   } else {

  //     let dupFound: boolean = false;

  //     for (let i = 0; i < this.damages.length; i++) {
  //       if (this.damages[i] == area) {
  //         dupFound = true;
  //         this.damages.splice(i, 1);
  //       }
  //     }
  //     if (dupFound == false) {
  //       this.damages.push(area);
  //     }
  //   }

  //   this.vehicle.workRequest = this.damages.toString();
  // }

  // addDamageEvent($event: any): void {

  //   // const element = <HTMLElement>document.querySelector("[id='FRB']");

  //   for (let damage of this.optionsDamage) {
  //     const element = <HTMLInputElement>document.querySelector("[id='" + damage + "']");
  //     console.log("checked ", element.checked);
  //     element.click();
  //   }


  //   console.log($event.value);
  //   this.vehicle.workRequest = this.vehicle.workRequest + " " + $event.value;

  //   if (this.damages.length == 0) {
  //     this.damages.push($event.value);
  //   } else {

  //     let dupFound: boolean = false;

  //     for (let i = 0; i < this.damages.length; i++) {
  //       if (this.damages[i] == $event.value) {
  //         dupFound = true;
  //         this.damages.splice(i, 1);
  //       }
  //     }
  //     if (dupFound == false) {
  //       this.damages.push($event.value);
  //     }
  //   }

  //   this.vehicle.workRequest = this.damages.toString();
  // }

  // deleteVehicleJob($event: any, job: Job) {
  //   console.log("deleteVehicleJob " + job.id);

  //   this.jobService.deleteJob(job.id).subscribe({
  //     next: result => {

  //       console.log(result);
  //       this.getVehicleJobs2(this.vehicle.id);

  //     }
  //   })

  // }

  // deleteVehiclePayment($event: any, payment: Payment) {
  //   console.log("deleteVehiclePayment " + payment.id);

  //   this.paymentService.deletePayment(payment.id).subscribe({
  //     next: result => {

  //       console.log(result);
  //       this.getVehiclePayments(this.vehicle.id);

  //     }
  //   })

  // }



  // deleteVehicleService($event: any, serviceId: any, vehicleId: any) {

  //   console.log("deleteService " + serviceId);
  //   this.serviceService.deleteVehicleService(vehicleId, serviceId).subscribe({
  //     next: result => {
  //       console.log(result);
  //       this.getVehicle(this.vehicle.id);
  //       this.getVehicleJobs(vehicleId);

  //     }
  //   })

  // }
  // addVehicleService(serviceId: any): void {
  //   console.log("addVehicleService");
  //   this.serviceService.addVehicleService(this.vehicle.id, serviceId).subscribe({
  //     next: result => {
  //       console.log(result);
  //       this.getVehicle(this.vehicle.id);
  //       this.getVehicleJobs(this.vehicle.id);
  //       this.getVehicleJobs2(this.vehicle.id);

  //     }
  //   })
  // }

  // addVehicleService2(serviceId: any): void {
  //   console.log("addVehicleService");
  //   this.serviceService.addVehicleService(this.vehicle.id, serviceId).subscribe({
  //     next: result => {
  //       console.log(result);
  //       if (result) {
  //         this.getVehicleJobs2(this.vehicle.id);
  //       }
  //     }
  //   })
  // }

  // isInVehicleService(serviveId: any): any {

  //   if (this.vehicle.services != null) {
  //     for (let service of this.vehicle.services) {
  //       if (service.id == serviveId) {
  //         return true;
  //       }

  //     }
  //   }
  //   return false;
  // }

  // isInVehicleService2(serviveId: any): any {

  //   if (serviveId == 0)
  //     return false;

  //   if (this.vehicle.services != null) {
  //     for (let service of this.vehicle.services) {
  //       if (service.id == serviveId) {
  //         return true;
  //       }

  //     }
  //   }
  //   return false;
  // }

  // reset(customerOnly: boolean): void {
  //   this.errorMessage = "";
  //   this.successMessage = "";
  //   this.successMessageVehicle = "";
  //   this.errorMessageVehicle = "";
  //   var customer = this.vehicle.customer;

  //   this.vehicle = new Vehicle();
  //   if (customerOnly == false)
  //     this.vehicle.customer = customer;

  //   this.vehicle.jobRequestType = null;
  //   this.vehicle.year = null;
  //   this.vehicle.price = null;

  //   // this.vehicle.customer = new Customer();

  //   if (customerOnly) {

  //     if (this.editModeCustomer == false)
  //       this.editModeCustomer = true;

  //     if (this.editModeVehicle == true)
  //       this.editModeVehicle = false;

  //   } else {
  //     if (this.editModeCustomer == false)
  //       this.editModeCustomer = true;
  //     if (this.editModeVehicle == false)
  //       this.editModeVehicle = true;
  //   }

  //   this.vehicles = new Array();
  //   this.payments = new Array();
  //   this.jobs = new Array();
  //   //this.unLabelList();
  // }

  // deleteCustomer(custmerId: any): void {

  //   if (window.confirm("Are you shall to remove this customer ?")) {
  //     this.customerService.deleteCustomer(custmerId).subscribe({
  //       next: result => {
  //         if (result)
  //           this.successMessage = "Successfully Removed";
  //       }
  //     })

  //   }

  // }
  // onChangeEmployee2($event: any, employeeId: any, job: Job) {

  //   job.employeeId = employeeId;
  //   job.reason = "assign";
  //   console.log("onChangeEmployee2");
  //   this.jobService.createJob(this.currentUser.id, job).subscribe({
  //     next: result => {
  //       this.job = result;
  //       console.log(this.job);
  //       for (let job of this.jobs) {
  //         if (job.id == this.job.id)
  //           job = this.job;
  //       }
  //       //this.getVehicleJobs(this.vehicle.id);
  //       this.getVehicleJobs2(this.vehicle.id);
  //     }
  //   })

  // }

  // onChangeEmployee($event: any, employeeId: any, service: Service, jobId: any, notes: any) {

  //   console.log(" employeeID ", employeeId);
  //   console.log("service name ", service.name);
  //   console.log("service ", service.id);
  //   console.log("jobId ", jobId);

  //   if (!notes)
  //     notes = "";
  //   const job = {
  //     id: jobId,
  //     userId: this.currentUser.id,
  //     name: service.name,
  //     serviceId: service.id,
  //     vehicleId: this.vehicle.id,
  //     employeeId: employeeId,
  //     notes: notes,
  //     reason: "assign",
  //     paymentMethod: 0,
  //     jobRequestType: 0
  //     // targetDate: new Date()
  //   };


  //   console.log("onChangeEmployee");
  //   this.jobService.createJob(this.currentUser.id, job).subscribe({
  //     next: result => {
  //       this.job = result;

  //       this.getVehicleJobs(this.vehicle.id);
  //       // this.getVehicleJobs2(this.vehicle.id);
  //     }
  //   })

  // }

  // onChange($event: any, make: string) {

  //   this.optionsModel = [
  //     "not selected", "asd"
  //   ];

  //   this.carListStringList = this.carList as Brand[];
  //   for (var i = 0; i < this.carListStringList.length; i++) {
  //     //console.log('Data2', this.carListStringList[i].brand);
  //     //console.log('Data3', this.carListStringList[i].models);
  //     if (this.carListStringList[i].brand == make) {
  //       this.optionsModel = this.carListStringList[i].models;
  //     }


  //   }

  // }

  // archiveVehicle(vehicle: Vehicle): void {

  //   console.log("archiveVehicle");
  //   if (window.confirm('Are you shall you want to archive this vehicle')) {

  //     this.vehicle.archived = true;
  //     this.vehicle.reason = "archive";
  //     this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
  //       next: result => {
  //         console.log("archiveVehicle", result);
  //         this.vehicle = result;
  //         this.vehicle.reason = "";
  //         this.searchVehicle(5);
  //       }
  //     })
  //   }


  // }


  // onChangeStatus($event: any, status: string): void {

  //   console.log("onChangeStatus");
  //   this.vehicle.status = status;
  //   this.vehicle.reason = "status";
  //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
  //     next: result => {
  //       console.log("onChangeStatus", result);
  //       this.vehicle = result;
  //       this.vehicle.reason = "";
  //       //this.getStatusOverview(this.user.companyId);
  //     }
  //   })
  // }

  // onChangeJobRequestType($event: any, jobRequestType: any): void {

  //   console.log("onChangeJobRequestType");
  //   this.vehicle.jobRequestType = jobRequestType;
  //   this.vehicle.reason = "job request type";
  //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
  //     next: result => {
  //       console.log("onChangeJobRequestType", result);
  //       this.vehicle = result;
  //       this.vehicle.reason = "";
  //       //this.getStatusOverview(this.user.companyId);
  //     }
  //   })
  // }

  // onChangeApprovalStatus($event: any, approvalStatus: any): void {

  //   console.log("onChangeJobRequestType");
  //   this.vehicle.approvalStatus = approvalStatus;
  //   this.vehicle.reason = "approval status";
  //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
  //     next: result => {
  //       console.log("onChangeJobRequestType", result);
  //       this.vehicle = result;
  //       this.vehicle.reason = "";
  //       //this.getStatusOverview(this.user.companyId);
  //     }
  //   })
  // }



  // onChangeJobJobRequestType($event: any, jobRequestType: any, job: Job): void {

  //   console.log("onChangeJobJobRequestType");
  //   job.jobRequestType = jobRequestType;
  //   job.reason = "job request type";
  //   this.jobService.createJob(this.currentUser.id, job).subscribe({
  //     next: result => {
  //       console.log("onChangeJobJobRequestType", result);
  //       this.job = result;
  //       this.job.reason = "";

  //     }
  //   })
  // }


  // changePaidStatus(vehicle: Vehicle, paid: boolean): void {

  //   console.log("changePaidStatus");
  //   vehicle.paid = paid;

  //   if (paid == true)
  //     vehicle.reason = "unpaid";
  //   else
  //     vehicle.reason = "paid";

  //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
  //     next: result => {
  //       console.log("changePaidStatus", result);
  //       this.vehicle = result;

  //       this.vehicle.reason = "";

  //     }
  //   })
  // }

  // setSpecialFlag($event: any): void {
  //   console.log("setSpecialFlag");
  //   this.vehicle.reason = "special";
  //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
  //     next: result => {
  //       console.log("setSpecialFlag", result);
  //       this.vehicle = result;
  //       this.vehicle.reason = "";
  //       //this.getStatusOverview(this.user.companyId);
  //     }
  //   })

  // }
  // onChangeLocation($event: any, location: string): void {

  //   console.log("onChangeLocation");
  //   this.vehicle.location = location;
  //   this.vehicle.reason = "location";
  //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
  //     next: result => {
  //       console.log("onChangeLocation", result);
  //       this.vehicle = result;
  //       this.vehicle.reason = "";
  //       this.getLocationOverview(this.user.companyId);
  //     }
  //   })
  // }

  // onChangePaymentStatus($event: any, paymentStatus: any): void {

  //   console.log("onChangePaymentStatus");
  //   this.vehicle.paymentStatus = paymentStatus;
  //   this.vehicle.reason = "paymentStatus";
  //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
  //     next: result => {
  //       console.log("onChangePaymentStatus", result);
  //       this.vehicle = result;
  //       this.vehicle.reason = "";
  //       // this.getLocationOverview(this.user.companyId);
  //     }
  //   })
  // }


  // onChangePaymentMethod($event: any, paymentMethod: any): void {

  //   console.log("onChangePaymentMethod");
  //   this.vehicle.paymentMethod = paymentMethod;
  //   this.vehicle.reason = "paymentMethod";
  //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
  //     next: result => {
  //       console.log("onChangePaymentMethod", result);
  //       this.vehicle = result;
  //       this.vehicle.reason = "";
  //       // this.getLocationOverview(this.user.companyId);
  //     }
  //   })
  // }

  // onChangeJobPaymentMethod($event: any, paymentMethod: any, job: Job): void {

  //   console.log("onChangeJobPaymentMethod");
  //   job.paymentMethod = paymentMethod;
  //   job.reason = "paymentMethod";
  //   this.jobService.createJob(this.currentUser.id, job).subscribe({
  //     next: result => {
  //       console.log("onChangeJobPaymentMethod", result);
  //       this.job = result;
  //       this.job.reason = "";
  //       // this.getLocationOverview(this.user.companyId);
  //     }
  //   })
  // }

  // searchZip(zipCode: any, vehicle: Vehicle): void {

  //   this.zipToCityService.getZipInfo(zipCode).subscribe({
  //     next: result => {
  //       var data = result;
  //       if (data.city != '' && data.state != '') {
  //         vehicle.customer.city = data.city;
  //         vehicle.customer.state = data.state;
  //       }
  //     }
  //   })
  // }

  // searchVin(): void {

  //   this.autopartService.getVin(this.vehicle.vin).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       var tempAutopart: AutoPart = res;

  //       if (tempAutopart.year > 0 && tempAutopart.make != "" && tempAutopart.model != "") {
  //         this.autopart = res;
  //         this.vehicle.year = this.autopart.year;
  //         this.vehicle.make = this.autopart.make;
  //         this.vehicle.model = this.autopart.model;
  //         this.vehicle.description = this.autopart.description;

  //         this.showSearchVin = false;

  //         for (var i = 0; i < this.carListStringList.length; i++) {
  //           if (this.carListStringList[i].brand == this.autopart.make) {
  //             this.optionsModel = this.carListStringList[i].models;
  //           }

  //         }

  //         var hasItMake = false;
  //         for (let make of this.optionsMake) {
  //           if (make == this.vehicle.make) {
  //             hasItMake = true;
  //           }
  //         }
  //         if (!hasItMake) {
  //           this.optionsMake.push(this.vehicle.make);
  //         }


  //         var hasIt = false;
  //         for (let model of this.optionsModel) {
  //           if (model == this.vehicle.model) {
  //             hasIt = true;
  //           }
  //         }
  //         if (!hasIt) {
  //           this.optionsModel.push(this.vehicle.model);
  //         }
  //       }
  //       // this.vinSearched = true;

  //     },
  //     error: (e) => console.error(e)
  //   });
  // }

  // searchVehicle(type: number): void {

  //   this.errorMessage = "";
  //   this.successMessageVehicle = "";
  //   this.errorMessageVehicle = "";

  //   const data = {
  //     type: type,
  //     year: this.vehicle.year,
  //     make: this.vehicle.make,
  //     model: this.vehicle.model,
  //     color: this.vehicle.color,
  //     archived: this.archived,
  //     companyId: this.user.companyId,
  //     partNumber: "placeholder",
  //   };

  //   console.log(data);

  //   this.vehicleService.searchByYearMakeModelColor(data).subscribe({
  //     next: (res) => {
  //       // console.log(res);
  //       this.vehicles = res;

  //       this.vehiclesOriginal = res;

  //       if (this.vehicles.length == 0)
  //         this.message = "No Match Found!"
  //       else
  //         this.message = "[ " + this.vehicles.length + " ] found:"

  //       console.log("====", this.vehicles.length);
  //       //console.log("====", this.vehicles);

  //       if (type === 5) {
  //         //   this.getCompanyEmployee(this.user.companyId);
  //         //   this.getAllService(this.user.companyId);


  //       }
  //     },
  //     error: (e) => {
  //       console.log("No Match Found");
  //       this.message = e.error.message;
  //       console.error(e);
  //     }

  //   },
  //   );
  // }

  // getAllJobRequestType(companyId: any): void {

  //   this.jobRequestTypes = new Array();

  //   this.jobRequestTypeService.getAllCompanyJobRequestType(companyId).subscribe({
  //     next: result => {
  //       if (result)
  //         this.jobRequestTypes = result;
  //     }
  //   })
  // }

  // getLocationOverviews(): void {

  //   this.getLocationOverview(this.user.companyId);
  // }
  // getProductionOverview(): void {

  //   this.getStatusOverview(this.user.companyId);
  // }
  // getStatusOverview(companyId: any): void {
  //   console.log("getOverview");
  //   this.vehicleService.getOverview(companyId).subscribe({
  //     next: result => {
  //       console.log(result);
  //       this.statusOverview = result;

  //     }, error: (e) => console.log(e)
  //   })
  // }

  // getLocationOverview(companyId: any): void {
  //   console.log("getLocationOverview");
  //   this.vehicleService.getLocationOverview(companyId).subscribe({
  //     next: result => {
  //       console.log(result);
  //       this.locationOverview = result;

  //     }, error: (e) => console.log(e)
  //   })
  // }


  // getAllService(companyId: any): void {

  //   this.serviceService.getAllServices(companyId).subscribe({
  //     next: result => {
  //       this.services = result;
  //     }
  //   })
  // }

  // addVehicleJob(service: Service): void {

  //   console.log("addVehicleJob");
  //   var job = {
  //     id: 0,
  //     name: service.name,
  //     employeeId: 0,
  //     serviceId: service.id,
  //     notes: "Please specify",
  //     status: 0,
  //     vehicleId: this.vehicle.id,
  //     jobRequestType: 0,
  //     paymentMethod: 0
  //   }

  //   this.jobService.createJob(this.currentUser.id, job).subscribe({
  //     next: result => {
  //       if (result) {
  //         console.log(result);
  //         this.job = result;
  //         if (this.jobs) {
  //           this.jobs.unshift(this.job);
  //         }
  //       }
  //     }

  //   })
  // }

  // addVehiclePayment(paymentType: PaymentType): void {

  //   console.log("addVehiclePayment");
  //   var payment = {
  //     id: 0,
  //     name: paymentType.name,
  //     notes: "Please specify",
  //     paymentTypeId: paymentType.id,
  //     vehicleId: this.vehicle.id,
  //     paymentStatusId: 0,
  //     paymentMethodId: 0
  //   }

  //   this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
  //     next: result => {
  //       if (result) {
  //         console.log(result);
  //         this.payment = result;
  //         if (this.payments) {
  //           this.payments.unshift(this.payment);
  //         }
  //       }
  //     }

  //   })
  // }


  getCompanyEmployee(companyId: any): void {

    this.employees = new Array();

    var employeeAssignUnassign: Employee = new Employee();
    employeeAssignUnassign.id = 0;
    employeeAssignUnassign.firstName = "Assign/UnAssign"
    employeeAssignUnassign.lastName = "";
    this.employees.push(employeeAssignUnassign);
    this.employeeService.getComponyEmployees(companyId).subscribe({
      next: result => {
        if (result) {

          this.employees.push(...result);
        }
      }
    })
  }

  // getCustomerDetail(customer: any, index: any): void {

  //   this.cindexCustomer = index;
  //   this.customer = customer;
  //   //  this.vehicle = new Vehicle();
  //   // this.vehicle.customer = new Customer();
  //   this.vehicle.customer = customer;
  //   this.clearCustomers();

  // }

  // formatPhoneNumber(phoneNumberString: any): string {
  //   var formattedNumber = "";
  //   var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  //   var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  //   if (match) {
  //     formattedNumber = '(' + match[1] + ') ' + match[2] + '-' + match[3];
  //   }
  //   return formattedNumber;
  // }

  getCounterInvoiceDetail(counterInvoice: CounterInvoice, index: any): void {
    this.counterInvoice = counterInvoice;
    this.cindexCounterInvoice = index;

    if (this.counterInvoice.noTax == true) {
      this.company.taxRate = 0.00;
    } else {
      this.company.taxRate = this.companyDefaultTaxRate;
    }

    if (counterInvoice.customer != null && counterInvoice.customer?.id > 0) {
      this.vehicle.customer = counterInvoice.customer;
    }

    this.getAllCounterInvoiceItems(this.counterInvoice.id);


  }

  getCounterInvoiceDetailNoIndex(counterInvoice: CounterInvoice): void {
    this.counterInvoice = counterInvoice;
    //this.cindexCounterInvoice = index;

    if (this.counterInvoice.noTax == true) {
      this.company.taxRate = 0.00;
    } else {
      this.company.taxRate = this.companyDefaultTaxRate;
    }

    if (counterInvoice.customer != null && counterInvoice.customer?.id > 0) {
      this.vehicle.customer = counterInvoice.customer;
    }

    this.getAllCounterInvoiceItems(this.counterInvoice.id);


  }

  getCutomerCounterInvoice(customerId: any): void {
    this.counterInvoices = new Array();
    this.counterInvoice = new CounterInvoice();
    this.counterInvoiceItems = new Array();
    this.counterInvoiceItem = new CounterInvoiceItem();

    this.counterInvoiceService.getAllCustomerCounterInvoices(customerId).subscribe({
      next: result => {
        console.log(result);
        if (result)
          this.counterInvoices = result;
        this.counterInvoices = this.counterInvoices.sort((a, b) => a.id - b.id);
      }
    })
  }

  // saveCustomerInfo(customer: any): void {

  //   console.log("saveCustomerInfo");
  //   this.errorMessage = "";
  //   if (this.vehicle.customer.firstName == null
  //     || this.vehicle.customer.firstName == ""
  //     || this.vehicle.customer.lastName == null
  //     || this.vehicle.customer.lastName == ""
  //     || this.vehicle.customer.phone == null
  //     || this.vehicle.customer.phone == ""
  //     || this.vehicle.customer.street == null
  //     || this.vehicle.customer.stree == ""
  //     || this.vehicle.customer.city == null
  //     || this.vehicle.customer.city == ""
  //     || this.vehicle.customer.state == null
  //     || this.vehicle.customer.state == ""
  //     || this.vehicle.customer.zip == null
  //     || this.vehicle.customer.zip == ""
  //   ) {
  //     this.errorMessage = "Please fill the form";
  //     return;
  //   }
  //   customer.companyId = this.user.companyId;
  //   this.errorMessage = "";
  //   this.successMessage = "";
  //   this.customerService.createCustomer(this.currentUser.id, customer).subscribe({
  //     next: result => {
  //       console.log(result);
  //       this.customer = result;
  //       this.vehicle.customer = this.customer;
  //       this.successMessage = "Successfully updated";
  //     }
  //   })

  // }
  // searchCustomerByPhoneOnly(phone: any): void {

  //   console.log("searchCustomerByPhoneOnly");
  //   // this.unLabelList();
  //   this.vehicles = new Array();
  //   this.customers = new Array();
  //   this.customerService.searchCustomersByPhone(this.user.companyId, phone).subscribe({
  //     next: result => {
  //       console.log(result);
  //       this.customers = result;
  //       this.vehicle = new Vehicle();
  //       this.vehicle.customer = new Customer();
  //       this.vehicle.customer.phone = phone;
  //     }
  //   })

  // }

  // searchCustomerByLastName(lastName: any): void {

  //   console.log("searchCustomerByLastName");
  //   // this.unLabelList();
  //   this.vehicles = new Array();
  //   this.customers = new Array();
  //   this.customerService.searchCustomersByLastName(this.user.companyId, lastName).subscribe({
  //     next: result => {
  //       console.log(result);
  //       this.customers = result;
  //       this.vehicle = new Vehicle();
  //       this.vehicle.customer = new Customer();
  //       this.vehicle.customer.lastName = lastName;
  //     }
  //   })

  // }

  // searchPhone(phone: string) {

  //   console.log("===== searchPhone");

  //   this.vehicle = new Vehicle();
  //   this.vehicles = new Array();
  //   this.vehicle.customer = new Customer();
  //   this.vehicle.customer.phone = phone;
  //   // this.unLabelList();
  //   this.vehicleService.searchPhone(this.user.companyId, phone).subscribe({
  //     next: result => {

  //       this.vehicles = result;
  //       console.log("=====", this.vehicles);
  //       if (this.vehicles.length == 1) {
  //         this.vehicle = this.vehicles[0];
  //         for (var i = 0; i < this.carListStringList.length; i++) {
  //           if (this.carListStringList[i].brand == this.vehicle.make) {
  //             this.optionsModel = this.carListStringList[i].models;
  //           }

  //         }
  //         this.labelList(this.vehicle.damageStrings);
  //       }
  //     }
  //   });
  // }


  // searchLastName(lastName: string) {

  //   console.log("===== searchPhone");

  //   this.vehicle = new Vehicle();
  //   this.vehicles = new Array();
  //   this.vehicle.customer = new Customer();
  //   this.vehicle.customer.lastName = lastName;

  //   // this.unLabelList();
  //   this.vehicleService.searchLastName(this.user.companyId, lastName).subscribe({
  //     next: result => {

  //       this.vehicles = result;
  //       console.log("=====", this.vehicles);
  //       if (this.vehicles.length == 1) {
  //         this.vehicle = this.vehicles[0];
  //         for (var i = 0; i < this.carListStringList.length; i++) {
  //           if (this.carListStringList[i].brand == this.vehicle.make) {
  //             this.optionsModel = this.carListStringList[i].models;
  //           }

  //         }
  //         this.labelList(this.vehicle.damageStrings);
  //       }
  //     }
  //   });
  // }

  // calculateDiff(date: string) {
  //   let d2: Date = new Date();
  //   let d1 = Date.parse(date); //time in milliseconds
  //   var timeDiff = d2.getTime() - d1;
  //   var diff = timeDiff / (1000 * 3600 * 24);
  //   return Math.floor(diff);
  // }



  reload(): void {

    this.isSuccessful = false;
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
}
