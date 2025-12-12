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

@Component({
  selector: 'app-intake-home2',
  templateUrl: './intake-home2.component.html',
  styleUrls: ['./intake-home2.component.css']
})
export class IntakeHome2Component implements OnInit {
  //export class IntakeHome2Component implements OnInit, AfterViewInit {

  // @HostListener('window:focus') onFocus() {
  //   console.log('window focus');
  // }

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

  disclaimerId?: any;
  disclaimerText?: any;

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

  errorMessage: any;
  successMessage: any;

  successMessageVehicle: any;
  errorMessageVehicle: any;

  base64Image: any;

  vin: string = "ZPBUA1ZL9KLA00848";
  currentUser: any;
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


  constructor(private userService: UserService,
    private storageService: StorageService,
    private settingService: SettingService,
    private scrollService: ScrollService,
    private savedItemService: SavedItemService,
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private vehicleService: VehicleService,
    private companyService: CompanyService,
    private employeeService: EmployeeService,
    private receiptService: ReceiptService,
    private serviceService: ServiceService,
    private jobService: JobService,
    private customerService: CustomerService,
    private vehicleHistoryService: VehicleHistoryService,
    private statusService: StatusService,
    private locationService: LocationService,
    private noteService: NoteService,
    private paymentStatusService: PaymentStatusService,
    private paymentMethodService: PaymentMethodService,
    private paymentTypeService: PaymentTypeService,
    private paymentService: PaymentService,
    private insurancerService: InsurancerService,
    private inTakeWayService: InTakeWayService,
    private jobRequestTypeService: JobRequestTypeService,
    private approvalStatusService: ApprovalStatusService,
    private counterInvoiceService: CounterInvoiceService,
    private zipToCityService: ZipToCityService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private autopartService: AutopartService,
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

  //  ngAfterViewInit(): void {


  // var s1 = document.createElement("script");
  // s1.type = "text/javascript";
  // s1.src = "../../assets/test.js";
  // this.elementRef.nativeElement.appendChild(s1);

  // this.refresh();

  // if (this.currentUser != null) {
  //   this.getUserById(this.currentUser.id);
  // }
  // setTimeout(() => {

  //   try {
  //     if (this.currentUser != null) {
  //       this.getUserById(this.currentUser.id);
  //     }
  //   } catch (ex) { }
  // }, 50);


  // }

  refresh(): void {

    // setTimeout(() => {
    //   window.dispatchEvent(new Event('resize'));
    // }, 400);

  }

  ngOnInit(): void {

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

  closePopupYes(): void {

    if (this.autopart.reason == null || this.autopart.reason == '') {
      this.messageReasonRejection = "Please provide a reason ...";
      return;
    }
    this.displayStyle = "none";
    console.log("reject purchse order");

    this.purchseOrderService.update(this.autopart.id, this.autopart).subscribe({
      next: result => {
        this.autopart = result;
        this.getCompanyPurchaseOrder(this.user.companyId, 4);
      }
    })

  }

  closePopup(): void {
    this.displayStyle = "none";
    console.log("cloase purchse order");

  }

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

  addNewNote(): void {
    this.note = new Note();
  }
  setJobId(jobId: any) {
    this.currentJobId = jobId;
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

    this.currantPageNumber = pageNumber;
    this.messageCount = "";

    const data = {
      pageNumber: pageNumber,
      pageSize: pageSize
    };

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

  createCounterInvoice(): void {

    let counterInvoice: CounterInvoice = new CounterInvoice();
    counterInvoice.type = "Invoice";
    counterInvoice.name = "change Me";
    counterInvoice.userId = this.user.id;
    counterInvoice.companyId = this.user.companyId;
    counterInvoice.amount = 0;
    counterInvoice.customerId = this.vehicle.customer.id;
    counterInvoice.notes = "Please specify";
    counterInvoice.invoiceNumber = this.randomStringCounterInvoice();
    counterInvoice.headingName = this.headingName;
    counterInvoice.headingDescription = this.headingDescription;
    counterInvoice.headingQuantity = this.headingQuantity;
    counterInvoice.headingSubtotal = this.headingSubtotal;

    this.errorMessageCounterInvoiceSearch = "";

    this.counterInvoiceService.createCounterInvoice(this.user.id, counterInvoice).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.counterInvoice = result;
          this.getCutomerCounterInvoice(this.vehicle.customer.id);

        }
      }
    })


  }

  printPage(componentId: string, title: any) {

    const elementImage = <HTMLElement>document.querySelector("[id='" + componentId + "']");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt?.document.write('<title>' + title + '</title>');
    WindowPrt?.document.write("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">")
    //WindowPrt?.document.write("<link href=\"./stylecss\" rel=\"stylesheet\">")
    WindowPrt?.document.write('<style type=\"text/css\">th{color: white;background: rgb(13, 173, 226);}</style>');
    WindowPrt?.document.write(elementImage.innerHTML);
    WindowPrt?.document.write('<script>onload = function() { window.print(); }</script>');
    WindowPrt?.document.close();
    WindowPrt?.focus();

  }

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

  onChangeNoTax($event: any): void {

    var isCheck: boolean = $event.target.checked;
    if (isCheck == true) {
      this.company.taxRate = 0.00;
    } else {
      this.company.taxRate = this.companyDefaultTaxRate;
    }

  }

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

  getVehicleHistory(vehicleId: any): void {
    console.log("getVehicleHistory");
    this.showVehicleHistory = !this.showVehicleHistory;
    if (this.showVehicleHistory == true) {
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

    var input = $event.target.value;
    console.log(input);
    if (input.length > 1) {
      console.log($event.target.value);

      this.customers = new Array();
      this.customerService.searchCustomersByLastName(this.user.companyId, $event.target.value).subscribe({
        next: result => {
          if (result) {
            console.log(result);
            // this.vehicle = new Vehicle();
            this.customers = result;
          }
        }
      })
    }
  }

  onSearchChangeCustomerVehicle($event: any): void {
    var input = $event.target.value;
    console.log(input);
    if (input.length > 1) {
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
  }


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
        //console.log(result);
        this.user = result;

        if (this.user.partMarketOnly == true) {
          this.router.navigate(['/autoparts']);
        }
        
        if (this.user.companyId != 0) {
          this.getAllComponyUsers(this.user.companyId);
          this.getAllComponyEmployees(this.user.companyId);
          this.getSettings(this.user.companyId);
          // this.getAllService(this.user.companyId);
          // this.getAllStatus(this.user.companyId);
          // this.getAllLocations(this.user.companyId);
          // this.getAllNotes(this.user.companyId);
          // this.getAllInsurancer(this.user.companyId);
          // this.getAllInTakeWay(this.user.companyId);
          // this.getAllPaymentStatus(this.user.companyId);
          // this.getAllPaymentMethod(this.user.companyId);
          // this.getAllPaymentType(this.user.companyId);
          // this.getAllJobRequestType(this.user.companyId);
          // this.getAllApprovalStatus(this.user.companyId);
          this.getAllNotes(this.user.companyId);
          this.getVehiclesToday(null);
          this.getVehicleReportDail(this.user.companyId);
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
          this.jobRequestTypes = this.setting.JobRequestTypes;
          this.paymentMethods = this.setting.paymentMethods;
          this.approvalStatuss = this.setting.approvalStatuss;
          this.paymentStatuss = this.setting.paymentStatuss;
          this.services = this.setting.services;
          this.locations = this.setting.locations;
          this.insurancers = this.setting.insurancers;
          this.vendors = this.setting.vendors;
          this.inTakeWays = this.setting.inTakeWays;
          this.statuss = this.setting.statuss;
          this.rentals = this.setting.rentals;
          this.paymentTypes = this.setting.paymentTypes;
          this.disclaimers = this.setting.disclaimers;

          for (let disclaimer of this.disclaimers) {
            if (disclaimer.isDefault == true) {
              this.disclaimerId = disclaimer.id;
              this.disclaimerText = disclaimer.text;
            }
          }

          this.company = this.setting.company;
          this.companyDefaultTaxRate = this.company.taxRate;
          this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
        }
      }
    })
  }

  setDisclaimerText(disclaimerId: any): void {

    this.disclaimerText = "";
    for (let disclaimer of this.disclaimers) {
      if (disclaimer.id == disclaimerId) {
        this.disclaimerText = disclaimer.text;
      }
    }

  }

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
  getAllComponyUsers(companyId: any): void {

    this.userService.getAllCompanyUsers(companyId).subscribe({
      next: result => {
        if (result)
          this.users = result;
        // this.employees = result;
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
      this.getAllStatus(user.companyId);
      this.getAllLocations(user.companyId);
      this.getAllPaymentStatus(user.companyId);
      this.getAllPaymentMethod(user.companyId);
      this.getAllJobRequestType(this.user.companyId);

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
      return;
    }



    if (this.vehicle.year == null
      || this.vehicle.year == ""
      || this.vehicle.make == null
      || this.vehicle.make == ""
      || this.vehicle.model == null
      || this.vehicle.model == ""
      || this.vehicle.color == null
      || this.vehicle.color == ""
      || this.vehicle.workRequest == null
      || this.vehicle.workRequest == ""
      || this.vehicle.price == null
      || this.vehicle.price == ""
      || this.vehicle.jobRequestType == null
      || this.vehicle.jobRequestType == "") {

      this.errorMessageVehicle = "Please fill the form, Year/Make/Model/Color/Work Request/Price/Job Request Type are required";
      return;
    }






    // if (this.step != 0) {
    //   const element = <HTMLButtonElement>document.querySelector("[id='nav-vehicle-tab']");
    //   if (element)
    //     element.click();

    //   this.refresh();
    // }

    if (vehicle.id == 0) {
      isNewVehicle = true;
      vehicle.reason = "new";
    } else {
      vehicle.reason = "update";
    }
    //vehicle.customerId = 1;
    // this.optionsShotCodes = new Array();
    // for (let damage of this.optionsDamage) {
    //   const element = <HTMLInputElement>document.querySelector("[id='" + damage + "']");
    //   //console.log("checked ", element.checked);
    //   try {
    //     if (element.checked == true) {
    //       this.optionsShotCodes.push(damage);
    //     }
    //   } catch { }

    //   this.vehicle.damages = this.optionsShotCodes.toLocaleString();
    //   // console.log(this.vehicle.damages);
    // }



    vehicle.sequenceNumber = 0;

    vehicle.companyId = this.user.companyId;
    vehicle.customer.companyId = this.user.companyId;

    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({

      next: async result => {

        console.log(result);

        this.vehicle = result;

        this.base64Image = "";

        this.successMessageVehicle = "Successfully updated";

        this.editModeCustomer = false;
        this.editModeVehicle = false;

        // setTimeout(() => {

        //   const elementImage = <HTMLElement>document.querySelector("[id='usa_image3']");

        //   var backgroundColorHex = " #FFFFFF";
        //   htmlToImage.toJpeg(elementImage, { backgroundColor: backgroundColorHex })
        //     .then((dataUrl) => {

        //       const imageModel = {
        //         id: this.vehicle.imageModels[0]?.id,
        //         vehicleIdIn: this.vehicle.id,
        //         picByte: dataUrl
        //       }

        //       this.vehicleService.uploadImage(imageModel, this.vehicle.id).subscribe({
        //         next: result => {
        //           console.log("uploadImage");
        //           console.log(result);
        //           if (isNewVehicle == true && this.vehicles) {
        //             this.vehicle.imageModels.push(result);
        //             this.vehicles.unshift(this.vehicle);
        //           }

        //           this.successMessageVehicle = "Successfully updated";
        //         }
        //       });

        //       // document.body.appendChild(img);
        //     })
        //     .catch(function (error) {
        //       console.error('oops, something went wrong!', error);
        //     });

        // }, 100);
      }
    });


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
    // this.getVehicleJobs(vehicle.id);


  }

  isInVehicleJobs(employeeId: any, serviceId: any): boolean {

    for (let job of this.jobs) {
      if (job.employeeId == employeeId && job.serviceId == serviceId)
        return true;
    }
    return false;
  }

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

  onChangeCalendar($event: any, job: Job): void {

    job.targetDate = $event.target.value;
    job.reason = "calender"
    console.log($event.target.value);
    console.log("onChangeCalendar");
    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        console.log(result);
        this.job = result;
        job.reason = "";
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

  onChangeVehicleCalendar($event: any, vehicle: Vehicle): void {
    vehicle.targetDate = $event.target.value;
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
        //this.getVehicleJobs(this.vehicle.id);
        //this.getVehicleJobs2(this.vehicle.id);
      }, error: (e) => console.log(e)
    })
  }


  saveJobNotes(job: Job): void {

    job.reason = "notes";
    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        this.job = result;
        // this.getVehicleJobs(this.vehicle.id);
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

  getVehicleJobs2(vehicleId: any): void {

    this.serviceJobs = new Array();
    this.jobService.getAllVehicleJobs2(vehicleId).subscribe({
      next: result => {
        if (result) {
          this.jobs = result;
          this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        } else {
          this.jobs = new Array();
        }
        // this.serviceJobs = result;
        console.log("getVehicleJobs", this.jobs);
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
        console.log("getVehiclePayments", this.payments);
      }


    })
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
    if (fieldName == 'daysInShop') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.daysInShop - b.daysInShop);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.daysInShop - a.daysInShop);
    }

    if (fieldName == 'status') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.status - b.status);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.status - a.status);
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
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.jobRequestType - b.jobRequestType);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.jobRequestType - a.jobRequestType);
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



  addDamage(shortCode: any, area: string): void {

    // this.base64Image = "";
    // const elementImage = <HTMLElement>document.querySelector("[id='usa_image2']");

    // html2canvas(elementImage).then(canvas => {

    //   this.base64Image = canvas.toDataURL();
    //   this.vehicle.picByte = this.base64Image;

    //   console.log(this.base64Image);
    // });

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

      }
    })

  }

  deleteVehiclePayment($event: any, payment: Payment) {
    console.log("deleteVehiclePayment " + payment.id);

    this.paymentService.deletePayment(payment.id).subscribe({
      next: result => {

        console.log(result);
        this.getVehiclePayments(this.vehicle.id);

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

  reset(customerOnly: boolean): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.successMessageVehicle = "";
    this.errorMessageVehicle = "";
    var customer = this.vehicle.customer;

    this.vehicle = new Vehicle();
    if (customerOnly == false)
      this.vehicle.customer = customer;

    this.vehicle.jobRequestType = null;
    this.vehicle.year = null;
    this.vehicle.price = null;

    // this.vehicle.customer = new Customer();

    if (customerOnly) {

      if (this.editModeCustomer == false)
        this.editModeCustomer = true;

      if (this.editModeVehicle == true)
        this.editModeVehicle = false;

    } else {
      if (this.editModeCustomer == false)
        this.editModeCustomer = true;
      if (this.editModeVehicle == false)
        this.editModeVehicle = true;
    }

    this.vehicles = new Array();
    this.payments = new Array();
    this.jobs = new Array();
    //this.unLabelList();
  }

  deleteCustomer(custmerId: any): void {

    if (window.confirm("Are you shall to remove this customer ?")) {
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
      imageModels: new Array(),
      reason: "assign",
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

  archiveVehicle(vehicle: Vehicle): void {

    console.log("archiveVehicle");
    if (window.confirm('Are you shall you want to archive this vehicle')) {

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
        //this.getStatusOverview(this.user.companyId);
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
    console.log("getOverview");
    this.vehicleService.getOverview(companyId).subscribe({
      next: result => {
        console.log(result);
        this.statusOverview = result;

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

  getCustomerDetail(customer: any, index: any): void {

    this.cindexCustomer = index;
    this.customer = customer;
    //  this.vehicle = new Vehicle();
    // this.vehicle.customer = new Customer();
    this.vehicle.customer = customer;
    this.clearCustomers();

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

  calculateDiff(date: string) {
    let d2: Date = new Date();
    let d1 = Date.parse(date); //time in milliseconds
    var timeDiff = d2.getTime() - d1;
    var diff = timeDiff / (1000 * 3600 * 24);
    return Math.floor(diff);
  }

}

