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
import { VehicleService } from '../_services/vehicle.service';
import { Vehicle } from '../models/vehicle.model';
import { ImageModel } from '../models/imageModel.model';
import { TimeScale } from 'chart.js';
import { Status } from '../models/status.model';
import { StatusService } from '../_services/status.service';
import { User } from '../models/user.model';
import { Employee } from '../models/employee.model';
import { JobService } from '../_services/job.service';
import { Job } from '../models/job.model';
import { Platform } from '@angular/cdk/platform';
import { UserService } from '../_services/user.service';
import { EmployeeService } from '../_services/employee.service';
import { SettingService } from '../_services/setting.service';
import { EmployeeRole } from '../models/employee.role.model';
import { Setting } from '../models/setting.model';
import { GroupBy } from '../models/groupBy.model';
import { Location } from '@angular/common';
import { EmployeeRoleService } from '../_services/employee.role.service';
import { ApprovalStatus } from '../models/approval.status.model';
import { ApprovalStatusService } from '../_services/approval.status.service';
import { Vendor } from '../models/vendor.model';
import { VendorService } from '../_services/vendor.service';
import { NoteService } from '../_services/note.service';
import { Supplement } from '../models/supplement.model';
import { SepplementService } from '../_services/supplement.service';
import { ColumnInfoService } from '../_services/column.info.service';
import { ColumnInfo } from '../models/column.info.model';
import { Note } from '../models/note.model';
import { JobProcessor } from '../models/job-processor';
import { mergeEventStores } from '@fullcalendar/core/internal';
import { ParsedLine } from '../models/parsedLine';
import * as pdfjsLib from 'pdfjs-dist';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { PdfFile } from '../models/pdfFile.model';
import { Company } from '../models/company.model';
import { CompanyService } from '../_services/company.service';
import { Insurancer } from '../models/insurancer.model';
import { InsurancerService } from '../_services/insurancer.service';

interface JobOrderType {
  id: number;
  code: string;
  iconClass: string;
  color: string;
  description: string;
}

interface WildCardType {
  id: number;
  code: string;
  description: string;
}

interface ItemType {
  id: number;
  code: string;
  description: string;
}


@Component({
  selector: 'app-detail-vehicle3',
  templateUrl: './detail-vehicle3.component.html',
  styleUrls: ['./detail-vehicle3.component.css']
})
export class DetailVehicle3Component implements OnInit {

  jobOrderTypes: JobOrderType[] = [
    { id: 1, code: "R&I", iconClass: "fa fa-search", color: "text-black", description: "Remove and Inspect" },
    { id: 2, code: "Rpr", iconClass: "fa fa-wrentch", color: "text-danger", description: "Repair" },
    { id: 3, code: "Repl", iconClass: "fa fa-exchange", color: "text-primary", description: "Replace" },
    { id: 4, code: "Add", iconClass: "fa fa-plus", color: "text-danger", description: "Add operation, e.g., clear coat" },
    { id: 5, code: "Misc", iconClass: "fa fa-search", color: "text-black", description: "Miscellaneous operations" }
  ];

  wildCardTypes: WildCardType[] = [
    { id: 1, code: "", description: "Not specified" },
    { id: 2, code: "#", description: "labor involved" },
    { id: 3, code: "*", description: "labor involved" },
    { id: 4, code: "**", description: "parts" },
  ];

  itemTypes: ItemType[] = [
    { id: 1, code: "labor", description: "Labor costs associated with jobs" },
    { id: 2, code: "material", description: "Costs for consumable materials (e.g., paint)" },
    { id: 3, code: "parts", description: "Cost of parts used in the repair" },
    { id: 4, code: "other", description: "Miscellaneous charges or fees" }
  ];

  structuredData: any[] = [];
  jsonDataGrouped: any[] = new Array();
  startPage: number = 3;
  endPage: number = 4;
  pages: any = new Array();
  page: any;
  pdfDocument: any;

  jobOrderTypeMap = new Map(this.jobOrderTypes.map(j => [j.code, j]));

  pdfUrl: SafeResourceUrl | null = null;
  jsonData: any = null;



  socket: WebSocket | undefined;

  readOnly: boolean = false;

  showPassword: boolean = false;
  showPaswordNewConfirmed: boolean = false;
  showPasswordNew: boolean = false;

  errorMessageProfile = "";
  errorMessageResetPassword = "";

  autopartId: string = "";
  uuid: string = "";
  selectedVehicle: any;
  vehicles: Vehicle[] = new Array();
  vehiclesOriginal: Vehicle[] = new Array();
  statuss: Status[] = new Array();
  employees: Employee[] = new Array();

  searchInput: any = "";

  selectedImage: any = 0;
  currentUser: any;
  private sub: any;

  config: Config = new Config();
  baseUrlImage = this.config.baseUrl + '/vehicle/getImage';
  baseUrlResizeImage = this.config.baseUrl + '/vehicle/getResize';
  baseUrlResizeImageJobs = this.config.baseUrl + '/jobimages/getResize';

  baseUrlResizeImageParts = this.config.baseUrl + '/getResize';


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

  user: User = new User();

  pageSize: any = 100;

  approvalStatuss: ApprovalStatus[] = new Array();
  approvalStatus: ApprovalStatus = new ApprovalStatus();

  pdfFiles: PdfFile[] = new Array();


  getPdfFiles(vehicleId: any): void {
    console.log("getPdfFiles")
    this.pdfFiles = new Array();
    this.vehicleService.getPdfFiles(vehicleId).subscribe({
      next: result => {

        console.log(result)
        this.pdfFiles = result;
        this.setNotification(4, this.pdfFiles.length);

        if( this.pdfFiles.length ==1){
          this.getPdf(this.pdfFiles[0].token);
        }

      }
    })
  }

  currentToken: any = "";
  baseUrlPdf = this.config.baseUrl + '/pdf/getPdf';
  pdfUrlPdf: string | null = null;
  urlSafe: SafeResourceUrl | undefined;
  pdfSrc: SafeResourceUrl | null = null;

  counterPdf: any = 0;

  getPdf(token: any): void {

    this.currentToken = token;
    console.log(token);
    this.pdfUrlPdf = this.baseUrlPdf + "/" + token;
    console.log(this.pdfUrlPdf);

    this.http.get(this.pdfUrlPdf, { responseType: 'arraybuffer' }).subscribe(async (data: ArrayBuffer) => {

      console.log(this.pdfUrlPdf);
      const arrayBuffer = new Uint8Array(data);
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      this.pdfDocument = await loadingTask.promise;

      const jsonData = [];
      const startPage = this.startPage;
      const endPage = this.endPage;

      let lineIndex = 0;

      for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
        const page = await this.pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Sort items by Y position
        const itemsSorted = textContent.items.sort(
          (a: any, b: any) => b.transform[5] - a.transform[5]
        );

        let currentLineY = -1;
        let currentLineText = '';

        for (const item of itemsSorted) {
          if ('str' in item && item.str.trim()) {
            if (currentLineY === -1 || Math.abs(item.transform[5] - currentLineY) > 1) {
              if (currentLineText) {
                // const isSkipped =
                //   currentLineText === "Price $" ||
                //   currentLineText.split(" ").length <= 2;
                const isSkipped =
                  currentLineText === "Price $";
                const extracted = this.extractIndexAndText(currentLineText);

                let index = extracted ? extracted.index : ++lineIndex;
                const line = extracted ? extracted.text : currentLineText.trim();

                const parseLine: ParsedLine = this.getPartNumber(index, line);
                if (!line.startsWith("Preliminary") && !line.startsWith("Customer")) {
                  jsonData.push({ index, line, isSkipped, parsedLine: parseLine });
                }
              }
              currentLineText = item.str;
              currentLineY = item.transform[5];
            } else {
              currentLineText += ' ' + item.str;
            }
          }
        }

        // Add the last line if there's any text
        if (currentLineText) {
          const isSkipped =
            currentLineText === "Price $" || currentLineText.split(" ").length <= 2;
          jsonData.push({ index: lineIndex++, line: currentLineText.trim(), isSkipped });
        }
      }

      this.jsonData = jsonData;
      console.log('Extracted Lines:', this.jsonData);

      const jsonDataGrouped = [];
      let currentArea: any = null;

      for (const line of jsonData) {
        const text = line.line.trim();

        if (line.isSkipped) {
          continue;
        }

        if (this.isAreaText(text)) {
          if (currentArea) {
            jsonDataGrouped.push(currentArea);
          }

          currentArea = {
            area: text,
            index: line.index,
            data: [],
          };
        } else if (currentArea) {
          if (this.isNoteText(text)) {
            const lastItem = currentArea.data[currentArea.data.length - 1];
            if (lastItem) {
              lastItem.notes = lastItem.notes || [];
              lastItem.notes.push({ index: lastItem.index, line: text });
            }
          } else {
            currentArea.data.push({ ...line, notes: [] });
          }
        }
      }

      if (currentArea) {
        jsonDataGrouped.push(currentArea);
      }

      this.jsonDataGrouped = jsonDataGrouped;
      console.log('Grouped Data with Notes and Reset Indices:', this.jsonDataGrouped);

      //const fileUrl = URL.createObjectURL(file);
      // this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);


      const base64String = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + base64String);

    });

  }

  deletePdf(token: any) {

    this.vehicleService.deletePdf(token, this.vehicle.id, this.user.id).subscribe({
      next: result => {
        for (let i = 0; i < this.selectedVehicle.pdfFiles.length; i++) {
          if (this.selectedVehicle.pdfFiles[i].token == token) {
            this.selectedVehicle.pdfFiles.splice(i, 1);
          }
        }

        if (this.selectedVehicle.pdfFiles.length > 0) {
          this.getPdf(this.selectedVehicle.pdfFiles[0].token);
        } else {

          this.pdfSrc = null;
        }

      }
    })
  }

  constructor(private route: ActivatedRoute,
    private insurancerService: InsurancerService,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private storageService: StorageService,
    private savedItemService: SavedItemService,
    private eventBusService: EventBusService,
    private autopartService: AutopartService,
    private vehicleService: VehicleService,
    private statusService: StatusService,
    private jobService: JobService,
    private platform: Platform,
    private userService: UserService,
    private employeeService: EmployeeService,
    private employeeRoleService: EmployeeRoleService,
    private settingService: SettingService,
    private approvalStatusService: ApprovalStatusService,
    private vendorService: VendorService,
    private noteService: NoteService,
    private supplementService: SepplementService,
    private columnInfoService: ColumnInfoService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private companyService: CompanyService,

  ) {
    const workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  }

  url: any = "";

  isMobile: boolean = false;

  editAutopart(autopart: AutoPart): void {

    this.message1 = "";
    this.errorMessage = "";
    this.selectedAutopart = autopart;
    this.displayStyleNewParts = "block";
  }

  getAllInsurancer(companyId: any): void {

    this.insurancers = new Array();

    this.insurancerService.getAllCompanyInsurancer(companyId).subscribe({
      next: result => {
        if (result)
          this.insurancers = result;
      }
    })
  }

  getAllVendor(companyId: any): void {

    this.vendors = new Array();

    this.vendorService.getAllCompanyVendor(companyId).subscribe({
      next: result => {
        if (result)
          this.vendors = result;
      }
    })
  }

  setImageForSearchJobs(autopartId: any, imageId: any) {


    console.log("setImageForSearchJobs");

    this.jobService.setImageForSearch(imageId, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.job.imageModels.length; i++) {
          if (this.job.imageModels[i].id == imageId) {
            this.job.showInSearchImageId = this.job.imageModels[i].id;
            //this.selectedImage = this.selectedAutopart.showInSearchImageId;
          }
        }
      }
    });
  }


  // shallShowNVerified(job: Job): boolean {
  //   if (job.startDate != null && job.imageModels.length > 0 && job.status == 1 && job.notifiedAt != null && job.verifiedAt == null)
  //     return true;
  //   else
  //     return false;
  // }

  shallShowNVerified(job: Job): boolean {
    if (job.startDate != null && job.imageModels.length > 0 && job.status == 1 && job.verifiedAt == null)
      return true;
    else
      return false;
  }


  shallShowNofityManger(job: Job): boolean {
    if (job.comments != null && job.startDate != null && job.imageModels.length > 0 &&
      job.status == 1 && job.notifiedAt == null && job.verifiedAt == null)
      return true;
    else
      return false;
  }

  shallShowDone(job: Job): boolean {
    if (job.startDate != null && job.imageModels.length > 0 && job.status == 0)
      return true;
    else
      return false;
  }



  deleteImageJob(jobId: any, imageId: any) {


    console.log("deleteImage");

    this.jobService.deleteImageWihtUserId(imageId, jobId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.job.imageModels.length; i++) {
          if (this.job.imageModels[i].id == imageId) {
            this.job.imageModels.splice(i, 1);
          }
        }
        this.getDetailsJob(this.job, this.currentIndexJob);
      }
    });
  }

  employeeId: any;
  selectedTab: any = 0;


  bottomMenuSetting = [
    {
      label: 'HOME',
      tooltip: 'Vehicle details',
      icon: 'fa-solid fa-home',
      notification: 0,  // Default to 0
      selectedTab: 0,
      sectionId: 0,
      sectionTooltip: 'Vehicle details',
      badgeColor: 'bg-danger',
      menuTextColor: 'text-white',
      menuTextColorActive: 'text-warning'
    },
    {
      label: 'PARTS',
      tooltip: 'Vehicle Parts',
      icon: 'fa-solid fa-cart-shopping',
      notification: 0,  // Default to 0
      selectedTab: 1,
      sectionId: 1,
      sectionTooltip: 'Vehicle Parts',
      badgeColor: 'bg-danger',
      menuTextColor: 'text-white',
      menuTextColorActive: 'text-warning'
    },
    {
      label: 'JOBS',
      tooltip: 'Vehicle Jobs',
      icon: 'fa-solid fa-list',
      notification: 0,  // Default to 0
      selectedTab: 2,
      sectionId: 2,
      sectionTooltip: 'Vehicle Jobs',
      badgeColor: 'bg-danger',
      menuTextColor: 'text-white',
      menuTextColorActive: 'text-warning'
    },
    {
      label: 'SUPPS',
      tooltip: 'Supplements',
      icon: 'fa-solid fa-list',
      notification: 0,  // Default to 0
      selectedTab: 3,
      sectionId: 3,
      sectionTooltip: 'Supplements',
      badgeColor: 'bg-danger',
      menuTextColor: 'text-white',
      menuTextColorActive: 'text-warning'
    },
    {
      label: 'EST',
      tooltip: 'Pdf doc center',
      icon: 'fa-solid fa-file-pdf',
      notification: 0,  // Default to 0
      selectedTab: 4,
      sectionId: 4,
      sectionTooltip: 'Pdf doc center',
      badgeColor: 'bg-danger',
      menuTextColor: 'text-white',
      menuTextColorActive: 'text-warning'
    }
  ];


  setNotification(selectedTab: number, notification: number): void {
    const tab = this.bottomMenuSetting[selectedTab];
    if (tab) {
      tab.notification = notification;
    }
  }

  menuTextColor = 'text-white'; // Default text color
  menuTextColorActive = 'text-warning'; // Active text color
  showNotification = true; // Flag to control visibility of notification badge

  selectedTabMain: any;


  // Handle tab selection event, update the parent component state
  onTabSelected(event: { selectedTab: number, sectionId: number, sectionTooltip: string }) {
    this.selectedTab = event.selectedTab;
    this.selectedTabMain = this.selectedTab;

    console.log(`Selected Tab: ${event.selectedTab}`);
    console.log(`Section ID: ${event.sectionId}`);
    console.log(`Section Tooltip: ${event.sectionTooltip}`);

    if (this.selectedTab == 3) {
      //  this.getPdfFiles(this.selectedVehicle.id);
    }
    // if (this.selectedTab == 5) {

    //   if (this.readOnly == true) {
    //     this.selectedTab = 1;
    //   }
    //   // this.bottomMenuSetting = [
    //   //   {
    //   //     label: 'HOME', tooltip: 'Jobs', icon: 'fa-solid fa-home', notification: 5,
    //   //     selectedTab: 0, sectionId: 0, sectionTooltip: 'Jobs'
    //   //   },
    //   //   {
    //   //     label: 'PAYROLL', tooltip: 'Payroll', icon: 'fa-solid fa-bank', notification: 3,
    //   //     selectedTab: 3, sectionId: 3, sectionTooltip: 'Payroll'
    //   //   }
    //   // ];

    //}
  }

  notifyManager(message: any, color: any, job: Job): void {

    job.reason = message;

    var note = {
      id: 0,
      userId: 0,
      employeeId: this.employeeId,
      jobId: job.id,
      vehicleId: this.selectedVehicle.id,
      reason: "notify",
      sequenceNumber: -1,
      year: this.selectedVehicle.year,
      make: this.selectedVehicle.make,
      model: this.selectedVehicle.model,
      type: message,
      color: color,
      notes: this.selectedVehicle.year + " " + this.selectedVehicle.make + " " + this.selectedVehicle.model +
        "'s job (" + job.name?.toUpperCase() + ")-" + job.id + " is " + message,
      companyId: this.selectedVehicle.companyId
    };

    if (message == 'Noitfy') {
      job.notified = true;
      job.notifiedAt = new Date();
      job.reason = 'Notify';
    }

    if (message == 'Verified') {
      job.userIdVerified = this.user.id;
      job.verifiedAt = new Date();
      job.reason = 'Verified';
    }


    this.jobService.createJob(this.user.id, job).subscribe({
      next: result => {
        if (result) {
          job = result;
          this.job = job;
          this.getJobScore(this.job);
          if (job.status == 1) {
            this.noteService.createNoteUserId(job.id, this.user.id, note).subscribe({
              next: result => {
                if (result) {
                  console.log(result);

                }
              }
            })

          }

        }
      }
    })


  }

  checkHasProof(job: Job): boolean {
    for (let imageModel of job.imageModels) {
      if (imageModel.employeeId == job.employeeId || imageModel.userId == this.user.id) {
        return true;
      }
    }
    return false;
  }

  jobProcessor: JobProcessor = new JobProcessor();

  getJobScore(job: Job): void {

    var score = 0;
    console.log(job);
    console.log(job.startDate);
    if (this.job.startDate != null) {

      score = 20;
      console.log(" 1 " + score);
    }

    if (this.checkHasProof(job) == true) {

      score += 20;
      console.log(" 2 " + score);
    }

    if (job.status == 1) {

      score += 20;
      console.log(" 3 " + score);
    }

    if (job.notifiedAt != null) {
      console.log(" 4 " + score);
      score += 20;
    }

    if (job.verifiedAt != null) {
      score += 20;
      console.log(" 5 " + score);
    }

    console.log(score);

    job.steps = score;
    job.stepDescription = this.jobProcessor.getStepDescription(job.steps);
    job.stepDescriptionCumulative = this.jobProcessor.getCumulativeStepDescription(job.steps);
    job.nextStepDescription = this.jobProcessor.getNextStepDescription(job.steps);

  }

  jobDescriptions = ['Started', 'Uploaded', 'Done', 'Notified', 'Verified'];


  getStepDescription(points: number): string {

    const index = Math.min(Math.floor(points / 20), this.jobDescriptions.length - 1);

    return this.jobDescriptions[index];
  }


  getCumulativeStepDescription(points: number): string {

    const stepsCount = Math.min(Math.floor(points / 20), this.jobDescriptions.length); // Ensure we don't exceed the available steps

    console.log(stepsCount);

    const cumulativeDescriptions = this.jobDescriptions.slice(0, stepsCount);
    console.log(cumulativeDescriptions);
    return cumulativeDescriptions.join(' -> ');
  }


  getJobScoreDuringLoading(job: Job): void {

    var score = 0;
    if (this.job.comments && this.job.comments != "") {
      score = 20;
    }

    if (this.checkHasProof(job) == true) {
      score += 20;
    }

    if (job.status == 1) {
      score += 20;
    }

    if (job.notifiedAt != null) {
      score += 20;
    }

    if (job.verifiedAt != null) {
      score += 20;
    }

    job.steps = score;
    job.stepDescription = this.getStepDescription(job.steps);
    job.stepDescriptionCumulative = this.getCumulativeStepDescription(job.steps);

  }

  updateJob(reason: any, job: any): void {

    job.reason = reason;

    if (job.startDate == null) {
      job.startDate = new Date();
    }


    if (reason == 'notify') {
      job.notified = true;
      job.notifiedAt = new Date();

      this.getJobScore(job)
    } else if (reason == 'done') {

      if (job.status == 1)
        job.status = 0;
      else
        job.status = 1;

      job.endDate = new Date();
      job.reason = 'done',

        this.getJobScore(job)
    } else if (reason == 'downgrade') {
      this.getJobScore(job)
      job.reason = 'downgrade'
    } else {
      this.getJobScore(job)

    }

    this.jobService.createJob(this.user.id, job).subscribe({
      next: result => {

        this.job = result;
        var i = 0;
        for (let job1 of this.jobs) {
          if (job1.id == this.job.id) {
            this.jobs[i] = this.job;
          }
          i++;
        }
        this.getJobScore(this.job);
        this.jobCompletedCount = this.getJobStatus();

      }
    })

  }

  verifyJob(reason: any, job: any): void {

    job.reason = reason;
    job.verifiedAt = new Date();
    job.userIdVerified = this.user.id;

    this.jobService.createJob(this.user.id, job).subscribe({
      next: result => {

        this.job = result;
        var i = 0;
        for (let job1 of this.jobs) {
          if (job1.id == this.job.id) {
            this.jobs[i] = this.job;
          }
          i++;
        }

        this.getJobScore(this.job);

        this.jobCompletedCount = this.getJobStatus();

      }
    })

  }

  onSelectFileEditorJobs(event: any, job: Job): void {


    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      const file = event.target.files[0];


      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        alert('Only JPEG and JPG images are allowed');
        return;
      }

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;

          this.uploadImageWithFileJobs(job.id, imageModel);

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

  counter: any = 0;

  sortList(fieldName: any): void {
    this.counter++;

    if (fieldName == 'id') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.id - b.id);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.id - a.id);
    }


    if (fieldName == 'daysInShop') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.daysInShop - b.daysInShop);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.daysInShop - a.daysInShop);
    }

    if (fieldName == 'inTakeWay') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.inTakeWay - b.inTakeWay);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.inTakeWay - a.inTakeWay);
    }

    if (fieldName == 'status') {

      for (let vehicle of this.vehicles) {
        vehicle.sortStr = "";
        for (let status of this.statuss) {
          if (status.id == vehicle.status) {
            vehicle.sortStr = status.name;
          }
        }
      }

      // if (this.counter % 2 == 1)
      //   this.vehicles = this.vehicles.sort((a, b) => a.status - b.status);
      // else
      //   this.vehicles = this.vehicles.sort((a, b) => b.status - a.status);
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));

    }

    if (fieldName == 'year') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.year - b.year);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.year - a.year);
    }

    if (fieldName == 'make') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['make'].localeCompare(b['make']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['make'].localeCompare(a['make']));
    }

    if (fieldName == 'make') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['make'].localeCompare(b['make']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['make'].localeCompare(a['make']));
    }

    if (fieldName == 'comments') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['comments'].localeCompare(b['comments']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['comments'].localeCompare(a['comments']));
    }


    if (fieldName == 'loanerCarName') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['loanerCarName'].localeCompare(b['loanerCarName']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['loanerCarName'].localeCompare(a['loanerCarName']));
    }


    if (fieldName == 'model') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['model'].localeCompare(b['model']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['model'].localeCompare(a['model']));
    }

    if (fieldName == 'color') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['color'].localeCompare(b['color']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['color'].localeCompare(a['color']));
    }



    if (fieldName == 'insuranceCompany') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['insuranceCompany'].localeCompare(b['insuranceCompany']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['insuranceCompany'].localeCompare(a['insuranceCompany']));
    }


    if (fieldName == 'lastUpdateObjectName') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['lastUpdateObjectName'].localeCompare(b['lastUpdateObjectName']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['lastUpdateObjectName'].localeCompare(a['lastUpdateObjectName']));
    }

    if (fieldName == 'vin') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['vin'].localeCompare(b['vin']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['vin'].localeCompare(a['vin']));
    }

    if (fieldName == 'price') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.price - b.price);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.price - a.price);
    }

    if (fieldName == 'paid') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => Number(a.paid) - Number(b.paid));
      else
        this.vehicles = this.vehicles.sort((a, b) => Number(b.paid) - Number(a.paid));
    }

    if (fieldName == 'vip') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => Number(a.special) - Number(b.special));
      else
        this.vehicles = this.vehicles.sort((a, b) => Number(b.special) - Number(a.special));
    }


    if (fieldName == 'paymentStatus') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.paymentStatus - b.paymentStatus);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.paymentStatus - a.paymentStatus);
    }

    if (fieldName == 'paymentMethod') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.paymentMethod - b.paymentMethod);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.paymentMethod - a.paymentMethod);
    }

    // if (fieldName == 'approvalStatus') {
    //   if (this.counter % 2 == 1)
    //     this.vehicles = this.vehicles.sort((a, b) => a.approvalStatus - b.approvalStatus);
    //   else
    //     this.vehicles = this.vehicles.sort((a, b) => b.approvalStatus - a.approvalStatus);
    // }

    if (fieldName == 'approvalStatus') {
      for (let vehicle of this.vehicles) {
        vehicle.sortStr = "";
        for (let apprivalStatus of this.approvalStatuss) {
          if (apprivalStatus.id == vehicle.keyLocation) {
            vehicle.sortStr = apprivalStatus.name;
          }
        }
      }

      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    }


    // if (fieldName == 'jobRequestType') {
    //   for (let vehicle of this.vehicles) {
    //     vehicle.sortStr = "";
    //     for (let jobRequstType of this.jobRequestTypes) {
    //       if (jobRequstType.id == vehicle.jobRequestType) {
    //         vehicle.sortStr = jobRequstType.name;
    //       }
    //     }
    //   }

    //   if (this.counter % 2 == 1)
    //     this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
    //   else
    //     this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    // }


    if (fieldName == 'targetDateCountDown') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.targetDateCountDown - b.targetDateCountDown);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.targetDateCountDown - a.targetDateCountDown);
    }

    if (fieldName == 'rentalCountDown') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a.rentalCountDown - b.rentalCountDown);
      else
        this.vehicles = this.vehicles.sort((a, b) => b.rentalCountDown - a.rentalCountDown);
    }

    if (fieldName == 'assignedTo') {

      for (let vehicle of this.vehicles) {
        vehicle.sortStr = "";
        for (let employee of this.employees) {
          if (employee.id == vehicle.assignedTo) {
            vehicle.sortStr = employee.firstName + employee.lastName;
          }
        }
      }

      // if (this.counter % 2 == 1)
      //   this.vehicles = this.vehicles.sort((a, b) => a.assignedTo - b.assignedTo);
      // else
      //   this.vehicles = this.vehicles.sort((a, b) => b.assignedTo - a.assignedTo);

      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
      else
        this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    }

    // if (fieldName == 'keyLocation') {
    //   for (let vehicle of this.vehicles) {
    //     vehicle.sortStr = "";
    //     for (let keyLocation of this.keyLocations) {
    //       if (keyLocation.id == vehicle.keyLocation) {
    //         vehicle.sortStr = keyLocation.name;
    //       }
    //     }
    //   }

    //   if (this.counter % 2 == 1)
    //     this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
    //   else
    //     this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    // }


    // if (fieldName == 'location') {

    //   for (let vehicle of this.vehicles) {
    //     vehicle.sortStr = "";
    //     for (let location of this.locations) {
    //       if (location.id == vehicle.location) {
    //         vehicle.sortStr = location.name;
    //       }
    //     }
    //   }

    //   if (this.counter % 2 == 1)
    //     this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
    //   else
    //     this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
    // }

    if (fieldName == 'createdAt') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      else
        this.vehicles = this.vehicles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }


    if (fieldName == 'updatedAt') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      else
        this.vehicles = this.vehicles.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    }

    // if (fieldName == 'customer') {
    //   if (this.counter % 2 == 1)
    //     this.vehicles = this.vehicles.sort((a, b) => a['customer.lastName'].localeCompare(b['customer.lastName']));
    //   else
    //     this.vehicles = this.vehicles.sort((a, b) => b['customer.lastName'].localeCompare(a['customer.lastName']));
    // }

    if (fieldName == 'customer') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => {
          if (a.customer.lastName < b.customer.lastName) {
            return -1;
          } else if (a.customer.lastName > b.customer.lastName) {
            return 1;
          } else {
            return 0;
          }
        });
      else
        this.vehicles = this.vehicles.sort((a, b) => {
          if (a.customer.lastName > b.customer.lastName) {
            return -1;
          } else if (a.customer.lastName < b.customer.lastName) {
            return 1;
          } else {
            return 0;
          }
        });
    }

    if (fieldName == 'phone') {
      if (this.counter % 2 == 1)
        this.vehicles = this.vehicles.sort((a, b) => {
          if (a.customer.phone < b.customer.phone) {
            return -1;
          } else if (a.customer.phone > b.customer.phone) {
            return 1;
          } else {
            return 0;
          }
        });
      else
        this.vehicles = this.vehicles.sort((a, b) => {
          if (a.customer.phone > b.customer.phone) {
            return -1;
          } else if (a.customer.phone < b.customer.phone) {
            return 1;
          } else {
            return 0;
          }
        });
    }

  }
  private uploadImageWithFileJobs(jobId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFileAutoparts");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', jobId) //other param
    formData.append('description', "test") //other param


    this.jobService.uploadImageWithFileWithUserId(formData, jobId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.job.imageModels.unshift(result);
        this.getDetailsJob(this.job, this.currentIndexJob);
      }
    });


  }

  getTopImageLabel(imageModel: ImageModel): any {
    if (imageModel.employeeId > 0) {

      return this.getEmployeeName(imageModel.employeeId);

    } else if (imageModel.userId > 0) {
      //this.getUserName(image)

    } else {

    }
  }

  notes: Note[] = new Array;
  note: Note = new Note();

  ngOnInit() {

    if (this.platform.ANDROID) {
      console.log('Running on Android');
      this.isMobile = true;
    } else if (this.platform.IOS) {
      console.log('Running on iOS');
      this.isMobile = true;
    } else if (this.platform.isBrowser) {
      console.log('Running in a browser');
    }

    this.socket = new WebSocket(this.config.websoketAddress); // Make sure to use wss for HTTPS

    this.socket.onmessage = (event: MessageEvent) => {
      const note = JSON.parse(event.data);
      console.log(note);
      this.notes.push(note);


      this.noteService.getAllCompanyNote(this.user.companyId).subscribe({
        next: result => {
          if (result) {
            this.notes = result;
            this.notes = this.notes.filter(note => note.jobId > 0);
          }
        }
      });

    };
    this.sub = this.route.params.subscribe(params => {


      this.uuid = params['uuid']; // (+) converts string 'id' to a number
      console.log(this.uuid);
      this.eventBusService.emit(new EventData('noshow', this.uuid));
      this.currentUser = this.storageService.getUser();

      if (this.currentUser == null) {
        this.openPopup();
      } else {
        this.closePopup();
        try {
          this.getUserById(this.currentUser.id);


        } catch (error) {
          this.openPopup();
        }
      }


    });
  }

  getEmployeePrice(laborHour: any, employeeId: any): any {

    for (let employee of this.employees) {
      if (employee.id == employeeId) {
        for (let employeeRole of this.employeeRoles) {
          if (employee.roleId == employeeRole.id) {
            return (141.30 * laborHour * employeeRole.precentage / 100).toFixed(1);
          }
        }
      }
    }
    // return 0;
  }

  company: Company = new Company();

  getCompany(companyId: any): void {
    this.companyService.getCompany(companyId).subscribe({
      next: result => {
        this.company = result;
      }
    })
  }
  insurancers: Insurancer[] = new Array();

  getUserById(userId: any): void {

    this.userService.getUserById(userId).subscribe({
      next: result => {
        //console.log(result);
        this.user = result;

        if (this.user.partMarketOnly == true) {

          this.openPopup();
          this.errorMessage = "you are not authorized. Please select read only option ";
          //this.router.navigate(['/autoparts']);
        }

        if (this.uuid == this.config.noMainPageToken) {
          this.searchVehicle(7, 0, this.pageSize);

        } else {

          this.getDetailByUuid(this.uuid);
        }

        if (this.user.companyId != 0 && this.selectedVehicle.companyId == this.user.companyId) {

          this.getCompany(this.user.companyId);
          this.getCompanyApprovalStatus(this.user.companyId);
          this.getCompanyEmployeeRoles(this.user.companyId);
          this.getAllComponyEmployees(this.user.companyId);
          this.getCompanyVendor(this.user.id);
          this.getCompanyColumnInfo(this.user.companyId);


          this.searchVehicle(7, 0, this.pageSize);

          // this.searchVehicle(5, 0, this.pageSize);

        } else {
          this.user = new User();
          this.openPopup();
          this.errorMessage = "you are not authorized. Please select read only option ";
        }

      }
    })

  }

  searchCount: any;

  users: User[] = new Array();
  setting: Setting = new Setting();
  employeeRoles: EmployeeRole[] = new Array();
  statusOverview: GroupBy[] = new Array();
  locationOverview: GroupBy[] = new Array();

  searchType: any = 0;

  currantPageNumber: any = 0;
  vehicle: any = new Vehicle();




  searchVehicle(type: number, pageNumber: any, pageSize: any): void {

    this.searchType = type;

    this.errorMessage = "";

    // if (pageNumber >= this.pagesArray.length)
    //   pageNumber = this.pagesArray.length - 1;

    // if (pageNumber < 0)
    //   pageNumber = 0;

    const data = {
      type: type,
      year: this.vehicle.year,
      make: this.vehicle.make,
      model: this.vehicle.model,
      color: this.vehicle.color,
      archived: false,
      companyId: this.user.companyId,
      partNumber: "placeholder",
      pageNumber: Math.max(this.currantPageNumber - 1, 0),
      pageSize: pageSize,
      lastName: this.searchInput   // only when type == 6
    };

    //console.log(data);

    this.vehicleService.searchByYearMakeModelColor(data).subscribe({
      next: (res) => {
        //console.log(res);

        if (type === 7) {
          this.vehiclesOriginal = res;
          //this.setNotification(5, this.vehiclesOriginal.length);
          this.vehiclesOriginal = this.vehiclesOriginal.sort((a, b) => {
            // First, compare by 'make'
            const makeComparison = a.make.localeCompare(b.make);

            if (makeComparison !== 0) {
              return makeComparison;
            }

            return a.model.localeCompare(b.model);
          });

          // this.vehiclesOriginal = this.vehiclesOriginal.sort((a, b) => a['make'].localeCompare(b['make']));
          for (let vehicle33 of this.vehiclesOriginal) {
            for (let status of this.statuss) {
              if (vehicle33.status == status.id) {
                vehicle33.statusString = status.name;
              }
            }
          }

        } else {

        }


      },
      error: (e) => {
        console.log("No Match Found");
        this.message = e.error.message;
        console.error(e);
      }

    },
    );
  }

  columnInfos: ColumnInfo[] = new Array();
  getCompanyColumnInfo(companyId: any): void {

    this.columnInfoService.getAllCompanyColumnInfo(companyId).subscribe({
      next: result => {
        this.columnInfos = result;
        this.columnInfos = this.columnInfos.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
      }
    })

  }

  getProductionOverview(): void {

    this.getStatusOverview(this.user.companyId);
  }
  getStatusOverview(companyId: any): void {
    //console.log("getOverview");
    this.vehicleService.getOverview(companyId).subscribe({
      next: result => {
        console.log(result);
        this.statusOverview = result;
        // for (let statusoverview of this.statusOverview) {
        //   console.log(statusoverview.status);
        // }
        this.statusOverview = this.statusOverview.sort((a, b) => b.count - a.count);

      }, error: (e) => console.log(e)
    })
  }

  getAllComponyUsers(companyId: any): void {

    this.userService.getAllCompanyUsers(companyId).subscribe({
      next: result => {
        this.users = result;
      }
    });
  }

  getCompanyApprovalStatus(companyId: any): void {

    this.approvalStatusService.getAllCompanyApprovalStatus(companyId).subscribe({
      next: result => {
        this.approvalStatuss = result;
      }
    })
  }


  getCompanyVendor(companyId: any): void {

    this.vendorService.getAllCompanyVendor(companyId).subscribe({
      next: result => {
        this.approvalStatuss = result;
      }
    })
  }

  getCompanyEmployeeRoles(companyId: any): void {

    this.employeeRoleService.getAllCompanyEmployeeRole(companyId).subscribe({
      next: result => {
        this.employeeRoles = result;
      }

    })
  }

  getAllComponyEmployees(companyId: any): void {

    this.employeeService.getComponyEmployees(companyId).subscribe({
      next: result => {
        if (result)
          //this.users = result;
          this.employees = result;

        for (let employee of this.employees) {
          for (let employeeRole of this.employeeRoles) {
            if (employeeRole.id == employee.roleId) {
              employee.roleName = employeeRole.name;
              employee.rolePrecentage = employeeRole.precentage;
              employee.commissionBased = employeeRole.commissionBased;
            }
          }
        }
      }
    });
  }

  displayStyle: any = "None";
  form: any = {
    username: null,
    password: null
  };


  isActivated = false;
  counterFailed: any = 0;

  showResentComformation = false;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  openPopup() {
    this.readOnly = true;
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
    this.readOnly = true;
    this.getDetailByUuid(this.uuid);
  }

  logout(): void {

    console.log(" logging out ");
    this.authService.logout().subscribe({

      next: res => {
        console.log(res);

        this.storageService.clean();
        this.isLoggedIn = false;
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onSubmit(): void {


    const { username, password } = this.form;

    console.log("===login");
    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.isActivated = this.storageService.getUser().activated;

        if (!this.isActivated) {
          this.isLoginFailed = true;
          this.isLoggedIn = false;
          this.storageService.clean();
          this.showResentComformation = true;
          this.errorMessage = "user is not activated, please check your mailbox for activation";
        } else {

          window.location.reload();
          //this.closePopup();

        }

      },
      error: err => {
        this.errorMessage = err.error.message;
        if (this.errorMessage == "Bad credentials")
          this.errorMessage = "Wrong password, please enter correct password";
        this.isLoginFailed = true;
        this.counterFailed++;
        // console.log(this.counterFailed);
      }
    });
  }


  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' }); // Optional: smooth scrolling
    }
  }

  showMyJobsOnly = true;
  getMyJobStatus(): any {
    var counts = 0;
    for (let job of this.jobs) {
      if (job.status == 1 && job.employeeId == this.employeeId)
        counts++;
    }
    return counts;
  }

  getEmployeeName(employeeId: any): any {

    for (let employee of this.employees) {
      if (employee.id == employeeId)
        return employee.firstName + " " + employee.lastName;
    }
  }
  hover: any = null;

  formatPhoneNumber2(phoneNumberString: any): string {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');

    // Check if the cleaned number has an extension
    const hasExtension = cleaned.length > 10;

    if (hasExtension) {
      // Extract the main number and extension
      const mainNumber = cleaned.slice(0, 10);
      const extension = cleaned.slice(10);

      // Format with extension
      return `(${mainNumber.slice(0, 3)})${mainNumber.slice(3, 6)}${mainNumber.slice(6)}-${extension}`;
    } else {
      // Format without extension
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]})${match[2]}-${match[3]}`;
      }
    }

    // Return an empty string if no valid format found
    return '';
  }

  changePaidStatus(vehicle: Vehicle, paid: boolean): void {

    console.log("changePaidStatus");
    vehicle.paid = paid;

    if (paid == true)
      vehicle.reason = "paid";
    else
      vehicle.reason = "unpaid";

    this.vehicleService.createAndUpdateVehicle(this.user.id, vehicle).subscribe({
      next: result => {
        console.log("changePaidStatus", result);
        this.vehicle = result;

        this.vehicle.reason = "";

      }
    })
  }

  debug(sth: any): void {
    console.log(sth);
  }

  optionsColumnInfo = [
    // {
    //   id: 0, sequenceNumber: 0, enabled: true, name: 'id', comments: "Image", header: "",
    //   width: 30, tooltip: "Arravial Date", fieldName: "id", collection: false, color: "black"
    // },
    {
      id: 0, sequenceNumber: 10, enabled: true, name: 'createdAt', comments: "Date", header: "Date.",
      width: 50, tooltip: "Arrival Date", fieldName: "createdAt", collection: false, color: "black"
    },
    {
      id: 0, sequenceNumber: 1, enabled: true, name: 'year', comments: "year", header: "Year",
      width: 50, tooltip: "Year", fieldName: "year", collection: false, color: "black"
    },

    {
      id: 0, sequenceNumber: 2, enabled: true, name: 'make', comments: "make", header: "M",
      width: 50, tooltip: "Make", fieldName: "make", collection: false, color: "black"
    },

    {
      id: 0, sequenceNumber: 3, enabled: true, name: 'model', comments: "model", header: "Model",
      width: 50, tooltip: "Model", fieldName: "model", collection: false, color: "black"
    },

    // {
    //   id: 0, sequenceNumber: 4, enabled: true, name: 'color', comments: "color", header: "Co",
    //   width: 30, tooltip: "Color", fieldName: "color", collection: false, color: "black"
    // },

    {
      id: 0, sequenceNumber: 6, enabled: true, name: 'status', comments: "status", header: "Status",
      width: 100, tooltip: "Status", fieldName: "status", collection: true, color: "black"
    },


    // {
    //   id: 0, sequenceNumber: 9, enabled: true, name: 'paid', comments: "paid/not paid", header: "$",
    //   width: 50, tooltip: "paid/not paid", fieldName: "paid", collection: false, color: "black"
    // },



    // {
    //   id: 0, sequenceNumber: 11, enabled: false, name: 'updatedAt', comments: "Last Update Date", header: "Last Update",
    //   width: 100, tooltip: "Last Update Date", fieldName: "updatedAt", collection: false, color: "black"
    // },

    // {
    //   id: 0, sequenceNumber: 12, enabled: false, name: 'lastUpdateObjectName', comments: "Last Update Info", header: "Last Update Info",
    //   width: 100, tooltip: "Last Update Info", fieldName: "lastUpdateObjectName", collection: false, color: "black"
    // },


    // {
    //   id: 0, sequenceNumber: 18, enabled: true, name: 'price', comments: "price", header: "EST",
    //   width: 100, tooltip: "Estimates(wiwth supplement)", fieldName: "price", collection: false, color: "black"
    // },


    // {
    //   id: 0, sequenceNumber: 21, enabled: false, name: 'insurance Company', comments: "insurance company", header: "Insurance",
    //   width: 100, tooltip: "Insurance Company", fieldName: "insuranceCompany", collection: false, color: "black"
    // },


  ];

  shortList = ['id', 'createdAt', 'year', 'make', 'model', 'status', 'jobRequestType'];
  ifColumnInfoInMyShortList(columnInfo: ColumnInfo): boolean {

    // for (let columnInfo of this.columnInfos) {
    //   for (let fieldName of this.shortList) {
    //     if (fieldName == columnInfo.fieldName) {
    //       this.debug(columnInfo.fieldName);
    //       return true;
    //     }
    //   }
    // }
    return true;
  }
  getDetailByUuid(uuid: any): void {

    console.log(" vehicle detail ");
    this.url = location.origin + "/#/vehicle3/" + uuid;

    this.location.go("/vehicle3/" + uuid);


    for (let bottomSetting of this.bottomMenuSetting) {
      if (bottomSetting.selectedTab != 4) {
        bottomSetting.notification = 0;
      }
    }

    this.vehicleService.getByUuid(uuid).subscribe({


      next: res => {
        //console.log(res);
        this.selectedVehicle = res;
        this.getCompanyApprovalStatus(this.selectedVehicle.companyId);

        this.setNotification(0, this.selectedVehicle.imageModels.length);
        this.setNotification(3, this.selectedVehicle.supplements.length);

        for (let vehicle of this.vehiclesOriginal) {
          if (vehicle.make.includes(' '))
            vehicle.make = vehicle.make.replace(' ', '-');
        }


        if (this.selectedVehicle.make.includes(' '))
          this.selectedVehicle.make = this.selectedVehicle.make.replace(' ', '-');

        this.statuss = this.selectedVehicle.statuss;
        this.employees = this.selectedVehicle.employees;

        this.selectedVehicle.showSavedButton = true;
        if (this.selectedVehicle.imageModels.length > 0) {
          this.selectedVehicle.imageModels = this.selectedVehicle.imageModels.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
        }

        this.selectedImage = this.selectedVehicle.showInSearchImageId;
        this.center = {
          lat: this.selectedVehicle.lat,
          lng: this.selectedVehicle.lng
        };

        if (this.selectedVehicle.id > 0) {
          this.getPdfFiles(this.selectedVehicle.id);
          this.getAutopartForVehicle(this.selectedVehicle.id, true);
          this.getVehicleJobs2(this.selectedVehicle.token);
          //this.getCompanyApprovalStatus(this.selectedVehicle.companyId);
          this.getAllVendor(this.selectedVehicle.companyId);
          this.getAllInsurancer(this.selectedVehicle.companyId);
           

          // this.setNotification(1,this.autopartsSearch.length);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  vendors: Vendor[] = new Array();


  onChangeAutopartPurchaseStatus($event: any, autopart: AutoPart): void {

    autopart.purchaseStatus = $event.target.value;
    console.log(autopart.purchaseStatus);
    if (autopart.purchaseStatus == 0) {
      autopart.reason = "no status";
    } else if (autopart.purchaseStatus == 1) {
      autopart.reason = "ordered";
      autopart.orderedAt = new Date();
    } else if (autopart.purchaseStatus == 2) {
      autopart.receivedAt = new Date();
      autopart.reason = "received"
      // const element = document.getElementById('uploadButton');
      // if (element) {
      //   element.click();
      // }
    } else if (autopart.purchaseStatus == 3) {
      autopart.reason = "returned"
      autopart.returnedAt = new Date();
    } else if (autopart.purchaseStatus == 4) {
      autopart.reason = "wrong part"
      autopart.updatedAt = new Date();
    }

    console.log(autopart.reason);

    this.autopartService.update(autopart.id, autopart).subscribe({
      next: result => {
        console.log(result);
        if (result) {
          autopart = result;
          for (let i = 0; i < this.autopartsSearch.length; i++) {
            if (this.autopartsSearch[i].id == autopart.id) {
              this.autopartsSearch[i] = autopart;
            }
          }
        }
      }
    })
  }


  getCompanyStatus(companyId: any): void {

    this.statusService.getAllCompanyStatus(companyId).subscribe({
      next: result => {
        if (result) {
          this.statuss = result;
        }
      }
    })
  }

  currentIndex: any = -1;
  currentIndexJob: any = -1;




  getDetailsAutopart(autopart: AutoPart, index: any): void {
    this.currentIndex = index;
    this.selectedAutopart = autopart;
  }

  job: Job = new Job();

  getDetailsJob(job: Job, index: any): void {
    this.currentIndexJob = index;
    this.job = job;
    this.getJobScore(this.job);
    console.log(this.job);
  }

  onChangeEmployee2($event: any, employeeId: any, job: Job) {

    job.employeeId = employeeId;
    job.reason = "assign";


    for (let employee of this.employees) {
      if (employee.id == employeeId) {
        if (employee.commissionBased == false) {
          // job.price = +((this.getVehicleRemaining(this.selectedVehicle) * employee.rolePrecentage / 100).toFixed(0));
        } else {
          //commisson based
          //  job.price = +((this.getTotalSupplements(this.selectedVehicle) * employee.rolePrecentage / 100).toFixed(0));
        }
      }
    }

    console.log("onChangeEmployee2");
    this.jobService.createJob(this.currentUser.id, job).subscribe({
      next: result => {
        this.job = result;
        console.log(this.job);
        for (let job of this.jobs) {
          if (job.id == this.job.id)
            job = this.job;
        }
        //this.getVehicleJobs(this.vehicle.id);
        // this.getVehicleJobs2(this.vehicle.id);

        // if (this.currentEmplyeeId == employeeId) {
        //   this.getMyJobs(employeeId);
        // }

        // this.syncJob(this.job);
      }
    })

  }

  getVehicleCostManagement(vehicle: any): any {

    return +(this.getVehicleRemaining(vehicle) * 0.5).toFixed(0);
  }

  getVehicleRemaining(vehicle: any): any {
    var total = 0;
    var totalEstimate = this.getVehicleTotalEstimates(vehicle);
    var totalCostsParts = this.getTotalPartCosts(vehicle.id);
    return (totalEstimate - totalCostsParts);
  }

  getVehicleTotalCosts(vehicle: any, jobs: any): any {
    var total = 0;

    var totalCostsParts = this.getTotalPartCosts(vehicle.id);
    var totalCostJobs = this.getTotalJobPrice(jobs);
    var totalTax = this.getSaleTax(vehicle);
    var totalCostManagement = this.getVehicleCostManagement(vehicle);
    //var totalSalesCommission = this.getSalesCommission(vehicle);
    // return totalCostsParts + totalCostJobs + totalCostManagement + totalSalesCommission;
    return totalCostsParts + totalCostJobs + totalTax;

  }

  isJobChecked(job: Job): boolean {

    if (job.status != 0)
      return true;
    return false;
  }

  getTotalJobPrice(jobs: Job[]): any {

    var total = 0;
    for (let job of jobs) {
      total += job.price;
    }

    return total;

  }

  getSaleTax(vehicle: any): any {

    var total = 0;

    total = (vehicle.price + this.getTotalSupplements(vehicle)) * 0.06;
    total = +(total.toFixed(0));

    return total;

  }

  updateJobStatus(job: Job): void {
    console.log("updateJobStatus");
    this.jobService.updateJobStatus(job.id).subscribe({
      next: result => {

        this.job = result;
        var i = 0;
        for (let job1 of this.jobs) {
          if (job1.id == this.job.id) {
            this.jobs[i] = this.job;
          }
          i++;
        }
        this.jobCompletedCount = this.getJobStatus();
        this.getJobScore(this.job);

      }, error: (e) => console.log(e)
    })
  }
  currentEmplyeeId: any;

  getVehicleGross(vehicle: any, jobs: any): any {
    var total = 0;
    var totalEstimate = this.getVehicleTotalEstimates(vehicle);
    total = totalEstimate - this.getVehicleTotalCosts(vehicle, jobs);
    return total;
  }

  getVehicleTotalEstimates(vehicle: Vehicle): any {
    var total = 0;
    total = +vehicle.price + +(this.getTotalSupplements(vehicle));

    return total;

  }

  getSalesCommission(vehicle: any): any {


    var total = 0;
    if (this.getTotalSupplements(vehicle) > 0) {
      total = this.getTotalSupplements(vehicle) * 0.07;
    }

    return +total.toFixed(0);
  }
  getTotalPartCosts(vehicleId: any): any {

    var totalCosts = 0;

    for (let autopart of this.autopartsSearch) {
      if (autopart.vehicleId == vehicleId) {
        totalCosts += autopart.salePrice;
      }
    }
    return totalCosts;
  }

  getTotalSupplements(vehicle: any): any {
    var total = 0;

    if (vehicle.supplements.length > 0) {
      for (let supplement of vehicle.supplements) {
        total += supplement.price;
      }
    }
    total = +(total.toFixed(0));
    return total;
  }

  imageModels: ImageModel[] = new Array();
  imageUrl: any;

  onSelectFileNew(event: any): void {
    if (event.target.files && event.target.files[0]) {

      const file = event.target.files[0];


      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        alert('Only JPEG and JPG images are allowed');
        return;
      }

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

  createNewAutopart(): void {

    // if (this.imageModels.length == 0) {
    //   this.errorMessage = "Please choose image or images for the part";
    //   return;
    // }

    this.selectedAutopart.year = this.selectedVehicle.year;
    this.selectedAutopart.make = this.selectedVehicle.make;
    this.selectedAutopart.model = this.selectedVehicle.model;
    this.selectedAutopart.purchaseStatus = 0;

    if (this.selectedAutopart.year == null || this.selectedAutopart.year < 1000 ||

      this.selectedAutopart.make == null || this.selectedAutopart.make == "" ||
      this.selectedAutopart.model == null || this.selectedAutopart.model == ''

    ) {
      this.errorMessage = "Part Infor for year, make and model are required";
      return;
    }

    if (this.selectedAutopart.title == null || this.selectedAutopart.title == '') {
      this.errorMessage = "Parts Name is required";
      return;
    }

    if (this.selectedAutopart.description == null || this.selectedAutopart.description == '') {
      this.errorMessage = "Part Description is required";
      return;
    }


    if (this.selectedAutopart.shipping == null || this.selectedAutopart.shipping == '') {
      //this.errorMessage = "Part Shipping is required";
      //return;
      this.selectedAutopart.shipping = "FLP"
    }

    if (this.selectedAutopart.warranty == null || this.selectedAutopart.warranty == '') {
      // this.errorMessage = "Part Warranty is required";
      // return;
      this.selectedAutopart.warranty = "30D";
    }

    if (this.selectedAutopart.grade == null || this.selectedAutopart.grade == '') {
      this.errorMessage = "Part Grade is required";
      return;
    }

    if (this.selectedAutopart.salePrice != null && this.selectedAutopart.salePrice == 0) {
      this.errorMessage = "Part Price is required";
      return;
    }



    if (this.selectedAutopart.title != null && this.selectedAutopart.title != '' && this.selectedAutopart.title.length > 255) {
      this.errorMessage = "Parts Name is too long";
      return;
    }

    if (this.selectedAutopart.description != null && this.selectedAutopart.description != '' && this.selectedAutopart.description.length > 2000) {
      this.errorMessage = "Part Description is too long";
      return;
    }


    if (this.selectedAutopart.description != null && this.selectedAutopart.description != '' && this.selectedAutopart.description.length < 2) {
      this.errorMessage = "Part Description is too short";
      return;
    }


    if (this.selectedAutopart.partNumber != null && this.selectedAutopart.partNumber != '' && this.selectedAutopart.partNumber.length > 50) {
      this.errorMessage = "Parts Number is too long";
      return;
    }


    //if (this.imageModels.length > 0) {
    this.selectedAutopart.companyId = this.selectedVehicle.companyId;
    this.selectedAutopart.status = 0;
    this.selectedAutopart.purchaseStatus = 0;
    // this.selectedAutopart.sequenceNumber = -1;
    this.selectedAutopart.published = false;
    this.selectedAutopart.reason = "posting";
    this.selectedAutopart.vehicleId = this.selectedVehicle.id;

    this.autopartService.create(this.selectedAutopart).subscribe({
      next: (res) => {
        console.log(res);
        this.selectedAutopart = res;

        if (this.imageModels.length > 0) {
          for (let i = 0; i < this.imageModels.length; i++) {

            this.imageModels[i] = this.uploadAutopartImageWithFile(this.selectedAutopart.id, this.imageModels[i]);
          }

          setTimeout(() => {
            this.getAutopartForVehicle(this.selectedVehicle.id, true);

          }, 2000);
        } else {
          this.autopartsSearch.unshift(this.selectedAutopart);
        }

        this.errorMessage = "Created Successfully";




      },
      error: (e) => console.error(e)
    });

  }

  getAutopartFromUuid(autopartId: any): any {
    this.autopartService.getByUuid(autopartId).subscribe({

      next: result => {
        console.log(result);
        return result;
      }
    })

  }


  displayStyleNewParts: any = "None";

  addNewParts(): void {
    this.selectedAutopart = new AutoPart();
    this.selectedAutopart.id = 0;
    this.selectedAutopart.salePrice = undefined;
    this.selectedAutopart.title = undefined;
    this.imageModels = new Array();
    this.imageUrl = null;
    this.selectedAutopart.stocknumber = this.randomString();

    // this.detailSelected = true;
    this.message1 = "";
    this.errorMessage = "";
    this.displayStyleNewParts = "block";
  }

  randomString(): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZABCDEFGHIJKLMNOPQRSTUVWXTZ';
    const stringLength = 7;
    let randomstring = '';
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      if (i == 3)
        randomstring += "-";
      else
        randomstring += chars.substring(rnum, rnum + 1);
    }

    return randomstring;
  }


  deleteCurerntImage(): void {

    for (let i = 0; i < this.imageModels.length; i++) {
      if (this.imageModels[i].showInSearch == true) {
        this.imageModels.splice(i, 1);
      }
    }

    if (this.imageModels != null && this.imageModels.length > 0) {
      this.imageModels[0].showInSearch = true
      this.imageUrl = this.imageModels[0].picByte;
    }

    if (this.imageModels != null && this.imageModels.length == 0) {
      this.imageModels = new Array();
      this.imageUrl = null;
    }
  }

  private uploadAutopartImageWithFile(autopartId: any, imageModel: ImageModel): any {


    console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', autopartId) //other param


    this.autopartService.uploadImageWithFileWithUserId(formData, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        imageModel = result;

        return imageModel;
      }
    });


  }

  onSelectFileEditorAutoparts(event: any): void {


    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;

      const file = event.target.files[0];


      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        alert('Only JPEG and JPG images are allowed');
        return;
      }

      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;

          this.uploadImageWithFileAutoparts(this.selectedAutopart.id, imageModel);

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

  private uploadImageWithFileAutoparts(autopartId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFileAutoparts");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('autopartId', autopartId) //other param


    this.autopartService.uploadImageWithFileWithUserId(formData, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart.imageModels.unshift(result);
      }
    });


  }

  uploadImageAutoparts(autopartId: any, imageModel: ImageModel) {

    this.autopartService.uploadImage(imageModel, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedAutopart.imageModels.unshift(result);
        // this.selectedAutopart.showInSearchImageId = result.id;
        // if (this.selectedAutopart.imageModels.length == 1) {
        //   this.selectedAutopart.showInSearchImageId = result.id;
        // }
      }
    });
  }

  setImageForSearchAutoparts(autopartId: any, imageId: any) {


    console.log("setImageForSearch");

    this.autopartService.setImageForSearch(imageId, autopartId).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.selectedAutopart.imageModels.length; i++) {
          if (this.selectedAutopart.imageModels[i].id == imageId) {
            this.selectedAutopart.showInSearchImageId = this.selectedAutopart.imageModels[i].id;
            //this.selectedImage = this.selectedAutopart.showInSearchImageId;
          }
        }
      }
    });
  }

  deleteImageAutopart(autopartId: any, imageId: any) {


    console.log("deleteImage");

    this.autopartService.deleteImageWihtUserId(imageId, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.selectedAutopart.imageModels.length; i++) {
          if (this.selectedAutopart.imageModels[i].id == imageId) {
            this.selectedAutopart.imageModels.splice(i, 1);
          }
        }
      }
    });
  }

  autopartsSearch = new Array();
  selectedAutopart: AutoPart = new AutoPart();

  getAutopartForVehicle(vehicleId: any, resetSelectedPart: boolean) {
    if (resetSelectedPart == true) {
      this.autopartsSearch = new Array();
      this.selectedAutopart = new AutoPart();
      this.selectedAutopart.showInSearchImageId = 0;
      this.selectedImage = 0;
    }

    this.autopartService.getAutopartForVehicle(vehicleId).subscribe({
      next: result => {
        // console.log(result);
        this.autopartsSearch = result;
        this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.id - a.id);
        if (this.autopartsSearch.length > 0) {
          if (resetSelectedPart == true) {
            this.selectedAutopart = this.autopartsSearch[0];
            this.selectedImage = this.selectedAutopart.showInSearchImageId;
          }
        }

        this.setNotification(1, this.autopartsSearch.length);

        //this.calculate();
      }
    })

  }

  autopartReceivedCount: any = 0;

  getAutopartReceivedCounts(): any {
    var total = 0;
    for (let autopart of this.autopartsSearch) {
      if (autopart.purchaseStatus != undefined && autopart.purchaseStatus == 2) {
        total++;
      }
    }

    return total;
  }

  jobCompletedCount: any = 0;
  jobs: Job[] = new Array();
  vehicleJobsOnly: boolean = false;

  getVehicleJobs2(vehicleUuid: any): void {


    this.jobCompletedCount = 0;
    this.jobService.getAllVehicleJobs2Uuid(vehicleUuid).subscribe({
      next: result => {
        if (result) {
          this.jobs = result;
          //this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
          this.jobs = this.jobs.sort((a, b) => b.id - a.id);
          for (let job of this.jobs) {
            job.imageModels = job.imageModels.sort((a, b) => b.id - a.id);
            this.getJobScore(job);
          }
          this.setNotification(2, this.jobs.length);


          this.jobCompletedCount = this.getJobStatus();

          if (this.vehicleJobsOnly == true) {

          }

        } else {
          this.jobs = new Array();
          if (this.vehicleJobsOnly == true) {

          }
        }

      }


    })


  }

  getJobStatus(): any {
    var counts = 0;
    for (let job of this.jobs) {
      if (job.status == 1)
        counts++;
    }
    return counts;

  }

  onChangeAssignedTo($event: any, employeeId: any): void {

    console.log("onChangeAssignedTo");
    this.selectedVehicle.assignedTo = employeeId;
    this.selectedVehicle.reason = "assigned To";
    this.vehicleService.createAndUpdateVehicleExternal(this.selectedVehicle.userId, this.selectedVehicle).subscribe({
      next: result => {
        console.log("onChangeAssignedTo", result);
        this.selectedVehicle = result;
        this.selectedVehicle.reason = "";

      }
    })
  }

  supplement: any;

  onChangeApprovalStatus($event: any, supplement: Supplement): void {

    console.log("onChangeAssignedTo");
    this.supplement.assignedTo = $event.target.value;
    this.supplement.reason = "approval status";
    this.supplementService.createSupplement(this.selectedVehicle.userId, this.supplement).subscribe({
      next: result => {
        console.log("onChangeAssignedTo", result);
        this.supplement = result;
        this.supplement.reason = "";

      }
    })
  }


  onChangeUuid($event: any, status: string): void {

    console.log("onChangeStatus");
    this.uuid = $event.target.value;
    //this.url = location.origin + "/#/vehicle/" + this.uuid;
    this.getDetailByUuid(this.uuid);
  }

  onChangeStatus($event: any, status: string): void {

    console.log("onChangeStatus");
    this.selectedVehicle.status = status;
    this.selectedVehicle.reason = "status";
    this.vehicleService.createAndUpdateVehicleExternal(this.selectedVehicle.userId, this.selectedVehicle).subscribe({
      next: result => {
        console.log("onChangeStatus", result);
        this.selectedVehicle = result;
        this.selectedVehicle.reason = "";

      }
    })
  }

  setImage(index: any): void {

    this.selectedImage = this.selectedVehicle.imageModels[index].id;
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

  onSearchChange($event: any): void {
    // console.log($event.target.value);

    if (this.vehiclesOriginal.length > 0)
      this.vehiclesOriginal = this.vehiclesOriginal.filter(vehicle => vehicle.serachString.toLowerCase().includes($event.target.value));

  }


  message1: any = "";

  onSelectFileEditor(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      const file = event.target.files[0];


      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        alert('Only JPEG and JPG images are allowed');
        return;
      }
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (e: any) => {

          console.log(e.target.result);
          //this.urls.push(e.target.result);

          let imageModel: ImageModel = new ImageModel();

          this.message1 = '';

          imageModel.picByte = e.target.result;

          //this.uploadImage(this.selectedVehicle.id, imageModel);
          this.uploadImageWithFileUserId(this.selectedVehicle.id, imageModel);


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

  private uploadImageWithFile(vehicleId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('vehicleId', vehicleId) //other param
    formData.append('description', "vehicle") //other param
    // formData.append('path', 'temp/') //other param

    this.vehicleService.uploadImageWithFile(formData, vehicleId).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedVehicle.imageModels.unshift(result);
        for (let vehicle of this.vehicles) {
          if (vehicle.id == this.selectedVehicle.id) {
            vehicle.imageModels = this.selectedVehicle.imageModels;
          }
        }
      }
    });

  }

  private uploadImageWithFileUserId(vehicleId: any, imageModel: ImageModel) {


    console.log("uploadImageWithFile");

    const file = this.DataURIToBlob("" + imageModel.picByte);
    const formData = new FormData();
    formData.append('file', file, 'image.jpg')
    formData.append('vehicleId', vehicleId) //other param
    formData.append('description', "vehicle") //other param
    // formData.append('path', 'temp/') //other param

    this.vehicleService.uploadImageWithFileUserId(formData, vehicleId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        this.selectedVehicle.imageModels.unshift(result);
        for (let vehicle of this.vehicles) {
          if (vehicle.id == this.selectedVehicle.id) {
            vehicle.imageModels = this.selectedVehicle.imageModels;
          }
        }
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

  setImageForSearch(vehicleId: any, imageId: any) {


    console.log("setImageForSearch");

    this.vehicleService.setImageForSearch(imageId, vehicleId).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.selectedVehicle.imageModels.length; i++) {
          if (this.selectedVehicle.imageModels[i].id == imageId) {
            this.selectedVehicle.showInSearchImageId = this.selectedVehicle.imageModels[i].id;
            this.selectedImage = this.selectedVehicle.showInSearchImageId;
          }
        }
        //this.getDetailByUuid(this.uuid);
      }
    });
  }

  deleteImage(autopartId: any, imageId: any) {


    console.log("deleteImage");

    this.vehicleService.deleteImage(imageId, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.selectedVehicle.imageModels.length; i++) {
          if (this.selectedVehicle.imageModels[i].id == imageId) {
            this.selectedVehicle.imageModels.splice(i, 1);
          }
        }
        //this.getDetailByUuid(this.uuid);
      }
    });
  }

  deleteImage2(autopartId: any, imageId: any) {


    console.log("deleteImage");

    this.vehicleService.deleteImage(imageId, autopartId, this.user.id).subscribe({
      next: (result) => {
        console.log(result);
        for (let i = 0; i < this.selectedVehicle.imageModels.length; i++) {
          if (this.selectedVehicle.imageModels[i].id == imageId) {
            this.selectedVehicle.imageModels.splice(i, 1);
          }
        }

        this.selectedImage = 0;
        //this.getDetailByUuid(this.uuid);
      }
    });
  }

  private extractIndexAndText(line: string): { index: number, text: string } | null {
    const match = line.match(/^(\d+(?:\.\d+)?|\.\d+\s+\d+)\s+(.*)$/);

    if (match) {
      let indexStr = match[1];
      let text = match[2];

      if (indexStr.startsWith('.')) {
        const parts = indexStr.split(' ');
        indexStr = parts[1] + parts[0];
        text = text.replace(new RegExp(`^${parts[0]} `), '');
      }

      return { index: parseInt(indexStr, 10), text: text };
    } else {
      const simpleMatch = line.match(/^(\d+)\s+(.*)$/);
      if (simpleMatch) {
        console.log(" ========================= " + line)
        return { index: parseInt(simpleMatch[1], 10), text: simpleMatch[2] };
      }
      return null;
    }
  }


  private isAreaText(line: string): boolean {
    const otherRegex = /^(?:SUBTOTALS|CUSTOMER PAY|INSURANCE PAY|#|.*\d.*[a-z])/i;

    return (line === line.toUpperCase() && !otherRegex.test(line));
  }



  private isNoteText(line: string): boolean {
    return line.startsWith("Note:");
  }


  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const arrayBuffer = new Uint8Array((e.target as any).result);
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        this.pdfDocument = await loadingTask.promise;

        const jsonData = [];
        const startPage = this.startPage;
        const endPage = this.endPage;

        let lineIndex = 0;

        for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
          const page = await this.pdfDocument.getPage(pageNum);
          const textContent = await page.getTextContent();

          // Sort items by Y position
          const itemsSorted = textContent.items.sort(
            (a: any, b: any) => b.transform[5] - a.transform[5]
          );

          let currentLineY = -1;
          let currentLineText = '';

          for (const item of itemsSorted) {
            if ('str' in item && item.str.trim()) {
              if (currentLineY === -1 || Math.abs(item.transform[5] - currentLineY) > 1) {
                if (currentLineText) {
                  const isSkipped =
                    currentLineText === "Price $" ||
                    currentLineText.split(" ").length <= 2;

                  const extracted = this.extractIndexAndText(currentLineText);

                  let index = extracted ? extracted.index : ++lineIndex;
                  const line = extracted ? extracted.text : currentLineText.trim();

                  const parseLine: ParsedLine = this.getPartNumber(index, line);
                  if (!line.startsWith("Preliminary") && !line.startsWith("Customer")) {
                    jsonData.push({ index, line, isSkipped, parsedLine: parseLine });
                  }
                }
                currentLineText = item.str;
                currentLineY = item.transform[5];
              } else {
                currentLineText += ' ' + item.str;
              }
            }
          }

          // Add the last line if there's any text
          if (currentLineText) {
            const isSkipped =
              currentLineText === "Price $" || currentLineText.split(" ").length <= 2;
            jsonData.push({ index: lineIndex++, line: currentLineText.trim(), isSkipped });
          }
        }

        this.jsonData = jsonData;
        console.log('Extracted Lines:', this.jsonData);

        const jsonDataGrouped = [];
        let currentArea: any = null;

        for (const line of jsonData) {
          const text = line.line.trim();

          if (line.isSkipped) {
            continue;
          }

          if (this.isAreaText(text)) {
            if (currentArea) {
              jsonDataGrouped.push(currentArea);
            }

            currentArea = {
              area: text,
              index: line.index,
              data: [],
            };
          } else if (currentArea) {
            if (this.isNoteText(text)) {
              const lastItem = currentArea.data[currentArea.data.length - 1];
              if (lastItem) {
                lastItem.notes = lastItem.notes || [];
                lastItem.notes.push({ index: lastItem.index, line: text });
              }
            } else {
              currentArea.data.push({ ...line, notes: [] });
            }
          }
        }

        if (currentArea) {
          jsonDataGrouped.push(currentArea);
        }

        this.jsonDataGrouped = jsonDataGrouped;
        console.log('Grouped Data with Notes and Reset Indices:', this.jsonDataGrouped);

        const fileUrl = URL.createObjectURL(file);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
      };

      fileReader.readAsArrayBuffer(file);
    }
  }

  private extractPartNumber(line: string): string | null {
    const regex = /\b[A-Z0-9]{10}\b/g; // Match 10-character alphanumeric strings
    const match = regex.exec(line);

    if (match) {
      const partNumber = match[0];

      const digits = partNumber.replace(/[^0-9]/g, '').length;
      const letters = partNumber.length - digits;
      if (digits > letters) {
        return partNumber;
      }
    }
    return null;
  }

  skipLines: any = "Preliminary Customer Job";
  showEmployees: boolean = false;

  findJobOrderTypeIconClass(code: any): any {
    // return this.jobOrderTypes.some
    for (let jobOrderType of this.jobOrderTypes) {
      if (jobOrderType.code == code) {
        return jobOrderType.iconClass;
      }
    }
    return "";
  }

  findJobOrderTypeColor(code: any): any {
    // return this.jobOrderTypes.some
    for (let jobOrderType of this.jobOrderTypes) {
      if (jobOrderType.code == code) {
        return jobOrderType.color;
      }
    }
    return "";
  }

  getPartNumber(index: any, line: string): ParsedLine {
    var parts = line.split(' ');
    let wildCard = ' '; // Initialize wildCard as an empty string
    let oper = ' '; // Initialize oper as an empty string
    let print: number = 0;
    let extendedPrice: number = 0;
    let labor: number = 0;
    let paint: number = 0;
    let qty: number = 0;
    let description = '';
    let partNumber: any = "";
    let isParts: boolean = false;
    let indexNew: number = 0;

    indexNew = index;

    if (parts.length > 0) {

      var foundPrint = false;
      var foundLabor = false;
      var foundExtendedPrice = false;
      var foundQty = false;
      var fountPartNumber = false;

      if (parseInt(parts[0]) > 0) {
        console.log("000000000000000000 " + line);
        indexNew = parseInt(parts[0]);
        parts = parts.splice(1, parts.length);
        console.log(parts);
      }

      if (!isNaN(parseFloat(parts[parts.length - 1])) &&
        !isNaN(parseFloat(parts[parts.length - 2])) &&
        !isNaN(parseFloat(parts[parts.length - 3]))) {
        labor = parseFloat(parts[parts.length - 1]);
        extendedPrice = parseFloat(parts[parts.length - 2]);
        qty = parseFloat(parts[parts.length - 3]);
        foundPrint = true;
        foundLabor = true;
        foundQty = true;
        foundExtendedPrice = true;
        console.log(qty);
        console.log(extendedPrice);
        console.log(labor);

        parts.splice(parts.length - 3, 3);
        console.log(parts);
      } else if (!isNaN(parseFloat(parts[parts.length - 1])) && isNaN(parseFloat(parts[parts.length - 2]))) {
        labor = parseFloat(parts[parts.length - 1]);
        foundLabor = true;
        console.log("--------------- " + labor);
        parts = parts.splice(0, parts.length - 1);
        console.log(parts);
      } else if (!isNaN(parseFloat(parts[parts.length - 1])) && !isNaN(parseFloat(parts[parts.length - 2]))) {
        paint = parseFloat(parts[parts.length - 1]);
        labor = parseFloat(parts[parts.length - 2]);
        foundPrint = true;

        console.log(paint);
        console.log(labor);
        parts.slice(parts.length - 2, 2);
        console.log(parts);
      } else {
        //just a labor guess
        if (!isNaN(parseFloat(parts[parts.length - 1])) && foundLabor == false) {
          labor = parseFloat(parts[parts.length - 1]);
          console.log(labor);
          foundLabor = true;
          parts.splice(parts.length - 1, 1);
          console.log(parts);
        }
      }

      var foundWildCard = false;
      var foundOper = false;

      for (let i = 0; i < parts.length; i++) {
        if (!parts[i].startsWith("Notes:")) {
          console.log(parts);


          if (this.wildCardTypes.some(wc => wc.code === parts[i] && foundWildCard == false)) {
            wildCard = parts[i];
            parts.splice(i, 1);
            console.log(wildCard);
            foundWildCard = true;
            console.log(parts);
          }

          if (this.jobOrderTypes.some(jo => jo.code === parts[i]) && foundOper == false) {
            oper = parts[i];
            parts.splice(i, 1);
            console.log(oper);
            foundOper = true;
            console.log(parts);
          }

          // guess partNumber and second conditon shall be the last two
          if (parts[i] != null && parts[i].length > 9 &&
            fountPartNumber == false &&
            (i > parts.length - 2 && this.extractPartNumber(line) != null)) {
            partNumber = parts[i];
            fountPartNumber = true;
            isParts = true;
            console.log(fountPartNumber);
            parts.splice(i, 1);
            console.log(wildCard);
          }

          //just a labor guess // 	# E.P.C. 1 3.00
          if (!isNaN(parseFloat(parts[i])) && !isNaN(parseFloat(parts[i - 1])) && foundQty == false && foundLabor == false) {
            labor = parseFloat(parts[i]);
            console.log("=========:" + labor);
            qty = parseFloat(parts[i - 1]);
            paint = 0; //hardcode this
            console.log("=========:" + qty);
            foundLabor = true;
            foundQty = true
            parts.splice(i - 1, 2);
            console.log(parts);
          }

        }
      }


    }


    description = parts.join(' ');

    console.log(parts);

    const isSkipped = false;
    const isValid = true;
    const notes: never[] = [];

    return {
      index: indexNew,
      wildCard,
      oper,
      line,
      description,
      isParts,
      partNumber,
      qty,
      labor,
      extendedPrice: extendedPrice,
      paint,
      isSkipped,
      isValid,
      notes,
    };
  }

}
