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
declare var bootstrap: any;

@Component({
  selector: 'app-job-status',
  templateUrl: './job-status.component.html',
  styleUrls: ['./job-status.component.css']
})
export class JobStatusComponent implements OnInit, AfterViewInit {

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

            //this.getSettings(this.currentUserUser.companyId);

          }
        }
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
          this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
        }
      }
    })
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


  getStatusDetail(status: Status, index: any): void {

    this.status = status;
    this.cindex = index;
    this.messageVehicleStatus = "";
  }

}

