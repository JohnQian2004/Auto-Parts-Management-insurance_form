import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { AutopartService } from '../_services/autopart.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import { StorageService } from '../_services/storage.service';
import { SavedItemService } from '../_services/saveditem.service';
import { Saveditem } from '../models/saveditem.model';
import { AutoPart } from '../models/autopart.model';
import { Config } from '../models/config.model';
import { VehicleService } from '../_services/vehicle.service';
import { Vehicle } from '../models/vehicle.model';
import { ImageModel } from '../models/imageModel.model';
import { TimeScale } from 'chart.js';
import { Status } from '../models/status.model';
import { StatusService } from '../_services/status.service';
import { User } from '../models/user.model';
import { Employee } from '../models/employee.model';
import { JobService } from '../_services/job.service';
import { Job } from '../models/job.model';
import { Platform } from '@angular/cdk/platform';
import { UserService } from '../_services/user.service';
import { EmployeeService } from '../_services/employee.service';
import { SettingService } from '../_services/setting.service';
import { EmployeeRole } from '../models/employee.role.model';
import { Setting } from '../models/setting.model';
import { GroupBy } from '../models/groupBy.model';
import { Location } from '@angular/common';
import { EmployeeRoleService } from '../_services/employee.role.service';
import { ApprovalStatus } from '../models/approval.status.model';
import { ApprovalStatusService } from '../_services/approval.status.service';
import { Vendor } from '../models/vendor.model';
import { VendorService } from '../_services/vendor.service';

@Component({
  selector: 'app-detail-vehicle',
  templateUrl: './detail-vehicle.component.html',
  styleUrls: ['./detail-vehicle.component.css']
})
export class DetailVehicleComponent implements OnInit {



  readyOnly: boolean = false;

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";

  autopartId: string = "";
  uuid: string = "";
  selectedVehicle: any;
  vehicles: Vehicle[] = new Array();
  vehiclesOriginal: Vehicle[] = new Array();
  statuss: Status[] = new Array();
  employees: Employee[] = new Array();

  searchInput: any = "";

  selectedImage: any = 0;
  currentUser: any;
  private sub: any;

  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/vehicle/getImage';
  baseUrlResizeImage = this.config.baseUrl + '/vehicle/getResize';

  baseUrlResizeImageParts = this.config.baseUrl + '/getResize';


  showSavedItems: boolean = false;
  savedItems: AutoPart[] = new Array();
  message: any;
  cindex: any;
  showSavedItem: boolean = false;

  display: any;
  center = {
    lat: 22.2736308,
    lng: 70.7512555
  };
  zoom = 6;

  user: User = new User();

  pageSize: any = 100;

  approvalStatuss: ApprovalStatus[] = new Array();
  approvalStatus: ApprovalStatus = new ApprovalStatus();



  constructor(private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private storageService: StorageService,
    private savedItemService: SavedItemService,
    private eventBusService: EventBusService,
    private autopartService: AutopartService,
    private vehicleService: VehicleService,
    private statusService: StatusService,
    private jobService: JobService,
    private platform: Platform,
    private userService: UserService,
    private employeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService,
    private settingService: SettingService,
    private approvalStatusService: ApprovalStatusService,
    private vendorService: VendorService

  ) {

  }

  url: any = "";

  isMobile: boolean = false;

  employeeId: any;
  selectedTab: any = 0;

  // Method to handle the selected tab
  // onTabSelected(tabIndex: number) {
  //   this.selectedTab = tabIndex;
  //   console.log(`Selected tab: ${tabIndex}`);

  // }

  // New variables to control button presentation
  bottomMenuSetting = [
    {
      label: 'HOME', tooltip: 'Vehicle details', icon: 'fa-solid fa-home', notification: 5,
      selectedTab: 0, sectionId: 0, sectionTooltip: 'Vehicle details'
    },
    {
      label: 'PARTS', tooltip: 'Purchase Order', icon: 'fa-solid fa-cart-shopping', notification: 2,
      selectedTab: 1, sectionId: 1, sectionTooltip: 'Vehicle Parts'
    },
    {
      label: 'JOBS', tooltip: 'Vehicle Jobs', icon: 'fa-solid fa-list', notification: 0,
      selectedTab: 2, sectionId: 2, sectionTooltip: 'Vehicle Jobs'
    },
    // {
    //   label: 'PAYROLL', tooltip: 'Payroll', icon: 'fa-solid fa-bank', notification: 3,
    //   selectedTab: 3, sectionId: 3, sectionTooltip: 'Payroll'
    // },
    {
      label: 'SETTING', tooltip: 'Preferences', icon: 'fa-solid fa-cogs', notification: 0,
      selectedTab: 4, sectionId: 4, sectionTooltip: 'Preferences'
    }
  ];


  menuTextColor = 'text-white'; // Default text color
  menuTextColorActive = 'text-warning'; // Active text color
  showNotification = false; // Flag to control visibility of notification badge

  selectedTabMain: any;

  getSettings(companyId: any): void {
    this.settingService.getSetting(companyId).subscribe({
      next: result => {
        this.setting = result;

      }
    })
  }

  // Handle tab selection event, update the parent component state
  onTabSelected(event: { selectedTab: number, sectionId: number, sectionTooltip: string }) {
    this.selectedTab = event.selectedTab;
    this.selectedTabMain = this.selectedTab;

    console.log(`Selected Tab: ${event.selectedTab}`);
    console.log(`Section ID: ${event.sectionId}`);
    console.log(`Section Tooltip: ${event.sectionTooltip}`);

    if (this.selectedTab == 0) {

      this.bottomMenuSetting = [
        {
          label: 'HOME', tooltip: 'Vehicle details', icon: 'fa-solid fa-home', notification: 5,
          selectedTab: 0, sectionId: 0, sectionTooltip: 'Vehicle details'
        },
        {
          label: 'PARTS', tooltip: 'Purchase Order', icon: 'fa-solid fa-cart-shopping', notification: 2,
          selectedTab: 1, sectionId: 1, sectionTooltip: 'Vehicle Parts'
        },
        {
          label: 'JOBS', tooltip: 'Vehicle Jobs', icon: 'fa-solid fa-list', notification: 0,
          selectedTab: 2, sectionId: 2, sectionTooltip: 'Vehicle Jobs'
        },
        // {
        //   label: 'PAYROLL', tooltip: 'Payroll', icon: 'fa-solid fa-bank', notification: 3,
        //   selectedTab: 3, sectionId: 3, sectionTooltip: 'Payroll'
        // },
        {
          label: 'SETTING', tooltip: 'Preferences', icon: 'fa-solid fa-cogs', notification: 0,
          selectedTab: 4, sectionId: 4, sectionTooltip: 'Preferences'
        }
      ];
    }
    if (this.selectedTab == 3) {
      this.bottomMenuSetting = [
        {
          label: 'HOME', tooltip: 'Jobs', icon: 'fa-solid fa-home', notification: 5,
          selectedTab: 0, sectionId: 0, sectionTooltip: 'Jobs'
        },
        {
          label: 'PAYROLL', tooltip: 'Payroll', icon: 'fa-solid fa-bank', notification: 3,
          selectedTab: 3, sectionId: 3, sectionTooltip: 'Payroll'
        }
      ];

    }
  }


  ngOnInit() {

    if (this.platform.ANDROID) {
      console.log('Running on Android');
      this.isMobile = true;
    } else if (this.platform.IOS) {
      console.log('Running on iOS');
      this.isMobile = true;
    } else if (this.platform.isBrowser) {
      console.log('Running in a browser');
    }

    this.sub = this.route.params.subscribe(params => {
      // this.autopartId = params['autopartId']; // (+) converts string 'id' to a number
      // console.log(this.autopartId);
      // this.eventBusService.emit(new EventData('noshow', this.autopartId));
      // this.currentUser = this.storageService.getUser();
      // this.getDetail(this.autopartId);

      //this.getDetail(this.autopartId);


      // this.currentUser = this.storageService.getUser();
      // try {
      //   if (this.currentUser != null) {
      //     this.getUserById(this.currentUser.id);
      //   } else {
      //     this.router.navigate(['/login']);
      //   }
      // } catch (ex) { }

      this.uuid = params['uuid']; // (+) converts string 'id' to a number
      console.log(this.uuid);
      this.eventBusService.emit(new EventData('noshow', this.uuid));
      this.currentUser = this.storageService.getUser();



      //this.url = location.origin + "/#/vehicle/" + this.uuid;
      //this.user.allowUpdateVehicleStatus = true;
      //this.user.allowAssignUser = true;

      if (this.currentUser == null) {
        this.openPopup();
      } else {
        this.closePopup();
        try {
          this.getDetailByUuid(this.uuid);

          // this.getUserById(this.currentUser.id);

          setTimeout(() => {
            window.print();
          }, 1200);

        } catch (error) {
          this.openPopup();
        }
      }


    });
  }


  getUserById(userId: any): void {

    this.userService.getUserById(userId).subscribe({
      next: result => {
        //console.log(result);
        this.user = result;

        if (this.user.partMarketOnly == true) {

          this.openPopup();
          this.errorMessage = "you are not authorized. Please select read only option ";
          //this.router.navigate(['/autoparts']);
        }

        if (this.user.companyId != 0 && this.selectedVehicle.companyId == this.user.companyId) {
          // this.getCompanyApprovalStatus(this.user.companyId);
          this.getCompanyEmployeeRoles(this.user.companyId);
          this.getAllComponyEmployees(this.user.companyId);
          this.getCompanyVendor(this.user.id);
          // this.getAllComponyUsers(this.user.companyId);
          // //this.getSettings(this.user.companyId);

          // this.getProductionOverview();

          this.searchVehicle(7, 0, this.pageSize);
          // this.searchVehicle(5, 0, this.pageSize);

        } else {
          this.user = new User();
          this.openPopup();
          this.errorMessage = "you are not authorized. Please select read only option ";
        }

      }
    })

  }

  users: User[] = new Array();
  setting: Setting = new Setting();
  employeeRoles: EmployeeRole[] = new Array();
  statusOverview: GroupBy[] = new Array();
  locationOverview: GroupBy[] = new Array();

  searchType: any = 0;

  currantPageNumber: any = 0;
  vehicle: any = new Vehicle();




  searchVehicle(type: number, pageNumber: any, pageSize: any): void {

    this.searchType = type;

    this.errorMessage = "";

    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    const data = {
      type: type,
      year: this.vehicle.year,
      make: this.vehicle.make,
      model: this.vehicle.model,
      color: this.vehicle.color,
      archived: false,
      companyId: this.user.companyId,
      partNumber: "placeholder",
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      lastName: this.searchInput   // only when type == 6
    };

    //console.log(data);

    this.vehicleService.searchByYearMakeModelColor(data).subscribe({
      next: (res) => {
        //console.log(res);

        if (type === 7) {
          this.vehiclesOriginal = res;
          this.vehiclesOriginal = this.vehiclesOriginal.sort((a, b) => {
            // First, compare by 'make'
            const makeComparison = a.make.localeCompare(b.make);

            if (makeComparison !== 0) {
              return makeComparison;
            }

            return a.model.localeCompare(b.model);
          });

          // this.vehiclesOriginal = this.vehiclesOriginal.sort((a, b) => a['make'].localeCompare(b['make']));
          for (let vehicle33 of this.vehiclesOriginal) {
            for (let status of this.statuss) {
              if (vehicle33.status == status.id) {
                vehicle33.statusString = status.name;
              }
            }
          }

        } else {

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

      }, error: (e) => console.log(e)
    })
  }

  getAllComponyUsers(companyId: any): void {

    this.userService.getAllCompanyUsers(companyId).subscribe({
      next: result => {
        this.users = result;
      }
    });
  }

  getCompanyApprovalStatus(companyId: any): void {

    this.approvalStatusService.getAllCompanyApprovalStatus(companyId).subscribe({
      next: result => {
        this.approvalStatuss = result;
      }
    })
  }


  getCompanyVendor(companyId: any): void {

    this.vendorService.getAllCompanyVendor(companyId).subscribe({
      next: result => {
        this.approvalStatuss = result;
      }
    })
  }

  getCompanyEmployeeRoles(companyId: any): void {

    this.employeeRoleService.getAllCompanyEmployeeRole(companyId).subscribe({
      next: result => {
        this.employeeRoles = result;
      }

    })
  }

  getAllComponyEmployees(companyId: any): void {

    this.employeeService.getComponyEmployees(companyId).subscribe({
      next: result => {
        if (result)
          //this.users = result;
          this.employees = result;

        for (let employee of this.employees) {
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

  displayStyle: any = "None";
  form: any = {
    username: null,
    password: null
  };


  isActivated = false;
  counterFailed: any = 0;

  showResentComformation = false;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  openPopup() {
    this.readyOnly = false;
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
    this.readyOnly = true;
    this.getDetailByUuid(this.uuid);
  }

  logout(): void {

    console.log(" logging out ");
    this.authService.logout().subscribe({

      next: res => {
        console.log(res);

        this.storageService.clean();
        this.isLoggedIn = false;
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onSubmit(): void {


    const { username, password } = this.form;

    console.log("===login");
    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.isActivated = this.storageService.getUser().activated;

        if (!this.isActivated) {
          this.isLoginFailed = true;
          this.isLoggedIn = false;
          this.storageService.clean();
          this.showResentComformation = true;
          this.errorMessage = "user is not activated, please check your mailbox for activation";
        } else {

          window.location.reload();
          //this.closePopup();

        }

      },
      error: err => {
        this.errorMessage = err.error.message;
        if (this.errorMessage == "Bad credentials")
          this.errorMessage = "Wrong password, please enter correct password";
        this.isLoginFailed = true;
        this.counterFailed++;
        // console.log(this.counterFailed);
      }
    });
  }


  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' }); // Optional: smooth scrolling
    }
  }


  getDetailByUuid(uuid: any): void {

    console.log(" vehicle detail ");
    this.url = location.origin + "/#/vehicle2/" + uuid;
    //this.router.navigate(['vehicle/'+ uuid], { replaceUrl: true });
    this.location.go("/vehicle/" + uuid);
    this.vehicleService.getByUuid(uuid).subscribe({

      next: res => {
        //console.log(res);
        this.selectedVehicle = res;
        this.statuss = this.selectedVehicle.statuss;
        this.employees = this.selectedVehicle.employees;
        this.settingService.getSetting(this.selectedVehicle.companyId).subscribe({
          next: result => {

            console.log(result);
            this.setting = result;

          }
        })
        //this.getSettings(this.selectedVehicle.companyId);
        // this.selectedVehicle.showSavedButton = true;
        // if (this.selectedVehicle.imageModels.length > 0) {
        //   this.selectedVehicle.imageModels = this.selectedVehicle.imageModels.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
        // }

        // this.selectedImage = this.selectedVehicle.showInSearchImageId;
        // this.center = {
        //   lat: this.selectedVehicle.lat,
        //   lng: this.selectedVehicle.lng
        // };

        if (this.selectedVehicle.id > 0) {
          //this.getAutopartForVehicle(this.selectedVehicle.id, true);
          //this.getVehicleJobs2(this.selectedVehicle.token);
          //this.getCompanyApprovalStatus(this.selectedVehicle.companyId);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  vendors: Vendor[] = new Array();


  onChangeAutopartPurchaseStatus($event: any, autopart: AutoPart): void {

    autopart.purchaseStatus = $event.target.value;
    console.log(autopart.purchaseStatus);
    if (autopart.purchaseStatus == 0) {
      autopart.reason = "no status";
    } else if (autopart.purchaseStatus == 1) {
      autopart.reason = "ordered";
      autopart.orderedAt = new Date();
    } else if (autopart.purchaseStatus == 2) {
      autopart.receivedAt = new Date();
      autopart.reason = "received"
      // const element = document.getElementById('uploadButton');
      // if (element) {
      //   element.click();
      // }
    } else if (autopart.purchaseStatus == 3) {
      autopart.reason = "returned"
      autopart.returnedAt = new Date();
    } else if (autopart.purchaseStatus == 4) {
      autopart.reason = "wrong part"
      autopart.updatedAt = new Date();
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


  getCompanyStatus(companyId: any): void {

    this.statusService.getAllCompanyStatus(companyId).subscribe({
      next: result => {
        if (result) {
          this.statuss = result;
        }
      }
    })
  }

  currentIndex: any = -1;
  currentIndexJob: any = -1;




  getDetailsAutopart(autopart: AutoPart, index: any): void {
    this.currentIndex = index;
    this.selectedAutopart = autopart;
  }

  job: Job = new Job();

  getDetailsJob(job: Job, index: any): void {
    this.currentIndexJob = index;
    this.job = job;
  }

  onChangeEmployee2($event: any, employeeId: any, job: Job) {

    job.employeeId = employeeId;
    job.reason = "assign";


    for (let employee of this.employees) {
      if (employee.id == employeeId) {
        if (employee.commissionBased == false) {
          // job.price = +((this.getVehicleRemaining(this.selectedVehicle) * employee.rolePrecentage / 100).toFixed(0));
        } else {
          //commisson based
          //  job.price = +((this.getTotalSupplements(this.selectedVehicle) * employee.rolePrecentage / 100).toFixed(0));
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
        // this.getVehicleJobs2(this.vehicle.id);

        // if (this.currentEmplyeeId == employeeId) {
        //   this.getMyJobs(employeeId);
        // }

        // this.syncJob(this.job);
      }
    })

  }

  getVehicleCostManagement(vehicle: any): any {

    return +(this.getVehicleRemaining(vehicle) * 0.5).toFixed(0);
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
    return totalCostsParts + totalCostJobs + totalTax;

  }

  isJobChecked(job: Job): boolean {

    if (job.status != 0)
      return true;
    return false;
  }

  getTotalJobPrice(jobs: Job[]): any {

    var total = 0;
    for (let job of jobs) {
      total += job.price;
    }

    return total;

  }

  getSaleTax(vehicle: any): any {

    var total = 0;

    total = (vehicle.price + this.getTotalSupplements(vehicle)) * 0.06;
    total = +(total.toFixed(0));

    return total;

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

        //this.syncJob(this.job);
        //this.filterVehicleJobs();

        //this.getVehicleJobs(this.vehicle.id);
        //this.getVehicleJobs2(this.vehicle.id);
      }, error: (e) => console.log(e)
    })
  }
  currentEmplyeeId: any;

  getVehicleGross(vehicle: any, jobs: any): any {
    var total = 0;
    var totalEstimate = this.getVehicleTotalEstimates(vehicle);
    total = totalEstimate - this.getVehicleTotalCosts(vehicle, jobs);
    return total;
  }

  getVehicleTotalEstimates(vehicle: Vehicle): any {
    var total = 0;
    total = +vehicle.price + +(this.getTotalSupplements(vehicle));

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

  getTotalSupplements(vehicle: any): any {
    var total = 0;

    if (vehicle.supplements.length > 0) {
      for (let supplement of vehicle.supplements) {
        total += supplement.price;
      }
    }
    total = +(total.toFixed(0));
    return total;
  }

  imageModels: ImageModel[] = new Array();
  imageUrl: any;

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

  createNewAutopart(): void {

    // if (this.imageModels.length == 0) {
    //   this.errorMessage = "Please choose image or images for the part";
    //   return;
    // }

    this.selectedAutopart.year = this.selectedVehicle.year;
    this.selectedAutopart.make = this.selectedVehicle.make;
    this.selectedAutopart.model = this.selectedVehicle.model;
    this.selectedAutopart.purchaseStatus = 0;

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
    this.selectedAutopart.companyId = this.selectedVehicle.companyId;
    this.selectedAutopart.status = 0;
    this.selectedAutopart.purchaseStatus = 0;
    // this.selectedAutopart.sequenceNumber = -1;
    this.selectedAutopart.published = false;
    this.selectedAutopart.reason = "posting";
    this.selectedAutopart.vehicleId = this.selectedVehicle.id;

    this.autopartService.create(this.selectedAutopart).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedAutopart = res;

        if (this.imageModels.length > 0) {
          for (let i = 0; i < this.imageModels.length; i++) {

            this.imageModels[i] = this.uploadAutopartImageWithFile(this.selectedAutopart.id, this.imageModels[i]);
          }

          setTimeout(() => {
            this.getAutopartForVehicle(this.selectedVehicle.id, true);

          }, 2000);
        } else {
          this.autopartsSearch.unshift(this.selectedAutopart);
        }

        this.errorMessage = "Created Successfully";




      },
      error: (e) => console.error(e)
    });

  }

  getAutopartFromUuid(autopartId: any): any {
    this.autopartService.getByUuid(autopartId).subscribe({

      next: result => {
        console.log(result);
        return result;
      }
    })

  }


  displayStyleNewParts: any = "None";

  addNewParts(): void {
    this.selectedAutopart = new AutoPart();
    this.selectedAutopart.id = 0;
    this.selectedAutopart.salePrice = undefined;
    this.selectedAutopart.title = undefined;
    this.imageModels = new Array();
    this.imageUrl = null;
    this.selectedAutopart.stocknumber = this.randomString();

    // this.detailSelected = true;
    this.message1 = "";
    this.errorMessage = "";
    this.displayStyleNewParts = "block";
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

  private uploadAutopartImageWithFile(autopartId: any, imageModel: ImageModel): any {


    console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', autopartId) //other param


    this.autopartService.uploadImageWithFile(formData, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        imageModel = result;

        return imageModel;
      }
    });


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

          this.uploadImageWithFileAutoparts(this.selectedAutopart.id, imageModel);

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

  private uploadImageWithFileAutoparts(autopartId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFileAutoparts");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', autopartId) //other param


    this.autopartService.uploadImageWithFileWithUserId(formData, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart.imageModels.unshift(result);
      }
    });


  }

  uploadImageAutoparts(autopartId: any, imageModel: ImageModel) {

    this.autopartService.uploadImage(imageModel, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart.imageModels.unshift(result);
        // this.selectedAutopart.showInSearchImageId = result.id;
        // if (this.selectedAutopart.imageModels.length == 1) {
        //   this.selectedAutopart.showInSearchImageId = result.id;
        // }
      }
    });
  }

  setImageForSearchAutoparts(autopartId: any, imageId: any) {


    console.log("setImageForSearch");

    this.autopartService.setImageForSearch(imageId, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.selectedAutopart.imageModels.length; i++) {
          if (this.selectedAutopart.imageModels[i].id == imageId) {
            this.selectedAutopart.showInSearchImageId = this.selectedAutopart.imageModels[i].id;
            //this.selectedImage = this.selectedAutopart.showInSearchImageId;
          }
        }
      }
    });
  }

  deleteImageAutopart(autopartId: any, imageId: any) {


    console.log("deleteImage");

    this.autopartService.deleteImageWihtUserId(imageId, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.selectedAutopart.imageModels.length; i++) {
          if (this.selectedAutopart.imageModels[i].id == imageId) {
            this.selectedAutopart.imageModels.splice(i, 1);
          }
        }
      }
    });
  }

  autopartsSearch = new Array();
  selectedAutopart: AutoPart = new AutoPart();

  getAutopartForVehicle(vehicleId: any, resetSelectedPart: boolean) {
    if (resetSelectedPart == true) {
      this.autopartsSearch = new Array();
      this.selectedAutopart = new AutoPart();
      this.selectedAutopart.showInSearchImageId = 0;
      this.selectedImage = 0;
    }

    this.autopartService.getAutopartForVehicle(vehicleId).subscribe({
      next: result => {
        // console.log(result);
        this.autopartsSearch = result;
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.id - a.id);
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

  autopartReceivedCount: any = 0;

  getAutopartReceivedCounts(): any {
    var total = 0;
    for (let autopart of this.autopartsSearch) {
      if (autopart.purchaseStatus != undefined && autopart.purchaseStatus == 2) {
        total++;
      }
    }

    return total;
  }

  jobCompletedCount: any = 0;
  jobs: Job[] = new Array();
  vehicleJobsOnly: boolean = false;

  getVehicleJobs2(vehicleUuid: any): void {

    //this.serviceJobs = new Array();
    this.jobCompletedCount = 0;
    this.jobService.getAllVehicleJobs2Uuid(vehicleUuid).subscribe({
      next: result => {
        if (result) {
          this.jobs = result;
          this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

          // for (let i = 0; i < this.vehicles.length; i++) {
          //   if (this.vehicles[i].id == vehicleId) {
          //     this.vehicles[i].jobs = this.jobs;
          //   }
          // }

          this.jobCompletedCount = this.getJobStatus();

          if (this.vehicleJobsOnly == true) {
            // this.fillCalendarVehicleJob();
          }

        } else {
          this.jobs = new Array();
          if (this.vehicleJobsOnly == true) {
            // this.fillCalendarVehicleJob();
          }
        }

      }


    })


  }

  getJobStatus(): any {
    var counts = 0;
    for (let job of this.jobs) {
      if (job.status == 1)
        counts++;
    }
    return counts;

  }

  onChangeAssignedTo($event: any, employeeId: any): void {

    console.log("onChangeAssignedTo");
    this.selectedVehicle.assignedTo = employeeId;
    this.selectedVehicle.reason = "assigned To";
    this.vehicleService.createAndUpdateVehicleExternal(this.selectedVehicle.userId, this.selectedVehicle).subscribe({
      next: result => {
        console.log("onChangeAssignedTo", result);
        this.selectedVehicle = result;
        this.selectedVehicle.reason = "";

      }
    })
  }

  onChangeUuid($event: any, status: string): void {

    console.log("onChangeStatus");
    this.uuid = $event.target.value;
    //this.url = location.origin + "/#/vehicle/" + this.uuid;
    this.getDetailByUuid(this.uuid);
  }

  onChangeStatus($event: any, status: string): void {

    console.log("onChangeStatus");
    this.selectedVehicle.status = status;
    this.selectedVehicle.reason = "status";
    this.vehicleService.createAndUpdateVehicleExternal(this.selectedVehicle.userId, this.selectedVehicle).subscribe({
      next: result => {
        console.log("onChangeStatus", result);
        this.selectedVehicle = result;
        this.selectedVehicle.reason = "";

      }
    })
  }

  setImage(index: any): void {

    this.selectedImage = this.selectedVehicle.imageModels[index].id;
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

  onSearchChange($event: any): void {
    // console.log($event.target.value);

    if (this.vehiclesOriginal.length > 0)
      this.vehiclesOriginal = this.vehiclesOriginal.filter(vehicle => vehicle.serachString.toLowerCase().includes($event.target.value));

  }


  message1: any = "";

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

          //this.uploadImage(this.selectedVehicle.id, imageModel);
          this.uploadImageWithFileUserId(this.selectedVehicle.id, imageModel);


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

  private uploadImageWithFile(vehicleId: any, imageModel: ImageModel) {


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
        this.selectedVehicle.imageModels.unshift(result);
        for (let vehicle of this.vehicles) {
          if (vehicle.id == this.selectedVehicle.id) {
            vehicle.imageModels = this.selectedVehicle.imageModels;
          }
        }
      }
    });

  }

  private uploadImageWithFileUserId(vehicleId: any, imageModel: ImageModel) {


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
        this.selectedVehicle.imageModels.unshift(result);
        for (let vehicle of this.vehicles) {
          if (vehicle.id == this.selectedVehicle.id) {
            vehicle.imageModels = this.selectedVehicle.imageModels;
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

  setImageForSearch(vehicleId: any, imageId: any) {


    console.log("setImageForSearch");

    this.vehicleService.setImageForSearch(imageId, vehicleId).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.selectedVehicle.imageModels.length; i++) {
          if (this.selectedVehicle.imageModels[i].id == imageId) {
            this.selectedVehicle.showInSearchImageId = this.selectedVehicle.imageModels[i].id;
            this.selectedImage = this.selectedVehicle.showInSearchImageId;
          }
        }
        //this.getDetailByUuid(this.uuid);
      }
    });
  }

  deleteImage(autopartId: any, imageId: any) {


    console.log("deleteImage");

    this.vehicleService.deleteImage(imageId, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.selectedVehicle.imageModels.length; i++) {
          if (this.selectedVehicle.imageModels[i].id == imageId) {
            this.selectedVehicle.imageModels.splice(i, 1);
          }
        }
        //this.getDetailByUuid(this.uuid);
      }
    });
  }

  deleteImage2(autopartId: any, imageId: any) {


    console.log("deleteImage");

    this.vehicleService.deleteImage(imageId, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.selectedVehicle.imageModels.length; i++) {
          if (this.selectedVehicle.imageModels[i].id == imageId) {
            this.selectedVehicle.imageModels.splice(i, 1);
          }
        }

        this.selectedImage = 0;
        //this.getDetailByUuid(this.uuid);
      }
    });
  }
}
