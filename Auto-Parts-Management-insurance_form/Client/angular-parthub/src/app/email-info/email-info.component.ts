import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, HostListener } from '@angular/core';
import { EmailInfo } from '../models/email.info.model';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { UserService } from '../_services/user.service';
import { User } from '../models/user.model';
import { EmailInfoService } from '../_services/email.info.service';

@Component({
  selector: 'app-email-info',
  templateUrl: './email-info.component.html',
  styleUrls: ['./email-info.component.css']
})
export class EmailInfoComponent implements OnInit {
  currentUser: any;
  emailInfo: EmailInfo = new EmailInfo();
  user: User = new User();
  currentUserUser: User = new User();
  constructor(
    private storageService: StorageService,
    private emailInfoService: EmailInfoService,
    private userService: UserService,
    private router: Router,) {

  }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: data => {
        // this.content = data;
        this.currentUser = this.storageService.getUser();

        if (this.currentUser == null)
          this.router.navigate(['/login']);

        this.getCurrentUserFromUser(this.currentUser.id);
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

  getCurrentUserFromUser(userId: any): void {

    //  console.log("getCurrentUserFromUser");
    this.userService.getUserById(userId).subscribe({
      next: result => {

        //console.log(result);
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

            $('.reminders-box').addClass("reminders-toggle");
            $('.main-content').removeClass("my-fluid-col");

            this.getEmailInfo();


          }
          if (this.currentUserUser.roles[i].name == 'ROLE_SHOP' || this.currentUserUser.roles[i].name == 'ROLE_RECYCLER') {


          }
        }
      }
    })
  }

  saveEmailInfo(): void {

    this.emailInfo.companyId = 0;
    this.emailInfoService.createAndUpdateStatus(this.user.id, this.emailInfo).subscribe({
      next: result => {
        console.log(result);
        this.emailInfo = result;
        this.successMessage = "Updated Succefully"
      }
    })
  }
  emailInfos: EmailInfo[] = new Array();
  errorMessage: any = "";
  successMessage: any = "";

  getEmailInfo(): void {

    this.emailInfoService.getAllEmailInfo(0).subscribe({
      next: result => {
        this.emailInfos = result;
        if (this.emailInfos && this.emailInfos.length > 0)
          this.emailInfo = this.emailInfos[0];
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
}
