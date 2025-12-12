import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { AutopartService } from '../_services/autopart.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';
import { StorageService } from '../_services/storage.service';
import { SavedItemService } from '../_services/saveditem.service';
import { Saveditem } from '../models/saveditem.model';
import { AutoPart } from '../models/autopart.model';
import { Config } from '../models/config.model';
import { RequestpartService } from '../_services/requestpart.service';

@Component({
  selector: 'app-detail2',
  templateUrl: './detail2.component.html',
  styleUrls: ['./detail2.component.css']
})
export class Detail2Component implements OnInit {

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";

  autopartId: string = "";
  uuid: string = "";
  selectedAutopart: any;
  selectedImage: any = 0;
  currentUser: any;
  private sub: any;

  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/getImage';
  baseUrlResizeImage = this.config.baseUrl + '/getResize';

  showSavedItems: boolean = false;
  savedItems: AutoPart[] = new Array();
  message: any;
  cindex: any;
  showSavedItem: boolean = false;

  display: any;
  center = {
    lat: 22.2736308,
    lng: 70.7512555
  };
  zoom = 6;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private savedItemService: SavedItemService,
    private eventBusService: EventBusService,
    private requestpartService: RequestpartService,
    private autopartService: AutopartService) {

  }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      // this.autopartId = params['autopartId']; // (+) converts string 'id' to a number
      // console.log(this.autopartId);
      // this.eventBusService.emit(new EventData('noshow', this.autopartId));
      // this.currentUser = this.storageService.getUser();
      // this.getDetail(this.autopartId);

      //this.getDetail(this.autopartId);

      this.uuid = params['autopartId']; // (+) converts string 'id' to a number
      console.log(this.uuid);
      this.eventBusService.emit(new EventData('noshow', this.uuid));
      this.currentUser = this.storageService.getUser();
       

      this.getDetailByUuid(this.uuid);



    });
  }


  getDetailByUuid(uuid: any): void {

    console.log(" autopart detail ");
    this.requestpartService.getByUuid(uuid).subscribe({

      next: res => {
        console.log(res);
        this.selectedAutopart = res;
        this.selectedAutopart.showSavedButton = true;
        this.selectedImage = this.selectedAutopart.showInSearchImageId;
        this.center = {
          lat: this.selectedAutopart.lat,
          lng: this.selectedAutopart.lng
        };

        // this.savedItemService.getSavedItem(this.storageService.getUser().id).subscribe(
        //   {
        //     next: (result) => {

        //       this.savedItems = result;
        //       console.log(" savedItems: ", this.savedItems);
        //       for (let i = 0; i < this.savedItems.length; i++) {
        //         if (this.savedItems[i].id == this.selectedAutopart.id) {
        //           this.selectedAutopart.showSavedButton = false;
        //         }
        //       }
        //     },
        //     error: (e) => {
        //       console.log("getSaveItem error");
        //       this.message = e.error.message;
        //       console.error(e);
        //     }
        //   }
        // )



      },
      error: err => {
        console.log(err);
      }
    });
  }

  getDetail(autopartId: any): void {

    console.log(" autopart detail ");
    this.autopartService.get(autopartId).subscribe({

      next: res => {
        console.log(res);
        this.selectedAutopart = res;
        this.selectedAutopart.showSavedButton = true;
        this.selectedImage = this.selectedAutopart.showInSearchImageId;
        this.center = {
          lat: this.selectedAutopart.lat,
          lng: this.selectedAutopart.lng
        };

        this.savedItemService.getSavedItem(this.storageService.getUser().id).subscribe(
          {
            next: (result) => {

              this.savedItems = result;
              console.log(" savedItems: ", this.savedItems);
              for (let i = 0; i < this.savedItems.length; i++) {
                if (this.savedItems[i].id == this.selectedAutopart.id) {
                  this.selectedAutopart.showSavedButton = false;
                }
              }
            },
            error: (e) => {
              console.log("getSaveItem error");
              this.message = e.error.message;
              console.error(e);
            }
          }
        )



      },
      error: err => {
        console.log(err);
      }
    });
  }

  setImage(index: any): void {

    this.selectedImage = this.selectedAutopart.imageModels[index].id;
  }

  getDetailSavedItem(autoPart: AutoPart, index: any): void {

    this.cindex = index;
    window.open(`#/detail/` + autoPart.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');

  }

  addSavedItem(autopartId: any): void {

    this.showSavedItems = true;

    this.selectedAutopart.showSavedButton = false;

    const saveditem: any = {

      userId: this.storageService.getUser().id,
      autopartId: autopartId

    }

    this.savedItemService.createSavedItem(saveditem).subscribe({
      next: (result) => {

        console.log("" + result);
        this.showSavedItem = true;
        //this.getSavedItems(); 
        this.getDetail(autopartId);
      },
      error: (e) => {
        console.log("addSavedItem error");
        this.message = e.error.message;
        //console.error(e);
      }
    })
  }

  deleteSavedItem(event: any, autopartId: any): void {
    //console.log(event.target);

    console.log("deleteSavedItem");
    this.savedItemService.deleteSavedItem(this.storageService.getUser().id, autopartId).subscribe({

      next: data => {
        console.log(" " + data);
        this.selectedAutopart.showSavedButton = true;
        //this.getSavedItems();
        this.getDetail(autopartId);


        // for (let i = 0; i < this.savedItems.length; i++) {
        //   if (this.savedItems[i].id == this.selectedAutopart.id) {
        //     this.selectedAutopart.showSavedButton = false;
        //   }
        // }
        // this.users = data;
      },

      error: (e) => {
        console.log("delete error");
        this.message = e.error.message;
        console.error(e);
      }

    });
  }

  formatPhoneNumber(phoneNumberString: any): string {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');

    // Check if the cleaned number has an extension
    const hasExtension = cleaned.length > 10;

    if (hasExtension) {
      // Extract the main number and extension
      const mainNumber = cleaned.slice(0, 10);
      const extension = cleaned.slice(10);

      // Format with extension
      return `(${mainNumber.slice(0, 3)}) ${mainNumber.slice(3, 6)} ${mainNumber.slice(6)}-${extension}`;
    } else {
      // Format without extension
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }

    // Return an empty string if no valid format found
    return '';
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
          this.message = e.error.message;
          console.error(e);
        }
      }
    )

  }

  publishAutopart(autoPart: AutoPart): void {

    autoPart.published = true;
    autoPart.status = 1;

    console.log("publishAutopart");
    this.autopartService.update(autoPart.id, autoPart).subscribe({
      next: result => {

        console.log(" " + result);
        autoPart = result;
        console.log("publishAutopart updated:", autoPart);

      }, error: (e) => {
        console.log("publishAutopart error");
        this.message = e.error.message;
        console.error(e);
      }
    });

  }

  archiveAutopart(autoPart: AutoPart): void {

    autoPart.archived = true;
    autoPart.status = 2;
    console.log("archiveAutopart");
    this.autopartService.update(autoPart.id, autoPart).subscribe({
      next: result => {

        console.log(" " + result);
        autoPart = result;
        console.log("archiveAutopart updated:", autoPart);

      }, error: (e) => {
        console.log("archiveAutopart error");
        this.message = e.error.message;
        console.error(e);
      }
    });

  }
}
