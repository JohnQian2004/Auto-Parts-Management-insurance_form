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
import { Appointment } from '../models/appointment';
import { GroupedAppointments } from '../models/group.appointment';
import { formatDate } from '@angular/common';
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
import { VendorService } from '../_services/vendor.service';
import { Vendor } from '../models/vendor.model';
import { NoteService } from '../_services/note.service';
import { PayrollHistoryService } from '../_services/payroll.history.service';
import { PayrollHistory } from '../models/payroll.history.model';
import { ColumnInfoService } from '../_services/column.info.service';
import { er } from '@fullcalendar/core/internal-common';
import { retry } from 'rxjs';
import { Note } from '../models/note.model';
import { JobProcessor } from '../models/job-processor';
import { ThemeService } from 'ng2-charts';

@Component({
  selector: 'app-employee-routine',
  templateUrl: './employee-routine.component.html',
  styleUrls: ['./employee-routine.component.css']
})
export class EmployeeRoutineComponent implements OnInit {

  readyOnly: boolean = false;
  socket: WebSocket | undefined;

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
  baseUrlResizeImageJobs = this.config.baseUrl + '/jobimages/getResize';


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
    private vendorService: VendorService,
    private noteService: NoteService,
    private payrollHistoryService: PayrollHistoryService,
    private columnInfoService: ColumnInfoService,

  ) {

  }


  url: any = "";

  isMobile: boolean = false;
  notes: Note[] = new Array;
  note: Note = new Note();

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

    this.socket = new WebSocket(this.config.websoketAddress);

    this.socket.onmessage = (event: MessageEvent) => {
      const note = JSON.parse(event.data);
      console.log(note);
      this.notes.push(note);


      this.noteService.getAllCompanyNote(this.user.companyId).subscribe({
        next: result => {
          if (result) {
            this.notes = result;
            this.notes = this.notes.filter(note => note.jobId > 0);
          }
        }
      });

    };

    this.sub = this.route.params.subscribe(params => {

      this.uuid = params['uuid']; // (+) converts string 'id' to a number
      console.log(this.uuid);
      this.eventBusService.emit(new EventData('noshow', this.uuid));
      try {
        this.isValidEmployee(this.uuid);

      } catch {
        alert("Not Authorized")
        // this.errorMessage = "Not Authorized";
      }

    });
  }

  getPayrollTotal(): any {
    var total = 0;
    if (this.payrollHistories && this.payrollHistories.length > 0) {
      for (let payrollHistory of this.payrollHistories) {
        total += payrollHistory.job.price;
      }
    }
    return total;
  }

  jobs2?: Job[] = new Array();

  employeeId: any = 0;
  selectedTab: any = 0;

  // Method to handle the selected tab
  // onTabSelected(tabIndex: number) {
  //   this.selectedTab = tabIndex;
  //   console.log(`Selected tab: ${tabIndex}`);

  // }

  // bottomMenuSetting = [
  //   {
  //     label: 'HOME', tooltip: 'Jobs', icon: 'fa-solid fa-home', notification: 5,
  //     selectedTab: 0, sectionId: 0, sectionTooltip: 'Jobs'
  //   },
  //   {
  //     label: 'PARTS', tooltip: 'Purchase Order', icon: 'fa-solid fa-cart-shopping', notification: 2,
  //     selectedTab: 1, sectionId: 1, sectionTooltip: 'Purchase Order'
  //   },
  //   {
  //     label: 'IMAGE', tooltip: 'Vehicle Images', icon: 'fa-solid fa-camera', notification: 0,
  //     selectedTab: 2, sectionId: 2, sectionTooltip: 'Vehicle Images'
  //   },
  //   {
  //     label: 'PAYROLL', tooltip: 'Payroll', icon: 'fa-solid fa-bank', notification: 3,
  //     selectedTab: 3, sectionId: 3, sectionTooltip: 'Payroll'
  //   },
  //   {
  //     label: 'SETTING', tooltip: 'Preferences', icon: 'fa-solid fa-cogs', notification: 0,
  //     selectedTab: 4, sectionId: 4, sectionTooltip: 'Preferences'
  //   }
  // ];

  // New variables to control button presentation

  bottomMenuSetting = [
    {
      label: 'HOME',
      tooltip: 'Vehicle Jobs',
      icon: 'fa-solid fa-home',
      notification: 0,  // Default to 0
      selectedTab: 0,
      sectionId: 0,
      sectionTooltip: 'Vehicle jobs',
      badgeColor: 'bg-danger',
      menuTextColor: 'text-white',
      menuTextColorActive: 'text-warning'
    },
    {
      label: 'PARTS',
      tooltip: 'Vehicle Parts',
      icon: 'fa-solid fa-cart-shopping',
      notification: 0,  // Default to 0
      selectedTab: 1,
      sectionId: 1,
      sectionTooltip: 'Vehicle Parts',
      badgeColor: 'bg-danger',
      menuTextColor: 'text-white',
      menuTextColorActive: 'text-warning'
    },
    {
      label: 'IMAGES',
      tooltip: 'Vehicle Details',
      icon: 'fa-solid fa-camera',
      notification: 0,  // Default to 0
      selectedTab: 2,
      sectionId: 2,
      sectionTooltip: 'Vehicle Details',
      badgeColor: 'bg-danger',
      menuTextColor: 'text-white',
      menuTextColorActive: 'text-warning'
    },
    {
      label: 'SUPPS',
      tooltip: 'Supplements',
      icon: 'fa-solid fa-list',
      notification: 0,  // Default to 0
      selectedTab: 3,
      sectionId: 3,
      sectionTooltip: 'Supplements',
      badgeColor: 'bg-danger',
      menuTextColor: 'text-white',
      menuTextColorActive: 'text-warning'
    },
    {
      label: 'PAYS',
      tooltip: 'Payroll',
      icon: 'fa-solid fa-bank',
      notification: 0,  // Default to 0
      selectedTab: 4,
      sectionId: 4,
      sectionTooltip: 'Payroll',
      badgeColor: 'bg-info',
      menuTextColor: 'text-white',
      menuTextColorActive: 'text-warning'
    }
    ,
    // {
    //   label: 'SETTING',
    //   tooltip: 'Preferences',
    //   icon: 'fa-solid fa-cogs',
    //   notification: 0,  // Default to 0
    //   selectedTab: 5,
    //   sectionId: 5,
    //   sectionTooltip: 'Preferences',
    //   badgeColor: 'bg-info',
    //   menuTextColor: 'text-white',
    //   menuTextColorActive: 'text-warning'
    // }
  ];

  debug(from: any, sth: any) {
    console.log(from + ": " + + sth);
  }
  isValidEmployee(uuid: any): any {

    this.employeeService.getEmployeeWithUuid(uuid).subscribe({
      next: result => {
        if (result) {
          this.employee = result;
          this.employeeId = this.employee.id;

          this.getVehiclesByUuid(this.uuid);


          this.errorMessage = "";
          return this.employee;
        } else {
          return null;
        }
      }, error: err => {
        alert("Not Authorized");
      }
    })

    return null;
  }

  menuTextColor = 'text-white'; // Default text color
  menuTextColorActive = 'text-warning'; // Active text color
  showNotification = false; // Flag to control visibility of notification badge

  selectedTabMain: any;


  // Handle tab selection event, update the parent component state
  onTabSelected(event: { selectedTab: number, sectionId: number, sectionTooltip: string }) {
    this.selectedTab = event.selectedTab;
    this.selectedTabMain = this.selectedTab;

    console.log(`Selected Tab: ${event.selectedTab}`);
    console.log(`Section ID: ${event.sectionId}`);
    console.log(`Section Tooltip: ${event.sectionTooltip}`);

    if (this.selectedTab == 0) {

      // this.bottomMenuSetting = [
      //   {
      //     label: 'HOME', tooltip: 'Jobs', icon: 'fa-solid fa-home', notification: 5,
      //     selectedTab: 0, sectionId: 0, sectionTooltip: 'Jobs'
      //   },
      //   {
      //     label: 'PARTS', tooltip: 'Purchase Order', icon: 'fa-solid fa-cart-shopping', notification: 2,
      //     selectedTab: 1, sectionId: 1, sectionTooltip: 'Purchase Order'
      //   },
      //   {
      //     label: 'IMAGE', tooltip: 'Vehicle Images', icon: 'fa-solid fa-camera', notification: 0,
      //     selectedTab: 2, sectionId: 2, sectionTooltip: 'Vehicle Images'
      //   },
      //   {
      //     label: 'PAYROLL', tooltip: 'Payroll', icon: 'fa-solid fa-bank', notification: 3,
      //     selectedTab: 3, sectionId: 3, sectionTooltip: 'Payroll'
      //   },
      //   {
      //     label: 'SETTING', tooltip: 'Preferences', icon: 'fa-solid fa-cogs', notification: 0,
      //     selectedTab: 4, sectionId: 4, sectionTooltip: 'Preferences'
      //   }
      // ];
    }
    if (this.selectedTab == 3) {
      // this.bottomMenuSetting = [
      //   {
      //     label: 'HOME', tooltip: 'Jobs', icon: 'fa-solid fa-home', notification: 5,
      //     selectedTab: 0, sectionId: 0, sectionTooltip: 'Jobs'
      //   },
      //   {
      //     label: 'PAYROLL', tooltip: 'Payroll', icon: 'fa-solid fa-bank', notification: 3,
      //     selectedTab: 3, sectionId: 3, sectionTooltip: 'Payroll'
      //   }
      // ];

    }
  }

  setNotification(selectedTab: number, notification: number): void {
    const tab = this.bottomMenuSetting[selectedTab];
    if (tab) {
      tab.notification = notification;
    }
  }
  hover: any = null;

  vehicleOriginalMyJobsNotDone: Vehicle[] = new Array();
  vehicleOriginalMyJobsDone: Vehicle[] = new Array();
  //{{getMyJobStatus()}}/{{selectedVehicle.jobs2.length}}-{{jobCompletedCount}}/{{jobs.length
  // getMyJobStatusVehicle(vehicle) ==vehicle.jobs2?.length }">{{getMyJobStatusVehicle(vehicle)}}/{{vehicle.jobs2?.length}}</span>

  counter: any = 0;
  myCondition: any = 0;


  toggleVehiclesOriginal(): void {
    this.counter++;
    if (this.counter % 3 == 0) {
      this.myCondition = 0;
    } else if (this.counter % 3 == 1) {
      this.myCondition = 1;
    } else {
      this.myCondition = 2;
    }
  }

  getConditionName(myCondition: any): any {
    if (myCondition == 0) {
      return "NOT COMPLETED";
    } else if (myCondition == 1) {
      return "COMPLETED";
    }
    return "MY & OTHERS";
  }

  checkIfHasEmployeeProve(job: Job): boolean {

    for (let imageModel of job.imageModels) {

    }
    return false;
  }

  vehiclesNotCompleted: Vehicle[] = new Array();
  vehiclesCompleted: Vehicle[] = new Array();
  vehiclesBoth: Vehicle[] = new Array();

  notCompletedJobs: number | undefined;
  completedJobs: number | undefined;
  mixedJobs: number | undefined; // Vehicles with both types of jobs

  jobProcessor = new JobProcessor();


  //jobDescriptions = ['Started', 'Uploaded', 'Done', 'Notified', 'Verified'];

  // getStepDescription(points: number): string {
  //   const index = Math.min(Math.floor(points / 20), this.jobDescriptions.length - 1);
  //   return this.jobDescriptions[index];
  // }

  // getCumulativeStepDescription(points: number): string {
  //   const stepsCount = Math.min(Math.floor(points / 20), this.jobDescriptions.length);
  //   const cumulativeDescriptions = this.jobDescriptions.slice(0, stepsCount);
  //   return cumulativeDescriptions.join(' -> ');
  // }

  // getNextStepDescription(points: number): string | null {
  //   const currentStepIndex = Math.min(Math.floor(points / 20), this.jobDescriptions.length - 1);

  //   if (currentStepIndex === this.jobDescriptions.length - 1) {
  //     return null; // No next step available
  //   }

  //   return this.jobDescriptions[currentStepIndex + 1];
  // }


  filterJobs(myCondition: any): any[] {

    // if (myCondition == 2)
    //   return this.jobs;
    // else if (myCondition == 0) {
    //   return this.jobs.filter(job => job.employeeId == this.employeeId && job.notified == false &&
    //     job.status == 0);
    // } else {
    //   return this.jobs.filter(job => job.employeeId == this.employeeId && job.notified == true &&
    //     job.status == 1);
    // }

    return this.jobs.filter(job => {

      const employeeJobs = this.jobs.filter(job => job.employeeId === this.employeeId);

      // if (myCondition === 0) {
      //   return employeeJobs.some(job => job.startDate == null && job.status === 0 ||
      //     job.notifiedAt == null || job.verifiedAt == null);
      // }

      // if (myCondition === 1) {
      //   return employeeJobs.every(job => job.status === 1 && job.notifiedAt != null && job.verifiedAt != null);
      // }

      // if (myCondition === 2) {
      //   return employeeJobs.length > 0;
      // }


      if (myCondition === 0) {
        return employeeJobs.some(job => job.status === 0);
      }

      if (myCondition === 1) {
        return employeeJobs.every(job => job.status === 1);
      }

      if (myCondition === 2) {
        return employeeJobs.length > 0;
      }

      return false;
    });

    // if (myCondition == 2)
    //   return this.jobs;
    // else if (myCondition == 0) {
    //   return this.jobs.filter(job => job.employeeId == this.employeeId &&
    //     (job.notified == false || job.status == 0 || job.userIdVerified == 0));
    // } else {
    //   return this.jobs.filter(job => job.employeeId == this.employeeId &&
    //     job.status == 1 && job.notified == true && job.userIdVerified == 1);
    // }

    // if (myCondition == 2)
    //   return this.jobs;
    // else if (myCondition == 0) {
    //   return this.jobs.filter(job => job.employeeId == this.employeeId && job.status == 0);
    // } else {
    //   return this.jobs.filter(job => job.employeeId == this.employeeId && job.status == 1);
    // }

    // if (this.showMyJobsOnly == true)
    //   return this.jobs.filter(job => job.employeeId == this.employeeId);
    // else
    //   return this.jobs;
  }



  getMyArray(vehiclesOriginal: Vehicle[], employeeId: number, myCondition: number): Vehicle[] {

    //     if (myCondition == 2)
    //   return this.jobs;
    // else if (myCondition == 0) {
    //   return this.jobs.filter(job => job.employeeId == this.employeeId && 
    //     (job.notified == false || job.status == 0 || job.userIdVerified == 0));
    // } else {
    //   return this.jobs.filter(job => job.employeeId == this.employeeId && 
    //     job.status == 1 && job.notified == true && job.userIdVerified == 1);
    // }
    return vehiclesOriginal.filter(vehicle => {

      const employeeJobs = vehicle.jobs.filter(job => job.employeeId === this.employeeId);

      // if (myCondition === 0) {
      //   return employeeJobs.some(job => job.startDate == null && job.status === 0 ||
      //     job.notifiedAt == null || job.verifiedAt == null);
      // }

      // if (myCondition === 1) {
      //   return employeeJobs.every(job => job.status === 1 && job.notifiedAt != null && job.verifiedAt != null);
      // }

      // if (myCondition === 2) {
      //   return employeeJobs.length > 0;
      // }


      if (myCondition === 0) {
        return employeeJobs.some(job => job.status === 0);
      }

      if (myCondition === 1) {
        return employeeJobs.every(job => job.status === 1);
      }

      if (myCondition === 2) {
        return employeeJobs.length > 0;
      }

      return false;
    });


  }

  topMessage: any = "";
  getVehiclesByUuid(uuid: any): void {

    console.log(" getVehiclesByUuid ");
    this.url = location.origin + "/#/operation/" + uuid;
    //this.router.navigate(['vehicle/'+ uuid], { replaceUrl: true });
    this.location.go("/operation/" + uuid);

    this.getPayrollHistoryWithUuidEmployee();
    this.getAllComponyEmployeesWithUuid(uuid);
    this.getCompanyVendorsWithUuid(uuid);


    this.jobService.findAllCurrentEmplyeeJobsWithUuid(uuid).subscribe({

      next: res => {
        this.vehiclesOriginal = res;

        if (this.vehiclesOriginal.length == 0) {

          alert("No Job Assigned to you");

        } else {

          for (let vehicle of this.vehiclesOriginal) {
            if (vehicle.make.includes(' '))
              vehicle.make = vehicle.make.replace(' ', '-');
          }

          this.vehiclesNotCompleted = this.getMyArray(this.vehiclesOriginal, this.employeeId, 0);  // Jobs not completed
          this.vehiclesCompleted = this.getMyArray(this.vehiclesOriginal, this.employeeId, 1);    // All jobs completed
          this.vehiclesBoth = this.getMyArray(this.vehiclesOriginal, this.employeeId, 2);         // Both completed and not completed jobs
        }


        this.user.allowAddAndUpdateVehicle = true;
        this.user.allowUpdateJobStatus = true;
        if (this.vehiclesNotCompleted.length > 0) {
          this.getDetail(this.vehiclesNotCompleted[0], 0);
        } else if (this.vehiclesNotCompleted.length > 0) {
          this.myCondition = 1;
          this.getDetail(this.vehiclesNotCompleted[0], 0);
        } else {
          this.myCondition = 2;
          this.getDetail(this.vehiclesBoth[0], 0);
        }

        this.jobs = this.selectedVehicle.jobs;
        this.jobs2 = new Array();
        this.jobs2 = this.selectedVehicle.jobs2;
        if (this.jobs2) {
          for (let job of this.jobs2) {
            this.employeeId = job.employeeId;
            this.getJobScore(job);
            console.log("================= " + this.employeeId);
          }
        }
        console.log("=================")
        console.log(this.jobs2);
        this.autopartsSearch = this.selectedVehicle.autoparts;

        console.log(res);

        this.user.allowAddUpdateAutopart = true;
        this.getCompanyStatusWithUuid(uuid);

        this.jobCompletedCount = this.getJobStatus();

        // this.selectedVehicle = res;
        //this.statuss = this.selectedVehicle.statuss;
        //this.employees = this.selectedVehicle.employees;

        this.selectedVehicle.showSavedButton = true;
        if (this.selectedVehicle.imageModels.length > 0) {
          this.selectedVehicle.imageModels = this.selectedVehicle.imageModels.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
        }

        this.selectedImage = this.selectedVehicle.showInSearchImageId;

        if (this.selectedVehicle.id > 0) {
          //this.getAutopartForVehicle(this.selectedVehicle.id, true);
          //this.getVehicleJobs2(this.selectedVehicle.token);
          this.getCompanyApprovalStatus(this.selectedVehicle.companyId);
          // this.getPayrollHistoryWithUuidEmployee();

          this.setNotification(0, this.selectedVehicle.jobs2.length);

          this.setNotification(1, this.autopartsSearch.length);
          this.setNotification(2, this.selectedVehicle.imageModels.length);
          this.setNotification(3, this.selectedVehicle.supplements.length);

        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getDetail(vehicle: Vehicle, index: any): void {

    //this.bottomMenuSetting.forEach((item: { notification: number; }) => item.notification = 0);

    for (let bottomSetting of this.bottomMenuSetting) {
      if (bottomSetting.selectedTab != 4) {
        bottomSetting.notification = 0;
      }
    }
    this.currentIndex = index;
    this.selectedVehicle = vehicle;

    if (this.selectedVehicle != null && this.selectedVehicle.imageModels != null) {
      if (this.selectedVehicle?.imageModels.length > 0) {
        this.setNotification(2, this.selectedVehicle.imageModels.length);
        this.setNotification(3, this.selectedVehicle.supplements.length);
      }
    }


    this.jobs = this.selectedVehicle.jobs;
    this.jobs = this.jobs.sort((a, b) => b.id - a.id);

    for (let job of this.jobs) {
      this.getJobScore(job);
    }

    if (this.selectedVehicle.jobs2 != null) {
      this.jobs2 = this.selectedVehicle.jobs2;
      this.setNotification(0, this.selectedVehicle.jobs2.length);
    }

    this.autopartsSearch = this.selectedVehicle.autoparts;

    this.setNotification(1, this.autopartsSearch.length);



    this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }

  getDetailPayrollOnly(vehicle: Vehicle, index: any): void {

    this.currentIndex = index;
    this.selectedVehicle = vehicle;

  }

  getVendorName(vendorId: any): any {
    for (let vendor of this.vendors) {
      if (vendor.id == vendorId)
        return vendor.name;
    }
  }

  getTopImageLabel(imageModel: ImageModel): any {
    if (imageModel.employeeId > 0) {

      return this.getEmployeeName(imageModel.employeeId);

    } else if (imageModel.userId > 0) {
      //this.getUserName(image)

    } else {

    }
  }
  getEmployeeNameFromJobId(jobId: any): any {
    for (let job of this.selectedVehicle.jobs) {
      if (job.id == jobId) {
        return this.getEmployeeName(job.employeeId);
      }
    }
  }
  getEmployeeName(employeeId: any): any {

    for (let employee of this.employees) {
      if (employee.id == employeeId)
        return employee.firstName + " " + employee.lastName;
    }
  }

  showMyJobsOnly = true;
  getMyJobStatus(): any {
    var counts = 0;
    for (let job of this.jobs) {
      if (job.status == 1 && job.employeeId == this.employeeId)
        counts++;
    }
    return counts;
  }


  getMyTotalJobs(): any {
    var counts = 0;
    for (let vehicle of this.vehiclesOriginal) {
      for (let job of vehicle.jobs) {
        if (job.employeeId == this.employeeId)
          counts++;
      }
    }
    return counts;
  }
  getMyTotalJobsStatis(): any {
    var counts = 0;
    for (let vehicle of this.vehiclesOriginal) {
      for (let job of vehicle.jobs) {
        if (job.status == 1 && job.employeeId == this.employeeId)
          counts++;
      }
    }
    return counts;
  }

  getMyTotalVehicleJobs(vehicle: Vehicle): any {
    var counts = 0;

    for (let job of vehicle.jobs) {
      if (job.employeeId == this.employeeId)
        counts++;

    }
    return counts;
  }

  getMyJobStatusVehicle(vehicle: Vehicle): any {
    var counts = 0;
    for (let job of vehicle.jobs) {
      if (job.status == 1 && job.employeeId == this.employeeId)
        counts++;
    }
    return counts;
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

  employee: Employee = new Employee();

  getAllComponyEmployeesWithUuid(uuid: any): void {

    this.employeeService.getCompanyEmployeesByEmployeeUuid(uuid).subscribe({
      next: result => {
        if (result)
          //this.users = result;
          this.employees = result;

        for (let employee of this.employees) {
          if (employee.token == this.uuid) {
            this.employee = employee;
          }
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
    //this.getDetailByUuid(this.uuid);
    this.getVehiclesByUuid(this.uuid);
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
    this.url = location.origin + "/#/vehicle/" + uuid;
    //this.router.navigate(['vehicle/'+ uuid], { replaceUrl: true });
    this.location.go("/vehicle/" + uuid);
    this.vehicleService.getByUuid(uuid).subscribe({

      next: res => {
        //console.log(res);
        this.selectedVehicle = res;
        this.statuss = this.selectedVehicle.statuss;
        this.employees = this.selectedVehicle.employees;

        this.selectedVehicle.showSavedButton = true;
        if (this.selectedVehicle.imageModels.length > 0) {
          this.selectedVehicle.imageModels = this.selectedVehicle.imageModels.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
        }

        this.selectedImage = this.selectedVehicle.showInSearchImageId;
        this.center = {
          lat: this.selectedVehicle.lat,
          lng: this.selectedVehicle.lng
        };

        if (this.selectedVehicle.id > 0) {
          this.getAutopartForVehicle(this.selectedVehicle.id, true);
          this.getVehicleJobs2(this.selectedVehicle.token);
          this.getCompanyApprovalStatus(this.selectedVehicle.companyId);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }



  onChangeAutopartVendor($event: any, autopart: AutoPart): void {

    autopart.vendorId = $event.target.value;
    console.log(autopart.vendorId);
    autopart.reason = "vendor";
    console.log(autopart.reason);

    this.autopartService.updateAutopartWithUuidEmployee(this.uuid, autopart).subscribe({
      next: result => {
        console.log(result);
        if (result) {
          autopart = result;
          this.selectedAutopart = autopart;
          for (let i = 0; i < this.autopartsSearch.length; i++) {
            if (this.autopartsSearch[i].id == autopart.id) {
              this.autopartsSearch[i] = autopart;
            }
          }
        }
      }
    })
  }


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

    this.autopartService.updateAutopartWithUuidEmployee(this.uuid, autopart).subscribe({
      next: result => {
        console.log(result);
        if (result) {
          autopart = result;
          this.selectedAutopart = autopart;
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

  getCompanyStatusWithUuid(uuid: any): void {

    this.statusService.getAllCompanyStatusUuid(uuid).subscribe({
      next: result => {
        if (result) {
          this.statuss = result;
        }
      }
    })
  }

  vendors: Vendor[] = new Array();

  getCompanyVendorsWithUuid(uuid: any): void {

    this.vendorService.getAllCompanyVendorUuid(uuid).subscribe({
      next: result => {
        if (result) {
          this.vendors = result;
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
    this.getJobScore(this.job);

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

  notifyManager(message: any, color: any, job: Job): void {


    var note = {
      id: 0,
      userId: 0,
      employeeId: this.employeeId,
      jobId: job.id,
      vehicleId: this.selectedVehicle.id,
      reason: "notify",
      sequenceNumber: -1,
      year: this.selectedVehicle.year,
      make: this.selectedVehicle.make,
      model: this.selectedVehicle.model,
      type: message,
      color: color,
      notes: this.selectedVehicle.year + " " + this.selectedVehicle.make + " " + this.selectedVehicle.model +
        "'s job (" + job.name?.toUpperCase() + ")-" + job.id + " is " + message,
      companyId: this.selectedVehicle.companyId
    };
    if (job.status == 1) {
      this.noteService.createNoteUuidEmployee(job.id, this.uuid, note).subscribe({
        next: result => {
          if (result) {
            console.log(result);

            this.updateJob('notify', job);
          }
        }
      })

    }
  }


  checkHasProof(job: Job): boolean {
    for (let imageModel of job.imageModels) {
      //sometime system user load some ..
      if (imageModel.employeeId == job.employeeId || imageModel.userId > 0) {
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

    //this.job = job;

  }

  verifyJob(reason: any, job: any): void {

    job.reason = reason;
    job.verifiedAt = new Date();
    job.userIdVerified = this.user.id;

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
        this.jobCompletedCount = this.getJobStatus();

      }
    })

  }

  shallShowNVerified(job: Job): boolean {
    if (job.startDate != null && job.status == 1 &&
      job.verifiedAt == null)
      return true;
    else
      return false;
  }

  // shallShowNVerified(job: Job): boolean {
  //   if (job.startDate != null && job.imageModels.length > 0 && job.status == 1 &&
  //     job.notifiedAt != null && job.verifiedAt == null)
  //     return true;
  //   else
  //     return false;
  // }

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



  updateJob(reason: any, job: any): void {

    job.reason = reason;

    if (job.startDate == null) {
      job.startDate = new Date();
    }

    if (reason == 'notify') {
      job.notified = true;
      job.notifiedAt = new Date();
      job.reason = 'notify';
      this.getJobScore(job)

    } else if (reason == 'done') {

      this.getJobScore(job)
      job.status = 1;
      job.reason = 'done';
      job.endDate = new Date();
      this.getJobScore(job)
      job = this.job;

    } else if (reason == 'downgrade') {

      this.getJobScore(job)
      job.reason = 'downgrade';
    } else {

      this.getJobScore(job)
    }



    this.jobService.createJobUuidEmployee(this.uuid, job).subscribe({
      next: result => {

        // job.errorMessage = "";
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

  updateJobStatus(reason: any, job: Job): void {
    job.reason = reason;

    this.getJobScore(job);
    console.log("updateJobStatus");
    this.jobService.updateJobStatusWithUuidEmployee(this.uuid, job.id).subscribe({
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


      // if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      //   alert('Only JPEG and JPG images are allowed');
      //   return;
      // }

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
    var isNew = false;
    this.errorMessage = "";
    this.selectedAutopart.year = this.selectedVehicle.year;
    this.selectedAutopart.make = this.selectedVehicle.make;
    this.selectedAutopart.model = this.selectedVehicle.model;
    this.selectedAutopart.employeeId = this.employeeId;

    if (this.selectedAutopart.id == 0) {
      this.selectedAutopart.purchaseStatus = 0;
      isNew = true;
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
    if (this.selectedAutopart.id == 0)
      this.selectedAutopart.status = 0;
    this.selectedAutopart.purchaseStatus = 0;
    // this.selectedAutopart.sequenceNumber = -1;
    this.selectedAutopart.published = false;

    if (this.selectedAutopart.id > 0)
      this.selectedAutopart.reason = "update employee";
    else
      this.selectedAutopart.reason = "posting employee";
    this.selectedAutopart.vehicleId = this.selectedVehicle.id;

    if (this.selectedAutopart.id == 0) {
      this.autopartService.createWithEmployeeUuid(this.uuid, this.selectedAutopart).subscribe({
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
            if (isNew == true)
              this.autopartsSearch.unshift(this.selectedAutopart);
          }
          if (!isNew)
            this.errorMessage = "Update Successfully";
          else
            this.errorMessage = "Create Successfully";



        },
        error: (e) => console.error(e)
      });
    } else {
      this.autopartService.updateAutopartWithUuidEmployee(this.uuid, this.selectedAutopart).subscribe({
        next: (res) => {
          console.log(res);
          this.selectedAutopart = res;

          if (!isNew)
            this.errorMessage = "Update Successfully";
          else
            this.errorMessage = "Create Successfully";



        },
        error: (e) => console.error(e)
      });
    }
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

  editAutopart(autopart: AutoPart): void {

    console.log("editAutopart" + autopart);
    this.message1 = "";
    this.errorMessage = "";
    this.selectedAutopart = autopart;
    this.displayStyleNewParts = "block";
    console.log("editAutopart");
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

      //this.validateJob(job);


    }
  }

  private uploadImageWithFileJobs(jobId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFileAutoparts");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', jobId) //other param
    formData.append('description', "test") //other param


    this.jobService.uploadImageWithFileWithUuidEmployee(formData, jobId, this.uuid).subscribe({
      next: (result) => {
        console.log(result);
        this.job.imageModels.unshift(result);

        if (this.checkHasProof(this.job) == true) {
          this.updateJob('upload', this.job);
        }
      }
    });


  }

  private uploadImageWithFileAutoparts(autopartId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFileAutoparts");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', autopartId) //other param


    this.autopartService.uploadImageWithFileWithUuidEmployee(formData, autopartId, this.uuid).subscribe({
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

  deleteImageAutopart(autopartId: any, imageId: any) {


    console.log("deleteImage");

    this.autopartService.deleteImageWihUuidEmployee(imageId, autopartId, this.uuid).subscribe({
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

  deleteImageJob(job: Job, imageId: any) {


    console.log("deleteImage");

    this.jobService.deleteImageWihtUuidEmployee(imageId, job.id, this.uuid).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.job.imageModels.length; i++) {
          if (this.job.imageModels[i].id == imageId) {
            this.job.imageModels.splice(i, 1);
          }
        }

        if (this.checkHasProof(job) == false) {
          this.updateJob("downgrade", job);
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
        this.setNotification(1, this.autopartsSearch.length);
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
          this.jobs = this.jobs.sort((a, b) => b.id - a.id);
          for (let job of this.jobs) {
            job.imageModels = job.imageModels.sort((a, b) => b.id - a.id);
            this.getJobScore(job);
          }
          console.log(this.jobs);
          this.jobCompletedCount = this.getJobStatus();

          if (this.vehicleJobsOnly == true) {

          }

        } else {
          this.jobs = new Array();
          if (this.vehicleJobsOnly == true) {

          }
        }

      }


    })


  }

  getJobStatusVehicle(vehicle: Vehicle): any {
    var counts = 0;
    for (let job of vehicle.jobs) {
      if (job.status == 1)
        counts++;
    }
    return counts;

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

          //this.uploadImage(this.selectedVehicle.id, imageModel);
          this.uploadImageWithFileWithUuidEmployee(this.selectedVehicle.id, imageModel);


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

  week: any;
  year: any;
  weekSet: any;
  from: any;
  to: any;
  yearSet: any;
  weekDates: { dayName: string, fullDate: string }[] = [];
  appointments: Appointment[] = []; // Initially empty
  groupedAppointments: GroupedAppointments = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  };









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
  payrollHistory: PayrollHistory = new PayrollHistory();

  setWeek($event: any) {
    console.log($event.target.value);
    var year = $event.target.value.substring(0, 4);
    this.yearSet = year;

    var week = $event.target.value.substring(6);
    week = +week;
    this.weekSet = week;


    console.log("year " + this.year + " week " + week);
    this.from = this.weekToDate(year, week);
    this.to = this.weekToDate(year, week + 1);
    this.to.setDate(this.to.getDate() - 1);

    // convert to UTC
    this.from = new Date(this.from.getTime() + this.from.getTimezoneOffset() * 60000);
    this.to = new Date(this.to.getTime() + this.to.getTimezoneOffset() * 60000);

    console.log(this.from);
    console.log(this.to);

    // this.getUserPerformance(this.currentUserUser.companyId, this.from, this.to, this.year, week);
    // this.getAllCompanyOverviewBetweenDateMonth(this.currentUserUser.companyId, this.from, this.to, this.year, week, this.range);

    this.appointments = new Array();
    this.payrollHistories = new Array();

    this.payrollHistory = new PayrollHistory();
    this.getThisWeekPayrollHistory(this.year, this.week);

    // this.generateWeekDates(week);
    // this.groupAppointmentsByDay();
  }

  getPayrollHistoryWithUuidEmployee(): void {

    console.log("getPayrollHistoryWithUuidEmployee");
    let now = new Date();
    var isSaturday = now.getDay() === 6;
    let onejan = new Date(now.getFullYear(), 0, 1);
    this.week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    //this.week = this.week
    if (isSaturday)
      this.week = this.week - 1;

    this.weekSet = this.week;

    this.year = now.getFullYear();
    this.yearSet = this.year;

    this.from = this.weekToDate(this.year, this.week);
    this.to = this.weekToDate(this.year, this.week + 1);
    this.to.setDate(this.to.getDate() - 1);

    // convert to UTC
    this.from = new Date(this.from.getTime() + this.from.getTimezoneOffset() * 60000);
    this.to = new Date(this.to.getTime() + this.to.getTimezoneOffset() * 60000);

    this.getThisWeekPayrollHistory(this.year, this.week);

  }

  payrollHistories: PayrollHistory[] = new Array();

  getThisWeekPayrollHistory(year: any, week: any): void {


    console.log(year + " getThisWeekPayrollHistory " + week)
    this.payrollHistories = new Array();

    this.payrollHistoryService.getAllCompanyPayrollHistoiesForEmployee(this.uuid, year, week).subscribe({
      next: result => {
        console.log(result);

        this.payrollHistories = result;
        if (this.payrollHistories && this.payrollHistories.length > 0) {
          this.setNotification(4, this.payrollHistories.length);
          for (let payrollHistory of this.payrollHistories) {
            var appointment = new Appointment();
            // appointment.date = formatDate(payrollHistory.createdAt, 'yyyy-MM-dd', "en-US");
            appointment.date = formatDate(payrollHistory.createdAt, 'yyyy-MM-dd', "en-US");
            appointment.payrollHistory = payrollHistory;
            appointment.cost = payrollHistory.job.price;
            appointment.patient = payrollHistory.vehicle.year + "  " + payrollHistory.vehicle.model;
            this.appointments.push(appointment);



          }

          console.log(this.appointments);

        } else {

        }

        this.generateWeekDates(week);
        this.groupAppointmentsByDay();

      }
    })

  }



  weekNumber = 30;
  totalCosts: number = 0;


  generateWeekDates(weekNumber: number) {
    const startDate = new Date(2024, 0, 1);  // Assuming the year starts with Monday
    startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      this.weekDates.push({
        dayName: this.getWeekdayName(date.getDay()),
        fullDate: date.toISOString().split('T')[0], // Format the date as YYYY-MM-DD
      });
    }
  }


  groupAppointmentsByDay() {
    const groupedByFullDate: { [fullDate: string]: Appointment[] } = {};

    this.appointments.forEach(appointment => {
      const date = new Date(appointment.date);
      const dayName = this.getWeekdayName(date.getDay()); // Get the weekday name
      const fullDate = date.toISOString().split('T')[0]; // Get the full date (YYYY-MM-DD)

      appointment.fullDate = fullDate;

      if (!groupedByFullDate[fullDate]) {
        groupedByFullDate[fullDate] = []; // Initialize an array if the fullDate group doesn't exist
      }
      groupedByFullDate[fullDate].push(appointment); // Add appointment to the corresponding fullDate group
    });

    this.groupedAppointments = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    };

    this.weekDates.forEach(weekDay => {
      const fullDate = weekDay.fullDate;
      const dayName = weekDay.dayName;

      if (groupedByFullDate[fullDate]) {
        this.groupedAppointments[dayName] = this.groupedAppointments[dayName].concat(groupedByFullDate[fullDate]);
      }
    });

    console.log(this.groupedAppointments);
  }


  getWeekdayName(dayIndex: number): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  }

  getDaySubtotal(day: string): number {
    let subtotal = 0;

    const appointmentsForDay = this.groupedAppointments[day] || [];

    for (const appointment of appointmentsForDay) {
      subtotal += appointment.cost;
    }

    return subtotal;
  }

  // Manually calculate the total cost for the entire week
  getTotalCost(): number {
    let total = 0;

    // Loop through each weekday and accumulate the costs
    for (const day of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      total += this.getDaySubtotal(day);
    }

    return total;
  }




  private uploadImageWithFileWithUuidEmployee(vehicleId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('vehicleId', vehicleId) //other param
    formData.append('description', "vehicle") //other param
    // formData.append('path', 'temp/') //other param

    this.vehicleService.uploadImageWithFileUuidEmployee(formData, vehicleId, this.uuid).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedVehicle.imageModels.unshift(result);
        for (let vehicle of this.vehicles) {
          if (vehicle.id == this.selectedVehicle.id) {
            vehicle.imageModels = this.selectedVehicle.imageModels;
          }
        }
        this.setNotification(2, this.selectedVehicle.imageModels.length);
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
