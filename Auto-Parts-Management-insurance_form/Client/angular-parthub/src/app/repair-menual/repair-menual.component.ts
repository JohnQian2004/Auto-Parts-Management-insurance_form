import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Config } from '../models/config.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { AuthService } from '../_services/auth.service';
import { Company } from '../models/company.model'
import { CompanyService } from '../_services/company.service';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';
import { Service } from '../models/service.model';
import { User } from '../models/user.model';
import { Status } from '../models/status.model';
import { StatusService } from '../_services/status.service';
import { Router } from '@angular/router';
import { Role } from '../models/role.model';
import { Address } from '../models/address.model';
import { SettingService } from '../_services/setting.service';
import { Setting } from '../models/setting.model';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import { ExpenseService } from '../_services/expense.service';
import { Expense } from '../models/expense.model';
import { Vendor } from '../models/vendor.model';
import { ExpenseType } from '../models/expense.type.model';
import { ExpenseTypeService } from '../_services/expense.type.service';
import { PaymentMethod } from '../models/payment.method.model';
import { ImageModel } from '../models/imageModel.model';
import { ActiveElement, Chart, ChartConfiguration, ChartEvent, ChartOptions } from 'chart.js';
import { ReportCarrier } from '../models/report.carrier.model';
import { GroupBy } from '../models/groupBy.model';
import { ScrollService } from '../_services/scroll.service';
import { RepairMenuResponse } from '../models/repair.menu.response';
import { RepairMenualService } from '../_services/repair.menual.service';
declare var bootstrap: any;

@Component({
  selector: 'app-repair-menual',
  templateUrl: './repair-menual.component.html',
  styleUrls: ['./repair-menual.component.css']
})
export class RepairMenualComponent implements OnInit, AfterViewInit {

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";

  setting: Setting = new Setting();

  company: Company = new Company();
  companies: Company[] = new Array();


  statuss: Status[] = new Array();
  status: Status = new Service();

  users: User[] = new Array();
  user: User = new User();



  role: any;


  cindex: any;

  message?: any = "";

  messageCount?: any = "";


  currentUserUser: User = new User();

  iconString?: any;

  htmlContent = '';

  message1 = '';
  currentDate = new Date();

  messageAlert: any;
  messagePart: any = "";


  errorMessage: any = "";
  successMessage: any;

  successMessageVehicle: any;
  errorMessageVehicle: any;


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

  config: Config = new Config();
  // userService: any;
  constructor(
    private eventBusService: EventBusService,
    private userService: UserService,
    private companyService: CompanyService,
    private settingService: SettingService,
    private storageService: StorageService,
    private statusService: StatusService,
    private router: Router,

    private el: ElementRef,
    private authService: AuthService,
    private renderer: Renderer2,
    private expenseService: ExpenseService,
    private expenseTypeService: ExpenseTypeService,
    private scrollService: ScrollService,
    private repairMenualService: RepairMenualService

  ) {
    this.optionsColor = [
      "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burgandy", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "pearl", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"
    ];
  }
  ngAfterViewInit(): void {
    this.addNewUser();
    try {
      var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
      })

      // this.getCurrentUserFromUser(this.currentUser.id);
      // this.getAllUsers();
    } catch (e) {

    }
  }
  ngOnInit(): void {
    this.checkWindowWidth();
    //   this.getAllCustomerStartingPage(0, this.optionsLetter[0], this.pageSize);
    this.userService.getPublicContent().subscribe({
      next: data => {
        if (localStorage.getItem('pageSizeExpense') != null) {

          var pageSize = localStorage.getItem('pageSizeExpense');
          console.log(pageSize);

          if (pageSize != null)
            this.pageSize = + pageSize;
        }

        // this.content = data;
        this.currentUser = this.storageService.getUser();

        if (this.currentUser == null)
          this.router.navigate(['/login']);

        // this.getCompany(1);
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


  optionsColor: string[] = new Array();

  droppedStatus(event: CdkDragDrop<string[]>) {
    console.log("droppedStatus");
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

    this.statusService.updateSeqenceWithId(this.currentUserUser.companyId, sequenceCarriers).subscribe({
      next: result => {

        if (result) {
          this.statuss = result;
          this.statuss = this.statuss.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        }
      }
    })

    // if (this.vehicleJobsOnly == true) {
    //   this.fillCalendarVehicleJob();
    // }
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

  repairMenuResponse: RepairMenuResponse | undefined = new RepairMenuResponse();

  disenabledGetAiRepairMenual: boolean = false;

  getRepairMenuals(inputText: any): void {

    this.disenabledGetAiRepairMenual = true;
    const encodedValue = encodeURIComponent(inputText);

    console.log("getRepairMenual");
    this.repairMenualService.getRepairMenuals(encodedValue).subscribe({
      next: result => {
        this.disenabledGetAiRepairMenual = false;
        console.log(result);
        this.repairMenuResponse = result;

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

        if (this.user.partMarketOnly == true) {
          this.router.navigate(['/autoparts']);
        }

        if (this.user.shopDisplayUser == true) {
          this.router.navigate(['/shopdisplay']);
        }

        for (let i = 0; i < this.currentUserUser.roles.length; i++) {
          if (this.currentUserUser.roles[i].name == 'ROLE_ADMIN') {




          }
          if (this.currentUserUser.roles[i].name == 'ROLE_SHOP' || this.currentUserUser.roles[i].name == 'ROLE_RECYCLER') {

            this.getCompany(this.currentUserUser.companyId);
            // this.getCompanyExpenseType(this.currentUserUser.companyId);
            // this.getAllComponyUsers(this.currentUserUser.companyId);
            // this.getCompanyExpense(0, this.currentUserUser.companyId, 0);
            // this.getCurrentWeekYear();
            //this.getSettings(this.currentUserUser.companyId);

          }
        }
      }
    })
  }
  currentExpenseId: any = 0;

  pageSize: any = 10;

  rememberMePageSize(): void {
    localStorage.setItem('pageSizeExpense', "" + this.pageSize);
  }

  getAllComponyUsers(companyId: any): void {

    this.userService.getAllCompanyUsers(companyId).subscribe({
      next: result => {
        this.users = result;
      }
    });
  }
  rangeExpense: any = 8;

  rangePartMarket: any = 8;
  year: any;
  counter: number = 0;
  week: number = 0;
  from: Date = new Date();
  to: Date = new Date();
  public lineChartLegend = true;

  public lineExpenseChartData: ChartConfiguration<'bar'>['data'] = {

    labels: [],
    datasets: [

    ]
  };

  public lineChartOptionsExpenses: ChartOptions<'bar'> = {
    responsive: false,
    maintainAspectRatio: true,
    scales: {
      y: {
        title: {

          display: true,
          text: 'Total Expense in $'
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
      // console.log( elements);
      if (elements[0]) {

        var weekNumber = this.lineExpenseChartData.labels![elements[0].index];
        console.log(weekNumber);

        this.getReports(weekNumber);
        // this.getExpenseTypeReport(weekNumber);
        // this.getVendorReport(weekNumber);
        // this.getPaymentMethodReport(weekNumber);

      }
    },
  };

  weekNumber: any = 0;

  optionsLetter: any[] = new Array();
  currantLetter: any = new Array();

  expenseTypeGroupBy: GroupBy[] = new Array();


  getReports(weekNumber: any): void {

    this.currantLetter = weekNumber;

    this.getExpenseTypeReport(weekNumber);
    this.getVendorReport(weekNumber);
    this.getPaymentMethodReport(weekNumber)
  }

  getExpenseTypeReport(weekNumber: any): void {
    var dateCarrier = {
      year: this.year,
      week: weekNumber
    }

    this.weekNumber = weekNumber;

    // this.expenseTypeGroupBy = new Array();

    this.expenseService.getExpenseTypeReport(this.user.companyId, dateCarrier).subscribe({
      next: result => {
        console.log(result);
        this.expenseTypeGroupBy = result;
        this.resetEmployeeJobs();
        console.log(this.expenseTypeGroupBy);
        const element = <HTMLButtonElement>document.querySelector("[id='refresh']");
        if (element)
          element.click();
      }
    })
  }

  vendorGroupBy: GroupBy[] = new Array();

  getVendorReport(weekNumber: any): void {
    var dateCarrier = {
      year: this.year,
      week: weekNumber
    }

    this.weekNumber = weekNumber;
    // this.expenseTypeGroupBy = new Array();

    this.expenseService.getVendorReport(this.user.companyId, dateCarrier).subscribe({
      next: result => {
        console.log(result);
        this.vendorGroupBy = result;
        this.resetEmployeeJobs();
        console.log(this.vendorGroupBy);
        const element = <HTMLButtonElement>document.querySelector("[id='refresh']");
        if (element)
          element.click();
      }
    })
  }

  paymentMethodGroupBy: GroupBy[] = new Array();

  getPaymentMethodReport(weekNumber: any): void {
    var dateCarrier = {
      year: this.year,
      week: weekNumber
    }

    this.weekNumber = weekNumber;
    // this.expenseTypeGroupBy = new Array();

    this.expenseService.getPaymentMethodReport(this.user.companyId, dateCarrier).subscribe({
      next: result => {
        console.log(result);
        this.paymentMethodGroupBy = result;
        this.resetEmployeeJobs();
        console.log(this.paymentMethodGroupBy);
        const element = <HTMLButtonElement>document.querySelector("[id='refresh']");
        if (element)
          element.click();
      }
    })
  }

  resetEmployeeJobs(): void {

  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  getCurrentWeekYear(): void {

    var year: number = new Date().getFullYear();
    var currentDate: any = new Date();
    var startDate: any = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) /
      (24 * 60 * 60 * 1000));

    //var week: number = Math.ceil(days / 7) + 1;
    var week: number = this.getWeekNumber(new Date());
    // Display the calculated result       
    console.log("Week number of " + currentDate +
      " is :   " + week + " year " + year);

    this.year = year;
    this.from = this.weekToDate(year, week);
    this.to = this.weekToDate(year, week + 1);
    this.to.setDate(this.to.getDate() - 1);

    // convert to UTC
    this.from = new Date(this.from.getTime() + this.from.getTimezoneOffset() * 60000);
    this.to = new Date(this.to.getTime() + this.to.getTimezoneOffset() * 60000);

    // console.log(this.from);
    // console.log(this.to);

    var dateCarrier = {
      from: this.from,
      to: this.to,
      year: this.year,
      week: week
    }

    this.optionsLetter = new Array();
    for (let i = ((week - this.rangeExpense) + 1); i <= week; i++) {
      this.optionsLetter.push(i);
    }

    this.currantLetter = week;

    // const week = getWeekNumber(today).toString().padStart(2, '0');
    this.todayWeek = `${this.year}-W${week}`;

    this.getExpenseWeeklyOverview(this.user.companyId, this.from, this.to, this.year, week, this.rangeExpense);

    this.getExpenseTypeReport(week);
    this.getVendorReport(week);
    this.getPaymentMethodReport(week);

  }

  todayWeek: string = '';


  setExpenseFromGroupBy(expenses: Expense[]): void {
    this.expenses = expenses;
    this.scrollService.scrollToElementById('shopExpensesTop');
  }

  setWeekExpense($event: any): void {

    // console.log($event.target.value);
    this.year = $event.target.value.substring(0, 4);
    var week = $event.target.value.substring(6);

    week = +week;

    // console.log("year " + this.year + " week " + week);
    this.from = this.weekToDate(this.year, week);
    this.to = this.weekToDate(this.year, week + 1);
    this.to.setDate(this.to.getDate() - 1);

    // convert to UTC
    this.from = new Date(this.from.getTime() + this.from.getTimezoneOffset() * 60000);
    this.to = new Date(this.to.getTime() + this.to.getTimezoneOffset() * 60000);

    // console.log(this.from);
    // console.log(this.to);

    var dateCarrier = {
      from: this.from,
      to: this.to,
      year: this.year,
      week: week
    }

    this.optionsLetter = new Array();
    for (let i = ((week - this.rangeExpense) + 1); i <= week; i++) {
      this.optionsLetter.push(i);
    }

    this.getExpenseWeeklyOverview(this.user.companyId, this.from, this.to, this.year, week, this.rangeExpense);
    // this.getUserCountOverview(0, this.from, this.to, this.year, week, this.rangePartMarket);
    // this.getAutopartCountOverview(0, this.from, this.to, this.year, week, this.rangePartMarket);
    // this.getImageCountOverview(0, this.from, this.to, this.year, week, this.rangePartMarket);
    // this.getSystemOverview();
  }

  getExpenseWeeklyOverview(companyId: any, from: Date, to: Date, year: any, week: any, range: any): void {

    var dateCarrier = {
      from: from,
      to: to,
      year: year,
      week: week,
      range: range
    }

    this.expenseService.getExpenseWeeklyOverview(companyId, dateCarrier).subscribe({
      next: result => {
        // console.log(result);
        var reportCarrier: ReportCarrier = result;
        var lables: any[] = new Array();
        var counts: any[] = new Array();
        for (let report of reportCarrier.reports) {
          lables.push("" + report.label);
          counts.push(report.counts);
        }

        this.lineExpenseChartData = {
          labels: lables,
          datasets: [{ data: counts, label: '$' }]
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

  deleteVehicleExpense($event: any, expense: Expense) {
    console.log("deleteVehicleExpense" + expense.id);

    this.expenseService.deleteExpense(expense.id).subscribe({
      next: result => {
        console.log(result);
        this.getCompanyExpense(0, this.currentUserUser.companyId, 0);
        this.getCurrentWeekYear();
      }
    })

  }

  searchInput: any = "";

  getExpenseSubTotal(expense: any): any {

    return +((expense.quantity * expense.amount).toFixed(2));
  }

  onEnterExpense(reason: any, expense: Expense): void {

    expense.reason = reason;
    this.expenseService.createExpense(this.currentUser.id, expense).subscribe({
      next: result => {
        if (result) {
          this.expense = result;
          this.getCurrentWeekYear();
        }
        // this.getVehiclePayments(this.vehicle.id);
      }
    })
  }

  onEnterExpensePaid(reason: any, expense: Expense, paid: boolean): void {
    expense.paid = paid;
    if (paid == true) {
      expense.paidAt = new Date();
    }
    expense.reason = reason;
    this.expenseService.createExpense(this.currentUser.id, expense).subscribe({
      next: result => {
        if (result) {
          this.expense = result;
          this.getCurrentWeekYear();
        }
        // this.getVehiclePayments(this.vehicle.id);
      }
    })
  }

  setExpenseId(expenseId: any): void {
    this.currentExpenseId = expenseId;
    console.log(this.currentExpenseId);
  }

  expenses: Expense[] = new Array();
  expense: Expense = new Expense();
  vendors: Vendor[] = new Array();
  vendor: Vendor = new Vendor();

  paymentMethod: PaymentMethod = new PaymentMethod();
  paymentMethods: PaymentMethod[] = new Array();

  expenseType: ExpenseType = new ExpenseType();
  expenseTypes: ExpenseType[] = new Array();
  searchCount: any = 0;
  currantPageNumber: any = 0;

  searchType: any = 0;

  getCompanyExpense(searchMode: any, companyId: any, pageNumber: any): void {

    this.currantPageNumber = pageNumber;
    this.searchMode = searchMode;

    const data = {
      companyId: this.user.companyId,
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: this.pageSize,
      type: searchMode
    };


    this.expenseService.getAllCompanyExpenseWithPage(data).subscribe({
      next: result => {

        this.expenses = result;
        for (let expense of this.expenses) {
          this.searchCount = expense.searchCount;
        }
        //this.searchCount = this.expenses.length;
      },
      error: err => {
        this.expenses = new Array();

      }
    })
  }

  searchMode: any = 0;

  searchExpenses(searchMode: any, comments: any, pageNumber: any): void {

    this.searchMode = searchMode;

    this.currantPageNumber = pageNumber;

    if (comments == "") {

      const data = {
        companyId: this.user.companyId,
        pageNumber: Math.max(this.currantPageNumber - 1, 0),
        pageSize: this.pageSize,
      };


      this.expenseService.getAllCompanyExpenseWithPage(data).subscribe({
        next: result => {

          this.expenses = result;
          for (let expense of this.expenses) {
            this.searchCount = expense.searchCount;
          }
          //this.searchCount = this.expenses.length;
        }
      })

    } else {
      const data = {
        companyId: this.user.companyId,
        pageNumber: Math.max(this.currantPageNumber - 1, 0),
        pageSize: this.pageSize,
        partName: comments
      };


      this.expenseService.searchExpenseWithPage(data).subscribe({
        next: result => {

          this.expenses = result;
          for (let expense of this.expenses) {
            this.searchCount = expense.searchCount;
          }
          //this.searchCount = this.expenses.length;
        }
      })
    }
  }

  getCompanyExpenseType(companyId: any): void {

    this.expenseTypeService.getAllCompanyExpenseType(companyId).subscribe({
      next: result => {
        this.expenseTypes = result;
      }
    })
  }

  addNewUser(): void {

    this.messageUser = "";
    this.user = new User();
    this.user.id = 0;
    this.user.companyId = this.company.id;
    var role: Role = new Role();
    role.name = "ROLE_USER";
    role.id = 1;
    this.user.roles.push(role);
    var address: Address = new Address();
    address.name = 'ADDRESS_TYPE_DEFAULT';
    this.user.addresses.push(address);

  }

  getUserDetail(user: any, index: any): void {

    this.user = user;
    this.role = this.user.roles[0];
    this.cindex = index;
    this.messageUser = "";
  }

  saveUser(user: any): void {

    if (user.id == 0) {
      this.userService.AddNewUser(user.id, user).subscribe({
        next: result => {
          if (result.message != null) {
            this.messageUser = result.message;
          } else {
            console.log(result);
            this.messageUser = "Successfully Updated";

            this.user = result;
            var hasIt = false;
            for (let i = 0; i < this.users.length; i++) {
              if (this.user.id == this.users[i].id) {
                hasIt = true;
              }
            }
            if (!hasIt) {
              this.users.push(this.user);
            }
          }
        }
      })
    } else {


      this.userService.updateUser(user.id, user).subscribe({
        next: result => {
          if (result.message != null) {
            this.messageUser = result.message;

          } else {
            console.log(result);
            this.messageUser = "Successfully Updated";
            this.user = user;
            var hasIt = false;
            for (let i = 0; i < this.users.length; i++) {
              if (this.user.id == this.users[i].id) {
                hasIt = true;
              }
            }
            if (!hasIt) {
              this.users.push(this.user);
            }
          }
        }
      })
    }
  }
  messageUser: any;

  getUserById(userId: any): void {

    this.userService.getUserById(userId).subscribe({
      next: result => {
        console.log(result);
        this.user = result;

        if (this.user.companyId != 0) {
          this.getSettings(this.user.companyId);

        }

      }
    })

  }

  getSettings(companyId: any): void {

    this.settingService.getSetting(companyId).subscribe({
      next: result => {
        if (result) {

          this.setting = result;
          this.company = this.setting.company;
          this.statuss = this.setting.statuss;
          this.vendors = this.setting.vendors;
          this.paymentMethods = this.setting.paymentMethods;

          this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
        }
      }
    })
  }

  baseUrlResizeImageExpenses = this.config.baseUrl + '/expenseimages/getResize';
  baseUrlResizeImageExpenseGetImages = this.config.baseUrl + '/expenseimages/getImage';

  showAllExpenseInfo: boolean = false;


  selectedImage4: any;
  imageModelSelected: ImageModel = new ImageModel();

  setImage4(imageModel: ImageModel): void {
    this.imageModelSelected = new ImageModel();
    this.selectedImage4 = imageModel.id;
    this.imageModelSelected = imageModel;
    this.imageModelSelected.expenseId = this.expense.id;
  }

  currentIndex: any = 0;

  getDetailsExpense(expense: Expense, index: any): void {
    this.currentIndex = index;
    this.expense = expense;
  }



  onSelectFileEditorExpenses(event: any): void {


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

          this.uploadImageWithFileExpenses(this.expense.id, imageModel);

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

  private uploadImageWithFileExpenses(expenseId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFileExpenses");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', expenseId) //other param
    formData.append('description', "test") //other param

    this.expenseService.uploadImageWithFileWithUserId(formData, expenseId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.expense!.imageModels!.unshift(result);
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


  deleteImageExpense(expenseId: any, imageId: any) {


    console.log("deleteImage");

    this.expenseService.deleteImageWihtUserId(imageId, expenseId, this.currentUser.id).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.expense.imageModels.length; i++) {
          if (this.expense.imageModels[i].id == imageId) {
            this.expense.imageModels.splice(i, 1);
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


  reload(): void {

    this.isSuccessful = false;
  }


  checkWindowWidth(): void {
    const windowWidth = this.renderer.parentNode(this.el.nativeElement).clientWidth;

    if (windowWidth < 767) {
      $('.reminders-box').addClass("reminders-toggle");
      $('.main-content').removeClass("my-fluid-col");
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

  getCompany(companyId: any): void {

    console.log("getCompany");
    //this.companies = new Array();
    this.companyService.getCompany(companyId).subscribe({
      next: result => {

        this.company = result;
        this.company.iconString = "data:image/jpeg;base64," + this.company.icon;

        if (this.companies.length == 0)
          this.companies.push(this.company);

        this.getSettings(this.company.id);
      }
    });

  }


  getAllStatus(companyId: any): void {

    this.statuss = new Array();

    this.statusService.getAllCompanyStatus(companyId).subscribe({
      next: result => {
        if (result)
          this.statuss = result;
      }
    })
  }


  deleteStatus(): void {

    this.statusService.deleteStatus(this.status.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllStatus(this.company.id);

      }
    })
  }

  createStatus(status: Status): void {

    status.companyId = this.company.id;

    if (status.name == null || status.name == '') {
      this.messageVehicleStatus = "Job Status Name is required";
      return;
    }

    if (status.name != null && status.name != '' && status.name.length < 2) {

      this.messageVehicleStatus = "Job Status Name is too short";
      return;
    }

    if (status.comments != null && status.comments != '' && status.comments.length < 2) {

      this.messageVehicleStatus = "Job Status Comments are too short";
      return;
    }

    if (status.name != null && status.name != '' && status.name.length > 255) {

      this.messageVehicleStatus = "Job Status Name is too long";
      return;
    }

    if (status.comments != null && status.comments != '' && status.comments.length > 255) {

      this.messageVehicleStatus = "Job Status Comments are too long";
      return;
    }

    var newEntry: boolean = false;
    if (status.id == null || status.id == 0)
      newEntry = true;


    this.statusService.createStatus(this.currentUser.id, status).subscribe({
      next: result => {
        this.status = result;

        if (newEntry == true)
          this.messageVehicleStatus = "Successfully Created";
        else
          this.messageVehicleStatus = "Successfully Updated";
        this.getAllStatus(this.company.id);
      }
    })
  }
  messageVehicleStatus: any;

  addNewStatus(): void {
    this.status = new Status();
    this.messageVehicleStatus = "";
  }

  messageExpense: any = "";
  addNewExpense(): void {
    this.expense = new Expense();
    this.messageExpense = "";
  }

  createExpense(): void {

    let expense: Expense = new Expense();
    expense.name = "change Me";
    expense.userId = this.user.id;
    expense.companyId = this.currentUserUser.companyId;
    //receipt.amount = 0;
    expense.quantity = 1;
    expense.comments = "";
    //receipt.invoiceNumber = this.randomString();

    this.expenseService.createExpense(this.user.id, expense).subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.getCompanyExpense(0, this.currentUserUser.companyId, 0);
          //this.getCurrentWeekYear();
        }
      }
    })

  }

  getStatusDetail(status: Status, index: any): void {

    this.status = status;
    this.cindex = index;
    this.messageVehicleStatus = "";
  }

}

