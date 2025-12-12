import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { SettingService } from '../_services/setting.service';
import { Setting } from '../models/setting.model';
import { EmployeeRole } from '../models/employee.role.model';
import { JobService } from '../_services/job.service';
import { Vehicle } from '../models/vehicle.model';
import {
  ChartConfiguration, ChartOptions, ChartType,
  ActiveElement,
  Chart,
  ChartData,
  ChartEvent,
  ChartDataset,


} from "chart.js";
import { ReportCarrier } from '../models/report.carrier.model';
import { JobCarrier } from '../models/job.carrier.model';
import { JobRequestType } from '../models/job.request.type.model';
import { Status } from '../models/status.model';
import { Job } from '../models/job.model';
import { VehicleService } from '../_services/vehicle.service';
import { ApprovalStatus } from '../models/approval.status.model';
import { PaymentMethod } from '../models/payment.method.model';
import { PaymentStatus } from '../models/payment.status.model';
import { PaymentType } from '../models/payment.type.model';
import { Service } from '../models/service.model';
import { Location } from '../models/location.model';
import { PaymentService } from '../_services/payment.service';
import { Payment } from '../models/payment.model';
import { GroupBy } from '../models/groupBy.model';
import { Employee } from '../models/employee.model';
import { EmployeeRoleService } from '../_services/employee.role.service';
import { EmployeeService } from '../_services/employee.service';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.css']
})
export class CompanyDashboardComponent implements OnInit {

  range: any = 8;
  rangeVehicle: any = 8;

  jobCarriers: JobCarrier[] = new Array();
  currentUser: any;
  currentUserUser: User = new User();
  user: User = new User();
  users: Employee[] = new Array();
  currentEmplyeeId: any;
  setting: Setting = new Setting();

  vehicles: Vehicle[] = new Array();
  vehiclesStatus: Vehicle[] = new Array();
  vehicle: Vehicle = new Vehicle();
  from: Date = new Date();
  to: Date = new Date();
  vehiclesJob: Vehicle[] = new Array();

  cindex: any;
  statusOverview: GroupBy[] = new Array();

  employeeRoles: EmployeeRole[] = new Array();
  jobRequestTypes: JobRequestType[] = new Array();
  statuss: Status[] = new Array();
  services: Service[] = new Array();
  locations: Location[] = new Array();
  paymentStatuss: PaymentStatus[] = new Array();
  paymentMethods: PaymentMethod[] = new Array();
  paymentTypes: PaymentType[] = new Array();
  approvalStatuss: ApprovalStatus[] = new Array();


  public lineVehicleChartData: ChartConfiguration<'bar'>['data'] = {

    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 0], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ]
  };

  public lineVehicleChartDataStatus: ChartConfiguration<'bar'>['data'] = {

    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 0], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ]
  };

  public lineChartOptionsVehicleStatus: ChartOptions<'bar'> = {
    responsive: false,
    maintainAspectRatio: true,
    scales: {
      y: {
        title: {

          display: true,
          text: 'Number of Vehicles'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Status'
        }
      }
    },

    onClick: (
      event: ChartEvent,
      elements: ActiveElement[],
      chart: Chart<'bar'>
    ) => {
      if (elements[0]) {

        console.log('Clicked on ', this.lineVehicleChartDataStatus.labels![elements[0].index]);

        var statusStr = this.lineVehicleChartDataStatus.labels![elements[0].index];

        for (let status of this.statuss) {
          if (status.name == statusStr) {
            this.getAllVehiclesStatus(this.currentUserUser.companyId, status.id);
          }
        }
      }
    },


  };

  public lineChartOptionsVehicle: ChartOptions<'bar'> = {
    responsive: false,
    maintainAspectRatio: true,
    scales: {
      y: {
        title: {

          display: true,
          text: 'Number of Vehicles'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Week Number'
        }
      }
    },

    onClick: (
      event: ChartEvent,
      elements: ActiveElement[],
      chart: Chart<'bar'>
    ) => {
      if (elements[0]) {

        console.log('Clicked on ', this.lineVehicleChartData.labels![elements[0].index]);

        var dateCarrier = {
          from: new Date(),
          to: new Date(),
          year: this.year,
          week: this.lineVehicleChartData.labels![elements[0].index],

        }

        this.getAllVehiclesDate(this.currentUserUser.companyId, dateCarrier);
      }
    },


  };

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [

    ]

  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Number of Jobs'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Week Number'
        }
      }
    },
    onClick: (
      event: ChartEvent,
      elements: ActiveElement[],
      chart: Chart<'line'>
    ) => {
      if (elements[0]) {
        var ids: number[] = new Array();
        console.log('Clicked on ', this.lineChartData.labels![elements[0].index]);
        const char1t = chart.tooltip?.dataPoints[0].label;
        if (chart.tooltip?.dataPoints && chart.tooltip?.dataPoints.length > 0) {
          for (let i = 0; i < chart.tooltip?.dataPoints.length; i++) {
            console.log('Clicked on ', chart.tooltip?.dataPoints[i].dataset.label);
            for (let employee of this.users) {
              if ((employee.firstName + " " + employee.lastName) == chart.tooltip?.dataPoints[i].dataset.label) {
                ids.push(employee.id);
              }
            }
          }

        }
        console.log(ids);
        var dateCarrier = {
          from: new Date(),
          to: new Date(),
          year: this.year,
          week: this.lineChartData.labels![elements[0].index],
          ids: ids
        }
        this.getAllUserUserJobs(dateCarrier);
      }
    },
  };

  public lineChartLegend = true;

  year: any;
  currentJobId: any;
  counter: number = 0;
  week: number = 0;

  constructor(private storageService: StorageService,
    private settingService: SettingService,
    private vehicleService: VehicleService,
    private paymentService: PaymentService,
    private employeeService: EmployeeService,
    private router: Router,
    private userService: UserService,
    private jobService: JobService) {

  }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: data => {
        // this.content = data;
        this.currentUser = this.storageService.getUser();

        if (this.currentUser == null)
          this.router.navigate(['/login']);

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

  }

  getAllVehiclesDate(companyId: any, data: any): void {

    this.vehicleService.getAllVehiclesDate(companyId, data).subscribe({
      next: result => {
        console.log(result);
        this.vehicles = result;

        const element = <HTMLButtonElement>document.querySelector("[id='refresh']");
        if (element)
          element.click();

      }
    })
  }

  isJobChecked(job: Job): boolean {

    if (job.status != 0)
      return true;
    return false;
  }

  getDetail(vehicle: Vehicle, index: any): void {
    this.cindex = index;
  }
  getAllUserUserJobs(data: any): void {

    this.jobService.getJobsForUserUsers(this.currentUserUser.id, data).subscribe({
      next: result => {
        console.log(result);
        if (result) {
          this.jobCarriers = result;
          this.resetEmployeeJobs();
          const element = <HTMLButtonElement>document.querySelector("[id='refresh']");
          if (element)
            element.click();
          console.log(this.jobCarriers.length);
        }
      }
    })
  }

  getCurrentUserFromUser(userId: any): void {

    console.log("getCurrentUserFromUser");
    this.userService.getUserById(userId).subscribe({
      next: result => {

        console.log(result);
        this.currentUserUser = result;
        this.user = this.currentUserUser;
        for (let i = 0; i < this.currentUserUser.roles.length; i++) {
          if (this.currentUserUser.roles[i].name == 'ROLE_ADMIN') {

            //  this.getAllUsers();
            // this.getAllCompany();

          }
          if (this.currentUserUser.roles[i].name == 'ROLE_SHOP' || this.currentUserUser.roles[i].name == 'ROLE_RECYCLER') {

            // this.getCompany(this.currentUserUser.companyId);
            this.getSettings(this.currentUserUser.companyId);
            this.getAllComponyEmployees(this.currentUserUser.companyId);


          }
        }
      }
    })
  }

  getUserPerformance(companyId: any, from: any, to: any, year: any, week: any) {

    var dateCarrier = {
      from: from,
      to: to,
      year: year,
      week: week
    }
    this.jobService.getAllCompanyOverviewBetweenDate(companyId, dateCarrier).subscribe({
      next: result => {
        if (result)
          console.log(result);
      }
    })
  }

  getAllCompanyOverviewBetweenDateMonth(companyId: any, from: any, to: any, year: any, week: any, range: any) {

    var dateCarrier = {
      from: from,
      to: to,
      year: year,
      week: week,
      range: range,
    }
    this.jobService.getAllCompanyOverviewBetweenDateMonth(companyId, dateCarrier).subscribe({
      next: result => {
        if (result)
          console.log(result);
        var reportCarrier: ReportCarrier = result;

        this.lineChartData.datasets = new Array();

        var lables: string[] = new Array();
        var dataset: any[] = new Array();

        var index = 0;
        for (let report of reportCarrier.reports) {
          lables.push(report.label);
        }

        for (let employee of this.users) {

          var dataDataSet: any = new Array();
          var datas: number[] = new Array();
          //dataset = new Array();
          for (let report of reportCarrier.reports) {
            var hasIt = false;
            // datas = new Array();
            for (let groupBy of report.data) {
              if (groupBy.status == employee.id) {
                hasIt = true;
                datas.push(groupBy.count);
              }
            }

            if (hasIt == false) {
              datas.push(0);
            }
            // dataset.push(datas);

            dataset[index] = {
              data: datas,
              label: employee.firstName + " " + employee.lastName,
              fill: false,
              tension: 0.5,
              // borderColor: 'black',
            };
            //this.lineChartData.datasets.push(dataset);
          }

          index++;
        }
        this.lineChartData.datasets = dataset;
        this.lineChartData.labels = lables;

        this.lineChartData = {
          labels: lables,
          datasets: this.lineChartData.datasets
        };

      }
    })
  }
  getAllComponyEmployees(companyId: any): void {

    this.employeeService.getComponyEmployees(companyId).subscribe({
      next: result => {
        this.users = result;
      }
    });
  }

  resetEmployeeJobs(): void {

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
          this.statuss = this.setting.statuss;
          this.paymentTypes = this.setting.paymentTypes;
          // this.company = this.setting.company;

          this.getStatusOverview(this.currentUserUser.companyId);
          this.getOthers();

        }
      }
    })
  }


  private getOthers() {
    let now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    this.week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    this.year = now.getFullYear();
    this.from = this.weekToDate(this.year, this.week);
    this.to = this.weekToDate(this.year, this.week + 1);
    this.to.setDate(this.to.getDate() - 1);

    // convert to UTC
    this.from = new Date(this.from.getTime() + this.from.getTimezoneOffset() * 60000);
    this.to = new Date(this.to.getTime() + this.to.getTimezoneOffset() * 60000);


    this.getVehicleCountOverview(this.currentUserUser.companyId, this.from, this.to, this.year, this.week, this.rangeVehicle);
    this.getAllCompanyOverviewBetweenDateMonth(this.currentUserUser.companyId, this.from, this.to, this.year, this.week, this.range);
  }

  getMyJobs(employeeId: any): void {

    this.currentEmplyeeId = employeeId;
  }

  setJobId(jobId: any): void {
    this.currentJobId = jobId;
  }

  setWeek($event: any) {
    console.log($event.target.value);
    this.year = $event.target.value.substring(0, 4);
    var week = $event.target.value.substring(6);

    week = +week;

    console.log("year " + this.year + " week " + week);
    this.from = this.weekToDate(this.year, week);
    this.to = this.weekToDate(this.year, week + 1);
    this.to.setDate(this.to.getDate() - 1);

    // convert to UTC
    this.from = new Date(this.from.getTime() + this.from.getTimezoneOffset() * 60000);
    this.to = new Date(this.to.getTime() + this.to.getTimezoneOffset() * 60000);

    console.log(this.from);
    console.log(this.to);

    // var dateCarrier = {
    //   from: this.from,
    //   to: this.to,
    //   year: this.year,
    //   week: week
    // }

    // this.jobService.getAllJobsForUserBetweenDate(this.currentEmplyeeId, dateCarrier).subscribe({
    //   next: result => {
    //     if (result) {
    //       console.log(result);
    //       this.vehiclesJob = result;

    //     }
    //   }
    // });

    // this.getUserPerformance(this.currentUserUser.companyId, this.from, this.to, this.year, week);
    this.getAllCompanyOverviewBetweenDateMonth(this.currentUserUser.companyId, this.from, this.to, this.year, week, this.range);

  }
  getAllVehiclesStatus(companyId: any, status: any): void {

    this.vehicleService.getAllVehiclesStatus(companyId, status).subscribe({
      next: result => {
        console.log(result);
        this.vehiclesStatus = result;
        const element = <HTMLButtonElement>document.querySelector("[id='refresh']");
        if (element)
          element.click();
      }
    })

  }

  clearVehicleStatus(): void {
    this.vehiclesStatus = new Array();
  }

  setWeekVehicle($event: any): void {

    console.log($event.target.value);
    this.year = $event.target.value.substring(0, 4);
    var week = $event.target.value.substring(6);

    week = +week;

    console.log("year " + this.year + " week " + week);
    this.from = this.weekToDate(this.year, week);
    this.to = this.weekToDate(this.year, week + 1);
    this.to.setDate(this.to.getDate() - 1);

    // convert to UTC
    this.from = new Date(this.from.getTime() + this.from.getTimezoneOffset() * 60000);
    this.to = new Date(this.to.getTime() + this.to.getTimezoneOffset() * 60000);

    console.log(this.from);
    console.log(this.to);

    var dateCarrier = {
      from: this.from,
      to: this.to,
      year: this.year,
      week: week
    }

    this.getVehicleCountOverview(this.currentUserUser.companyId, this.from, this.to, this.year, week, this.rangeVehicle);

  }

  getVehicleCountOverview(companyId: any, from: Date, to: Date, year: any, week: any, range: any): void {

    var dateCarrier = {
      from: from,
      to: to,
      year: year,
      week: week,
      range: range
    }

    this.vehicleService.getVehicleCountOverview(companyId, dateCarrier).subscribe({
      next: result => {
        console.log(result);
        var reportCarrier: ReportCarrier = result;
        var lables: any[] = new Array();
        var counts: any[] = new Array();
        for (let report of reportCarrier.reports) {
          lables.push("" + report.label);
          counts.push(report.counts);
        }

        this.lineVehicleChartData = {
          labels: lables,
          datasets: [{ data: counts, label: 'Satistics' }]
        };

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

  onChangeStatus($event: any, status: any): void {

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

  onChangeLocation($event: any, location: any): void {

    console.log("onChangeLocation");
    this.vehicle.location = location;
    this.vehicle.reason = "location";
    this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
      next: result => {
        console.log("onChangeLocation", result);
        this.vehicle = result;
        this.vehicle.reason = "";
        // this.getLocationOverview(this.user.companyId);
      }
    })
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
          //this.searchVehicle(5);
        }
      })
    }


  }

  getStatusOverview(companyId: any): void {
    console.log("getOverview");
    this.vehicleService.getOverview(companyId).subscribe({
      next: result => {
        console.log(result);
        this.statusOverview = result;

        var labels: any[] = new Array();
        var datas: number[] = new Array();

        for (let status of this.statuss) {

          labels.push(status.name);
          var hasIt = false;

          for (let groupBy of this.statusOverview) {

            if (groupBy.status == status.id) {
              hasIt = true;
              datas.push(groupBy.count);
            }
          }

          if (hasIt == false)
            datas.push(0);
        }

        this.lineVehicleChartDataStatus = {
          labels: labels,
          datasets: [{ data: datas, label: 'Production Overview' }]
        };
      }, error: (e) => console.log(e)
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

}
