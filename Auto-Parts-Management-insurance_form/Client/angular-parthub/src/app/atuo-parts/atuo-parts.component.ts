import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageModel } from '../models/imageModel.model';
import { Saveditem } from '../models/saveditem.model';
import { UserSatisticsResponse } from '../models/userSatisticsResponse.model';
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
// import { DOCUMENT } from '@angular/common';
// import { VehicleService } from '../_services/vehicle.service';
import { Customer } from '../models/customer.model';
// import { CompanyService } from '../_services/company.service';
// import { EmployeeService } from '../_services/employee.service';
import { Company } from '../models/company.model';
// import { Employee } from '../models/employee.model';
// import { ServiceService } from '../_services/service.service';
// import { Service } from '../models/service.model';
// import { Job } from '../models/job.model';
// import { JobService } from '../_services/job.service';
// import { GroupBy } from '../models/groupBy.model';
// import { CustomerService } from '../_services/custmer.service';
import { User } from '../models/user.model';
// import { VehicleHistoryService } from '../_services/vehicle.history.service';
// import { VehicleHistory } from '../models/vehicle.history.model';
import { Config } from '../models/config.model';
// import { Status } from '../models/status.model';
// import { StatusService } from '../_services/status.service';
// import { LocationService } from '../_services/location.service';
// import { Location } from '../models/location.model';
// import { PaymentStatus } from '../models/payment.status.model';
// import { PaymentStatusService } from '../_services/payment.status.service';
// import { JobRequestTypeService } from '../_services/job.request.type.service';
// import { JobRequestType } from '../models/job.request.type.model';
// import { PaymentMethodService } from '../_services/payment.method.service';
// import { PaymentMethod } from '../models/payment.method.model';
// import { ApprovalStatusService } from '../_services/approval.status.service';
// import { ApprovalStatus } from '../models/approval.status.model';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// import { SequenceCarrier } from '../models/sequence.carrier.model';
// import { PaymentTypeService } from '../_services/payment.type.service';
// import { PaymentType } from '../models/payment.type.model';
// import { PaymentService } from '../_services/payment.service';
// import { Payment } from '../models/payment.model';
// import { CalendarOptions } from '@fullcalendar/core';
// import { FullCalendarComponent } from '@fullcalendar/angular';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import { NoteService } from '../_services/note.service';
// import { Note } from '../models/note.model';
import { SettingService } from '../_services/setting.service';
import { Setting } from '../models/setting.model';
// import { EmployeeRole } from '../models/employee.role.model';
// import { ReceiptService } from '../_services/receipt.service';
// import { Receipt } from '../models/receipt.model';
// import { jsPDF } from "jspdf";
// import htmlToPdfmake from 'html-to-pdfmake';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// import { Insurancer } from '../models/insurancer.model';
// import { InTakeWay } from '../models/in.take.way.model';
// import { Rental } from '../models/rental.model';
// import { Disclaimer } from '../models/disclaimer.model';
import { AuthService } from '../_services/auth.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
// import { ChartConfiguration, ChartOptions, ChartType, ActiveElement, Chart, ChartData, ChartEvent, ChartDataset, } from "chart.js";
// import { ReportCarrier } from '../models/report.carrier.model';
import { JobCarrier } from '../models/job.carrier.model';
// import { EmployeeRoleService } from '../_services/employee.role.service';
import { ServiceTypeService } from '../_services/service.type.service';
import { ServiceProviderService } from '../_services/service.provider.service';
import { ServiceType } from '../models/service.type.model';
import { ServiceProvider } from '../models/service.provider.model';
import { RequestPart } from '../models/requestpart.model';
import { RequestpartService } from '../_services/requestpart.service';
import { ConfirmationService } from '../_services/confirmation.service';



@Component({
  selector: 'app-atuo-parts',
  templateUrl: './atuo-parts.component.html',
  styleUrls: ['./atuo-parts.component.css']
})
export class AtuoPartsComponent implements OnInit {

  serviceTypes: ServiceType[] = new Array();
  serviceType: ServiceType = new ServiceType();

  serviceProviders: ServiceProvider[] = new Array();
  serviceProvider: ServiceProvider = new ServiceProvider();

  selectedServiceProvider: any = new ServiceProvider();

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";

  currantPageNumber?: any = 0;
  searchCount?: any
  pageSize: number = 10;
  pages: number = 1;

  pagesArray: number[] = new Array();
  partNumber: any;

  forArchived: boolean = false;

  detailSelected: boolean = false;
  selectedAutopart: any = new AutoPart();

  selectedImage: any = 0;
  user: User = new User();

  imageModels: ImageModel[] = new Array();
  fileToUpload: any;
  imageUrl: any;

  currentImage?: ImageModel;

  users: User[] = new Array();

  carList: any = jsonData;

  carListStringList: Brand[] = new Array();

  currentMode?: string;

  savedItems: AutoPart[] = new Array();
  showSavedItems: boolean = false;
  optionsYear: string[] = new Array();
  optionsMake: string[] = new Array();

  optionsModel: string[] = new Array();


  autopartsSearch: AutoPart[] = new Array();
  autopartsSearchOriginal: AutoPart[] = new Array();

  currentUser: any;
  content: any;
  message?: any;
  selectedUserId?: any;
  cindex: number = 0;

  userSatisticsResponse?: UserSatisticsResponse;

  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/getImage';
  baseUrlResizeImage = this.config.baseUrl + '/getResize';
  optionsAutoparts: string[] = this.config.optionsAutoparts
  message1?: string;














  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // console.log(event.target.innerWidth);
  }

  currentDate = new Date();
  company: Company = new Company();

  companyDefaultTaxRate: any = 0;
  displayStyle = "none";
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

  setting: Setting = new Setting();

  step: any = 5;
  jobCompletedCount: any = 0;

  editModeCustomer: boolean = false;
  editModeVehicle: boolean = false;

  showAccordian: boolean = true;

  searchInput: any = "";


  archived: boolean = false;
  showIt: boolean = true;




  companies: Company[] = new Array();


  selectedEmployee: any;

  currentJobId: any;
  currentPaymentId: any;
  currentReceiptId: any;



  cindexCustomer: number = 0;
  cindexUserJob: number = 0;
  messageAlert: any;

  errorMessage: any = "";
  successMessage: any;

  successMessageVehicle: any;
  errorMessageVehicle: any;

  base64Image: any;

  vin: string = "";

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
    bussinessurl: null,
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
  autopart?: AutoPart;
  showSearchVin: boolean = false;
  currentEmplyeeId: any;
  vehicleJobsOnly: boolean = false;

  range: any = 8;
  rangeVehicle: any = 8;

  jobCarriers: JobCarrier[] = new Array();
  //currentUser: any;
  currentUserUser: User = new User();
  vehiclesStatus: Vehicle[] = new Array();
  //vehicle: Vehicle = new Vehicle();
  from: Date = new Date();
  to: Date = new Date();
  readonly colors2 = ['red', 'blue', 'green', 'yellow'];

  public lineChartLegend = true;

  year: any;
  //currentJobId: any;
  counter: number = 0;
  week: number = 0;





  constructor(private userService: UserService,
    private storageService: StorageService,
    private scrollService: ScrollService,
    // private employeeService: EmployeeService,
    private savedItemService: SavedItemService,
    private router: Router,
    // private route: ActivatedRoute,
    // private ref: ChangeDetectorRef,
    private autopartService: AutopartService,
    private serviceTypeService: ServiceTypeService,
    private serviceProviderService: ServiceProviderService,
    private settingService: SettingService,
    // private vehicleService: VehicleService,
    // private paymentService: PaymentService,
    private eventBusService: EventBusService,
    private el: ElementRef,
    // private elementRef: ElementRef,
    // private companyService: CompanyService,
    // private serviceService: ServiceService,
    // private customerService: CustomerService,
    // private vehicleHistoryService: VehicleHistoryService,
    // private statusService: StatusService,
    // private locationService: LocationService,
    // private paymentStatusService: PaymentStatusService,
    // private paymentMethodService: PaymentMethodService,
    // private paymentTypeService: PaymentTypeService,
    // private jobRequestTypeService: JobRequestTypeService,
    // private approvalStatusService: ApprovalStatusService,
    // private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    // private noteService: NoteService,
    // private receiptService: ReceiptService,
    private authService: AuthService,
    // private jobService: JobService,
    private requestpartService: RequestpartService,
    private confirmationService: ConfirmationService

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
  refresh(): void {

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 400);

  }

  getServiceComment(serviceTypeId: any): string {


    for (let serviecType of this.serviceTypes) {
      if (serviecType.id == serviceTypeId) {
        return serviecType.comments + "";
      }
    }
    return "";
  }


  onChangeServiceType($event: any): void {

    var serviceTypeId = $event.target.value;
    for (let serviecType of this.serviceTypes) {
      if (serviecType.id == serviceTypeId) {
        this.serviceProvider.name = serviecType.name + " (Please Change Accordingly)";
        //this.serviceProvider.serviceDescription = serviecType.comments;
      }
    }

  }


  ngOnInit(): void {

    this.checkWindowWidth();
    this.userService.getUserBoard().subscribe({
      next: data => {
        this.content = data;
        this.currentUser = this.storageService.getUser();
        if (this.currentUser != null)
          this.getUserById(this.currentUser.id);
        this.selectedUserId = this.currentUser.id;
        // this.getAllFromUserSatistics(this.currentUser.id);
        // this.applyFilter2("2", false, 0, this.pageSize);
        // this.applyFilter("2", false);
        this.carListStringList = this.carList as Brand[];
        //this.getAllFromUser(this.currentUser.id);
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

    this.userService.getPublicContent().subscribe({
      next: data => {
        // this.content = data;
        this.currentUser = this.storageService.getUser();

        if (this.currentUser == null)
          this.router.navigate(['/login']);

        this.getCurrentUserFromUser(this.currentUser.id);
        //  this.getAllUsers();
        //  this.getAllCompany();

        if (localStorage.getItem('pageSizeMarketAdmin') != null) {

          var pageSize = localStorage.getItem('pageSizeMarketAdmin');
          //console.log(pageSize);

          if (pageSize != null)
            this.pageSize = + pageSize;
        } else {
          this.pageSize = 20;
        }

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
            this.form.bussinessurl = this.currentUser.bussinessUrl;

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


  // locations = [
  //   { name: "Front", value: 1 },
  //   { name: "Rear", value: 2 },
  //   { name: "Left", value: 3 },
  //   { name: "Right", value: 4 },
  //   { name: "Left Upper", value: 5 },
  //   { name: "Left Lower", value: 6 },

  //   { name: "Right Upper", value: 7 },
  //   { name: "Right Lower", value: 8 },
  //   { name: "Front Left Lower", value: 9 },
  //   { name: "Front Left Upper", value: 10 },
  //   { name: "Rear Left Lower", value: 11 },
  //   { name: "Rear Left Upper", value: 12 },
  //   { name: "Front Right Lower", value: 13 },
  //   { name: "Front Right Upper", value: 14 },
  //   { name: "Rear Right Lower", value: 15 },
  //   { name: "Rear Right Upper", value: 16 },
  // ];

  locations = [
    { name: "Front", value: 1 },
    { name: "Rear", value: 2 },
    { name: "Left", value: 3 },
    { name: "Right", value: 4 },
  
    { name: "Front Upper", value: 5 },
    { name: "Front Lower", value: 6 },
    { name: "Front Left", value: 7 },
    { name: "Front Right", value: 8 },
    { name: "Front Left Upper", value: 9 },
    { name: "Front Left Lower", value: 10 },
    { name: "Front Right Upper", value: 11 },
    { name: "Front Right Lower", value: 12 },
    { name: "Front Center", value: 13 },
  
    { name: "Rear Upper", value: 14 },
    { name: "Rear Lower", value: 15 },
    { name: "Rear Left", value: 16 },
    { name: "Rear Right", value: 17 },
    { name: "Rear Left Upper", value: 18 },
    { name: "Rear Left Lower", value: 19 },
    { name: "Rear Right Upper", value: 20 },
    { name: "Rear Right Lower", value: 21 },
    { name: "Rear Center", value: 22 },
  
    { name: "Left Upper", value: 23 },
    { name: "Left Lower", value: 24 },
    { name: "Left Inner", value: 25 },
    { name: "Left Outer", value: 26 },
  
    { name: "Right Upper", value: 27 },
    { name: "Right Lower", value: 28 },
    { name: "Right Inner", value: 29 },
    { name: "Right Outer", value: 30 }
  ];

  getUserById(userId: any): void {

    this.userService.getUserById(userId).subscribe({
      next: result => {
        //console.log(result);
        this.user = result;

        if (this.user.partMarketOnly == true) {
          //this.toggleClass();
          $('.reminders-box').addClass("reminders-toggle");
          $('.main-content').removeClass("my-fluid-col");
        }

        if (this.user.partMarketOnly == true)
          this.getAllFromUserSatistics2(this.user.id);
        else
          this.getAllFromUserSatistics(this.user.companyId);


        this.applyFilter2("2", false, 0, this.pageSize);

        // this.applyFilterRequestpart("2", false, 0, this.pageSize);


        //this.getAllComponyEmployees(this.user.companyId);
        this.getAllComponyUsers(this.user.companyId);
        this.getSavedItems();

        if (this.user.partMarketOnly == true) {
          this.getServiceProvidersUser(this.user.id);
        } else {
          this.getServiceProviders(this.user.companyId);
        }

        this.getServiceTypes();
      }
    })
  }

  getServiceProvidersUser(userId: any): void {
    // console.log("getServiceProviders");
    this.serviceProviderService.getAllServiceProviderUser(userId).subscribe({
      next: result => {
        // console.log(result);
        this.serviceProviders = result;
      }
    })
  }

  getServiceProviders(companyId: any): void {
    //console.log("getServiceProviders");
    this.serviceProviderService.getAllServiceProvider(companyId).subscribe({
      next: result => {
        // console.log(result);
        this.serviceProviders = result;
      }
    })
  }

  getServiceTypes(): void {

    // console.log("getServiceTypes");
    this.serviceTypeService.getAllServiceType().subscribe({
      next: result => {
        // console.log(result);
        this.serviceTypes = result;
      }
    })

  }

  onChange($event: any, make: string) {

    // console.log(" onChange ");
    //this.carListStringList = this.carList as Brand[];
    for (var i = 0; i < this.carListStringList.length; i++) {

      if (this.carListStringList[i].brand == make) {
        this.optionsModel = this.carListStringList[i].models;
      }

    }

  }

  navigateToHome(path: any, showPostForm: boolean) {

    this.router.navigate(['/' + path],

      { skipLocationChange: true });

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

  setImage(index: any): void {

    this.selectedImage = this.selectedAutopart.imageModels[index].id;
  }

  getAllFromUserSatistics2(userId: any): void {

    //  console.log("getAllFromUserSatistics2");
    this.userSatisticsResponse = new UserSatisticsResponse();

    this.autopartService.getAllFromUserSatistics2(userId).subscribe({
      next: (result) => {

        this.userSatisticsResponse = result;
        // console.log("====", this.userSatisticsResponse);

      }
    });
  }


  getAllFromUserSatistics(userId: any): void {

    console.log("getAllFromUserSatistics");
    this.userSatisticsResponse = new UserSatisticsResponse();

    this.autopartService.getAllFromUserSatistics(userId).subscribe({
      next: (result) => {

        this.userSatisticsResponse = result;
        console.log("====", this.userSatisticsResponse);

      }
    });
  }

  getAllFromUser(userId: any): void {

    console.log("getAllFromUser");
    this.autopartService.getAllFromUser(userId).subscribe({
      next: (result) => {

        //console.log(result);
        this.autopartsSearch = result;
        //this.autopartsSearchOriginal = result;
        //this.autopartsSearch = this.autopartsSearchOriginal.filter(autopart => autopart.published === true);
        //this.autopartsSearch = result.filter(autopart => autopart.published === false);
        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found"
        else
          this.message = "( " + this.autopartsSearch.length + " ) "

        console.log("====", this.autopartsSearch.length);
        //console.log("====", this.autopartsSearch);

      }
    });
  }


  getAllComponyUsers(companyId: any): void {

    this.userService.getAllCompanyUsers(companyId).subscribe({
      next: result => {
        this.users = result;
      }
    });
  }

  searchAllWithPage(pageNumber: any, pageSize: any, archived: boolean): void {

    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    this.currantPageNumber = pageNumber;

    if (this.partNumber == null || this.partNumber == "")
      return;
    // this.modeNumber = modelNumber;


    const data = {
      year: 0,
      make: "",
      model: "",
      partName: this.partNumber,
      partNumber: this.partNumber,
      status: 2,
      companyId: this.user.companyId,
      userId: this.user.id,
      published: true,
      // zipcode: this.zipcode,
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      archived: archived
    };
    this.detailSelected = false;
    //this.showPostForm = false;
    this.pagesArray = new Array();
    this.searchCount = 0;

    if (this.user.partMarketOnly) {
      this.autopartService.searchAllWithPageUser(data).subscribe({
        next: (res) => {
          console.log(res);
          this.autopartsSearch = res;
          if (this.autopartsSearch.length > 0) {
            this.searchCount = this.autopartsSearch[0].searchCount;
          }

          this.pages = this.searchCount / pageSize;

          for (let i = 1; i < this.pages + 1; i++) {
            this.pagesArray.push(i);
          }

          if (this.autopartsSearch.length == 0)
            this.message = "No Match Found!"
          else {
            if (this.forArchived == true)
              this.message = "[" + this.partNumber + "] Found ( " + this.searchCount + " ) in Archived";
            else
              this.message = "[" + this.partNumber + "] Found ( " + this.searchCount + " ) in Listed";
          }

          console.log("===searchCount = ", this.searchCount);
          console.log("====", this.autopartsSearch.length);
          console.log("====", this.autopartsSearch);
        },
        error: (e) => {
          console.log("No Match Found");
          this.message = e.error.message;
          this.message = "No Match Found!"
          console.error(e);
        }

      },
      );

    } else {
      this.autopartService.searchAllWithPage(data).subscribe({
        next: (res) => {
          console.log(res);
          this.autopartsSearch = res;
          if (this.autopartsSearch.length > 0) {
            this.searchCount = this.autopartsSearch[0].searchCount;
          }

          this.pages = this.searchCount / pageSize;

          for (let i = 1; i < this.pages + 1; i++) {
            this.pagesArray.push(i);
          }

          if (this.autopartsSearch.length == 0)
            this.message = "No Match Found!"
          else {
            if (this.forArchived == true)
              this.message = "[" + this.partNumber + "] Found ( " + this.searchCount + " ) in Archived";
            else
              this.message = "[" + this.partNumber + "] Found ( " + this.searchCount + " ) in Listed";
          }

          console.log("===searchCount = ", this.searchCount);
          console.log("====", this.autopartsSearch.length);
          console.log("====", this.autopartsSearch);
        },
        error: (e) => {
          console.log("No Match Found");
          this.message = e.error.message;
          this.message = "No Match Found!"
          console.error(e);
        }

      },
      );
    }
  }


  searchPartNumber(pageNumber: any, pageSize: any, modelNumber: any): void {

    this.currantPageNumber = pageNumber;

    if (this.partNumber == null || this.partNumber == "")
      return;
    // this.modeNumber = modelNumber;

    const data = {
      year: 0,
      make: "",
      model: "",
      partName: "",
      partNumber: this.partNumber,
      // zipcode: this.zipcode,
      pageNumber: pageNumber,
      pageSize: pageSize,
      mode: modelNumber
    };
    this.detailSelected = false;
    //this.showPostForm = false;
    this.pagesArray = new Array();
    this.searchCount = 0;

    this.autopartService.searchPartNumberWithPage(data).subscribe({
      next: (res) => {
        console.log(res);
        this.autopartsSearch = res;
        if (this.autopartsSearch.length > 0) {
          this.searchCount = this.autopartsSearch[0].searchCount;
        }

        this.pages = this.searchCount / pageSize;

        for (let i = 1; i < this.pages + 1; i++) {
          this.pagesArray.push(i);
        }

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"
        else
          this.message = "Found [ " + this.searchCount + " ]";

        console.log("===searchCount = ", this.searchCount);
        console.log("====", this.autopartsSearch.length);
        console.log("====", this.autopartsSearch);
      },
      error: (e) => {
        console.log("No Match Found");
        this.message = e.error.message;
        this.message = "No Match Found!"
        console.error(e);
      }

    },
    );
  }

  requestpartsSearch: RequestPart[] = new Array();

  applyFilterRequestpart(condition: string, archived: boolean, pageNumber: any, pageSize: any): void {

    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    this.detailSelected = false;

    this.showSavedItems = false;

    this.sbowServiceProvider = false;

    //this.viewMode = 3;

    // console.log(" applyFilterRequestpart ", condition);
    this.currantPageNumber = pageNumber;
    this.forArchived = archived;

    this.pagesArray = new Array();
    if (archived == true)
      this.message = "Archived ";
    else
      this.message = "Listed ";

    var data = {
      companyId: this.user.companyId,
      status: condition,
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      archived: archived,
      published: true,
      userId: this.user.id

    }

    this.requestpartService.getAllFromCompany(data).subscribe({
      next: (result) => {

        this.requestpartsSearch = result;

        if (this.requestpartsSearch.length == 0)
          this.message = "No Match Found!"



        //console.log("====", this.requestpartsSearch.length);

        if (this.requestpartsSearch.length > 0) {
          //this.searchCount = 0;
          this.searchCount = this.requestpartsSearch[0].searchCount;
          this.message = "Request Parts ( " + this.searchCount + " ) "
          this.pagesArray = new Array();
          this.pages = this.searchCount / pageSize;

          for (let i = 1; i < this.pages + 1; i++) {
            this.pagesArray.push(i);
          }
        }
      }
    });

    // this.ref.detectChanges();
  }

  applyFilter2(condition: string, archived: boolean, pageNumber: any, pageSize: any): void {

    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    this.detailSelected = false;

    this.showSavedItems = false;

    this.sbowServiceProvider = false;

    this.viewMode = 0;

    // console.log(" applyFilter ", condition);
    this.currantPageNumber = pageNumber;
    this.forArchived = archived;

    this.pagesArray = new Array();
    if (archived == true)
      this.message = "Archived ";
    else
      this.message = "Listed ";

    var data = {
      companyId: this.user.companyId,
      status: condition,
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      archived: archived,
      published: true,
      userId: this.user.id

    }

    this.autopartService.getAllFromCompany(data).subscribe({
      next: (result) => {

        this.autopartsSearch = result;

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"



        //   console.log("====", this.autopartsSearch.length);

        if (this.autopartsSearch.length > 0) {
          //this.searchCount = 0;
          this.searchCount = this.autopartsSearch[0].searchCount;
          this.message = this.message + "( " + this.searchCount + " ) "
          this.pagesArray = new Array();
          this.pages = this.searchCount / pageSize;

          for (let i = 1; i < this.pages + 1; i++) {
            this.pagesArray.push(i);
          }
        }
      }
    });

    // this.ref.detectChanges();
  }

  applyFilter(condition: string, archived: boolean): void {

    console.log(" applyFilter ", condition);

    if (archived == true)
      this.message = "Archived ";
    else
      this.message = "Listed ";

    // if (condition == "Published")
    //   this.autopartsSearch = this.autopartsSearch.filter(autopart => autopart.status === 1);
    // if (condition == "NotPublished")
    //   this.autopartsSearch = this.autopartsSearch.filter(autopart => autopart.status === 0);
    // if (condition == "Archived")
    //   this.autopartsSearch = this.autopartsSearch.filter(autopart => autopart.status === 2);
    // this.message = "";
    // if (condition == "2")
    //   this.message = "Listed "
    // // if (condition == "0")
    // //   this.message = "Not Published "
    // if (condition == "2")
    //   this.message = "Archived "
    //  this.autopartService.getAllFromUserWithStatus(this.currentUser.id, condition).subscribe({
    this.autopartService.getAllFromUserWithStatus(this.user.companyId, condition, archived).subscribe({
      next: (result) => {

        this.autopartsSearch = result;

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"
        else
          this.message = this.message + "[ " + this.autopartsSearch.length + " ] "

        console.log("====", this.autopartsSearch.length);

      }
    });


  }

  //one way ticket
  setAutopartViewCount(autopartId: any): void {

    this.autopartService.setAutopartViewCount(autopartId).subscribe({
      next: result => {

      }
    })
  }

  detailSelectedServiceProvider: boolean = false;

  editServiceProvider(serviceProvider: ServiceProvider, index: any): void {

    this.cindex = index;
    this.selectedServiceProvider = serviceProvider;
    this.serviceProvider = serviceProvider;
    this.detailSelectedServiceProvider = true;

    //this.setAutopartViewCount(autoPart.id);

  }

  editAutopart(autoPart: AutoPart, index: any): void {

    this.cindex = index;
    this.selectedAutopart = autoPart;
    this.detailSelected = true;
    this.selectedImage = this.selectedAutopart.showInSearchImageId;
    this.setAutopartViewCount(autoPart.id);

    for (var i = 0; i < this.carListStringList.length; i++) {

      if (this.carListStringList[i].brand == this.selectedAutopart.make) {
        this.optionsModel = this.carListStringList[i].models;
      }

    }


  }

  rememberMePageSize(): void {
    localStorage.setItem('pageSizeMarketAdmin', "" + this.pageSize);
  }


  AddNewAutopart(): void {


    this.selectedAutopart = new AutoPart();
    this.selectedAutopart.id = 0;
    this.selectedAutopart.year = undefined;
    this.selectedAutopart.stocknumber = this.randomString();
    this.detailSelected = true;
    this.message1 = "";
    this.errorMessage = "";
  }

  messageServiceProvider: any = "";

  AddNewServiceProvider(): void {


    this.serviceProvider = new ServiceProvider();
    this.serviceProvider.state = undefined;
    // this.selectedAutopart.id = 0;
    // this.selectedAutopart.year = undefined;
    // this.selectedAutopart.stockNumber = this.randomString();
    this.detailSelected = true;
    this.message1 = "";
    this.errorMessage = "";
    this.messageServiceProvider = "";
  }

  requestpart: RequestPart = new RequestPart();
  errorMessageRequestpart = "";

  AddNewRequestpart(): void {


    this.requestpart = new RequestPart();
    //this.serviceProvider.state = undefined;
    // this.selectedAutopart.id = 0;
    this.requestpart.year = undefined;
    // this.selectedAutopart.stockNumber = this.randomString();
    this.detailSelected = true;
    this.message1 = "";
    this.errorMessage = "";
    this.messageServiceProvider = "";
    this.errorMessageRequestpart = "";

  }

  isValidPhone(phone: any) {

    var re = /^[0-9]{10}$|^[0-9]{12}$|^\d{10}-\d+$/;
    console.log("=================== " + phone + " : " + re.test(phone));
    return re.test(phone);

  }

  isValid(email: any) {
    //var re = /(^[0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*)_@([0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*\.[0-9a-zA-Z]{2,3})$/;


    var re = /^[a-zA-Z0-9]+(?:[_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[_.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,3}$/;
    //var re = new RegExp("^[a-zA-Z0-9][-\._a-zA-Z0-9]*@[a-zA-Z0-9][-\.a-zA-Z0-9]*\.(com|edu|info|gov|int|mil|net|org|biz|name|museum|coop|aero|pro|tv|[a-zA-Z]{2,6})$");
    //var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  isValidUrl(url: any) {

    var re = /^((http|https|ftp|www):\/\/)?([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]*)(\.)([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]+)/g;
    return re.test(String(url).toLowerCase());
  }

  createServiceProvider(serviceProvider: ServiceProvider): void {

    serviceProvider.companyId = this.user.companyId;

    if (
      serviceProvider.serviceTypeId == null || serviceProvider.serviceTypeId == 0 ||
      serviceProvider.name == null || serviceProvider.name == '' ||
      serviceProvider.serviceDescription == null || serviceProvider.serviceDescription == '' ||
      // serviceProvider.url == null || serviceProvider.url == '' ||
      serviceProvider.contactFirstName == null || serviceProvider.contactFirstName == '' ||
      serviceProvider.contactLastName == null || serviceProvider.contactLastName == '' ||
      serviceProvider.email == null || serviceProvider.email == '' ||
      serviceProvider.phone == null || serviceProvider.phone == '' ||

      serviceProvider.street == null || serviceProvider.street == '' ||
      serviceProvider.city == null || serviceProvider.city == '' ||
      serviceProvider.state == null || serviceProvider.state == '' ||
      serviceProvider.zip == null || serviceProvider.zip == ''

    ) {

      this.messageServiceProvider = "Service Provider's service type, name, description, contact first/last name, email and phone, street, city, state, zip are required";
      return;
    }

    if (serviceProvider.serviceTypeId == 0) {

      this.messageServiceProvider = "Service Type is required";
      return;
    }


    if (serviceProvider.contactFirstName != null && serviceProvider.contactFirstName != '' && serviceProvider.contactFirstName.length > 255) {

      this.messageServiceProvider = "Service Provider Contact First Name is too long";
      return;
    }

    if (serviceProvider.contactFirstName != null && serviceProvider.contactFirstName != '' && serviceProvider.contactFirstName.length < 2) {

      this.messageServiceProvider = "Service Provider Contact First Name is too short";
      return;
    }


    if (serviceProvider.contactLastName != null && serviceProvider.contactLastName != '' && serviceProvider.contactLastName.length > 255) {

      this.messageServiceProvider = "Service Provider Contact Last Name is too long";
      return;
    }

    if (serviceProvider.contactLastName != null && serviceProvider.contactLastName != '' && serviceProvider.contactLastName.length < 2) {

      this.messageServiceProvider = "Service Provider Contact Last Name is too short";
      return;
    }


    if (serviceProvider.name != null && serviceProvider.name != '' && serviceProvider.name.length > 255) {

      this.messageServiceProvider = "Service Provider Name is too long";
      return;
    }

    if (serviceProvider.name != null && serviceProvider.name != '' && serviceProvider.name.length < 2) {

      this.messageServiceProvider = "Service Provider Name is too short";
      return;
    }

    if (serviceProvider.serviceDescription != null && serviceProvider.serviceDescription != '' && serviceProvider.serviceDescription.length > 2000) {

      this.messageServiceProvider = "Service Provider Description is too long";
      return;
    }

    if (serviceProvider.serviceDescription != null && serviceProvider.serviceDescription != '' && serviceProvider.serviceDescription.length < 2) {

      this.messageServiceProvider = "Service Provider Description is too short";
      return;
    }


    if (serviceProvider.notes != null && serviceProvider.notes != '' && serviceProvider.notes.length > 255) {

      this.messageServiceProvider = "Service Provider Comments are too long";
      return;
    }

    if (serviceProvider.email != null && serviceProvider.email != '' && serviceProvider.email.length < 255 && this.isValid(serviceProvider.email) == false) {
      this.messageServiceProvider = "Please enter an valid email";
      return;
    }


    if (serviceProvider.url != null && serviceProvider.url != '' && serviceProvider.url.length < 255 && this.isValidUrl(serviceProvider.url) == false) {
      this.messageServiceProvider = "Please enter an valid URL like http://www.google.com or www.google.com";
      return;
    }


    if (serviceProvider.email != null && serviceProvider.email != '')
      serviceProvider.email = serviceProvider.email.trim();


    if (serviceProvider.email != null && serviceProvider.email != '' && serviceProvider.email.length > 255) {
      this.messageServiceProvider = "Email is too long, please enter an valid email";
      return;
    }

    if (serviceProvider.url != null && serviceProvider.url != '' && serviceProvider.url.length > 255) {
      this.messageServiceProvider = "URL is too long, please enter an valid URL";
      return;
    }

    if (serviceProvider.phone != null && serviceProvider.phone != '' && serviceProvider.phone.length > 20) {
      this.messageServiceProvider = "Phone Number is too long, please enter an valid phone number";
      return;
    }

    if (serviceProvider.phone2 != null && serviceProvider.phone2 != '' && serviceProvider.phone2.length > 20) {
      this.messageServiceProvider = "Phone Number 2 is too long, please enter an valid phone number";
      return;
    }

    if (serviceProvider.phone3 != null && serviceProvider.phone3 != '' && serviceProvider.phone3.length > 20) {
      this.messageServiceProvider = "Phone Number 3 is too long, please enter an valid phone number";
      return;
    }

    if (serviceProvider.phone != null && serviceProvider.phone != '' && ("" + serviceProvider.phone).length < 20 && this.isValidPhone(serviceProvider.phone) == false) {
      this.messageServiceProvider = "Phone Number is not valid";
      return;
    }

    if (serviceProvider.phone2 != null && serviceProvider.phone2 != '' && ("" + serviceProvider.phone2).length < 20 && this.isValidPhone(serviceProvider.phone2) == false) {
      this.messageServiceProvider = "Phone Number 2 is not valide";
      return;
    }

    if (serviceProvider.phone3 != null && serviceProvider.phone3 != '' && ("" + serviceProvider.phone3).length < 20 && this.isValidPhone(serviceProvider.phone3) == false) {
      this.messageServiceProvider = "Phone Number 3 is not valid";
      return;
    }

    if (serviceProvider.phone != null && serviceProvider.phone != '' && serviceProvider.phone.length < 20 &&
      serviceProvider.phone2 != null && serviceProvider.phone2 != '' && serviceProvider.phone2.length < 20 && serviceProvider.phone == serviceProvider.phone2) {
      this.messageServiceProvider = "Phone and Phone 2 are the same number";
      return;
    }

    if (serviceProvider.phone3 != null && serviceProvider.phone3 != '' && serviceProvider.phone3.length < 20 &&
      serviceProvider.phone2 != null && serviceProvider.phone2 != '' && serviceProvider.phone2.length < 20 && serviceProvider.phone3 == serviceProvider.phone2) {
      this.messageServiceProvider = "Phone 2 and Phone 3 are the same number";
      return;
    }

    if (serviceProvider.phone != null && serviceProvider.phone != '' && serviceProvider.phone.length < 20 &&
      serviceProvider.phone3 != null && serviceProvider.phone3 != '' && serviceProvider.phone3.length < 20 && serviceProvider.phone == serviceProvider.phone3) {
      this.messageServiceProvider = "Phone and Phone 3 are the same number";
      return;
    }

    if (serviceProvider.street != null && serviceProvider.street != '' && serviceProvider.street.length > 200) {
      this.messageServiceProvider = "Street is too long";
      return;
    }

    if (serviceProvider.street != null && serviceProvider.street != '' && serviceProvider.street.length < 2) {
      this.messageServiceProvider = "Street is too short";
      return;
    }


    if (serviceProvider.city != null && serviceProvider.city != '' && serviceProvider.city.length > 200) {
      this.messageServiceProvider = "City is too long";
      return;
    }

    if (serviceProvider.city != null && serviceProvider.city != '' && serviceProvider.city.length < 2) {
      this.messageServiceProvider = "City is too short";
      return;
    }

    if (serviceProvider.zip != null && serviceProvider.zip != '' && serviceProvider.zip.length > 20) {
      this.messageServiceProvider = "Zip is too long";
      return;
    }

    if (serviceProvider.zip != null && serviceProvider.zip != '' && serviceProvider.zip.length < 5) {
      this.messageServiceProvider = "Zip is too short";
      return;
    }

    var newEntry: boolean = false;
    if (serviceProvider.id == null || serviceProvider.id == 0)
      newEntry = true;

    this.serviceProviderService.createUpdateServiceProvider(this.currentUser.id, serviceProvider).subscribe({
      next: result => {
        this.serviceProvider = result;
        if (newEntry == true)
          this.messageServiceProvider = "Successfully Created";
        else
          this.messageServiceProvider = "Successfully Updated";

        this.getServiceProviders(this.user.companyId);
      }, error: err => {
        this.messageServiceProvider = err.error.message;

      }
    })
  }


  deleteServiceProvider(serviceProvider: ServiceProvider): void {

    var customTitle = "";
    var message = "";
    customTitle = 'Delete Service Provider';
    message = 'Are you sure to delete this service provider ?';

    const buttonType = "yesNoCancel" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type


    this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
      if (confirmed == undefined) {

        return;
      } else if (confirmed) {

        this.serviceProviderService.deleteServiceProvider(serviceProvider.id).subscribe({
          next: result => {

            console.log(result);
            this.getServiceProviders(this.user.companyId);

          }
        })


      } else {

      }
    });




  }


  saveAutopart(): void {

    console.log("saveAutopart");

    this.autopartService.update(this.selectedAutopart.id, this.selectedAutopart).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedAutopart = res;
        this.selectedImage = this.selectedAutopart.showInSearchImageId;
        this.message1 = "Updated Successfully ";

      },
      error: (e) => console.error(e)
    });

  }

  saveAutopartEditor(): void {

    console.log("saveAutopart");

    if (this.selectedAutopart.imageModels.length == 0) {
      this.message1 = "Please choose image or images for the part";
      return;
    }

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
          }
        }

        this.selectedAutopart.showSavedButton = true;
        for (let i = 0; i < this.savedItems.length; i++) {
          if (this.savedItems[i].id == this.selectedAutopart.id) {
            this.selectedAutopart.showSavedButton = false;
          }
        }

      },
      error: (e) => console.error(e)
    });

  }

  onSelectFileEditor(event: any): void {


    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      const file = event.target.files[0];


      // if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      //   alert('Only JPEG and JPG images are allowed');
      //   return;
      // }

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;
          imageModel.fileName = file.name;
          //this.uploadImage(this.selectedAutopart.id, imageModel);
          this.uploadImageWithFile(this.selectedAutopart.id, imageModel);

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


  createNewAutopart(): void {

    if (this.imageModels.length == 0) {
      this.errorMessage = "Please choose image or images for the part";
      return;
    }

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
      this.errorMessage = "Part Shipping is required";
      return;
    }

    if (this.selectedAutopart.warranty == null || this.selectedAutopart.warranty == '') {
      this.errorMessage = "Part Warranty is required";
      return;
    }

    if (this.selectedAutopart.grade == null || this.selectedAutopart.grade == '') {
      this.errorMessage = "Part Grade is required";
      return;
    }

    if (this.selectedAutopart.salePrice == null || (this.selectedAutopart.salePrice != null && this.selectedAutopart.salePrice == 0)) {
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

    if (this.selectedAutopart.comments != null && this.selectedAutopart.comments != '' && this.selectedAutopart.comments.length > 2000) {
      this.errorMessage = "Part comments is too long";
      return;
    }

    if (this.selectedAutopart.description != null && this.selectedAutopart.description != '' && this.selectedAutopart.description.length < 2) {
      this.errorMessage = "Part Description is too short";
      return;
    }

    if (this.selectedAutopart.comments != null && this.selectedAutopart.comments != '' && this.selectedAutopart.comments.length < 2) {
      this.errorMessage = "Part comments is too short";
      return;
    }

    if (this.selectedAutopart.partNumber != null && this.selectedAutopart.partNumber != '' && this.selectedAutopart.partNumber.length > 255) {
      this.errorMessage = "Parts Number is too long";
      return;
    }

    if (this.selectedAutopart.stocknumber != null && this.selectedAutopart.stocknumber != '' && this.selectedAutopart.stocknumber.length < 2) {
      this.errorMessage = "Part Stock Number is too short";
      return;
    }

    if (this.selectedAutopart.stocknumber != null && this.selectedAutopart.stocknumber != '' && this.selectedAutopart.stocknumber.length > 50) {
      this.errorMessage = "Part Stock Number is too long";
      return;
    }

    var newEntry: boolean = false;

    if (this.selectedAutopart.id == null || this.selectedAutopart.id == 0)
      newEntry = true;

    if (this.imageModels.length > 0) {
      this.selectedAutopart.companyId = this.user.companyId;
      this.selectedAutopart.status = 2;
      this.selectedAutopart.published = true;
      this.selectedAutopart.reason = "posting";
      //  this.selectedselectedAutopart = this.selectedAutopart;

      this.autopartService.create(this.selectedAutopart).subscribe({
        next: (res) => {
          console.log(res);
          this.selectedAutopart = res;

          if (this.imageModels.length > 0) {
            for (let i = 0; i < this.imageModels.length; i++) {
              //this.uploadImage(this.selectedAutopartReturned.id, this.imageModels[i]);
              this.uploadImageWithFile(this.selectedAutopart.id, this.imageModels[i]);

            }
          }

          // this.detailSelected = true;
          // this.selectedSelectedAutopart = this.selectedautopartReturned;
          setTimeout(() => {

            if (newEntry == true)
              this.errorMessage = "Successfully Created";
            else
              this.errorMessage = "Successfully Updated";
            // this.imageModels = new Array();
            // this.imageUrl = null;
            this.getAutopartDetailFromServer(this.selectedAutopart.id);
            this.applyFilter2("2", false, 0, this.pageSize);
          }, 2000);

          // setTimeout(() => {
          //   //this.getAutoPartById(this.autopartReturned.id);
          //   window.open(`#/detail/` + this.autopartReturned.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
          //   this.message = "Posted Successfully";
          //   this.autopart = new AutoPart();
          //   this.imageModels = new Array();
          //   this.imageUrl = null;
          //   this.reload();
          // }, 2000);

        },
        error: (e) => console.error(e)
      });
    } else {
      this.message1 = "Please choose a file";
    }
  }



  createNewAutopart2(): void {

    if (this.imageModels.length == 0) {
      this.errorMessage = "Please choose image or images for the part";
      return;
    }

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
      this.errorMessage = "Part Shipping is required";
      return;
    }

    if (this.selectedAutopart.warranty == null || this.selectedAutopart.warranty == '') {
      this.errorMessage = "Part Warranty is required";
      return;
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


    if (this.imageModels.length > 0) {
      this.selectedAutopart.companyId = this.user.companyId;
      this.selectedAutopart.status = 2;
      this.selectedAutopart.published = true;
      this.selectedAutopart.reason = "posting";

      this.autopartService.create(this.selectedAutopart).subscribe({
        next: (res) => {
          console.log(res);
          this.selectedAutopart = res;

          if (this.imageModels.length > 0) {
            for (let i = 0; i < this.imageModels.length; i++) {

              this.uploadImageWithFile(this.selectedAutopart.id, this.imageModels[i]);
            }
          }

          setTimeout(() => {
            // this.imageModels = new Array();
            // this.imageUrl = null;
            this.getAutopartDetailFromServer(this.selectedAutopart.id);
            this.applyFilter2("2", false, 0, this.pageSize);
          }, 2000);

          this.errorMessage = "Posted Successfully";

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

        },
        error: (e) => console.error(e)
      });
    } else {
      this.message1 = "Please choose a file";
    }
  }

  vinRequestPart: any = "";

  searchVinRequestPart(): void {

    if (this.vinRequestPart != null && this.vinRequestPart.length == 17) {

      this.autopartService.getVin(this.vinRequestPart).subscribe({
        next: (res) => {
          console.log(res);
          this.autopart = res;
          this.requestpart.year = this.autopart.year;
          this.requestpart.make = this.autopart.make;
          this.requestpart.model = this.autopart.model;
          this.requestpart.description = this.autopart.description;
          this.requestpart.comments = this.autopart.description;
          this.requestpart.description = "";
          // this.autoprequestpartart.stocknumber = this.randomString();
          this.showSearchVin = false;

          for (var i = 0; i < this.carListStringList.length; i++) {
            if (this.carListStringList[i].brand == this.autopart.make) {
              this.optionsModel = this.carListStringList[i].models;
            }

          }

          // this.vinSearched = true;

        },
        error: (e) => console.error(e)
      });
    }
  }


  requestpartReturned: RequestPart = new RequestPart();

  saveRequestpart(): void {


    if (this.requestpart.year == null || this.requestpart.year < 1000 ||

      this.requestpart.make == null || this.requestpart.make == "" ||
      this.requestpart.model == null || this.requestpart.model == ''

    ) {
      this.errorMessageRequestpart = "Part Infor for year, make and model are required";
      return;
    }

    if (this.requestpart.title == null || this.requestpart.title == '') {
      this.errorMessageRequestpart = "Parts Name is required";
      return;
    }

    if (this.requestpart.description == null || this.requestpart.description == '') {
      this.errorMessageRequestpart = "Part Description is required";
      return;
    }

    if (this.requestpart.shipping == null || this.requestpart.shipping == '') {
      this.errorMessageRequestpart = "Part Shipping is required";
      return;
    }

    // if (this.requestpart.warranty == null || this.requestpart.warranty == '') {
    //   this.errorMessageRequestpart = "Part Warranty is required";
    //   return;
    // }

    if (this.requestpart.grade == null || this.requestpart.grade == '') {
      this.errorMessageRequestpart = "Part Grade is required";
      return;
    }

    // if (this.requestpart.salePrice == null || (this.requestpart.salePrice != null && this.requestpart.salePrice == 0)) {
    //   this.errorMessageRequestpart = "Part Price is required";
    //   return;
    // }



    if (this.requestpart.title != null && this.requestpart.title != '' && this.requestpart.title.length > 255) {
      this.errorMessageRequestpart = "Parts Name is too long";
      return;
    }

    if (this.requestpart.description != null && this.requestpart.description != '' && this.requestpart.description.length > 2000) {
      this.errorMessageRequestpart = "Part Description is too long";
      return;
    }

    if (this.requestpart.comments != null && this.requestpart.comments != '' && this.requestpart.comments.length > 2000) {
      this.errorMessageRequestpart = "Part comments is too long";
      return;
    }

    if (this.requestpart.description != null && this.requestpart.description != '' && this.requestpart.description.length < 2) {
      this.errorMessageRequestpart = "Part Description is too short";
      return;
    }

    if (this.requestpart.comments != null && this.requestpart.comments != '' && this.requestpart.comments.length < 2) {
      this.errorMessageRequestpart = "Part comments is too short";
      return;
    }

    if (this.requestpart.partNumber != null && this.requestpart.partNumber != '' && this.requestpart.partNumber.length > 255) {
      this.errorMessageRequestpart = "Parts Number is too long";
      return;
    }

    // if (this.requestpart.stocknumber != null && this.requestpart.stocknumber != '' && this.requestpart.stocknumber.length < 2) {
    //   this.errorMessageRequestpart = "Part Stock Number is too short";
    //   return;
    // }

    // if (this.requestpart.stocknumber != null && this.requestpart.stocknumber != '' && this.requestpart.stocknumber.length > 50) {
    //   this.errorMessageRequestpart = "Part Stock Number is too long";
    //   return;
    // }

    var newEntry: boolean = false;

    if (this.requestpart.id == null || this.requestpart.id == 0)
      newEntry = true;


    this.requestpart.companyId = this.user.companyId;
    //this.requestpart.status = 2;
    // this.requestpart.published = true;
    this.requestpart.reason = "posting";
    //  this.selectedrequestpart = this.requestpart;

    this.requestpartService.create(this.requestpart).subscribe({
      next: (res) => {
        //console.log(res);
        this.requestpartReturned = res;



        setTimeout(() => {

          if (newEntry == true)
            this.errorMessageRequestpart = "Successfully Created";
          else
            this.errorMessageRequestpart = "Successfully Updated";

          this.getReqeustDetailFromServer(this.requestpartReturned.id);

        }, 2000);


      },
      error: (e) => console.error(e)
    });

  }

  requestpartSelected: RequestPart = new RequestPart();

  getReqeustDetailFromServer(requestpartId: any): void {

    //  console.log(" request part detail ");
    this.requestpartService.get(requestpartId).subscribe({

      next: res => {

        // console.log(res);
        this.requestpart = res;
        this.requestpartSelected = res;
        //this.editAutopart(res, 0);

        // this.searchPartWithPage(0, this.pageSize, 0, false);
        this.detailSelected = true;
        var hasIt = false;
        for (let requestpart2 of this.requestpartsSearch) {
          if (requestpart2.id == this.requestpartSelected.id) {
            requestpart2 = this.requestpartSelected;
            hasIt = true;
          }
        }
        if (!hasIt)
          this.requestpartsSearch.push(this.requestpartSelected);
        //this.showSavedItems = true;
      },
      error: err => {
        console.log(err);
      }
    });

  }

  setRequestpartViewCount(requestpartId: any): void {

    this.requestpartService.setRequestpartViewCount(requestpartId).subscribe({
      next: result => {

      }
    })
  }

  editRequestpart(requestpart: RequestPart, index: any): void {



    this.setRequestpartViewCount(requestpart.id);

    this.detailSelected = true;
    this.requestpartSelected = requestpart;


    this.cindex = index;



    for (var i = 0; i < this.carListStringList.length; i++) {
      if (this.carListStringList[i].brand == this.requestpartSelected.make) {
        this.optionsModel = this.carListStringList[i].models;
      }

    }



  }

  aiSearchRequestPartNumber(requestpart: RequestPart): void {

    if (requestpart.partNumber != null && requestpart.partNumber != "") {

      var fitmentRequest = {
        "autopartId": 0,
        "year": requestpart.year,
        "make": requestpart.make,
        "model": requestpart.model,
        "partNumber": requestpart.partNumber.trim()

      }


      this.autopartService.getFitmentFromAi(fitmentRequest).subscribe({
        //this.autopartService.getFitmentFromCohereAi(fitmentRequest).subscribe({
        next: result => {
          if (result != null) {

            console.log(result);
            var fitments = new Array();
            fitments = result;

            if (fitments.length > 0) {
              //this.autopart.title = fitments[0].description;
              if (this.requestpart.description != null && this.requestpart.description != "")
                this.requestpart.description = fitments[0].description + this.requestpart.description;
              else
                this.requestpart.description = fitments[0].description;

            }
          }
        }
      })
    }

  }

  aiSearchPartNumber(autopart: RequestPart): void {

    if (autopart.partNumber != null && autopart.partNumber != "") {

      var fitmentRequest = {
        "autopartId": 0,
        "year": autopart.year,
        "make": autopart.make,
        "model": autopart.model,
        "partNumber": autopart.partNumber.trim()

      }


      this.autopartService.getFitmentFromAi(fitmentRequest).subscribe({
        //this.autopartService.getFitmentFromCohereAi(fitmentRequest).subscribe({
        next: result => {
          if (result != null) {

            console.log(result);
            var fitments = new Array();
            fitments = result;

            if (fitments.length > 0) {
              //this.autopart.title = fitments[0].description;
              if (this.selectedAutopart.description != null && this.selectedAutopart.description != "")
                this.selectedAutopart.description = fitments[0].description + this.selectedAutopart.description;
              else
                this.selectedAutopart.description = fitments[0].description;

            }
          }
        }
      })
    }

  }

  onChangeFitment(autopart: AutoPart): void {

    if (autopart.fitmented == true && autopart.partNumber != null && autopart.partNumber != "") {

      var fitmentRequest = {
        "autopartId": 0,
        "year": autopart.year,
        "make": autopart.make,
        "model": autopart.model,
        "partNumber": autopart.partNumber

      }
      this.autopartService.getFitmentFromAi(fitmentRequest).subscribe({
        next: result => {
          if (result != null) {

            console.log(result);
            var fitments = new Array();
            fitments = result;

            if (fitments.length > 0) {
              //this.autopart.title = fitments[0].description;
              if (this.selectedAutopart.description != null && this.selectedAutopart.description != "")
                this.selectedAutopart.description = fitments[0].description + this.selectedAutopart.description;
              else
                this.selectedAutopart.description = fitments[0].description;

            }

          }
        }
      })
    }

  }

  getAutopartDetailFromServer(autopartId: any): void {

    console.log(" autopart detail ");
    this.autopartService.get(autopartId).subscribe({

      next: res => {
        console.log(res);
        // this.imageModels = new Array();
        //this.editAutopart(res, 0);
        //this.applyFilter2('2', false, 0, this.pageSize);

        if (this.user.partMarketOnly == true)
          this.getAllFromUserSatistics2(this.user.id);
        else
          this.getAllFromUserSatistics(this.user.companyId);
        // this.searchPartWithPage(0, this.pageSize, 0, false);
        this.detailSelected = true;
        this.showSavedItems = true;
      },
      error: err => {
        console.log(err);
      }
    });

  }

  private uploadImageWithFile(autopartId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, imageModel.fileName)
    formData.append('autopartId', autopartId) //other param


    this.autopartService.uploadImageWithFile(formData, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart.imageModels.push(result);
        this.selectedImage = result.id;
        // for (let autopart2 of this.autopartsSearch) {
        //   if (autopart2.id == this.selectedAutopart.id) {
        //     autopart2.showInSearchImageId = this.selectedAutopart.showInSearchImageId;

        //   }
        // }
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



  onSelectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      const file = event.target.files[0];


      // if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      //   alert('Only JPEG and JPG images are allowed');
      //   return;
      // }

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;
          imageModel.fileName = file.name;

          this.uploadImageWithFile(this.selectedAutopart.id, imageModel);

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

  onSelectFileNew(event: any): void {
    if (event.target.files && event.target.files[0]) {

      const file = event.target.files[0];


      // if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      //   alert('Only JPEG and JPG images are allowed');
      //   return;
      // }

      var filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          //console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;
          imageModel.fileName = file.name;

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

            //  console.log(" width ", img.width);
            //  console.log(" height ", img.height);
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
        this.selectedAutopart.imageModels.push(result);
      }
    });
  }

  deleteImage(autopartId: any, imageId: any) {


    console.log("deleteImage");

    this.autopartService.deleteImageWihtUserId(imageId, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart = this.autopartService.get(autopartId).subscribe({
          next: (result => {
            console.log(result);
            this.selectedAutopart = result;
            this.selectedImage = this.selectedAutopart.showInSearchImageId;

          })
        });
      }
    });
  }

  setImageForSearch(autopartId: any, imageId: any) {


    console.log("setImageForSearch");

    this.autopartService.setImageForSearch(imageId, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart = this.autopartService.get(autopartId).subscribe({
          next: (result => {
            console.log(result);
            this.selectedAutopart = result;
            this.selectedImage = this.selectedAutopart.showInSearchImageId;
            for (let autopart2 of this.autopartsSearch) {
              if (autopart2.id == this.selectedAutopart.id) {
                autopart2.showInSearchImageId = this.selectedAutopart.showInSearchImageId;
              }
            }
          })
        });
      }
    });
  }



  getDetail(autoPart: RequestPart, index: any): void {

    // this.selectedAutopart = autoPart;
    // this.detailSelected = true;

    this.cindex = index;
    //this.scrollService.scrollToElementById(autoPart.id);
    window.open(`#/detail/` + autoPart.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
  }

  backToListing(): void {

    if (this.showSavedItems != true)
      this.detailSelected = false;

    this.imageModels = new Array();
    this.imageUrl = null;
    this.errorMessage = "";
    this.message1 = "";

    setTimeout(() => {
      if (this.selectedAutopart.id > 0)
        this.scrollService.scrollToElementById(this.selectedAutopart.id);
    }, 200);
  }


  backToListingServiceProvider(): void {

    this.detailSelectedServiceProvider = false;

    this.messageServiceProvider = "";
    this.errorMessage = "";
    this.message1 = "";
    try {
      setTimeout(() => {
        if (this.selectedServiceProvider.id > 0)
          this.scrollService.scrollToElementById(this.selectedServiceProvider.id);
      }, 200);
    } catch (error) {

    }
  }


  publishAutopart(autoPart: AutoPart): void {

    autoPart.published = true;
    autoPart.status = 1;

    console.log("publishAutopart");
    this.autopartService.update(autoPart.id, autoPart).subscribe({
      next: result => {

        console.log(" " + result);
        autoPart = result;
        console.log("publishAutopart updated:", autoPart);
        this.getAllFromUserSatistics(this.currentUser.id);
        this.applyFilter("2", false);

      }, error: (e) => {
        console.log("publishAutopart error");
        this.message = e.error.message;
        console.error(e);
      }
    });

  }

  archiveAutopart(autoPart: RequestPart, archived: boolean): void {

    var customTitle = "";

    var message = "";
    if (archived == true) {
      customTitle = 'Archive Parts';
      message = 'Are you sure to archive or repost this parts?';
    }
    else {
      customTitle = 'Repost Parts';
      message = 'Are you sure to repost this parts?';
    }
    const buttonType = "yesNoCancel" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type


    this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
      if (confirmed == undefined) {

        return;
      } else if (confirmed) {

        autoPart.archived = archived;
        autoPart.status = 2;
        console.log("archiveAutopart");

        this.autopartService.update(autoPart.id, autoPart).subscribe({
          next: result => {

            console.log(" " + result);
            autoPart = result;
            console.log("archiveAutopart updated:", autoPart);
            if (this.user.partMarketOnly == true)
              this.getAllFromUserSatistics2(this.user.id);
            else
              this.getAllFromUserSatistics(this.user.companyId);

            this.applyFilter2("2", this.forArchived, 0, this.pageSize);
            //this.applyFilter("1", true);

          }, error: (e) => {
            console.log("archiveAutopart error");
            this.message = e.error.message;
            console.error(e);
          }
        });


      } else {

      }
    });


  }

  deleteAutopart(autoPart: RequestPart, index: any): void {
    //console.log(event.target);


    var customTitle = "";

    var message = "";
    customTitle = 'Delete Parts';
    message = 'Are you sure to delete this parts?';

    const buttonType = "yesNoCancel" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type


    this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
      if (confirmed == undefined) {

        return;
      } else if (confirmed) {

        console.log("deleteAutopart");
        this.autopartService.deleteWithUserId(autoPart.id, this.user.id).subscribe({
          next: data => {
            console.log(" " + data);
            //this.autopartService.delete(index);
            if (this.user.partMarketOnly == true)
              this.getAllFromUserSatistics2(this.user.id);
            else
              this.getAllFromUserSatistics(this.user.companyId);
            //this.applyFilter("2", true);
            this.applyFilter2("2", false, 0, this.pageSize);
            // this.getAllFromUser(this.currentUser.id);
          },

          error: (e) => {
            console.log("deleteAutopart error");
            this.message = e.error.message;
            console.error(e);
          }

        });


      } else {

      }
    });



  }

  saveRequestpartEditor(): void {

    console.log("saveRequestpartEditor");

    if (this.requestpartSelected.year == null || this.requestpartSelected.year < 1000 ||

      this.requestpartSelected.make == null || this.requestpartSelected.make == "" ||
      this.requestpartSelected.model == null || this.requestpartSelected.model == ''

    ) {
      this.message1 = "Part Infor for year, make and model are required";
      return;
    }

    if (this.requestpartSelected.title == null || this.requestpartSelected.title == '') {
      this.message1 = "Parts Name is required";
      return;
    }

    if (this.requestpartSelected.description == null || this.requestpartSelected.description == '') {
      this.message1 = "Part Description is required";
      return;
    }

    if (this.requestpartSelected.shipping == null || this.requestpartSelected.shipping == '') {
      this.message1 = "Part Shipping is required";
      return;
    }

    if (this.requestpartSelected.grade == null || this.requestpartSelected.grade == '') {
      this.message1 = "Part Grade is required";
      return;
    }


    if (this.requestpartSelected.title != null && this.requestpartSelected.title != '' && this.requestpartSelected.title.length > 255) {
      this.message1 = "Parts Name is too long";
      return;
    }

    if (this.requestpartSelected.description != null && this.requestpartSelected.description != '' && this.requestpartSelected.description.length > 2000) {
      this.message1 = "Part Description is too long";
      return;
    }

    if (this.requestpartSelected.partNumber != null && this.requestpartSelected.partNumber != '' && this.requestpartSelected.partNumber.length > 255) {
      this.message1 = "Parts Number is too long";
      return;
    }


    this.requestpartService.update(this.requestpartSelected.id, this.requestpartSelected).subscribe({
      next: (res) => {
        console.log(res);
        this.requestpartSelected = res;
        // this.selectedImage = this.requestpartSelected.showInSearchImageId;
        this.message1 = "Updated Successfully ";
        // setTimeout(() => {
        //this.getAutoPartById(this.autopartReturned.id);
        //window.open(`/detail/` + this.autopartReturned.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
        //this.message1 = "Updated Successfully ";
        // }, 200);

        for (let i = 0; i < this.requestpartsSearch.length; i++) {
          if (this.requestpartsSearch[i].id == this.requestpartSelected.id) {
            this.requestpartsSearch[i] = this.requestpartSelected;
          }
        }



      },
      error: (e) => console.error(e)
    });

  }

  archiveRequestpart(requestpart: RequestPart): void {

    requestpart.archived = true;
    // requestpart.status = 2;
    requestpart.reason = "archive";
    console.log("archiveAutopart");
    this.requestpartService.update(requestpart.id, requestpart).subscribe({
      next: result => {

        console.log(" " + result);
        requestpart = result;
        console.log("archiveRequestpart updated:", requestpart);

        //remove from search list
        for (let i = 0; i < this.requestpartsSearch.length; i++) {
          if (requestpart.id == this.requestpartsSearch[i].id) {
            this.autopartsSearch.slice(i, 1);
          }
        }


        this.backToListing();

      }, error: (e) => {
        console.log("archiveAutopart error");
        this.message = e.error.message;
        console.error(e);
      }
    });

  }

  deleteRequestpart(requestpart: RequestPart, index: any): void {
    //console.log(event.target);

    var customTitle = "";
    var message = "";
    customTitle = 'Remove Request Parts';
    message = 'Are you sure to remove this request parts ?';

    const buttonType = "yesNoCancel" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type


    this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
      if (confirmed == undefined) {

        return;
      } else if (confirmed) {

        console.log("deleteRequestpart");
        this.requestpartService.delete(requestpart.id).subscribe({
          next: data => {
            console.log(" " + data);
            //this.autopartService.delete(index);
            // if (this.user.partMarketOnly == true)
            //   this.getAllFromUserSatistics2(this.user.id);
            // else
            //   this.getAllFromUserSatistics(this.user.companyId);
            //this.applyFilter("2", true);
            // this.applyFilter2("2", false, 0, this.pageSize);
            this.applyFilterRequestpart("2", false, 0, this.pageSize);
            this.viewMode = 3;
            // this.getAllFromUser(this.currentUser.id);
          },

          error: (e) => {
            console.log("deleteRequestpart error");
            this.message = e.error.message;
            console.error(e);
          }

        });


      } else {

      }
    });




  }



  getCurrentUserFromUser(userId: any): void {

    //console.log("getCurrentUserFromUser");
    this.userService.getUserById(userId).subscribe({
      next: result => {

        //console.log(result);
        this.currentUserUser = result;
        this.user = this.currentUserUser;
        for (let i = 0; i < this.currentUserUser.roles.length; i++) {
          if (this.currentUserUser.roles[i].name == 'ROLE_ADMIN') {

            //  this.getAllUsers();
            // this.getAllCompany();

          }
          //  if (this.currentUserUser.roles[i].name == 'ROLE_SHOP' || this.currentUserUser.roles[i].name == 'ROLE_RECYCLER') {
          if (this.currentUserUser.roles[i].name == 'ROLE_SHOP') {

            // this.getCompany(this.currentUserUser.companyId);
            this.getSettings(this.currentUserUser.companyId);
            //this.getAllComponyEmployees(this.currentUserUser.companyId);


          }
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
          // this.statuss = this.setting.statuss;
          // this.paymentTypes = this.setting.paymentTypes;
          this.company = this.setting.company;

          //this.getStatusOverview(this.currentUserUser.companyId);
          //this.getOthers();

        }
      }
    })
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

  hover: any = null;

  sortListRequestPart(fieldName: any): void {
    this.counter++;

    console.log(fieldName);

    if (fieldName == 'id') {
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => a.id - b.id);
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => b.id - a.id);
    }

    if (fieldName == 'year') {
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => a.year - b.year);
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => b.year - a.year);
    }

    if (fieldName == 'make') {
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => a['make'].localeCompare(b['make']));
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => b['make'].localeCompare(a['make']));
    }

    if (fieldName == 'model') {
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => a['model'].localeCompare(b['model']));
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => b['model'].localeCompare(a['model']));
    }

    if (fieldName == 'title') {
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => a['title'].localeCompare(b['title']));
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => b['title'].localeCompare(a['title']));
    }

    if (fieldName == 'stocknumber') {
      //this.requestpartsSearch = this.requestpartsSearch.filter(item => item['stocknumber'] !== null);
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => a['stocknumber'].localeCompare(b['stocknumber']));
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => b['stocknumber'].localeCompare(a['stocknumber']));
    }

    if (fieldName == 'description') {
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => a['description'].localeCompare(b['description']));
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => b['description'].localeCompare(a['description']));
    }

    if (fieldName == 'grade') {
      this.requestpartsSearch = this.requestpartsSearch.filter(item => item['grade'] !== null);
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => a['grade'].localeCompare(b['grade']));
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => b['grade'].localeCompare(a['grade']));
    }

    if (fieldName == 'salePrice') {
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => a.salePrice - b.salePrice);
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => b.salePrice - a.salePrice);
    }

    if (fieldName == 'distance') {
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => a.distance - b.distance);
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => b.distance - a.distance);
    }

    if (fieldName == 'viewCount') {
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => a.viewCount - b.viewCount);
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => b.viewCount - a.viewCount);
    }


    if (fieldName == 'createdAt') {
      if (this.counter % 2 == 1)
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      else
        this.requestpartsSearch = this.requestpartsSearch.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

  }


  sortList(fieldName: any): void {
    this.counter++;

    if (fieldName == 'id') {
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

    if (fieldName == 'partNumber') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['partNumber'].localeCompare(b['partNumber']));
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['partNumber'].localeCompare(a['partNumber']));
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


  sortListSavedItem(fieldName: any): void {
    this.counter++;

    if (fieldName == 'id') {
      if (this.counter % 2 == 1)
        this.savedItems = this.savedItems.sort((a, b) => a.id - b.id);
      else
        this.savedItems = this.savedItems.sort((a, b) => b.id - a.id);
    }

    if (fieldName == 'year') {
      if (this.counter % 2 == 1)
        this.savedItems = this.savedItems.sort((a, b) => a.year - b.year);
      else
        this.savedItems = this.savedItems.sort((a, b) => b.year - a.year);
    }

    if (fieldName == 'title') {
      if (this.counter % 2 == 1)
        this.savedItems = this.savedItems.sort((a, b) => a['title'].localeCompare(b['title']));
      else
        this.savedItems = this.savedItems.sort((a, b) => b['title'].localeCompare(a['title']));
    }

    if (fieldName == 'description') {
      if (this.counter % 2 == 1)
        this.savedItems = this.savedItems.sort((a, b) => a['description'].localeCompare(b['description']));
      else
        this.savedItems = this.savedItems.sort((a, b) => b['description'].localeCompare(a['description']));
    }

    if (fieldName == 'grade') {
      if (this.counter % 2 == 1)
        this.savedItems = this.savedItems.sort((a, b) => a['grade'].localeCompare(b['grade']));
      else
        this.savedItems = this.savedItems.sort((a, b) => b['grade'].localeCompare(a['grade']));
    }

    if (fieldName == 'stocknumber') {
      if (this.counter % 2 == 1)
        this.savedItems = this.savedItems.sort((a, b) => a['stocknumber'].localeCompare(b['stocknumber']));
      else
        this.savedItems = this.savedItems.sort((a, b) => b['stocknumber'].localeCompare(a['stocknumber']));
    }

    if (fieldName == 'salePrice') {
      if (this.counter % 2 == 1)
        this.savedItems = this.savedItems.sort((a, b) => a.salePrice - b.salePrice);
      else
        this.savedItems = this.savedItems.sort((a, b) => b.salePrice - a.salePrice);
    }

    if (fieldName == 'distance') {
      if (this.counter % 2 == 1)
        this.savedItems = this.savedItems.sort((a, b) => a.distance - b.distance);
      else
        this.savedItems = this.savedItems.sort((a, b) => b.distance - a.distance);
    }

  }


  sortListServiceProvider(fieldName: any): void {
    this.counter++;

    if (fieldName == 'id') {
      if (this.counter % 2 == 1)
        this.serviceProviders = this.serviceProviders.sort((a, b) => a.id - b.id);
      else
        this.serviceProviders = this.serviceProviders.sort((a, b) => b.id - a.id);
    }

    if (fieldName == 'serviceTypeId') {
      for (let serviceProvider of this.serviceProviders) {
        serviceProvider.sortStr = "";
        for (let serviceType of this.serviceTypes) {
          if (serviceType.id == serviceProvider.serviceTypeId) {
            serviceProvider.sortStr = serviceType.name;
          }
        }
      }

      if (this.counter % 2 == 1)
        this.serviceProviders = this.serviceProviders.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.serviceProviders = this.serviceProviders.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    }


    if (fieldName == 'name') {
      if (this.counter % 2 == 1)
        this.serviceProviders = this.serviceProviders.sort((a, b) => a['name'].localeCompare(b['name']));
      else
        this.serviceProviders = this.serviceProviders.sort((a, b) => b['name'].localeCompare(a['name']));
    }

    if (fieldName == 'serviceDescription') {
      if (this.counter % 2 == 1)
        this.serviceProviders = this.serviceProviders.sort((a, b) => a['serviceDescription'].localeCompare(b['serviceDescription']));
      else
        this.serviceProviders = this.serviceProviders.sort((a, b) => b['serviceDescription'].localeCompare(a['serviceDescription']));
    }

    if (fieldName == 'contactFirstName') {
      if (this.counter % 2 == 1)
        this.serviceProviders = this.serviceProviders.sort((a, b) => a['contactFirstName'].localeCompare(b['contactFirstName']));
      else
        this.serviceProviders = this.serviceProviders.sort((a, b) => b['contactFirstName'].localeCompare(a['contactFirstName']));
    }

    if (fieldName == 'street') {
      if (this.counter % 2 == 1)
        this.serviceProviders = this.serviceProviders.sort((a, b) => a['street'].localeCompare(b['street']));
      else
        this.serviceProviders = this.serviceProviders.sort((a, b) => b['street'].localeCompare(a['street']));
    }


    if (fieldName == 'distance') {
      if (this.counter % 2 == 1)
        this.serviceProviders = this.serviceProviders.sort((a, b) => a.distance - b.distance);
      else
        this.serviceProviders = this.serviceProviders.sort((a, b) => b.distance - a.distance);
    }

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


  searchVin(): void {

    this.autopartService.getVin(this.vin).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedAutopart = res;
        this.vehicle.year = this.selectedAutopart.year;
        this.vehicle.make = this.selectedAutopart.make;
        this.vehicle.model = this.selectedAutopart.model;
        this.vehicle.comments = this.selectedAutopart.description;
        this.selectedAutopart.comments = this.selectedAutopart.description;
        this.selectedAutopart.description = "";
        this.selectedAutopart.stocknumber = this.randomString();
        this.showSearchVin = false;

        for (var i = 0; i < this.carListStringList.length; i++) {
          if (this.carListStringList[i].brand == this.selectedAutopart.make) {
            this.optionsModel = this.carListStringList[i].models;
          }

        }

        // this.vinSearched = true;

      },
      error: (e) => console.error(e)
    });
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
  calculateDiff(date: string) {
    let d2: Date = new Date();
    let d1 = Date.parse(date); //time in milliseconds
    var timeDiff = d2.getTime() - d1;
    var diff = timeDiff / (1000 * 3600 * 24);
    return Math.floor(diff);
  }
  showVehicleListing: boolean = true;

  toggleDivs() {
    this.showVehicleListing = !this.showVehicleListing;
  }
  checkWindowWidth(): void {
    const windowWidth = this.renderer.parentNode(this.el.nativeElement).clientWidth;

    if (windowWidth < 767) {
      $('.reminders-box').addClass("reminders-toggle");
      $('.main-content').removeClass("my-fluid-col");
    }
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
    this.currentUser.bussinessUrl = this.form.bussinessrul;


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


  sbowServiceProvider: boolean = false;

  viewMode: any = 0;

  showSavedItemsListView() {
    this.showSavedItems = true;
    this.viewMode = 1;

    this.detailSelected = true;
    this.sbowServiceProvider = false;
    this.message = "Saved Items (" + this.savedItems.length + ")";
  }

  showServiceProviderListView() {
    this.viewMode = 2;
    this.sbowServiceProvider = true;
    this.showSavedItems = false;
    this.detailSelected = false;

    this.message = "Service Prividers (" + this.serviceProviders?.length + ")";

  }

  showRequestpartsListView() {
    this.viewMode = 3;
    this.sbowServiceProvider = false;
    this.showSavedItems = false;
    this.detailSelected = false;
    this.applyFilterRequestpart("2", false, 0, this.pageSize);
    // this.message = "";
    // this.message = "Request Parts (" + this.searchCount + ")";

  }


  copyLink(autopart: any): void {
    var text = location.origin + "/#/detail/" + autopart.token;
    console.log(text);
    navigator.clipboard.writeText(text).then().catch(e => console.log(e));
  }

  shareOnFacebook(autopart: any): boolean {
    var url = location.origin + "/#/detail/" + autopart.token;
    console.log(url);
    var description = "[" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    `+ url + `
    from: ` + document.title + `
`;
    window.open('https://www.facebook.com/sharer/sharer.php?u='
      + encodeURIComponent(emailHtml));
    return false
  }

  shareOnInstagram(autopart: any): boolean {
    var url = location.origin + "/#/detail/" + autopart.token;
    console.log(url);

    var description = "[" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    from: ` + document.title + `
`;

    window.open('https://www.instagram.com/accounts/login/?text='
      + encodeURIComponent(emailHtml) + '%20' + encodeURIComponent(url), '_blank');
    return false;
  }

  shareOnWhatsapp(autopart: any): boolean {
    var url = location.origin + "/#/detail/" + autopart.token;
    console.log(url);

    var description = "[" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    from: ` + document.title + `
`;

    window.open('whatsapp://send?text='
      + encodeURIComponent(emailHtml) + '%20' + encodeURIComponent(url), '_self');
    return false;
  }


  shareOnTwitter(autopart: any): boolean {
    var url = location.origin + "/#/detail/" + autopart.token;
    console.log(url);

    var description = "[" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    from: ` + document.title + `
`;

    window.open('https://twitter.com/intent/tweet?text='
      + encodeURIComponent(emailHtml) + '%20' + encodeURIComponent(url), '_blank');
    return false;
  }


  shareOnReddit(autopart: any): boolean {
    var url = location.origin + "/#/detail/" + autopart.token;
    console.log(url);
    //navigator.clipboard.writeText(text).then().catch(e => console.log(e));
    var description = "[" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    from: ` + document.title + `
`;

    window.open('https://www.reddit.com/submit?url='
      + encodeURIComponent(url) + '%&title=' + encodeURIComponent(emailHtml), '_blank');
    return false;
  }

  shareOnEmail(autopart: any): boolean {
    var url = location.origin + "/#/detail/" + autopart.token;
    console.log(url);
    //navigator.clipboard.writeText(text).then().catch(e => console.log(e));
    var description = "[" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    `+ url + `
    from: ` + document.title + `
`;

    // window.open('mailto:?subject=' + encodeURIComponent(document.title) + "%20" + description + '&body=' + description
    //   + "%20@ <a href='" + encodeURIComponent(url) + "'>link</a>");
    window.open('mailto:?subject=' + encodeURIComponent(document.title) + ":%20" + description + '&body='
      + encodeURIComponent(emailHtml));
    return false;
  }


  copyLink2(autopart: any): void {
    var text = location.origin + "/#/detail2/" + autopart.token;
    console.log(text);
    navigator.clipboard.writeText(text).then().catch(e => console.log(e));
  }

  shareOnFacebook2(autopart: any): boolean {
    var url = location.origin + "/#/detail2/" + autopart.token;
    console.log(url);
    var description = "Request Part: [" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    `+ url + `
    from: ` + document.title + `
`;
    window.open('https://www.facebook.com/sharer/sharer.php?u='
      + encodeURIComponent(emailHtml));
    return false
  }

  shareOnInstagram2(autopart: any): boolean {
    var url = location.origin + "/#/detail2/" + autopart.token;
    console.log(url);

    var description = "Request Part: [" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    from: ` + document.title + `
`;

    window.open('https://www.instagram.com/accounts/login/?text='
      + encodeURIComponent(emailHtml) + '%20' + encodeURIComponent(url), '_blank');
    return false;
  }

  shareOnWhatsapp2(autopart: any): boolean {
    var url = location.origin + "/#/detail2/" + autopart.token;
    console.log(url);

    var description = "Request Part: [" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    from: ` + document.title + `
`;

    window.open('whatsapp://send?text='
      + encodeURIComponent(emailHtml) + '%20' + encodeURIComponent(url), '_self');
    return false;
  }


  shareOnTwitter2(autopart: any): boolean {
    var url = location.origin + "/#/detail2/" + autopart.token;
    console.log(url);

    var description = "Request Part: [" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    from: ` + document.title + `
`;

    window.open('https://twitter.com/intent/tweet?text='
      + encodeURIComponent(emailHtml) + '%20' + encodeURIComponent(url), '_blank');
    return false;
  }


  shareOnReddit2(autopart: any): boolean {
    var url = location.origin + "/#/detail2/" + autopart.token;
    console.log(url);
    //navigator.clipboard.writeText(text).then().catch(e => console.log(e));
    var description = "Request Part: [" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    from: ` + document.title + `
`;

    window.open('https://www.reddit.com/submit?url='
      + encodeURIComponent(url) + '%&title=' + encodeURIComponent(emailHtml), '_blank');
    return false;
  }

  shareOnEmail2(autopart: any): boolean {
    var url = location.origin + "/#/detail2/" + autopart.token;
    console.log(url);
    //navigator.clipboard.writeText(text).then().catch(e => console.log(e));
    var description = "Request Part: [" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    `+ url + `
    from: ` + document.title + `
`;

    // window.open('mailto:?subject=' + encodeURIComponent(document.title) + "%20" + description + '&body=' + description
    //   + "%20@ <a href='" + encodeURIComponent(url) + "'>link</a>");
    window.open('mailto:?subject=' + encodeURIComponent(document.title) + ":%20" + description + '&body='
      + encodeURIComponent(emailHtml));
    return false;
  }



  addSavedItem(autopartId: any): void {

    this.showSavedItems = true;

    this.selectedAutopart.showSavedButton = false;

    const saveditem: any = {

      userId: this.storageService.getUser().id,
      autopartId: autopartId

    }

    this.savedItemService.createSavedItem(saveditem).subscribe({
      next: (result) => {

        console.log("" + result);
        this.getSavedItems();
      },
      error: (e) => {
        console.log("addSavedItem error");
        this.message = e.error.message;
        console.error(e);
      }
    })
  }

  getSavedItems(): void {

    if (this.storageService.getUser() != null) {
      this.savedItemService.getSavedItem(this.storageService.getUser().id).subscribe(
        {
          next: (result) => {

            this.savedItems = result;
            //console.log(" savedItems: ", this.savedItems);
          },
          error: (e) => {
            console.log("getSaveItem error");
            this.message = e.error.message;
            console.error(e);
          }
        }
      )
    }
  }
  isSavedItemVisible = false;

  deleteSavedItem(event: any, autopartId: any): void {

    console.log("eventCheck");
    this.savedItemService.deleteSavedItem(this.storageService.getUser().id, autopartId).subscribe({

      next: data => {
        console.log(" " + data);
        this.getSavedItems();
        this.selectedAutopart.showSavedButton = true;

        // this.users = data;
      },

      error: (e) => {
        console.log("delete error");
        this.message = e.error.message;
        console.error(e);
      }

    });

  }


}

