import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Observable } from 'rxjs';
import { ImageModel } from '../models/imageModel.model';
import { AutopartService } from '../_services/autopart.service';
import { AutoPart } from '../models/autopart.model';
import * as jsonData from '../../assets/car-list.json';
import { Brand } from '../models/brand.model';
import { ScrollService } from '../_services/scroll.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {

  urls: Array<any> = [];

  imageModels: ImageModel[] = new Array();
  //urls = [];
  content?: string;

  baseUrlImage = 'http://localhost:8080/api/getImage';
  baseUrlResizeImage = 'http://localhost:8080/api/getResize';

  carList: any = jsonData;
  carListStringList: Brand[];
  currentMode: string;

  optionsMake: string[];

  optionsModel: string[];

  autopartsSearch: AutoPart[] = new Array();

  autopart: AutoPart = {
    year: 2019,
    make: "Lamborghini",
    model: "Urus",
    engine: "",
    transmission: "",

    partName: "A Pillar",
    title: '',
    description: '',
    imageModels: [],
    published: false
  };

  selectedAutopart: AutoPart = new AutoPart();
  selectedImage: any;

  vinSearched: boolean = false;

  submitted = false;

  detailSelected = false;

  vin: string = "ZPBUA1ZL9KLA00848";

  options: string[];

  fileToUpload: any;
  imageUrl: any;

  currentImage?: ImageModel;

  autopartReturned: AutoPart = {
    year: 0,
    id: '0',
    title: '',
    description: '',
    imageModels: [],
    published: false
  };

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';

  imageInfos?: Observable<any>;

  currentImageData = {
    autopartId: this.autopartReturned.id,
    picByte: ''
  }


  constructor(private userService: UserService,
    private scrollService: ScrollService,
    private autopartService: AutopartService
  ) {


    this.options = [
      "not selected"
    ];

    this.currentMode = "";

    for (let i = 1950; i <= 2026; i++) {
      this.options.push("" + i);
    }


    this.optionsMake = [
      "not selected", "Acura", "Alfa Romeo",
      "Audi",
      "BMW",
      "Chevrolet", "Chrysler", "Citroën",
      "Daewoo", "Dodge",
      "Fiat",  "Fiat", "Ford",
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
    this.userService.getUserBoard().subscribe({
      next: data => {
        this.content = data;
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

    // carListObj = JSON.parse(this.carList);
    //console.log('Data2', this.carListStringList);
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
      // this.optionsModel = new Array(); 
      if (this.carListStringList[i].brand == make) {
        this.optionsModel = this.carListStringList[i].models;
      }


    }

  }

  saveAutopart(): void {

    if (this.imageModels.length > 0) {

      this.autopartService.create(this.autopart).subscribe({
        next: (res) => {
          console.log(res);
          this.autopartReturned = res;

          if (this.imageModels.length > 0) {
            for (let i = 0; i < this.imageModels.length; i++) {
              this.uploadImage(this.autopartReturned.id, this.imageModels[i]);
            }
          }
        },
        error: (e) => console.error(e)
      });
    }
  }


  private uploadImage(autopartId: any, imageModel: ImageModel) {

    this.submitted = true;
    this.autopartService.uploadImage(imageModel, autopartId).subscribe({
      next: (result) => {
        console.log(result);
      }
    });
  }


  getDetail(autoPart: AutoPart): void {

    this.detailSelected = true;
    this.selectedAutopart = autoPart;
    if (autoPart.imageModels)
      this.selectedImage = autoPart.imageModels[0].id;
  }

  setImage(index: any): void {

    this.selectedImage = this.selectedAutopart.imageModels[index].id;
  }

  returnToSearch(): void {

    this.detailSelected = false;

    setTimeout(() => {
      this.scrollService.scrollToElementById(this.selectedAutopart.id);

    }, 100);

  }

  searchVin(): void {

    this.autopartService.getVin(this.vin).subscribe({
      next: (res) => {
        console.log(res);
        this.autopart = res;


        for (var i = 0; i < this.carListStringList.length; i++) {
          if (this.carListStringList[i].brand == this.autopart.make) {
            this.optionsModel = this.carListStringList[i].models;
          }

        }

        this.vinSearched = true;

      },
      error: (e) => console.error(e)
    });
  }

  setShowInSearch(index: any): void {

    for (let i = 0; i < this.imageModels.length; i++) {

      this.imageModels[i].showInSearch = false;
      if (i == index) {
        this.imageModels[i].showInSearch = true;
        this.imageUrl = this.imageModels[i].picByte;
      }
      else
        this.imageModels[i].showInSearch = false;
    }

  }

  onSelectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();


          imageModel.picByte = e.target.result;

          if (this.imageModels.length == 0) {
            imageModel.showInSearch = true;
            //this.preview = e.target.result;
            this.imageUrl = e.target.result;
          } else {
            imageModel.showInSearch = false;
          }

          this.imageModels.push(imageModel);

          var img = new Image();
          img.src = e.target.result;

          img.addEventListener('load', function () {

            console.log(" width ", img.width);
            console.log(" height ", img.height);
          });
        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }


  searchPart(): void {

    const data = {
      year: this.autopart.year,
      make: this.autopart.make,
      model: this.autopart.model,
      partNumber: "",
      partName: this.autopart.partName
    };
    this.detailSelected = false;

    this.autopartService.searchByYearMakeModelPartName(data).subscribe({
      next: (res) => {
        console.log(res);
        this.autopartsSearch = res;

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"
        else
          this.message = "[ " + this.autopartsSearch.length + " ] Matches:"

        console.log("====", this.autopartsSearch.length);
        console.log("====", this.autopartsSearch);
      },
      error: (e) => {
        console.log("No Match Found");
        console.error(e);
      }

    },
    );
  }


}
