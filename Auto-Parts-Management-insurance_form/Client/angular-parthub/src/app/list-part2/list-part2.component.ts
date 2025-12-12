import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Observable } from 'rxjs';
import { ImageModel } from '../models/imageModel.model';
import { AutopartService } from '../_services/autopart.service';
import { AutoPart } from '../models/autopart.model';
import * as jsonData from '../../assets/car-list.json';
import { Brand } from '../models/brand.model';
import { ScrollService } from '../_services/scroll.service';
import { StorageService } from '../_services/storage.service';
import { Saveditem } from '../models/saveditem.model';
import { SavedItemService } from '../_services/saveditem.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSatisticsResponse } from '../models/userSatisticsResponse.model';
import { Config } from '../models/config.model';
import { User } from '../models/user.model';
import { EmployeeService } from '../_services/employee.service';
import { Employee } from '../models/employee.model';


@Component({
  selector: 'app-list-part2',
  templateUrl: './list-part2.component.html',
  styleUrls: ['./list-part2.component.css']
})
export class ListPart2Component implements OnInit {

  currantPageNumber?: any = 0;
  searchCount?: any
  pageSize: number = 10;
  pages: number = 1;

  pagesArray: number[] = new Array();
  partNumber: any;

  forArchived: boolean = false;

  detailSelected: boolean = false;
  selectedAutopart: any;
  selectedImage: any = 0;
  user: User = new User();

  imageModels: ImageModel[] = new Array();
  fileToUpload: any;
  imageUrl: any;

  currentImage?: ImageModel;
  employees: Employee[] = new Array();
  users: User[] = new Array();

  carList: any = jsonData;

  carListStringList: Brand[] = new Array();

  currentMode?: string;

  optionsYear: string[] = new Array();
  optionsMake: string[] = new Array();

  optionsModel: string[] = new Array();


  autopartsSearch: AutoPart[] = new Array();
  autopartsSearchOriginal: AutoPart[] = new Array();

  currentUser: any;
  content: any;
  message?: any;
  selectedUserId?: any;
  cindex: number = 0;

  userSatisticsResponse?: UserSatisticsResponse;

  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/getImage';
  baseUrlResizeImage = this.config.baseUrl + '/getResize';

  message1?: string;

  constructor(private userService: UserService,
    private storageService: StorageService,
    private scrollService: ScrollService,
    private employeeService: EmployeeService,
    private savedItemService: SavedItemService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private autopartService: AutopartService
  ) {

    for (let i = 1950; i <= 2026; i++) {
      this.optionsYear.push("" + i);
    }


    this.optionsMake = this.config.optionsMake;



  }

  ngOnInit(): void {

    this.userService.getUserBoard().subscribe({
      next: data => {
        this.content = data;
        this.currentUser = this.storageService.getUser();
        if (this.currentUser != null)
          this.getUserById(this.currentUser.id);
        this.selectedUserId = this.currentUser.id;
        // this.getAllFromUserSatistics(this.currentUser.id);
        // this.applyFilter2("2", false, 0, this.pageSize);
        // this.applyFilter("2", false);
        this.carListStringList = this.carList as Brand[];
        //this.getAllFromUser(this.currentUser.id);
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

  getUserById(userId: any): void {

    this.userService.getUserById(userId).subscribe({
      next: result => {
        // console.log(result);
        this.user = result;
        if (this.user.partMarketOnly == true) {
          this.getAllFromUserSatistics(this.user.id);
          this.applyFilter2("2", false, 0, this.pageSize);
          //this.getAllComponyEmployees(this.user.companyId);
          // this.getAllComponyUsers(this.user.companyId);
        } else {
          this.router.navigate(['/home']);
        }
      }
    })
  }

  onChange($event: any, make: string) {

    console.log(" onChange ");
    //this.carListStringList = this.carList as Brand[];
    for (var i = 0; i < this.carListStringList.length; i++) {

      if (this.carListStringList[i].brand == make) {
        this.optionsModel = this.carListStringList[i].models;
      }

    }

  }

  navigateToHome(path: any, showPostForm: boolean) {

    this.router.navigate(['/' + path],

      { skipLocationChange: true });

  }

  setShowInSearch(index: any): void {

    for (let i = 0; i < this.imageModels.length; i++) {

      this.imageModels[i].showInSearch = false;
      if (i == index) {
        this.imageModels[i].showInSearch = true;
        this.selectedImage = this.imageModels[i];
        this.imageUrl = this.imageModels[i].picByte;
      }
      else
        this.imageModels[i].showInSearch = false;
    }

  }

  setImage(index: any): void {

    this.selectedImage = this.selectedAutopart.imageModels[index].id;
  }

  getAllFromUserSatistics(userId: any): void {

    console.log("getAllFromUserSatistics");
    this.userSatisticsResponse = new UserSatisticsResponse();

    this.autopartService.getAllFromUserSatistics2(userId).subscribe({
      next: (result) => {

        this.userSatisticsResponse = result;
        // console.log("====", this.userSatisticsResponse);

      }
    });
  }

  getAllFromUser(userId: any): void {

    console.log("getAllFromUser");
    this.autopartService.getAllFromUser(userId).subscribe({
      next: (result) => {

        //console.log(result);
        this.autopartsSearch = result;
        //this.autopartsSearchOriginal = result;
        //this.autopartsSearch = this.autopartsSearchOriginal.filter(autopart => autopart.published === true);
        //this.autopartsSearch = result.filter(autopart => autopart.published === false);
        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"
        else
          this.message = "[ " + this.autopartsSearch.length + " ] "

        console.log("====", this.autopartsSearch.length);
        //console.log("====", this.autopartsSearch);

      }
    });
  }

  getAllComponyEmployees(companyId: any): void {

    this.employeeService.getComponyEmployees(companyId).subscribe({
      next: result => {
        if (result)
          //this.users = result;
          console.log(result);
        this.employees = result;
      }
    });
  }

  getAllComponyUsers(companyId: any): void {

    this.userService.getAllCompanyUsers(companyId).subscribe({
      next: result => {
        this.users = result;
      }
    });
  }

  searchAllWithPage(pageNumber: any, pageSize: any, archived: boolean): void {

    this.currantPageNumber = pageNumber;

    if (this.partNumber == null || this.partNumber == "")
      return;
    // this.modeNumber = modelNumber;


    const data = {
      year: 0,
      make: "",
      model: "",
      partName: this.partNumber,
      partNumber: this.partNumber,
      status: 2,
      userId: this.user.id,
      published: true,
      // zipcode: this.zipcode,
      pageNumber: pageNumber,
      pageSize: pageSize,
      archived: archived
    };
    this.detailSelected = false;
    //this.showPostForm = false;
    this.pagesArray = new Array();
    this.searchCount = 0;

    this.autopartService.searchAllWithPageUser(data).subscribe({
      next: (res) => {
        console.log(res);
        this.autopartsSearch = res;
        if (this.autopartsSearch.length > 0) {
          this.searchCount = this.autopartsSearch[0].searchCount;
        }

        this.pages = this.searchCount / pageSize;

        for (let i = 1; i < this.pages + 1; i++) {
          this.pagesArray.push(i);
        }

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"
        else {
          if (this.forArchived == true)
            this.message = "[" + this.partNumber + "] Found [ " + this.searchCount + " ] in Archived";
          else
            this.message = "[" + this.partNumber + "] Found [ " + this.searchCount + " ] in Listed";
        }

        console.log("===searchCount = ", this.searchCount);
        console.log("====", this.autopartsSearch.length);
        console.log("====", this.autopartsSearch);
      },
      error: (e) => {
        console.log("No Match Found");
        this.message = e.error.message;
        this.message = "No Match Found!"
        console.error(e);
      }

    },
    );
  }

  searchPartNumber(pageNumber: any, pageSize: any, modelNumber: any): void {

    this.currantPageNumber = pageNumber;

    if (this.partNumber == null || this.partNumber == "")
      return;
    // this.modeNumber = modelNumber;

    const data = {
      year: 0,
      make: "",
      model: "",
      partName: "",
      partNumber: this.partNumber,
      // zipcode: this.zipcode,
      pageNumber: pageNumber,
      pageSize: pageSize,
      mode: modelNumber
    };
    this.detailSelected = false;
    //this.showPostForm = false;
    this.pagesArray = new Array();
    this.searchCount = 0;

    this.autopartService.searchPartNumberWithPage(data).subscribe({
      next: (res) => {
        console.log(res);
        this.autopartsSearch = res;
        if (this.autopartsSearch.length > 0) {
          this.searchCount = this.autopartsSearch[0].searchCount;
        }

        this.pages = this.searchCount / pageSize;

        for (let i = 1; i < this.pages + 1; i++) {
          this.pagesArray.push(i);
        }

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"
        else
          this.message = "Found [ " + this.searchCount + " ]";

        console.log("===searchCount = ", this.searchCount);
        console.log("====", this.autopartsSearch.length);
        console.log("====", this.autopartsSearch);
      },
      error: (e) => {
        console.log("No Match Found");
        this.message = e.error.message;
        this.message = "No Match Found!"
        console.error(e);
      }

    },
    );
  }

  applyFilter2(condition: string, archived: boolean, pageNumber: any, pageSize: any): void {

    this.detailSelected = false;

    //console.log(" applyFilter ", condition);
    this.currantPageNumber = pageNumber;
    this.forArchived = archived;

    this.pagesArray = new Array();
    if (archived == true)
      this.message = "Archived ";
    else
      this.message = "Listed ";

    var data = {
      userId: this.user.id,
      status: condition,
      pageNumber: pageNumber,
      pageSize: pageSize,
      archived: archived,
      published: true

    }

    this.autopartService.getAllFromUser2(data).subscribe({
      next: (result) => {

        this.autopartsSearch = result;

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"



        //console.log("====", this.autopartsSearch.length);

        if (this.autopartsSearch.length > 0) {
          //this.searchCount = 0;
          this.searchCount = this.autopartsSearch[0].searchCount;
          this.message = this.message + "[ " + this.searchCount + " ] "
          this.pagesArray = new Array();
          this.pages = this.searchCount / pageSize;

          for (let i = 1; i < this.pages + 1; i++) {
            this.pagesArray.push(i);
          }
        }
      }
    });

    // this.ref.detectChanges();
  }

  applyFilter(condition: string, archived: boolean): void {

    console.log(" applyFilter ", condition);

    if (archived == true)
      this.message = "Archived ";
    else
      this.message = "Listed ";

    // if (condition == "Published")
    //   this.autopartsSearch = this.autopartsSearch.filter(autopart => autopart.status === 1);
    // if (condition == "NotPublished")
    //   this.autopartsSearch = this.autopartsSearch.filter(autopart => autopart.status === 0);
    // if (condition == "Archived")
    //   this.autopartsSearch = this.autopartsSearch.filter(autopart => autopart.status === 2);
    // this.message = "";
    // if (condition == "2")
    //   this.message = "Listed "
    // // if (condition == "0")
    // //   this.message = "Not Published "
    // if (condition == "2")
    //   this.message = "Archived "
    //  this.autopartService.getAllFromUserWithStatus(this.currentUser.id, condition).subscribe({
    this.autopartService.getAllFromUserWithStatus(this.user.companyId, condition, archived).subscribe({
      next: (result) => {

        this.autopartsSearch = result;

        if (this.autopartsSearch.length == 0)
          this.message = "No Match Found!"
        else
          this.message = this.message + "[ " + this.autopartsSearch.length + " ] "

        console.log("====", this.autopartsSearch.length);

      }
    });


  }

  editAutopart(autoPart: AutoPart, index: any): void {

    this.cindex = index;
    this.selectedAutopart = autoPart;
    this.detailSelected = true;
    this.selectedImage = this.selectedAutopart.showInSearchImageId;

    for (var i = 0; i < this.carListStringList.length; i++) {

      if (this.carListStringList[i].brand == this.selectedAutopart.make) {
        this.optionsModel = this.carListStringList[i].models;
      }

    }


  }

  AddNewAutopart(): void {


    this.selectedAutopart = new AutoPart();
    this.selectedAutopart.id = 0;
    this.detailSelected = true;

  }


  saveAutopart(): void {

    console.log("saveAutopart");

    this.autopartService.update(this.selectedAutopart.id, this.selectedAutopart).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedAutopart = res;
        this.selectedImage = this.selectedAutopart.showInSearchImageId;
        this.message1 = "Updated Successfully ";

      },
      error: (e) => console.error(e)
    });

  }

  createNewAutopart(): void {

    if (this.imageModels.length > 0) {
      this.selectedAutopart.companyId = this.user.companyId;
      this.selectedAutopart.status = 2;
      this.selectedAutopart.published = true;
      this.selectedAutopart.reason = "posting";

      this.autopartService.create(this.selectedAutopart).subscribe({
        next: (res) => {
          console.log(res);
          this.selectedAutopart = res;

          if (this.imageModels.length > 0) {
            for (let i = 0; i < this.imageModels.length; i++) {

              this.uploadImageWithFile(this.selectedAutopart.id, this.imageModels[i]);
            }
          }


          setTimeout(() => {

            window.open(`#/detail/` + this.selectedAutopart.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
            this.message = "Posted Successfully";
            this.selectedAutopart = new AutoPart();
            this.imageModels = new Array();
            this.imageUrl = null;

            this.getAllFromUserSatistics(this.user.companyId);
            this.applyFilter2("2", this.forArchived, 0, this.pageSize);
            this.cindex = 0;
          }, 2000);

        },
        error: (e) => console.error(e)
      });
    } else {
      this.message1 = "Please choose a file";
    }
  }

  private uploadImageWithFile(autopartId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', autopartId) //other param


    this.autopartService.uploadImageWithFile(formData, autopartId).subscribe({
      next: (result) => {
        console.log(result);
      }
    });


  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
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

  onSelectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;

          this.uploadImage(this.selectedAutopart.id, imageModel);

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

  onSelectFileNew(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;

          if (this.imageModels.length == 0) {
            imageModel.showInSearch = true;
            this.selectedImage = imageModel;

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



  uploadImage(autopartId: any, imageModel: ImageModel) {

    this.autopartService.uploadImage(imageModel, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart.imageModels.push(result);
      }
    });
  }

  deleteImage(autopartId: any, imageId: any) {


    console.log("deleteImage");

    this.autopartService.deleteImage(imageId, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart = this.autopartService.get(autopartId).subscribe({
          next: (result => {
            console.log(result);
            this.selectedAutopart = result;
            this.selectedImage = this.selectedAutopart.showInSearchImageId;

          })
        });
      }
    });
  }

  setImageForSearch(autopartId: any, imageId: any) {


    console.log("setImageForSearch");

    this.autopartService.setImageForSearch(imageId, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart = this.autopartService.get(autopartId).subscribe({
          next: (result => {
            console.log(result);
            this.selectedAutopart = result;
            this.selectedImage = this.selectedAutopart.showInSearchImageId;

          })
        });
      }
    });
  }

  getDetail(autoPart: AutoPart, index: any): void {

    // this.selectedAutopart = autoPart;
    // this.detailSelected = true;

    this.cindex = index;
    //this.scrollService.scrollToElementById(autoPart.id);
    window.open(`#/detail/` + autoPart.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
  }

  backToListing(): void {

    this.detailSelected = false;
    setTimeout(() => {
      if (this.selectedAutopart.id > 0)
        this.scrollService.scrollToElementById(this.selectedAutopart.id);
    }, 200);
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
        this.getAllFromUserSatistics(this.currentUser.id);
        this.applyFilter("2", false);

      }, error: (e) => {
        console.log("publishAutopart error");
        this.message = e.error.message;
        console.error(e);
      }
    });

  }

  archiveAutopart(autoPart: AutoPart, archived: boolean): void {

    autoPart.archived = archived;
    autoPart.status = 2;
    console.log("archiveAutopart");
    this.autopartService.update(autoPart.id, autoPart).subscribe({
      next: result => {

        console.log(" " + result);
        autoPart = result;
        console.log("archiveAutopart updated:", autoPart);
        this.getAllFromUserSatistics(this.user.companyId);

        this.applyFilter2("2", this.forArchived, 0, this.pageSize);
        //this.applyFilter("1", true);

      }, error: (e) => {
        console.log("archiveAutopart error");
        this.message = e.error.message;
        console.error(e);
      }
    });

  }

  deleteAutopart(autoPart: AutoPart, index: any): void {
    //console.log(event.target);

    console.log("deleteAutopart");
    this.autopartService.delete(autoPart.id).subscribe({
      next: data => {
        console.log(" " + data);
        //this.autopartService.delete(index);
        this.getAllFromUserSatistics(this.user.companyId);
        //this.applyFilter("2", true);
        this.applyFilter2("2", false, 0, this.pageSize);
        // this.getAllFromUser(this.currentUser.id);
      },

      error: (e) => {
        console.log("deleteAutopart error");
        this.message = e.error.message;
        console.error(e);
      }

    });
  }

  onChangeFitment(autopart: AutoPart): void {

    if (autopart.fitmented == true && autopart.partNumber != null && autopart.partNumber != "") {

      var fitmentRequest = {
        "autopartId": 0,
        "year": autopart.year,
        "make": autopart.make,
        "model": autopart.model,
        "partNumber": autopart.partNumber

      }
      this.autopartService.getFitmentFromAi(fitmentRequest).subscribe({
        next: result => {
          if (result != null) {

            console.log(result);
            this.selectedAutopart.fitments = result;

          }
        }
      })
    }

  }
}
