import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { zip } from 'rxjs';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-shop',
  templateUrl: './register-shop.component.html',
  styleUrls: ['./register-shop.component.css']
})
export class RegisterShopComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null,
    passwordConfirm: null,
    role: "ROLE_SHOP",
    firstName: null,
    lastName: null,
    phone: null,

    bussinessname: null,

    bussinessurl: null,
    street: null,
    city: null,
    state: undefined,
    zip: null

  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  showPassword: boolean = false;
  showPasswordComfirm: boolean = false;
  constructor(private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {

    var currentUser = this.storageService.getUser();
    if (currentUser != null)
      this.storageService.clean();

    $('.reminders-box').addClass("reminders-toggle");
    $('.main-content').removeClass("my-fluid-col");
  }


  reset(): void {
    this.form = {
      username: null,
      email: null,
      password: null,
      role: null,
      firstName: null,
      lastName: null,
      phone: null,

      bussinessname: null,

      bussinessurl: null,
      street: null,
      city: null,
      state: null,
      zip: null

    };
    this.isSuccessful = false;
    this.isSignUpFailed = false;
    this.errorMessage = '';
  }

  isValidPhone(phone: any) {

    var re = /^[0-9]{10}$|^[0-9]{12}$|^\d{10}-\d+$/;
    console.log("=================== " + phone + " : " + re.test(phone));
    return re.test(phone);

  }

  isValidZipCode(ziCode: any) {

    var re = /^\d{5}(-\d{4})?$/;
    console.log("=================== " + ziCode + " : " + re.test(ziCode));
    return re.test(ziCode);

  }

  isValidUrl(url: any) {

    var re = /^((http|https|ftp|www):\/\/)?([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]*)(\.)([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\.\:\;\'\,]+)/g;
    return re.test(String(url).toLowerCase());
  }


  // isValidUrl(url: any) {

  //   var re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;

  //   console.log("=================== " + url + " : " + re.test(url));
  //   return re.test(url);

  // }

  navigateTo(path: any) {

    this.router.navigate(['/' + path],
      { skipLocationChange: false });

  }

  isValid(email: any) {
    //var re = /(^[0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*)_@([0-9a-zA-Z]+(?:[._-][0-9a-zA-Z]+)*\.[0-9a-zA-Z]{2,3})$/;


    var re = /^[a-zA-Z0-9]+(?:[_.-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[_.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,3}$/;
    //var re = new RegExp("^[a-zA-Z0-9][-\._a-zA-Z0-9]*@[a-zA-Z0-9][-\.a-zA-Z0-9]*\.(com|edu|info|gov|int|mil|net|org|biz|name|museum|coop|aero|pro|tv|[a-zA-Z]{2,6})$");
    //var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  isSubmitting = false;

  onSubmit(): void {
    const { firstName, lastName, username, email, password, passwordConfirm, role, phone, bussinessname, street, city, state, zip, bussinessurl } = this.form;
    // this.authService.register(username, email, password, role,

    this.isSubmitting = true;

    if (phone != null && phone != "" && this.isValidPhone(phone) == false) {
      this.errorMessage = "Please enter an valid phone";
      this.isSignUpFailed = true;
      return;
    }

    if (zip != null && zip != "" && this.isValidZipCode(zip) == false) {
      this.errorMessage = "Please enter an valid zip code";
      this.isSignUpFailed = true;
      return;
    }

    if (bussinessurl != null && bussinessurl != "" && this.isValidUrl(bussinessurl) == false) {
      this.errorMessage = "Please enter an valid bussiness URL";
      this.isSignUpFailed = true;
      return;
    }

    if (email != null && email != "" && this.isValid(email) == false) {
      this.errorMessage = "Please enter an valid email";
      this.isSignUpFailed = true;
      return;
    }

    if (password != null && password != '' && passwordConfirm != null && passwordConfirm != '' && password != passwordConfirm) {

      this.errorMessage = "Password does not match with Confirmed Password";
      this.isSignUpFailed = true;
      return;
    }

    this.authService.register3(firstName, lastName, email, email, password, role,
      phone, bussinessname, street, city, state, zip, bussinessurl
    ).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
