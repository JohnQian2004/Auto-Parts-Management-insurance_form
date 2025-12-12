import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AutopartService } from '../_services/autopart.service';
import { SavedItemService } from '../_services/saveditem.service';
import { ScrollService } from '../_services/scroll.service';
import { StorageService } from '../_services/storage.service';
import { UserService } from '../_services/user.service';
import { AutoPart } from '../models/autopart.model';

@Component({
  selector: 'app-body-shop-admin',
  templateUrl: './body-shop-admin.component.html',
  styleUrls: ['./body-shop-admin.component.css']
})
export class BodyShopAdminComponent implements OnInit {
  content?: string;



  detailSelected: boolean = false;

  showPostForm: boolean = false;

  currentUser: any;

  cindex: any;

  message: any;

  showSearchForm: any;

  constructor(private userService: UserService,
    private scrollService: ScrollService,
    private savedItemService: SavedItemService,
    private autopartService: AutopartService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService) {


  }

  ngOnInit(): void {

    this.userService.getModeratorBoard().subscribe({
      next: data => {
        this.content = data;
        this.currentUser = this.storageService.getUser();
        if (this.currentUser == null)
          this.router.navigate(['/login']);
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

 

  navigateTo(path: any) {

    this.router.navigate(['/admin/' + path], { skipLocationChange: true });
  }

  navigateToHome(path: any, showPostForm: boolean) {

    this.router.navigate(['/admin/' + path + '/true'],
      { skipLocationChange: true });

  }

  getDetail(autoPart: AutoPart, index: any): void {

    window.open(`/detail/` + autoPart.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
  }
}
