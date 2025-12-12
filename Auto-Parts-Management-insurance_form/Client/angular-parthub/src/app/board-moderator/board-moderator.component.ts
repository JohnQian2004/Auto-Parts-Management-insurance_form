import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StorageService } from '../_services/storage.service';
import { ScrollService } from '../_services/scroll.service';
import { AutopartService } from '../_services/autopart.service';
import { SavedItemService } from '../_services/saveditem.service';
import { AutoPart } from '../models/autopart.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-board-moderator',
  templateUrl: './board-moderator.component.html',
  styleUrls: ['./board-moderator.component.css']
})
export class BoardModeratorComponent implements OnInit {
  content?: string;

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
        this.getAllFromUser(this.currentUser.id);
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
        console.log(" " + data);

        if (!this.showSearchForm)
          this.getAllFromUser(this.currentUser.id);

      },

      error: (e) => {
        console.log("deleteAutopart error");
        this.message = e.error.message;
        console.error(e);
      }

    });
  }

  navigateTo(path: any) {
    // let url = '/sites';
    // let queryString = '?siteNo=1234'
    // this.location.replaceState(url, queryString);

    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: {
    //     userId: "123"
    //   } showPostForm
    // });
    // this.router.navigate(['detail', '853'], {skipLocationChange: true});
    this.router.navigate(['/shop/' + path], { skipLocationChange: true });
  }

  navigateToHome(path: any, showPostForm: boolean) {
    // let url = '/sites';
    // let queryString = '?siteNo=1234'
    // this.location.replaceState(url, queryString);

    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: {
    //     userId: "123"
    //   } showPostForm
    // });
    // this.router.navigate(['detail', '853'], {skipLocationChange: true});
    // this.router.navigate(['/shop/' + path,], {
    //   queryParams: {
    //     showPostForm: showPostForm
    //   }, skipLocationChange: true
    // });

    // this.router.navigate(['/shop/' + path,], {
    //   queryParams: {
    //     showPostForm: showPostForm
    //   }, skipLocationChange: true
    // });

    this.router.navigate(['/shop/' + path + '/true'],
      { skipLocationChange: true });

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
    window.open(`/detail/` + autoPart.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
  }
}
