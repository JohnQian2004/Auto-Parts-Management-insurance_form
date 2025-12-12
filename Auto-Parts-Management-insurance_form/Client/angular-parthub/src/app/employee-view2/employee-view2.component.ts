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
import { Vehicle } from '../models/vehicle.model';
import { VehicleService } from '../_services/vehicle.service';
import { ImageModel } from '../models/imageModel.model';
import { ScrollService } from '../_services/scroll.service';
import { EmployeeService } from '../_services/employee.service';
import { Employee } from '../models/employee.model';
import { EmployeeRole } from '../models/employee.role.model';
import { EmployeeRoleService } from '../_services/employee.role.service';
import { CompanyService } from '../_services/company.service';
import { ServiceService } from '../_services/service.service';
import { SettingService } from '../_services/setting.service';
import { Setting } from '../models/setting.model';
import { Service } from '../models/service.model';
import { Company } from '../models/company.model';
import { PaymentType } from '../models/payment.type.model';
import { Status } from '../models/status.model';
import { JobRequestType } from '../models/job.request.type.model';
import { PaymentMethod } from '../models/payment.method.model';
import { PaymentStatus } from '../models/payment.status.model';
import { ApprovalStatus } from '../models/approval.status.model';
import { Job } from '../models/job.model';
import { JobService } from '../_services/job.service';
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem, DropListOrientation, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { StatusService } from '../_services/status.service';
import { Insurancer } from '../models/insurancer.model';
import { Location } from '../models/location.model';

@Component({
  selector: 'app-employee-view2',
  templateUrl: './employee-view2.component.html',
  styleUrls: ['./employee-view2.component.css']
})
export class EmployeeView2Component implements OnInit {

  vehicles: Vehicle[] = new Array();
  vehicle: Vehicle = new Vehicle();

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";

  autopartId: string = "";
  uuid: string = "";
  selectedAutopart: any = new AutoPart();
  selectedImage: any = 0;
  currentUser: any;
  private sub: any;

  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/getImage';
  baseUrlResizeImageParts = this.config.baseUrl + '/getResize';


  baseUrlResizeImage = this.config.baseUrl + '/vehicle/getResize';

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

  autopartsSearch: AutoPart[] = new Array();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private savedItemService: SavedItemService,
    private eventBusService: EventBusService,
    private autopartService: AutopartService,
    private vehicleService: VehicleService,
    private scrollService: ScrollService,
    private employeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService,
    private companyService: CompanyService,
    private serviceService: ServiceService,
    private settingService: SettingService,
    private jobService: JobService,
    private statusService: StatusService
  ) {

  }

  menuTextColor = 'text-white'; // Default text color
  menuTextColorActive = 'text-warning'; // Active text color
  showNotification = true; // Flag to control visibility of notification badge

  selectedTabMain: any;
  bottomMenuSetting:any;
  selectedTab:any;
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
          label: 'HOME', tooltip: 'Jobs', icon: 'fa-solid fa-home', notification: 5,
          selectedTab: 0, sectionId: 0, sectionTooltip: 'Jobs'
        },
        {
          label: 'PARTS', tooltip: 'Purchase Order', icon: 'fa-solid fa-cart-shopping', notification: 2,
          selectedTab: 1, sectionId: 1, sectionTooltip: 'Purchase Order'
        },
        {
          label: 'IMAGE', tooltip: 'Vehicle Images', icon: 'fa-solid fa-camera', notification: 0,
          selectedTab: 2, sectionId: 2, sectionTooltip: 'Vehicle Images'
        },
        {
          label: 'PAYROLL', tooltip: 'Payroll', icon: 'fa-solid fa-bank', notification: 3,
          selectedTab: 3, sectionId: 3, sectionTooltip: 'Payroll'
        },
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

    this.sub = this.route.params.subscribe(params => {
      // this.autopartId = params['autopartId']; // (+) converts string 'id' to a number
      // console.log(this.autopartId);
      // this.eventBusService.emit(new EventData('noshow', this.autopartId));
      // this.currentUser = this.storageService.getUser();
      // this.getDetail(this.autopartId);

      //this.getDetail(this.autopartId);

      this.uuid = params['uuid']; // (+) converts string 'id' to a number
      console.log(this.uuid);
      this.eventBusService.emit(new EventData('noshow', this.uuid));
      this.currentUser = this.storageService.getUser();

      //this.getCompanyInfo(this.uuid);
      this.getSettings(this.uuid);
      this.getCompanyVehiclesWithUuidWithJobs(this.uuid);
      //this.getDetailByUuid(this.uuid);
      //this.getEmployee(this.uuid);
      // this.searchEmplyeeVehicles(this.uuid);


    });
  }

  employee: Employee = new Employee();
  employeeRoles: EmployeeRole[] = new Array();
  employeePrecentage: any = 0;
  employees: Employee[] = new Array();

  companyName: any = "";
  companyId: any = "";
  companyIcon: any = "";
  setting: Setting = new Setting();

  services: Service[] = new Array();
  service: Service = new Service();

  company: Company = new Company();
  companyDefaultTaxRate: any = 0;

  paymentTypes: PaymentType[] = new Array();
  paymentType: PaymentType = new PaymentType();

  statuss: Status[] = new Array();
  status: Status = new Service();

  paymentStatuss: PaymentStatus[] = new Array();
  paymentStatus: PaymentStatus = new PaymentStatus();

  paymentMethods: PaymentMethod[] = new Array();
  paymentMethod: PaymentMethod = new PaymentMethod();

  approvalStatuss: ApprovalStatus[] = new Array();
  approvalStatus: ApprovalStatus = new ApprovalStatus();

  jobRequestTypes: JobRequestType[] = new Array();
  jobRequestType: JobRequestType = new JobRequestType();

  job: Job = new Job();
  jobs: Job[] = new Array();

  insurancers: Insurancer[] = new Array();
  insurancer: Insurancer = new Insurancer();

  locations: Location[] = new Array();
  location: Location = new Location();
  baseUrlQR = this.config.baseUrlQR;


  getSettings(uuid: any): void {
    this.settingService.getSettingUuid(uuid).subscribe({
      next: result => {
        if (result) {

          this.setting = result;
          this.employeeRoles = this.setting.employeeRoles;
          this.jobRequestTypes = this.setting.JobRequestTypes;
          this.paymentMethods = this.setting.paymentMethods;
          this.approvalStatuss = this.setting.approvalStatuss;
          this.paymentStatuss = this.setting.paymentStatuss;
          this.services = this.setting.services;
          this.employees = this.setting.employees;
          this.locations = this.setting.locations;
          this.insurancers = this.setting.insurancers;
          //this.inTakeWays = this.setting.inTakeWays;
          this.statuss = this.setting.statuss;
          this.statuss = this.statuss.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          this.paymentTypes = this.setting.paymentTypes;
          //this.rentals = this.setting.rentals;
          //this.disclaimers = this.setting.disclaimers;

          // for (let disclaimer of this.disclaimers) {
          //   if (disclaimer.isDefault == true) {
          //     this.disclaimerId = disclaimer.id;
          //     this.disclaimerText = disclaimer.text;
          //   }
          // }
          this.company = this.setting.company;
          this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
          this.companyDefaultTaxRate = this.company.taxRate;

          for (let employee of this.employees) {
            for (let employeeRole of this.employeeRoles) {
              if (employeeRole.id == employee.roleId) {
                employee.roleName = employeeRole.name;
                employee.rolePrecentage = employeeRole.precentage;
              }
            }
          }
        }
      }
    })
  }

  getCompanyVehiclesWithUuidWithJobs(uuid: any): void {

    this.vehicleService.getAllVehiclesWithUuidWithJobs(uuid).subscribe({
      next: result => {

        this.vehicles = result;
        this.vehicles = this.vehicles.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        for (let status of this.statuss) {
          status.vehicles = new Array();
          for (let vehicle of this.vehicles) {
            if (vehicle.status == status.id) {
              status.vehicles.push(vehicle);
            }
          }
        }

        this.getPayableVehicleAutoparts();
        this.setEmployeeVehicleJob();
      }
    })
  }
  setEmployeeVehicleJob(): void {

    for (let i = 0; i < this.employees.length; i++) {
      this.employees[i].vehicles = new Array();

      for (let vehicle of this.vehicles) {

        var hasIt: boolean = false;
        if (vehicle.statusString == "Payable") {

          for (let job of vehicle.jobs) {
            if (job.employeeId == this.employees[i].id) {
              hasIt = true;
              //console.log("setEmployeeVehicleJob");
            }
          }


        }

        if (hasIt == true)
          this.employees[i].vehicles?.push(vehicle);


      }
    }

    for (let employee of this.employees) {
      if (employee.vehicles && employee.vehicles?.length > 0) {
        //console.log(employee);
        //console.log(employee.vehicles.length);
      }
    }
    // console.log(this.employees);
  }
  getPayableVehicleAutoparts(): void {

    for (let i = 0; i < this.vehicles.length; i++) {
      if (this.vehicles[i].statusString == 'Payable') {
        //this.vehicles[i].autoparts = new Array();
        this.getAutopartForPaybleVehicle(this.vehicles[i]);
      }
    }
  }

  getAutopartForPaybleVehicle(vehicle: Vehicle): void {


    this.autopartService.getAutopartForVehicle(vehicle.id).subscribe({
      next: result => {
        console.log(result);
        vehicle.autoparts = new Array();
        vehicle.autoparts = result;


        //this.calculate();
      }
    })

  }

  getCompanyInfo(uuid: any): void {

    this.companyService.getCompanyId(uuid).subscribe({
      next: result => {
        console.log(result);
        this.companyName = result.name;
        this.companyId = result.id;
        this.companyIcon = result.icon;

        //this.getEmployeeRoles(this.companyId);

        this.getEmployeeRolesUuid(uuid);

        this.getEmployeesUuid(uuid);
      }
    })
  }

  getEmployeeData(employee: any): void {

    this.employee = employee;
    for (let employeeRole of this.employeeRoles) {
      if (employeeRole.id == this.employee.roleId) {
        this.employeePrecentage = employeeRole.precentage;
      }
    }
    this.searchEmplyeeVehicles(this.employee.token);

  }

  addVehicleJob(service: Service): void {

    console.log("addVehicleJob");
    var job = {
      id: 0,
      name: service.name,
      employeeId: 0,
      serviceId: service.id,
      notes: "Please specify",
      imageModels: new Array(),
      status: 0,
      vehicleId: this.vehicle.id,
      jobRequestType: 0,
      paymentMethod: 0
    }
    // this.jobService.createJob(this.currentUser.id, job).subscribe({
    this.jobService.createJobUuid(job).subscribe({
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

    // if (this.vehicleJobsOnly == true) {
    //   this.fillCalendarVehicleJob();
    // }
  }


  vehicles2: Vehicle[] = new Array();

  droppedStatus3(event: CdkDragDrop<any>, status: any) {

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

      for (let vehicle of this.vehicles) {
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
        this.vehicleService.createAndUpdateVehicle(this.vehicle.userId, this.vehicle).subscribe({
          next: result => {
            this.vehicle = result;
            this.vehicle.reason = "";
          }
        })
      }

    }

    console.log(this.vehicle.status)

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
      this.statuss,
      event.previousIndex,
      event.currentIndex
    );

    var sequenceCarriers: SequenceCarrier[] = new Array();
    for (let i = 0; i < this.statuss.length; i++) {
      let sequenceCarrier = new SequenceCarrier();
      sequenceCarrier.id = this.statuss[i].id;
      sequenceCarrier.index = i;
      sequenceCarriers.push(sequenceCarrier);
    }

    this.statusService.updateSeqence(this.uuid, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.statuss = result;
          this.statuss = this.statuss.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

          for (let status of this.statuss) {
            status.vehicles = new Array();
            for (let vehicle of this.vehicles) {
              if (vehicle.status == status.id) {
                status.vehicles.push(vehicle);
              }
            }
          }
        }
      }
    })

    // if (this.vehicleJobsOnly == true) {
    //   this.fillCalendarVehicleJob();
    // }
  }

  currentJobId: any = 0;
  setJobId(jobId: any) {
    this.currentJobId = jobId;
    console.log(this.currentJobId);
    // if (this.vehicleJobsOnly == true) {
    //   this.fillCalendarVehicleJob();
    // } else {
    //   this.fillCalendarJob();
    // }
  }

  onChangeJobJobRequestType($event: any, jobRequestType: any, job: Job): void {

    console.log("onChangeJobJobRequestType");
    job.jobRequestType = jobRequestType;
    job.reason = "job request type";
    this.jobService.createJobUuid(job).subscribe({
      next: result => {
        console.log("onChangeJobJobRequestType", result);
        this.job = result;
        this.job.reason = "";

      }
    })
  }

  onChangeJobPaymentMethod($event: any, paymentMethod: any, job: Job): void {

    console.log("onChangeJobPaymentMethod");
    job.paymentMethod = paymentMethod;
    job.reason = "paymentMethod";
    this.jobService.createJobUuid(job).subscribe({
      next: result => {
        console.log("onChangeJobPaymentMethod", result);
        this.job = result;
        this.job.reason = "";
        // this.getLocationOverview(this.user.companyId);
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

    this.vehicleService.createAndUpdateVehicleExternal(this.vehicle.userId, vehicle).subscribe({
      next: result => {
        console.log("changePaidStatus", result);
        this.vehicle = result;

        this.vehicle.reason = "";

      }
    })
  }

  moveToPayable(vehicle: Vehicle): void {

    console.log("moveToPayable");
    vehicle.reason = "payable";

    for (let status of this.statuss) {
      if (status.name == "Payable") {
        vehicle.status = status.id;
      }
    }

    this.vehicleService.createAndUpdateVehicleExternal(this.vehicle.userId, vehicle).subscribe({
      next: result => {
        console.log("moveToPayable", result);
        this.vehicle = result;

        this.vehicle.reason = "";

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

  getStatusCount(statusId: any): any {
    var counts = 0;
    for (let vehicle of this.vehicles) {
      if (vehicle.status == statusId)
        counts++;
    }
    return counts;

  }


  jobCompletedCount: any = 0;
  serviceJobs: Service[] = new Array();

  // getVehicleJobs2(vehicleId: any): void {

  //   this.serviceJobs = new Array();
  //   this.jobCompletedCount = 0;
  //   this.jobService.getAllVehicleJobs2(vehicleId).subscribe({
  //     next: result => {
  //       if (result) {
  //         this.jobs = result;
  //         this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  //         for (let i = 0; i < this.vehicles.length; i++) {
  //           if (this.vehicles[i].id == vehicleId) {
  //             this.vehicles[i].jobs = this.jobs;
  //           }
  //         }
  //         this.jobCompletedCount = this.getJobStatus();

  //         // if (this.vehicleJobsOnly == true) {
  //         //   this.fillCalendarVehicleJob();
  //         // }

  //       } else {
  //         this.jobs = new Array();
  //         // if (this.vehicleJobsOnly == true) {
  //         //   this.fillCalendarVehicleJob();
  //         // }
  //       }
  //       // this.serviceJobs = result;
  //       //console.log("getVehicleJobs", this.jobs);
  //     }


  //   })


  // }


  getVehicleJobs2Uuid(uuid: any): void {

    this.serviceJobs = new Array();
    this.jobCompletedCount = 0;
    this.jobService.getAllVehicleJobs2Uuid(uuid).subscribe({
      next: result => {
        if (result) {
          this.jobs = result;
          this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          for (let i = 0; i < this.vehicles.length; i++) {
            if (this.vehicles[i].id == uuid) {
              this.vehicles[i].jobs = this.jobs;
            }
          }
          this.jobCompletedCount = this.getJobStatus();

          // if (this.vehicleJobsOnly == true) {
          //   this.fillCalendarVehicleJob();
          // }

        } else {
          this.jobs = new Array();
          // if (this.vehicleJobsOnly == true) {
          //   this.fillCalendarVehicleJob();
          // }
        }
        // this.serviceJobs = result;
        //console.log("getVehicleJobs", this.jobs);
      }


    })


  }

  currentEmplyeeId: any = 0;

  onChangeEmployee2($event: any, employeeId: any, job: Job) {

    job.employeeId = employeeId;
    job.reason = "assign";
    console.log("onChangeEmployee2");
    this.jobService.createJobUuid(job).subscribe({
      next: result => {
        this.job = result;
        console.log(this.job);
        for (let job of this.jobs) {
          if (job.id == this.job.id)
            job = this.job;
        }
        //this.getVehicleJobs(this.vehicle.id);
        this.getVehicleJobs2Uuid(this.vehicle.token);

        if (this.currentEmplyeeId == employeeId) {
          // this.getMyJobs(employeeId);
        }

        this.syncJob(this.job);
      }
    })

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
          //  this.vehicle.imageModels = this.vehicle.imageModels.sort((a: { sequenceNumber: number; }, b: { sequenceNumber: number; }) => a.sequenceNumber - b.sequenceNumber);

        }
      }
    })


  }

  vehiclesJob: Vehicle[] = new Array();

  // private syncJob(job: Job) {
  //   if (this.vehiclesJob.length > 0) {
  //     for (let j = 0; j < this.vehiclesJob.length; j++) {
  //       for (let k = 0; k < this.vehiclesJob[j].jobs.length; k++) {
  //         if (this.vehiclesJob[j].jobs[k].id == job.id) {
  //           this.vehiclesJob[j].jobs[k] = job;
  //         }
  //       }
  //     }
  //   }
  // }

  private syncJob(job: Job) {
    if (this.vehicles.length > 0) {
      for (let j = 0; j < this.vehicles.length; j++) {
        for (let k = 0; k < this.vehicles[j].jobs.length; k++) {
          if (this.vehicles[j].jobs[k].id == job.id) {
            this.vehicles[j].jobs[k] = job;
          }

        }

        this.getJobStatusCount(this.vehicles[j], this.vehicles[j].jobs);
      }
    }
  }

  onEnter(reason: any, job: Job): void {
    job.reason = reason;
    this.jobService.createJobUuid(job).subscribe({
      next: result => {
        this.job = result;
        this.syncJob(this.job);
        // this.getVehicleJobs(this.vehicle.id);
      }, error: (e) => console.log(e)
    })
  }

  onChangeCalendar($event: any, job: Job): void {


    //job.targetDate = $event.target.value;
    const date: Date = new Date($event.target.value);

    job.targetDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    job.reason = "calender"
    console.log($event.target.value);
    console.log("onChangeCalendar");
    this.jobService.createJobUuid(job).subscribe({
      next: result => {
        console.log(result);
        this.job = result;
        job.reason = "";
        this.syncJob(job);
        // if (this.vehicleJobsOnly == true) {
        //   this.fillCalendarVehicleJob();
        // } else {
        //   this.fillCalendarJob();
        // }
      }
    })
  }


  onChangeCalendarStartDate($event: any, job: Job): void {


    //job.targetDate = $event.target.value;
    const date: Date = new Date($event.target.value);

    job.startDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    job.reason = "calender"
    console.log($event.target.value);
    console.log("onChangeCalendar");
    this.jobService.createJobUuid(job).subscribe({
      next: result => {
        console.log(result);
        this.job = result;
        job.reason = "";
        this.syncJob(job);
        // if (this.vehicleJobsOnly == true) {
        //   this.fillCalendarVehicleJob();
        // } else {
        //   this.fillCalendarJob();
        // }
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
  onChangeCalendarEndDate($event: any, job: Job): void {


    //job.targetDate = $event.target.value;
    const date: Date = new Date($event.target.value);

    job.endDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    job.reason = "calender"
    console.log($event.target.value);
    console.log("onChangeCalendar");
    this.jobService.createJobUuid(job).subscribe({
      next: result => {
        console.log(result);
        this.job = result;
        job.reason = "";
        this.syncJob(job);
        // if (this.vehicleJobsOnly == true) {
        //   this.fillCalendarVehicleJob();
        // } else {
        //   this.fillCalendarJob();
        // }
      }
    })
  }

  isJobChecked(job: Job): boolean {

    if (job.status != 0)
      return true;
    return false;
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
        //this.filterVehicleJobs();

        //this.getVehicleJobs(this.vehicle.id);
        //this.getVehicleJobs2(this.vehicle.id);
      }, error: (e) => console.log(e)
    })
  }


  deleteVehicleJob($event: any, job: Job) {
    console.log("deleteVehicleJob " + job.id);

    this.jobService.deleteJob(job.id).subscribe({
      next: result => {

        console.log(result);
        this.getVehicleJobs2Uuid(this.vehicle.token);
        if (this.currentEmplyeeId == job.employeeId && this.vehiclesJob.length > 0) {
          // this.getMyJobs(this.currentEmplyeeId);
        }
      }
    })

  }

  saveJobNotes(job: Job): void {

    job.reason = "notes";
    this.jobService.createJobUuid(job).subscribe({
      next: result => {
        this.job = result;
        // this.getVehicleJobs(this.vehicle.id);
        this.syncJob(this.job);
      }, error: (e) => console.log(e)
    })

  }

  getEmployees(companyId: any): void {

    this.employeeService.getComponyEmployees(companyId).subscribe({
      next: result => {
        console.log(result);
        this.employees = result;
      }
    })
  }

  getEmployeesUuid(uuid: any): void {

    this.employeeService.getComponyEmployeesUuid(uuid).subscribe({
      next: result => {
        console.log(result);
        this.employees = result;
      }
    })
  }

  getEmployeeRoles(companyId: any): void {
    this.employeeRoleService.getAllCompanyEmployeeRole(companyId).subscribe({
      next: result => {
        console.log(result);
        this.employeeRoles = result;
        // for (let employeeRole of this.employeeRoles) {
        //   if (employeeRole.id == this.employee.roleId) {
        //     this.employeePrecentage = employeeRole.precentage;
        //   }
        // }

      }
    })
  }

  getEmployeeRolesUuid(uuid: any): void {
    this.employeeRoleService.getAllCompanyEmployeeRoleUuid(uuid).subscribe({
      next: result => {
        console.log(result);
        this.employeeRoles = result;
        // for (let employeeRole of this.employeeRoles) {
        //   if (employeeRole.id == this.employee.roleId) {
        //     this.employeePrecentage = employeeRole.precentage;
        //   }
        // }

      }
    })
  }



  totalCost: any = 0;
  estimatePrice: any = 0;
  profite: any = 0;
  employeeIncome: any = 0;

  getTotalCosts(): any {
    var totalCosts = 0;
    //console.log(totalCosts);

    for (let vehicle of this.vehicles) {
      if (vehicle.statusString == 'Payable') {
        if (vehicle.autoparts && vehicle.autoparts?.length > 0) {
          for (let autopart of vehicle.autoparts) {

            totalCosts += autopart.salePrice;
            //console.log(totalCosts);

          }
        }
      }
    }

    return totalCosts;

  }

  getTotalEstimates(): any {

    var totalEstimate = 0;

    for (let vehicle of this.vehicles) {
      if (vehicle.statusString == 'Payable') {

        totalEstimate += vehicle.price;
        totalEstimate += vehicle.supplymentPrice;

      }
    }
    return totalEstimate;
  }


  calculate(): void {
    this.getTotalCost();
    this.getEstimatePrice();
    this.getDiff();
  }

  getDiff(): void {
    this.profite = this.estimatePrice - this.totalCost;
    this.employeeIncome = this.profite * this.employeePrecentage / 100
  }
  getEstimatePrice(): void {
    this.estimatePrice = this.vehicle.price + this.vehicle.supplymentPrice;
  }

  getTotalCost(): void {

    var totalCost = 0;
    if (this.autopartsSearch.length > 0) {
      for (let autopart of this.autopartsSearch) {
        totalCost += autopart.salePrice;
      }
    }
    console.log(totalCost);
    this.totalCost = totalCost;
  }


  getTotalVehicleCost(vehicle: Vehicle): any {

    var totalCost = 0;
    if (vehicle.autoparts && vehicle.autoparts?.length > 0) {
      for (let autopart of vehicle.autoparts) {
        totalCost += autopart.salePrice;
      }
    }
    return totalCost;
  }


  getEmployee(uuid: any): void {

    this.employeeService.getEmployeeWithUuid(uuid).subscribe({
      next: result => {
        console.log(result);
        this.employee = result;
        // if (result != null) {
        //   this.getEmployeeRoles(this.employee.companyId);
        //   this.getEmployees(this.employee.companyId);
        // }

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

  addNewParts(): void {
    this.selectedAutopart = new AutoPart();
    this.selectedAutopart.id = 0;
    this.selectedAutopart.title = undefined;

    this.selectedAutopart.stocknumber = this.randomString();

    this.detailSelected = true;
    this.message1 = "";
    this.errorMessage = "";

  }

  onChangeStatus($event: any, status: any): void {

    console.log("onChangeStatus");
    this.vehicle.status = status;
    this.vehicle.reason = "status";
    this.vehicleService.createAndUpdateVehicleExternal(this.vehicle.userId, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeStatus", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        // this.getStatusOverview(this.user.companyId);
      }
    })
  }

  currentIndex: any = 0;

  currentIndexInside: any = 0;

  getDetail(vehicle: Vehicle, index: any): void {
    this.vehicle = vehicle;

    this.vehicle.editable = true;

    this.currentIndex = index;
    this.getVehicleJobs2Uuid(this.vehicle.token);
    this.getAutopartForVehicle(this.vehicle.id, true);

  }

  getDetailInside(vehicle: Vehicle, index: any): void {
    this.vehicle = vehicle;

    this.vehicle.editable = true;

    this.currentIndexInside = index;
    this.getVehicleJobs2Uuid(this.vehicle.token);
    this.getAutopartForVehicle(this.vehicle.id, true);

  }

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
        if (this.autopartsSearch.length > 0) {
          if (resetSelectedPart == true) {
            this.selectedAutopart = this.autopartsSearch[0];
            this.selectedImage = this.selectedAutopart.showInSearchImageId;
          }
        }

        this.calculate();
      }
    })

  }


  searchEmplyeeVehicles(uuid: any): void {

    this.vehicles = new Array();
    this.vehicle = new Vehicle();
    this.autopartsSearch = new Array();

    this.vehicleService.searchEmplyeeVehicles(uuid).subscribe({
      next: result => {
        console.log(result);
        this.vehicles = result;
        if (this.vehicles.length > 0) {
          this.vehicle = this.vehicles[0];
          this.getVehicleJobs2Uuid(this.vehicle.token);
          this.getAutopartForVehicle(this.vehicle.id, true);
        }
        this.employee.vehicles = this.vehicles;
      }
    })
  }


  getDetailByUuid(uuid: any): void {

    console.log(" autopart detail ");
    this.autopartService.getByUuid(uuid).subscribe({

      next: res => {
        console.log(res);
        this.selectedAutopart = res;
        this.selectedAutopart.showSavedButton = true;
        this.selectedImage = this.selectedAutopart.showInSearchImageId;
        this.center = {
          lat: this.selectedAutopart.lat,
          lng: this.selectedAutopart.lng
        };

      },
      error: err => {
        console.log(err);
      }
    });
  }

  filterArray(autoparts: Vehicle[], statusId: any): Vehicle[] {

    return autoparts.filter(v => v.status == statusId);
  }

  setImage(index: any): void {

    this.selectedImage = this.selectedAutopart.imageModels[index].id;
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

  archiveAutopart(autoPart: AutoPart): void {

    autoPart.archived = true;
    autoPart.status = 2;
    console.log("archiveAutopart");
    this.autopartService.update(autoPart.id, autoPart).subscribe({
      next: result => {

        console.log(" " + result);
        autoPart = result;
        console.log("archiveAutopart updated:", autoPart);

      }, error: (e) => {
        console.log("archiveAutopart error");
        this.message = e.error.message;
        console.error(e);
      }
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


  imageUrl: any = "";

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

  detailSelected: boolean = false;
  hover: any = null;
  editAutopart(autoPart: AutoPart, index: any): void {

    this.cindex = index;
    this.selectedAutopart = autoPart;
    this.detailSelected = true;
    this.selectedImage = this.selectedAutopart.showInSearchImageId;

    //this.setAutopartViewCount(autoPart.id);

    // for (var i = 0; i < this.carListStringList.length; i++) {

    //   if (this.carListStringList[i].brand == this.selectedAutopart.make) {
    //     this.optionsModel = this.carListStringList[i].models;
    //   }

    // }


  }

  errorMessage: any = "";
  imageModels: ImageModel[] = new Array();
  message1: any = "";

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
    this.selectedAutopart.reason = "posting";
    this.selectedAutopart.vehicleId = this.vehicle.id;

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
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', autopartId) //other param


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

  deleteAutopart(autoPart: AutoPart, index: any): void {
    //console.log(event.target);

    console.log("deleteAutopart");
    this.autopartService.delete(autoPart.id).subscribe({
      next: data => {
        console.log(" " + data);
        //this.autopartService.delete(index);
        // if (this.user.partMarketOnly == true)
        //   this.getAllFromUserSatistics2(this.user.id);
        // else
        //   this.getAllFromUserSatistics(this.user.companyId);
        // //this.applyFilter("2", true);
        // this.applyFilter2("2", false, 0, this.pageSize);
        // this.getAllFromUser(this.currentUser.id);
        this.getAutopartForVehicle(this.vehicle.id, true);
      },

      error: (e) => {
        console.log("deleteAutopart error");
        this.message = e.error.message;
        console.error(e);
      }

    });
  }

  counter: number = 0;

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

}
