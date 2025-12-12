import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {

  uuid: string = "";
  private sub: any;
  errorMessage: any = "";

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {


  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.uuid = params['uuid']; // (+) converts string 'id' to a number
      console.log(this.uuid);
      this.activation();
      // In a real app: dispatch action to load the details here.
    });
  }

  activation(): void {

    console.log(" activation ");
    this.authService.activate(this.uuid).subscribe({

      next: res => {
        console.log(res);
        if (res.message != null) {
          this.errorMessage = res.message + " Please use a valid link";
          return;
        }
        alert("Successfully Activated. Please proceed to log in");
        this.router.navigateByUrl('/login');
        //this.storageService.clean();
        //this.isLoggedIn = this.storageService.isLoggedIn();
        //this.isLoggedIn = true;
        //this.isLoggedIn= false;
        //window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
