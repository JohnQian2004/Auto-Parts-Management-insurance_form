import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AutopartService } from '../_services/autopart.service';
import { SavedItemService } from '../_services/saveditem.service';
import { ScrollService } from '../_services/scroll.service';
import { StorageService } from '../_services/storage.service';
import { UserService } from '../_services/user.service';
import * as jsonData from '../../assets/car-list.json';
import { Brand } from '../models/brand.model';
import { AutoPart } from '../models/autopart.model';

@Component({
  selector: 'app-search-part',
  templateUrl: './search-part.component.html',
  styleUrls: ['./search-part.component.css']
})
export class SearchPartComponent implements OnInit {

  pageNumber?: any;
  pageSize: number = 5;
  zipcode: string = "21234";
  pagesArray: string[] = new Array();
  pages?: any;

  showTopSearchForm: boolean = false;
  showSearchByNmberForm: boolean = false;

  currantPageNumber?: any;
  searchCount?: any

  showSearchVin: boolean = false;
  message: any;

  optionsYear: string[] = new Array();
  optionsMake: string[] = new Array();
  optionsModel: string[] = new Array();

  carList: any = jsonData;
  carListStringList: Brand[];

  baseUrlImage = 'http://localhost:8080/api/getImage';
  baseUrlResizeImage = 'http://localhost:8080/api/getResize';

  currentUser?: any;
  content?: any;

  showTop: boolean = false;

  cindex?: any;

  vin: string = "ZPBUA1ZL9KLA00848";

  autopartsSearch: AutoPart[] = new Array();
  autopart: AutoPart = {
    year: 2019,
    make: "Lamborghini",
    model: "Urus",
    engine: "",
    transmission: "",
    grade: "A",

    shipping: "FLP",
    warranty: "7D",

    partName: "A Pillar",
    title: '',
    description: '',
    imageModels: [],
    published: false
  };

  constructor(private userService: UserService,
    private storageService: StorageService,
    private scrollService: ScrollService,
    private savedItemService: SavedItemService,
    private router: Router,
    private route: ActivatedRoute,
    private autopartService: AutopartService
  ) {

    for (let i = 1950; i <= 2026; i++) {
      this.optionsYear.push("" + i);
    }


    this.optionsMake = [
      "not selected", "Acura", "Alfa Romeo",
      "Audi",
      "BMW",
      "Chevrolet", "Chrysler", "Citroën",
      "Daewoo", "Dodge",
      "Fiat", "Ford",
      "GMC",
      "Honda", "Hummer", "Hyundai",
      "Infiniti",
      "Jaguar", "Jeep",
      "Kia",
      "Land Rover", "Lamborghini", "Lexus",
      "Mazda", "Mercedes-Benz", "MINI", "Mitsubishi",
      "Nissan",
      "Opel",
      "Peugeot", "Porsche",
      "Renault", "Rover",
      "Saab", "Seat", "Škoda", "Smart", "Subaru", "Suzuki",
      "Toyota",
      "Volkswagen", "Volvo"
    ];

    this.optionsModel = [
      "not selected"
    ];

    this.carListStringList = [];

  }

  ngOnInit(): void {

    //this.showSearchForm = true;
    this.route.params.subscribe(params => {
      const value = params['showPostForm'];
      if (value == 'true') {

        this.showTop = false;
      } else {
        // this.showSearchForm = true;
      }
    });


    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content = data;
        this.currentUser = this.storageService.getUser();
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


    //console.log('Data', this.carList);
    this.carListStringList = this.carList as Brand[];


    for (var i = 0; i < this.carListStringList.length; i++) {
      //console.log('Data2', this.carListStringList[i].brand);
      //console.log('Data3', this.carListStringList[i].models);
    }

    this.optionsModel = [
      "not selected"
    ];


  }

  onChange($event: any, make: string) {

    this.optionsModel = [
      "not selected", "asd"
    ];

    this.carListStringList = this.carList as Brand[];
    for (var i = 0; i < this.carListStringList.length; i++) {
      //console.log('Data2', this.carListStringList[i].brand);
      //console.log('Data3', this.carListStringList[i].models);
      if (this.carListStringList[i].brand == make) {
        this.optionsModel = this.carListStringList[i].models;
      }


    }

  }

  onChangePageSize($event: any, pageSize: any) {

    this.searchPartWithPage(this.currantPageNumber, pageSize);

  }

  searchPartWithPage(pageNumber: any, pageSize: any): void {

    if (this.autopart.partName == null || this.autopart.partName == "")
      return;
    const data = {
      year: this.autopart.year,
      make: this.autopart.make,
      model: this.autopart.model,
      partName: this.autopart.partName,
      partNumber: "",
      zipcode: this.zipcode,
      pageNumber: pageNumber,
      pageSize: pageSize
    };

    //this.detailSelected = false;


    this.pagesArray = new Array();
    this.autopartService.searchByYearMakeModelPartNameWithPage(data).subscribe({
      next: (res) => {
        console.log(res);
        this.autopartsSearch = res;

        this.currantPageNumber = pageNumber;
        this.pageSize = pageSize;

        if (this.autopartsSearch.length > 0) {
          //this.searchCount = 0;
          this.showTopSearchForm = true;
          this.searchCount = this.autopartsSearch[0].serachCount;
          this.pagesArray = new Array();
          this.pages = this.searchCount / pageSize;

          for (let i = 1; i < this.pages + 1; i++) {
            this.pagesArray.push('' + i);
          }

          this.message = "[ " + this.searchCount + " ] Matches. Current Page: " + (pageNumber + 1);

          console.log("===searchCount = ", this.searchCount);
        }

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"

        console.log("====", this.autopartsSearch.length);
        console.log("====", this.autopartsSearch);
      },
      error: (e) => {
        console.log("No Match Found");
        this.message = e.error.message;
        console.error(e);
      }

    },
    );
  }

  getDetail(autoPart: AutoPart, index: any): void {


    window.open(`/detail/` + autoPart.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
    //this.message = "Detail:"
  }

  searchVin(): void {

    this.autopartService.getVin(this.vin).subscribe({
      next: (res) => {
        console.log(res);
        this.autopart = res;
        this.showSearchVin = false;

        for (var i = 0; i < this.carListStringList.length; i++) {
          if (this.carListStringList[i].brand == this.autopart.make) {
            this.optionsModel = this.carListStringList[i].models;
          }

        }

        // this.vinSearched = true;

      },
      error: (e) => console.error(e)
    });
  }

}
