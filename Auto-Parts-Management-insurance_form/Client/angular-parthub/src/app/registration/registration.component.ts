import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { CompanyService } from '../_services/company.service';
import { StorageService } from '../_services/storage.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  uuid: string = "";
  private sub: any;
  companyId: any;
  companyName: any;

  form: any = {
    username: null,
    email: null,
    password: null,
    role: 'ROLE_SHOP',
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
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.uuid = params['uuid']; // (+) converts string 'id' to a number
      if (this.uuid == null) {
        this.router.navigate(['/login']);
      }
      console.log(this.uuid);
      var currentUser = this.storageService.getUser();
      if (currentUser != null) {
        this.storageService.clean();
        this.authService.logout();
      }

      $('.reminders-box').addClass("reminders-toggle");
      $('.main-content').removeClass("my-fluid-col");

      this.getCompanyId(this.uuid);
      // In a real app: dispatch action to load the details here.
    });

  }
  getCompanyId(uuid: any): void {

    this.companyService.getCompanyId(uuid).subscribe({
      next: result => {
        console.log(result);
        this.companyId = result.id;
        this.companyName = result.name;
        this.form.bussinessname = this.companyName;
        this.form.bussinessurl = result.c
      }, error: err => {
        if (err.status == 404)
          this.errorMessage = "invalide authenticaton code";
        this.isSignUpFailed = true;
      }
    })

  }

  onSubmit(): void {
    const { firstName, lastName, username, email, password, role, phone, bussinessname, street, city, state, zip, bussinessurl } = this.form;
    // this.authService.register(username, email, password, role,
    this.authService.register2(this.companyId, firstName, lastName, email, email, password, role,
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
