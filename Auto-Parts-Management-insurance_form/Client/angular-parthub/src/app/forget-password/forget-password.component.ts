import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";

  uuid: string = "";
  private sub: any;
  showForm: boolean = false;
  userId: any = "";
  form: any = {

    id: null,

    newPassword: null,
    newPasswordComfirmed: null,

  };

  isSuccessful = false;
  isUpdateFailed = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private storageService: StorageService,
    private authService: AuthService) {


  }

  ngOnInit() {


    this.sub = this.route.params.subscribe(params => {
      this.uuid = params['uuid']; // (+) converts string 'id' to a number
      if (this.uuid != null && this.uuid != '') {
        console.log(this.uuid);

        var currentUser = this.storageService.getUser();
        if (currentUser != null) {
          this.storageService.clean();
          this.authService.logout();
        }

        $('.reminders-box').addClass("reminders-toggle");
        $('.main-content').removeClass("my-fluid-col");
        this.verifyUuid();
      } else {
        this.router.navigateByUrl('/login');
      }
      // In a real app: dispatch action to load the details here.
    });
  }

  verifyUuid(): void {

    console.log(" activation ");
    this.authService.verify(this.uuid).subscribe({

      next: res => {
        console.log(res);
        var data = res;
        if (data.message != null && data.message != '') {
          this.errorMessage = data.message;
        } else {
          this.errorMessage = "";
        }

        if (data.activated == true) {
          this.showForm = true;
          this.userId = data.id;
        } else {
          //this.errorMessage = "User is not activated";
        }

      },
      error: err => {
        console.log(err);
      }
    });
  }

  onSubmit(): void {


    const { id, password, newPassword, newPasswordComfirmed } = this.form;

    if (this.form.newPassword != this.form.newPasswordComfirmed) {
      this.errorMessage = "New passward is not matching with the confirmed password";
      return;
    }

    var passwordChangeRequest = {
      oldPassword: this.uuid,
      newPassword: this.form.newPassword
    }

    console.log(" reset pasword ");
    this.userService.passwordResetRequest(this.userId, passwordChangeRequest
    ).subscribe({
      next: data => {
        console.log("reset pasword response:" + data.message);
        // this.router.navigateByUrl('/login');
        this.errorMessage = data.message;
        if (this.errorMessage == 'Password is reset successfully') {
          this.router.navigateByUrl('/login');
        }

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isUpdateFailed = true;

      }
    });
  }
}
