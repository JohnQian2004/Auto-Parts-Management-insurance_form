import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { UserService } from '../_services/user.service';
import { EventBusService } from '../_shared/event-bus.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";
  
  currentUser: any;
  content?: string;

  form: any = {
    id: null,

    password: null,

    newPassword: null,
    newPasswordComfirmed: null,

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
  errorMessage = '';

  constructor(private storageService: StorageService,
    private userService: UserService,
    private router: Router,
    private eventBusService: EventBusService) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    if (this.currentUser == null) {
      this.router.navigate(['/login']);
    }
    if (this.currentUser.username) {

      this.userService.getUser(this.currentUser.username).subscribe({
        next: data => {
         // console.log("profile/user" + data);
          this.currentUser = data;
          this.form.id = this.currentUser.id;
          this.form.password = "";
          this.form.newPassword = "";
          this.form.newPasswordComfirmed = "";

        }
      })
    }
  }

  reload(): void {
    this.isSuccessful = false;
  }

  onSubmit(): void {


    const { id, password, newPassword, newPasswordComfirmed } = this.form;

    if (this.form.password == this.form.newPassword) {
      this.errorMessage = "Same password";
      return;
    }

    if (this.form.newPassword != this.form.newPasswordComfirmed) {
      this.errorMessage = "New passward is not matching with the confirmed password";
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

        this.errorMessage = data.message;

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isUpdateFailed = true;

      }
    });
  }
}