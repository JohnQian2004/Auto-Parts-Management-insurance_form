import { AfterViewInit, ChangeDetectorRef, Component, ViewContainerRef, ElementRef, EventEmitter, HostListener, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';
import { Subscription } from 'rxjs';
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
import { VehicleService } from '../_services/vehicle.service';
import { Customer } from '../models/customer.model';

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
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { PaymentTypeService } from '../_services/payment.type.service';
import { PaymentType } from '../models/payment.type.model';
import { PaymentService } from '../_services/payment.service';
import { Payment } from '../models/payment.model';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NoteService } from '../_services/note.service';
import { Note } from '../models/note.model';
import { SettingService } from '../_services/setting.service';
import { Setting } from '../models/setting.model';
import { EmployeeRole } from '../models/employee.role.model';
import { ReceiptService } from '../_services/receipt.service';
import { Receipt } from '../models/receipt.model';
import { jsPDF } from "jspdf";
import htmlToPdfmake from 'html-to-pdfmake';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Insurancer } from '../models/insurancer.model';
import { InTakeWay } from '../models/in.take.way.model';
import { Rental } from '../models/rental.model';
import { Disclaimer } from '../models/disclaimer.model';
import { AuthService } from '../_services/auth.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import { ImageModel } from '../models/imageModel.model';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { KeyLocation } from '../models/key.location.model';
import { Warranty } from '../models/warranty.model';
import { ColumnInfo } from '../models/column.info.model';
import { ColumnInfoService } from '../_services/column.info.service';
import { SepplementService } from '../_services/supplement.service';
import { Supplement } from '../models/supplement.model';
import { Platform } from '@angular/cdk/platform';
import { ClaimService } from '../_services/claim.service';
import { Claim } from '../models/claim.model';
import { ItemType } from '../models/item.type.model';
import { ItemTypeService } from '../_services/item.type.service';
import { DocType } from '../models/doc.type.model';
import { DocTypeService } from '../_services/doc.type.service';
import { PurchaseOrderVehicleService } from '../_services/purchase.order.vehicle.service';
import { PurchaseOrderVehicle } from '../models/purchase.order.vehicle.model';
import { Vendor } from '../models/vendor.model';
import { AnalyticsService } from '../_services/analytics.service';
import { ItemViewerModalService } from '../_services/item.viewer.modal.service';
import { ConfirmationService } from '../_services/confirmation.service';
import { ChartConfiguration, ChartOptions, ChartType, ActiveElement, Chart, ChartData, ChartEvent, ChartDataset, } from "chart.js";
import { GroupBySorter } from '../models/groupBy.Sorter.model';
import { JobProcessor } from '../models/job-processor';

declare var bootstrap: any;

declare let html2pdf: any;
@Component({
  selector: 'app-inshop5',
  templateUrl: './inshop5.component.html',
  styleUrls: ['./inshop5.component.css']
})
export class Inshop5Component implements OnInit, AfterViewInit {

  socket: WebSocket | undefined;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // console.log(event.target.innerWidth);
  }

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";

  searchType?: any = 5;

  currantPageNumber?: any;
  searchCount?: any
  pageSize: number = 100;
  pages: number = 1;

  pagesArray: number[] = new Array();

  partNumber: any;

  currentDate = new Date();
  company: Company = new Company();

  companyDefaultTaxRate: any = 0;
  displayStyle = "none";
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

    // events: [
    //   { title: 'Meeting', start: new Date() }
    // ],





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

      info.el.setAttribute("data-bs-target", "#editVehicle");
      info.el.setAttribute("data-bs-toggle", "modal");

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
    // events: [
    //   { title: 'Meeting', start: new Date() }
    // ],

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

  filterOff: boolean = true;

  setting: Setting = new Setting();

  step: any = 5;
  jobCompletedCount: any = 0;

  editModeCustomer: boolean = false;
  editModeVehicle: boolean = false;

  showAccordian: boolean = true;

  searchInput: any = "";

  vehicleHistories: VehicleHistory[] = new Array();
  showVehicleHistory: boolean = false;

  archived: boolean = false;

  user: User = new User();
  users: User[] = new Array();

  showIt: boolean = true;

  statusOverview: GroupBy[] = new Array();
  jobRequestTypeOverview: GroupBy[] = new Array();
  assignedToOverview: GroupBy[] = new Array();
  changeOverview: GroupBy[] = new Array();
  locationOverview: GroupBy[] = new Array();

  customer: Customer = new Customer();
  customers: Customer[] = new Array();

  companies: Company[] = new Array();

  employees: Employee[] = new Array();

  services: Service[] = new Array();
  service: Service = new Service();
  isH2Visible: boolean = false;

  statuss: Status[] = new Array();
  statuss2: Status[] = new Array();

  status: Status = new Service();

  locations: Location[] = new Array();
  location: Location = new Location();

  keyLocations: KeyLocation[] = new Array();
  keyLocatin: KeyLocation = new KeyLocation();

  paymentStatuss: PaymentStatus[] = new Array();
  paymentStatus: PaymentStatus = new PaymentStatus();

  paymentMethods: PaymentMethod[] = new Array();
  paymentMethod: PaymentMethod = new PaymentMethod();

  paymentTypes: PaymentType[] = new Array();
  paymentType: PaymentType = new PaymentType();

  itemTypes: ItemType[] = new Array();
  itemType: ItemType = new ItemType();

  docTypes: DocType[] = new Array();
  docType: DocType = new DocType();

  jobRequestTypes: JobRequestType[] = new Array();
  jobRequestType: JobRequestType = new JobRequestType();

  rentals: Rental[] = new Array();
  rental: Rental = new Rental();

  employeeRoles: EmployeeRole[] = new Array();
  employeeRole: EmployeeRole = new EmployeeRole();

  approvalStatuss: ApprovalStatus[] = new Array();
  approvalStatus: ApprovalStatus = new ApprovalStatus();

  insurancers: Insurancer[] = new Array();
  insurancer: Insurancer = new Insurancer();

  inTakeWays: InTakeWay[] = new Array();
  inTakeWay: InTakeWay = new InTakeWay();

  disclaimerId: any = 0;
  disclaimerText: any = "";

  disclaimers: Disclaimer[] = new Array();
  disclaimer: Disclaimer = new Disclaimer();

  notes: Note[] = new Array();
  note: Note = new Note();

  receipts: Receipt[] = new Array();
  receipt: Receipt = new Receipt();

  claims: Claim[] = new Array();
  claim: Claim = new Claim();

  purchaseOrders: PurchaseOrderVehicle[] = new Array();
  purchaseOrder: PurchaseOrderVehicle = new PurchaseOrderVehicle();


  selectedEmployee: any;

  currentJobId: any;
  currentPaymentId: any;
  currentReceiptId: any;
  currentHistoryId: any;

  serviceJobs: Service[] = new Array();

  job: Job = new Job();
  jobs: Job[] = new Array();

  payment: any = new Payment();
  payments: Payment[] = new Array();

  cindex: number = 0;
  cindexCustomer: number = 0;
  cindexUserJob: number = 0;

  message: any;
  messageAlert: any;

  errorMessage: any = "";
  successMessage: any;

  successMessageVehicle: any;
  errorMessageVehicle: any;

  base64Image: any;

  vin: string = "ZPBUA1ZL9KLA00848";
  currentUser: any;
  vehicles: Vehicle[] = new Array();

  vehiclesJob: Vehicle[] = new Array();

  vehiclesOriginal: Vehicle[] = new Array();

  vehicleJob: Vehicle = new Vehicle();
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
    year: 2019,
    make: "Lamborghini",
    model: "Urus",
    color: "black",
    miles: "20k",
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

  optionsLocation: string[] = ["Lot 1", "Lot 2", "Front", "Back", "In Shop", "Yard", "Others"];

  optionsTitle: string[] = ["Miss", "Mr", "Mrs.", "Ms", "Others"];

  optionsShotCodes: string[] = new Array();

  optoinsVehicleHistoryType: string[] = new Array();

  damages: string[] = new Array();

  carList: any = jsonData;
  carListStringList: Brand[];
  autopart?: AutoPart;
  showSearchVin: boolean = false;

  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/vehicle/getImage';
  baseUrlImageParts = this.config.baseUrl + '/getImage';

  baseUrlPdf = this.config.baseUrl + '/pdf/getPdf';
  baseUrlQR = this.config.baseUrlQR;

  baseUrlResizeImage = this.config.baseUrl + '/vehicle/getResize';
  baseUrlResizeImageParts = this.config.baseUrl + '/getResize';
  baseUrlResizeImageJobs = this.config.baseUrl + '/jobimages/getResize';
  baseUrlResizeImagePayments = this.config.baseUrl + '/paymentimages/getResize';
  baseUrlResizeImagePaymentGetImages = this.config.baseUrl + '/paymentimages/getImage';

  currentEmplyeeId: any;
  vehicleJobsOnly: boolean = false;

  fileToUpload: any;
  imageUrl: any;

  vendors: Vendor[] = new Array();
  vendor: Vendor = new Vendor();
  elem: any;

  constructor(
    @Inject(DOCUMENT) private document: any,
    //private location: Location,
    private userService: UserService,
    private anylyticalService: AnalyticsService,
    private storageService: StorageService,
    private eventBusService: EventBusService,
    private scrollService: ScrollService,
    private savedItemService: SavedItemService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private elementRef: ElementRef,
    private vehicleService: VehicleService,
    private companyService: CompanyService,
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
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private autopartService: AutopartService,
    private settingService: SettingService,
    private noteService: NoteService,
    private receiptService: ReceiptService,
    private authService: AuthService,
    private http: HttpClient,
    private sanitizationService: DomSanitizer,
    private columnInfoService: ColumnInfoService,
    private supplementService: SepplementService,
    private platform: Platform,
    private claimService: ClaimService,
    private itemTypeService: ItemTypeService,
    private docTypeService: DocTypeService,
    private purchseOrderVehicleService: PurchaseOrderVehicleService,
    private itemViewerModalService: ItemViewerModalService,
    private confirmationService: ConfirmationService

  ) {

    for (let i = 1950; i <= 2026; i++) {
      this.optionsYear.push("" + i);
    }

    this.optionsMake = this.config.optionsMake;

    this.optionsColor = [
      "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burgandy", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "pearl", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"
    ];

    this.optionsModel = [
      "not selected"
    ];

    this.carListStringList = [];

  }


  ngAfterViewInit(): void {


    // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //   return new bootstrap.Tooltip(tooltipTriggerEl)
    // })


    // try {
    //   console.log("ngAfterViewInit");
    // } catch (e) {

    // }
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


  }

  message1 = "";

  onSelectFileEditorPayments(event: any): void {


    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      const file = event.target.files[0];


      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        alert('Only JPEG and JPG images are allowed');
        return;
      }

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;

          this.uploadImageWithFilePayments(this.payment.id, imageModel);

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


  getDetailsPayment(payment: Payment, index: any): void {
    this.currentIndex = index;
    this.payment = payment;
  }


  private uploadImageWithFilePayments(paymentId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFileAutoparts");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', paymentId) //other param
    formData.append('description', "test") //other param

    this.paymentService.uploadImageWithFileWithUserId(formData, paymentId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.payment!.imageModels!.unshift(result);
      }
    });

  }


  onSelectFileEditor(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      const file = event.target.files[0];


      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        alert('Only JPEG and JPG images are allowed');
        return;
      }
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;

          //this.uploadImage(this.vehicle.id, imageModel);
          this.uploadImageWithFile(this.vehicle.id, imageModel);


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


  pdfUrl: string | null = null;
  urlSafe: SafeResourceUrl | undefined;
  pdfSrc: SafeResourceUrl | null = null;
  currentToken: any = '';

  counterPdf: any = 0;

  getPdf(token: any): void {

    this.currentToken = token;
    this.pdfUrl = this.baseUrlPdf + "/" + token;
    this.http.get(this.pdfUrl, { responseType: 'arraybuffer' }).subscribe((data: ArrayBuffer) => {
      const base64String = btoa(new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      this.pdfSrc = this.sanitizationService.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + base64String)
    });

  }

  getPdf2(pdf: any, token: any): void {

    if (pdf.toggle == true) {

      this.currentToken = token;
      this.pdfUrl = this.baseUrlPdf + "/" + token;
      this.http.get(this.pdfUrl, { responseType: 'arraybuffer' }).subscribe((data: ArrayBuffer) => {
        const base64String = btoa(new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), ''));

        // Set the base64 string as the PDF source
        //this.pdfSrc = 'data:application/pdf;base64,' + base64String;
        this.pdfSrc = this.sanitizationService.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + base64String)
      });
    } else {
      this.pdfSrc = null;
    }

  }

  deletePdf(token: any) {

    this.vehicleService.deletePdf(token, this.vehicle.id, this.user.id).subscribe({
      next: result => {
        for (let i = 0; i < this.vehicle.pdfFiles.length; i++) {
          if (this.vehicle.pdfFiles[i].token == token) {
            this.vehicle.pdfFiles.splice(i, 1);
          }
        }

        if (this.vehicle.pdfFiles.length > 0) {
          this.getPdf(this.vehicle.pdfFiles[0].token);
        } else {

          this.pdfSrc = null;
        }

      }
    })
  }

  onSelectFileEditorPdf(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);

          const file = this.DataURIToBlob("" + e.target.result);

          const formData = new FormData();
          formData.append('file', file, event.target.files[i].name)
          formData.append('vehicleId', this.vehicle.id) //other param
          formData.append('description', "pdf") //other param
          // formData.append('path', 'temp/') //other param

          this.vehicleService.uploadPdfWithFile(formData, this.vehicle.id, this.user.id).subscribe({
            next: (result) => {
              console.log(result);
              this.vehicle.pdfFiles.push(result);
              for (let vehicle of this.vehicles) {
                if (vehicle.id == this.vehicle.id) {
                  vehicle.pdfFiles = this.vehicle.pdfFiles;
                }
              }

              this.getPdf(result.token);
            }
          });

        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  hover: any = null;

  uploadImage(vehicleId: any, imageModel: ImageModel) {

    this.vehicleService.uploadImage(imageModel, vehicleId).subscribe({
      next: (result) => {
        console.log(result);
        this.vehicle.imageModels.push(result);
      }
    });
  }

  private uploadImageWithFile(vehicleId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('vehicleId', vehicleId) //other param
    formData.append('description', "vehicle") //other param
    // formData.append('path', 'temp/') //other param

    this.vehicleService.uploadImageWithFileUserId(formData, vehicleId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.vehicle.imageModels.push(result);
        this.docTypes[0].imageModels.push(result);

        for (let vehicle of this.vehicles) {
          if (vehicle.id == this.vehicle.id) {
            vehicle.imageModels = this.vehicle.imageModels;
          }
        }
        if (this.vehicle.imageModels.length == 1) {
          this.vehicle.showInSearchImageId = result.id;
        }
      }
    });

  }

  private uploadPdfWithFile(vehicleId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('vehicleId', vehicleId) //other param
    formData.append('description', "vehicle") //other param
    // formData.append('path', 'temp/') //other param

    this.vehicleService.uploadImageWithFile(formData, vehicleId).subscribe({
      next: (result) => {
        console.log(result);
        this.vehicle.imageModels.push(result);
        for (let vehicle of this.vehicles) {
          if (vehicle.id == this.vehicle.id) {
            vehicle.imageModels = this.vehicle.imageModels;
          }
        }
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


  currentImageIndex: number = 0;
  selectedImage: any;

  setImageForSearch(vehicleId: any, imageId: any) {


    console.log("setImageForSearch");

    this.vehicleService.setImageForSearch(imageId, vehicleId).subscribe({
      next: (result) => {
        console.log(result);
        this.vehicleService.get(vehicleId).subscribe({
          next: (result => {
            console.log(result);
            this.vehicle = result;
            this.vehicle.imageModels = this.vehicle.imageModels.sort((a: { sequenceNumber: number; }, b: { sequenceNumber: number; }) => a.sequenceNumber - b.sequenceNumber);
            this.selectedImage = this.vehicle.showInSearchImageId;
            for (let vehicle of this.vehicles) {
              if (vehicle.id == this.vehicle.id) {
                vehicle.showInSearchImageId = imageId;
                this.vehicle.showInSearchImageId = imageId;
              }
            }

            // for (let docType of this.docTypes) {
            //   for (let imageModel of docType.imageModels) {
            //     imageModel.showInSearch = false;
            //     if (imageModel.id == this.vehicle.showInSearchImageId) {
            //       imageModel.showInSearch = true;
            //     }
            //   }
            // }
          })
        });
      }
    });
  }

  setImageForSearch2(vehicleId: any, imageId: any) {


    console.log("setImageForSearch2");

    this.vehicleService.setImageForSearch(imageId, vehicleId).subscribe({
      next: (result) => {
        console.log(result);
        this.vehicleService.get(vehicleId).subscribe({
          next: (result => {
            console.log(result);
            this.vehicle = result;
            this.vehicle.imageModels = this.vehicle.imageModels.sort((a: { sequenceNumber: number; }, b: { sequenceNumber: number; }) => a.sequenceNumber - b.sequenceNumber);
            this.selectedImage2 = this.vehicle.showInSearchImageId;
            for (let vehicle of this.vehicles) {
              if (vehicle.id == this.vehicle.id) {
                vehicle.showInSearchImageId = imageId;
              }
            }
          })
        });
      }
    });
  }



  setImageForSearchAutoparts(autopartId: any, imageId: any) {


    console.log("setImageForSearch");

    this.autopartService.setImageForSearch(imageId, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.autopartService.get(autopartId).subscribe({
          next: (result => {
            console.log(result);
            this.selectedAutopart = result;
            this.selectedImage = this.selectedAutopart.showInSearchImageId;

            for (let autopart of this.autopartsSearch) {
              if (autopart.id == autopartId) {
                autopart.showInSearchImageId = this.selectedAutopart.showInSearchImageId;
              }
            }

          })
        });
      }
    });
  }



  saveAutopartEditor(): void {

    console.log("saveAutopart");

    // if (this.selectedAutopart.imageModels.length == 0) {
    //   this.message1 = "Please choose image or images for the part";
    //   return;
    // }

    this.selectedAutopart.reason = "update";

    if (this.selectedAutopart.year == null || this.selectedAutopart.year < 1000 ||

      this.selectedAutopart.make == null || this.selectedAutopart.make == "" ||
      this.selectedAutopart.model == null || this.selectedAutopart.model == ''

    ) {
      this.message1 = "Part Infor for year, make and model are required";
      return;
    }

    if (this.selectedAutopart.title == null || this.selectedAutopart.title == '') {
      this.message1 = "Parts Name is required";
      return;
    }

    if (this.selectedAutopart.description == null || this.selectedAutopart.description == '') {
      this.message1 = "Part Description is required";
      return;
    }

    if (this.selectedAutopart.shipping == null || this.selectedAutopart.shipping == '') {
      this.message1 = "Part Shipping is required";
      return;
    }

    if (this.selectedAutopart.warranty == null || this.selectedAutopart.warranty == '') {
      this.message1 = "Part Warranty is required";
      return;
    }

    if (this.selectedAutopart.grade == null || this.selectedAutopart.grade == '') {
      this.message1 = "Part Grade is required";
      return;
    }

    if (this.selectedAutopart.salePrice != null && this.selectedAutopart.salePrice == 0) {
      this.message1 = "Part Price is required";
      return;
    }



    if (this.selectedAutopart.title != null && this.selectedAutopart.title != '' && this.selectedAutopart.title.length > 255) {
      this.message1 = "Parts Name is too long";
      return;
    }

    if (this.selectedAutopart.description != null && this.selectedAutopart.description != '' && this.selectedAutopart.description.length > 2000) {
      this.message1 = "Part Description is too long";
      return;
    }

    if (this.selectedAutopart.comments != null && this.selectedAutopart.comments != '' && this.selectedAutopart.comments.length > 500) {
      this.message1 = "Part comments is too long";
      return;
    }

    if (this.selectedAutopart.description != null && this.selectedAutopart.description != '' && this.selectedAutopart.description.length < 2) {
      this.message1 = "Part Description is too short";
      return;
    }

    if (this.selectedAutopart.comments != null && this.selectedAutopart.comments != '' && this.selectedAutopart.comments.length < 2) {
      this.message1 = "Part comments is too short";
      return;
    }

    if (this.selectedAutopart.partNumber != null && this.selectedAutopart.partNumber != '' && this.selectedAutopart.partNumber.length > 255) {
      this.message1 = "Parts Number is too long";
      return;
    }

    if (this.selectedAutopart.stocknumber != null && this.selectedAutopart.stocknumber != '' && this.selectedAutopart.stocknumber.length < 2) {
      this.message1 = "Part Stock Number is too short";
      return;
    }

    if (this.selectedAutopart.stocknumber != null && this.selectedAutopart.stocknumber != '' && this.selectedAutopart.stocknumber.length > 50) {
      this.message1 = "Part Stock Number is too long";
      return;
    }


    this.autopartService.update(this.selectedAutopart.id, this.selectedAutopart).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedAutopart = res;
        this.selectedImage = this.selectedAutopart.showInSearchImageId;
        this.message1 = "Updated Successfully ";
        // setTimeout(() => {
        //this.getAutoPartById(this.autopartReturned.id);
        //window.open(`/detail/` + this.autopartReturned.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
        //this.message1 = "Updated Successfully ";
        // }, 200);

        for (let i = 0; i < this.autopartsSearch.length; i++) {
          if (this.autopartsSearch[i].id == this.selectedAutopart.id) {
            this.autopartsSearch[i] = this.selectedAutopart;
            this.autopartsSearch[i].showInSearchImageId = this.selectedAutopart.showInSearchImageId;
          }
        }



      },
      error: (e) => console.error(e)
    });

  }

  getVehicleCostManagement(vehicle: any): any {

    return +(this.getVehicleRemaining(vehicle) * this.company.managementRate).toFixed(0);
  }

  getVehicleRemaining(vehicle: any): any {
    var total = 0;
    var totalEstimate = this.getVehicleTotalEstimates(vehicle);
    var totalCostsParts = this.getTotalPartCosts(vehicle.id);
    return (totalEstimate - totalCostsParts);
  }

  getVehicleTotalCosts(vehicle: any, jobs: any): any {
    var total = 0;

    var totalCostsParts = this.getTotalPartCosts(vehicle.id);
    var totalCostJobs = this.getTotalJobPrice(jobs);
    var totalTax = this.getSaleTax(vehicle);
    var totalCostManagement = this.getVehicleCostManagement(vehicle);
    //var totalSalesCommission = this.getSalesCommission(vehicle);
    // return totalCostsParts + totalCostJobs + totalCostManagement + totalSalesCommission;
    //return totalCostsParts + totalCostJobs + totalTax;
    return totalCostsParts + totalCostJobs + totalTax + totalCostManagement;

  }
  getVehicleGross(vehicle: any, jobs: any): any {
    var total = 0;
    var totalEstimate = this.getVehicleTotalEstimates(vehicle);
    total = totalEstimate - this.getVehicleTotalCosts(vehicle, jobs);
    return total;
  }

  getSalesCommission(vehicle: any): any {


    var total = 0;
    if (this.getTotalSupplements(vehicle) > 0) {
      total = this.getTotalSupplements(vehicle) * 0.07;
    }

    return +total.toFixed(0);
  }
  getTotalPartCosts(vehicleId: any): any {

    var totalCosts = 0;

    for (let autopart of this.autopartsSearch) {
      if (autopart.vehicleId == vehicleId) {
        totalCosts += autopart.salePrice;
      }
    }
    return totalCosts;
  }

  onSelectFileEditorAutoparts(event: any): void {


    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      const file = event.target.files[0];


      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        alert('Only JPEG and JPG images are allowed');
        return;
      }

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;

          this.uploadAutopartImageWithFile(this.selectedAutopart.id, imageModel);

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




  uploadImageAutoparts(autopartId: any, imageModel: ImageModel) {

    this.autopartService.uploadImage(imageModel, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart.imageModels.push(result);
        if (this.selectedAutopart.imageModels.length == 1) {
          this.selectedAutopart.showInSearchImageId = result.id;
        }
      }
    });
  }


  backToListing(): void {

    // if (this.showSavedItems != true)
    //   this.detailSelected = false;

    this.imageModels = new Array();
    this.imageUrl = null;
    this.errorMessage = "";
    this.message1 = "";

    setTimeout(() => {
      if (this.selectedAutopart.id > 0)
        this.scrollService.scrollToElementById(this.selectedAutopart.id);
    }, 200);
  }

  setImage(index: any): void {

    this.selectedImage = this.vehicle.imageModels[index].id;
  }

  selectedImage2: any;
  counterImage2: any = 0;
  imageModelSelected: ImageModel = new ImageModel();

  setImage2(index: any): void {
    this.selectedImage2 = this.vehicle.imageModels[index].id;
    this.imageModelSelected = this.vehicle.imageModels[index];
  }

  selectedImage4: any;
  setImage4(imageModel: ImageModel): void {
    this.imageModelSelected = new ImageModel();
    this.selectedImage4 = imageModel.id;
    this.imageModelSelected = imageModel;
    this.imageModelSelected.paymentId = this.payment.id;
  }

  setImage3(index: any): void {

    this.vehicle.imageModels[index].toggle = !this.vehicle.imageModels[index].toggle;

    if (this.vehicle.imageModels[index].toggle == true) {
      this.selectedImage2 = this.vehicle.imageModels[index].id;

    } else {
      this.selectedImage2 = 0;
    }
  }

  setImageAutoPart(index: any): void {

    this.selectedImage = this.selectedAutopart.imageModels[index].id;
  }

  deleteImageAutopart(autopartId: any, imageId: any) {


    console.log("deleteImage");

    this.autopartService.deleteImageWihtUserId(imageId, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.autopartService.get(autopartId).subscribe({
          next: (result => {
            console.log(result);
            this.selectedAutopart = result;
            this.selectedImage = this.selectedAutopart.showInSearchImageId;

          })
        });
      }
    });
  }

  showDocTypedImageModels: boolean = false;

  deleteImage(vehicleId: any, imageId: any) {


    console.log("deleteImage");

    this.vehicleService.deleteImage(imageId, vehicleId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.vehicleService.get(vehicleId).subscribe({
          next: (result => {
            console.log(result);
            this.vehicle = result;
            this.selectedImage = this.vehicle.showInSearchImageId;

            for (let i = 0; i < this.vehicles.length; i++) {
              if (this.vehicles[i].id == this.vehicle.id) {
                this.vehicles[i] = this.vehicle;
              }
            }

            for (let docType of this.docTypes) {
              if (docType.imageModels.length > 0) {
                for (let i = 0; i < docType.imageModels.length; i++) {
                  if (docType.imageModels[i].id == imageId) {
                    docType.imageModels.splice(i, 1);
                  }
                }
              }
            }
          })
        });
      }
    });
  }

  deleteImage2(vehicleId: any, imageId: any) {


    console.log("deleteImage2");

    this.vehicleService.deleteImage(imageId, vehicleId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.vehicleService.get(vehicleId).subscribe({
          next: (result => {
            console.log(result);
            this.vehicle = result;

            for (let i = 0; i < this.vehicles.length; i++) {
              if (this.vehicles[i].id == this.vehicle.id) {
                this.vehicles[i] = this.vehicle;
              }
            }

            this.selectedImage2 = this.vehicle.showInSearchImageId;

            for (let docType of this.docTypes) {
              if (docType.imageModels.length > 0) {
                for (let i = 0; i < docType.imageModels.length; i++) {
                  if (docType.imageModels[i].id == imageId) {
                    docType.imageModels.splice(i, 1);
                  }
                }
              }
            }

            // if (this.vehicle.imageModels.length == 0) {
            //   this.vehicle.showInSearchImageId = 0;
            // }
          })

        });
      }
    });
  }

  refresh(): void {

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 400);

  }

  isMobile: boolean = false;

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  confirmNotificationReceived(note: Note) {



    const customTitle = "" + note.notes + "";
    const message = "Acknowledge message from " + this.getEmployeeName(note.employeeId).toUpperCase() + "  is received ?";
    const buttonType = "yesNo" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type
    this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
      if (confirmed == undefined) {

        return;
      } else if (confirmed) {

        this.jobService.getJob(note.jobId).subscribe({
          next: result => {
            this.job = result;

            for (let vehicle of this.vehicles) {
              if (vehicle.id == this.job.vehicleId) {
                this.vehicleJob = vehicle;
                this.vehicle = vehicle;
              }
            }

            this.job.reason = "notify";
            this.job.notifiedAt = new Date();
            this.job.notified = true;

            this.jobService.createJob(this.user.id, this.job).subscribe({
              next: result => {
                if (result) {
                  this.searchInput = this.vehicle.year + " " + this.vehicle.make + " " + this.vehicle.model;
                  //this.searchWithSearchInput();
                  const elementInput = <HTMLInputElement>document.querySelector("[id='" + this.searchInput + "']");
                  if (elementInput) {
                    console.log("found it");
                    elementInput.setAttribute('value', this.searchInput);
                  }
                  this.printPageJob('print-content-job', 'jobs', result);

                }
              }
            });



          }
        });

      } else {


        this.jobService.getJob(note.jobId).subscribe({
          next: result => {

            for (let vehicle of this.vehicles) {
              if (vehicle.id == this.job.vehicleId) {
                this.vehicleJob = vehicle;
                this.vehicle = vehicle;
              }
            }
            //this.document.getElementById("editVehicle").click();
            //this.openTab('editVehicle');
            this.displayStyle2 = 'visible';
            this.displayStyle3 = "1";

            // this.showVehicleListing = false;
            // this.vehicleHistories = new Array();
            //this.getDetail(this.vehicle, this.vehicle.id)
            //this.getVehicleJobs2(this.vehicle.id);
            // this.getVehiclePayments(this.vehicle.id);
            // this.getAllVehicleReceipt(this.vehicle.id);
            // this.getAllVehicleClaims(this.vehicle.id);
            //  this.getAutopartForVehicle(this.vehicle.id, true);
            //this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);


            //this.editModeVehicle = false;
            //this.openTab('jobs-tab');

          }
        });



      }
    });


  }

  interval: number = 5000;

  private searchWithSearchInput() {
    this.onSetSerachIpputValue(this.searchInput).subscribe({
      next: (result: any) => {
        if (result) {
          this.searchCount = result;
          const elementInput = <HTMLInputElement>document.querySelector("[id='" + this.searchInput + "']");
          if (elementInput) {
            console.log("found it");
            elementInput.setAttribute('value', this.searchInput);
          }
          // if (this.vehiclesOriginal.length > 0)
          //   this.vehicles = this.vehiclesOriginal.filter(vehicle => vehicle.serachString.toLowerCase().includes(result));
        }
      }
    });
  }

  onSetSerachIpputValue(value: any): any {
    this.searchInput = value;
    return this.searchInput;
  }

  private sub: any;
  userId: any = "";

  filterEmployees(employees: Employee[], status: any): Employee[] {

    return employees.filter(a => a.status == status);
  }


  ngOnInit(): void {

    this.sub = this.route.params.subscribe(params => {
      this.userId = params['userId']; // (+) converts string 'id' to a number
      console.log(this.userId);
      if (this.userId == null) {
        this.router.navigate(['/login']);
      }
      console.log(this.userId);

    });

    this.checkWindowWidth();

    this.userService.getPublicContent().subscribe({
      next: data => {
        // this.content = data;

        if (localStorage.getItem('pageSize') != null) {

          var pageSize = localStorage.getItem('pageSize');
          console.log(pageSize);

          if (pageSize != null)
            this.pageSize = + pageSize;
        }

        //this.currentUser = this.storageService.getUser();
        try {

          this.getUserById(this.userId);

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




    // this.currentUser = this.storageService.getUser();
    // if (this.currentUser == null) {
    //   this.router.navigate(['/login']);
    // }
    // if (this.currentUser.username) {

    //   this.userService.getUser(this.currentUser.username).subscribe({
    //     next: data => {
    //       //console.log("profile/user" + data);
    //       if (data != null) {
    //         this.currentUser = data;
    //         this.form.id = this.currentUser.id;
    //         this.form.password = "";
    //         this.form.newPassword = "";
    //         this.form.newPasswordComfirmed = "";
    //         this.form.firstName = this.currentUser.firstName;

    //         this.form.lastName = this.currentUser.lastName;

    //         this.form.username = this.currentUser.email;
    //         this.form.email = this.currentUser.email;
    //         this.form.phone = this.currentUser.phone;
    //         // this.form.password = this.currentUser.password;
    //         this.form.bussinessname = this.currentUser.bussinessname;

    //         for (var i = 0; i < this.currentUser.roles.length; i++) {
    //           this.form.role = this.currentUser.roles[i].name;
    //         }

    //         for (var i = 0; i < this.currentUser.addresses.length; i++) {
    //           this.form.street = this.currentUser.addresses[i].street;
    //           this.form.city = this.currentUser.addresses[i].city;
    //           this.form.state = this.currentUser.addresses[i].state;
    //           this.form.zip = this.currentUser.addresses[i].zip;
    //         }
    //       }
    //     },
    //     error: err => {
    //       if (err.error) {
    //         try {
    //           const res = JSON.parse(err.error);
    //           this.content = res.message;
    //         } catch {
    //           this.content = `Error with status: ${err.status} - ${err.statusText}`;
    //         }
    //       } else {
    //         this.content = `Error with status: ${err.status}`;
    //       }
    //     }
    //   });
    // }
  }

  setJobNotifiedAndPrint(data: any) {
    this.jobService.getJob(+data).subscribe({
      next: result => {
        this.job = result;
        for (let vehicle of this.vehicles) {
          if (vehicle.id == this.job.vehicleId)
            this.vehicleJob = vehicle;

        }
        this.vehicle = this.vehicleJob;
        this.job.reason = "notify";
        this.job.notifiedAt = new Date();
        this.job.notified = true;

        this.jobService.createJob(this.user.id, this.job).subscribe({
          next: result => {
            if (result) {
              this.printPageJob('print-content-job', 'jobs', result);
            }
          }
        });

      }
    });
  }

  setJobNotifiedAndPrintWithJobId(jobId: any) {
    this.jobService.getJob(jobId).subscribe({
      next: result => {
        this.job = result;
        for (let vehicle of this.vehicles) {
          if (vehicle.id == this.job.vehicleId)
            this.vehicleJob = vehicle;

        }
        this.vehicle = this.vehicleJob;
        this.job.reason = "notify";
        this.job.notifiedAt = new Date();
        this.job.notified = true;

        this.jobService.createJob(this.user.id, this.job).subscribe({
          next: result => {
            if (result) {
              this.printPageJob('print-content-job', 'jobs', result);
            }
          }
        });

      }
    });
  }


  getTopImageLabel(imageModel: ImageModel): any {
    if (imageModel.employeeId > 0) {

      return this.getEmployeeName(imageModel.employeeId);

    } else if (imageModel.userId > 0) {
      return this.getUserName(imageModel.userId);

    } else {

    }
  }

  // Send a Job back to the server
  sendJobToServer(note: any): void {
    const message = {
      userId: this.user.id,
      note: note
    };
    // Send the Job object along with userId back to the server
    this.socket?.send(JSON.stringify(message));
  }


  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
  cindexEmployees: any = 0;

  getMyJobsIndex(userId: any, index: any): void {
    this.cindexEmployees = index;
    this.isH2Visible = true;
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

  getMyJobs(userId: any): void {
    this.isH2Visible = true;
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

  setJobIdClaim(jobId: any) {
    this.currentJobId = jobId;
    for (let claim of this.claims) {
      for (let job of claim.jobs) {
        if (job.id == jobId) {
          this.claim = claim;
          console.log(claim);
        }
      }
    }
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

  onChangeDisclaimer($event: any): void {
    var disclaimerId = $event.target.value;
    this.disclaimerText = "";
    for (let disclaimer of this.disclaimers) {
      if (disclaimer.id == disclaimerId) {
        this.disclaimerText = disclaimer.text;
      }
    }

  }


  setWarrantyText(warrantyId: any): void {

    this.warrantyText = "";
    for (let warranty of this.warranties) {
      if (warranty.id == warrantyId) {
        this.warrantyText = warranty.text;
      }
    }

  }

  OnChangeWarranty($event: any): void {

    var warrantyId = $event.target.value;

    this.warrantyText = "";
    for (let warranty of this.warranties) {
      if (warranty.id == warrantyId) {
        this.warrantyText = warranty.text;
      }
    }

  }

  setReceiptId(receiptId: any): void {
    this.currentReceiptId = receiptId;
    console.log(this.currentReceiptId);
  }

  currentClaimId: any = -1;

  setClaimId(claimId: any): void {
    this.currentClaimId = claimId;
    console.log(this.currentClaimId);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' }); // Optional: smooth scrolling
    }
  }

  deleteImagePayment(paymentId: any, imageId: any) {


    console.log("deleteImage");

    this.paymentService.deleteImageWihtUserId(imageId, paymentId, this.currentUser.id).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.payment.imageModels.length; i++) {
          if (this.payment.imageModels[i].id == imageId) {
            this.payment.imageModels.splice(i, 1);
          }
        }
      }
    });
  }

  currentPaymentPaymentId: any = 0;

  setPaymentPaymentId(paymentId: any): void {
    this.currentPaymentPaymentId = paymentId;
    console.log(this.currentPaymentPaymentId);
  }


  setPaymentId(paymentId: any) {
    this.currentPaymentId = paymentId;
  }

  shallAllJobInfo: boolean = false;
  shallAllPaymentInfo: boolean = false;

  getVehicleHistory(vehicleId: any): void {
    console.log("getVehicleHistory");
    //this.showVehicleHistory = !this.showVehicleHistory;
    // if (this.showVehicleHistory == true)

    this.vehicleHistoryService.getVehicleHistory(vehicleId).subscribe({
      next: result => {
        //console.log(result);
        this.vehicleHistories = result;
        this.vehicleHistories = this.vehicleHistories.sort((a, b) => b.id - a.id);
        var objectStrings = "receipt payment supplement claim autopart";
        for (let history of this.vehicleHistories) {

          history.objectContextType = 0;
          //if (myString.startsWith('Hello')) {
          // Do something
          //}

          history.objectString = "";
          if (history.type == 0) {
            history.typeString = "add";
            history.iconClassString = "fa fa-plus";
            history.colorClassString = "text-success"
          }
          if (history.type == 1) {
            history.typeString = "update"
            history.iconClassString = "fa fa-save";
            history.colorClassString = "text-primary"

          };
          if (history.type == 2) {
            history.typeString = "remove";
            history.iconClassString = "fa fa-trash";
            history.colorClassString = "text-danger"
          }

          if (objectStrings.includes(history.objectName.toLowerCase()) &&
            !(history.name.toLowerCase().includes("calender") &&
              !(history.name.toLowerCase().includes("image"))
              && history.objectKey > 0)) {
            history.value = '$' + history.value;
          }

          if (history.name.toLowerCase() == "vehicle status") {
            for (let status of this.statuss) {
              if (history.value == status.id) {
                history.value = "[" + status.name + "]";
              }
            }
          }

          if (history.name.toLowerCase() == "vehicle assigned To") {
            for (let employee of this.employees) {
              if (history.value == employee.id) {
                history.value = "[" + employee.firstName + " " + employee.lastName + "]";
              }
            }
          }

          if (history.name.toLowerCase() == "vehicle key location") {
            for (let location of this.keyLocations) {
              if (history.value == location.id) {
                history.value = "[" + location.name + "]";
              }
            }
          }

          if (history.name.toLowerCase() == "vehicle location") {
            for (let location of this.locations) {
              if (history.value == location.id) {
                history.value = "[" + location.name + "]";
              }
            }
          }

          if (history.name.toLowerCase() == "vehicle job request type") {
            for (let jobRequestType of this.jobRequestTypes) {
              if (history.value == jobRequestType.id) {
                history.value = "[" + jobRequestType.name + "]";
              }
            }
          }

          if (history.name.toLowerCase() == "autopart image"
            || history.name.toLowerCase() == "autopart image employee") {
            history.value = ""
            history.objectContextType = 2;
          }

          if (history.name.toLowerCase() == "job image employee" || history.name.toLowerCase() == "job image") {
            history.value = ""
            history.objectContextType = 3;
          }

          if (history.name.toLowerCase() == "payment image") {
            history.value = ""
            history.objectContextType = 5;
          }


          if (history.name.toLowerCase() == "note") {
            //history.value = ""
            history.objectContextType = 4;
          }


          if (history.name.toLowerCase() == "vehicle image") {
            history.value = ""
            history.objectContextType = 1;
          }


          if (history.name.toLowerCase() == "vehicle image doc type") {
            history.objectContextType = 1;
            for (let docType of this.docTypes) {
              if (history.value == docType.id) {
                history.value = "[" + docType.name + "]";
              }
            }


          }


          // if (history.name?.toLowerCase().startsWith("receipt") && history.objectKey > 0) {
          //   for (let receipt of this.receipts) {
          //     if (receipt.id == history.objectKey) {
          //       history.objectString = receipt.name + " $" + receipt.amount;
          //     }
          //   }
          // }

          // if (history.name?.toLowerCase().startsWith("payment") && history.objectKey > 0) {
          //   for (let payment of this.payments) {
          //     if (payment.id == history.objectKey) {
          //       history.objectString = payment.name + " $" + payment.amount;
          //     }
          //   }
          // }

          // if (history.name?.toLowerCase().startsWith("payment") && history.objectKey > 0) {
          //   for (let payment of this.payments) {
          //     if (payment.id == history.objectKey) {
          //       history.objectString = payment.name + " $" + payment.amount;
          //     }
          //   }
          // }


          // if (history.name?.toLowerCase().startsWith("claim") && history.objectKey > 0) {
          //   for (let claim of this.claims) {
          //     if (claim.id == history.objectKey) {
          //       history.objectString = claim.name + " $" + claim.amount;
          //     }
          //   }
          // }

          // if (history.name?.toLowerCase().startsWith("job") && history.objectKey > 0) {
          //   for (let job of this.jobs) {
          //     if (job.id == history.objectKey) {
          //       history.objectString = job.name + " " + job.notes;
          //     }
          //   }
          // }

          // if (history.name?.toLowerCase().startsWith("supplement") && history.objectKey > 0) {
          //   for (let supplement of this.vehicle.supplements) {
          //     if (supplement.id == history.objectKey) {
          //       history.objectString = supplement.notes + " $" + supplement.amount;
          //     }
          //   }
          // }
          //safeguard a bit
          var hasIt: boolean = false;
          for (let user of this.users) {
            if (history.userId == user.id) {
              history.userName = user.firstName + " " + user.lastName;
              hasIt = true;
            }
          }
          if (!hasIt) {
            history.userName = "Xx" + " " + "Xx";
          }
        }
      }
    })

  }

  activeFilter: string = 'All';
  // Filter options
  filterOptions = [
    { label: 'All', value: 'All', counts: 0 },
    { label: 'Autopart', value: 'Autopart', counts: 0 },
    { label: 'Estimate', value: 'Estimate', counts: 0 },
    { label: 'Job', value: 'Job', counts: 0 },
    { label: 'Payment', value: 'Payment', counts: 0 },
    { label: 'Receipt', value: 'Receipt', counts: 0 },
    { label: 'Supplement', value: 'Supplement', counts: 0 },
    { label: 'Vehicle', value: 'Vehicle', counts: 0 }
  ];

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  hasEID(): boolean {
    for (let receipt of this.receipts) {
      if (receipt.claimId > 0)
        return true;
    }
    return false;
  }

  filterVehicleHistories(vehicleHistories: VehicleHistory[]): any[] {

    if (this.activeFilter == 'All')
      return vehicleHistories;
    else
      return vehicleHistories.filter(a => a.objectName == this.activeFilter);
  }

  getVehiclesHistories($event: any): void {

    var date = $event.target.value;
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    this.searchVehicleSnapshot(7, 0, this.pageSize, newDate);

  }

  onChangeServiceManager($event: any, employeeId: any): void {

    console.log("onChangeServiceManager");
    this.vehicle.serviceManager = employeeId;
    this.vehicle.reason = "service Manager";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeServiceManager", result);
        this.vehicle = result;
        this.vehicle.reason = "";

      }
    })
  }

  totalVehicleHistoryCounts: any = 0;

  setVehicleHistoryVariables(vehicle: Vehicle) {

    var objectStrings = "receipt payment supplement claim autopart";

    for (let history of vehicle.vehicleHistories) {

      this.totalVehicleHistoryCounts++;

      history.objectContextType = 0;
      history.objectString = "";

      for (let filterOption of this.filterOptions) {
        if (filterOption.value == 'All') {
          filterOption.counts = this.totalVehicleHistoryCounts;
        }
        if (history.objectName == filterOption.value) {
          filterOption.counts++;
        }
      }

      if (history.type == 0) {
        history.typeString = "add";
        history.iconClassString = "fa fa-plus";
        history.colorClassString = "text-success"
      }
      if (history.type == 1) {
        history.typeString = "update"
        history.iconClassString = "fa fa-save";
        history.colorClassString = "text-primary"

      };
      if (history.type == 2) {
        history.typeString = "remove";
        history.iconClassString = "fa fa-trash";
        history.colorClassString = "text-danger"
      }

      if (objectStrings.includes(history.objectName.toLowerCase()) &&
        !(history.name.toLowerCase().includes("calender") &&
          !(history.name.toLowerCase().includes("image"))
          && history.objectKey > 0)) {
        history.value = '$' + history.value;
      }

      if (history.name.toLowerCase() == "vehicle status") {
        for (let status of this.statuss) {
          if (history.value == status.id) {
            history.value = "[" + status.name + "]";
          }
        }
      }

      if (history.name.toLowerCase() == "vehicle assigned To") {
        for (let employee of this.employees) {
          if (history.value == employee.id) {
            history.value = "[" + employee.firstName + " " + employee.lastName + "]";
          }
        }
      }

      if (history.name.toLowerCase() == "vehicle key location") {
        for (let location of this.keyLocations) {
          if (history.value == location.id) {
            history.value = "[" + location.name + "]";
          }
        }
      }

      if (history.name.toLowerCase() == "vehicle location") {
        for (let location of this.locations) {
          if (history.value == location.id) {
            history.value = "[" + location.name + "]";
          }
        }
      }

      if (history.name.toLowerCase() == "vehicle job request type") {
        for (let jobRequestType of this.jobRequestTypes) {
          if (history.value == jobRequestType.id) {
            history.value = "[" + jobRequestType.name + "]";
          }
        }
      }

      if (history.name.toLowerCase() == "autopart image"
        || history.name.toLowerCase() == "autopart image employee") {
        history.value = ""
        history.objectContextType = 2;
      }

      if (history.name.toLowerCase() == "job image employee" || history.name.toLowerCase() == "job image") {
        history.value = ""
        history.objectContextType = 3;
      }

      if (history.name.toLowerCase() == "payment image") {
        history.value = ""
        history.objectContextType = 5;
      }


      if (history.name.toLowerCase() == "note") {
        //history.value = ""
        history.objectContextType = 4;
      }


      if (history.name.toLowerCase() == "vehicle image") {
        history.value = ""
        history.objectContextType = 1;
      }


      if (history.name.toLowerCase() == "vehicle image doc type") {
        history.objectContextType = 1;
        for (let docType of this.docTypes) {
          if (history.value == docType.id) {
            history.value = "[" + docType.name + "]";
          }
        }

      }

      var hasIt: boolean = false;
      for (let user of this.users) {
        if (history.userId == user.id) {
          history.userName = user.firstName + " " + user.lastName;
          hasIt = true;
        }
      }
      if (!hasIt) {
        history.userName = "Xx" + " " + "Xx";
      }
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

  getUserByUuid(uuid: any): void {

    this.userService.getUserByUuid(uuid).subscribe({
      next: result => {
        //console.log(result);
        this.user = result;

        if (this.user.partMarketOnly == true) {
          this.router.navigate(['/autoparts']);
        }

        if (this.user.shopDisplayUser == true) {
          this.router.navigate(['/shopdisplay']);
        }

        if (this.user.companyId != 0) {
          this.getAllNotes(this.user.companyId);
          this.getAllComponyEmployees(this.user.companyId);
          this.getAllComponyUsers(this.user.companyId);
          this.getSettings(this.user.companyId);

          this.getLocationOverviews();
          this.getJobRequestTypeOverview(this.user.companyId);
          this.getAssignedToOverview(this.user.companyId);
          //this.searchVehicle(7, 0, this.pageSize);
          this.searchVehicleSnapshot(7, 0, this.pageSize, new Date());


          this.getProductionOverview();



          //  this.searchVehicle(5, 0, this.pageSize);

        }

      }
    })

  }

  getUserById(userId: any): void {

    this.userService.getUserById(userId).subscribe({
      next: result => {
        //console.log(result);
        this.user = result;

        if (this.user.partMarketOnly == true) {
          this.router.navigate(['/autoparts']);
        }

        if (this.user.shopDisplayUser == true) {
          this.router.navigate(['/shopdisplay']);
        }

        if (this.user.companyId != 0) {
          this.getAllNotes(this.user.companyId);
          this.getAllComponyEmployees(this.user.companyId);
          this.getAllComponyUsers(this.user.companyId);
          this.getSettings(this.user.companyId);

          this.getLocationOverviews();
          this.getJobRequestTypeOverview(this.user.companyId);
          this.getAssignedToOverview(this.user.companyId);
          //this.searchVehicle(7, 0, this.pageSize);
          this.searchVehicleSnapshot(7, 0, this.pageSize, new Date());


          this.getProductionOverview();



          //  this.searchVehicle(5, 0, this.pageSize);

        }

      }
    })

  }

  warrantyId: any = 0;
  warrantyText: any = "";
  warranties: Warranty[] = new Array();
  warranty: Warranty = new Warranty();

  columnInfos: ColumnInfo[] = new Array();
  columnInfo: ColumnInfo = new ColumnInfo();

  isInColumnInfos(columnInfoFieldName: any): boolean {

    for (let columnInfo of this.columnInfos) {
      if (columnInfo.fieldName == columnInfoFieldName) {
        return true;
      }
    }

    return false;
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
          this.keyLocations = this.setting.keyLocations;
          this.insurancers = this.setting.insurancers;
          this.inTakeWays = this.setting.inTakeWays;
          this.statuss = this.setting.statuss;
          this.paymentTypes = this.setting.paymentTypes;
          this.rentals = this.setting.rentals;
          this.disclaimers = this.setting.disclaimers;
          this.warranties = this.setting.warranties;
          this.columnInfos = this.setting.columnInfos;
          this.itemTypes = this.setting.itemTypes;
          this.docTypes = this.setting.docTypes;
          this.vendors = this.setting.vendors;

          if (this.columnInfos.length == 0) {
            this.columnInfos = this.config.optionsColumnInfo;
            for (let columnInfo of this.columnInfos) {
              this.createAndUpdateColumnInfo(columnInfo);
            }
            this.showColumnInfo = true; // first time to force configuration
          } else {

            if (this.config.optionsColumnInfo.length > this.columnInfos.length) {
              for (let columnInfoConfig of this.config.optionsColumnInfo) {
                if (this.isInColumnInfos(columnInfoConfig.fieldName) == false) {
                  columnInfoConfig = this.createAndUpdateColumnInfo(columnInfoConfig);
                  this.columnInfos.push(columnInfoConfig);
                }
              }
            }
          }

          this.columnInfos = this.columnInfos.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

          //this.columnSpanForHistories = this.getColumnsSpan() -2;

          for (let disclaimer of this.disclaimers) {
            if (disclaimer.isDefault == true) {
              this.disclaimerId = disclaimer.id;
              this.disclaimerText = disclaimer.text;
            }
          }

          for (let warranty of this.warranties) {
            if (warranty.isDefault == true) {
              this.warrantyId = warranty.id;
              this.warrantyText = warranty.text;
            }
          }

          for (let employee of this.employees) {
            for (let employeeRole of this.employeeRoles) {
              if (employeeRole.id == employee.roleId) {
                employee.roleName = employeeRole.name;
                employee.rolePrecentage = employeeRole.precentage;
                employee.commissionBased = employeeRole.commissionBased;
              }
            }
          }

          this.company = this.setting.company;
          this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
          this.companyDefaultTaxRate = this.company.taxRate;

          this.statuss2 = this.setting.statuss;
          var statusNoStatus = new Status();
          statusNoStatus.name = "No Status";
          statusNoStatus.id = 0;
          statusNoStatus.sequenceNumber = -1;
          this.statuss2.push(statusNoStatus);
          this.statuss2 = this.statuss2.sort((a, b) => a.sequenceNumber - b.sequenceNumber);


          var docTYpeNoType = new DocType();
          docTYpeNoType.name = "Not Sorted";
          docTYpeNoType.id = 0;
          docTYpeNoType.sequenceNumber = -1;
          this.docTypes.push(docTYpeNoType);
          for (let docType of this.docTypes) {
            docType.imageModels = new Array();
          }

          this.docTypes = this.docTypes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);



        }
      }
    })
  }

  showColumnInfo: boolean = false;

  saveColumnInfoEnabled(columnInfo: any, enabled: boolean): void {
    //columnInfo.companyId = this.user.companyId;
    //columnInfo.userId = this.user.id;
    columnInfo.enabled = enabled;

    this.columnInfoService.createColumnInfo(this.user.id, columnInfo).subscribe({
      next: result => {
        console.log(result);
        columnInfo = result;
      }
    })
  }

  saveColumnInfo(columnInfo: any): void {
    //columnInfo.companyId = this.user.companyId;
    //columnInfo.userId = this.user.id;

    this.columnInfoService.createColumnInfo(this.user.id, columnInfo).subscribe({
      next: result => {
        console.log(result);
        columnInfo = result;
      }
    })
  }
  createAndUpdateColumnInfo(columnInfo: any): any {

    columnInfo.companyId = this.user.companyId;
    columnInfo.userId = this.user.id;

    this.columnInfoService.createColumnInfo(this.user.id, columnInfo).subscribe({
      next: result => {
        console.log(result);
        columnInfo = result;
        return columnInfo;
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
        if (result) {
          //this.users = result;
          this.employees = result;
          this.employees = this.filterEmployees(this.employees, 0);
        }

        for (let employee of this.employees) {
          employee.url = location.origin + "/#/operation/" + employee.token;
          for (let employeeRole of this.employeeRoles) {
            if (employeeRole.id == employee.roleId) {
              employee.roleName = employeeRole.name;
              employee.rolePrecentage = employeeRole.precentage;
              employee.commissionBased = employeeRole.commissionBased;
            }
          }
        }
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
        if (result != null) {
          this.notes = result;
          if (this.notes.length > 0) {
            this.notes = this.notes.filter(note => note.jobId > 0 && note.year > 0 && this.job.notes != "JOB");
            if (this.notes.length == 0) {
              // this.notes = this.notes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
              //this.toggleClass();
            }
          } else {
            this.toggleClass();
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
      this.searchVehicle(5, 0, this.pageSize);
      // this.getAllStatus(user.companyId);
      // this.getAllLocations(user.companyId);
      // this.getAllPaymentStatus(user.companyId);
      // this.getAllPaymentMethod(user.companyId);
      // this.getAllJobRequestType(this.user.companyId);

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

  unArchive(vehicle: Vehicle): void {
    console.log("unArchive");
    if (vehicle.archived == true) {
      vehicle.archived = false;
      vehicle.reason = "unarchive";
    }
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({

      next: result => {
        //console.log("" + result);
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

      this.successMessageVehicle = "";
      this.errorMessageVehicle = "Please fill the vehicle form, Year/Make/Model/Color/Work Request/Price/Job Request Type are required";
      return;
    }

    if (this.vehicle.priorDamage != null && this.vehicle.priorDamage != '' && this.vehicle.priorDamage.length > 2000) {
      this.errorMessageVehicle = "Prior Damages are too long";
      return;
    }

    if (this.vehicle.comments != null && this.vehicle.comments != '' && this.vehicle.comments.length > 2000) {
      this.errorMessageVehicle = "Comments are too long";
      return;
    }


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


      //vehicle.sequenceNumber = 0;

      vehicle.companyId = this.user.companyId;
      vehicle.customer.companyId = this.user.companyId;

      this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({

        next: async result => {

          console.log(result);

          this.vehicle = result;

          this.base64Image = "";

          // setTimeout(() => {
          //   //const elementImage = <HTMLElement>document.querySelector("[id='usa_image']");
          //   //const elementImage = <HTMLElement>document.querySelector("[id='usa_image2']");
          //   const elementImage = <HTMLElement>document.querySelector("[id='usa_image3']");

          //   var backgroundColorHex = " #FFFFFF";
          //   htmlToImage.toJpeg(elementImage, { backgroundColor: backgroundColorHex })
          //     .then((dataUrl) => {
          //       // var img = new Image();
          //       // img.src = dataUrl;

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
  }

  getPriorDamageWordCount(): number {

    if (this.vehicle.priorDamage) {

      var words = this.vehicle.priorDamage.split(/\s+/);
      if (words)
        return words.length;
    }

    return 0;
  }


  setDetail(vehicle: Vehicle, index: any): void {

    this.vehicle = vehicle;
    this.vehicleJob = vehicle;
    this.targetDateOriginal = vehicle.targetDate;
    this.errorMessage = "";
    this.successMessage = "";
    this.errorMessageVehicle = "";
    this.successMessageVehicle = "";
    //this.getVehicle(vehicle.id);




    // this.getVehicleJobs(vehicle.id);


  }

  doubleClickVehicle(vehicle: Vehicle, index: any): void {
    this.getDetail(vehicle, index);
    const collapseElement = <HTMLElement>document.querySelector("[id='editVehicle']");

    //const collapseElement = document.getElementById('#editVehicle');
    if (collapseElement) {
      collapseElement.classList.toggle('show');
    }
  }

  url: any = "";


  getDetail(vehicle: Vehicle, index: any): void {


    this.vehicle = vehicle;
    this.vehicleJob = vehicle;
    this.targetDateOriginal = vehicle.targetDate;
    this.errorMessage = "";
    this.successMessage = "";
    this.errorMessageVehicle = "";
    this.successMessageVehicle = "";
    this.selectedImage = 0;
    this.selectedImage2 = 0;

    this.imageModelSelected = new ImageModel();
    this.showDocTypedImageModels = false;

    this.pdfSrc = null;
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
    this.currentIndex = index;

    if (this.vehicle.imageModels != null && this.vehicle.imageModels.length > 0) {
      this.vehicle.imageModels = this.vehicle.imageModels.sort((a: { sequenceNumber: number; }, b: { sequenceNumber: number; }) => a.sequenceNumber - b.sequenceNumber);
      this.selectedImage = this.vehicle.showInSearchImageId;
    }

    for (let docType of this.docTypes) {
      docType.imageModels = new Array();
    }

    if (this.vehicle.imageModels != null && this.vehicle.imageModels.length > 0) {
      for (let imageModel of this.vehicle.imageModels) {

        if (this.isInDocType(imageModel.docType)) {

          for (let docType of this.docTypes) {
            if (imageModel.docType == docType.id) {
              imageModel.docTypeName = docType.name;
              docType.imageModels.push(imageModel);
            }
          }
        } else {
          this.docTypes[0].imageModels.push(imageModel);
        }
      }
      for (let docType of this.docTypes) {
        //docType.imageModels = docType.imageModels.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        docType.imageModels = docType.imageModels.sort((a, b) => a.id - b.id);
      }
    }



    this.vehicleHistories = new Array();
    this.getVehicleJobs2(vehicle.id);
    this.getVehiclePayments(vehicle.id);
    this.getAllVehicleReceipt(vehicle.id);
    this.getAllVehicleClaims(vehicle.id);
    this.getAutopartForVehicle(vehicle.id, true);
    this.getAllVehiclePurchaseOrderVehicles(vehicle.id);
    //this.getPdfFiles(vehicle.id)

    this.url = location.origin + "/#/vehicle2/" + this.vehicle.token;

    // this.getVehicleJobs(vehicle.id);


  }

  counterQrcode: any = 0;

  switchQrCode(): void {
    this.counterQrcode++;
    if (this.counterQrcode % 2 == 1) {
      this.url = location.origin + "/#/vehicle3/" + this.vehicle.token;
    } else {
      this.url = location.origin + "/#/vehicle2/" + this.vehicle.token;
    }
  }

  getDetailFromNote(vehicleId: any, index: any): void {

    for (let vehicle of this.vehicles) {
      if (vehicle.id == vehicleId) {
        this.vehicle = vehicle;
        this.vehicleJob = vehicle;
        this.targetDateOriginal = vehicle.targetDate;
      }
    }

    this.errorMessage = "";
    this.successMessage = "";
    this.errorMessageVehicle = "";
    this.successMessageVehicle = "";
    this.selectedImage = 0;
    this.selectedImage2 = 0;

    this.imageModelSelected = new ImageModel();
    this.showDocTypedImageModels = false;

    this.pdfSrc = null;
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
    this.currentIndex = index;

    if (this.vehicle.imageModels != null && this.vehicle.imageModels.length > 0) {
      this.vehicle.imageModels = this.vehicle.imageModels.sort((a: { sequenceNumber: number; }, b: { sequenceNumber: number; }) => a.sequenceNumber - b.sequenceNumber);
      this.selectedImage = this.vehicle.showInSearchImageId;
    }

    for (let docType of this.docTypes) {
      docType.imageModels = new Array();
    }

    if (this.vehicle.imageModels != null && this.vehicle.imageModels.length > 0) {
      for (let imageModel of this.vehicle.imageModels) {

        if (this.isInDocType(imageModel.docType)) {

          for (let docType of this.docTypes) {
            if (imageModel.docType == docType.id) {
              imageModel.docTypeName = docType.name;
              docType.imageModels.push(imageModel);
            }
          }
        } else {
          this.docTypes[0].imageModels.push(imageModel);
        }
      }
      for (let docType of this.docTypes) {
        //docType.imageModels = docType.imageModels.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        docType.imageModels = docType.imageModels.sort((a, b) => a.id - b.id);
      }
    }



    this.vehicleHistories = new Array();
    this.getVehicleJobs2(this.vehicle.id);
    this.getVehiclePayments(this.vehicle.id);
    this.getAllVehicleReceipt(this.vehicle.id);
    this.getAllVehicleClaims(this.vehicle.id);
    this.getAutopartForVehicle(this.vehicle.id, true);
    this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
    //this.getPdfFiles(vehicle.id)

    this.url = location.origin + "/#/vehicle2/" + this.vehicle.token;

    // this.getVehicleJobs(vehicle.id);


  }

  autopartsSearch = new Array();

  getAutopartForVehicle(vehicleId: any, resetSelectedPart: boolean) {
    if (resetSelectedPart == true) {
      this.autopartsSearch = new Array();
      this.selectedAutopart = new AutoPart();
      this.selectedAutopart.showInSearchImageId = 0;
      this.selectedImage = 0;
    }

    this.autopartService.getAutopartForVehicle(vehicleId).subscribe({
      next: result => {
        console.log(result);
        this.autopartsSearch = result;
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        if (this.autopartsSearch.length > 0) {
          if (resetSelectedPart == true) {
            this.selectedAutopart = this.autopartsSearch[0];
            this.selectedImage = this.selectedAutopart.showInSearchImageId;
          }
        }

        //this.calculate();
      }
    })

  }

  messagePurchaseOrder: any = "";
  formTitle: any = "";
  forPurchaseOrder: boolean = false;

  createNewPurchaseOrder(forPurchaseOrder: boolean): void {

    this.purchaseOrder = new PurchaseOrderVehicle();
    this.selectedPurchaseOrder = new PurchaseOrderVehicle();
    this.selectedPurchaseOrder.id = 0;
    this.selectedPurchaseOrder.grade = undefined;
    this.selectedPurchaseOrder.title = undefined;
    this.selectedPurchaseOrder.partNumber = undefined;
    this.selectedPurchaseOrder.description = undefined;
    this.selectedPurchaseOrder.salePrice = undefined;

    this.selectedPurchaseOrder.stocknumber = this.randomString();
    this.errorMessagePurchaseOrder = "";

    this.messagePurchaseOrder = "";


  }

  detailSelected: boolean = false;
  //hover: any = null;
  editAutopart(autoPart: AutoPart, index: any): void {

    this.cindex = index;
    this.cindexAutpartPurchaseOrder = index;
    this.selectedAutopart = autoPart;
    this.detailSelected = true;
    this.selectedImage = this.selectedAutopart.showInSearchImageId;

    if (autoPart.claimId > 0 && autoPart.purchaseOrderId > 0) {
      for (let claim of this.claims) {
        if (claim.id == autoPart.claimId) {
          this.claim = claim;
        }
      }
    }


    //this.setAutopartViewCount(autoPart.id);

    // for (var i = 0; i < this.carListStringList.length; i++) {

    //   if (this.carListStringList[i].brand == this.selectedAutopart.make) {
    //     this.optionsModel = this.carListStringList[i].models;
    //   }

    // }


  }

  selectedPurchaseOrder: PurchaseOrderVehicle = new PurchaseOrderVehicle();
  cindexPurchaseOrder: any = -1;

  editPurchaseOrder(purchaseOrder: PurchaseOrderVehicle, index: any): void {

    this.cindexPurchaseOrder = index;
    this.selectedPurchaseOrder = purchaseOrder;
    this.errorMessagePurchaseOrder = "";
    if (this.selectedPurchaseOrder.claimId > 0) {
      for (let claim of this.claims) {
        if (claim.id == this.selectedPurchaseOrder.claimId) {
          this.claim = claim;
        }
      }
    }

  }

  onChangePurchaseOrderPurchaseStatus($event: any, purchaseOrder: PurchaseOrderVehicle): void {

    purchaseOrder.purchaseStatus = $event.target.value;
    console.log(purchaseOrder.purchaseStatus);
    if (purchaseOrder.purchaseStatus == 0) {
      purchaseOrder.reason = "no status";
    } else if (purchaseOrder.purchaseStatus == 1) {
      purchaseOrder.reason = "ordered";
      purchaseOrder.orderedAt = new Date();

    } else if (purchaseOrder.purchaseStatus == 2) {
      purchaseOrder.reason = "received"
      purchaseOrder.receivedAt = new Date();
    } else if (purchaseOrder.purchaseStatus == 3) {
      purchaseOrder.reason = "returned"
      purchaseOrder.returnedAt = new Date();
    }

    console.log(purchaseOrder.reason);

    this.purchseOrderVehicleService.createPurchaseOrderVehicle(this.user.id, purchaseOrder).subscribe({
      next: result => {
        console.log(result);
        if (result) {
          purchaseOrder = result;
          for (let i = 0; i < this.purchaseOrders.length; i++) {
            if (this.purchaseOrders[i].id == purchaseOrder.id) {
              this.purchaseOrders[i] = purchaseOrder;
            }
          }
        }
      }
    })
  }

  getUserName(userId: any): any {

    for (let user of this.users) {
      if (user.id == userId) {
        return user.firstName + " " + user.lastName;
      }
    }
    return "XX" + " " + "XX";
  }

  getEmployeeName(employeId: any): any {

    for (let employee of this.employees) {
      if (employee.id == employeId) {
        return employee.firstName + " " + employee.lastName;
      }
    }
    return "XX" + " " + "XX";
  }


  deletePurchaseOrder(purchaseOrder: PurchaseOrderVehicle, index: any): void {
    //console.log(event.target);


    if (purchaseOrder.claimId > 0) {

      const customTitle = 'Remove Purchase Order [' + purchaseOrder.title + "]";
      const message = 'Are you sure to remove this from Estimate [' + purchaseOrder.claimId + '] that may have [' + purchaseOrder.autoparts.length + '] parts ?';
      const buttonType = "yesNoCancel" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type


      // Call the service to show the confirmation dialog and pass the callback
      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed == undefined) {

          return;
        } else if (confirmed) {

          this.purchseOrderVehicleService.deletePurchaseOrderVehicleWithOption(purchaseOrder.id, this.user.id, 1).subscribe({
            next: data => {
              console.log(" " + data);
              this.getAllVehicleClaims(this.vehicle.id);
              this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
            },

            error: (e) => {
              console.log("deletePurchaseOrder error");
              this.message = e.error.message;
              console.error(e);
            }

          });
        } else {

        }
      });

    } else {
      console.log("deletePurchaseOrder");

      const customTitle = 'Remove Purchase Order [' + purchaseOrder.title + "]";
      const message = 'Are you sure to remove it ?';
      const buttonType = "yesNoCancel" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type


      // Call the service to show the confirmation dialog and pass the callback
      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed == undefined) {

          return;
        } else if (confirmed) {

          this.purchseOrderVehicleService.deletePurchaseOrderVehicle(purchaseOrder.id, this.user.id).subscribe({
            next: data => {
              console.log(" " + data);
              this.getAllVehicleClaims(this.vehicle.id);
              this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
            },

            error: (e) => {
              console.log("deletePurchaseOrder error");
              this.message = e.error.message;
              console.error(e);
            }

          });
        } else {

        }
      });

    }
  }

  deletePurchaseOrderClaim(purchaseOrder: PurchaseOrderVehicle, index: any, claim: Claim): void {
    //console.log(event.target);


    if (purchaseOrder.autoparts.length > 0) {
      const message = "Remove [" + purchaseOrder.autoparts.length + "] part/parts at the same time?";

      // Call the service to show the confirmation dialog and pass the callback
      this.confirmPurchseOrderDeletion(purchaseOrder);


    } else {


      const customTitle = 'Remove Purchase Order [' + purchaseOrder.title + "]";
      const message = 'Are you sure you want to remove this item?';
      const buttonType = "yesNo" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type

      // Call the service to show the confirmation dialog and pass the callback
      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed) {
          this.purchseOrderVehicleService.deletePurchaseOrderVehicleWithOption(purchaseOrder.id, this.user.id, 0).subscribe({
            next: data => {
              console.log(" " + data);

              this.getAllVehicleClaims(this.vehicle.id);
              this.getAllVehicleClaims(this.vehicle.id);
              this.getAutopartForVehicle(this.vehicle.id, true);
              this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
            },

            error: (e) => {
              console.log("deletePurchaseOrder error");
              this.message = e.error.message;
              console.error(e);
            }

          });
        } else {
          console.log('Item not deleted');
        }
      });




    }


  }

  private confirmPurchseOrderDeletion(purchaseOrder: PurchaseOrderVehicle) {

    const customTitle = 'Remove Purchase Order [' + purchaseOrder.title + "]";
    const message = "Remove [" + purchaseOrder.autoparts.length + "] part/parts at the same time ?";

    const buttonType = "yesNoCancel" //buttonType: 'yesNo' | 'okCancel' | 'yesNoCancel' | 'okOnly' = 'yesNo'  // Button type
    this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
      if (confirmed == undefined) {

        console.log("cnacelled");
        return;
      }
      else if (confirmed) {

        this.purchseOrderVehicleService.deletePurchaseOrderVehicleWithOption(purchaseOrder.id, this.user.id, 1).subscribe({
          next: data => {
            console.log(" " + data);

            this.getAllVehicleClaims(this.vehicle.id);
            this.getAutopartForVehicle(this.vehicle.id, true);
            this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
          },

          error: (e) => {
            console.log("deletePurchaseOrder error");
            this.message = e.error.message;
            console.error(e);
          }
        });

      } else {

        this.purchseOrderVehicleService.deletePurchaseOrderVehicleWithOption(purchaseOrder.id, this.user.id, 0).subscribe({
          next: data => {
            console.log(" " + data);
            this.getAutopartForVehicle(this.vehicle.id, true);
            this.getAllVehicleClaims(this.vehicle.id);
            this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
          },

          error: (e) => {
            console.log("deletePurchaseOrder error");
            this.message = e.error.message;
            console.error(e);
          }
        });
      }
    });
  }

  onChangeAutopartPurchaseStatus($event: any, autopart: AutoPart): void {

    autopart.purchaseStatus = $event.target.value;
    console.log(autopart.purchaseStatus);
    if (autopart.purchaseStatus == 0) {
      autopart.reason = "no status";
    } else if (autopart.purchaseStatus == 1) {
      autopart.reason = "ordered";
    } else if (autopart.purchaseStatus == 2) {
      autopart.reason = "received"
    } else if (autopart.purchaseStatus == 3) {
      autopart.reason = "returned"
    }

    console.log(autopart.reason);

    this.autopartService.update(autopart.id, autopart).subscribe({
      next: result => {
        console.log(result);
        if (result) {
          autopart = result;
          for (let i = 0; i < this.autopartsSearch.length; i++) {
            if (this.autopartsSearch[i].id == autopart.id) {
              this.autopartsSearch[i] = autopart;
            }
          }
        }
      }
    })
  }

  getVendorName(vendorId: any): any {
    for (let vendor of this.vendors) {
      if (vendor.id == vendorId) {
        return vendor.name;
      }
    }
  }

  employeeJobCarrier: Employee[] = new Array();
  totalJobCounts: any;
  findAllCurrentEmplyeeJobs(): void {
    this.jobService.findAllCurrentEmplyeeJobs(this.user.companyId).subscribe({
      next: result => {
        console.log(result)
        this.employeeJobCarrier = result;
        this.totalJobCounts = 0;
        for (let employee of this.employeeJobCarrier) {
          employee.url = location.origin + "/#/operation/" + employee.token;
          if (employee.jobs) {

            for (let j = 0; j < employee.jobs.length; j++) {
              // for (let job of employee.jobs) {
              this.totalJobCounts++;
              this.getJobScore(employee.jobs[j]);

              for (let i = 0; i < this.jobs.length; i++) {
                if (this.jobs[i].id == employee.jobs[j].id) {
                  this.jobs[i] = employee.jobs[j];
                  this.getJobScore(this.jobs[i]);
                }
              }
              // for (let job2 of this.jobs) {
              //   if (job2.id == job.id) {
              //     job2 = job;
              //     this.getJobScore(job2);
              //   }
              // }
              //
            }
          }
        }


      }
    })
  }

  filterJobs(employee: Employee): Vehicle[] {
    var vehicles: Vehicle[] = new Array();
    var jobs: any[] = new Array();

    if (employee?.jobs == null) {
      jobs = new Array();
    } else {
      jobs = employee?.jobs;
    }

    const jobMap: { [key: number]: Job[] } = {};

    // Group jobs by vehicleId
    jobs.forEach(job => {
      if (!jobMap[job.vehicleId]) {
        jobMap[job.vehicleId] = [];
      }
      jobMap[job.vehicleId].push(job);
    });

    console.log(jobs);
    // Step 2: Assign jobs to corresponding vehicles
    this.vehicles.forEach(vehicle => {
      // If there are jobs for this vehicleId, assign them
      if (jobMap[vehicle.id]) {

        vehicle.jobs2 = jobMap[vehicle.id];
        vehicle.jobs = vehicle.jobs
        vehicles.push(vehicle);
      }
    });

    console.log(vehicles);



    return vehicles;
  }
  getJobTitle(job: any): any {
    if (job.paidWeek > 0) {
      return "Job already paid on week [" + job.paidWeek + "]"
    }
  }
  onChangeAutopartVentor($event: any, autopart: AutoPart): void {

    autopart.vendorId = $event.target.value;
    console.log(autopart.purchaseStatus);
    autopart.reason = "ventor " + this.getVendorName(autopart.vendorId);
    console.log(autopart.reason);

    this.autopartService.update(autopart.id, autopart).subscribe({
      next: result => {
        console.log(result);
        if (result) {
          autopart = result;
          for (let i = 0; i < this.autopartsSearch.length; i++) {
            if (this.autopartsSearch[i].id == autopart.id) {
              this.autopartsSearch[i] = autopart;
            }
          }
        }
      }
    })
  }

  deleteAutopart(autoPart: AutoPart, index: any): void {
    //console.log(event.target);

    console.log("deleteAutopart");
    this.autopartService.deleteWithUserId(autoPart.id, this.user.id).subscribe({
      next: data => {
        console.log(" " + data);
        if (this.autopartsSearch.length > 0) {
          for (let i = 0; i < this.autopartsSearch.length; i++) {
            if (autoPart.id == this.autopartsSearch[i].id) {
              this.autopartsSearch.splice(i, 1);
            }
          }
        }
        this.getAllVehicleClaims(this.vehicle.id);
        //this.getAutopartForVehicle(this.vehicle.id, true);
      },

      error: (e) => {
        console.log("deleteAutopart error");
        this.message = e.error.message;
        console.error(e);
      }

    });
  }

  deleteAutopartPurchaseOrder(autoPart: AutoPart, index: any, purchaseOrder: PurchaseOrderVehicle): void {
    //console.log(event.target);

    console.log("deleteAutopartPurchaseOrder");

    if (autoPart.purchaseOrderId > 0) {

      const customTitle = 'Remove Part [' + autoPart.title + ']';
      const message = 'Are you sure you want to remove it ?';
      const buttonType = "yesNo" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type
      // Call the service to show the confirmation dialog and pass the callback
      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed) {
          console.log('Item deleted');
          this.autopartService.deleteWithUserId(autoPart.id, this.user.id).subscribe({
            next: data => {
              console.log(" " + data);

              this.getAllVehicleClaims(this.vehicle.id);
              this.getAutopartForVehicle(this.vehicle.id, true);
            },

            error: (e) => {
              console.log("deleteAutopartPurchaseOrder error");
              this.message = e.error.message;
              console.error(e);
            }

          });

        } else {
          console.log('Item not deleted');
        }
      });

    } else {
      const customTitle = 'Remove Part [' + autoPart.title + ']';
      const message = 'Are you sure you want to remove it ?';
      const buttonType = "yesNo" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type
      // Call the service to show the confirmation dialog and pass the callback
      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed) {
          console.log('Item deleted');
          this.autopartService.deleteWithUserId(autoPart.id, this.user.id).subscribe({
            next: data => {
              console.log(" " + data);

              this.getAllVehicleClaims(this.vehicle.id);
              this.getAutopartForVehicle(this.vehicle.id, true);
            },

            error: (e) => {
              console.log("deleteAutopartPurchaseOrder error");
              this.message = e.error.message;
              console.error(e);
            }

          });

        } else {
          console.log('Item not deleted');
        }
      });

    }
  }

  selectedAutopart: AutoPart = new AutoPart();

  addNewParts(): void {
    this.selectedAutopart = new AutoPart();
    this.selectedAutopart.id = 0;
    this.selectedAutopart.title = undefined;
    this.imageModels = new Array();
    this.imageUrl = null;
    this.selectedAutopart.stocknumber = this.randomString();

    // this.detailSelected = true;
    this.message1 = "";
    this.errorMessage = "";

  }

  //errorMessage: any = "";
  imageModels: ImageModel[] = new Array();
  // message1: any = "";
  cindexAutpartPurchaseOrder: any = -1;

  addAutopartToPurchaseOrder(claim: Claim, purchaseOrder: PurchaseOrderVehicle): void {

    // if (this.imageModels.length == 0) {
    //   this.errorMessage = "Please choose image or images for the part";
    //   return;
    // }
    this.selectedAutopart = new AutoPart();
    this.selectedAutopart.id = 0;
    this.selectedAutopart.title = undefined;
    this.imageModels = new Array();
    this.imageUrl = null;
    this.selectedAutopart.stocknumber = this.randomString();

    // this.detailSelected = true;
    this.message1 = "";
    this.errorMessage = "";

    this.selectedAutopart.claimId = claim.id;
    this.selectedAutopart.purchaseOrderId = purchaseOrder.id;

    this.selectedAutopart.year = this.vehicle.year;
    this.selectedAutopart.make = this.vehicle.make;
    this.selectedAutopart.model = this.vehicle.model;

    this.selectedAutopart.title = purchaseOrder.title;
    this.selectedAutopart.description = purchaseOrder.description;
    this.selectedAutopart.partNumber = purchaseOrder.partNumber;
    this.selectedAutopart.grade = purchaseOrder.grade;
    this.selectedAutopart.shipping = "FLP";
    this.selectedAutopart.warranty = "30D";
    this.selectedAutopart.vendorId = purchaseOrder.vendorId;

    this.selectedAutopart.salePrice = purchaseOrder.salePrice;
    this.selectedAutopart.purchaseStatus = purchaseOrder.purchaseStatus;
    this.selectedAutopart.source = purchaseOrder.source;
    this.selectedAutopart.orderedAt = purchaseOrder.orderedAt;

    // if (this.selectedAutopart.year == null || this.selectedAutopart.year < 1000 ||

    //   this.selectedAutopart.make == null || this.selectedAutopart.make == "" ||
    //   this.selectedAutopart.model == null || this.selectedAutopart.model == ''

    // ) {
    //   this.errorMessage = "Part Infor for year, make and model are required";
    //   return;
    // }

    // if (this.selectedAutopart.title == null || this.selectedAutopart.title == '') {
    //   this.errorMessage = "Parts Name is required";
    //   return;
    // }

    // if (this.selectedAutopart.description == null || this.selectedAutopart.description == '') {
    //   this.errorMessage = "Part Description is required";
    //   return;
    // }


    // if (this.selectedAutopart.shipping == null || this.selectedAutopart.shipping == '') {
    //   //this.errorMessage = "Part Shipping is required";
    //   //return;
    //   this.selectedAutopart.shipping = "FLP"
    // }

    // if (this.selectedAutopart.warranty == null || this.selectedAutopart.warranty == '') {
    //   // this.errorMessage = "Part Warranty is required";
    //   // return;
    //   this.selectedAutopart.warranty = "30D";
    // }

    // if (this.selectedAutopart.grade == null || this.selectedAutopart.grade == '') {
    //   this.errorMessage = "Part Grade is required";
    //   return;
    // }

    // if (this.selectedAutopart.salePrice != null && this.selectedAutopart.salePrice == 0) {
    //   this.errorMessage = "Part Price is required";
    //   return;
    // }



    // if (this.selectedAutopart.title != null && this.selectedAutopart.title != '' && this.selectedAutopart.title.length > 255) {
    //   this.errorMessage = "Parts Name is too long";
    //   return;
    // }

    // if (this.selectedAutopart.description != null && this.selectedAutopart.description != '' && this.selectedAutopart.description.length > 2000) {
    //   this.errorMessage = "Part Description is too long";
    //   return;
    // }


    // if (this.selectedAutopart.description != null && this.selectedAutopart.description != '' && this.selectedAutopart.description.length < 2) {
    //   this.errorMessage = "Part Description is too short";
    //   return;
    // }


    // if (this.selectedAutopart.partNumber != null && this.selectedAutopart.partNumber != '' && this.selectedAutopart.partNumber.length > 50) {
    //   this.errorMessage = "Parts Number is too long";
    //   return;
    // }


    //if (this.imageModels.length > 0) {
    this.selectedAutopart.companyId = this.vehicle.companyId;
    this.selectedAutopart.status = 0;
    this.selectedAutopart.published = false;
    this.selectedAutopart.reason = "new";
    this.selectedAutopart.vehicleId = this.vehicle.id;
    this.selectedAutopart.sequenceNumber = -1;

    this.autopartService.create(this.selectedAutopart).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedAutopart = res;

        // if (this.imageModels.length > 0) {
        //   for (let i = 0; i < this.imageModels.length; i++) {

        //     this.uploadAutopartImageWithFile(this.selectedAutopart.id, this.imageModels[i]);
        //   }
        // }
        this.getAllVehicleClaims(this.vehicle.id);
        this.errorMessage = "Created Successfully";



        setTimeout(() => {
          this.selectedAutopart = res;
          this.editAutopart(this.selectedAutopart, 0);

        }, 2000);

        this.getAutopartForVehicle(this.vehicle.id, false);


      },
      error: (e) => console.error(e)
    });
    // } else {
    //   this.message1 = "Please choose a file";
    // }
  }
  totalVehicles: any;
  public lineVehicleChartDataStatus: ChartConfiguration<'bar'>['data'] = {

    labels: [],
    datasets: []
  };

  public lineChartOptionsVehicleStatus: ChartOptions<'bar'> = {
    responsive: false,
    maintainAspectRatio: true,
    scales: {
      y: {
        title: {

          display: true,
          text: 'Number of Updates'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Vehicle'
        }
      }
    },

    onClick: (
      event: ChartEvent,
      elements: ActiveElement[],
      chart: Chart<'bar'>
    ) => {
      if (elements[0]) {
        // this.vehiclesStatus = new Array();
        var statusStr = this.lineVehicleChartDataStatus.labels![elements[0].index];
        console.log(statusStr);
        for (let vehicle of this.vehicles) {
          var vehicleInfoString = vehicle.year + " " + vehicle.make + " " + vehicle.model
          if (vehicleInfoString == statusStr) {
            console.log(statusStr);
            //this.vehicle = vehicle;
            this.getVehicleById(vehicle.id);
            //this.vehiclesStatus.push(vehicle);
            //this.getAllVehiclesStatus(this.currentUserUser.companyId, status.id);
            //this.getDetail(vehicle,0);
          }
        }
      }
    },


  };


  public lineVehicleChartDataStatusUser: ChartConfiguration<'bar'>['data'] = {

    labels: [],
    datasets: []
  };

  public lineChartOptionsVehicleStatusUser: ChartOptions<'bar'> = {
    responsive: false,
    maintainAspectRatio: true,
    scales: {
      y: {
        title: {

          display: true,
          text: 'Number of Updates'
        }
      },
      x: {
        title: {
          display: true,
          text: 'User'
        }
      }
    },

    onClick: (
      event: ChartEvent,
      elements: ActiveElement[],
      chart: Chart<'bar'>
    ) => {
      if (elements[0]) {
        // this.vehiclesStatus = new Array();
        var statusStr = this.lineVehicleChartDataStatusUser.labels![elements[0].index];
        console.log(statusStr);
        for (let user of this.users) {
          var userInfoString = user.firstName + " " + user.lastName;
          if (userInfoString == statusStr) {
            console.log(statusStr);
            //this.vehicle = vehicle;
            //this.getVehicleById(vehicle.id);
            //this.vehiclesStatus.push(vehicle);
            //this.getAllVehiclesStatus(this.currentUserUser.companyId, status.id);
            //this.getDetail(vehicle,0);
          }
        }
      }
    },


  };



  selectedVehicle: Vehicle = new Vehicle();
  getVehicleById(vehicleId: any): void {
    //this.vehiclesStatus = new Array();
    for (let vehicle of this.vehicles) {
      if (vehicle.id == vehicleId) {
        console.log(vehicle);
        this.vehicle = vehicle;
        this.vehiclesStatus.unshift(vehicle);
        console.log(this.vehiclesStatus.length);
        this.selectedVehicle = vehicle;
        this.vehicleService.getVehicle(vehicle.id).subscribe({
          next: result => {
            this.vehicle = result;
            this.vehiclesStatus.unshift(result);

            this.calendarKicker();

          }
        })
      }
    }
  }
  vehiclesStatus: Vehicle[] = new Array();
  public lineChartLegend = true;
  groupBySorters: GroupBySorter[] = new Array();
  groupBySorter: GroupBySorter = new GroupBySorter();
  showEstimatesOnly: boolean = false;

  hasPOorJO(): boolean {
    for (let claim of this.claims) {
      if (claim.purchaseOrders.length > 0 || claim.jobs.length > 0) {
        return true;
      }
    }
    return false;
  }
  getChangeOverview(companyId: any): void {

    this.vehicleHistoryService.getChangeOverview(companyId).subscribe({
      next: result => {
        console.log(result);
        this.changeOverview = result;

        var labels: any[] = new Array();
        var datas: number[] = new Array();

        this.groupBySorters = new Array();
        for (let vehicle of this.vehicles) {
          this.groupBySorter = new GroupBySorter();
          this.groupBySorter.name = vehicle.year + " " + vehicle.make + " " + vehicle.model;
          this.groupBySorter.id = vehicle.id;

          var hasIt = false;

          for (let groupBy of this.changeOverview) {

            if (groupBy.status == vehicle.id) {
              hasIt = true;
              if (groupBy.count < 500)
                this.groupBySorter.count = groupBy.count;
              //datas.push(groupBy.count);
            }
          }

          if (hasIt == false) {
            this.groupBySorter.count = 0;

          }
          this.groupBySorters.push(this.groupBySorter);
        }
        this.groupBySorters = this.groupBySorters.sort((a, b) => a.count - b.count);

        for (let groupBySort of this.groupBySorters) {
          labels.push(groupBySort.name);
          datas.push(groupBySort.count);
        }


        for (let counts of datas) {
          //this.totalVehicles += counts;
        }

        this.lineVehicleChartDataStatus = {
          labels: labels,
          datasets: [{ data: datas, label: 'Vehicle Update History Overview', backgroundColor: this.colors[0], }]
        };
      }, error: (e) => console.log(e)
    })
  }

  getChangeOverviewUser(companyId: any): void {

    this.vehicleHistoryService.getUserChangeOverview(companyId).subscribe({
      next: result => {
        console.log(result);
        this.changeOverview = result;

        var labels: any[] = new Array();
        var datas: number[] = new Array();

        this.groupBySorters = new Array();
        for (let user of this.users) {
          this.groupBySorter = new GroupBySorter();
          this.groupBySorter.name = user.firstName + " " + user.lastName;
          this.groupBySorter.id = user.id;

          var hasIt = false;

          for (let groupBy of this.changeOverview) {

            if (groupBy.status == user.id) {
              hasIt = true;
              //if (groupBy.count < 500)
              this.groupBySorter.count = groupBy.count;
              //datas.push(groupBy.count);
            }
          }

          if (hasIt == false) {
            this.groupBySorter.count = 0;

          }
          this.groupBySorters.push(this.groupBySorter);
        }
        this.groupBySorters = this.groupBySorters.sort((a, b) => a.count - b.count);

        for (let groupBySort of this.groupBySorters) {
          labels.push(groupBySort.name);
          datas.push(groupBySort.count);
        }


        for (let counts of datas) {
          //this.totalVehicles += counts;
        }

        this.lineVehicleChartDataStatusUser = {
          labels: labels,
          datasets: [{ data: datas, label: 'User Update History Overview', backgroundColor: this.colors[0], }]
        };
      }, error: (e) => console.log(e)
    })
  }

  createNewAutopart(): void {

    // if (this.imageModels.length == 0) {
    //   this.errorMessage = "Please choose image or images for the part";
    //   return;
    // }

    this.selectedAutopart.year = this.vehicle.year;
    this.selectedAutopart.make = this.vehicle.make;
    this.selectedAutopart.model = this.vehicle.model;


    if (this.selectedAutopart.year == null || this.selectedAutopart.year < 1000 ||

      this.selectedAutopart.make == null || this.selectedAutopart.make == "" ||
      this.selectedAutopart.model == null || this.selectedAutopart.model == ''

    ) {
      this.errorMessage = "Part Infor for year, make and model are required";
      return;
    }

    if (this.selectedAutopart.title == null || this.selectedAutopart.title == '') {
      this.errorMessage = "Parts Name is required";
      return;
    }

    if (this.selectedAutopart.description == null || this.selectedAutopart.description == '') {
      this.errorMessage = "Part Description is required";
      return;
    }


    if (this.selectedAutopart.shipping == null || this.selectedAutopart.shipping == '') {
      //this.errorMessage = "Part Shipping is required";
      //return;
      this.selectedAutopart.shipping = "FLP"
    }

    if (this.selectedAutopart.warranty == null || this.selectedAutopart.warranty == '') {
      // this.errorMessage = "Part Warranty is required";
      // return;
      this.selectedAutopart.warranty = "30D";
    }

    if (this.selectedAutopart.grade == null || this.selectedAutopart.grade == '') {
      this.errorMessage = "Part Grade is required";
      return;
    }

    if (this.selectedAutopart.salePrice != null && this.selectedAutopart.salePrice == 0) {
      this.errorMessage = "Part Price is required";
      return;
    }



    if (this.selectedAutopart.title != null && this.selectedAutopart.title != '' && this.selectedAutopart.title.length > 255) {
      this.errorMessage = "Parts Name is too long";
      return;
    }

    if (this.selectedAutopart.description != null && this.selectedAutopart.description != '' && this.selectedAutopart.description.length > 2000) {
      this.errorMessage = "Part Description is too long";
      return;
    }


    if (this.selectedAutopart.description != null && this.selectedAutopart.description != '' && this.selectedAutopart.description.length < 2) {
      this.errorMessage = "Part Description is too short";
      return;
    }


    if (this.selectedAutopart.partNumber != null && this.selectedAutopart.partNumber != '' && this.selectedAutopart.partNumber.length > 50) {
      this.errorMessage = "Parts Number is too long";
      return;
    }


    //if (this.imageModels.length > 0) {
    this.selectedAutopart.companyId = this.vehicle.companyId;
    this.selectedAutopart.status = 0;
    this.selectedAutopart.published = false;
    this.selectedAutopart.reason = "new";
    this.selectedAutopart.vehicleId = this.vehicle.id;
    this.selectedAutopart.sequenceNumber = -1;

    this.autopartService.create(this.selectedAutopart).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedAutopart = res;

        if (this.imageModels.length > 0) {
          for (let i = 0; i < this.imageModels.length; i++) {

            this.uploadAutopartImageWithFile(this.selectedAutopart.id, this.imageModels[i]);
          }
        }

        setTimeout(() => {
          // this.imageModels = new Array();
          // this.imageUrl = null;
          this.getAutopartDetailFromServer(this.selectedAutopart.id);

        }, 2000);
        // setTimeout(() => {

        //   //window.open(`#/detail/` + this.selectedAutopart.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
        //   this.message = "Posted Successfully";
        //   this.selectedAutopart = new AutoPart();
        //   this.imageModels = new Array();
        //   this.imageUrl = null;

        //   this.getAllFromUserSatistics(this.user.companyId);
        //   this.applyFilter2("2", this.forArchived, 0, this.pageSize);
        //   this.cindex = 0;
        // }, 2000);
        this.errorMessage = "Created Successfully";
        this.getAutopartForVehicle(this.vehicle.id, false);
      },
      error: (e) => console.error(e)
    });
    // } else {
    //   this.message1 = "Please choose a file";
    // }
  }

  openSourceLink(url: any): void {

    window.open(url, '_blank', 'location=yes,height=1000,width=800,scrollbars=yes,status=yes');
  }

  errorMessagePurchaseOrder: any = "";

  savePurchaseOrder(): void {


    if (this.selectedPurchaseOrder.title == null || this.selectedPurchaseOrder.title == '') {
      this.errorMessagePurchaseOrder = "Parts Name is required";
      return;
    }

    if (this.selectedPurchaseOrder.description == null || this.selectedPurchaseOrder.description == '') {
      this.errorMessagePurchaseOrder = "Part Description is required";
      return;
    }


    if (this.selectedPurchaseOrder.grade == null || this.selectedPurchaseOrder.grade == '') {
      this.errorMessagePurchaseOrder = "Part Grade is required";
      return;
    }

    if (this.selectedPurchaseOrder.salePrice != null && this.selectedPurchaseOrder.salePrice == 0) {
      this.errorMessagePurchaseOrder = "Part Price is required";
      return;
    }


    if (this.selectedPurchaseOrder.title != null && this.selectedPurchaseOrder.title != '' && this.selectedPurchaseOrder.title.length > 255) {
      this.errorMessagePurchaseOrder = "Parts Name is too long";
      return;
    }

    if (this.selectedPurchaseOrder.description != null && this.selectedPurchaseOrder.description != '' && this.selectedPurchaseOrder.description.length > 500) {
      this.errorMessagePurchaseOrder = "Part Description is too long";
      return;
    }


    if (this.selectedPurchaseOrder.description != null && this.selectedPurchaseOrder.description != '' && this.selectedPurchaseOrder.description.length < 2) {
      this.errorMessagePurchaseOrder = "Part Description is too short";
      return;
    }


    if (this.selectedPurchaseOrder.partNumber != null && this.selectedPurchaseOrder.partNumber != '' && this.selectedPurchaseOrder.partNumber.length > 50) {
      this.errorMessagePurchaseOrder = "Parts Number is too long";
      return;
    }



    this.selectedPurchaseOrder.companyId = this.vehicle.companyId;

    this.selectedPurchaseOrder.published = false;

    if (this.selectedPurchaseOrder.id == 0) {
      this.selectedPurchaseOrder.status = 0;
      this.selectedPurchaseOrder.reason = "new";
      this.selectedPurchaseOrder.sequenceNumber = -1;
    } else {
      this.selectedPurchaseOrder.reason = "update";
    }

    this.selectedPurchaseOrder.vehicleId = this.vehicle.id;


    this.purchseOrderVehicleService.createPurchaseOrderVehicle(this.user.id, this.selectedPurchaseOrder).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedPurchaseOrder = res;
        if (this.selectedPurchaseOrder.reason == "new")
          this.errorMessagePurchaseOrder = "Created Successfully";
        else
          this.errorMessagePurchaseOrder = "Updated Successfully";
        this.syncClaims(this.selectedPurchaseOrder);
        this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
      },
      error: (e) => console.error(e)
    });
    // } else {
    //   this.message1 = "Please choose a file";
    // }
  }

  syncClaims(PurchaseOrder: PurchaseOrderVehicle): void {
    for (let claim of this.claims) {
      if (claim.id == this.purchaseOrder.claimId) {
        this.claim = claim;
      }
    }
  }

  setPurhaseOrderStatus(status: any): void {


    if (this.selectedPurchaseOrder.title == null || this.selectedPurchaseOrder.title == '') {
      this.errorMessagePurchaseOrder = "Parts Name is required";
      return;
    }

    if (this.selectedPurchaseOrder.description == null || this.selectedPurchaseOrder.description == '') {
      this.errorMessagePurchaseOrder = "Part Description is required";
      return;
    }


    if (this.selectedPurchaseOrder.grade == null || this.selectedPurchaseOrder.grade == '') {
      this.errorMessagePurchaseOrder = "Part Grade is required";
      return;
    }

    if (this.selectedPurchaseOrder.salePrice != null && this.selectedPurchaseOrder.salePrice == 0) {
      this.errorMessagePurchaseOrder = "Part Price is required";
      return;
    }


    if (this.selectedPurchaseOrder.title != null && this.selectedPurchaseOrder.title != '' && this.selectedPurchaseOrder.title.length > 255) {
      this.errorMessagePurchaseOrder = "Parts Name is too long";
      return;
    }

    if (this.selectedPurchaseOrder.description != null && this.selectedPurchaseOrder.description != '' && this.selectedPurchaseOrder.description.length > 500) {
      this.errorMessagePurchaseOrder = "Part Description is too long";
      return;
    }


    if (this.selectedPurchaseOrder.description != null && this.selectedPurchaseOrder.description != '' && this.selectedPurchaseOrder.description.length < 2) {
      this.errorMessagePurchaseOrder = "Part Description is too short";
      return;
    }


    if (this.selectedPurchaseOrder.partNumber != null && this.selectedPurchaseOrder.partNumber != '' && this.selectedPurchaseOrder.partNumber.length > 50) {
      this.errorMessagePurchaseOrder = "Parts Number is too long";
      return;
    }




    if (status == 0) {
      this.selectedPurchaseOrder.status = status;
      this.selectedPurchaseOrder.reason = "un-submit for approval";
      this.selectedPurchaseOrder.submittedAt = null
      this.selectedPurchaseOrder.submittedBy = 0;
      this.errorMessagePurchaseOrder = "Un-Submitted Successfully";
    }

    if (status == 1) {
      this.selectedPurchaseOrder.status = status;
      this.selectedPurchaseOrder.reason = "submit for approval";
      this.selectedPurchaseOrder.submittedAt = new Date();
      this.selectedPurchaseOrder.submittedBy = this.user.id;
      this.errorMessagePurchaseOrder = "Submitted Successfully";
    }

    if (status == 2) {

      if (this.selectedPurchaseOrder.shipping == null || this.selectedPurchaseOrder.shipping == '') {
        this.errorMessagePurchaseOrder = "Please provide reject reason";
        return;
      } else {

        if (this.selectedPurchaseOrder.shipping != null && this.selectedPurchaseOrder.shipping != '' && this.selectedPurchaseOrder.shipping.length > 500) {
          this.errorMessagePurchaseOrder = "Reject Reason is too long";
          return;
        }


        if (this.selectedPurchaseOrder.shipping != null && this.selectedPurchaseOrder.shipping != '' && this.selectedPurchaseOrder.shipping.length < 2) {
          this.errorMessagePurchaseOrder = "Reject reason is too short";
          return;
        }

        this.selectedPurchaseOrder.status = status;
        this.selectedPurchaseOrder.reason = "rejected";
        this.selectedPurchaseOrder.rejectedAt = new Date();
        this.selectedPurchaseOrder.rejectedBy = this.user.id;
        this.errorMessagePurchaseOrder = "Rejected Successfully";
      }
    }

    if (status == 3) {
      this.selectedPurchaseOrder.status = status;
      this.selectedPurchaseOrder.reason = "approved";
      this.selectedPurchaseOrder.approvedAt = new Date();
      this.selectedPurchaseOrder.approvedBy = this.user.id;
      this.errorMessagePurchaseOrder = "Approved Successfully";
    }


    this.purchseOrderVehicleService.createPurchaseOrderVehicle(this.user.id, this.selectedPurchaseOrder).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedPurchaseOrder = res;
        // if (this.selectedPurchaseOrder.reason == "new")
        //   this.errorMessagePurchaseOrder = "Created Successfully";
        // else
        //   this.errorMessagePurchaseOrder = "Updated Successfully";
        this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
      },
      error: (e) => console.error(e)
    });

  }


  deleteCurerntImage(): void {

    for (let i = 0; i < this.imageModels.length; i++) {
      if (this.imageModels[i].showInSearch == true) {
        this.imageModels.splice(i, 1);
      }
    }

    if (this.imageModels != null && this.imageModels.length > 0) {
      this.imageModels[0].showInSearch = true
      this.imageUrl = this.imageModels[0].picByte;
    }

    if (this.imageModels != null && this.imageModels.length == 0) {
      this.imageModels = new Array();
      this.imageUrl = null;
    }
  }

  onSelectFileNew(event: any): void {
    if (event.target.files && event.target.files[0]) {

      const file = event.target.files[0];


      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        alert('Only JPEG and JPG images are allowed');
        return;
      }

      var filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;

          if (this.imageModels.length == 0) {
            imageModel.showInSearch = true;
            this.selectedImage = imageModel;

            //this.preview = e.target.result;
            this.imageUrl = e.target.result;
          } else {
            imageModel.showInSearch = false;
          }

          this.imageModels.push(imageModel);

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

  setShowInSearch(index: any): void {

    for (let i = 0; i < this.imageModels.length; i++) {

      this.imageModels[i].showInSearch = false;
      if (i == index) {
        this.imageModels[i].showInSearch = true;
        this.selectedImage = this.imageModels[i];
        this.imageUrl = this.imageModels[i].picByte;
      }
      else
        this.imageModels[i].showInSearch = false;
    }

  }

  private uploadAutopartImageWithFile(autopartId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', autopartId) //other param


    this.autopartService.uploadImageWithFileWithUserId(formData, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart.imageModels.push(result);
        if (this.selectedAutopart.imageModels.length == 1) {
          this.selectedAutopart.showInSearchImageId = result.id;
        }

        //sync this.claims
        for (let i = 0; i < this.claims.length; i++) {
          for (let j = 0; j < this.claims[i].purchaseOrders.length; j++) {
            for (let k = 0; k < this.claims[i].purchaseOrders[j].autoparts.length; k++) {
              if (this.claims[i].purchaseOrders[j].autoparts[k].id == this.selectedAutopart.id) {
                this.claims[i].purchaseOrders[j].autoparts[k].showInSearchImageId = this.selectedAutopart.showInSearchImageId;
              }
            }
          }
        }

        //sync this.claim
        for (let j = 0; j < this.claim.purchaseOrders.length; j++) {
          for (let k = 0; k < this.claim.purchaseOrders[j].autoparts.length; k++) {
            if (this.claim.purchaseOrders[j].autoparts[k].id == this.selectedAutopart.id) {
              this.claim.purchaseOrders[j].autoparts[k].showInSearchImageId = this.selectedAutopart.showInSearchImageId;
            }
          }
        }
      }
    });


  }

  getAutopartDetailFromServer(autopartId: any): void {

    console.log(" autopart detail ");
    this.autopartService.get(autopartId).subscribe({

      next: res => {
        console.log(res);
        this.editAutopart(res, 0);
        // this.applyFilter2('2', false, 0, this.pageSize);

        // if (this.user.partMarketOnly == true)
        //   this.getAllFromUserSatistics2(this.user.id);
        // else
        //   this.getAllFromUserSatistics(this.user.companyId);
        // this.searchPartWithPage(0, this.pageSize, 0, false);
        this.detailSelected = true;
        // this.showSavedItems = true;
      },
      error: err => {
        console.log(err);
      }
    });

  }

  getPdfFiles(vehicleId: any): void {
    console.log("getPdfFiles")
    this.vehicleService.getPdfFiles(vehicleId).subscribe({
      next: result => {

        console.log(result)
        this.vehicle.pdfFiles = result;

      }
    })
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


  getTotalJobPrice(jobs: Job[]): any {

    var total = 0;
    for (let job of jobs) {
      total += job.price;
    }

    return total;

  }

  getTotalPurchaseOrders(): any {

    var total = 0;
    for (let purchaseOrder of this.purchaseOrders) {
      total += purchaseOrder.salePrice;
    }

    return total;

  }

  onChangeCalendarStartDate($event: any, job: Job): void {


    //job.targetDate = $event.target.value;
    const date: Date = new Date($event.target.value);

    job.startDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
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

  onChangeCalendarEndDate($event: any, job: Job): void {


    //job.targetDate = $event.target.value;
    const date: Date = new Date($event.target.value);

    job.endDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
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

  onChangeVehiclePaymentMethod2($event: any, payment: Payment): void {

    payment.paymentMethodId = $event.target.value;
    payment.reason = "payment method"
    console.log($event.target.value);
    console.log("onChangeVehiclePaymentMethod2");
    this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
      next: result => {
        console.log(result);
        this.payment = result;
        payment.reason = "";
      }
    })
  }

  onChangeVehiclePaymentStatus($event: any, payment: Payment): void {

    payment.paymentStatusId = $event.target.value;
    payment.reason = "payment status"
    console.log($event.target.value);
    console.log("onChangeVehiclePaymentStatus");
    this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
      next: result => {
        console.log(result);
        this.payment = result;
        payment.reason = "";
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
    this.displayStyle2 = "hidden";
    this.displayStyle3 = "0";
    // if (vehicle.id > 0) {

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

  verifyJob(job: Job): void {

    job.reason = "verify";
    job.userIdVerified = this.user.id;
    job.verifiedAt = new Date();

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

  setImageForSearchJobs(autopartId: any, imageId: any) {


    console.log("setImageForSearchJobs");

    this.jobService.setImageForSearch(imageId, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.job.imageModels.length; i++) {
          if (this.job.imageModels[i].id == imageId) {
            this.job.showInSearchImageId = this.job.imageModels[i].id;
            //this.selectedImage = this.selectedAutopart.showInSearchImageId;
          }
        }
      }
    });
  }

  currentIndexJob: any;

  getDetailsJob(job: Job, index: any): void {
    this.currentIndexJob = index;
    this.job = job;
    this.getJobScore(this.job);
    console.log(this.job);
  }

  deleteImageJob(jobId: any, imageId: any) {


    console.log("deleteImage");

    this.jobService.deleteImageWihtUserId(imageId, jobId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);

        this.jobService.getJob(jobId).subscribe({
          next: result => {
            for (let i = 0; i < this.jobs.length; i++) {
              if (this.jobs[i].id == jobId) {
                this.jobs[i] = result;
                this.job = this.jobs[i];
              }

            }
            this.getJobScore(this.job);
            this.getDetailsJob(this.job, this.currentIndexJob);
          }
        })
      }
    });
  }

  jobProcessor: JobProcessor = new JobProcessor();

  checkHasProof(job: Job): boolean {
    for (let imageModel of job.imageModels) {
      if (imageModel.employeeId == job.employeeId || imageModel.userId == this.user.id) {
        return true;
      }
    }
    return false;
  }


  getJobScore(job: Job): void {

    var score = 0;
    console.log(job);
    console.log(job.startDate);
    if (this.job.startDate != null) {

      score = 20;
      console.log(" 1 " + score);
    }

    if (this.checkHasProof(job) == true) {

      score += 20;
      console.log(" 2 " + score);
    }

    if (job.status == 1) {

      score += 20;
      console.log(" 3 " + score);
    }

    if (job.notifiedAt != null) {
      console.log(" 4 " + score);
      score += 20;
    }

    if (job.verifiedAt != null) {
      score += 20;
      console.log(" 5 " + score);
    }

    console.log(score);

    job.steps = score;
    job.stepDescription = this.jobProcessor.getStepDescription(job.steps);
    job.stepDescriptionCumulative = this.jobProcessor.getCumulativeStepDescription(job.steps);
    job.nextStepDescription = this.jobProcessor.getNextStepDescription(job.steps);

  }

  clearAllNotiifcaitons(): void {
    for (let note of this.notes) {

      this.noteService.deleteNoteWithUserId(this.user.id, note.id).subscribe({
        next: result => {

          // for (let i = 0; i < this.notes.length; i++) {
          //   if (note.id == this.notes[i]) {
          //     this.notes = this.notes.splice(i, 1);
          //   }
          // }
        }
      });


    }
    this.notes = new Array();
  }


  notifyManager(message: any, color: any, job: Job): void {

    job.reason = message;

    var note = {
      id: 0,
      userId: 0,
      employeeId: 0,
      jobId: job.id,
      vehicleId: job.vehicleId,
      reason: "notify",
      sequenceNumber: -1,
      year: this.vehicle.year,
      make: this.vehicle.make,
      model: this.vehicle.model,
      type: message,
      color: color,
      notes: this.vehicle.year + " " + this.vehicle.make + " " + this.vehicle.model +
        "'s job (" + job.name?.toUpperCase() + ")-" + job.id + " is " + message,
      companyId: this.vehicle.companyId
    };

    if (message == 'Noitfy') {
      job.notified = true;
      job.notifiedAt = new Date();
      job.reason = 'Notify';
    }

    if (message == 'Verified') {
      job.userIdVerified = this.user.id;
      job.verifiedAt = new Date();
      job.reason = 'Verified';
    }


    this.jobService.createJob(this.user.id, job).subscribe({
      next: result => {
        if (result) {
          job = result;
          this.job = job;
          this.getJobScore(this.job);
          if (job.status == 1) {
            this.noteService.createNoteUserId(job.id, this.user.id, note).subscribe({
              next: result => {
                if (result) {
                  console.log(result);

                }
              }
            })

          }

        }
      }
    })


  }

  shallShowNVerified(job: Job): boolean {
    if (job.startDate != null && job.imageModels.length > 0 && job.status == 1 && job.notifiedAt != null && job.verifiedAt == null)
      return true;
    else
      return false;
  }


  shallShowNofityManger(job: Job): boolean {
    if (job.comments != null && job.startDate != null && job.imageModels.length > 0 &&
      job.status == 1 && job.notifiedAt == null && job.verifiedAt == null)
      return true;
    else
      return false;
  }

  shallShowDone(job: Job): boolean {
    if (job.startDate != null && job.imageModels.length > 0 && job.status == 0)
      return true;
    else
      return false;
  }


  onEnter(reason: any, job: any): void {


    job.reason = reason;

    if (reason == 'job comments') {
      job.comments = "Please specify";
      job.reason = 'job comments'
      this.getJobScore(job);
    }

    if (job.startDate == null) {
      job.startDate = new Date();
    }


    if (reason == 'notify') {
      job.notified = true;
      job.notifiedAt = new Date();

      this.getJobScore(job)

    } else if (reason == 'done') {

      job.status = 1;
      job.endDate = new Date();
      job.reason = 'done',

        this.getJobScore(job)

    } else if (reason == 'downgrade') {
      this.getJobScore(job)
      job.reason = 'downgrade'

    } else {
      this.getJobScore(job)

    }

    this.jobService.createJob(this.user.id, job).subscribe({
      next: result => {

        this.job = result;
        var i = 0;
        for (let job1 of this.jobs) {
          if (job1.id == this.job.id) {
            this.jobs[i] = this.job;

          }
          i++;
        }
        this.getJobScore(this.job);
        this.jobCompletedCount = this.getJobStatus();

      }
    })

  }


  // onEnter(reason: any, job: Job): void {

  //   if (reason == 'job comments') {
  //     job.comments = "Please specify";
  //   }
  //   job.reason = reason;
  //   this.jobService.createJob(this.currentUser.id, job).subscribe({
  //     next: result => {
  //       this.job = result;
  //       this.syncJob(this.job);
  //       // this.getVehicleJobs(this.vehicle.id);
  //     }, error: (e) => console.log(e)
  //   })
  // }



  onEnterPayment(reason: any, payment: Payment): void {

    payment.reason = reason;
    payment.userId = this.user.id;

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
        if (result) {
          this.receipt = result;
          if (this.receipt.claimId > 0) {
            this.getAllVehicleClaims(this.vehicle.id);
          }
          // this.getVehiclePayments(this.vehicle.id);
        }
      }
    })
  }

  onEnterClaimClaim(reason: any, claim: Claim): void {

    claim.reason = reason;
    claim.userId = this.user.id;

    this.claimService.createClaim(this.currentUser.id, claim).subscribe({
      next: result => {
        if (result)
          this.claim = result;

        for (let i = 0; i < this.claims.length; i++) {
          if (this.claim.id == this.claims[i].id) {
            this.claims[i] = this.claim;
            for (let itemType of this.itemTypes) {
              if (this.claims[i].itemType == itemType.id) {
                this.claims[i].createJobOrder = itemType.createJobOrder;
                this.claims[i].createPurchaseOrder = itemType.createPurchaseOrder;
                this.claim.createJobOrder = itemType.createJobOrder;
                this.claim.createPurchaseOrder = itemType.createPurchaseOrder;
              }
            }
          }
        }

        if (reason == 'item type') {
          for (let itemType of this.itemTypes) {
            if (this.claim.itemType == itemType.id) {
              if (itemType.createJobOrder == true && claim.jobs.length == 0) {

                console.log("addVehicleJob");


              }

              if (itemType.createPurchaseOrder == true && claim.purchaseOrders.length == 0) {


              }
            }
          }
        }
        // this.getVehiclePayments(this.vehicle.id);
        this.getAllVehicleReceipt(this.vehicle.id);
      }
    })
  }

  onSelectFileEditorJobs(event: any, job: Job): void {


    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      const file = event.target.files[0];


      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        alert('Only JPEG and JPG images are allowed');
        return;
      }

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;

          this.uploadImageWithFileJobs(job.id, imageModel);

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

  private uploadImageWithFileJobs(jobId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFileAutoparts");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', jobId) //other param
    formData.append('description', "test") //other param


    this.jobService.uploadImageWithFileWithUserId(formData, jobId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.jobService.getJob(jobId).subscribe({
          next: result => {
            this.job = result;
            for (let i = 0; i < this.jobs.length; i++) {
              if (this.jobs[i].id == jobId) {
                this.jobs[i] = result;
              }
            }
            this.getJobScore(this.job);
            this.getDetailsJob(this.job, this.currentIndex);
          }
        });
        //this.job.imageModels.unshift(result);
      }
    });


  }

  addJobToClaim(claim: Claim): void {


    const customTitle = 'Reminder';
    const message = 'Pelase specity description first ';
    const buttonType = "okOnly" // buttonType: 'yesNo' | 'okCancel' | 'okOnly' | 'yesNoCancel' = 'yesNo';  // Button type
    // Call the service to show the confirmation dialog and pass the callback
    if (claim.notes == null || claim.notes == '') {
      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed) {

          return;
        } else {
          return;
        }
      });
    }

    var job = {
      id: 0,
      name: claim.notes,
      employeeId: 0,
      serviceId: 0,
      claimId: claim.id,
      notes: "Please specify",
      status: 0,
      vehicleId: this.vehicle.id,
      imageModels: new Array(),
      jobRequestType: 0,
      paymentMethod: 0,
      reason: "new"
    };

    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.job = result;
          if (this.jobs) {
            this.jobs.unshift(this.job);
          }

          for (let i = 0; i < this.claims.length; i++) {
            if (claim.id == this.claims[i].id) {
              this.claims[i].jobs.push(this.job);
              this.claim.jobs.push(this.job);
            }
          }

          this.getAllVehicleClaims(this.vehicle.id);
          this.getVehicleJobs2(this.vehicle.id);

        }
      }
    });
  }

  addPurchaseOrderToClaim(claim: Claim): void {

    const customTitle = 'Reminder';
    const message = 'Pelase specity description first !';
    const buttonType = "okOnly" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type
    // Call the service to show the confirmation dialog and pass the callback
    if (claim.notes == null || claim.notes == "") {
      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed) {

          return;
        } else {
          return;
        }
      });

    }

    var purchaseOrder = new PurchaseOrderVehicle();
    purchaseOrder.claimId = claim.id;
    purchaseOrder.id = 0;
    purchaseOrder.grade = undefined;
    purchaseOrder.title = claim.notes;
    purchaseOrder.partNumber = undefined;
    purchaseOrder.description = undefined;
    purchaseOrder.salePrice = undefined;
    purchaseOrder.stocknumber = this.randomString();
    this.errorMessagePurchaseOrder = "";
    purchaseOrder.reason = "new";
    purchaseOrder.sequenceNumber = -1;
    purchaseOrder.vehicleId = this.vehicle.id;
    purchaseOrder.companyId = this.vehicle.companyId;

    this.purchseOrderVehicleService.createPurchaseOrderVehicle(this.user.id, purchaseOrder).subscribe({
      next: (res) => {
        console.log(res);
        purchaseOrder = res;


        this.getAllVehicleClaims(this.vehicle.id);
        this.selectedPurchaseOrder = res;
        this.editPurchaseOrder(this.selectedPurchaseOrder, 0);

        setTimeout(() => {
          this.editPurchaseOrder(this.selectedPurchaseOrder, 0);
        }, 200);

        this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);


      },
      error: (e) => console.error(e)
    });
  }

  onEnterClaim(reason: any, claim: Claim): void {

    claim.reason = reason;
    claim.userId = this.user.id;

    this.claimService.createClaim(this.currentUser.id, claim).subscribe({
      next: result => {
        if (result)
          this.claim = result;
        if (reason == 'claim type') {
          for (let itemType of this.itemTypes) {
            if (this.claim.itemType == itemType.id) {
              if (itemType.createJobOrder == true && claim.jobs.length == 0) {

              }

              if (itemType.createPurchaseOrder == true && claim.purchaseOrders.length == 0) {
                var purchaseOrder = new PurchaseOrderVehicle();
                purchaseOrder.claimId = this.claim.id;
                purchaseOrder.id = 0;
                purchaseOrder.grade = undefined;
                purchaseOrder.title = claim.name;
                purchaseOrder.partNumber = undefined;
                purchaseOrder.description = undefined;
                purchaseOrder.salePrice = undefined;
                purchaseOrder.stocknumber = this.randomString();
                this.errorMessagePurchaseOrder = "";
                purchaseOrder.reason = "new";
                purchaseOrder.sequenceNumber = -1;
                purchaseOrder.vehicleId = this.vehicle.id;
                purchaseOrder.companyId = this.vehicle.companyId;

                this.purchseOrderVehicleService.createPurchaseOrderVehicle(this.user.id, this.selectedPurchaseOrder).subscribe({
                  next: (res) => {
                    console.log(res);
                    purchaseOrder = res;

                    this.claim.purchaseOrders.push(purchaseOrder);

                    this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
                  },
                  error: (e) => console.error(e)
                });

              }
            }
          }
        }

        // this.getVehiclePayments(this.vehicle.id);
      }
    })
  }

  filterClaims(status: any): any {

    return this.claims.filter(claim => claim.status === status);
  }

  lockAllEstimates(status: any): void {

    for (let claim of this.claims) {
      if (claim.status != status) {
        claim.status = status;
        if (claim.status == 0)
          this.lockClaim('unlock', claim);
        else
          this.lockClaim('lock', claim);
      }
    }
  }


  lockClaim(reason: any, claim: Claim): void {

    if (reason == 'lock') {
      claim.lockedAt = new Date();
      claim.status = 1;
    }
    else {
      claim.lockedAt = undefined;
      claim.status = 0;
    }
    claim.userId = this.user.id;
    claim.reason = reason;

    this.claimService.createClaim(this.currentUser.id, claim).subscribe({
      next: result => {
        if (result)
          this.claim = result;
        //sync 
        for (let claim of this.claims) {
          if (claim.id == this.claim.id) {
            claim = this.claim;
          }
        }
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
          // this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          this.jobs = this.jobs.sort((a, b) => b.id - a.id);
          for (let job of this.jobs) {
            this.getJobScore(job);
            job.imageModels = job.imageModels.sort((a, b) => b.id - a.id);
            for (let imageModel of job.imageModels) {
              if (imageModel.showInSearch == true) {
                job.showInSearchImageId = imageModel.id;
              }
            }
            if (job.imageModels.length > 0 && job.showInSearchImageId == 0) {
              job.showInSearchImageId = job.imageModels[0].id;
            }
          }

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

  formatPhoneNumber2(phoneNumberString: any): string {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');

    // Check if the cleaned number has an extension
    const hasExtension = cleaned.length > 10;

    if (hasExtension) {
      // Extract the main number and extension
      const mainNumber = cleaned.slice(0, 10);
      const extension = cleaned.slice(10);

      // Format with extension
      return `(${mainNumber.slice(0, 3)})${mainNumber.slice(3, 6)}${mainNumber.slice(6)}-${extension}`;
    } else {
      // Format without extension
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]})${match[2]}-${match[3]}`;
      }
    }

    // Return an empty string if no valid format found
    return '';
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

  applyJobRequestTypefilter(jobRequestTypeId: any): void {

    if (jobRequestTypeId == 'All')
      this.vehicles = this.vehiclesOriginal;
    else
      this.vehicles = this.vehiclesOriginal.filter(vehicle => vehicle.jobRequestType === jobRequestTypeId);
  }

  applyAssignedTofilter(assignedTo: any): void {

    if (assignedTo == 'All')
      this.vehicles = this.vehiclesOriginal;
    else
      this.vehicles = this.vehiclesOriginal.filter(vehicle => vehicle.assignedTo === assignedTo);
  }

  applyLocationfilter(location: any): void {
    console.log("applyLocationfilter: ", location);
    if (location == 'All')
      this.vehicles = this.vehiclesOriginal;
    else
      this.vehicles = this.vehiclesOriginal.filter(vehicle => vehicle.location == location);
  }

  counter: any = 0;

  sortListAutoparts(fieldName: any): void {
    this.counter++;

    if (fieldName == 'id') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.id - b.id);
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.id - a.id);
    }

    if (fieldName == 'claimId') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.claimId - b.claimId);
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.claimId - a.claimId);
    }


    if (fieldName == 'createdAt') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.id - b.id);
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.id - a.id);
    }

    if (fieldName == 'year') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.year - b.year);
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.year - a.year);
    }

    if (fieldName == 'purchaseStatus') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.purchaseStatus - b.purchaseStatus);
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.purchaseStatus - a.purchaseStatus);
    }

    if (fieldName == 'title') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['title'].localeCompare(b['title']));
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['title'].localeCompare(a['title']));
    }

    if (fieldName == 'description') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['description'].localeCompare(b['description']));
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['description'].localeCompare(a['description']));
    }

    if (fieldName == 'partNumber') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['partNumber'].localeCompare(b['partNumber']));
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['partNumber'].localeCompare(a['partNumber']));
    }

    if (fieldName == 'grade') {
      this.autopartsSearch = this.autopartsSearch.filter(item => item['grade'] !== null);
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['grade'].localeCompare(b['grade']));
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['grade'].localeCompare(a['grade']));
    }

    if (fieldName == 'stocknumber') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['stocknumber'].localeCompare(b['stocknumber']));
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['stocknumber'].localeCompare(a['stocknumber']));
    }

    if (fieldName == 'salePrice') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.salePrice - b.salePrice);
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.salePrice - a.salePrice);
    }

    if (fieldName == 'distance') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.distance - b.distance);
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.distance - a.distance);
    }

  }

  sortListAutopartsPurchaseOrder(fieldName: any, purchaseOrder: PurchaseOrderVehicle): void {
    this.counter++;

    if (fieldName == 'id') {
      if (this.counter % 2 == 1)
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a.id - b.id);
      else
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => b.id - a.id);
    }

    if (fieldName == 'createdAt') {
      if (this.counter % 2 == 1)
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a.id - b.id);
      else
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => b.id - a.id);
    }

    if (fieldName == 'year') {
      if (this.counter % 2 == 1)
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a.year - b.year);
      else
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => b.year - a.year);
    }

    if (fieldName == 'purchaseStatus') {
      if (this.counter % 2 == 1)
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a.purchaseStatus - b.purchaseStatus);
      else
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => b.purchaseStatus - a.purchaseStatus);
    }

    if (fieldName == 'title') {
      if (this.counter % 2 == 1)
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a['title'].localeCompare(b['title']));
      else
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => b['title'].localeCompare(a['title']));
    }

    if (fieldName == 'description') {
      if (this.counter % 2 == 1)
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a['description'].localeCompare(b['description']));
      else
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => b['description'].localeCompare(a['description']));
    }

    if (fieldName == 'partNumber') {
      if (this.counter % 2 == 1)
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a['partNumber'].localeCompare(b['partNumber']));
      else
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => b['partNumber'].localeCompare(a['partNumber']));
    }

    if (fieldName == 'grade') {
      purchaseOrder.autoparts = purchaseOrder.autoparts.filter(item => item['grade'] !== null);
      if (this.counter % 2 == 1)
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a['grade'].localeCompare(b['grade']));
      else
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => b['grade'].localeCompare(a['grade']));
    }

    if (fieldName == 'stocknumber') {
      if (this.counter % 2 == 1)
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a['stocknumber'].localeCompare(b['stocknumber']));
      else
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => b['stocknumber'].localeCompare(a['stocknumber']));
    }

    if (fieldName == 'salePrice') {
      if (this.counter % 2 == 1)
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a.salePrice - b.salePrice);
      else
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => b.salePrice - a.salePrice);
    }

    if (fieldName == 'distance') {
      if (this.counter % 2 == 1)
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a.distance - b.distance);
      else
        purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => b.distance - a.distance);
    }

  }

  sortListPurchseOrdersClaim(fieldName: any, purchaseOrders: PurchaseOrderVehicle[]): void {
    this.counter++;

    if (fieldName == 'id') {
      if (this.counter % 2 == 1)
        purchaseOrders = purchaseOrders.sort((a, b) => a.id - b.id);
      else
        purchaseOrders = purchaseOrders.sort((a, b) => b.id - a.id);
    }

    if (fieldName == 'createdAt') {
      if (this.counter % 2 == 1)
        purchaseOrders = purchaseOrders.sort((a, b) => a.id - b.id);
      else
        purchaseOrders = purchaseOrders.sort((a, b) => b.id - a.id);
    }


    if (fieldName == 'purchaseStatus') {
      if (this.counter % 2 == 1)
        purchaseOrders = purchaseOrders.sort((a, b) => a.purchaseStatus - b.purchaseStatus);
      else
        purchaseOrders = purchaseOrders.sort((a, b) => b.purchaseStatus - a.purchaseStatus);
    }

    if (fieldName == 'status') {
      if (this.counter % 2 == 1)
        purchaseOrders = purchaseOrders.sort((a, b) => a.status - b.status);
      else
        purchaseOrders = purchaseOrders.sort((a, b) => b.status - a.status);
    }

    if (fieldName == 'title') {
      if (this.counter % 2 == 1)
        purchaseOrders = purchaseOrders.sort((a, b) => a['title'].localeCompare(b['title']));
      else
        purchaseOrders = purchaseOrders.sort((a, b) => b['title'].localeCompare(a['title']));
    }

    if (fieldName == 'description') {
      if (this.counter % 2 == 1)
        purchaseOrders = purchaseOrders.sort((a, b) => a['description'].localeCompare(b['description']));
      else
        purchaseOrders = purchaseOrders.sort((a, b) => b['description'].localeCompare(a['description']));
    }

    if (fieldName == 'partNumber') {
      if (this.counter % 2 == 1)
        purchaseOrders = purchaseOrders.sort((a, b) => a['partNumber'].localeCompare(b['partNumber']));
      else
        purchaseOrders = purchaseOrders.sort((a, b) => b['partNumber'].localeCompare(a['partNumber']));
    }

    if (fieldName == 'grade') {
      purchaseOrders = purchaseOrders.filter(item => item['grade'] !== null);
      if (this.counter % 2 == 1)
        purchaseOrders = purchaseOrders.sort((a, b) => a['grade'].localeCompare(b['grade']));
      else
        purchaseOrders = purchaseOrders.sort((a, b) => b['grade'].localeCompare(a['grade']));
    }


    if (fieldName == 'vendorId') {
      for (let purchaseOrder of purchaseOrders) {
        purchaseOrder.sortStr = "";
        for (let vendor of this.vendors) {
          if (vendor.id == purchaseOrder.vendorId) {
            purchaseOrder.sortStr = vendor.name;
          }
        }
      }

      if (this.counter % 2 == 1)
        purchaseOrders = purchaseOrders.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        purchaseOrders = purchaseOrders.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    }

    if (fieldName == 'salePrice') {
      if (this.counter % 2 == 1)
        purchaseOrders = purchaseOrders.sort((a, b) => a.salePrice - b.salePrice);
      else
        purchaseOrders = purchaseOrders.sort((a, b) => b.salePrice - a.salePrice);
    }



  }


  sortListPurchseOrders(fieldName: any): void {
    this.counter++;

    if (fieldName == 'id') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.id - b.id);
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.id - a.id);
    }

    if (fieldName == 'claimId') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.claimId - b.claimId);
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.claimId - a.claimId);
    }

    if (fieldName == 'createdAt') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.id - b.id);
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.id - a.id);
    }


    if (fieldName == 'purchaseStatus') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.purchaseStatus - b.purchaseStatus);
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.purchaseStatus - a.purchaseStatus);
    }

    if (fieldName == 'status') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.status - b.status);
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.status - a.status);
    }

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

    if (fieldName == 'grade') {
      this.purchaseOrders = this.purchaseOrders.filter(item => item['grade'] !== null);
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a['grade'].localeCompare(b['grade']));
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b['grade'].localeCompare(a['grade']));
    }


    if (fieldName == 'vendorId') {
      for (let purchaseOrder of this.purchaseOrders) {
        purchaseOrder.sortStr = "";
        for (let vendor of this.vendors) {
          if (vendor.id == purchaseOrder.vendorId) {
            purchaseOrder.sortStr = vendor.name;
          }
        }
      }

      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    }

    if (fieldName == 'salePrice') {
      if (this.counter % 2 == 1)
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.salePrice - b.salePrice);
      else
        this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.salePrice - a.salePrice);
    }



  }


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

      // if (this.counter % 2 == 1)
      //   this.vehicles = this.vehicles.sort((a, b) => a.status - b.status);
      // else
      //   this.vehicles = this.vehicles.sort((a, b) => b.status - a.status);
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

    if (fieldName == 'make') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['make'].localeCompare(b['make']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['make'].localeCompare(a['make']));
    }

    if (fieldName == 'comments') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['comments'].localeCompare(b['comments']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['comments'].localeCompare(a['comments']));
    }


    if (fieldName == 'loanerCarName') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['loanerCarName'].localeCompare(b['loanerCarName']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['loanerCarName'].localeCompare(a['loanerCarName']));
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


    if (fieldName == 'lastUpdateObjectName') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['lastUpdateObjectName'].localeCompare(b['lastUpdateObjectName']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['lastUpdateObjectName'].localeCompare(a['lastUpdateObjectName']));
    }

    if (fieldName == 'vin') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['vin'].localeCompare(b['vin']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['vin'].localeCompare(a['vin']));
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

    if (fieldName == 'vip') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => Number(a.special) - Number(b.special));
      else
        this.vehicles = this.vehicles.sort((a, b) => Number(b.special) - Number(a.special));
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

    // if (fieldName == 'approvalStatus') {
    //   if (this.counter % 2 == 1)
    //     this.vehicles = this.vehicles.sort((a, b) => a.approvalStatus - b.approvalStatus);
    //   else
    //     this.vehicles = this.vehicles.sort((a, b) => b.approvalStatus - a.approvalStatus);
    // }

    if (fieldName == 'approvalStatus') {
      for (let vehicle of this.vehicles) {
        vehicle.sortStr = "";
        for (let apprivalStatus of this.approvalStatuss) {
          if (apprivalStatus.id == vehicle.keyLocation) {
            vehicle.sortStr = apprivalStatus.name;
          }
        }
      }

      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
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
      // if (this.counter % 2 == 1)
      //   this.vehicles = this.vehicles.sort((a, b) => a.jobRequestType - b.jobRequestType);
      // else
      //   this.vehicles = this.vehicles.sort((a, b) => b.jobRequestType - a.jobRequestType);
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

    if (fieldName == 'assignedTo' || fieldName == 'serviceManager') {

      for (let vehicle of this.vehicles) {
        vehicle.sortStr = "";
        for (let employee of this.employees) {
          if (employee.id == vehicle.assignedTo) {
            vehicle.sortStr = employee.firstName + employee.lastName;
          }
        }
      }

      // if (this.counter % 2 == 1)
      //   this.vehicles = this.vehicles.sort((a, b) => a.assignedTo - b.assignedTo);
      // else
      //   this.vehicles = this.vehicles.sort((a, b) => b.assignedTo - a.assignedTo);

      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    }

    if (fieldName == 'keyLocation') {
      for (let vehicle of this.vehicles) {
        vehicle.sortStr = "";
        for (let keyLocation of this.keyLocations) {
          if (keyLocation.id == vehicle.keyLocation) {
            vehicle.sortStr = keyLocation.name;
          }
        }
      }

      // if (this.counter % 2 == 1)
      //   this.vehicles = this.vehicles.sort((a, b) => a.keyLocation - b.keyLocation);
      // else
      //   this.vehicles = this.vehicles.sort((a, b) => b.keyLocation - a.keyLocation);

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

      // if (this.counter % 2 == 1)
      //   this.vehicles = this.vehicles.sort((a, b) => a.location - b.location);
      // else
      //   this.vehicles = this.vehicles.sort((a, b) => b.location - a.location);

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


    if (fieldName == 'updatedAt') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      else
        this.vehicles = this.vehicles.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    }

    // if (fieldName == 'customer') {
    //   if (this.counter % 2 == 1)
    //     this.vehicles = this.vehicles.sort((a, b) => a['customer.lastName'].localeCompare(b['customer.lastName']));
    //   else
    //     this.vehicles = this.vehicles.sort((a, b) => b['customer.lastName'].localeCompare(a['customer.lastName']));
    // }

    if (fieldName == 'customer') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => {
          if (a.customer.lastName < b.customer.lastName) {
            return -1;
          } else if (a.customer.lastName > b.customer.lastName) {
            return 1;
          } else {
            return 0;
          }
        });
      else
        this.vehicles = this.vehicles.sort((a, b) => {
          if (a.customer.lastName > b.customer.lastName) {
            return -1;
          } else if (a.customer.lastName < b.customer.lastName) {
            return 1;
          } else {
            return 0;
          }
        });
    }

    if (fieldName == 'phone') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => {
          if (a.customer.phone < b.customer.phone) {
            return -1;
          } else if (a.customer.phone > b.customer.phone) {
            return 1;
          } else {
            return 0;
          }
        });
      else
        this.vehicles = this.vehicles.sort((a, b) => {
          if (a.customer.phone > b.customer.phone) {
            return -1;
          } else if (a.customer.phone < b.customer.phone) {
            return 1;
          } else {
            return 0;
          }
        });
    }

  }

  currentIndex: any = "";

  getStatusCount(statusId: any): any {
    var counts = 0;
    for (let vehicle of this.vehiclesOriginal) {
      if (vehicle.status == statusId)
        counts++;
    }
    return counts;

  }

  getJobStatusCount(vehicle: any, jobs: Job[]): any {
    vehicle.jobsDone = false;
    var counts = 0;
    for (let job of jobs) {
      if (job.status == 1)
        counts++;
    }
    if (jobs.length > 0 && counts == jobs.length) {
      vehicle.jobsDone = true;
    }
    return counts;

  }

  openTab(tabId: any) {

    const element = <HTMLInputElement>document.querySelector("[id='" + tabId + "']");
    if (element)
      element.click();

    // setTimeout(function () {

    //   const element = <HTMLInputElement>document.querySelector("[id='" + tabId + "']");
    //   if (element)
    //     element.click();
    // }, 50);
  }

  navigateTo(path: any) {

    this.router.navigate(['/' + path],
      { skipLocationChange: false });

  }

  createSupplyment(vehicle: any): void {
    var supplement = new Supplement();
    supplement.name = "Change Me";
    supplement.description = "Change Me";
    supplement.price = 1;
    supplement.userId = this.user.id;
    supplement.companyId = this.user.companyId;
    supplement.vehicleId = vehicle.id;
    supplement.reason = "Supllement";

    this.supplementService.createSupplement(vehicle.id, supplement).subscribe({
      next: result => {
        if (result != null) {
          console.log(result);
          this.vehicle.supplements.unshift(result);
        }
      }
    })

  }

  onChangeSupplementDate($event: any, vehicle: any, supplement: any): void {

    const date: Date = new Date($event.target.value);
    //supplement.createdAt = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    supplement.updatedAt = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    this.supplementService.createSupplement(vehicle.id, supplement).subscribe({
      next: result => {
        if (result != null) {
          console.log(result);
          for (let i = 0; i < this.vehicle.supplements.length; i++) {
            if (this.vehicle.supplements[i].id == supplement.id) {
              this.vehicle.supplements[i] = result;
            }
          }
        }
      }
    })
  }

  saveSupplyment(vehicle: any, supplement: any, reason: any): void {

    supplement.reason = reason;
    this.supplementService.createSupplement(vehicle.id, supplement).subscribe({
      next: result => {
        if (result != null) {
          console.log(result);
          for (let i = 0; i < this.vehicle.supplements.length; i++) {
            if (this.vehicle.supplements[i].id == supplement.id) {
              this.vehicle.supplements[i] = result;
            }
          }
        }
      }
    })

  }

  getTotalSupplements(vehicle: any): any {
    var total = 0;

    if (vehicle.supplements.length > 0) {
      for (let supplement of vehicle.supplements) {
        total += supplement.price;
      }
    }

    return +(total.toFixed(0));
  }


  deleteSupplyment(supplementId: any): void {


    this.supplementService.deleteSupplement(supplementId).subscribe({
      next: result => {

        for (let i = 0; i < this.vehicle.supplements.length; i++) {
          if (this.vehicle.supplements[i].id == supplementId) {
            this.vehicle.supplements.splice(i, 1);
          }
        }

      }
    })

  }

  getOverviewCounts(statusId: any): any {

    for (let status of this.statuss) {
      for (let groupBy of this.statusOverview) {

        if (groupBy.status == status.id) {
          return groupBy.count;
        }
      }
    }
  }

  droppedStatusOverview(event: CdkDragDrop<string[]>) {
    console.log("droppedStatusOverview");
    moveItemInArray(
      this.statusOverview,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.statuss.length; i++) {
      for (let groupBy of this.statusOverview) {
        if (groupBy.status == this.statuss[i].id) {
          let sequenceCarrier = new SequenceCarrier();
          sequenceCarrier.id = this.statuss[i].id;
          sequenceCarrier.index = i;
          sequenceCarriers.push(sequenceCarrier);
        }
      }
    }

    this.statusService.updateSeqenceWithId(this.user.companyId, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.statuss = result;
          this.statuss = this.statuss.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

          for (let status of this.statuss) {
            for (let groupBy of this.statusOverview) {
              if (status.id == groupBy.status) {
                groupBy.sequenceNumber = status.sequenceNumber;
              }
            }
          }
          this.statusOverview = this.statusOverview.sort((a, b) => b.sequenceNumber - a.sequenceNumber);
        }
      }
    })
  }

  droppedStatus3(event: CdkDragDrop<any>, status: any) {



    if (this.vehicle.status != status) {
      var foundIt = false;
      for (let vehicle of this.vehiclesOriginal) {
        if (vehicle.id == this.vehicle.id) {
          foundIt = true;
          this.vehicle.status = status;
          vehicle.status = status;
        }
      }

      for (let status of this.statuss2) {
        status.vehicles = new Array();
        for (let vehicle of this.vehiclesOriginal) {
          if (this.isInStatus(vehicle.status)) {
            if (vehicle.status == status.id) {
              status.vehicles.push(vehicle);
            }
          } else {
            status.vehicles.push(vehicle);
          }
        }
        status.vehicles = status.vehicles.sort((a: Vehicle, b: Vehicle) => a['make'].localeCompare(b['make']));
      }

      this.vehicle.reason = "status";
      this.vehicleService.createAndUpdateVehicle(this.user.id, this.vehicle).subscribe({
        next: result => {
          this.vehicle = result;
          this.vehicle.reason = "";
          //sync current list
          for (let vehicle of this.vehicles) {
            if (vehicle.id == this.vehicle.id) {
              //foundIt = true;
              //this.vehicle.status = status;
              vehicle.status = status;
            }
          }

        }
      })


    }


  }

  imageModelDrop: ImageModel = new ImageModel();
  indexImageModelDrop: any = 0;

  getDetailImageModel(imageModel: ImageModel, index: any): void {

    console.log("image id: " + imageModel.id + " index:" + index);

    this.indexImageModelDrop = index;
    this.imageModelDrop = imageModel;
    this.selectedImage = this.imageModelDrop.id;
    this.imageModelSelected = imageModel;

    this.selectedImage2 = this.imageModelSelected.id;

  }

  droppedDocType3(event: CdkDragDrop<any>, docType: any, docTypeId: any) {

    console.log("droppedDocType3:" + docTypeId);

    if (this.imageModelDrop.docType != docTypeId) {

      console.log(event.previousContainer.data);
      console.log("Diff-current  Index:" + event.currentIndex);
      console.log("Diff-previous Index:" + event.previousIndex);

      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex
      // );
    } else {

      console.log(event.container.data);
      console.log("Same-current  Index:" + event.currentIndex);
      console.log("Same-previous Index:" + event.previousIndex);

      // moveItemInArray(
      //   docType.imageModels,
      //   event.previousIndex,
      //   event.currentIndex
      // );

      // moveItemInArray(
      //   docType.imageModels,
      //   event.previousIndex,
      //   event.currentIndex
      // );

    }

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < docType.imageModels.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = docType.imageModels[i].id;
      sequenceCarrier.index = i;
      sequenceCarrier.pageNumber = this.currantPageNumber;
      sequenceCarrier.pageSize = this.pageSize;

      sequenceCarriers.push(sequenceCarrier);
    }

    console.log(sequenceCarriers);
    // var sequenceCarriers: SequenceCarrier[] = new Array();
    // for (let i = 0; i < this.columnInfos.length; i++) {
    //   let sequenceCarrier = new SequenceCarrier();
    //   sequenceCarrier.id = this.columnInfos[i].id;
    //   sequenceCarrier.index = i;
    //   sequenceCarrier.pageNumber = this.currantPageNumber;
    //   sequenceCarrier.pageSize = this.pageSize;

    //   sequenceCarriers.push(sequenceCarrier);
    // }

    // this.columnInfoService.updateSeqenceWithId(this.user.companyId, sequenceCarriers).subscribe({
    //   next: result => {

    //     if (result) {
    //       this.columnInfos = result;
    //       this.columnInfos = this.columnInfos.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    //     }
    //   }
    // })

    if (this.imageModelDrop.docType != docTypeId) {
      var foundIt = false;
      for (let vehicle of this.vehiclesOriginal) {
        if (vehicle.id == this.vehicle.id) {
          foundIt = true;
          for (let i = 0; i < this.vehicle.imageModels.length; i++) {
            if (this.imageModelDrop.id == this.vehicle.imageModels[i].id) {
              this.vehicle.imageModels[i].docType = docTypeId;
            }
          }

        }
      }


      for (let docType of this.docTypes) {
        docType.imageModels = new Array();
      }


      for (let imageModel of this.vehicle.imageModels) {

        if (this.isInDocType(imageModel.docType)) {

          for (let docType of this.docTypes) {
            if (imageModel.docType == docType.id) {
              imageModel.docTypeName = docType.name;
              docType.imageModels.push(imageModel);
            }
          }
        } else {
          this.docTypes[0].imageModels.push(imageModel);
        }

      }

      for (let docType of this.docTypes) {
        //docType.imageModels = docType.imageModels.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        docType.imageModels = docType.imageModels.sort((a, b) => a.id - b.id);
      }

      // for (let docType of this.docTypes) {
      //   docType.imageModels = new Array();
      //   for (let imageModel of this.vehicle.imageModels) {
      //     if (this.isInDocType(imageModel.docType)) {
      //       if (imageModel.docType == docType.id) {
      //         docType.imageModels.push(imageModel);
      //       }
      //     } else {
      //       docType.imageModels.push(imageModel);
      //     }
      //   }
      //   docType.imageModels = docType.imageModels.sort((a, b) => b.id - a.id);
      // }

      this.imageModelDrop.reason = "docType";
      this.vehicleService.setImageDocTypeWithUserId(docTypeId, this.imageModelDrop.id, this.vehicle.id, this.user.id).subscribe({
        next: result => {
          this.imageModelDrop.reason = "";
          console.log("droppedDocType3 Done");
        }
      })


    }


  }

  onChangeDocType($event: any): void {

    var docTypeId = $event.target.value;

    this.imageModelSelected.reason = "docType";

    this.vehicleService.setImageDocTypeWithUserId(docTypeId, this.imageModelSelected.id, this.vehicle.id, this.user.id).subscribe({
      next: result => {
        this.imageModelSelected.reason = "";
        console.log("onChangeDocType Done");
        //sync up
        for (let i = 0; i < this.vehicle.imageModels.length; i++) {
          for (let docType of this.docTypes) {
            if (this.vehicle.imageModels[i].id == this.imageModelSelected.id) {
              this.vehicle.imageModels[i].docType = docTypeId;
              this.vehicle.imageModels[i].docTypeName = docType.name;
              this.imageModelSelected = this.vehicle.imageModels[i];

            }
          }
        }

        for (let docType of this.docTypes) {
          docType.imageModels = new Array();
        }

        for (let imageModel of this.vehicle.imageModels) {

          if (this.isInDocType(imageModel.docType)) {

            for (let docType of this.docTypes) {
              if (imageModel.docType == docType.id) {
                imageModel.docTypeName = docType.name;
                docType.imageModels.push(imageModel);
              }
            }
          } else {
            this.docTypes[0].imageModels.push(imageModel);
          }

        }

        for (let docType of this.docTypes) {
          //docType.imageModels = docType.imageModels.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          docType.imageModels = docType.imageModels.sort((a, b) => a.id - b.id);
        }

      }
    })
  }

  onChangeDocTypeDropped($event: any): void {

    var docTypeId = $event.target.value;

    this.imageModelSelected.reason = "docType";

    this.vehicleService.setImageDocTypeWithUserId(docTypeId, this.imageModelSelected.id, this.vehicle.id, this.user.id).subscribe({
      next: result => {
        this.imageModelSelected.reason = "";
        console.log("onChangeDocType Done");
        //sync up
        for (let i = 0; i < this.vehicle.imageModels.length; i++) {
          for (let docType of this.docTypes) {
            if (this.vehicle.imageModels[i].id == this.imageModelSelected.id) {
              this.vehicle.imageModels[i].docType = docTypeId;
              this.vehicle.imageModels[i].docTypeName = docType.name;
              this.imageModelDrop = this.vehicle.imageModels[i];

            }
          }
        }

        for (let docType of this.docTypes) {
          docType.imageModels = new Array();
        }

        for (let imageModel of this.vehicle.imageModels) {

          if (this.isInDocType(imageModel.docType)) {

            for (let docType of this.docTypes) {
              if (imageModel.docType == docType.id) {
                imageModel.docTypeName = docType.name;
                docType.imageModels.push(imageModel);
              }
            }
          } else {
            this.docTypes[0].imageModels.push(imageModel);
          }

        }

        for (let docType of this.docTypes) {
          //docType.imageModels = docType.imageModels.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          docType.imageModels = docType.imageModels.sort((a, b) => a.id - b.id);
        }

      }
    })
  }

  getDocTypeColor(docTypeId: any): any {

    for (let docType of this.docTypes) {
      if (docType.id == docTypeId) {
        return docType.color;
      }
    }
  }

  droppedStatus3_bak(event: CdkDragDrop<any>, status: any) {

    // console.log("event.previousIndex:" + event.previousIndex);
    // console.log("event.currentIndex:" + event.currentIndex);
    // console.log("droppedStatus3 Status before:" + this.vehicle.status);
    // console.log("droppedStatus3 Status after :" + status);




    //console.log(statusId)

    if (event.previousContainer === event.container) {
      // console.log("====event.container.data: " + event.container.data);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {

      var foundIt = false;

      for (let vehicle of this.vehiclesOriginal) {
        if (vehicle.id == this.vehicle.id) {
          foundIt = true;
          this.vehicle.status = status;
          vehicle.status = status;
        }
      }
      // for (let status of this.statuss) {
      //   status.vehicles = new Array();
      //   for (let vehicle of this.vehicles) {
      //     if (vehicle.status == status.id) {
      //       status.vehicles.push(vehicle);
      //     }
      //   }
      // }
      // console.log("--------------------droppedStatus3 Status before:" + this.vehicle.status);
      //  console.log("droppedStatus3 Status after :" + status);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      //this.vehicle.status = statusId;
      console.log("Different container !!!")

      if (foundIt == true) {

        this.vehicle.reason = "status";
        this.vehicleService.createAndUpdateVehicle(this.user.id, this.vehicle).subscribe({
          next: result => {
            this.vehicle = result;
            this.vehicle.reason = "";
            //sync current list
            for (let vehicle of this.vehicles) {
              if (vehicle.id == this.vehicle.id) {
                //foundIt = true;
                //this.vehicle.status = status;
                vehicle.status = status;
              }
            }

          }
        })
      }

    }

    //console.log(this.vehicle.status)

    // moveItemInArray(
    //   this.statuss,
    //   event.previousIndex,
    //   event.currentIndex
    // );


    // if (this.vehicleJobsOnly == true) {
    //   this.fillCalendarVehicleJob();
    // }
  }

  droppedStatus(event: CdkDragDrop<string[]>) {

    console.log("droppedStatus" + event);

    moveItemInArray(
      this.statuss2,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.statuss2.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.statuss2[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.statusService.updateSeqenceWithId(this.user.companyId, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.statuss2 = result;
          var statusNoStatus = new Status();
          statusNoStatus.name = "No Status";
          statusNoStatus.id = 0;
          statusNoStatus.sequenceNumber = -1;
          this.statuss2.push(statusNoStatus);

          this.statuss2 = this.statuss2.sort((a, b) => a.sequenceNumber - b.sequenceNumber);



          for (let status of this.statuss2) {
            status.vehicles = new Array();
            for (let vehicle of this.vehiclesOriginal) {

              if (this.isInStatus(vehicle.status)) {
                if (vehicle.status == status.id) {
                  status.vehicles.push(vehicle);
                }
              } else {
                status.vehicles.push(vehicle);
              }
            }
          }
        }
      }
    })


  }

  droppedDocType(event: CdkDragDrop<string[]>) {

    console.log("droppedDocType" + event);

    moveItemInArray(
      this.docTypes,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.docTypes.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.docTypes[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.docTypeService.updateSeqenceWithId(this.user.companyId, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.docTypes = result;
          var docTYpeNoType = new DocType();
          docTYpeNoType.name = "Not Sorted";
          docTYpeNoType.id = 0;
          docTYpeNoType.sequenceNumber = -1;
          this.docTypes.push(docTYpeNoType);

          this.docTypes = this.docTypes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);



          for (let docType of this.docTypes) {
            docType.imageModels = new Array();
          }


          for (let imageModel of this.vehicle.imageModels) {

            if (this.isInDocType(imageModel.docType)) {

              for (let docType of this.docTypes) {
                if (imageModel.docType == docType.id) {
                  imageModel.docTypeName = docType.name;
                  docType.imageModels.push(imageModel);
                }
              }
            } else {
              this.docTypes[0].imageModels.push(imageModel);
            }

          }

          for (let docType of this.docTypes) {
            //docType.imageModels = docType.imageModels.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
            docType.imageModels = docType.imageModels.sort((a, b) => a.id - b.id);
          }

        }
      }
    })


  }

  isInStatus(statusId: any): boolean {
    for (let status of this.statuss2) {
      if (status.id == statusId)
        return true;
    }
    return false;
  }

  isInDocType(docTypeId: any): boolean {
    for (let docType of this.docTypes) {
      if (docType.id == docTypeId)
        return true;
    }
    return false;
  }

  droppedJobsClaim(event: CdkDragDrop<string[]>, claim: Claim) {
    moveItemInArray(
      claim.jobs,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < claim.jobs.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = claim.jobs[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.jobService.updateSeqenceClaim(this.vehicle.id, sequenceCarriers).subscribe({
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
          // this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          this.jobs = this.jobs.sort((a, b) => b.id - a.id);
        }
      }
    })

    if (this.vehicleJobsOnly == true) {
      this.fillCalendarVehicleJob();
    }
  }

  droppedVehicleImage(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.vehicle.imageModels,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.vehicle.imageModels.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.vehicle.imageModels[i].id;
      this.vehicle.imageModels[i].sequenceNumber = i;

      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    //this.vehicle.imageModels = this.vehicle.imageModels.sort((a: { sequenceNumber: number; }, b: { sequenceNumber: number; }) => a.sequenceNumber - b.sequenceNumber);

    this.vehicleService.updateImageVehicleSeqence(this.vehicle.id, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.vehicle.imageModels = this.vehicle.imageModels.sort((a: { sequenceNumber: number; }, b: { sequenceNumber: number; }) => a.sequenceNumber - b.sequenceNumber);

        }
      }
    })


  }

  onChangeNoTax($event: any): void {

    var isCheck: boolean = $event.target.checked;
    if (isCheck == true) {
      this.company.taxRate = 0.00;
    } else {
      this.company.taxRate = this.companyDefaultTaxRate;
    }

  }

  getSubtotal(): number {
    var total: number = 0;
    if (this.receipts.length > 0) {
      for (let receipt of this.receipts) {
        total += (receipt.quantity * receipt.amount);
      }

      return +(total.toFixed(2));
    } else {
      return total;
    }

  }

  getSubtotalClaims(): number {
    var total: number = 0;
    if (this.claims.length > 0) {
      for (let claim of this.claims) {
        total += (claim.quantity * claim.amount);
      }

      return +(total.toFixed(2));
    } else {
      return total;
    }

  }

  getSubtotalClaimsLocked(): number {
    var total: number = 0;
    if (this.claims.length > 0) {
      for (let claim of this.claims) {
        if (claim.status == 1)
          total += (claim.quantity * claim.amount);
      }

      return +(total.toFixed(2));
    } else {
      return total;
    }

  }

  getTotalPayments(): number {
    var total: number = 0;
    if (this.payments.length > 0) {
      for (let payment of this.payments) {
        total += payment.amount;
      }

      return +(total.toFixed(2));
    } else {
      return total;
    }
  }

  getTaxPayments(): number {
    var total: number = 0;
    if (this.payments.length > 0) {
      for (let payment of this.payments) {
        total += payment.amount;
      }
      return +(Math.round(total * this.company.taxRate)).toFixed(2);
    } else {
      return total;
    }
  }

  getTotalPaymentWithTax(): number {
    return +(this.getTaxPayments() + this.getTotalPayments()).toFixed(2);
  }

  getTotalBalance(): number {

    return +(this.getTotalClaims() - this.getTotalPayments()).toFixed(2);

  }

  getTotalBalanceLocked(): number {

    return +(this.getTotalClaimsLocked() - this.getTotalPayments()).toFixed(2);

  }

  getTax(): number {
    var total: number = 0;
    for (let receipt of this.receipts) {
      total += (receipt.quantity * receipt.amount);
    }
    //(Math.round(2.782061 * 100) / 100).toFixed(2)
    return +(Math.round(total * this.company.taxRate)).toFixed(2);
  }

  getTaxClaim(): number {
    var total: number = 0;
    for (let claim of this.claims) {
      total += (claim.quantity * claim.amount);
    }
    //(Math.round(2.782061 * 100) / 100).toFixed(2)
    return +(Math.round(total * this.company.taxRate)).toFixed(2);
  }


  getTaxClaimLocked(): number {
    var total: number = 0;
    for (let claim of this.claims) {
      if (claim.status == 1)
        total += (claim.quantity * claim.amount);
    }
    //(Math.round(2.782061 * 100) / 100).toFixed(2)
    return +(Math.round(total * this.company.taxRate)).toFixed(2);
  }

  getTotalClaims(): number {
    return +(this.getSubtotalClaims() + this.getTaxClaim()).toFixed(2);
  }

  getTotalClaimsLocked(): number {
    return +(this.getSubtotalClaimsLocked() + this.getTaxClaimLocked()).toFixed(2);
  }

  getTotal(): number {
    return +(this.getSubtotal() + this.getTax()).toFixed(2);
  }

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

  findClaim(claimId: any): any {
    for (let claim of this.claims) {
      if (claim.id == claimId) {
        console.log(claim);
        return claim;
      }
    }
  }

  openItemViewerModal_(claim: Claim) {
    console.log(claim);
    this.itemViewerModalService.open(claim, (updatedClaim: Claim) => {
      // Handle updated claim data
      console.log('Updated Claim:', updatedClaim);
      // For example, update the claim in the list
      const index = this.claims.findIndex(w => w.id === claim.id);
      if (index !== -1) {
        this.claims[index] = updatedClaim;
      }
    });
  }


  openItemViewerModal(job: Job) {
    this.currentJobId = job.id;
    var claimTemp = new Claim();
    for (let claim of this.claims) {
      if (claim.id == job.claimId) {
        claimTemp = claim;
      }
    }


    console.log(claimTemp);
    this.itemViewerModalService.open(claimTemp, (updatedClaim: Claim) => {
      // Handle updated claim data
      console.log('Updated Claim:', updatedClaim);
      // For example, update the claim in the list
      const index = this.claims.findIndex(w => w.id === claimTemp.id);
      if (index !== -1) {
        this.claims[index] = updatedClaim;
      }
    });
  }

  droppedClaim(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.claims,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.claims.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.claims[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.claimService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.claims = result;
          this.claims = this.claims.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          for (let claim of this.claims) {
            for (let itemType of this.itemTypes) {
              if (itemType.id == claim.itemType) {
                if (itemType.createJobOrder == true) {
                  claim.createJobOrder = true;
                }

                if (itemType.createPurchaseOrder == true) {
                  console.log("===== found it");
                  claim.createPurchaseOrder = true;
                }
              }
            }
          }
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

  droppedAutoprts(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.autopartsSearch,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.autopartsSearch.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.autopartsSearch[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.autopartService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.autopartsSearch = result;
          this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    })
  }

  droppedAutoprtsPurchaseOrder(event: CdkDragDrop<string[]>, purchaseOrder: PurchaseOrderVehicle) {
    moveItemInArray(
      purchaseOrder.autoparts,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < purchaseOrder.autoparts.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = purchaseOrder.autoparts[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.autopartService.updateSeqencePurchaseOrder(purchaseOrder.id, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          purchaseOrder.autoparts = result;
          purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    })
  }

  droppedPurchaseOrdersClaim(event: CdkDragDrop<string[]>, claim: Claim) {
    moveItemInArray(
      claim.purchaseOrders,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < claim.purchaseOrders.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = claim.purchaseOrders[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.purchseOrderVehicleService.updateSeqenceClaim(claim.id, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.purchaseOrders = result;
          this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    })
  }


  droppedPurchaseOrders(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.purchaseOrders,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.purchaseOrders.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.purchaseOrders[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.purchseOrderVehicleService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.purchaseOrders = result;
          this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
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
      sequenceCarrier.pageNumber = this.currantPageNumber;
      sequenceCarrier.pageSize = this.pageSize;

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

  droppedColumnInfo(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.columnInfos,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.columnInfos.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.columnInfos[i].id;
      sequenceCarrier.index = i;
      sequenceCarrier.pageNumber = this.currantPageNumber;
      sequenceCarrier.pageSize = this.pageSize;

      sequenceCarriers.push(sequenceCarrier);
    }

    this.columnInfoService.updateSeqenceWithId(this.user.companyId, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.columnInfos = result;
          this.columnInfos = this.columnInfos.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
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

    this.jobService.deleteJobWithUserId(job.id, this.user.id).subscribe({
      next: result => {

        console.log(result);
        this.getVehicleJobs2(this.vehicle.id);
        if (this.currentEmplyeeId == job.employeeId && this.vehiclesJob.length > 0) {
          this.getMyJobs(this.currentEmplyeeId);
        }
      }
    })

  }

  deleteVehicleJobClaim($event: any, job: Job) {
    console.log("deleteVehicleJob " + job.id);




    if (job.claimId > 0) {

      const customTitle = 'Confirmation';
      const message = 'Are you sure to remove it from this Job [' + job.name + '] from estimate ?';
      const buttonType = 'yesNo';
      // Call the service to show the confirmation dialog and pass the callback
      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed) {

          this.jobService.deleteJobWithUserIdWithOpitn(job.id, this.user.id, 1).subscribe({
            next: result => {

              console.log(result);
              this.getAllVehicleClaims(this.vehicle.id);
              this.getVehicleJobs2(this.vehicle.id);
              if (this.currentEmplyeeId == job.employeeId && this.vehiclesJob.length > 0) {
                this.getMyJobs(this.currentEmplyeeId);
              }
            }
          })

        } else {
          console.log('Item not deleted');
        }
      });



    } else {
      const customTitle = 'Confirmation';
      const message = 'Are you sure to remove it  this Job [' + job.name + '] ?';
      const buttonType = 'yesNo';
      // Call the service to show the confirmation dialog and pass the callback
      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed) {

          this.jobService.deleteJobWithUserIdWithOpitn(job.id, this.user.id, 1).subscribe({
            next: result => {

              console.log(result);
              this.getAllVehicleClaims(this.vehicle.id);
              this.getVehicleJobs2(this.vehicle.id);
              if (this.currentEmplyeeId == job.employeeId && this.vehiclesJob.length > 0) {
                this.getMyJobs(this.currentEmplyeeId);
              }
            }
          })

        } else {
          console.log('Item not deleted');
        }
      });

    }

  }



  deleteVehicleReceipt($event: any, receipt: Receipt) {
    console.log("deleteVehicleReceipt" + receipt.id);


    if (receipt.claimId > 0) {

      var message = "";
      const customTitle = 'Remove Receipt [' + receipt.notes + "]";
      message = "Remove estimate [" + receipt.claimId + "] at the same time ?";
      const buttonType = "yesNoCancel" //buttonType: 'yesNo' | 'okCancel' | 'yesNoCancel' | 'okOnly' = 'yesNo'  // Button type

      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed == undefined) {

          console.log("cnacelled");
          return;
        }
        else if (confirmed) {

          this.receiptService.deleteReceiptWithOptionWithUserId(this.user.id, receipt.id).subscribe({
            next: result => {
              console.log(result);
              this.getAllVehicleReceipt(this.vehicle.id);
              this.getAllVehicleClaims(this.vehicle.id);
            }
          })

        } else {

          this.receiptService.deleteReceipt(receipt.id).subscribe({
            next: result => {
              console.log(result);
              this.getAllVehicleReceipt(this.vehicle.id);
            }
          })
        }
      });
    } else {

      var message = "";
      const customTitle = 'Remove Receipt [' + receipt.notes + "]";
      message = "Are you sure to remove this receipt item ?";
      const buttonType = "yesNo" //buttonType: 'yesNo' | 'okCancel' | 'yesNoCancel' | 'okOnly' = 'yesNo'  // Button type

      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {

        if (confirmed) {

          this.receiptService.deleteReceiptWithUserId(this.user.id, receipt.id).subscribe({
            next: result => {
              console.log(result);
              this.getAllVehicleReceipt(this.vehicle.id);
            }
          })

        } else {

          return;
        }
      });

    }

  }

  deleteVehicleClaim($event: any, claim: Claim) {



    console.log("deleteVehicleClaim" + claim.id);

    if (claim.purchaseOrders.length == 0 && claim.jobs.length == 0) {

      const customTitle = 'Remote Estimate [' + claim.notes + "] ";
      const message = 'Are you sure you want to remove this estimate?';
      const buttonType = "yesNo" // buttonType: 'yesNo' | 'okCancel' | 'okOnly' | 'yesNoCancel' = 'yesNo';  // Button type
      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed) {
          this.claimService.deleteClaimWithOption(claim.id, this.user.id, 1).subscribe({
            next: result => {
              console.log(result);
              this.getAllVehicleClaims(this.vehicle.id);

            }
          })
        } else {

        }
      });


    }

    if (claim.purchaseOrders.length > 0 || claim.jobs.length > 0) {

      const customTitle = 'Remote Estimate [' + claim.notes + "] ";
      var message = 'Are you sure you want to remove this estimate?';
      var message = "";
      message += "Remove "

      if (claim.purchaseOrders.length > 0)
        message += " [" + claim.purchaseOrders.length + "] puchase orders ";
      if (claim.jobs.length > 0)
        message += " [" + claim.jobs.length + "] job orders ";

      message += "at the same time ? "

      const buttonType = "yesNoCancel" // buttonType: 'yesNo' | 'okCancel' | 'okOnly' | 'yesNoCancel' = 'yesNo';  // Button type
      this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
        if (confirmed === undefined) {

          return;
        }

        if (confirmed) {

          this.claimService.deleteClaimWithOption(claim.id, this.user.id, 1).subscribe({
            next: result => {
              console.log(result);
              this.getAllVehicleClaims(this.vehicle.id);
              if (claim.jobs.length > 0) {
                this.getVehicleJobs2(this.vehicle.id);
              }
              if (claim.purchaseOrders.length > 0) {
                this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
                this.getAutopartForVehicle(this.vehicle.id, true);
              }

            }
          })

        } else {
          this.claimService.deleteClaimWithOption(claim.id, this.user.id, 0).subscribe({
            next: result => {
              console.log(result);
              this.getAllVehicleClaims(this.vehicle.id);

              if (claim.jobs.length > 0) {
                this.getVehicleJobs2(this.vehicle.id);
              }
              if (claim.purchaseOrders.length > 0) {
                this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
                this.getAutopartForVehicle(this.vehicle.id, true);
              }
            }
          })
        }
      });

    }

  }


  getNoteDetail(note: Note): void {
    this.note = note;
  }

  deleteNote(note: Note): void {

    this.noteService.deleteNoteWithUserId(this.user.id, note.id).subscribe({
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

  getEmpoloyeeJobPrice(employeeId: any): any {
    var total = 0;
    for (let employee of this.employees) {
      if (employee.id == employeeId) {
        if (employee.commissionBased == false)
          total = +((this.getVehicleRemaining(this.vehicle) * employee.rolePrecentage / 100).toFixed(0));
        else
          total = +((this.getTotalSupplements(this.vehicle) * employee.rolePrecentage / 100).toFixed(0));
      }
    }
    return total;
  }

  getEmpoloyeeJobPrecentage(employeeId: any): any {
    for (let employee of this.employees) {
      if (employee.id == employeeId) {
        if (employee.commissionBased == false)
          return employee.rolePrecentage + "%";
        else
          return employee.rolePrecentage + "% - Commission Based";
      }
    }
  }

  getEmpoloyeeJobRoleName(employeeId: any): any {
    for (let employee of this.employees) {
      if (employee.id == employeeId) {
        // if (employee.commissionBased == false)
        return employee.roleName;
        //  else
        //   return employee.roleName + " - Commission Based";
      }
    }
  }

  getEmpoloyeeJobStatus(employeeId: any): any {
    for (let employee of this.employees) {
      if (employee.id == employeeId) {
        return "[" + employee.jobCountsUnfinished + "/" + employee.jobCountsFinished + "/" + (employee.jobCountsUnfinished
          +
          employee.jobCountsFinished) + "]";
      }
    }
  }

  getSaleTax(vehicle: any): any {

    var total = 0;

    total = (vehicle.price + this.getTotalSupplements(vehicle)) * this.company.taxRate;
    total = +(total.toFixed(0));

    return total;

  }

  onChangeEmployee2Claim($event: any, employeeId: any, job: Job, claim: Claim) {

    job.employeeId = employeeId;
    job.reason = "assign";


    for (let employee of this.employees) {
      if (employee.id == employeeId) {
        if (employee.commissionBased == false) {

          if (job.claimId > 0) {
            job.price = +((claim.quantity * claim.amount * employee.rolePrecentage / 100).toFixed(0));
          } else {
            job.price = +((this.getVehicleRemaining(this.vehicle) * employee.rolePrecentage / 100).toFixed(0));
          }
        } else {
          //commisson based
          job.price = +((this.getTotalSupplements(this.vehicle) * employee.rolePrecentage / 100).toFixed(0));
        }
      }
    }

    console.log("onChangeEmployee2Claim");
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
        this.findAllCurrentEmplyeeJobs();

        if (this.currentEmplyeeId == employeeId) {
          this.getMyJobs(employeeId);
        }

        this.syncJob(this.job);
      }
    })

  }

  onChangeEmployee2($event: any, employeeId: any, job: Job) {

    job.employeeId = employeeId;
    job.reason = "assign";


    for (let employee of this.employees) {
      if (employee.id == employeeId) {
        if (employee.commissionBased == false) {
          job.price = +((this.getVehicleRemaining(this.vehicle) * employee.rolePrecentage / 100).toFixed(0));
        } else {
          //commisson based
          job.price = +((this.getTotalSupplements(this.vehicle) * employee.rolePrecentage / 100).toFixed(0));
        }
      }
    }

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

  displayStyle2 = "none";
  displayStyle3 = "1";

  closePopupYes(): void {
    this.displayStyle = "none";
    this.displayStyle2 = "visible";
    this.displayStyle3 = "1";


    console.log("archiveVehicle");
    this.vehicle.archived = true;
    this.vehicle.reason = "archive";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("archiveVehicle", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        this.searchVehicle(5, 0, this.pageSize);
      }
    })
  }

  closePopup(): void {
    this.displayStyle = "none";
    this.displayStyle2 = "visible";
    this.displayStyle3 = "1";
  }

  closePopupYesTargetDateReason(): void {

    if (this.vehicle.targetDateChangeReason == null || this.vehicle.targetDateChangeReason == '') {
      this.messageTargetDateReason = "Please provide a reason to change the target date to " + this.vehicle.targetDate;
      return;
    }

    this.displayStyleTargetReason = "none";
    this.displayStyle2 = "visible";
    this.displayStyle3 = "1";

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
    this.displayStyle2 = "visible";
    this.displayStyle3 = "1";
  }

  archiveVehicle(vehicle: Vehicle): void {
    this.displayStyle = "block";

    console.log("archiveVehicle");

    this.vehicle = vehicle;

    // const customTitle = 'Confirmation';
    // const message = 'Are you sure to archive it ?';

    // // Call the service to show the confirmation dialog and pass the callback
    // this.confirmationService.confirm(message, customTitle, (confirmed: boolean) => {
    //   if (confirmed) {
    //     this.vehicle.archived = true;
    //     this.vehicle.reason = "archive";
    //     this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
    //       next: result => {
    //         console.log("archiveVehicle", result);
    //         this.vehicle = result;
    //         this.vehicle.reason = "";
    //         this.searchVehicle(5, 0, this.pageSize);
    //       }
    //     })

    //   } else {
    //      return;
    //   }
    // });



    // if (window.confirm('Are you sure you want to archive this vehicle')) {

    //   this.vehicle.archived = true;
    //   this.vehicle.reason = "archive";
    //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
    //     next: result => {
    //       console.log("archiveVehicle", result);
    //       this.vehicle = result;
    //       this.vehicle.reason = "";
    //       this.searchVehicle(5);
    //     }
    //   })
    // }


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
    this.vehicle.reason = "key location";
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


  rememberMe(): void {
    localStorage.setItem('pageSize', "" + this.pageSize);
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
      vehicle.reason = "paid";
    else
      vehicle.reason = "unpaid";

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

      },
      error: (e) => console.error(e)
    });
  }


  searchVin2(): void {

    this.autopartService.getVin(this.vehicle.vin).subscribe({
      next: (res) => {
        console.log(res);
        this.autopart = res;
        // this.vehicle.year = this.autopart.year;
        // this.vehicle.make = this.autopart.make;
        //  this.vehicle.model = this.autopart.model;
        this.vehicle.description2 = this.autopart.year + " " + this.autopart.make + " " + this.autopart.model + ", " + this.autopart.description;

      },
      error: (e) => console.error(e)
    });
  }


  getVehicleTotalEstimates(vehicle: Vehicle): any {
    var total = 0;
    total = +vehicle.price + +(this.getTotalSupplements(vehicle));

    return total;

  }

  searchInputArchived: any = "";

  searchVehicleArchived(type: number, pageNumber: any, pageSize: any): void {

    this.searchType = type;

    this.errorMessage = "";
    this.successMessageVehicle = "";
    this.errorMessageVehicle = "";

    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    console.log(pageNumber);
    this.currantPageNumber = pageNumber;

    var archived = this.archived;

    if (type == 8 || type == 9) {
      archived = true;
    }

    const data = {
      type: type,
      year: this.vehicle.year,
      make: this.vehicle.make,
      model: this.vehicle.model,
      color: this.vehicle.color,
      archived: archived,
      companyId: this.user.companyId,
      partNumber: "placeholder",
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      lastName: this.searchInputArchived   // only when type == 6
    };

    console.log(data);

    this.pagesArray = new Array();


    this.vehicleService.searchByYearMakeModelColor(data).subscribe({
      next: (res) => {
        // console.log(res);

        if (type === 7) {
          this.vehiclesOriginal = res;
          for (let vehicle of this.vehiclesOriginal) {

            if (vehicle.supplymentPrice > 0 && vehicle.supplements?.length == 0) {

              console.log(vehicle);
              var supplement = new Supplement();
              supplement.name = "Change Me";
              supplement.description = "Change Me including dates";
              supplement.price = vehicle.supplymentPrice;
              supplement.userId = this.user.id;
              supplement.companyId = this.user.companyId;
              supplement.vehicleId = vehicle.id;

              this.supplementService.createSupplement(vehicle.id, supplement).subscribe({
                next: result => {
                  if (result != null) {
                    console.log(result);
                    vehicle.supplements?.unshift(result);
                  }
                }
              })
            }
          }
        } else {

          this.vehicles = res;
          this.vehicles = this.vehicles.sort((a: Vehicle, b: Vehicle) => a.sequenceNumber - b.sequenceNumber);

          // for (let i=0; i< this.vehicles.length; i++) {
          //   for (let vehicle2 of this.vehiclesOriginal) {
          //     if (vehicle2.pdfFiles.length > 0 && this.vehicles[i].id == vehicle2.id) {
          //       this.vehicles[i].pdfFiles = vehicle2.pdfFiles;
          //     }
          //   }
          // }
          if (this.vehicles.length == 0)
            this.message = "No Match Found!"
          else
            this.message = "[ " + this.vehicles.length + " ] found:"

          console.log("====", this.vehicles.length);
          //console.log("====", this.vehicles);

          if (type === 5 || type === 6 || 9) {
            if (this.vehicles.length > 0) {
              //this.searchCount = 0;
              this.searchCount = this.vehicles[0].searchCount;
              this.pagesArray = new Array();
              this.pages = this.searchCount / pageSize;

              for (let i = 1; i < this.pages + 1; i++) {
                this.pagesArray.push(i);
              }

              this.message = "found [ " + this.searchCount + " ] ";

              console.log("===searchCount = ", this.searchCount);
            }
          }

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

  hasColumnInfo(filedName: any): boolean {
    for (let columInfo of this.columnInfos) {
      if (columInfo.fieldName == filedName) {
        return true;
      }
    }
    return false;
  }

  columnSpanForHistories: any = 10;
  getColumnsSpan(): any {
    var total = 0;
    for (let columnInfo of this.columnInfos) {
      if (columnInfo.enabled) {
        total++;
      }
    }

    // this.columnSpanForHistories = total;
    return total;
  }

  searchVehicleSnapshot(type: number, pageNumber: any, pageSize: any, date: Date): void {

    this.searchType = type;

    this.errorMessage = "";
    this.successMessageVehicle = "";
    this.errorMessageVehicle = "";

    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    console.log(pageNumber);
    this.currantPageNumber = pageNumber;

    //console.log(" == " + this.currantPageNumber);
    var archived = this.archived;

    if (type == 8) {
      archived = true;
    }

    const data = {
      type: type,
      year: this.vehicle.year,
      make: this.vehicle.make,
      model: this.vehicle.model,
      color: this.vehicle.color,
      archived: archived,
      companyId: this.user.companyId,
      partNumber: "placeholder",
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      lastName: this.searchInput,   // only when type == 6
      date: date
    };

    console.log(data);

    this.pagesArray = new Array();


    this.vehicleService.searchByYearMakeModelColorSnapshot(data).subscribe({
      next: (res) => {
        // console.log(res);

        if (type === 7) {
          this.searchType = 5;
          this.vehiclesOriginal = res;
          //this.vehiclesOriginal = this.vehiclesOriginal.sort((a: Vehicle, b: Vehicle) => a.sequenceNumber - b.sequenceNumber);
          this.vehiclesOriginal = this.vehiclesOriginal.sort((a: Vehicle, b: Vehicle) => b.vehicleHistories.length - a.vehicleHistories.length);

          for (let filterOption of this.filterOptions) {
            filterOption.counts = 0;
          }

          if (this.vehiclesOriginal.length < this.pageSize) {
            this.vehicles = this.vehiclesOriginal;
            this.searchCount = this.vehicles.length;

            for (let vehicle of this.vehicles) {
              if (vehicle.make.includes(' '))
                vehicle.make = vehicle.make.replace(' ', '-');
              if (vehicle.vehicleHistories.length > 0) {
                this.setVehicleHistoryVariables(vehicle);
              }
            }


            // this.pagesArray = new Array();
            // this.pages = this.searchCount / pageSize;

            // for (let i = 1; i < this.pages + 1; i++) {
            //   this.pagesArray.push(i);
            // }

            // this.message = "found [ " + this.searchCount + " ] ";

            console.log("===searchCount = ", this.searchCount);
            //this.calendarKicker();

          } else {
            this.vehicles = this.vehiclesOriginal.slice(0, this.pageSize);
            this.searchCount = this.vehiclesOriginal.length;

            for (let vehicle of this.vehicles) {
              if (vehicle.make.includes(' '))
                vehicle.make = vehicle.make.replace(' ', '-');
              if (vehicle.vehicleHistories.length > 0) {
                this.setVehicleHistoryVariables(vehicle);
              }
            }

            //this.searchVehicle(5, 0, this.pageSize);
          }

          this.getStatusOverviewTotals();
          this.getJobRequestTypeOverviewTotals();
          this.getAssignedToOverviewTotals()

          for (let vehicle33 of this.vehiclesOriginal) {

            if (vehicle33.supplymentPrice > 0 && vehicle33.supplements?.length == 0) {
              var supplement = new Supplement();
              supplement.name = "Change Me";
              supplement.description = "Change Me including dates";
              supplement.price = vehicle33.supplymentPrice;
              supplement.userId = this.user.id;
              supplement.companyId = this.user.companyId;
              supplement.vehicleId = vehicle33.id;

              this.supplementService.createSupplement(vehicle33.id, supplement).subscribe({
                next: result => {
                  if (result != null) {
                    console.log(result);
                    vehicle33.supplements?.unshift(result);
                  }
                }
              })
            }
          }



          // for (let status of this.statuss2) {
          //   status.vehicles = new Array();
          //   for (let vehicle of this.vehiclesOriginal) {
          //     if (this.isInStatus(vehicle.status)) {
          //       if (vehicle.status == status.id) {
          //         status.vehicles.push(vehicle);
          //       }
          //     } else {
          //       status.vehicles.push(vehicle);
          //     }
          //   }
          //   //status.vehicles = status.vehicles.sort((a: Vehicle, b: Vehicle) => a.year - b.year);
          //   status.vehicles = status.vehicles.sort((a: Vehicle, b: Vehicle) => a['make'].localeCompare(b['make']));

          // }

        } else {

          this.vehicles = res;
          //this.vehicles = this.vehicles.sort((a: Vehicle, b: Vehicle) => a.sequenceNumber - b.sequenceNumber);

          // for (let i=0; i< this.vehicles.length; i++) {
          //   for (let vehicle2 of this.vehiclesOriginal) {
          //     if (vehicle2.pdfFiles.length > 0 && this.vehicles[i].id == vehicle2.id) {
          //       this.vehicles[i].pdfFiles = vehicle2.pdfFiles;
          //     }
          //   }
          // }
          if (this.vehicles.length == 0)
            this.message = "No Match Found!"
          else
            this.message = "[ " + this.vehicles.length + " ] found:"

          console.log("====", this.vehicles.length);
          //console.log("====", this.vehicles);

          if (type === 5 || type === 6) {
            if (this.vehicles.length > 0) {
              //this.searchCount = 0;
              this.searchCount = this.vehicles[0].searchCount;
              this.pagesArray = new Array();
              this.pages = this.searchCount / pageSize;

              for (let i = 1; i < this.pages + 1; i++) {
                this.pagesArray.push(i);
              }

              this.message = "found [ " + this.searchCount + " ] ";

              console.log("===searchCount = ", this.searchCount);
            }
          }

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

  searchVehicle(type: number, pageNumber: any, pageSize: any): void {

    this.searchType = type;

    this.errorMessage = "";
    this.successMessageVehicle = "";
    this.errorMessageVehicle = "";

    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    console.log(pageNumber);
    this.currantPageNumber = pageNumber;

    //console.log(" == " + this.currantPageNumber);
    var archived = this.archived;

    if (type == 8) {
      archived = true;
    }

    const data = {
      type: type,
      year: this.vehicle.year,
      make: this.vehicle.make,
      model: this.vehicle.model,
      color: this.vehicle.color,
      archived: archived,
      companyId: this.user.companyId,
      partNumber: "placeholder",
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      lastName: this.searchInput   // only when type == 6
    };

    console.log(data);

    this.pagesArray = new Array();


    this.vehicleService.searchByYearMakeModelColor(data).subscribe({
      next: (res) => {
        // console.log(res);

        if (type === 7) {
          this.searchType = 5;
          this.vehiclesOriginal = res;
          //this.vehiclesOriginal = this.vehiclesOriginal.sort((a: Vehicle, b: Vehicle) => a.sequenceNumber - b.sequenceNumber);

          if (this.vehiclesOriginal.length < this.pageSize) {
            this.vehicles = this.vehiclesOriginal;
            this.searchCount = this.vehicles.length;

            for (let vehicle of this.vehicles) {
              if (vehicle.make.includes(' '))
                vehicle.make = vehicle.make.replace(' ', '-');
            }


            // this.pagesArray = new Array();
            // this.pages = this.searchCount / pageSize;

            // for (let i = 1; i < this.pages + 1; i++) {
            //   this.pagesArray.push(i);
            // }

            // this.message = "found [ " + this.searchCount + " ] ";

            console.log("===searchCount = ", this.searchCount);
            //this.calendarKicker();

          } else {
            this.vehicles = this.vehiclesOriginal.slice(0, this.pageSize);
            this.searchCount = this.vehiclesOriginal.length;
            //this.searchVehicle(5, 0, this.pageSize);
          }

          this.getStatusOverviewTotals();
          this.getJobRequestTypeOverviewTotals();
          this.getAssignedToOverviewTotals()

          for (let vehicle33 of this.vehiclesOriginal) {

            if (vehicle33.supplymentPrice > 0 && vehicle33.supplements?.length == 0) {
              var supplement = new Supplement();
              supplement.name = "Change Me";
              supplement.description = "Change Me including dates";
              supplement.price = vehicle33.supplymentPrice;
              supplement.userId = this.user.id;
              supplement.companyId = this.user.companyId;
              supplement.vehicleId = vehicle33.id;

              this.supplementService.createSupplement(vehicle33.id, supplement).subscribe({
                next: result => {
                  if (result != null) {
                    console.log(result);
                    vehicle33.supplements?.unshift(result);
                  }
                }
              })
            }
          }



          // for (let status of this.statuss2) {
          //   status.vehicles = new Array();
          //   for (let vehicle of this.vehiclesOriginal) {
          //     if (this.isInStatus(vehicle.status)) {
          //       if (vehicle.status == status.id) {
          //         status.vehicles.push(vehicle);
          //       }
          //     } else {
          //       status.vehicles.push(vehicle);
          //     }
          //   }
          //   //status.vehicles = status.vehicles.sort((a: Vehicle, b: Vehicle) => a.year - b.year);
          //   status.vehicles = status.vehicles.sort((a: Vehicle, b: Vehicle) => a['make'].localeCompare(b['make']));

          // }

        } else {

          this.vehicles = res;
          //this.vehicles = this.vehicles.sort((a: Vehicle, b: Vehicle) => a.sequenceNumber - b.sequenceNumber);

          // for (let i=0; i< this.vehicles.length; i++) {
          //   for (let vehicle2 of this.vehiclesOriginal) {
          //     if (vehicle2.pdfFiles.length > 0 && this.vehicles[i].id == vehicle2.id) {
          //       this.vehicles[i].pdfFiles = vehicle2.pdfFiles;
          //     }
          //   }
          // }
          if (this.vehicles.length == 0)
            this.message = "No Match Found!"
          else
            this.message = "[ " + this.vehicles.length + " ] found:"

          console.log("====", this.vehicles.length);
          //console.log("====", this.vehicles);

          if (type === 5 || type === 6) {
            if (this.vehicles.length > 0) {
              //this.searchCount = 0;
              this.searchCount = this.vehicles[0].searchCount;
              this.pagesArray = new Array();
              this.pages = this.searchCount / pageSize;

              for (let i = 1; i < this.pages + 1; i++) {
                this.pagesArray.push(i);
              }

              this.message = "found [ " + this.searchCount + " ] ";

              console.log("===searchCount = ", this.searchCount);
            }
          }

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
    // for (let vehicle of this.vehicles) {
    for (let vehicle of this.vehiclesOriginal) {
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

    this.calendarOptions.events = events;

    // this.calendarOptions = {
    //   plugins: [dayGridPlugin],
    //   initialView: 'dayGridMonth',
    //   weekends: true,
    //   events: events,
    // };



  }

  getAllVehiclePurchaseOrderVehicles(vehicleId: any): void {

    // console.log("getAllVehicleReceipt")
    this.purchseOrderVehicleService.getAllVehiclePurchaseOrderVehicles(vehicleId).subscribe({
      next: result => {
        if (result) {
          this.purchaseOrders = result;
          this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          // console.log(this.receipts);
        } else {
          this.purchaseOrders = new Array();
        }

      }
    })
  }

  getAllVehicleClaims(vehicleId: any): void {

    // console.log("getAllVehicleReceipt")
    this.claimService.getAllVehicleClaims(vehicleId).subscribe({
      next: result => {
        if (result) {
          this.claims = result;
          this.claims = this.claims.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

          for (let claim of this.claims) {
            for (let itemType of this.itemTypes) {
              if (itemType.id == claim.itemType) {
                if (itemType.createJobOrder == true) {
                  claim.createJobOrder = true;
                }

                if (itemType.createPurchaseOrder == true) {
                  claim.createPurchaseOrder = true;
                }
              }
            }
          }
          // console.log(this.receipts);
        } else {
          this.claims = new Array();
        }

      }
    })
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

  getReceiptSubTotal(receipt: any): any {

    return +((receipt.quantity * receipt.amount).toFixed(2));
  }

  getClaimSubTotal(claim: any): any {

    return +((claim.quantity * claim.amount).toFixed(2));
  }

  createReceipt(): void {

    let receipt: Receipt = new Receipt();
    receipt.name = "change Me";
    receipt.userId = this.user.id;
    //receipt.amount = 0;
    receipt.quantity = 1;
    receipt.vehicleId = this.vehicle.id;
    receipt.notes = "";
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

  createClaim(itemTypeId: any): void {

    let claim: Claim = new Claim();
    claim.name = "change Me";
    claim.reason = "new";
    claim.userId = this.user.id;
    claim.itemType = itemTypeId;
    //claim.amount = 0;
    claim.quantity = 1;
    claim.vehicleId = this.vehicle.id;
    claim.notes = "";
    claim.itemNumber = this.randomString();
    claim.sequenceNumber = -1;

    this.claimService.createClaim(this.user.id, claim).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.claims.unshift(result);
          this.getAllVehicleReceipt(this.vehicle.id);
          //this.getAllVehicleClaim(this.vehicle.id);
        }
      }
    })

  }

  createClaimClaim(itemType: ItemType): void {

    let claim: Claim = new Claim();
    claim.name = "change Me";
    claim.reason = "new";
    claim.userId = this.user.id;
    claim.itemType = itemType.id;

    //claim.amount = 0;
    claim.quantity = 1;
    claim.vehicleId = this.vehicle.id;
    claim.notes = "";
    claim.itemNumber = this.randomString();
    claim.sequenceNumber = -1;

    this.claimService.createClaim(this.user.id, claim).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          // claim = result;
          // claim.createJobOrder = itemType.createJobOrder;
          // claim.createPurchaseOrder = itemType.createJobOrder;

          // this.claims.unshift(claim);
          this.getAllVehicleClaims(this.vehicle.id);
          this.getAllVehicleReceipt(this.vehicle.id);
        }
      }
    })

  }

  openUrl(url: string) {
    window.open(location.origin + "/#/" + url, "_blank");
  }

  printPage(componentId: string, title: any) {

    const elementImage = <HTMLElement>document.querySelector("[id='" + componentId + "']");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt?.document.write('<title>' + title + '</title>');
    WindowPrt?.document.write("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">")
    WindowPrt?.document.write("<link href=\"../styles.css\" rel=\"stylesheet\">")
    WindowPrt?.document.write('<style type=\"text/css\">body{background-color: white;}</style>');
    // WindowPrt?.document.write('<style type=\"text/css\">th{color: white;background: rgb(13, 173, 226);}</style>');
    WindowPrt?.document.write(elementImage.innerHTML);
    WindowPrt?.document.write('<script>onload = function() { window.print(); }</script>');
    WindowPrt?.document.close();
    WindowPrt?.focus();


  }

  printPageJob(componentId: string, title: any, job: Job) {
    this.job = job;

    setTimeout(function () {

      const elementImage = <HTMLElement>document.querySelector("[id='" + componentId + "']");
      const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt?.document.write('<title>' + title + '</title>');
      WindowPrt?.document.write("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">")
      WindowPrt?.document.write("<link href=\"../styles.css\" rel=\"stylesheet\">")
      WindowPrt?.document.write('<style type=\"text/css\">th{color: white;background: rgb(13, 173, 226);}</style>');
      WindowPrt?.document.write(elementImage.innerHTML);
      WindowPrt?.document.write('<script>onload = function() { window.print(); }</script>');
      WindowPrt?.document.close();
      WindowPrt?.focus();

    }, 100);

  }

  printPdf(componentId: any): void {

    const elementImage = <HTMLElement>document.querySelector("[id='" + componentId + "']");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt?.document.write('<title>Receipt</title>');
    WindowPrt?.document.write("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">")
    WindowPrt?.document.write("<link href=\"../styles.css\" rel=\"stylesheet\">")
    WindowPrt?.document.write('<style type=\"text/css\">th{color: white;background: rgb(13, 173, 226);}</style>');
    WindowPrt?.document.write(elementImage.innerHTML);
    //const doc = new jsPDF('l', 'pt', 'a4');
    // var html = htmlToPdfmake(WindowPrt!.document.documentElement.innerHTML);
    var html = htmlToPdfmake(elementImage.innerHTML, { tableAutoSize: false });
    // var html = htmlToPdfmake(  WindowPrt!.document.body.innerHTML); 
    // var html = htmlToPdfmake(  WindowPrt!.window.document.documentElement.innerHTML); 

    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

    const documentDefinition = { content: html };
    //pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(documentDefinition).download();

    //var options = { filename: 'my-file.pdf' };

    // var options = {
    //   margin: 1,
    //   filename: 'newfile.pdf',
    //   image: {
    //     type: 'jpeg',
    //     quality: '0.90',
    //   },
    //   html2canvas: {
    //     scale: 2
    //   },
    //   jsPDF: {
    //     unit: 'in',
    //     format: 'letter',
    //     orientation: 'portrait'
    //   }
    // };

    // html2pdf().set(options).from(elementImage).save();
    // const doc = new jsPDF('p', 'pt', 'letter');
    // doc.setFontSize(10);

    // doc.html(WindowPrt!.document.documentElement, {

    //   callback(rst) {
    //     rst.save('one.pdf');
    //   }
    // });

    // doc.html(WindowPrt!.document.documentElement, {
    //   callback(rst) {
    //     rst.save('one.pdf');
    //   },
    //   x: 10,
    //   y: 10
    // });

  }

  printPdf2(componentId: any): void {

    const elementImage = <HTMLElement>document.querySelector("[id='" + componentId + "']");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt?.document.write('<title>Receipt</title>');
    WindowPrt?.document.write("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">")
    WindowPrt?.document.write("<link href=\"../styles.css\" rel=\"stylesheet\">")
    WindowPrt?.document.write('<style type=\"text/css\">th{color: white;background: rgb(13, 173, 226);}</style>');
    WindowPrt?.document.write(elementImage.innerHTML);

    var doc = new jsPDF('p', 'pt', 'a4');
    // doc.internal.scaleFactor = 2.25;
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();

    // var domToPdf = require('dom-to-pdf');
    // var options = {
    //   filename: 'test.pdf'
    // };
    // domToPdf(elementImage.innerHTML, options, function (pdf: any) {
    //   console.log("");
    // });

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

    //var options = { filename: 'my-file.pdf' };

    // var options = {
    //   margin: 1,
    //   filename: 'newfile.pdf',
    //   image: {
    //     type: 'jpeg',
    //     quality: '0.90',
    //   },
    //   html2canvas: {
    //     scale: 2
    //   },
    //   jsPDF: {
    //     unit: 'in',
    //     format: 'letter',
    //     orientation: 'portrait'
    //   }
    // };

    // html2pdf().set(options).from(elementImage).save();
    // const doc = new jsPDF('p', 'pt', 'letter');
    // doc.setFontSize(10);

    // doc.html(WindowPrt!.document.documentElement, {

    //   callback(rst) {
    //     rst.save('one.pdf');
    //   }
    // });

    // doc.html(WindowPrt!.document.documentElement, {
    //   callback(rst) {
    //     rst.save('one.pdf');
    //   },
    //   x: 10,
    //   y: 10
    // });

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

        // for (let job of vehicle.jobs) {

        //   if (job.status == 0 && job.targetDate != null)

        //     event = {
        //       title: '#' + vehicle.id + ' ' + vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model,
        //       url: vehicle.id,
        //       background: background,
        //       description: job?.name + " => " + job?.notes,
        //       location: locationStr,
        //       days: vehicle.daysInShop,
        //       jobRequestType: jobRequestTypeStr,
        //       start: job?.targetDate
        //     };

        //   events.push(event);
        // }

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
    for (let vehicle of this.vehiclesOriginal) {
      //for (let vehicle of this.vehicles) {
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

  isInStatuss(status: any): boolean {
    if (status)
      return this.statuss.some(s => s.id === status);
    else
      return false;
  }

  isInJobRequestTypes(jobRequestTypeId: any): boolean {
    if (jobRequestTypeId)
      return this.jobRequestTypes.some(s => s.id === jobRequestTypeId);
    else
      return false;
  }

  isInEmployees(emplolyeeId: any): boolean {
    if (emplolyeeId)
      return this.employees.some(s => s.id === emplolyeeId);
    else
      return false;
  }

  isInLocations(locationId: any): boolean {
    return this.locations.some(s => s.id === locationId);
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
        console.log(result);
        this.statusOverview = result;
        // for (let statusoverview of this.statusOverview) {
        //   console.log(statusoverview.status);
        // }
        this.statusOverview = this.statusOverview.sort((a, b) => b.count - a.count);
        //this.getStatusOverviewTotals();
        // for(let status of this.statuss){
        //   for( let groupBy of this.statusOverview){
        //     if( status.id == groupBy.status){
        //       groupBy.sequenceNumber = status.sequenceNumber;
        //     }
        //   }
        // }
        // this.statusOverview = this.statusOverview.sort((a, b) => b.sequenceNumber - a.sequenceNumber);

      }, error: (e) => console.log(e)
    })
  }

  overviewTypeId: any = 0;

  showOverview(overviewTypeId: any): void {
    this.overviewTypeId = overviewTypeId;
  }

  getJobRequestTypeOverview(companyId: any): void {
    //console.log("getJobRequestTypeOverview");
    this.vehicleService.getJobRequestTypeOverview(companyId).subscribe({
      next: result => {
        console.log(result);
        this.jobRequestTypeOverview = result;
        this.jobRequestTypeOverview = this.jobRequestTypeOverview.sort((a, b) => b.count - a.count);

      }, error: (e) => console.log(e)
    })
  }

  getAssignedToOverview(companyId: any): void {
    //console.log("getJobRequestTypeOverview");
    this.vehicleService.getAssignedToOverview(companyId).subscribe({
      next: result => {
        console.log(result);
        this.assignedToOverview = result;
        this.assignedToOverview = this.assignedToOverview.sort((a, b) => b.count - a.count);

      }, error: (e) => console.log(e)
    })
  }

  getStatusOverviewTotals(): void {

    for (let groupBy of this.statusOverview) {
      groupBy.totals = 0;
    }

    for (let vehicle of this.vehiclesOriginal) {
      var total = 0;
      if (vehicle.price > 1)
        total = + vehicle.price;

      if (vehicle.supplements.length > 0) {
        for (let supplement of vehicle.supplements) {
          if (supplement.price > 1)
            total += supplement.price;
        }
      }

      for (let groupBy of this.statusOverview) {
        if (groupBy.status == vehicle.status) {
          groupBy.totals += total;
        }

      }
    }

    console.log(this.statusOverview);
  }

  getJobRequestTypeOverviewTotals(): void {

    for (let groupBy of this.jobRequestTypeOverview) {
      groupBy.totals = 0;
    }

    for (let vehicle of this.vehiclesOriginal) {
      var total = 0;
      if (vehicle.price > 1)
        total = + vehicle.price;

      if (vehicle.supplements.length > 0) {
        for (let supplement of vehicle.supplements) {
          if (supplement.price > 1)
            total += supplement.price;
        }
      }

      for (let groupBy of this.jobRequestTypeOverview) {
        if (groupBy.status == vehicle.jobRequestType) {
          groupBy.totals += total;
        }

      }
    }

    console.log(this.jobRequestTypeOverview);
  }

  getAssignedToOverviewTotals(): void {

    for (let groupBy of this.assignedToOverview) {
      groupBy.totals = 0;
    }

    for (let vehicle of this.vehiclesOriginal) {
      var total = 0;
      if (vehicle.price > 1)
        total = + vehicle.price;

      if (vehicle.supplements.length > 0) {
        for (let supplement of vehicle.supplements) {
          if (supplement.price > 1)
            total += supplement.price;
        }
      }

      for (let groupBy of this.assignedToOverview) {
        if (groupBy.status == vehicle.assignedTo) {
          groupBy.totals += total;
        }

      }
    }

    console.log(this.assignedToOverview);
  }

  getLocationOverview(companyId: any): void {
    console.log("getLocationOverview");
    this.vehicleService.getLocationOverview(companyId).subscribe({
      next: result => {
        console.log(result);
        this.locationOverview = result;
        this.locationOverview = this.locationOverview.sort((a, b) => b.count - a.count);
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
      comments: undefined,
      notes: "Please specify",
      imageModels: new Array(),
      startDate: undefined,
      status: 0,
      vehicleId: this.vehicle.id,
      jobRequestType: 0,
      paymentMethod: 0,
      sequenceNumber: 1,
      reason: "new"
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
      paymentMethodId: 0,
      reason: "new"
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

  addVehiclePaymentNew(): void {

    console.log("addVehiclePayment");
    var payment = {
      id: 0,
      name: "New Payment",
      notes: "",
      paymentTypeId: 0,
      vehicleId: this.vehicle.id,
      paymentStatusId: 0,
      paymentMethodId: 0,
      reason: "new"
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

  // getCompanyEmployee(companyId: any): void {

  //   this.employees = new Array();

  //   var employeeAssignUnassign: Employee = new Employee();
  //   employeeAssignUnassign.id = 0;
  //   employeeAssignUnassign.firstName = "Assign/UnAssign"
  //   employeeAssignUnassign.lastName = "";
  //   this.employees.push(employeeAssignUnassign);
  //   this.employeeService.getComponyEmployees(companyId).subscribe({
  //     next: result => {
  //       if (result) {

  //         this.employees.push(...result);
  //       }
  //     }
  //   })
  // }

  getCustomerDetail(customer: any, index: any): void {

    this.cindexCustomer = index;
    this.customer = customer;
    //  this.vehicle = new Vehicle();
    // this.vehicle.customer = new Customer();
    this.vehicle.customer = customer;
    this.clearCustomers();

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

  viewJobDoneOnly = false;

  toggleJob(): void {
    this.viewJobDoneOnly = !this.viewJobDoneOnly;
  }

  toggleClass(): void {
    const mainContent = document.querySelector('.main-content');
    const mainContent2 = document.querySelector('.reminders-box');

    if (mainContent) {
      mainContent.classList.toggle('my-fluid-col');
    }
    if (mainContent2) {
      //if (this.notes.length == 0)
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
  showVehicleListing: boolean = true;
  showSchedule: boolean = false;
  showLocationOverview: boolean = false;
  showVehicleGridview: boolean = false;

  showPanalNumber: number = 0;

  showSchedulePanel(): void {
    this.showSchedule = !this.showSchedule;
    if (this.showSchedule == true) {
      this.calendarKicker();
      this.fillCalendar();
    }
  }

  showPanel(showPanalNumber: number): void {

    this.showPanalNumber = showPanalNumber;
    if (this.showPanalNumber == 1 || this.showPanalNumber == 3) {
      this.calendarKicker();
      this.fillCalendar();
    }

    if (this.showPanalNumber == 4) {
      for (let status of this.statuss2) {
        status.vehicles = new Array();
        for (let vehicle of this.vehiclesOriginal) {
          if (this.isInStatus(vehicle.status)) {
            if (vehicle.status == status.id) {
              status.vehicles.push(vehicle);
            }
          } else {
            status.vehicles.push(vehicle);
          }
        }
        //status.vehicles = status.vehicles.sort((a: Vehicle, b: Vehicle) => a.year - b.year);
        status.vehicles = status.vehicles.sort((a: Vehicle, b: Vehicle) => a['make'].localeCompare(b['make']));

      }
    }

  }


  toggleDivs() {
    if (this.showPanalNumber == 5) {
      this.showVehicleListing = true;
      //this.editModeVehicle = false;
    } else {
      this.showVehicleListing = !this.showVehicleListing;
    }
  }

  showCardLayout: boolean = false;

  checkWindowWidth(): void {
    const windowWidth = this.renderer.parentNode(this.el.nativeElement).clientWidth;

    if (windowWidth < 767) {
      $('.reminders-box').addClass("reminders-toggle");
      $('.main-content').removeClass("my-fluid-col");
      //this.showCardLayout = true;
      this.showPanel(2);
    } else {
      this.showCardLayout = false;
      this.showPanel(0);
    }
  }

  reloadFromServer() {
    this.searchVehicle(5, 0, this.pageSize);

  }
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

  eventBusSub?: Subscription;

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

