import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Company } from '../models/company.model'
import { CompanyService } from '../_services/company.service';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { JobRequestType } from '../models/job.request.type.model';
import { JobRequestTypeService } from '../_services/job.request.type.service';
import { Role } from '../models/role.model';
import { Address } from '../models/address.model';
import { SettingService } from '../_services/setting.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import { Setting } from '../models/setting.model'
declare var bootstrap: any;

@Component({
  selector: 'app-job-request-type',
  templateUrl: './job-request-type.component.html',
  styleUrls: ['./job-request-type.component.css']
})
export class JobRequestTypeComponent implements OnInit, AfterViewInit {

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  setting: Setting = new Setting();

  company: Company = new Company();
  companies: Company[] = new Array();



  jobRequestTypes: JobRequestType[] = new Array();
  jobRequestType: JobRequestType = new JobRequestType();


  users: User[] = new Array();
  user: User = new User();

  role: any;

  cindex: any;



  currentUserUser: User = new User();

  iconString?: any;

  htmlContent = '';


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

  // userService: any;
  constructor(
    private eventBusService: EventBusService,
    private userService: UserService,
    private companyService: CompanyService,
    private settingService: SettingService,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router,
    private jobRequestTypeService: JobRequestTypeService,
    private el: ElementRef,
    private renderer: Renderer2,
  ) {


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

  deleteJobRequestType(): void {

    this.jobRequestTypeService.deleteJobRequestType(this.jobRequestType.id).subscribe({
      next: result => {

        console.log(result);
        this.getAllJobRequestType(this.company.id);

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


  messageUser: any;
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
  currentUser: User = new User();
  ngOnInit(): void {
    this.checkWindowWidth();
    //this.getAllCustomerStartingPage(0, this.optionsLetter[0], this.pageSize);
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

  getCompany(companyId: any): void {

    console.log("getCompany");
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
          this.jobRequestTypes = this.setting.JobRequestTypes;
          this.company = this.setting.company;
          this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
          //  this.companyDefaultTaxRate = this.company.taxRate;
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
  errorMessageProfile: any;
  errorMessageResetPassword: any;
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

  messageJobRequestType: any = "";
  addNewJobRequestType(): void {
    this.jobRequestType = new JobRequestType();
    this.messageJobRequestType = "";
  }

  getJobRequestTypeDetail(jobRequestType: JobRequestType, index: any): void {
    this.jobRequestType = jobRequestType;
    this.cindex = index;
    this.messageJobRequestType = "";
  }

  createJobRequestType(jobRequestType: JobRequestType): void {

    jobRequestType.companyId = this.company.id;

    if (jobRequestType.name == null || jobRequestType.name == '') {

      this.messageJobRequestType = "Payment Status name is required";
      return;
    }

    if (jobRequestType.name != null && jobRequestType.name != '' && jobRequestType.name.length < 2) {

      this.messageJobRequestType = "Payment Status Name is too short";
      return;
    }

    if (jobRequestType.name != null && jobRequestType.name != '' && jobRequestType.name.length > 200) {

      this.messageJobRequestType = "Payment Status Name is too long";
      return;
    }

    if (jobRequestType.comments != null && jobRequestType.comments != '' && jobRequestType.comments.length > 200) {

      this.messageJobRequestType = "Payment Status Comments are too long";
      return;
    }

    if (jobRequestType.comments != null && jobRequestType.comments != '' && jobRequestType.comments.length < 2) {

      this.messageJobRequestType = "Payment Status Comments are too short";
      return;
    }


    var newEntry: boolean = false;
    if (jobRequestType.id == null || jobRequestType.id == 0)
      newEntry = true;

    this.jobRequestTypeService.createJobRequestType(this.currentUser.id, jobRequestType).subscribe({
      next: result => {
        this.jobRequestType = result;
        if (newEntry == true)
          this.messageJobRequestType = "Successfully Created";
        else
          this.messageJobRequestType = "Successfully Updated";
        this.getAllJobRequestType(this.company.id);
      }
    })
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

}

