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
import { data, map, type } from 'jquery';
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

@Component({
  selector: 'app-intake-home',
  templateUrl: './intake-home.component.html',
  styleUrls: ['./intake-home.component.css']
})
export class IntakeHomeComponent implements OnInit, AfterViewInit {

  @HostListener('window:focus') onFocus() {
    console.log('window focus');
  }

  step: any = 0;

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

  paymentStatuss: PaymentStatus[] = new Array();
  paymentStatus: PaymentStatus = new PaymentStatus();

  paymentMethods: PaymentMethod[] = new Array();
  paymentMethod: PaymentMethod = new PaymentMethod();

  jobRequestTypes: JobRequestType[] = new Array();
  jobRequestType: JobRequestType = new JobRequestType();

  approvalStatuss: ApprovalStatus[] = new Array();
  approvalStatus: ApprovalStatus = new ApprovalStatus();

  selectedEmployee: any;

  currentJobId: any;

  serviceJobs: Service[] = new Array();

  job: Job = new Job();
  jobs: Job[] = new Array();

  cindex: number = 0;
  cindexCustomer: number = 0;
  message: any;
  messageAlert: any;
  errorMessage: any;

  base64Image: any;

  vin: string = "ZPBUA1ZL9KLA00848";
  currentUser: any;
  vehicles: Vehicle[] = new Array();
  vehiclesOriginal: Vehicle[] = new Array();

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

  optionsLocation: string[] = ["Lot 1", "Lot 2", "Front", "Back", "In Shop", "Yard", "Others"]

  optionsTitle: string[] = ["Miss", "Mr", "Mrs.", "Ms", "Others"]

  optionsShotCodes: string[] = new Array();

  optoinsVehicleHistoryType: string[] = new Array();

  damages: string[] = new Array();

  carList: any = jsonData;
  carListStringList: Brand[];
  autopart?: AutoPart;
  showSearchVin: boolean = false;

  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/vehicle/getImage';
  baseUrlResizeImage = this.config.baseUrl + '/vehicle/getResize';


  constructor(private userService: UserService,
    private storageService: StorageService,
    private scrollService: ScrollService,
    private savedItemService: SavedItemService,
    private router: Router,
    private route: ActivatedRoute,
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
    private jobRequestTypeService: JobRequestTypeService,
    private approvalStatusService: ApprovalStatusService,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private autopartService: AutopartService
  ) {

    for (let i = 1950; i <= 2026; i++) {
      this.optionsYear.push("" + i);
    }


    this.optionsMake = [
      "not selected", "Acura", "Alfa Romeo",
      "Audi",
      "BMW",
      "Chevrolet", "Chrysler", "Citroën",
      "Daewoo", "Dodge",
      "Fiat", "Ford",
      "GMC",
      "Honda", "Hummer", "Hyundai",
      "Infiniti",
      "Jaguar", "Jeep",
      "Kia",
      "Land Rover", "Lamborghini", "Lexus",
      "Mazda", "Mercedes-Benz", "MINI", "Mitsubishi",
      "Nissan",
      "Opel",
      "Peugeot", "Porsche",
      "Renault", "Rover",
      "Saab", "Seat", "Škoda", "Smart", "Subaru", "Suzuki",
      "Toyota",
      "Volkswagen", "Volvo"
    ];

    this.optionsColor = [
      "black",
      "blue",
      "green",
      "grey",
      "red",
      "yellow",
      "white"
    ];

    this.optionsModel = [
      "not selected"
    ];

    this.carListStringList = [];

  }

  ngAfterViewInit(): void {

    // var s1 = document.createElement("script");
    // s1.type = "text/javascript";
    // s1.src = "../../assets/jquery.imagemapster.js";
    // this.elementRef.nativeElement.appendChild(s1);


    var s1 = document.createElement("script");
    s1.type = "text/javascript";
    s1.src = "../../assets/test.js";
    this.elementRef.nativeElement.appendChild(s1);

    this.refresh();

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

  refresh(): void {

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);

  }

  ngOnInit(): void {

    var s1 = document.createElement("script");
    s1.type = "text/javascript";
    s1.src = "../../assets/jquery.imagemapster.js";
    this.elementRef.nativeElement.appendChild(s1);

    // var s1 = document.createElement("script");
    // s1.type = "text/javascript";
    // s1.src = "../../assets/test.js";
    // this.elementRef.nativeElement.appendChild(s1);



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
  }



  setJobId(jobId: any) {
    this.currentJobId = jobId;
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
      if (element.checked == true) {
        element.click();
      }
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

        if (this.user.companyId != 0) {
          this.getAllComponyUsers(this.user.companyId);
          this.getAllService(this.user.companyId);
          this.getAllStatus(this.user.companyId);
          this.getAllLocations(this.user.companyId);
          this.getAllPaymentStatus(this.user.companyId);
          this.getAllPaymentMethod(this.user.companyId);
          this.getAllJobRequestType(this.user.companyId);
          this.getAllApprovalStatus(this.user.companyId);
        }

      }
    })

  }

  getAllComponyUsers(companyId: any): void {

    this.userService.getAllCompanyUsers(companyId).subscribe({
      next: result => {
        if (result)
          //this.users = result;
          this.employees = result;
      }
    });
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
    console.log("createVehicle");
    var isNewVehicle: boolean = false;

    console.log("createVehicle: " + this.step);

    if (this.step != 0) {
      const element = <HTMLButtonElement>document.querySelector("[id='nav-vehicle-tab']");
      if (element)
        element.click();

      this.refresh();
    }
    if (vehicle.customer.firstName == null
      || vehicle.customer.firstName == ""
      || vehicle.customer.lastName == null
      || vehicle.customer.lastName == "") {
      this.errorMessage = "Please fill the form";
      //alert(this.errorMessage);
      if (window.confirm('Please fill the form')) {

        return;
      }

    } else {

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
        if (element.checked == true) {
          this.optionsShotCodes.push(damage);
        }

        this.vehicle.damages = this.optionsShotCodes.toLocaleString();
        console.log(this.vehicle.damages);
      }



      vehicle.sequenceNumber = 0;

      vehicle.companyId = this.user.companyId;
      vehicle.customer.companyId = this.user.companyId;

      this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({

        next: async result => {

          console.log(result);

          this.vehicle = result;

          this.base64Image = "";
          //const elementImage = <HTMLElement>document.querySelector("[id='usa_image']");
          //const elementImage = <HTMLElement>document.querySelector("[id='usa_image2']");
          const elementImage = <HTMLElement>document.querySelector("[id='usa_image3']");

          var backgroundColorHex = " #FFFFFF";
          htmlToImage.toJpeg(elementImage, { backgroundColor: backgroundColorHex })
            .then((dataUrl) => {
              // var img = new Image();
              // img.src = dataUrl;

              const imageModel = {
                id: this.vehicle.imageModels[0]?.id,
                vehicleIdIn: this.vehicle.id,
                picByte: dataUrl
              }

              this.vehicleService.uploadImage(imageModel, this.vehicle.id).subscribe({
                next: result => {
                  console.log("uploadImage");
                  console.log(result);
                  if (isNewVehicle == true && this.vehicles) {
                    this.vehicle.imageModels.push(result);
                    this.vehicles.unshift(this.vehicle);
                  }
                }
              });

              // document.body.appendChild(img);
            })
            .catch(function (error) {
              console.error('oops, something went wrong!', error);
            });

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
    //this.getVehicle(vehicle.id);

    for (var i = 0; i < this.carListStringList.length; i++) {
      if (this.carListStringList[i].brand == this.vehicle.make) {
        this.optionsModel = this.carListStringList[i].models;
      }

    }
    // this.unLabelList();
    // this.labelList(this.vehicle.damageStrings);

    this.LabelListTest(this.vehicle.damageStrings);
    this.cindex = index;

    this.vehicleHistories = new Array();
    this.getVehicleJobs2(vehicle.id);

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

  onEnter(reason: any, job: Job): void {
    job.reason = reason;
    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        this.job = result;
        // this.getVehicleJobs(this.vehicle.id);
      }, error: (e) => console.log(e)
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
    this.vehicle = new Vehicle();
    this.vehicle.customer = new Customer();
    this.vehicles = new Array();
    this.unLabelList();
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
      reason: "assign",
      paymentMethod: 0,
      imageModels: new Array(),
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
        this.getStatusOverview(this.user.companyId);
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

        // this.vinSearched = true;

      },
      error: (e) => console.error(e)
    });
  }

  searchVehicle(type: number): void {

    this.errorMessage = "";
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

  }

  saveCustomerInfo(customer: any): void {

    console.log("saveCustomerInfo");
    customer.companyId = this.user.companyId;
    this.customerService.createCustomer(this.currentUser.id, customer).subscribe({
      next: result => {
        console.log(result);
        this.customer = result;
        this.vehicle.customer = this.customer;
      }
    })

  }
  searchCustomerByPhoneOnly(phone: any): void {

    console.log("searchCustomerByPhoneOnly");
    this.unLabelList();
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
    this.unLabelList();
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
    this.unLabelList();
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

    this.unLabelList();
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

