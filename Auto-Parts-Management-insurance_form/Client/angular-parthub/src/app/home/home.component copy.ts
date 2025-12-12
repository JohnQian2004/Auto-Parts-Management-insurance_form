import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';
import { Customer } from '../models/customer.model';

import { Company } from '../models/company.model';

import { SettingService } from '../_services/setting.service';
import { Setting } from '../models/setting.model';

import { AuthService } from '../_services/auth.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import { UserService } from '../_services/user.service';
import { Observable } from 'rxjs';
import { ImageModel } from '../models/imageModel.model';
import { AutopartService } from '../_services/autopart.service';
import { AutoPart } from '../models/autopart.model';
import * as jsonData from '../../assets/car-list.json';
import { Brand } from '../models/brand.model';
import { ScrollService } from '../_services/scroll.service';
import { StorageService } from '../_services/storage.service';
import { Saveditem } from '../models/saveditem.model';
import { SavedItemService } from '../_services/saveditem.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from '../models/config.model';
import { User } from '../models/user.model';
import { ServiceType } from '../models/service.type.model';
import { ServiceProvider } from '../models/service.provider.model';
import { ServiceTypeService } from '../_services/service.type.service';
import { ServiceProviderService } from '../_services/service.provider.service';
import { PagingConfig } from '../models/paging-config.model';
import { RequestpartService } from '../_services/requestpart.service';
import { RequestPart } from '../models/requestpart.model';
import { Banner } from '../models/banner.model';
import { BannerService } from '../_services/banner.service';
import { ConfirmationService } from '../_services/confirmation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // console.log(event.target.innerWidth);
  }

  serviceTypes: ServiceType[] = new Array();
  serviceType: ServiceType = new ServiceType();

  serviceProviders: ServiceProvider[] = new Array();
  serviceProvider: ServiceProvider = new ServiceProvider();
  selectedServiceProvider: any = new ServiceProvider();

  isClassApplied: boolean = false;

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";

  withFitment: boolean = false;
  withFitmentYearMakeModelPartNumber: boolean = false;

  searchMode: any = 3;

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
  activeButton: string = 'btn1';
  showAccordian: boolean = true;

  searchInput: any = "";


  archived: boolean = false;

  user: User = new User();
  users: User[] = new Array();

  showIt: boolean = true;

  isH2Visible: boolean = false;

  currentJobId: any;
  currentPaymentId: any;
  currentReceiptId: any;


  cindex: number = 0;

  message: any;
  messageAlert: any;

  errorMessage: any = "";
  successMessage: any;

  successMessageVehicle: any;
  errorMessageVehicle: any;

  base64Image: any;

  vin: string = "";
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
    year: 0,
    make: "Lamborghini",
    model: "Urus",
    color: "black",
    miles: "20k",
    vin: "",
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
  showSearchVin: boolean = false;

  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/getImage';
  baseUrlResizeImage = this.config.baseUrl + '/getResize';
  optionsAutoparts = this.config.optionsAutoparts;

  currentEmplyeeId: any;
  vehicleJobsOnly: boolean = false;


  modeNumber?: any = 0;

  currantPageNumber?: any;
  searchCount?: any
  pageSize: number = 10;
  pages: number = 1;

  pagesArray: number[] = new Array();

  partNumber: any;

  titleSearch = "Vehicle Info";

  savedItems: AutoPart[] = new Array();
  showSavedItems: boolean = false;

  zipcode: any = "21234";

  showPostForm: boolean = false;
  showSearchForm: boolean = false;
  showSearchByNmberForm: boolean = false;

  showTop: boolean = true;

  urls: Array<any> = [];

  imageModels: ImageModel[] = new Array();

  autopartsSearchLanding: AutoPart[] = new Array();
  autopartsSearch: AutoPart[] = new Array();
  requestpartsSearch: RequestPart[] = new Array();
  requestpart: RequestPart = new RequestPart();

  autopart: AutoPart = {
    year: 0,
    make: "",
    model: "",
    engine: "",
    transmission: "",
    grade: "A",

    shipping: "FLP",
    warranty: "7D",

    partName: "",
    title: '',
    description: '',
    imageModels: [],
    published: false
  };

  selectedAutopart: AutoPart = new AutoPart();
  selectedImage: any;

  vinSearched: boolean = false;

  submitted = false;

  detailSelected = false;


  options: string[];

  fileToUpload: any;
  imageUrl: any;

  currentImage?: ImageModel;

  autopartReturned: AutoPart = {
    year: 0,
    id: '0',
    title: '',
    description: '',
    imageModels: [],
    published: false
  };

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message1 = '';
  preview = '';

  imageInfos?: Observable<any>;

  currentImageData = {
    autopartId: this.autopartReturned.id,
    picByte: ''
  }



  constructor(private userService: UserService,
    private storageService: StorageService,
    private scrollService: ScrollService,
    private savedItemService: SavedItemService,
    private router: Router,
    private route: ActivatedRoute,
    private autopartService: AutopartService,
    private eventBusService: EventBusService,
    private el: ElementRef,
    // private elementRef: ElementRef,
    // private vehicleService: VehicleService,
    // private companyService: CompanyService,
    // private employeeService: EmployeeService,
    // private serviceService: ServiceService,
    // private jobService: JobService,
    // private customerService: CustomerService,
    // private vehicleHistoryService: VehicleHistoryService,
    // private statusService: StatusService,
    // private locationService: LocationService,
    // private paymentStatusService: PaymentStatusService,
    // private paymentMethodService: PaymentMethodService,
    // private paymentTypeService: PaymentTypeService,
    // private paymentService: PaymentService,
    // private jobRequestTypeService: JobRequestTypeService,
    // private approvalStatusService: ApprovalStatusService,
    // private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private settingService: SettingService,
    // private noteService: NoteService,
    // private receiptService: ReceiptService,
    private authService: AuthService,
    private serviceTypeService: ServiceTypeService,
    private serviceProviderService: ServiceProviderService,
    private requestpartService: RequestpartService,
    private bannerService: BannerService,
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
    this.options = [
      "not selected"
    ];


    for (let i = 1950; i <= 2026; i++) {
      this.options.push("" + i);
    }


    this.optionsMake = this.config.optionsMake;


    this.optionsModel = [
      "not selected"
    ];

    this.carListStringList = [];

    // if (this.config.domainName.toLocaleLowerCase() == "BayCounter.com".toLocaleLowerCase() && this.currentUser == null)
    //   this.router.navigate(['/login']);

  }
  toggleClassAi() {
    this.isClassApplied = !this.isClassApplied;
  }
  ngAfterViewInit(): void {

    //throw new Error('Method not implemented.');
  }

  rememberMePageSize(): void {
    localStorage.setItem('pageSizeMarket', "" + this.pageSize);
  }

  ngOnInit(): void {
    this.checkWindowWidth();

    if (localStorage.getItem('pageSizeMarket') != null) {

      var pageSize = localStorage.getItem('pageSizeMarket');
      //console.log(pageSize);

      if (pageSize != null)
        this.pageSize = + pageSize;
    } else {
      this.pageSize = 20;
    }

    //this.showSearchForm = true;
    // this.route.params.subscribe(params => {
    //   const value = params['showPostForm'];
    //   if (value == 'true') {
    //     this.showPostForm = true;
    //     this.showTop = false;
    //   } else {
    //     // this.showSearchForm = true;
    //   }
    // });


    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content = data;
        this.currentUser = this.storageService.getUser();
        this.getActiveBanner();
        this.getServiceTypes();
        //this.searchPartWithPage(0, 20, 0, false);
        //this.searchPartWithPage(0, this.pageSize, 9, false);
        //this.searchServiceProviders(0, this.pageSize, 0, null, false);
        //this.searchRequestPartWithPage(0, this.pageSize, 9, false);

        if (localStorage.getItem('zip') != null) {

          var zipCode = localStorage.getItem('zip');
          //console.log(zipCode);

          this.zipcode = zipCode;
        }
        if (this.currentUser != null) {
          this.getUserById(this.currentUser.id);
        }
        else {
          if (this.config.domainName.toLocaleLowerCase() == "BayCounter.com".toLocaleLowerCase())
            this.router.navigate(['/login']);
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


    //console.log('Data', this.carList);
    this.carListStringList = this.carList as Brand[];

    // carListObj = JSON.parse(this.carList);
    //console.log('Data2', this.carListStringList);
    for (var i = 0; i < this.carListStringList.length; i++) {
      //console.log('Data2', this.carListStringList[i].brand);
      //console.log('Data3', this.carListStringList[i].models);
    }

    for (let i = 1950; i <= 2026; i++) {
      this.optionsYear.push("" + i);
    }


    this.optionsMake = this.config.optionsMake;

    this.optionsModel = [
      "not selected"
    ];

    if (this.showPostForm == false) {
      //this.searchPartWithPage(0, this.pageSize, 0, false);
      this.getSavedItems();
    }





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
      this.router.navigate(['/autoparts']);
      $('.reminders-box').addClass("reminders-toggle");
      $('.main-content').removeClass("my-fluid-col");
    }

    if (this.currentUser != null && this.currentUser.username) {

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

  refresh(): void {

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 400);

  }

  searchTitle: any = "Search By Parts Number";

  serviceProviderSearch: any = "";
  serviceTypeIdSearch: any = 0;


  setSearchTitle(): void {
    if (this.searchMode == 1) {
      this.searchTitle = "Search By Parts Number";
    } else if (this.searchMode == 2) {
      this.searchTitle = "Search By Parts Name";
    } else if (this.searchMode == 3) {
      this.searchTitle = "Search By Year/Make/Model/Parts Name";
    } else if (this.searchMode == 4) {
      this.searchTitle = "Search by Year/Make/Model/Parts Number";
    } else {
      this.searchTitle = "Select a Search Option"
    }

  }

  navigateToLogIn(): void {

    this.router.navigate(['/login']);
  }

  navigateToRequestparts(): void {

    this.router.navigate(['/requestparts']);
  }

  navigateToHome(): void {

    this.router.navigate(['/autoparts']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToSignUp(): void {
    this.router.navigate(['/register']);
  }


  getAllParts(): void {

    console.log("getAllParts");
    this.autopartService.getAll().subscribe({
      next: (result) => {

        //console.log(result);
        this.autopartsSearch = result;

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"
        else
          this.message = "[ " + this.autopartsSearch.length + " ] "

        console.log("====", this.autopartsSearch.length);
        //console.log("====", this.autopartsSearch);

      }
    });
  }


  setImageForSearch(autopartId: any, imageId: any) {


    console.log("setImageForSearch");

    this.autopartService.setImageForSearch(imageId, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.autopartService.get(autopartId).subscribe({
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

  setPostNewForm(): void {

    this.autopart = new AutoPart();
    this.autopart.year = undefined;
    this.autopart.stocknumber = this.randomString();
    console.log(this.autopart.year);
    // this.modeNumber = 3;
    // this.showSearchByNmberForm = false;
    // this.pagesArray = new Array();
    // this.currentUser = this.storageService.getUser();
    // if (this.currentUser == null) {
    //   this.message = "Please Sign In";
    // } else {
    //   this.showPostForm = true;
    //   this.showSearchForm = false;
    //   this.detailSelected = false;
    //   this.showSavedItems = false;
    //   this.titleSearch = "Vehicle Info";
    //   this.message = "";
    // }
  }

  clearForm() {

    this.autopart = new AutoPart();
    this.autopart.make = "";
    this.autopart.year = 0;
    this.autopart.model = "";
    this.autopart.title = "";

  }

  reload(): void {

    this.searchMode = 0;
    this.searchTitle = "Pleasa Select a Search Option"

    this.showPostForm = false;
    this.showSearchForm = false;
    this.detailSelected = false;
    this.showSavedItems = false;
    this.showSearchByNmberForm = false;
    this.modeNumber = 0;

    this.autopart = new AutoPart();

    this.searchPartWithPage(0, this.pageSize, 0, false);
    this.isSuccessful = false;



    this.searchServiceProviders(0, this.pageSize, 0, null, false);
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



  setSearchForm(): void {
    this.modeNumber = 1;
    this.showPostForm = false;
    this.showSearchForm = true;
    this.detailSelected = false;
    this.showSavedItems = false;
    this.titleSearch = "";
    this.message = "";
    this.showSearchByNmberForm = false;
    this.autopartsSearch = new Array();
    this.pagesArray = new Array();
  }

  setSearchByPartNumberForm(): void {
    this.modeNumber = 2;
    this.pagesArray = new Array();
    this.showPostForm = false;
    this.showSearchForm = false;
    this.detailSelected = false;
    this.showSavedItems = false;

    this.titleSearch = "Vehicle Info";
    this.showSearchByNmberForm = true;
    this.message = "";
    this.autopartsSearch = new Array();
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


      }, error: (e) => {
        console.log("publishAutopart error");
        this.message = e.error.message;
        console.error(e);
      }
    });

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

  AddNewRequestpart(): void {


    this.requestpart = new RequestPart();
    //this.serviceProvider.state = undefined;
    // this.selectedAutopart.id = 0;
    // this.selectedAutopart.year = undefined;
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

        this.serviceProviders.unshift(serviceProvider);
        // if (this.user.partMarketOnly == true) {
        //   this.getServiceProvidersUser(this.user.id);
        // } else {
        //   this.getServiceProviders(this.user.companyId);
        // }
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
            for (let i = 0; i < this.serviceProviders.length; i++) {
              if (this.serviceProviders[i].id == serviceProvider.id) {
                this.serviceProviders.splice(i, 1);
              }
            }
            // if (this.user.partMarketOnly == true) {
            //   // this.getServiceProvidersUser(this.user.id);
            //   this.searchServiceProviders(0, this.pageSize, 0, null, false);
            // } else {
            //   // this.getServiceProviders(this.user.companyId);
            //   this.searchServiceProviders(0, this.pageSize, 0, null, false);
            // }

            // this.isServiceProviderVisible = true;
          }
        })


      } else {

      }
    });


  }

  errorMessageRequestpart: any = "";
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
        console.log(res);
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

    console.log(" request part detail ");
    this.requestpartService.get(requestpartId).subscribe({

      next: res => {

        console.log(res);
        this.requestpart = res;
        this.requestpartSelected = res;
        //this.editAutopart(res, 0);

        this.searchRequestPartWithPage(0, this.pageSize, 0, false);
        this.detailSelected = true;
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

  aiSearchPartNumberRequestPart(requestpart: AutoPart): void {

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

              if (this.requestpart.description != null && this.requestpart.description != "")
                this.requestpart.description = fitments[0].description + this.autopart.description;
              else
                this.requestpart.description = fitments[0].description;

            } else {
              this.requestpart.description = "Not Found"
            }
          }
        }
      })
    }

  }




  saveAutopart(): void {

    if (this.imageModels.length == 0) {
      this.errorMessage = "Please choose image or images for the part";
      return;
    }

    if (this.autopart.year == null || this.autopart.year < 1000 ||

      this.autopart.make == null || this.autopart.make == "" ||
      this.autopart.model == null || this.autopart.model == ''

    ) {
      this.errorMessage = "Part Infor for year, make and model are required";
      return;
    }

    if (this.autopart.title == null || this.autopart.title == '') {
      this.errorMessage = "Parts Name is required";
      return;
    }

    if (this.autopart.description == null || this.autopart.description == '') {
      this.errorMessage = "Part Description is required";
      return;
    }

    if (this.autopart.shipping == null || this.autopart.shipping == '') {
      this.errorMessage = "Part Shipping is required";
      return;
    }

    if (this.autopart.warranty == null || this.autopart.warranty == '') {
      this.errorMessage = "Part Warranty is required";
      return;
    }

    if (this.autopart.grade == null || this.autopart.grade == '') {
      this.errorMessage = "Part Grade is required";
      return;
    }

    if (this.autopart.salePrice == null || (this.autopart.salePrice != null && this.autopart.salePrice == 0)) {
      this.errorMessage = "Part Price is required";
      return;
    }



    if (this.autopart.title != null && this.autopart.title != '' && this.autopart.title.length > 255) {
      this.errorMessage = "Parts Name is too long";
      return;
    }

    if (this.autopart.description != null && this.autopart.description != '' && this.autopart.description.length > 2000) {
      this.errorMessage = "Part Description is too long";
      return;
    }

    if (this.autopart.comments != null && this.autopart.comments != '' && this.autopart.comments.length > 2000) {
      this.errorMessage = "Part comments is too long";
      return;
    }

    if (this.autopart.description != null && this.autopart.description != '' && this.autopart.description.length < 2) {
      this.errorMessage = "Part Description is too short";
      return;
    }

    if (this.autopart.comments != null && this.autopart.comments != '' && this.autopart.comments.length < 2) {
      this.errorMessage = "Part comments is too short";
      return;
    }

    if (this.autopart.partNumber != null && this.autopart.partNumber != '' && this.autopart.partNumber.length > 255) {
      this.errorMessage = "Parts Number is too long";
      return;
    }

    if (this.autopart.stocknumber != null && this.autopart.stocknumber != '' && this.autopart.stocknumber.length < 2) {
      this.errorMessage = "Part Stock Number is too short";
      return;
    }

    if (this.autopart.stocknumber != null && this.autopart.stocknumber != '' && this.autopart.stocknumber.length > 50) {
      this.errorMessage = "Part Stock Number is too long";
      return;
    }

    var newEntry: boolean = false;

    if (this.autopart.id == null || this.autopart.id == 0)
      newEntry = true;

    if (this.imageModels.length > 0) {
      this.autopart.companyId = this.user.companyId;
      this.autopart.status = 2;
      this.autopart.published = true;
      this.autopart.reason = "posting";
      //  this.selectedAutopart = this.autopart;

      this.autopartService.create(this.autopart).subscribe({
        next: (res) => {
          console.log(res);
          this.autopartReturned = res;

          if (this.imageModels.length > 0 && (this.autopart.id == null || this.autopart.id == 0)) {
            for (let i = 0; i < this.imageModels.length; i++) {
              //this.uploadImage(this.autopartReturned.id, this.imageModels[i]);
              this.uploadImageWithFile(this.autopartReturned.id, this.imageModels[i]);

            }
          }

          // this.detailSelected = true;
          // this.selectedAutopart = this.autopartReturned;
          setTimeout(() => {

            if (newEntry == true)
              this.errorMessage = "Successfully Created";
            else
              this.errorMessage = "Successfully Updated";
            // this.imageModels = new Array();
            // this.imageUrl = null;
            this.getAutopartDetailFromServer(this.autopartReturned.id);

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

  getAutopartDetailFromServer(autopartId: any): void {

    //console.log(" autopart detail ");
    this.autopartService.get(autopartId).subscribe({

      next: res => {

        //console.log(res);
        this.autopart = res;
        this.editAutopart(res, 0);

        this.searchPartWithPage(0, this.pageSize, 0, false);
        this.detailSelected = true;
        this.showSavedItems = true;
      },
      error: err => {
        console.log(err);
      }
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

    if (this.selectedAutopart.partNumber != null && this.selectedAutopart.partNumber != '' && this.selectedAutopart.partNumber.length > 255) {
      this.message1 = "Parts Number is too long";
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

  getAutoPartById(id: any): void {

    console.log("getAutoPartById ", id);
    this.autopartService.get(id).subscribe({
      next: (result) => {
        this.selectedAutopart = result;
      }
    });
  }

  setAutopartViewCount(autopartId: any): void {

    this.autopartService.setAutopartViewCount(autopartId).subscribe({
      next: result => {

      }
    })
  }

  onSelectFileEditor(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      const file = event.target.files[0];

      console.log(file.type);

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

  uploadImage(autopartId: any, imageModel: ImageModel) {

    this.autopartService.uploadImageWithFile(imageModel, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart.imageModels.push(result);
      }
    });
  }


  private uploadImageWithFile(autopartId: any, imageModel: ImageModel) {

    this.submitted = true;
    //console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, imageModel.fileName)
    formData.append('type', imageModel.fileType)
    formData.append('autopartId', autopartId) //other param
    // formData.append('path', 'temp/') //other param

    this.autopartService.uploadImageWithFile(formData, autopartId).subscribe({
      next: (result) => {
        //console.log(result);
        this.selectedAutopart.imageModels.push(result);
        this.selectedImage = result.id;
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




  editAutopart(autoPart: AutoPart, index: any): void {

    this.getSavedItems();

    this.setAutopartViewCount(autoPart.id);

    this.detailSelected = true;
    this.selectedAutopart = autoPart;

    this.selectedAutopart.showSavedButton = true;
    this.cindex = index;

    if (autoPart.imageModels != null && autoPart.imageModels.length > 0)
      this.selectedImage = autoPart.imageModels[0].id;

    for (var i = 0; i < this.carListStringList.length; i++) {
      if (this.carListStringList[i].brand == this.selectedAutopart.make) {
        this.optionsModel = this.carListStringList[i].models;
      }

    }

    for (let i = 0; i < this.savedItems.length; i++) {
      if (this.savedItems[i].id == this.selectedAutopart.id) {
        this.selectedAutopart.showSavedButton = false;
      }
    }

    //this.showSavedItems = true;


    // this.message = "Detail:"
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


  deleteImage(autopartId: any, imageId: any) {


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

  rememberMe(): void {
    localStorage.setItem('zip', this.zipcode);
  }
  backToListing(): void {

    this.detailSelected = false;
    this.showSavedItems = false;
    this.imageModels = new Array();
    this.imageUrl = null;
    this.errorMessage = "";
    this.message1 = "";

    if (this.selectedAutopart != null && this.selectedAutopart.id > 0) {
      setTimeout(() => {
        this.scrollService.scrollToElementById(this.selectedAutopart.id);
      }, 200);
    }
  }

  archiveAutopart(autoPart: AutoPart): void {

    autoPart.archived = true;
    autoPart.status = 2;
    autoPart.reason = "archive";
    console.log("archiveAutopart");
    this.autopartService.update(autoPart.id, autoPart).subscribe({
      next: result => {

        console.log(" " + result);
        autoPart = result;
        console.log("archiveAutopart updated:", autoPart);

        //remove from search list
        for (let i = 0; i < this.autopartsSearch.length; i++) {
          if (autoPart.id == this.autopartsSearch[i].id) {
            this.autopartsSearch.slice(i, 1);
          }
        }

        //remove from saved items
        for (let i = 0; i < this.savedItems.length; i++) {
          if (autoPart.id == this.savedItems[i].id) {
            this.savedItems.slice(i, 1);
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

  setImage(index: any): void {

    this.selectedImage = this.selectedAutopart.imageModels[index].id;
  }


  currentImageIndex: number = 0;

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

    console.log(this.imageModels);
  }

  onSelectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      const file = event.target.files[0];

      console.log(file.type);

      // if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      //   alert('Only JPEG and JPG images are allowed');
      //   return;
      // }

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          // console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();
          if (file.type != null) {
            imageModel.fileType = file.type;
          }
          imageModel.fileName = file.name;
          this.message1 = '';

          imageModel.picByte = e.target.result;

          if (this.imageModels.length == 0) {
            imageModel.showInSearch = true;
            //this.preview = e.target.result;
            this.imageUrl = e.target.result;
          } else {
            imageModel.showInSearch = false;
          }

          this.imageModels.push(imageModel);

          var img = new Image();
          img.src = e.target.result;

          img.addEventListener('load', function () {

            // console.log(" width ", img.width);
            // console.log(" height ", img.height);
          });
        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }


  searchPart(): void {

    if (this.autopart.partName == null || this.autopart.partName == "")
      return;
    const data = {
      year: this.autopart.year,
      make: this.autopart.make,
      model: this.autopart.model,
      partName: this.autopart.partName,
      partNumber: "",
      zipcode: this.zipcode
    };
    this.detailSelected = false;
    this.showPostForm = false;

    this.autopartService.searchByYearMakeModelPartName(data).subscribe({
      next: (res) => {
        console.log(res);
        this.autopartsSearch = res;

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"
        else
          this.message = "[ " + this.autopartsSearch.length + " ] Matches:"

        console.log("====", this.autopartsSearch.length);
        console.log("====", this.autopartsSearch);
      },
      error: (e) => {
        console.log("No Match Found");
        this.message = e.error.message;
        console.error(e);
      }

    },
    );
  }


  // Get pagination buttons
  getPaginationButtons(): number[] {
    const totalPages = this.pagesArray.length;
    const currentPage = this.currantPageNumber;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    // if (currentPage == 0) {
    //   if (totalPages > 10)
    //     return pageNumbers.slice(0, 9);
    //   else
    //     return pageNumbers.slice(0, totalPages - 1);
    // } else {
    //   return pageNumbers.slice(Math.max(pageNumbers.indexOf(currentPage - 4), 0), Math.min(pageNumbers.indexOf(currentPage + 3), pageNumbers.length));
    // }
    return pageNumbers.slice(Math.max(pageNumbers.indexOf(currentPage - 4), 0), Math.min(pageNumbers.indexOf(currentPage + 3), pageNumbers.length));
  }

  pagingConfig: PagingConfig = {} as PagingConfig;

  searchPartWithPage(pageNumber: any, pageSize: any, modeNumber: any, withFitmentYearMakeModelPartNumber: boolean): void {


    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    //console.log(pageNumber);

    this.currantPageNumber = pageNumber;

    //pageNumber = Math.max(this.currantPageNumber - 1, 0);

    if (this.modeNumber == 0) {

    }
    // else if (this.autopart.title == null || this.autopart.title == "") {
    //   return;
    // }
    this.withFitmentYearMakeModelPartNumber = withFitmentYearMakeModelPartNumber;

    this.modeNumber = modeNumber;

    if (this.modeNumber == 2) {
      if (this.autopart.partNumber == null || this.autopart.partNumber == "") {
        this.message = "Please enter an valid part number";
        return;
      }
    }


    if (this.modeNumber == 3) {
      // if (this.autopart.title == null || this.autopart.title == "") {
      //   this.message = "Please enter an valid part name";
      //   return;
      // }
    }




    var data = {
      year: this.autopart.year,
      make: this.autopart.make,
      model: this.autopart.model,
      partName: this.autopart.title,
      partNumber: "",
      zipcode: this.zipcode,
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      mode: this.modeNumber,
      withFitment: false
    };

    if (this.modeNumber == 4) {

      if (this.withFitmentYearMakeModelPartNumber == true) {
        data = {
          year: this.autopart.year,
          make: this.autopart.make,
          model: this.autopart.model,
          partName: this.autopart.title,
          partNumber: this.autopart.partNumber,
          zipcode: this.zipcode,
          pageNumber: pageNumber,
          pageSize: pageSize,
          mode: this.modeNumber,
          withFitment: true
        };
      } else {
        data = {
          year: this.autopart.year,
          make: this.autopart.make,
          model: this.autopart.model,
          partName: this.autopart.title,
          partNumber: this.autopart.partNumber,
          zipcode: this.zipcode,
          pageNumber: pageNumber,
          pageSize: pageSize,
          mode: this.modeNumber,
          withFitment: false
        };
      }
    }

    this.detailSelected = false;
    this.showPostForm = false;

    this.showSearchByNmberForm = false;

    this.pagesArray = new Array();
    this.autopartService.searchByYearMakeModelPartNameWithPage(data).subscribe({
      next: (res) => {
        //console.log(res);
        if (modeNumber != 9) {
          this.autopartsSearchLanding = new Array();
          this.autopartsSearch = res;

          if (this.autopartsSearch.length > 0) {
            //this.searchCount = 0;
            this.searchCount = this.autopartsSearch[0].searchCount;
            this.pagesArray = new Array();
            this.pages = this.searchCount / pageSize;

            for (let i = 1; i < this.pages + 1; i++) {
              this.pagesArray.push(i);
            }

            this.message = "found [ " + this.searchCount + " ] ";

            console.log("===searchCount = ", this.searchCount);
          }

          if (this.autopartsSearch.length == 0)
            this.message = "No Match Found!"

        } else {

          this.autopartsSearchLanding = res;

          if (this.autopartsSearchLanding.length > 0) {
            //this.searchCount = 0;
            this.searchCount = this.autopartsSearchLanding[0].searchCount;
            this.pagesArray = new Array();
            this.pages = this.searchCount / pageSize;

            for (let i = 1; i < this.pages + 1; i++) {
              this.pagesArray.push(i);
            }

            this.message = "found [ " + this.searchCount + " ] ";

            console.log("===searchCount = ", this.searchCount);

            this.pagingConfig = {
              itemsPerPage: this.pageSize,
              currentPage: this.currantPageNumber,
              totalItems: this.searchCount
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

  searchRequestPartWithPage(pageNumber: any, pageSize: any, modeNumber: any, withFitmentYearMakeModelPartNumber: boolean): void {


    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    //console.log(pageNumber);

    this.currantPageNumber = pageNumber;

    //pageNumber = Math.max(this.currantPageNumber - 1, 0);

    if (this.modeNumber == 0) {

    }
    // else if (this.autopart.title == null || this.autopart.title == "") {
    //   return;
    // }
    this.withFitmentYearMakeModelPartNumber = withFitmentYearMakeModelPartNumber;

    this.modeNumber = modeNumber;

    if (this.modeNumber == 2) {
      if (this.autopart.partNumber == null || this.autopart.partNumber == "") {
        this.message = "Please enter an valid part number";
        return;
      }
    }


    if (this.modeNumber == 3) {
      // if (this.autopart.title == null || this.autopart.title == "") {
      //   this.message = "Please enter an valid part name";
      //   return;
      // }
    }




    var data = {
      year: this.autopart.year,
      make: this.autopart.make,
      model: this.autopart.model,
      partName: this.autopart.title,
      partNumber: "",
      zipcode: this.zipcode,
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      mode: this.modeNumber,
      withFitment: false
    };

    if (this.modeNumber == 4) {

      if (this.withFitmentYearMakeModelPartNumber == true) {
        data = {
          year: this.autopart.year,
          make: this.autopart.make,
          model: this.autopart.model,
          partName: this.autopart.title,
          partNumber: this.autopart.partNumber,
          zipcode: this.zipcode,
          pageNumber: pageNumber,
          pageSize: pageSize,
          mode: this.modeNumber,
          withFitment: true
        };
      } else {
        data = {
          year: this.autopart.year,
          make: this.autopart.make,
          model: this.autopart.model,
          partName: this.autopart.title,
          partNumber: this.autopart.partNumber,
          zipcode: this.zipcode,
          pageNumber: pageNumber,
          pageSize: pageSize,
          mode: this.modeNumber,
          withFitment: false
        };
      }
    }

    this.detailSelected = false;
    this.showPostForm = false;

    this.showSearchByNmberForm = false;

    this.pagesArray = new Array();
    this.requestpartService.searchByYearMakeModelPartNameWithPage(data).subscribe({
      next: (res) => {
        //console.log(res);
        if (modeNumber != 9) {
          this.autopartsSearchLanding = new Array();
          //this.autopartsSearch = res;
          this.requestpartsSearch = res;

          if (this.requestpartsSearch.length > 0) {
            //this.searchCount = 0;
            this.searchCount = this.requestpartsSearch[0].searchCount;
            this.pagesArray = new Array();
            this.pages = this.searchCount / pageSize;

            for (let i = 1; i < this.pages + 1; i++) {
              this.pagesArray.push(i);
            }

            this.message = "found [ " + this.searchCount + " ] ";

            console.log("===searchCount = ", this.searchCount);
          }

          if (this.requestpartsSearch.length == 0)
            this.message = "No Match Found!"

        } else {
          this.autopartsSearchLanding = new Array();
          this.requestpartsSearch = res;

          if (this.requestpartsSearch.length > 0) {
            //this.searchCount = 0;

            this.searchCount = this.requestpartsSearch[0].searchCount;
            this.pagesArray = new Array();
            this.pages = this.searchCount / pageSize;

            for (let i = 1; i < this.pages + 1; i++) {
              this.pagesArray.push(i);
            }

            this.message = "found [ " + this.searchCount + " ] ";

            //console.log("===searchCount = ", this.searchCount);

            this.pagingConfig = {
              itemsPerPage: this.pageSize,
              currentPage: this.currantPageNumber,
              totalItems: this.searchCount
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


  searchPartWithPage2(pageNumber: any, pageSize: any, modeNumber: any): void {

    this.currantPageNumber = pageNumber;

    if (this.modeNumber == 0) {

    }
    else if (this.autopart.title == null || this.autopart.title == "") {
      return;
    }

    // this.modeNumber = modeNumber;
    const data = {
      year: this.autopart.year,
      make: this.autopart.make,
      model: this.autopart.model,
      partName: this.autopart.title,
      partNumber: "",
      zipcode: this.zipcode,
      pageNumber: pageNumber,
      pageSize: pageSize,
      mode: this.modeNumber
    };

    this.detailSelected = false;
    this.showPostForm = false;

    this.showSearchByNmberForm = false;

    this.pagesArray = new Array();
    this.autopartService.searchByYearMakeModelPartNameWithPage(data).subscribe({
      next: (res) => {
        console.log(res);
        this.autopartsSearch = res;



        if (this.autopartsSearch.length > 0) {
          //this.searchCount = 0;
          this.searchCount = this.autopartsSearch[0].searchCount;
          this.pagesArray = new Array();
          this.pages = this.searchCount / pageSize;

          for (let i = 1; i < this.pages + 1; i++) {
            this.pagesArray.push(i);
          }

          this.message = "found [ " + this.searchCount + " ] ";

          console.log("===searchCount = ", this.searchCount);
        }

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"

        console.log("====", this.autopartsSearch.length);
        console.log("====", this.autopartsSearch);
      },
      error: (e) => {
        console.log("No Match Found");
        this.message = e.error.message;
        console.error(e);
      }

    },
    );
  }

  searchCountServiceProvider: any = 0;

  searchServiceProviders(pageNumber: any, pageSize: any, serviceTypeId: any, serviceName: any, isServiceProviderVisible: any): void {

    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    // console.log(pageNumber);

    this.currantPageNumber = pageNumber;

    // if (this.partNumber == null || this.partNumber == "")
    //   return;

    // this.modeNumber = modelNumber;
    if (isServiceProviderVisible == true)
      this.searchMode = 6;

    // this.showSearchByNmberForm =true;


    const data = {

      zipcode: this.zipcode,
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      serviceName: serviceName,
      serviceTypeId: serviceTypeId
    };

    this.detailSelected = false;
    this.showPostForm = false;
    this.pagesArray = new Array();
    this.searchCountServiceProvider = 0;

    this.autopartsSearchLanding = new Array();

    this.serviceProviderService.getServiceProdiersWithPage(data).subscribe({
      next: (res) => {
        console.log(res);
        if (res == null) {
          this.serviceProviders = new Array();
        } else {
          this.serviceProviders = res;
        }

        this.isServiceProviderVisible = isServiceProviderVisible;

        if (this.serviceProviders && this.serviceProviders.length > 0) {
          this.searchCountServiceProvider = this.serviceProviders[0].searchCount;
        }

        this.pages = this.searchCount / pageSize;

        for (let i = 1; i < this.pages + 1; i++) {
          this.pagesArray.push(i);
        }

        if (this.serviceProviders == null || this.serviceProviders.length == 0)
          this.message = "No Match Found!"
        else
          this.message = "Found [ " + this.searchCount + " ]";

        // console.log("===searchCount = ", this.searchCount);
        // console.log("====", this.autopartsSearch.length);
        // console.log("====", this.autopartsSearch);
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


  searchPartNumber(pageNumber: any, pageSize: any, modelNumber: any, withFitment: boolean): void {

    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    // console.log(pageNumber);

    this.currantPageNumber = pageNumber;

    if (this.partNumber == null || this.partNumber == "")
      return;

    // this.modeNumber = modelNumber;
    this.searchMode = 1;
    // this.showSearchByNmberForm =true;

    this.withFitment = withFitment;
    const data = {
      year: 0,
      make: "",
      model: "",
      partName: "",
      partNumber: this.partNumber,
      zipcode: this.zipcode,
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      mode: modelNumber,
      withFitment: this.withFitment
    };
    this.detailSelected = false;
    this.showPostForm = false;
    this.pagesArray = new Array();
    this.searchCount = 0;

    this.autopartService.searchPartNumberWithPage(data).subscribe({
      next: (res) => {
        //console.log(res);
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

        // console.log("===searchCount = ", this.searchCount);
        // console.log("====", this.autopartsSearch.length);
        // console.log("====", this.autopartsSearch);
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

    //https://stackoverflow.com/questions/5023602/facebook-share-link-can-you-customize-the-message-body-text

    // https://www.facebook.com/dialog/share?
    // app_id=[your-app-id]
    // &display=popup
    // &title=This+is+the+title+parameter
    // &description=This+is+the+description+parameter
    // &quote=This+is+the+quote+parameter
    // &caption=This+is+the+caption+parameter
    // &href=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F



    //var urlFeed = "https://www.facebook.com/dialog/share?app_id=123050457758183&href=" + encodeURIComponent(url) +
    var urlFeed = "https://www.facebook.com/share_channel/?link=" + encodeURIComponent(url) +

      //+ "&picture=http://fbrell.com/f8.jpg" +
      + "&display=popup" +
      //+ "&title=" + encodeURIComponent("Parthut.com: auto part market") +
      + "&caption=" + encodeURIComponent(description)
      + "&description=" + encodeURIComponent(autopart.description)
      + "&quote=" + encodeURIComponent(description);
    //https://www.facebook.com/share_channel/?link=https%3A%2F%2F50.186.250.250%2F%23%2Fdetail%2Fd9460e27-245d-4ca1-a54a-bf0d62dd2cf1NaNParthut.com%3A%20auto%20part%20marketNaN%5BA%20Pillar%5D%20for%202019%20Lamborghini%20Urus&description=Front%20Right%20Door%20Armrest%20Base%20Panel%20Upper%20Right%20Hand%20Switch%20Trim%20for%202012-2014%20Toyota%20Prius&quote=%5BA%20Pillar%5D%20for%202019%20Lamborghini%20Urus
    //https://www.facebook.com/share_channel/?link=https%3A%2F%2Fsc.mp%2Fq1zut%3Futm_source%3Dfacebook%26utm_campaign%3D3273443%26utm_medium%3Dshare_widget&app_id=966242223397117&source_surface=external_reshare&display&hashtag
    //https://www.facebook.com/login.php?skip_api_login=1&api_key=966242223397117&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fsharer%2Fsharer.php%3Fu%3Dhttps%253A%252F%252Fsc.mp%252Fq1zut%253Futm_source%253Dfacebook%2526utm_campaign%253D3273443%2526utm_medium%253Dshare_widget&cancel_url=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Fclose_window%2F%3Fapp_id%3D966242223397117%26connect%3D0%23_%3D_&display=popup&locale=en_US
    //https://www.facebook.com/dialog/feed?app_id=145634995501895&display=popup&link=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F
    // window.open('https://www.facebook.com/sharer/sharer.php?u='
    //   + encodeURIComponent(emailHtml));
    //window.open(urlFeed);
    window.open('https://www.facebook.com/sharer/sharer.php?u='
      + encodeURIComponent(url));
    return false
  }

  shareOnWhatsapp(autopart: any): boolean {
    var url = location.origin + "/#/detail/" + autopart.token;
    console.log(url);
    //navigator.clipboard.writeText(text).then().catch(e => console.log(e));
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
    //navigator.clipboard.writeText(text).then().catch(e => console.log(e));
    var description = "[" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;

    const emailHtml = `
    `+ description + `
    `+ autopart.description + `
    from: ` + document.title + `
`;
    // window.open('https://twitter.com/intent/tweet?text='
    //   + encodeURIComponent(emailHtml) + '%20' + encodeURIComponent(url), '_blank');
    window.open('https://x.com/intent/post?url=' + encodeURIComponent(url) + '&text='
      + encodeURIComponent(emailHtml), '_blank');
    return false;
  }

  shareOnInstagram(autopart: any): boolean {
    var url = location.origin + "/#/detail/" + autopart.token;
    console.log(url);
    //navigator.clipboard.writeText(text).then().catch(e => console.log(e));
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

  shareOnEmail(autopart: any): boolean {
    var url = location.origin + "/#/detail/" + autopart.token;
    console.log(url);
    //navigator.clipboard.writeText(text).then().catch(e => console.log(e));
    var description = "[" + autopart.title + "] for " + autopart.year + " " + autopart.make + " " + autopart.model;
    //   const emailHtml = `
    //   <html>
    //     <head>
    //       <title>`+ description + `</title>
    //     </head>
    //     <body>
    //       <p>`+ description + `</p>
    //       <p>`+ autopart.description + `</p>
    //       <a href=`+ url + `>Link</a><br />` + document.title + `</p>
    //     </body>
    //   </html>
    // `;

    //     const emailHtml = `
    //       <p><strong>`+ description + `</strong></p>
    //       <p>`+ autopart.description + `</p>
    //       <a href=`+ url + `>Link</a><br />` + document.title + `</p>
    // `;

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
      + encodeURIComponent(url) + '&title=' + encodeURIComponent(emailHtml), '_blank');
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

  deleteSavedItem(event: any, autopartId: any): void {
    //console.log(event.target);

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

  deleteAutopart(event: any, autopartId: any): void {
    //console.log(event.target);

    console.log("eventCheck");
    this.autopartService.deleteWithUserId(autopartId, this.user.id).subscribe({
      next: data => {
        console.log(" " + data);

        if (!this.showSearchForm)
          this.getAllParts()

      },

      error: (e) => {
        console.log("deleteAutopart error");
        this.message = e.error.message;
        console.error(e);
      }

    });
  }



  getUserById(userId: any): void {

    this.userService.getUserById(userId).subscribe({
      next: result => {
        //console.log(resul t);
        this.user = result;

        if (this.user.companyId != 0) {
          // this.getAllComponyEmployees(this.user.companyId);
          // this.getAllComponyUsers(this.user.companyId);
          this.getSettings(this.user.companyId);
          //this.getAllNotes(this.user.companyId);
          // this.getActiveBanner();
          // this.getProductionOverview();
          // this.searchVehicle(5); 
        }

        if (this.user.partMarketOnly == true) {
          //this.toggleClass();
          $('.reminders-box').addClass("reminders-toggle");
          $('.main-content').removeClass("my-fluid-col");
        }

      }
    })

  }

  banners: Banner[] = new Array();
  banner: Banner = new Banner();

  getAllBanners(): void {

    this.bannerService.getAllBanners().subscribe({
      next: result => {
        console.log(result);
        this.banners = result;
      }

    })
  }

  getActiveBanner(): void {

    this.bannerService.getActiveBanner().subscribe({
      next: result => {
        console.log(result);
        this.banner = result;
      }

    })
  }

  getServiceProvidersUser(userId: any): void {
    console.log("getServiceProviders");
    this.serviceProviderService.getAllServiceProviderUser(userId).subscribe({
      next: result => {
        console.log(result);
        this.serviceProviders = result;
      }
    })
  }


  getServiceProviders(companyId: any): void {
    this.serviceProviderService.getAllServiceProvider(companyId).subscribe({
      next: result => {
        console.log(result);
        this.serviceProviders = result;
      }
    })
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

  getServiceTypes(): void {

    this.serviceTypeService.getAllServiceType().subscribe({
      next: result => {
        // console.log(result);
        this.serviceTypes = result;
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

  // formatPhoneNumber(phoneNumberString: any): string {
  //   var formattedNumber = "";
  //   var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  //   var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  //   if (match) {
  //     formattedNumber = '(' + match[1] + ') ' + match[2] + '-' + match[3];
  //   }
  //   return formattedNumber;
  // }


  counter: any = 0;
  hover: any = null;
  sortValue: any = "id";

  letsSort(fieldName: any) {

    if (this.autopartsSearch.length == 0 && this.autopartsSearchLanding.length > 0) {
      this.sortListLanding(fieldName);
    } else if (this.isServiceProviderVisible == false && this.isListViewVisible && this.autopartsSearch.length > 0) {
      this.sortList(fieldName);
    } else if (this.isSavedItemVisible == true) {
      this.sortListSavedItem(fieldName);
    } else if (this.isServiceProviderVisible == true) {
      this.sortListServiceProvider(fieldName);
    }

  }
  sortList(fieldName: any): void {
    this.counter++;

    console.log(fieldName);

    if (fieldName == 'id') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.id - b.id);
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.id - a.id);
    }

    // if (fieldName == 'status') {

    //   for (let vehicle of this.autopartsSearch) {
    //     vehicle.sortStr = "";
    //     for (let status of this.statuss) {
    //       if (status.id == vehicle.status) {
    //         vehicle.sortStr = status.name;
    //       }
    //     }
    //   }

    //   if (this.counter % 2 == 1)
    //     this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
    //   else
    //     this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));

    // }

    if (fieldName == 'year') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.year - b.year);
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.year - a.year);
    }

    if (fieldName == 'make') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['make'].localeCompare(b['make']));
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['make'].localeCompare(a['make']));
    }

    if (fieldName == 'model') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['model'].localeCompare(b['model']));
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['model'].localeCompare(a['model']));
    }

    if (fieldName == 'title') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['title'].localeCompare(b['title']));
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['title'].localeCompare(a['title']));
    }

    if (fieldName == 'stocknumber') {
      //this.autopartsSearch = this.autopartsSearch.filter(item => item['stocknumber'] !== null);
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['stocknumber'].localeCompare(b['stocknumber']));
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['stocknumber'].localeCompare(a['stocknumber']));
    }

    if (fieldName == 'partNumber') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => (a['partNumber'] ?? "").localeCompare((b['partNumber'] ?? "")));
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => (b['partNumber'] ?? "").localeCompare((a['partNumber'] ?? "")));

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

    if (fieldName == 'viewCount') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.viewCount - b.viewCount);
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.viewCount - a.viewCount);
    }



    if (fieldName == 'createdAt') {
      if (this.counter % 2 == 1)
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      else
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

  }

  sortListLanding(fieldName: any): void {
    this.counter++;

    if (fieldName == 'id') {
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a.id - b.id);
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b.id - a.id);
    }


    if (fieldName == 'year') {
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a.year - b.year);
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b.year - a.year);
    }

    if (fieldName == 'make') {
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a['make'].localeCompare(b['make']));
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b['make'].localeCompare(a['make']));
    }

    if (fieldName == 'model') {
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a['model'].localeCompare(b['model']));
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b['model'].localeCompare(a['model']));
    }



    if (fieldName == 'title') {
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a['title'].localeCompare(b['title']));
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b['title'].localeCompare(a['title']));
    }

    if (fieldName == 'stocknumber') {
      //this.autopartsSearchLanding = this.autopartsSearchLanding.filter(item => item['stocknumber'] !== null);
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a['stocknumber'].localeCompare(b['stocknumber']));
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b['stocknumber'].localeCompare(a['stocknumber']));
    }

    // if (fieldName == 'partNumber') {
    //   //this.autopartsSearchLanding = this.autopartsSearchLanding.filter(item => item['stocknumber'] !== null);
    //   if (this.counter % 2 == 1)
    //     this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a['partNumber'].localeCompare(b['partNumber']));
    //   else
    //     this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b['partNumber'].localeCompare(a['partNumber']));
    // }
    if (fieldName == 'partNumber') {
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => (a['partNumber'] ?? "").localeCompare((b['partNumber'] ?? "")));
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => (b['partNumber'] ?? "").localeCompare((a['partNumber'] ?? "")));

    }

    if (fieldName == 'description') {
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a['description'].localeCompare(b['description']));
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b['description'].localeCompare(a['description']));
    }

    if (fieldName == 'grade') {
      this.autopartsSearchLanding = this.autopartsSearchLanding.filter(item => item['grade'] !== null);
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a['grade'].localeCompare(b['grade']));
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b['grade'].localeCompare(a['grade']));
    }

    if (fieldName == 'salePrice') {
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a.salePrice - b.salePrice);
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b.salePrice - a.salePrice);
    }

    if (fieldName == 'distance') {
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a.distance - b.distance);
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b.distance - a.distance);
    }

    if (fieldName == 'viewCount') {
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => a.viewCount - b.viewCount);
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => b.viewCount - a.viewCount);
    }

    if (fieldName == 'createdAt') {
      if (this.counter % 2 == 1)
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      else
        this.autopartsSearchLanding = this.autopartsSearchLanding.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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

    if (fieldName == 'make') {
      if (this.counter % 2 == 1)
        this.savedItems = this.savedItems.sort((a, b) => a['make'].localeCompare(b['make']));
      else
        this.savedItems = this.savedItems.sort((a, b) => b['make'].localeCompare(a['make']));
    }

    if (fieldName == 'model') {
      if (this.counter % 2 == 1)
        this.savedItems = this.savedItems.sort((a, b) => a['model'].localeCompare(b['model']));
      else
        this.savedItems = this.savedItems.sort((a, b) => b['model'].localeCompare(a['model']));
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
      this.savedItems = this.savedItems.filter(item => item['grade'] !== null);
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

    if (fieldName == 'viewCount') {
      if (this.counter % 2 == 1)
        this.savedItems = this.savedItems.sort((a, b) => a.viewCount - b.viewCount);
      else
        this.savedItems = this.savedItems.sort((a, b) => b.viewCount - a.viewCount);
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



  reset(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.successMessageVehicle = "";
    this.errorMessageVehicle = "";
    this.vehicle = new Vehicle();
    this.vehicle.customer = new Customer();

    if (this.editModeCustomer == false)
      this.editModeCustomer = true;

    // this.vehicles = new Array();
    //this.unLabelList();
  }


  onChange($event: any, make: string) {

    this.optionsModel = [
      "not selected", "asd"
    ];

    this.carListStringList = this.carList as Brand[];
    for (var i = 0; i < this.carListStringList.length; i++) {
      if (this.carListStringList[i].brand == make) {
        this.optionsModel = this.carListStringList[i].models;
      }


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

  searchVin(): void {

    if (this.vin != null && this.vin.length == 17) {
      // this.autopartService.getVin(this.vin).subscribe({
      //   next: (res) => {
      //     console.log(res);
      //     this.autopart = res;
      //     this.showSearchVin = false;

      //     for (var i = 0; i < this.carListStringList.length; i++) {
      //       if (this.carListStringList[i].brand == this.autopart.make) {
      //         this.optionsModel = this.carListStringList[i].models;
      //       }

      //     }

      //     this.vinSearched = true;

      //   },
      //   error: (e) => console.error(e)
      // });

      this.autopartService.getVin(this.vin).subscribe({
        next: (res) => {
          console.log(res);
          this.autopart = res;
          this.vehicle.year = this.autopart.year;
          this.vehicle.make = this.autopart.make;
          this.vehicle.model = this.autopart.model;
          this.vehicle.description = this.autopart.description;
          this.autopart.comments = this.autopart.description;
          this.autopart.description = "";
          this.autopart.stocknumber = this.randomString();
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
          // this.vinSearched = true;

        },
        error: (e) => console.error(e)
      });
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

  showVehicleListing: boolean = true;

  toggleDivs() {
    this.showVehicleListing = !this.showVehicleListing;
  }
  checkWindowWidth(): void {
    const windowWidth = this.renderer.parentNode(this.el.nativeElement).clientWidth;

    if (windowWidth < 767) {
      $('.reminders-box').addClass("reminders-toggle");
      $('.main-content').removeClass("my-fluid-col");
      this.showGridView();
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


  setActiveButton(buttonName: string): void {
    this.activeButton = buttonName;
  }

  isListViewVisible = true;
  isGridViewVisible = false;
  isSavedItemVisible = false;
  pageTitle = "AUTO PARTS MARKET";
  isServiceProviderVisible: boolean = false;

  showListView() {
    this.isServiceProviderVisible = false;
    this.isListViewVisible = true;
    this.isGridViewVisible = false;
    this.isSavedItemVisible = false;
    this.pageTitle = "AUTO PARTS MARKET";
  }

  showGridView() {
    this.isServiceProviderVisible = false;
    this.isListViewVisible = false;
    this.isGridViewVisible = true;
    this.isSavedItemVisible = false;
    this.pageTitle = "AUTO PARTS MARKET";
  }

  showSavedItemsListView() {
    this.isListViewVisible = false;
    this.isGridViewVisible = false;
    this.isServiceProviderVisible = false;
    this.isSavedItemVisible = true;
    this.searchMode = 1;
    this.pageTitle = "AUTO PARTS MARKET: My Saved Items";
  }



  showServiceProviderView() {

    this.isListViewVisible = false;
    this.isGridViewVisible = false;
    this.isSavedItemVisible = false;
    this.isServiceProviderVisible = true;
    this.searchMode = 6;
    this.pageTitle = "SERVICE PROVIDERS";

  }

  detailSelectedServiceProvider: boolean = false;

  editServiceProvider(serviceProvider: ServiceProvider, index: any): void {

    this.cindex = index;
    this.selectedServiceProvider = serviceProvider;
    this.serviceProvider = serviceProvider;
    this.detailSelectedServiceProvider = true;

    //this.setAutopartViewCount(autoPart.id);

  }

  aiSearchPartNumber(autopart: AutoPart): void {

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
              if (this.autopart.description != null && this.autopart.description != "")
                this.autopart.description = fitments[0].description + this.autopart.description;
              else
                this.autopart.description = fitments[0].description;

            } else {
              this.autopart.description = "Not Found"
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
        //this.autopartService.getFitmentFromCohereAi(fitmentRequest).subscribe({
        next: result => {
          if (result != null) {

            console.log(result);
            var fitments = new Array();
            fitments = result;

            if (fitments.length > 0) {
              //this.autopart.title = fitments[0].description;
              if (this.autopart.description != null && this.autopart.description != "")
                this.autopart.description = fitments[0].description + this.autopart.description;
              else
                this.autopart.description = fitments[0].description;

            }
          }
        }
      })
    }

  }


}