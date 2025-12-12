import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';
import { AutopartService } from '../_services/autopart.service';
import { SavedItemService } from '../_services/saveditem.service';
import { ScrollService } from '../_services/scroll.service';
import { AutoPart } from '../models/autopart.model';
import { User } from '../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  content?: string;

  collapsed: boolean = false;
  
  selectedUserId?: any;

  autopartsSearch: AutoPart[] = new Array();

  autopart: AutoPart = {
    year: 2019,
    make: "Lamborghini",
    model: "Urus",
    engine: "",
    transmission: "",
    grade: "A",

    partName: "A Pillar",
    title: '',
    description: '',
    imageModels: [],
    published: false
  };

  selectedAutopart: AutoPart = new AutoPart();

  detailSelected: boolean = false;

  showPostForm: boolean = false;

  currentUser: any;

  cindex: any;

  message: any;

  baseUrlImage = 'http://localhost:8080/api/getImage';
  baseUrlResizeImage = 'http://localhost:8080/api/getResize';
  showSearchForm: any;



  users?: any;
  constructor(private userService: UserService,
    private scrollService: ScrollService,
    private savedItemService: SavedItemService,
    private autopartService: AutopartService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService) {

  }

  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe({
      next: data => {
        this.content = data;
        this.getAllUsers();
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

  navigateTo() {
    // let url = '/sites';
    // let queryString = '?siteNo=1234'
    // this.location.replaceState(url, queryString);

    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: {
    //     userId: "123"
    //   }
    // });
   // this.router.navigate(['detail', '853'], {skipLocationChange: true});
    this.router.navigate(['/admin/home'], {skipLocationChange: true});
  }


  getAllUsers() {

    console.log("getAllUsers");
    this.userService.getAllUsers(this.storageService.getUser().id).subscribe({

      next: data => {
        this.users = data;
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

  eventCheck(event: any, userId: any): void {
    console.log(event.target);

    console.log("eventCheck");
    this.userService.deleteUser(this.storageService.getUser().id, userId).subscribe({

      next: data => {
        console.log(" " + data);
        this.getAllUsers();
        // this.users = data;
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

  getAllFromUser(userId: any): void {

    console.log("getAllFromUser");
    this.autopartService.getAllFromUser(userId).subscribe({
      next: (result) => {
        this.selectedUserId = userId;
        //console.log(result);
        this.autopartsSearch = result;

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"
        else
          this.message = "[ " + this.autopartsSearch.length + " ] "

        console.log("====", this.autopartsSearch.length);
        //console.log("====", this.autopartsSearch);

      }
    });
  }


  deleteAutopart(event: any, autopartId: any): void {
    //console.log(event.target);

    console.log("eventCheck");
    this.autopartService.delete(autopartId).subscribe({
      next: data => {
        // console.log(" " + data);

        if (!this.showSearchForm)
          this.getAllFromUser(this.selectedUserId);

      },

      error: (e) => {
        console.log("deleteAutopart error");
        this.message = e.error.message;
        console.error(e);
      }

    });
  }

  getDetail(autoPart: AutoPart, index: any): void {

    // this.getSavedItems();

    // this.detailSelected = true;
    // this.selectedAutopart = autoPart;

    // this.selectedAutopart.showSavedButton = true;
    // this.cindex = index;
    // if (autoPart.imageModels)
    //   this.selectedImage = autoPart.imageModels[0].id;




    // for (let i = 0; i < this.savedItems.length; i++) {
    //   if (this.savedItems[i].id == this.selectedAutopart.id) {
    //     this.selectedAutopart.showSavedButton = false;
    //   }
    // }

    // this.showSavedItems = true;

  }
}


