import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';
import { ScrollService } from '../_services/scroll.service';
import { SavedItemService } from '../_services/saveditem.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AutopartService } from '../_services/autopart.service';
import { UserSatisticsResponse } from '../models/userSatisticsResponse.model';

@Component({
  selector: 'app-shop-home',
  templateUrl: './shop-home.component.html',
  styleUrls: ['./shop-home.component.css']
})
export class ShopHomeComponent  implements OnInit{

  baseUrlImage = 'http://localhost:8080/api/getImage';
  baseUrlResizeImage = 'http://localhost:8080/api/getResize';
  message1?: string;
  userSatisticsResponse?: UserSatisticsResponse;
  currentUser?:any;
  selectedUserId?: any;

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private scrollService: ScrollService,
    private savedItemService: SavedItemService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private autopartService: AutopartService
  ) {

  }

  ngOnInit(): void{
    this.userService.getModeratorBoard().subscribe({
      next: data => {
        //this.content = data;
        this.currentUser = this.storageService.getUser();
        this.selectedUserId = this.currentUser.id;
        this.getAllFromUserSatistics(this.currentUser.id);
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

  getAllFromUserSatistics(userId: any): void {

    console.log("getAllFromUserSatistics");
    this.userSatisticsResponse = new UserSatisticsResponse();

    this.autopartService.getAllFromUserSatistics(userId).subscribe({
      next: (result) => {

        this.userSatisticsResponse = result;
        console.log("====", this.userSatisticsResponse);

      }
    });
  }

  navigateTo(path: any) {
    this.router.navigate(['/shop/' + path], { skipLocationChange: true });
  }
}
