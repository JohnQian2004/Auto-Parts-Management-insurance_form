import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import { UserService } from '../_services/user.service';
import { User } from '../models/user.model';
import { Config } from '../models/config.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };

  config: Config = new Config();

  showPassword: boolean = false;

  domainName: any = "";
  domainSlogan: any = "";

  isActivated = false;
  counterFailed: any = 0;

  showResentComformation = false;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService,
    private eventBusService: EventBusService,
    private userService: UserService,
    private router: Router,
    private storageService: StorageService) {
    this.isActivated = false;
    this.showResentComformation = false;

    this.domainName = this.config.domainName;
    this.domainSlogan = this.config.domainSlogan;
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem('rememberedEmail') != null) {

      var rememberedEmailTemp = localStorage.getItem('rememberedEmail');
      this.form.username = rememberedEmailTemp;

      this.rememberedEmail == true;

      setTimeout(function () {
        const element = <HTMLInputElement>document.querySelector("[id='" + "rememberedEmail2" + "']");
        //console.log("checked ", element.checked);
        //var rememberedEmailTemp = localStorage.getItem('rememberedEmail');
        //this.form.username = rememberedEmailTemp;
        if (element)
          element.click();

      }, 10);


      if (localStorage.getItem('rememberedEmail') == null) {
        localStorage.setItem('rememberedEmail', this.form.username);
      }

    } else {
      this.rememberedEmail == false;
    }


  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;


      this.userService.getUserById(this.storageService.getUser().id).subscribe({
        next: result => {
          //console.log(result);
          let user = new User();
          user = result;
          if (user.partMarketOnly == true) {
            this.router.navigateByUrl('/autoparts');
          } else {
            if (this.roles.includes('ROLE_ADMIN')) {
              if (this.config.domainName.toLocaleLowerCase() != "BayCounter.com".toLocaleLowerCase())
                this.router.navigateByUrl('/users-parts-market');
              else
                this.router.navigateByUrl('/shop-management');
            } else {
              //this.router.navigateByUrl('/dashboard');
              // if (user.allowMainPage == true)
              if (user.shopDisplayUser == true)
                this.router.navigateByUrl('/shopdisplay');
              else
                this.router.navigateByUrl('/inshop');
              // else {
              //   this.router.navigateByUrl('/vehicle2/' + this.config.noMainPageToken);
              // }
            }
          }

        }
      })

      // this.router.navigateByUrl('/home');
    } else {
      this.eventBusService.emit(new EventData('noshow', 0));


    }

  }
  hasStoreage(): boolean {

    if (localStorage.getItem('rememberedEmail') != null) {
      return true;
    } else {
      return false;
    }
  }
  register(): void {
    if (this.config.domainName.toLocaleLowerCase() != "BayCounter.com".toLocaleLowerCase())
      this.router.navigateByUrl('/register');
    else
      this.router.navigateByUrl('/register2');
  }

  rememberedEmail: boolean = false;
  isChecked: boolean = false;

  rememberMe(rememberedEmail: boolean): void {

    if (rememberedEmail && this.form.username != null) {
      localStorage.removeItem('rememberedEmail');
      localStorage.setItem('rememberedEmail', this.form.username);
      //console.log("============================ ||||||||||||| " + this.form.username);
    } else {
      localStorage.removeItem('rememberedEmail');
      //  console.log("============================ " + this.form.username);
    }

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
          this.reloadPage();
          // this.userService.getUserById(this.storageService.getUser().id).subscribe({
          //   next: result => {
          //     console.log(result);
          //     let user = new User();
          //     user = result;
          //     if (user.partMarketOnly == true) {
          //       this.router.navigateByUrl('/autoparts');
          //     } else {
          //       this.router.navigateByUrl('/home');
          //     }

          //   }
          // })

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

  reloadPage(): void {
    window.location.reload();
  }


  isValidEmail(email: any) {
    //var re = /(^[0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*)_@([0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*\.[0-9a-zA-Z]{2,3})$/;


    var re = /^[a-zA-Z0-9]+(?:[_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[_.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,3}$/;
    //var re = new RegExp("^[a-zA-Z0-9][-\._a-zA-Z0-9]*@[a-zA-Z0-9][-\.a-zA-Z0-9]*\.(com|edu|info|gov|int|mil|net|org|biz|name|museum|coop|aero|pro|tv|[a-zA-Z]{2,6})$");
    //var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(email).toLowerCase());
  }

  errorMessageResetPassword: any = "";

  forgetPassword(): void {
    const { username, password } = this.form;
    console.log(username);
    this.authService.forgetPasswordRequest(username, username).subscribe({
      next: result => {

      }, error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    })
  }

  forgetPassword2(): void {
    const { username, password } = this.form;
    console.log(username);
    this.authService.forgetPasswordRequest(username, username).subscribe({
      next: result => {

      }, error: err => {
        this.errorMessageResetPassword = err.error.message;
        // this.isLoginFailed = true;
      }
    })
  }

  username2: any = "";

  forgetPassword3(): void {
    //const { username, password } = this.form;
    console.log(this.username2);
    this.authService.forgetPasswordRequest(this.username2, this.username2).subscribe({
      next: result => {

      }, error: err => {
        this.errorMessageResetPassword = err.error.message;
        this.isLoginFailed = true;
      }
    })
  }

  resendEmail(): void {
    const { username, password } = this.form;
    console.log("===login");
    this.authService.resendEmail(username, password).subscribe({
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
          this.errorMessage = "email sent, please check your mailbox";
        } else {
          this.reloadPage();
          this.router.navigateByUrl('/dashbaord');
        }

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  changePasswordRequest(): void {



  }


}
