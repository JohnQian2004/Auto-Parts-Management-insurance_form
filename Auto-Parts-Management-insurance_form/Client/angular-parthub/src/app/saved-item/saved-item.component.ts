import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AutopartService } from '../_services/autopart.service';
import { SavedItemService } from '../_services/saveditem.service';
import { ScrollService } from '../_services/scroll.service';
import { StorageService } from '../_services/storage.service';
import { UserService } from '../_services/user.service';
import { UserSatisticsResponse } from '../models/userSatisticsResponse.model';
import { AutoPart } from '../models/autopart.model';
import { Config } from '../models/config.model';

@Component({
  selector: 'app-saved-item',
  templateUrl: './saved-item.component.html',
  styleUrls: ['./saved-item.component.css']
})
export class SavedItemComponent implements OnInit {

  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/getImage';
  baseUrlResizeImage = this.config.baseUrl + '/getResize';

  message1?: string;

  currentUser?: any;
  selectedUserId?: any;
  savedItems: AutoPart[] = new Array();
  cindex?: any;


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

  ngOnInit(): void {
    this.userService.getUserBoard().subscribe({
      next: data => {
        //this.content = data;
        this.currentUser = this.storageService.getUser();
        this.selectedUserId = this.currentUser.id;
        this.getSavedItems();
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

  formatPhoneNumber(phoneNumberString: any): string {
    var formattedNumber = "";
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      formattedNumber = '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return formattedNumber;
  }

  getAllFromUserSatistics(userId: any): void {

    console.log("getAllFromUserSatistics");


    this.savedItemService.getSavedItem(userId).subscribe({
      next: (result) => {


        console.log("====", result);

      }
    });
  }

  navigateTo(path: any) {
    this.router.navigate(['/shop/' + path], { skipLocationChange: true });
  }

  getDetail(autoPart: AutoPart, index: any): void {

    // this.getSavedItems();

    // this.detailSelected = true;
    // this.selectedAutopart = autoPart;

    // this.selectedAutopart.showSavedButton = true;
    this.cindex = index;

    // if (autoPart.imageModels)
    //   this.selectedImage = autoPart.imageModels[0].id;


    // for (let i = 0; i < this.savedItems.length; i++) {
    //   if (this.savedItems[i].id == this.selectedAutopart.id) {
    //     this.selectedAutopart.showSavedButton = false;
    //   }
    // }

    // this.showSavedItems = true;

    window.open(`#/detail/` + autoPart.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
    //this.message = "Detail:"
  }

  deleteSavedItem(event: any, autopartId: any): void {
    //console.log(event.target);

    console.log("deleteSavedItem");
    this.savedItemService.deleteSavedItem(this.storageService.getUser().id, autopartId).subscribe({

      next: data => {
        console.log(" " + data);
        //this.selectedAutopart.showSavedButton = false;
        this.getSavedItems();



        // for (let i = 0; i < this.savedItems.length; i++) {
        //   if (this.savedItems[i].id == this.selectedAutopart.id) {
        //     this.selectedAutopart.showSavedButton = false;
        //   }
        // }
        // this.users = data;
      },

      error: (e) => {
        console.log("delete error");
        //this.message = e.error.message;
        console.error(e);
      }

    });
  }

  getSavedItems(): void {

    this.savedItemService.getSavedItem(this.storageService.getUser().id).subscribe(
      {
        next: (result) => {

          this.savedItems = result;
          console.log(" savedItems: ", this.savedItems);
        },
        error: (e) => {
          console.log("getSaveItem error");
          // this.message = e.error.message;
          console.error(e);
        }
      }
    )

  }

}