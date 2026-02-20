import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

// Models
import { Company } from '../models/company.model';
import { Config } from '../models/config.model';
import { ImageModel } from '../models/imageModel.model';
import { JobRequestType } from '../models/job.request.type.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { Setting } from '../models/setting.model';
import { Status } from '../models/status.model';
import { User } from '../models/user.model';
import { Vehicle } from '../models/vehicle.model';

// Services from Inshop4
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as jsonData from '../../assets/car-list.json';
import { AuthService } from '../_services/auth.service';
import { AutopartService } from '../_services/autopart.service';
import { ClaimService } from '../_services/claim.service';
import { CompanyService } from '../_services/company.service';
import { ConfirmationService } from '../_services/confirmation.service';
import { CustomerService } from '../_services/custmer.service';
import { DocTypeService } from '../_services/doc.type.service';
import { EmployeeService } from '../_services/employee.service';
import { JobRequestTypeService } from '../_services/job.request.type.service';
import { JobService } from '../_services/job.service';
import { NestedConfirmationService } from '../_services/nested-confirmation.service';
import { PaymentService } from '../_services/payment.service';
import { PurchaseOrderVehicleService } from '../_services/purchase.order.vehicle.service';
import { ReceiptService } from '../_services/receipt.service';
import { ScrollService } from '../_services/scroll.service';
import { SettingService } from '../_services/setting.service';
import { StatusService } from '../_services/status.service';
import { StorageService } from '../_services/storage.service';
import { SepplementService } from '../_services/supplement.service';
import { UserService } from '../_services/user.service';
import { VehicleHistoryService } from '../_services/vehicle.history.service';
import { VehicleService } from '../_services/vehicle.service';
import { EventBusService } from '../_shared/event-bus.service';
import { AutoPart } from '../models/autopart.model';
import { Brand } from '../models/brand.model';
import { Claim } from '../models/claim.model';
import { DocType } from '../models/doc.type.model';
import { Employee } from '../models/employee.model';
import { EstimateResponse } from '../models/estimate.response.model';
import { GroupBy } from '../models/groupBy.model';
import { Job } from '../models/job.model';
import { Payment } from '../models/payment.model';
import { PurchaseOrderVehicle } from '../models/purchase.order.vehicle.model';
import { Supplement } from '../models/supplement.model';
import { ModalStackManager } from '../services/modal-stack-manager.service';
import { ReportService } from '../services/report.service';

@Component({
    selector: 'app-vehicle-detail-editor',
    templateUrl: './vehicle-detail-editor.component.html',
    styleUrls: ['./vehicle-detail-editor.component.css']
})
export class VehicleDetailEditorComponent implements OnInit, OnDestroy, OnChanges {
    private destroy$ = new Subject<void>();

    optionsYear: string[] = new Array();
    optionsMake: string[] = new Array();
    optionsModel: string[] = new Array();
    optionsColor: string[] = new Array();

    statusOverview: GroupBy[] = new Array();
    jobRequestTypeOverview: GroupBy[] = new Array();
    assignedToOverview: GroupBy[] = new Array();
    changeOverview: GroupBy[] = new Array();
    locationOverview: GroupBy[] = new Array();

    carList: any = jsonData;
    carListStringList: Brand[];

    autopart?: AutoPart;
    showSearchVin: boolean = false;

    @Input() vehicle!: Vehicle
    // @Input() readOnly: boolean = false
    // @Input() companyId!: number
    // @Input() initialTab?: 'details' | 'estimates' | 'purchaseOrders' | 'parts' | 'jobs' | 'payments' | 'receipts' | 'history'
    @Output() closed = new EventEmitter<void>()
    @Output() updated = new EventEmitter<{ vehicleId: number | string }>()
    @Output() archived = new EventEmitter<{ vehicleId: number | string }>()
    @Output() unarchived = new EventEmitter<{ vehicleId: number | string }>()

    // Report Engine Properties
    currentReport: any = {
        id: 'payment-tracking',
        name: 'Payment Tracking',
        description: 'Track payment status, receipts, and outstanding amounts for all vehicles'
    };

    availableReports: any[] = [
        {
            id: 'current-shop-summary',
            name: 'Current Shop Vehicles Summary',
            description: 'Overview of all current shop vehicles with key business information',
            includeCollections: [] // No additional collections for basic report
        },
        {
            id: 'payment-tracking',
            name: 'Current Shop Vehicles Summary With Payment Tracking',
            description: 'Detailed payment tracking and status for all vehicles',
            includeCollections: ['payments', 'receipts', 'supplements'] // Payment tracking collections
        }
    ];

    // Payment tracking metrics
    paymentMetrics: any = null;
    paymentStatusSummary: any = null;

    // Filter properties
    currentStatusFilter: string = '';
    currentSearchTerm: string = '';

    // Simplified Payment Tracking Filter Properties
    showPaymentFilters: boolean = false;
    paymentTrackingFilters = {
        status: '',                        // Vehicle status filter
        dataSource: 'current',             // Data source: 'current' or 'archived'
        rangePreset: '30',                 // Archived range preset: '7'|'30'|'90'|'180'|'custom'
        paymentStatus: '',                 // Filter by payment status (paid/unpaid)
        dateRange: {                       // Date range filtering
            start: null as Date | null,
            end: null as Date | null
        },
        amountRange: {                     // Payment amount filtering
            min: null as number | null,
            max: null as number | null
        },
        insuranceCompany: '',              // Filter by insurance company
        showOnlyDelivered: false,          // Quick filter for delivered vehicles
        showOverdue: false,                // Quick filter for overdue payments
        additionalInfo: ['payments', 'receipts', 'supplements'], // Additional info collections (multi-select)
        pdfIncludes: ['payments', 'receipts', 'supplements']     // PDF includes collections (multi-select)
    };

    // Week calendar properties for archived data
    selectedWeek: Date = new Date();
    showWeekCalendar: boolean = false;

    toggleClass(): void {
        const mainContent = document.querySelector('.main-content');
        const mainContent2 = document.querySelector('.reminders-box');

        if (mainContent) {
            mainContent.classList.toggle('my-fluid-col');
        }
        if (mainContent2) {
            //if (this.notes.length == 0)
            mainContent2.classList.toggle('reminders-toggle');
        }
    }

    logout(): void {

        console.log(" logging out ");
        this.authService.logout().subscribe({

            next: res => {
                console.log(res);
                this.storageService.clean();
                //this.isLoggedIn = this.storageService.isLoggedIn();
                // this.isLoggedIn = false;
                //this.isLoggedIn= false;
                window.location.reload();
            },
            error: err => {
                console.log(err);
            }
        });
    }

    // Handler for range preset changes when archived is selected
    onRangePresetChange(): void {
        const preset = this.paymentTrackingFilters.rangePreset;
        // Always show week calendar in archived mode (used as starting week)
        this.showWeekCalendar = (this.paymentTrackingFilters.dataSource === 'archived');

        if (this.currentReport.id === 'payment-tracking' && this.paymentTrackingFilters.dataSource === 'archived') {
            // Reload only if we already have a starting week
            if (this.selectedWeek) {
                console.log('Range preset changed to', preset, 'with starting week set; reloading');
                this.loadPaymentTrackingReport();
            } else {
                console.log('Range preset changed but no starting week yet - waiting');
            }
        }
    }

    // Available collections for Additional Info and PDF includes
    availableCollections = [
        { value: 'payments', label: 'Payments' },
        { value: 'receipts', label: 'Receipts' },
        { value: 'supplements', label: 'Supplements' },
    ];

    // Report Data Properties (based on Inshop4 patterns)
    user: User = new User();
    currentUser: any;
    company: Company = new Company();
    config: Config = new Config();
    setting: Setting = new Setting();
    companyDefaultTaxRate: number = 0; // Added missing property

    // Job Request Types and Statuses (copied from Inshop4Component)
    jobRequestTypes: JobRequestType[] = new Array();
    statuss: Status[] = new Array();

    // Additional settings properties (matching Inshop4Component)
    employeeRoles: any[] = new Array();
    paymentMethods: any[] = new Array();
    approvalStatuss: any[] = new Array();
    paymentStatuss: any[] = new Array();
    services: any[] = new Array();
    locations: any[] = new Array();
    keyLocations: any[] = new Array();
    insurancers: any[] = new Array();
    inTakeWays: any[] = new Array();
    paymentTypes: any[] = new Array();
    rentals: any[] = new Array();
    disclaimers: any[] = new Array();
    warranties: any[] = new Array();
    columnInfos: any[] = new Array();
    itemTypes: any[] = new Array();
    docTypes: any[] = new Array();
    vendors: any[] = new Array();

    // Image base URL properties (copied from Inshop4Component)
    baseUrlResizeImage = this.config.baseUrl + '/vehicle/getResize';
    baseUrlResizeImageParts = this.config.baseUrl + '/getResize';
    baseUrlResizeImageJobs = this.config.baseUrl + '/jobimages/getResize';
    baseUrlResizeImagePayments = this.config.baseUrl + '/paymentimages/getResize';
    baseUrlResizeImagePaymentGetImages = this.config.baseUrl + '/paymentimages/getImage';
    baseUrlImage = this.config.baseUrl + '/vehicle/getImage';
    baseUrlImageParts = this.config.baseUrl + '/getImage';

    baseUrlPdf = this.config.baseUrl + '/pdf/getPdf';
    baseUrlQR = this.config.baseUrlQR;

    // Vehicle data arrays
    vehicles: Vehicle[] = new Array();
    vehiclesOriginal: Vehicle[] = new Array();

    // Tab-related data arrays (matching Inshop4Component)
    claims: any[] = new Array();
    purchaseOrders: any[] = new Array();
    autopartsSearch: any[] = new Array();
    jobs: any[] = new Array();
    payments: any[] = new Array();
    receipts: any[] = new Array();
    receipt: any = {};
    jobCompletedCount: number = 0;

    // Pagination and search
    pageSize: number = 300;
    searchInput: string = '';
    searchType: any = 5;
    currantPageNumber: any = 0;
    pagesArray: number[] = new Array();

    // UI States
    isLoading: boolean = false;
    isLoadingVehicles: boolean = false;  // Separate loading state for vehicle data only
    errorMessage: string = '';

    // Report specific properties
    reportTitle: string = 'Current Shop Vehicles Summary';
    showReport: boolean = false;

    // Missing properties for template binding
    disclaimerId: any = null;
    warrantyId: any = null;
    users: any[] = new Array();
    showEstimatesOnly: boolean = false;
    currentClaimId: any = null;
    isMobile: boolean = false;
    currentPaymentPaymentId: any = null;
    vehicleHistories: any[] = new Array();
    disclaimerText: string = '';
    warrantyText: string = '';
    cindexPurchaseOrder: number = -1;
    currentReceiptId: any = null;
    currentIndex: any;
    showVehicleListing: boolean = true;
    totalJobCounts: number = 0;
    employeeJobCarrier: any[] = new Array();
    cindex: number = -1;
    cindexAutpartPurchaseOrder: number = -1;
    shallAllJobInfo: boolean = false;

    // Modal properties
    displayStyle2: string = 'visible';
    displayStyle3: string = '1';
    job: any = {};


    url: any = "";
    counterQrcode: any = 0;

    // Sorting counter
    counter: number = 0;

    // Job properties
    currentJobId: any = null;
    vehicleJobsOnly: boolean = false;
    message1: string = '';
    message: string = '';
    selectedPurchaseOrder: any = {};
    errorMessagePurchaseOrder: string = '';
    messagePurchaseOrder: string = '';
    serviceJobs: any[] = new Array();

    // Missing properties for autopart functionality
    selectedAutopart: AutoPart = new AutoPart();
    imageModels: ImageModel[] = new Array();
    imageUrl: any = null;
    selectedImage: any = null;
    selectedImage4: any = null;
    imageModelSelected: ImageModel = new ImageModel();
    payment: Payment = new Payment();
    purchaseOrder: any = {};
    detailSelected: boolean = false;
    claim: any = {};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private storageService: StorageService,
        private vehicleService: VehicleService,
        private companyService: CompanyService,
        private jobService: JobService,
        private customerService: CustomerService,
        private paymentService: PaymentService,
        private eventBusService: EventBusService,
        private jobRequestTypeService: JobRequestTypeService,
        private statusService: StatusService,
        private settingService: SettingService,
        private purchseOrderVehicleService: PurchaseOrderVehicleService,
        private confirmationService: ConfirmationService,
        private nestedConfirmationService: NestedConfirmationService,
        private autopartService: AutopartService,
        private claimService: ClaimService,
        private receiptService: ReceiptService,
        private supplementService: SepplementService,
        private vehicleHistoryService: VehicleHistoryService,
        private employeeService: EmployeeService,
        private scrollService: ScrollService,
        private modalStackManager: ModalStackManager,
        private sanitizationService: DomSanitizer,
        private http: HttpClient,
        private docTypeService: DocTypeService,
        private reportService: ReportService,
        private authService: AuthService,

    ) {
        for (let i = 1950; i <= 2026; i++) {
            this.optionsYear.push("" + i);
        }

        this.optionsMake = this.config.optionsMake;

        this.optionsColor = [
            "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burgandy", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "pearl", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"
        ];

        this.optionsModel = [
            "not selected"
        ];

        this.carListStringList = [];

    }


    pdfUrl: string | null = null;
    urlSafe: SafeResourceUrl | undefined;
    pdfSrc: SafeResourceUrl | null = null;
    currentToken: any = '';

    counterPdf: any = 0;

    getPdf(token: any): void {

        this.currentToken = token;
        this.pdfUrl = this.baseUrlPdf + "/" + token;
        this.http.get(this.pdfUrl, { responseType: 'arraybuffer' }).subscribe((data: ArrayBuffer) => {
            const base64String = btoa(new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            this.pdfSrc = this.sanitizationService.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + base64String)
        });

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

    statuss2: Status[] = new Array();

    isInStatus(statusId: any): boolean {
        for (let status of this.statuss2) {
            if (status.id == statusId)
                return true;
        }
        return false;
    }
    imageModelDrop: ImageModel = new ImageModel();
    indexImageModelDrop: any = 0;

    onChangeDocTypeDropped($event: any): void {

        var docTypeId = $event.target.value;

        this.imageModelSelected.reason = "docType";

        this.vehicleService.setImageDocTypeWithUserId(docTypeId, this.imageModelSelected.id, this.vehicle.id, this.user.id).subscribe({
            next: result => {
                this.imageModelSelected.reason = "";
                console.log("onChangeDocType Done");
                //sync up
                for (let i = 0; i < this.vehicle.imageModels.length; i++) {
                    for (let docType of this.docTypes) {
                        if (this.vehicle.imageModels[i].id == this.imageModelSelected.id) {
                            this.vehicle.imageModels[i].docType = docTypeId;
                            this.vehicle.imageModels[i].docTypeName = docType.name;
                            this.imageModelDrop = this.vehicle.imageModels[i];

                        }
                    }
                }

                for (let docType of this.docTypes) {
                    docType.imageModels = new Array();
                }

                for (let imageModel of this.vehicle.imageModels) {

                    if (this.isInDocType(imageModel.docType)) {

                        for (let docType of this.docTypes) {
                            if (imageModel.docType == docType.id) {
                                imageModel.docTypeName = docType.name;
                                docType.imageModels.push(imageModel);
                            }
                        }
                    } else {
                        this.docTypes[0].imageModels.push(imageModel);
                    }

                }

                for (let docType of this.docTypes) {
                    //docType.imageModels = docType.imageModels.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                    docType.imageModels = docType.imageModels.sort((a: any, b: any) => a.id - b.id);
                }

            }
        })
    }

    getLocationOverviews(): void {

        this.getLocationOverview(this.user.companyId);
    }



    getLocationOverview(companyId: any): void {
        console.log("getLocationOverview");
        this.vehicleService.getLocationOverview(companyId).subscribe({
            next: result => {
                console.log(result);
                this.locationOverview = result;
                this.locationOverview = this.locationOverview.sort((a: any, b: any) => b.count - a.count);
            }, error: (e) => console.log(e)
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
                this.statusOverview = this.statusOverview.sort((a: any, b: any) => b.count - a.count);
                //this.getStatusOverviewTotals();
                // for(let status of this.statuss){
                //   for( let groupBy of this.statusOverview){
                //     if( status.id == groupBy.status){
                //       groupBy.sequenceNumber = status.sequenceNumber;
                //     }
                //   }
                // }
                // this.statusOverview = this.statusOverview.sort((a, b) => b.sequenceNumber - a.sequenceNumber);

            }, error: (e) => console.log(e)
        })
    }


    onChangeStatus($event: any, status: any): void {

        console.log("onChangeStatus");
        this.vehicle.status = status;
        this.vehicle.reason = "status";
        this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
            next: result => {
                console.log("onChangeStatus", result);
                this.vehicle = result;
                this.vehicle.reason = "";
                //this.getStatusOverview(this.user.companyId);
            }
        })

    }

    onChangeStatusOverview($event: any, status: any): void {

        var statusStr: any = "";
        for (let option of this.statuss) {
            if (option.id == status) {
                statusStr = option.name;
            }
        }

        console.log(status);
        const customTitle = 'Change Vehicle Status';
        const message = 'Are you sure to change vehicle status to [' + statusStr + '] ?';
        const buttonType = "yesNo" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type


        // Call the service to show the confirmation dialog and pass the callback
        this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
            if (confirmed == undefined) {

                this.searchVehicle(7, 0, this.pageSize);

                // for (let vehicle of this.vehiclesOriginal) {
                //   if (vehicle.id == this.vehicle.id) {
                //     console.log(vehicle.status);
                //     for (let i = 0; i < this.vehicles.length; i++) {
                //       if (this.vehicles[i].id == vehicle.id) {
                //         this.vehicles[i] = vehicle;
                //       }
                //     }
                //     //this.vehicle.status = vehicle.status;
                //   }
                // }
                return;
            } else if (confirmed) {

                console.log("onChangeStatus");
                this.vehicle.status = status;
                this.vehicle.reason = "status";
                this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
                    next: result => {
                        console.log("onChangeStatus", result);
                        this.vehicle = result;
                        this.vehicle.reason = "";
                        this.getStatusOverview(this.user.companyId);
                    }
                })

            } else {

                this.searchVehicle(7, 0, this.pageSize);
                // for (let vehicle of this.vehiclesOriginal) {
                //   if (vehicle.id == this.vehicle.id) {
                //     console.log(vehicle.status);
                //     for (let i = 0; i < this.vehicles.length; i++) {
                //       if (this.vehicles[i].id == vehicle.id) {
                //         this.vehicles[i] = vehicle;
                //       }
                //     }
                //     //this.vehicle.status = vehicle.status;
                //   }
                // }
            }
        });


    }

    onChangeAssignedTo($event: any, employeeId: any): void {

        console.log("onChangeAssignedTo");
        this.vehicle.assignedTo = employeeId;
        this.vehicle.reason = "assigned To";
        this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
            next: result => {
                console.log("onChangeAssignedTo", result);
                this.vehicle = result;
                this.vehicle.reason = "";

            }
        })
    }

    onChangeAssignedToOverView($event: any, employeeId: any): void {


        var employeeInfoStr: any = "";
        for (let option of this.employees) {
            if (option.id == employeeId) {
                employeeInfoStr = option.firstName + "  " + option.lastName;
            }
        }


        const customTitle = 'Assigned Vehicle To ';
        const message = 'Are you sure to assign vehicle to [' + employeeInfoStr + '] ?';
        const buttonType = "yesNo" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type


        // Call the service to show the confirmation dialog and pass the callback
        this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
            if (confirmed == undefined) {

                this.searchVehicle(7, 0, this.pageSize);

                return;
            } else if (confirmed) {

                console.log("onChangeAssignedTo");
                this.vehicle.assignedTo = employeeId;
                this.vehicle.reason = "assigned To";
                this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
                    next: result => {
                        console.log("onChangeAssignedTo", result);
                        this.vehicle = result;
                        this.vehicle.reason = "";

                    }
                })

            } else {
                this.searchVehicle(7, 0, this.pageSize);
            }
        });



    }

    onChangeServiceManager($event: any, employeeId: any): void {


        var employeeInfoStr: any = "";
        for (let option of this.employees) {
            if (option.id == employeeId) {
                employeeInfoStr = option.firstName + "  " + option.lastName;
            }
        }


        const customTitle = 'Assigned Vehicle To A Service Manager ';
        const message = 'Are you sure to assign Service Manager to [' + employeeInfoStr + '] ?';
        const buttonType = "yesNo" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type


        // Call the service to show the confirmation dialog and pass the callback
        this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
            if (confirmed == undefined) {

                this.searchVehicle(7, 0, this.pageSize);

                return;
            } else if (confirmed) {

                console.log("onChangeServiceManager");
                this.vehicle.serviceManager = employeeId;
                this.vehicle.reason = "service manager";
                this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
                    next: result => {
                        console.log("onChangeServiceManager", result);
                        this.vehicle = result;
                        this.vehicle.reason = "";

                    }
                })

            } else {
                this.searchVehicle(7, 0, this.pageSize);
            }
        });




    }

    displayStyleTargetReason = "none";

    onChangeVehicleCalendar($event: any, vehicle: Vehicle): void {



        vehicle.targetDate = $event.target.value;
        this.displayStyleTargetReason = "block";
        this.displayStyle2 = "hidden";
        this.displayStyle3 = "0";
        // if (vehicle.id > 0) {

        //   vehicle.reason = "targetDate";
        //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
        //     next: result => {
        //       if (result) {
        //         this.vehicle = result;
        //         vehicle = this.vehicle;
        //         vehicle.reason = "";
        //       }
        //     }
        //   })
        // }
    }





    onChangeVehicleCalendarRental($event: any, vehicle: Vehicle): void {
        vehicle.rentalDate = $event.target.value;
        if (vehicle.id > 0) {

            vehicle.reason = "rentalDate";
            this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
                next: result => {
                    if (result) {
                        this.vehicle = result;
                        vehicle = this.vehicle;
                        vehicle.reason = "";
                    }
                }
            })
        }
    }

    onChangeJobRequestType($event: any, jobRequestType: any): void {

        console.log("onChangeJobRequestType");
        this.vehicle.jobRequestType = jobRequestType;
        this.vehicle.reason = "job request type";
        this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
            next: result => {
                console.log("onChangeJobRequestType", result);
                this.vehicle = result;
                this.vehicle.reason = "";
                //this.getStatusOverview(this.user.companyId);
            }
        })
    }

    onChangeJobRequestTypeOverview($event: any, jobRequestType: any): void {



        var jobRequestTypeStr: any = "";
        for (let option of this.jobRequestTypes) {
            if (option.id == jobRequestType) {
                jobRequestTypeStr = option.name;
            }
        }


        const customTitle = 'Change Vehicle Job Request Type';
        const message = 'Are you sure to change Job Request Type to [' + jobRequestTypeStr + '] ?';
        const buttonType = "yesNoCancel" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type


        // Call the service to show the confirmation dialog and pass the callback
        this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
            if (confirmed == undefined) {

                this.searchVehicle(7, 0, this.pageSize);

                return;
            } else if (confirmed) {

                console.log("onChangeJobRequestType");
                this.vehicle.jobRequestType = jobRequestType;
                this.vehicle.reason = "job request type";
                this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
                    next: result => {
                        console.log("onChangeJobRequestType", result);
                        this.vehicle = result;
                        this.vehicle.reason = "";
                        //this.getStatusOverview(this.user.companyId);
                    }
                })

            } else {
                this.searchVehicle(7, 0, this.pageSize);
            }
        });


    }


    onChangeApprovalStatus($event: any, approvalStatus: any): void {

        console.log("onChangeJobRequestType");
        this.vehicle.approvalStatus = approvalStatus;
        this.vehicle.reason = "approval status";
        this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
            next: result => {
                console.log("onChangeJobRequestType", result);
                this.vehicle = result;
                this.vehicle.reason = "";
                //this.getStatusOverview(this.user.companyId);
            }
        })
    }

    onChangeInTakeWay($event: any, inTakeWay: any): void {

        console.log("onChangeInTakeWay");
        this.vehicle.inTakeWay = inTakeWay;
        this.vehicle.reason = "inTake Way";
        this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
            next: result => {
                console.log("onChangeInTakeWay", result);
                this.vehicle = result;
                this.vehicle.reason = "";
                //this.getStatusOverview(this.user.companyId);
            }
        })
    }

    onChangeKeyLocation($event: any, keyLocation: any): void {

        console.log("onChangeKeyLocation");
        this.vehicle.keyLocation = keyLocation;
        this.vehicle.reason = "key location";
        this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
            next: result => {
                console.log("onChangeKeyLocation", result);
                this.vehicle = result;
                this.vehicle.reason = "";
                //this.getStatusOverview(this.user.companyId);
            }
        })
    }


    onChangeJobJobRequestType($event: any, jobRequestType: any, job: Job): void {

        console.log("onChangeJobJobRequestType");
        job.jobRequestType = jobRequestType;
        job.reason = "job request type";
        this.jobService.createJob(this.currentUser.id, job).subscribe({
            next: result => {
                console.log("onChangeJobJobRequestType", result);
                this.job = result;
                this.job.reason = "";

            }
        })
    }

    onChangePaymentMethodId($event: any, paymentMethodId: any, payment: Payment): void {

        console.log("onChangePaymentMethodId");
        payment.paymentMethodId = paymentMethodId;
        payment.reason = "Payment Method";
        this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
            next: result => {
                console.log("onChangePaymentMethodId", result);
                this.payment = result;
                this.payment.reason = "";

            }
        })
    }




    getPriorDamageWordCount(): number {

        if (this.vehicle.priorDamage) {

            var words = this.vehicle.priorDamage.split(/\s+/);
            if (words)
                return words.length;
        }

        return 0;
    }



    onSavePriorDamage(vehicle: Vehicle): void {
        vehicle.reason = "Prior Damage";
        if (vehicle.id > 0) {

            vehicle.reason = "targetDate";
            this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
                next: result => {
                    if (result) {
                        this.vehicle = result;
                        vehicle = this.vehicle;
                        vehicle.reason = "";
                    }
                }
            })
        }
    }


    droppedDocType3(event: CdkDragDrop<any>, docType: any, docTypeId: any) {

        console.log("droppedDocType3:" + docTypeId);

        if (this.imageModelDrop.docType != docTypeId) {

            console.log(event.previousContainer.data);
            console.log("Diff-current  Index:" + event.currentIndex);
            console.log("Diff-previous Index:" + event.previousIndex);

            // transferArrayItem(
            //   event.previousContainer.data,
            //   event.container.data,
            //   event.previousIndex,
            //   event.currentIndex
            // );
        } else {

            console.log(event.container.data);
            console.log("Same-current  Index:" + event.currentIndex);
            console.log("Same-previous Index:" + event.previousIndex);

            // moveItemInArray(
            //   docType.imageModels,
            //   event.previousIndex,
            //   event.currentIndex
            // );

            // moveItemInArray(
            //   docType.imageModels,
            //   event.previousIndex,
            //   event.currentIndex
            // );

        }

        var sequenceCarriers: SequenceCarrier[] = new Array();
        for (let i = 0; i < docType.imageModels.length; i++) {
            let sequenceCarrier = new SequenceCarrier();
            sequenceCarrier.id = docType.imageModels[i].id;
            sequenceCarrier.index = i;
            sequenceCarrier.pageNumber = this.currantPageNumber;
            sequenceCarrier.pageSize = this.pageSize;

            sequenceCarriers.push(sequenceCarrier);
        }

        console.log(sequenceCarriers);
        // var sequenceCarriers: SequenceCarrier[] = new Array();
        // for (let i = 0; i < this.columnInfos.length; i++) {
        //   let sequenceCarrier = new SequenceCarrier();
        //   sequenceCarrier.id = this.columnInfos[i].id;
        //   sequenceCarrier.index = i;
        //   sequenceCarrier.pageNumber = this.currantPageNumber;
        //   sequenceCarrier.pageSize = this.pageSize;

        //   sequenceCarriers.push(sequenceCarrier);
        // }

        // this.columnInfoService.updateSeqenceWithId(this.user.companyId, sequenceCarriers).subscribe({
        //   next: result => {

        //     if (result) {
        //       this.columnInfos = result;
        //       this.columnInfos = this.columnInfos.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
        //     }
        //   }
        // })

        if (this.imageModelDrop.docType != docTypeId) {
            var foundIt = false;
            for (let vehicle of this.vehiclesOriginal) {
                if (vehicle.id == this.vehicle.id) {
                    foundIt = true;
                    for (let i = 0; i < this.vehicle.imageModels.length; i++) {
                        if (this.imageModelDrop.id == this.vehicle.imageModels[i].id) {
                            this.vehicle.imageModels[i].docType = docTypeId;
                        }
                    }

                }
            }


            for (let docType of this.docTypes) {
                docType.imageModels = new Array();
            }


            for (let imageModel of this.vehicle.imageModels) {

                if (this.isInDocType(imageModel.docType)) {

                    for (let docType of this.docTypes) {
                        if (imageModel.docType == docType.id) {
                            imageModel.docTypeName = docType.name;
                            docType.imageModels.push(imageModel);
                        }
                    }
                } else {
                    this.docTypes[0].imageModels.push(imageModel);
                }

            }

            for (let docType of this.docTypes) {
                //docType.imageModels = docType.imageModels.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                docType.imageModels = docType.imageModels.sort((a: any, b: any) => a.id - b.id);
            }

            // for (let docType of this.docTypes) {
            //   docType.imageModels = new Array();
            //   for (let imageModel of this.vehicle.imageModels) {
            //     if (this.isInDocType(imageModel.docType)) {
            //       if (imageModel.docType == docType.id) {
            //         docType.imageModels.push(imageModel);
            //       }
            //     } else {
            //       docType.imageModels.push(imageModel);
            //     }
            //   }
            //   docType.imageModels = docType.imageModels.sort((a, b) => b.id - a.id);
            // }

            this.imageModelDrop.reason = "docType";
            this.vehicleService.setImageDocTypeWithUserId(docTypeId, this.imageModelDrop.id, this.vehicle.id, this.user.id).subscribe({
                next: result => {
                    this.imageModelDrop.reason = "";
                    console.log("droppedDocType3 Done");
                }
            })


        }


    }

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

                    //this.uploadImage(this.vehicle.id, imageModel);
                    this.uploadImageWithFile(this.vehicle.id, imageModel);


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

    onChangeSupplementDate($event: any, vehicle: any, supplement: any): void {

        const date: Date = new Date($event.target.value);
        //supplement.createdAt = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        supplement.updatedAt = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

        this.supplementService.createSupplement(vehicle.id, supplement).subscribe({
            next: result => {
                if (result != null) {
                    console.log(result);
                    for (let i = 0; i < this.vehicle.supplements.length; i++) {
                        if (this.vehicle.supplements[i].id == supplement.id) {
                            this.vehicle.supplements[i] = result;
                        }
                    }
                }
            }
        })
    }





    private uploadImageWithFile(vehicleId: any, imageModel: ImageModel) {


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
                this.vehicle.imageModels.push(result);

                this.docTypes[0].imageModels.push(result);

                for (let vehicle of this.vehicles) {
                    if (vehicle.id == this.vehicle.id) {
                        vehicle.imageModels = this.vehicle.imageModels;
                    }
                }
                if (this.vehicle.imageModels.length == 1) {
                    this.vehicle.showInSearchImageId = result.id;
                }
            }
        });

    }


    onChangeDocType($event: any): void {

        var docTypeId = $event.target.value;

        this.imageModelSelected.reason = "docType";

        this.vehicleService.setImageDocTypeWithUserId(docTypeId, this.imageModelSelected.id, this.vehicle.id, this.user.id).subscribe({
            next: result => {
                this.imageModelSelected.reason = "";
                console.log("onChangeDocType Done");
                //sync up
                for (let i = 0; i < this.vehicle.imageModels.length; i++) {
                    for (let docType of this.docTypes) {
                        if (this.vehicle.imageModels[i].id == this.imageModelSelected.id) {
                            this.vehicle.imageModels[i].docType = docTypeId;
                            this.vehicle.imageModels[i].docTypeName = docType.name;
                            this.imageModelSelected = this.vehicle.imageModels[i];

                        }
                    }
                }

                for (let docType of this.docTypes) {
                    docType.imageModels = new Array();
                }

                for (let imageModel of this.vehicle.imageModels) {

                    if (this.isInDocType(imageModel.docType)) {

                        for (let docType of this.docTypes) {
                            if (imageModel.docType == docType.id) {
                                imageModel.docTypeName = docType.name;
                                docType.imageModels.push(imageModel);
                            }
                        }
                    } else {
                        this.docTypes[0].imageModels.push(imageModel);
                    }

                }

                for (let docType of this.docTypes) {
                    //docType.imageModels = docType.imageModels.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                    docType.imageModels = docType.imageModels.sort((a: any, b: any) => a.id - b.id);
                }

            }
        })
    }




    getDetailImageModel(imageModel: ImageModel, index: any): void {

        console.log("image id: " + imageModel.id + " index:" + index);

        this.indexImageModelDrop = index;
        this.imageModelDrop = imageModel;
        this.selectedImage = this.imageModelDrop.id;
        this.imageModelSelected = imageModel;

        this.selectedImage2 = this.imageModelSelected.id;

    }

    getDocTypeColor(docTypeId: any): any {

        for (let docType of this.docTypes) {
            if (docType.id == docTypeId) {
                return docType.color;
            }
        }
    }

    droppedStatus3_bak(event: CdkDragDrop<any>, status: any) {

        // console.log("event.previousIndex:" + event.previousIndex);
        // console.log("event.currentIndex:" + event.currentIndex);
        // console.log("droppedStatus3 Status before:" + this.vehicle.status);
        // console.log("droppedStatus3 Status after :" + status);




        //console.log(statusId)

        if (event.previousContainer === event.container) {
            // console.log("====event.container.data: " + event.container.data);
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        } else {

            var foundIt = false;

            for (let vehicle of this.vehiclesOriginal) {
                if (vehicle.id == this.vehicle.id) {
                    foundIt = true;
                    this.vehicle.status = status;
                    vehicle.status = status;
                }
            }
            // for (let status of this.statuss) {
            //   status.vehicles = new Array();
            //   for (let vehicle of this.vehicles) {
            //     if (vehicle.status == status.id) {
            //       status.vehicles.push(vehicle);
            //     }
            //   }
            // }
            // console.log("--------------------droppedStatus3 Status before:" + this.vehicle.status);
            //  console.log("droppedStatus3 Status after :" + status);
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            //this.vehicle.status = statusId;
            console.log("Different container !!!")

            if (foundIt == true) {

                this.vehicle.reason = "status";
                this.vehicleService.createAndUpdateVehicle(this.user.id, this.vehicle).subscribe({
                    next: result => {
                        this.vehicle = result;
                        this.vehicle.reason = "";
                        //sync current list
                        for (let vehicle of this.vehicles) {
                            if (vehicle.id == this.vehicle.id) {
                                //foundIt = true;
                                //this.vehicle.status = status;
                                vehicle.status = status;
                            }
                        }

                    }
                })
            }

        }

        //console.log(this.vehicle.status)

        // moveItemInArray(
        //   this.statuss,
        //   event.previousIndex,
        //   event.currentIndex
        // );


        // if (this.vehicleJobsOnly == true) {
        //   this.fillCalendarVehicleJob();
        // }
    }

    droppedStatus(event: CdkDragDrop<string[]>) {

        console.log("droppedStatus" + event);

        moveItemInArray(
            this.statuss2,
            event.previousIndex,
            event.currentIndex
        );

        var sequenceCarriers: SequenceCarrier[] = new Array();
        for (let i = 0; i < this.statuss2.length; i++) {
            let sequenceCarrier = new SequenceCarrier();
            sequenceCarrier.id = this.statuss2[i].id;
            sequenceCarrier.index = i;
            sequenceCarriers.push(sequenceCarrier);
        }

        this.statusService.updateSeqenceWithId(this.user.companyId, sequenceCarriers).subscribe({
            next: result => {

                if (result) {
                    this.statuss2 = result;
                    var statusNoStatus = new Status();
                    statusNoStatus.name = "No Status";
                    statusNoStatus.id = 0;
                    statusNoStatus.sequenceNumber = -1;
                    this.statuss2.push(statusNoStatus);

                    this.statuss2 = this.statuss2.sort((a: any, b: any) => a.sequenceNumber - b.sequenceNumber);



                    for (let status of this.statuss2) {
                        status.vehicles = new Array();
                        for (let vehicle of this.vehiclesOriginal) {

                            if (this.isInStatus(vehicle.status)) {
                                if (vehicle.status == status.id) {
                                    status.vehicles.push(vehicle);
                                }
                            } else {
                                status.vehicles.push(vehicle);
                            }
                        }
                    }
                }
            }
        })


    }

    droppedDocType(event: CdkDragDrop<string[]>) {

        console.log("droppedDocType" + event);

        moveItemInArray(
            this.docTypes,
            event.previousIndex,
            event.currentIndex
        );

        var sequenceCarriers: SequenceCarrier[] = new Array();
        for (let i = 0; i < this.docTypes.length; i++) {
            let sequenceCarrier = new SequenceCarrier();
            sequenceCarrier.id = this.docTypes[i].id;
            sequenceCarrier.index = i;
            sequenceCarriers.push(sequenceCarrier);
        }

        this.docTypeService.updateSeqenceWithId(this.user.companyId, sequenceCarriers).subscribe({
            next: result => {

                if (result) {
                    this.docTypes = result;
                    var docTYpeNoType = new DocType();
                    docTYpeNoType.name = "Not Sorted";
                    docTYpeNoType.id = 0;
                    docTYpeNoType.sequenceNumber = -1;
                    this.docTypes.push(docTYpeNoType);

                    this.docTypes = this.docTypes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);



                    for (let docType of this.docTypes) {
                        docType.imageModels = new Array();
                    }


                    for (let imageModel of this.vehicle.imageModels) {

                        if (this.isInDocType(imageModel.docType)) {

                            for (let docType of this.docTypes) {
                                if (imageModel.docType == docType.id) {
                                    imageModel.docTypeName = docType.name;
                                    docType.imageModels.push(imageModel);
                                }
                            }
                        } else {
                            this.docTypes[0].imageModels.push(imageModel);
                        }

                    }

                    for (let docType of this.docTypes) {
                        //docType.imageModels = docType.imageModels.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                        docType.imageModels = docType.imageModels.sort((a: any, b: any) => a.id - b.id);
                    }

                }
            }
        })


    }

    isInDocType(docTypeId: any): boolean {
        for (let docType of this.docTypes) {
            if (docType.id == docTypeId)
                return true;
        }
        return false;
    }


    displayStyle = "none";

    closePopupYes(): void {
        this.displayStyle = "none";
        this.displayStyle2 = "visible";
        this.displayStyle3 = "1";


        console.log("archiveVehicle");
        this.vehicle.archived = true;
        this.vehicle.reason = "archive";
        this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
            next: result => {
                console.log("archiveVehicle", result);
                this.vehicle = result;
                this.vehicle.reason = "";
                this.searchVehicle(5, 0, this.pageSize);
            }
        })
    }


    selectedImage2: any;
    counterImage2: any = 0;



    deleteImage(vehicleId: any, imageId: any) {


        console.log("deleteImage");

        this.vehicleService.deleteImage(imageId, vehicleId, this.user.id).subscribe({
            next: (result) => {
                console.log(result);
                this.vehicleService.get(vehicleId).subscribe({
                    next: (result => {
                        console.log(result);
                        this.vehicle = result;
                        this.selectedImage = this.vehicle.showInSearchImageId;

                        for (let i = 0; i < this.vehicles.length; i++) {
                            if (this.vehicles[i].id == this.vehicle.id) {
                                this.vehicles[i] = this.vehicle;
                            }
                        }

                        for (let docType of this.docTypes) {
                            if (docType.imageModels.length > 0) {
                                for (let i = 0; i < docType.imageModels.length; i++) {
                                    if (docType.imageModels[i].id == imageId) {
                                        docType.imageModels.splice(i, 1);
                                    }
                                }
                            }
                        }
                    })
                });
            }
        });
    }

    deleteImage2(vehicleId: any, imageId: any) {


        console.log("deleteImage2");

        this.vehicleService.deleteImage(imageId, vehicleId, this.user.id).subscribe({
            next: (result) => {
                console.log(result);
                this.vehicleService.get(vehicleId).subscribe({
                    next: (result => {
                        console.log(result);
                        this.vehicle = result;

                        for (let i = 0; i < this.vehicles.length; i++) {
                            if (this.vehicles[i].id == this.vehicle.id) {
                                this.vehicles[i] = this.vehicle;
                            }
                        }

                        this.selectedImage2 = this.vehicle.showInSearchImageId;

                        for (let docType of this.docTypes) {
                            if (docType.imageModels.length > 0) {
                                for (let i = 0; i < docType.imageModels.length; i++) {
                                    if (docType.imageModels[i].id == imageId) {
                                        docType.imageModels.splice(i, 1);
                                    }
                                }
                            }
                        }

                        // if (this.vehicle.imageModels.length == 0) {
                        //   this.vehicle.showInSearchImageId = 0;
                        // }
                    })

                });
            }
        });
    }
    getPdf2(pdf: any, token: any): void {

        if (pdf.toggle == true) {

            this.currentToken = token;
            this.pdfUrl = this.baseUrlPdf + "/" + token;
            this.http.get(this.pdfUrl, { responseType: 'arraybuffer' }).subscribe((data: ArrayBuffer) => {
                const base64String = btoa(new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), ''));

                // Set the base64 string as the PDF source
                //this.pdfSrc = 'data:application/pdf;base64,' + base64String;
                this.pdfSrc = this.sanitizationService.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + base64String)
            });
        } else {
            this.pdfSrc = null;
        }

    }

    deletePdf(token: any) {

        this.vehicleService.deletePdf(token, this.vehicle.id, this.user.id).subscribe({
            next: result => {
                for (let i = 0; i < this.vehicle.pdfFiles.length; i++) {
                    if (this.vehicle.pdfFiles[i].token == token) {
                        this.vehicle.pdfFiles.splice(i, 1);
                    }
                }

                if (this.vehicle.pdfFiles.length > 0) {
                    this.getPdf(this.vehicle.pdfFiles[0].token);
                } else {

                    this.pdfSrc = null;
                }

            }
        })
    }

    onSelectFileEditorPdf(event: any): void {
        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;

            for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = (e: any) => {

                    console.log(e.target.result);

                    const file = this.DataURIToBlob("" + e.target.result);

                    const formData = new FormData();
                    formData.append('file', file, event.target.files[i].name)
                    formData.append('vehicleId', this.vehicle.id) //other param
                    formData.append('description', "pdf") //other param
                    // formData.append('path', 'temp/') //other param

                    this.vehicleService.uploadPdfWithFile(formData, this.vehicle.id, this.user.id).subscribe({
                        next: (result) => {
                            console.log(result);
                            this.vehicle.pdfFiles.push(result);
                            for (let vehicle of this.vehicles) {
                                if (vehicle.id == this.vehicle.id) {
                                    vehicle.pdfFiles = this.vehicle.pdfFiles;
                                }
                            }

                            this.getPdf(result.token);
                        }
                    });

                }

                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }


    // Test method for nested confirmation dialogs
    testNestedConfirmations(): void {
        console.log('Testing nested confirmation dialogs');

        // First confirmation dialog
        const modalId1 = this.nestedConfirmationService.confirm(
            'This is the first confirmation dialog. Do you want to proceed to the second one?',
            'First Confirmation',
            'yesNo',
            (confirmed: boolean) => {
                console.log('First dialog result:', confirmed);

                if (confirmed) {
                    // Second nested confirmation dialog
                    const modalId2 = this.nestedConfirmationService.confirm(
                        'Great! This is the second nested dialog. Should we show a third one?',
                        'Second Confirmation',
                        'yesNoCancel',
                        (confirmed2: boolean) => {
                            console.log('Second dialog result:', confirmed2);

                            if (confirmed2 === true) {
                                // Third nested confirmation dialog
                                const modalId3 = this.nestedConfirmationService.confirm(
                                    'Final confirmation! This demonstrates nested modal stacking.',
                                    'Third Confirmation',
                                    'okCancel',
                                    (confirmed3: boolean) => {
                                        console.log('Third dialog result:', confirmed3);
                                        console.log('All nested confirmations completed!');
                                    }
                                );
                                console.log('Created third modal with ID:', modalId3);
                            }
                        }
                    );
                    console.log('Created second modal with ID:', modalId2);
                }
            }
        );
        console.log('Created first modal with ID:', modalId1);
        console.log('Open modal count:', this.nestedConfirmationService.getOpenModalCount());
    }

    private isInitialized = false;

    ngOnInit(): void {
        console.log('Report viewing component initialized in production mode');

        // Initialize modal stack event listeners
        this.modalStackManager.initializeModalEventListeners();

        // Copy authentication pattern from Inshop4
        this.currentUser = this.storageService.getUser();

        if (this.currentUser != null) {
            this.getUserById(this.currentUser.id);
            this.isInitialized = true;

            // Try to open modal if vehicle is already available
            this.tryOpenModal();
        } else {
            this.router.navigate(['/login']);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Handle vehicle input changes
        if (changes['vehicle']) {
            console.log('Vehicle input changed:', changes['vehicle'].currentValue);

            // Only try to open modal if component is fully initialized
            if (this.isInitialized) {
                this.tryOpenModal();
            }
        }
    }

    /**
     * Safely attempts to open the vehicle detail modal
     * Only opens if all required conditions are met
     */
    private tryOpenModal(): void {
        const canOpenModal = this.vehicle &&
            this.vehicle.id &&
            this.currentUser &&
            this.user &&
            this.isInitialized;

        if (canOpenModal) {
            console.log('Opening vehicle detail modal for vehicle ID:', this.vehicle.id);
            this.getDetail(this.vehicle, 0);
        } else {
            console.log('Cannot open modal yet. Missing requirements:', {
                hasVehicle: !!this.vehicle,
                hasVehicleId: !!(this.vehicle && this.vehicle.id),
                hasCurrentUser: !!this.currentUser,
                hasUser: !!this.user,
                isInitialized: this.isInitialized
            });
        }
    }



    // Report Engine Methods
    loadReport(reportId: string): void {
        const report = this.availableReports.find(r => r.id === reportId);
        if (report) {
            this.currentReport = report;
            console.log(`Loading report: ${report.name}`);

            // Load different report data based on report type
            if (reportId === 'current-shop-summary') {
                this.loadCurrentShopSummaryReport();
            } else if (reportId === 'payment-tracking') {
                this.loadPaymentTrackingReport();
            }
        }
    }

    private loadCurrentShopSummaryReport(): void {
        console.log('Loading current shop summary report via ReportService');
        this.isLoading = true;

        this.reportService.getCurrentShopVehiclesSummary(this.user.companyId || 0).subscribe({
            next: (vehicles) => {
                console.log('Current shop summary loaded:', vehicles.length, 'vehicles');
                this.vehiclesOriginal = vehicles;
                this.vehicles = this.vehiclesOriginal;

                // Process vehicles for display
                for (let vehicle of this.vehicles) {
                    if (vehicle.make.includes(' ')) {
                        vehicle.make = vehicle.make.replace(' ', '-');
                    }
                }

                // Reset filters when loading new report
                this.currentStatusFilter = '';
                this.currentSearchTerm = '';

                this.isLoading = false;
                this.showReport = true;
            },
            error: (err) => {
                console.error('Error loading current shop summary:', err);
                this.errorMessage = 'Error loading current shop summary';
                this.isLoading = false;
            }
        });
    }

    private loadPaymentTrackingReport(): void {
        console.log('Loading payment tracking report via new payment tracking endpoint');
        this.isLoadingVehicles = true;

        // Get collections from filter settings or use defaults
        const includeCollections = this.paymentTrackingFilters.additionalInfo.length > 0
            ? this.paymentTrackingFilters.additionalInfo
            : ['payments', 'receipts', 'supplements'];

        // Determine data source (current vs archived)
        const isArchived = this.paymentTrackingFilters.dataSource === 'archived';

        // Create search carrier based on data source
        const searchCarrier = {
            companyId: this.user.companyId || 0,
            archived: isArchived,
            type: 5, // All vehicles for company
            pageSize: 1000,
            pageNumber: 0,
            partNumber: ''
        };

        console.log('Using includeCollections:', includeCollections);
        console.log('Data source (archived):', isArchived);
        console.log('SearchCarrier:', searchCarrier);

        // Create DateCarrier for archived data if needed
        let dateCarrier = null;
        if (isArchived) {
            if (!this.selectedWeek) {
                console.warn('Archived selected but no starting week; skipping request');
                this.isLoadingVehicles = false;
                return;
            }

            if (this.paymentTrackingFilters.rangePreset && this.paymentTrackingFilters.rangePreset !== 'custom') {
                const days = parseInt(this.paymentTrackingFilters.rangePreset, 10);
                // Anchor at end of selected week (acts as "to"), go backwards by (days - 1)
                const weekEnd = this.getWeekEndDate(this.selectedWeek);
                const to = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate(), 23, 59, 59, 999);
                const fromDate = new Date(weekEnd);
                fromDate.setDate(weekEnd.getDate() - (days - 1));
                const from = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0, 0);

                // Ensure correct order just in case
                const fromMs = from.getTime();
                const toMs = to.getTime();
                const finalFrom = Math.min(fromMs, toMs);
                const finalTo = Math.max(fromMs, toMs);

                dateCarrier = {
                    from: finalFrom,
                    to: finalTo,
                    range: days
                };
                console.log('Using preset date range (backward to selected week):', new Date(finalFrom), '->', new Date(finalTo));
            } else if (this.showWeekCalendar && this.selectedWeek) {
                const weekStart = this.getWeekStartDate(this.selectedWeek);
                const weekEnd = this.getWeekEndDate(this.selectedWeek);

                // Validate that dates are valid
                if (isNaN(weekStart.getTime()) || isNaN(weekEnd.getTime())) {
                    console.error('Invalid week dates, skipping archived data request');
                    this.isLoadingVehicles = false;
                    return;
                }

                dateCarrier = {
                    from: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate(), 0, 0, 0, 0).getTime(),
                    to: new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate(), 23, 59, 59, 999).getTime(),
                    range: 7
                };
                console.log('Using custom week range for archived data:', new Date(dateCarrier.from), '->', new Date(dateCarrier.to));
            }
        }

        // Use the new payment tracking endpoint
        this.reportService.getVehiclesWithNestedDataPaymentTracking(
            this.user.companyId || 0,
            includeCollections,
            this.paymentTrackingFilters.status || undefined,
            undefined, // paymentStatus - handled client-side
            searchCarrier,
            dateCarrier
        ).subscribe({
            next: (vehicles) => {
                console.log('Payment tracking report loaded:', vehicles.length, 'vehicles');
                console.log('Sample vehicle with nested data:', vehicles[0]);

                this.vehiclesOriginal = vehicles;
                this.vehicles = this.vehiclesOriginal;

                // Process vehicles for display
                for (let vehicle of this.vehicles) {
                    if (vehicle.make.includes(' ')) {
                        vehicle.make = vehicle.make.replace(' ', '-');
                    }
                }

                // Apply client-side filtering based on current filter settings
                this.applyClientSidePaymentFilters();

                // Calculate enhanced payment metrics
                this.paymentMetrics = this.reportService.calculatePaymentMetrics(this.vehicles);
                this.paymentStatusSummary = this.reportService.getPaymentStatusSummary(this.vehicles);

                console.log('Payment Metrics:', this.paymentMetrics);
                console.log('Payment Status Summary:', this.paymentStatusSummary);

                // Reset basic filters when loading new report
                this.currentStatusFilter = '';
                this.currentSearchTerm = '';

                this.isLoadingVehicles = false;
                this.showReport = true;
            },
            error: (err) => {
                console.error('Error loading payment tracking report:', err);
                this.errorMessage = 'Error loading payment tracking report';
                this.isLoadingVehicles = false;
            }
        });
    }

    getPaidVehiclesCount(): number {
        if (this.paymentStatusSummary) {
            return this.paymentStatusSummary.complete;
        }
        return 0;
    }

    getUnpaidVehiclesCount(): number {
        if (this.paymentStatusSummary) {
            return this.paymentStatusSummary.outstanding + this.paymentStatusSummary.noPayments;
        }
        return 0;
    }

    getTotalEstimate(): number {
        const metrics = this.reportService.calculateReportMetrics(this.vehicles);
        return metrics.totalEstimate;
    }

    // Payment tracking methods (for report metrics)
    getReportTotalPayments(): number {
        return this.paymentMetrics ? this.paymentMetrics.totalPayments : 0;
    }

    getReportTotalReceipts(): number {
        return this.paymentMetrics ? this.paymentMetrics.totalReceipts : 0;
    }

    getReportTotalPaymentAmount(): number {
        return this.paymentMetrics ? this.paymentMetrics.totalPaymentAmount : 0;
    }

    getReportOutstandingAmount(): number {
        return this.paymentMetrics ? this.paymentMetrics.outstandingAmount : 0;
    }

    getReportPaymentCompletionRate(): number {
        return this.paymentMetrics ? this.paymentMetrics.paymentCompletionRate : 0;
    }

    getVehiclesWithOutstandingPayments(): Vehicle[] {
        return this.reportService.getVehiclesWithOutstandingPayments(this.vehicles);
    }

    getVehiclesWithCompletePayments(): Vehicle[] {
        return this.reportService.getVehiclesWithCompletePayments(this.vehicles);
    }

    getVehiclesWithoutPayments(): Vehicle[] {
        return this.reportService.getVehiclesWithoutPayments(this.vehicles);
    }

    // Dynamic table column methods
    getCurrentReportIncludeCollections(): string[] {
        const report = this.availableReports.find(r => r.id === this.currentReport.id);
        return report ? report.includeCollections : [];
    }

    shouldShowPaymentsColumn(): boolean {
        return this.getCurrentReportIncludeCollections().includes('payments');
    }

    shouldShowReceiptsColumn(): boolean {
        return this.getCurrentReportIncludeCollections().includes('receipts');
    }

    shouldShowSupplementsColumn(): boolean {
        return this.getCurrentReportIncludeCollections().includes('supplements');
    }

    getVehiclePaymentsCount(vehicle: Vehicle): number {
        return vehicle.payments ? vehicle.payments.length : 0;
    }

    getVehicleReceiptsCount(vehicle: Vehicle): number {
        return vehicle.receipts ? vehicle.receipts.length : 0;
    }

    getVehicleSupplementsCount(vehicle: Vehicle): number {
        return vehicle.supplements ? vehicle.supplements.length : 0;
    }

    getVehicleTotalPayments(vehicle: Vehicle): number {
        if (!vehicle.payments || vehicle.payments.length === 0) return 0;
        return vehicle.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    }

    getVehicleTotalReceipts(vehicle: Vehicle): number {
        if (!vehicle.receipts || vehicle.receipts.length === 0) return 0;
        return vehicle.receipts.reduce((sum, receipt) => sum + (receipt.amount || 0), 0);
    }

    getVehicleTotalSupplements(vehicle: Vehicle): number {
        if (!vehicle.supplements || vehicle.supplements.length === 0) return 0;
        return vehicle.supplements.reduce((sum, supplement) => sum + (supplement.price || 0), 0);
    }

    // Helper methods for clean UI display (hide empty data)
    shouldShowVehiclePayments(vehicle: Vehicle): boolean {
        return this.shouldShowPaymentsColumn() &&
            (this.getVehiclePaymentsCount(vehicle) > 0 || this.getVehicleTotalPayments(vehicle) > 0);
    }

    shouldShowVehicleReceipts(vehicle: Vehicle): boolean {
        return this.shouldShowReceiptsColumn() &&
            (this.getVehicleReceiptsCount(vehicle) > 0 || this.getVehicleTotalReceipts(vehicle) > 0);
    }

    shouldShowVehicleSupplements(vehicle: Vehicle): boolean {
        return this.shouldShowSupplementsColumn() &&
            (this.getVehicleSupplementsCount(vehicle) > 0 || this.getVehicleTotalSupplements(vehicle) > 0);
    }

    // Result column methods for payment status with amount
    getVehiclePaymentResult(vehicle: Vehicle): any {
        const totalPrice = (vehicle.price || 0) + this.getVehicleTotalSupplements(vehicle);
        const totalPayments = this.getVehicleTotalPayments(vehicle);
        const totalReceipts = this.getVehicleTotalReceipts(vehicle);
        const totalCollected = totalPayments + totalReceipts;
        const outstanding = totalPrice - totalCollected;

        if (outstanding <= 0) {
            return {
                status: 'paid',
                amount: 0,
                text: 'Paid ($0.00)',
                class: 'success',
                icon: 'fas fa-check-circle'
            };
        } else if (totalCollected > 0) {
            return {
                status: 'partial',
                amount: outstanding,
                text: `Partial (${outstanding.toFixed(2)})`,
                class: 'warning',
                icon: 'fas fa-exclamation-triangle'
            };
        } else {
            return {
                status: 'unpaid',
                amount: totalPrice,
                text: `Unpaid (${totalPrice.toFixed(2)})`,
                class: 'danger',
                icon: 'fas fa-times-circle'
            };
        }
    }

    shouldShowResultColumn(): boolean {
        return this.currentReport.id === 'payment-tracking';
    }

    // Status filter functionality
    onStatusFilterChange(event: any): void {
        this.currentStatusFilter = event.target.value;
        console.log('Status filter changed to:', this.currentStatusFilter);
        this.applyFilters();
    }

    // Apply both search and status filters
    private applyFilters(): void {
        let filteredVehicles = this.vehiclesOriginal;

        // Apply status filter
        if (this.currentStatusFilter !== '') {
            filteredVehicles = filteredVehicles.filter(vehicle => vehicle.status.toString() === this.currentStatusFilter);
        }

        // Apply search filter
        if (this.currentSearchTerm !== '') {
            filteredVehicles = filteredVehicles.filter(vehicle =>
                vehicle.year.toString().includes(this.currentSearchTerm) ||
                vehicle.make.toLowerCase().includes(this.currentSearchTerm) ||
                vehicle.model.toLowerCase().includes(this.currentSearchTerm) ||
                vehicle.color.toLowerCase().includes(this.currentSearchTerm) ||
                this.getCustomerName(vehicle).toLowerCase().includes(this.currentSearchTerm)
            );
        }

        this.vehicles = filteredVehicles;
        console.log('Filtered vehicles count:', this.vehicles.length);
    }

    // Enhanced Payment Tracking Filter Methods
    togglePaymentFilters(): void {
        this.showPaymentFilters = !this.showPaymentFilters;
        if (!this.showPaymentFilters) {
            this.clearPaymentFilters();
        }
    }

    applyPaymentFilters(): void {
        // For payment tracking reports, use client-side filtering
        if (this.currentReport.id === 'payment-tracking') {
            this.applyClientSidePaymentFilters();
        } else {
            // For other reports, use the original filtering logic
            let filteredVehicles = this.vehiclesOriginal;

            // Apply status filter
            if (this.paymentTrackingFilters.status) {
                filteredVehicles = filteredVehicles.filter(vehicle =>
                    vehicle.status.toString() === this.paymentTrackingFilters.status
                );
            }

            this.vehicles = filteredVehicles;
            this.updatePaymentMetrics();
            console.log('Payment tracking filters applied. Filtered vehicles count:', this.vehicles.length);
        }
    }

    applyClientSidePaymentFilters(): void {
        let filteredVehicles = this.vehiclesOriginal;

        // Apply status filter
        if (this.paymentTrackingFilters.status) {
            filteredVehicles = filteredVehicles.filter(vehicle =>
                vehicle.status.toString() === this.paymentTrackingFilters.status
            );
        }

        // Apply payment status filter (client-side)
        if (this.paymentTrackingFilters.paymentStatus) {
            filteredVehicles = filteredVehicles.filter(vehicle => {
                if (this.paymentTrackingFilters.paymentStatus === 'paid') {
                    return vehicle.paid === true;
                } else if (this.paymentTrackingFilters.paymentStatus === 'unpaid') {
                    return vehicle.paid === false;
                }
                return true;
            });
        }

        // Apply quick filters
        if (this.paymentTrackingFilters.showOnlyDelivered) {
            filteredVehicles = filteredVehicles.filter(vehicle => vehicle.status === 11); // Delivered
        }

        if (this.paymentTrackingFilters.showOverdue) {
            filteredVehicles = filteredVehicles.filter(vehicle =>
                this.isPaymentOverdue(vehicle)
            );
        }

        // Apply insurance company filter
        if (this.paymentTrackingFilters.insuranceCompany) {
            filteredVehicles = filteredVehicles.filter(vehicle =>
                vehicle.insuranceCompany &&
                vehicle.insuranceCompany.toLowerCase().includes(this.paymentTrackingFilters.insuranceCompany.toLowerCase())
            );
        }

        // Apply date range filter
        if (this.paymentTrackingFilters.dateRange.start || this.paymentTrackingFilters.dateRange.end) {
            filteredVehicles = filteredVehicles.filter(vehicle => {
                const vehicleDate = new Date(vehicle.createdAt);
                const startDate = this.paymentTrackingFilters.dateRange.start;
                const endDate = this.paymentTrackingFilters.dateRange.end;

                if (startDate && vehicleDate < startDate) return false;
                if (endDate && vehicleDate > endDate) return false;
                return true;
            });
        }

        // Apply amount range filter
        if (this.paymentTrackingFilters.amountRange.min !== null || this.paymentTrackingFilters.amountRange.max !== null) {
            filteredVehicles = filteredVehicles.filter(vehicle => {
                const totalPrice = (vehicle.price || 0) + this.getVehicleTotalSupplements(vehicle);
                const min = this.paymentTrackingFilters.amountRange.min;
                const max = this.paymentTrackingFilters.amountRange.max;

                if (min !== null && totalPrice < min) return false;
                if (max !== null && totalPrice > max) return false;
                return true;
            });
        }

        this.vehicles = filteredVehicles;
        this.updatePaymentMetrics();
        console.log('Client-side payment tracking filters applied. Filtered vehicles count:', this.vehicles.length);
    }

    clearPaymentFilters(): void {
        this.paymentTrackingFilters = {
            status: '',
            dataSource: 'current',
            rangePreset: '30',
            paymentStatus: '',
            dateRange: { start: null, end: null },
            amountRange: { min: null, max: null },
            insuranceCompany: '',
            showOnlyDelivered: false,
            showOverdue: false,
            additionalInfo: ['payments', 'receipts', 'supplements'],
            pdfIncludes: ['payments', 'receipts', 'supplements']
        };

        this.showWeekCalendar = false;

        // Reset to original vehicles and apply basic filters
        this.applyFilters();
        console.log('Payment tracking filters cleared');
    }

    // Helper methods for multi-select functionality
    toggleCollectionSelection(collection: string, filterType: 'additionalInfo' | 'pdfIncludes'): void {
        const currentArray = this.paymentTrackingFilters[filterType];
        const index = currentArray.indexOf(collection);

        if (index > -1) {
            // Remove if already selected
            currentArray.splice(index, 1);
        } else {
            // Add if not selected
            currentArray.push(collection);
        }
    }

    isCollectionSelected(collection: string, filterType: 'additionalInfo' | 'pdfIncludes'): boolean {
        return this.paymentTrackingFilters[filterType].includes(collection);
    }

    selectAllCollections(filterType: 'additionalInfo' | 'pdfIncludes'): void {
        this.paymentTrackingFilters[filterType] = ['payments', 'receipts', 'supplements'];
    }

    deselectAllCollections(filterType: 'additionalInfo' | 'pdfIncludes'): void {
        this.paymentTrackingFilters[filterType] = [];
    }

    isPaymentOverdue(vehicle: Vehicle): boolean {
        // Consider a payment overdue if vehicle is delivered (status 11) but not paid
        // and it's been more than X days since delivery
        if (vehicle.status === 11 && !vehicle.paid) {
            const deliveredDate = new Date(vehicle.updatedAt); // Assuming updatedAt reflects delivery
            const daysSinceDelivery = Math.floor((Date.now() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24));
            return daysSinceDelivery > 7; // Overdue if more than 7 days
        }
        return false;
    }

    // Data source change handler
    onDataSourceChange(): void {
        const isArchived = this.paymentTrackingFilters.dataSource === 'archived';

        // Always show starting week when archived
        this.showWeekCalendar = isArchived;
        console.log(isArchived ? 'Archived selected: showing starting week selector' : 'Current data source selected - hiding week calendar');

        if (this.currentReport.id === 'payment-tracking') {
            if (!isArchived) {
                // Switching to current: reload immediately
                console.log('Reloading payment tracking report with current data source');
                this.loadPaymentTrackingReport();
            } else {
                // Archived: reload only when we have a starting week selected
                if (this.selectedWeek) {
                    console.log('Archived selected with starting week set; applying range preset:', this.paymentTrackingFilters.rangePreset);
                    this.loadPaymentTrackingReport();
                } else {
                    console.log('Archived selected but no starting week yet - waiting for selection');
                }
            }
        }
    }

    // Week calendar methods
    getWeekStartDate(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    }

    getWeekEndDate(date: Date): Date {
        const startDate = this.getWeekStartDate(date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return endDate;
    }

    // Display helper: shows effective report date range when archived
    getReportDateRangeLabel(): string | null {
        if (this.paymentTrackingFilters.dataSource !== 'archived' || !this.selectedWeek) {
            return null;
        }
        const preset = this.paymentTrackingFilters.rangePreset;
        if (preset && preset !== 'custom') {
            const days = parseInt(preset, 10);
            const end = this.getWeekEndDate(this.selectedWeek);
            const to = new Date(end);
            const from = new Date(end);
            from.setDate(end.getDate() - (days - 1));
            return `${from.toLocaleDateString()} - ${to.toLocaleDateString()} (${days} days)`;
        } else {
            const start = this.getWeekStartDate(this.selectedWeek);
            const end = this.getWeekEndDate(this.selectedWeek);
            return `${start.toLocaleDateString()} - ${end.toLocaleDateString()} (7 days)`;
        }
    }

    getFilenameFriendlyDateRange(): string {
        if (this.paymentTrackingFilters.dataSource !== 'archived' || !this.selectedWeek) {
            console.log('Not archived or no selected week, returning empty string');
            return '';
        }

        const rangeLabel = this.getReportDateRangeLabel();
        console.log('Range label for filename:', rangeLabel);
        if (!rangeLabel) {
            console.log('No range label, returning empty string');
            return '';
        }

        // Parse the range label to extract dates
        const match = rangeLabel.match(/(\d+\/\d+\/\d+)\s*-\s*(\d+\/\d+\/\d+)\s*\((\d+)\s*days\)/);
        if (!match) {
            console.log('No match found for range label pattern');
            return '';
        }

        const [, startDate, endDate, days] = match;
        console.log('Parsed dates:', { startDate, endDate, days });

        // Convert dates to filename-friendly format (MM-DD-YYYY)
        const formatDateForFilename = (dateStr: string) => {
            const [month, day, year] = dateStr.split('/');
            return `${month}-${day}-${year}`;
        };

        const result = `(${formatDateForFilename(startDate)}_to_${formatDateForFilename(endDate)}_${days}days)`;
        console.log('Generated filename date range:', result);
        return result;
    }

    formatWeekRange(date: Date): string {
        const startDate = this.getWeekStartDate(date);
        const endDate = this.getWeekEndDate(date);
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }

    onWeekChange(event: any): void {
        const weekValue = event.target.value;
        console.log('Week input value:', weekValue);

        if (!weekValue) {
            console.log('No week selected, skipping reload');
            return;
        }

        // Parse the week value (format: YYYY-W##)
        const [year, weekStr] = weekValue.split('-W');
        if (!year || !weekStr) {
            console.log('Invalid week format, skipping reload');
            return;
        }

        // Create a date from the week value
        this.selectedWeek = new Date(parseInt(year), 0, 1 + (parseInt(weekStr) - 1) * 7);
        console.log('Week changed to:', this.formatWeekRange(this.selectedWeek));

        // If we're currently viewing payment tracking report and archived data is selected, reload the report
        if (this.currentReport.id === 'payment-tracking' && this.paymentTrackingFilters.dataSource === 'archived') {
            console.log('Reloading payment tracking report with new week selection');
            this.loadPaymentTrackingReport();
        }
    }

    getWeekInputValue(date: Date): string {
        // Convert date to ISO week format (YYYY-W##)
        const year = date.getFullYear();
        const week = this.getWeekNumber(date);
        return `${year}-W${week.toString().padStart(2, '0')}`;
    }

    getWeekNumber(date: Date): number {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }


    getActivePaymentFiltersCount(): number {
        let count = 0;
        if (this.paymentTrackingFilters.status) count++;
        if (this.paymentTrackingFilters.dataSource === 'archived') count++;
        if (this.paymentTrackingFilters.paymentStatus) count++;
        if (this.paymentTrackingFilters.insuranceCompany) count++;
        if (this.paymentTrackingFilters.dateRange.start || this.paymentTrackingFilters.dateRange.end) count++;
        if (this.paymentTrackingFilters.amountRange.min !== null || this.paymentTrackingFilters.amountRange.max !== null) count++;
        if (this.paymentTrackingFilters.showOnlyDelivered) count++;
        if (this.paymentTrackingFilters.showOverdue) count++;
        if (this.paymentTrackingFilters.additionalInfo.length > 0 &&
            this.paymentTrackingFilters.additionalInfo.length < 4) count++;
        if (this.paymentTrackingFilters.pdfIncludes.length > 0 &&
            this.paymentTrackingFilters.pdfIncludes.length < 4) count++;
        return count;
    }

    updatePaymentMetrics(): void {
        if (this.currentReport.id === 'payment-tracking' && this.vehicles) {
            this.paymentMetrics = this.reportService.calculatePaymentMetrics(this.vehicles);
            this.paymentStatusSummary = this.reportService.getPaymentStatusSummary(this.vehicles);
            console.log('Payment metrics updated for filtered vehicles:', this.vehicles.length);
        }
    }

    // Test method to explore nested data capabilities
    testNestedDataCalls(): void {
        console.log('=== Testing Nested Data Calls ===');

        // Test 1: Load vehicles with only payments
        console.log('Test 1: Loading vehicles with payments only...');
        this.reportService.getVehiclesWithPayments(this.user.companyId || 0).subscribe({
            next: (vehicles) => {
                console.log('Vehicles with payments:', vehicles.length);
                if (vehicles.length > 0) {
                    console.log('Sample vehicle payments:', vehicles[0].payments);
                }
            }
        });

        // Test 2: Load vehicles with only receipts
        console.log('Test 2: Loading vehicles with receipts only...');
        this.reportService.getVehiclesWithReceipts(this.user.companyId || 0).subscribe({
            next: (vehicles) => {
                console.log('Vehicles with receipts:', vehicles.length);
                if (vehicles.length > 0) {
                    console.log('Sample vehicle receipts:', vehicles[0].receipts);
                }
            }
        });

        // Test 3: Load vehicles with payments and receipts
        console.log('Test 3: Loading vehicles with payments and receipts...');
        this.reportService.getVehiclesWithPaymentsAndReceipts(this.user.companyId || 0).subscribe({
            next: (vehicles) => {
                console.log('Vehicles with payments and receipts:', vehicles.length);
                if (vehicles.length > 0) {
                    console.log('Sample vehicle data:', {
                        id: vehicles[0].id,
                        payments: vehicles[0].payments,
                        receipts: vehicles[0].receipts,
                        supplements: vehicles[0].supplements
                    });
                }
            }
        });

        // Test 4: Load vehicles with current report's collections
        console.log('Test 4: Loading vehicles with current report collections...');
        const currentCollections = this.getCurrentReportIncludeCollections();
        console.log('Current report collections:', currentCollections);

        this.reportService.getVehiclesWithNestedData(
            this.user.companyId || 0,
            currentCollections,
            'current',
            'all'
        ).subscribe({
            next: (vehicles) => {
                console.log('Vehicles with current report collections:', vehicles.length);
                if (vehicles.length > 0) {
                    console.log('Sample vehicle with current report collections:', {
                        id: vehicles[0].id,
                        payments: vehicles[0].payments,
                        supplements: vehicles[0].supplements,
                        receipts: vehicles[0].receipts,
                        collectionsLoaded: currentCollections
                    });
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Copy getUserById from Inshop4 (lines 2606-2643)
    getUserById(userId: any): void {
        this.userService.getUserById(userId).subscribe({
            next: (result: any) => {
                this.user = result;

                // Check if user has permission to view reports
                if (!this.user.allowViewReport) {
                    console.warn('User does not have permission to view reports');
                    this.router.navigate(['/inshop']);
                    return;
                }

                if (this.user.companyId != 0) {
                    // Load company information
                    this.getCompanyInfo(this.user.companyId);

                    this.getAllComponyEmployees(this.user.companyId);
                    this.getAllComponyUsers(this.user.companyId);
                    // Load settings for the company (more efficient approach)
                    this.getSettings(this.user.companyId);

                    // Load default report (Payment Tracking)
                    //this.loadReport(this.currentReport.id);
                }

                // Try to open modal now that user data is loaded
                this.tryOpenModal();
            },
            error: err => {
                console.error('Error loading user:', err);
                this.errorMessage = 'Error loading user information';
            }
        });
    }

    // Get company information
    getCompanyInfo(companyId: number | undefined): void {
        if (!companyId) return;

        this.companyService.getCompany(companyId).subscribe({
            next: (result: any) => {
                this.company = result;
            },
            error: err => {
                console.error('Error loading company:', err);
            }
        });
    }

    getAllComponyEmployees(companyId: any): void {

        this.employeeService.getComponyEmployees(companyId).subscribe({
            next: result => {
                if (result) {
                    //this.users = result;
                    this.employees = result;
                    this.employees = this.filterEmployees(this.employees, 0);
                }

                for (let employee of this.employees) {
                    employee.url = location.origin + "/#/operation/" + employee.token;
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

    filterEmployees(employees: Employee[], status: any): Employee[] {

        return employees.filter(a => a.status == status);
    }


    getAllComponyUsers(companyId: any): void {

        this.userService.getAllCompanyUsers(companyId).subscribe({
            next: result => {
                this.users = result;
            }
        });
    }


    setImageAutoPart(index: any): void {

        this.selectedImage = this.selectedAutopart.imageModels[index].id;
    }

    deleteImageAutopart(autopartId: any, imageId: any) {


        console.log("deleteImage");

        this.autopartService.deleteImageWihtUserId(imageId, autopartId, this.user.id).subscribe({
            next: (result) => {
                console.log(result);
                this.autopartService.get(autopartId).subscribe({
                    next: (result => {
                        console.log(result);
                        this.selectedAutopart = result;
                        this.selectedImage = this.selectedAutopart.showInSearchImageId;

                    })
                });
            }
        });
    }

    setImageForSearchAutoparts(autopartId: any, imageId: any) {


        console.log("setImageForSearch");

        this.autopartService.setImageForSearch(imageId, autopartId).subscribe({
            next: (result) => {
                console.log(result);
                this.autopartService.get(autopartId).subscribe({
                    next: (result => {
                        console.log(result);
                        this.selectedAutopart = result;
                        this.selectedImage = this.selectedAutopart.showInSearchImageId;

                        for (let autopart of this.autopartsSearch) {
                            if (autopart.id == autopartId) {
                                autopart.showInSearchImageId = this.selectedAutopart.showInSearchImageId;
                            }
                        }

                    })
                });
            }
        });
    }

    // Load settings for the company (copied from Inshop4Component pattern)
    getSettings(companyId: any): void {
        this.settingService.getSetting(companyId).subscribe({
            next: (result: any) => {
                if (result) {
                    this.setting = result;
                    this.employeeRoles = this.setting.employeeRoles;
                    this.jobRequestTypes = this.setting.JobRequestTypes;
                    this.paymentMethods = this.setting.paymentMethods;
                    this.approvalStatuss = this.setting.approvalStatuss;
                    this.paymentStatuss = this.setting.paymentStatuss;
                    this.services = this.setting.services;
                    this.locations = this.setting.locations;
                    this.keyLocations = this.setting.keyLocations;
                    this.insurancers = this.setting.insurancers;
                    this.inTakeWays = this.setting.inTakeWays;
                    this.statuss = this.setting.statuss;
                    this.paymentTypes = this.setting.paymentTypes;
                    this.rentals = this.setting.rentals;
                    this.disclaimers = this.setting.disclaimers;
                    this.warranties = this.setting.warranties;
                    this.columnInfos = this.setting.columnInfos;
                    this.itemTypes = this.setting.itemTypes;
                    this.docTypes = this.setting.docTypes;
                    this.vendors = this.setting.vendors;
                    console.log(this.jobRequestTypes);
                    console.log(this.statuss);

                    for (let disclaimer of this.disclaimers) {
                        if (disclaimer.isDefault == true) {
                            this.disclaimerId = disclaimer.id;
                            this.disclaimerText = disclaimer.text;
                        }
                    }

                    for (let warranty of this.warranties) {
                        if (warranty.isDefault == true) {
                            this.warrantyId = warranty.id;
                            this.warrantyText = warranty.text;
                        }
                    }

                    for (let employee of this.employees) {
                        for (let employeeRole of this.employeeRoles) {
                            if (employeeRole.id == employee.roleId) {
                                employee.roleName = employeeRole.name;
                                employee.rolePrecentage = employeeRole.precentage;
                                employee.commissionBased = employeeRole.commissionBased;
                            }
                        }
                    }

                    this.company = this.setting.company;
                    this.company.iconString = "data:image/jpeg;base64," + this.company.icon;
                    this.companyDefaultTaxRate = this.company.taxRate;

                    this.statuss2 = this.setting.statuss;
                    var statusNoStatus = new Status();
                    statusNoStatus.name = "No Status";
                    statusNoStatus.id = 0;
                    statusNoStatus.sequenceNumber = -1;
                    this.statuss2.push(statusNoStatus);
                    this.statuss2 = this.statuss2.sort((a, b) => a.sequenceNumber - b.sequenceNumber);


                    var docTYpeNoType = new DocType();
                    docTYpeNoType.name = "Not Sorted";
                    docTYpeNoType.id = 0;
                    docTYpeNoType.sequenceNumber = -1;
                    this.docTypes.push(docTYpeNoType);
                    for (let docType of this.docTypes) {
                        docType.imageModels = new Array();
                    }

                    this.docTypes = this.docTypes.sort((a, b) => a.sequenceNumber - b.sequenceNumber);


                }
            },
            error: err => {
                console.error('Error loading settings:', err);
            }
        });
    }

    // Use ReportService for vehicle search
    searchVehicleForReports(type: number, pageNumber: any, pageSize: any): void {
        this.searchType = type;
        this.errorMessage = "";
        this.isLoading = true;

        console.log('Loading vehicles for company:', this.user.companyId);
        this.currantPageNumber = pageNumber;

        // Use ReportService for current shop vehicles summary
        this.reportService.getCurrentShopVehiclesSummary(this.user.companyId || 0).subscribe({
            next: (res) => {
                console.log('Vehicles loaded via ReportService:', res.length);

                this.vehiclesOriginal = res;
                this.vehicles = this.vehiclesOriginal;

                // Process vehicles for display
                for (let vehicle of this.vehicles) {
                    if (vehicle.make.includes(' ')) {
                        vehicle.make = vehicle.make.replace(' ', '-');
                    }
                }

                this.isLoading = false;
                this.showReport = true;

                console.log('Report ready with', this.vehicles.length, 'vehicles');
            },
            error: (err) => {
                console.error('Error loading vehicles via ReportService:', err);
                this.errorMessage = 'Error loading vehicles';
                this.isLoading = false;
            }
        });
    }


    // Copy searchVehicle logic from Inshop4 (lines 9693-9800)
    searchVehicle(type: number, pageNumber: any, pageSize: any): void {
        this.searchType = type;
        this.errorMessage = "";
        this.isLoading = true;

        console.log('Loading vehicles for company:', this.user.companyId);
        this.currantPageNumber = pageNumber;

        const data = {
            type: type,
            year: 0, // Load all years
            make: '', // Load all makes
            model: '', // Load all models
            color: '', // Load all colors
            archived: false, // Current vehicles only
            companyId: this.user.companyId,
            partNumber: "placeholder",
            pageNumber: Math.max(this.currantPageNumber - 1, 0),
            pageSize: pageSize,
            lastName: this.searchInput
        };

        console.log('Vehicle search data:', data);

        this.vehicleService.searchByYearMakeModelColor(data).subscribe({
            next: (res) => {
                console.log('Vehicles loaded:', res.length);

                this.vehiclesOriginal = res;
                this.vehicles = this.vehiclesOriginal;

                // Process vehicles for display
                for (let vehicle of this.vehicles) {
                    if (vehicle.make.includes(' ')) {
                        vehicle.make = vehicle.make.replace(' ', '-');
                    }
                }

                this.isLoading = false;
                this.showReport = true;

                console.log('Report ready with', this.vehicles.length, 'vehicles');
            },
            error: (err) => {
                console.error('Error loading vehicles:', err);
                this.errorMessage = 'Error loading vehicles';
                this.isLoading = false;
            }
        });
    }

    // Helper methods for report display
    calculateEstimate(vehicle: Vehicle): number {
        let total = 0;
        if (vehicle.price) total += vehicle.price;
        if (vehicle.supplymentPrice) total += vehicle.supplymentPrice;

        // Add supplements total
        if (vehicle.supplements && vehicle.supplements.length > 0) {
            vehicle.supplements.forEach(supplement => {
                if (supplement.price) total += supplement.price;
            });
        }

        return total;
    }

    getTotalSupplements(vehicle: Vehicle): number {
        let total = 0;
        if (vehicle.supplements && vehicle.supplements.length > 0) {
            for (let supplement of vehicle.supplements) {
                if (supplement.price && supplement.price > 0) {
                    total += supplement.price;
                }
            }
        }
        return total;
    }

    getCustomerName(vehicle: Vehicle): string {
        if (vehicle.customer) {
            return `${vehicle.customer.firstName || ''} ${vehicle.customer.lastName || ''}`.trim();
        }
        return 'N/A';
    }

    getVehicleImage(vehicle: Vehicle): string {
        // Use showInSearchImageId to get image URL - matching Inshop4Component pattern
        if (vehicle.showInSearchImageId > 0 && vehicle.imageModels && vehicle.imageModels.length > 0) {
            // Use the same pattern as Inshop4Component: baseUrlResizeImage + '/' + showInSearchImageId
            return this.baseUrlResizeImage + '/' + vehicle.showInSearchImageId;
        }

        // Default placeholder image - using an existing image from assets
        return 'assets/images/Laptop.png';
    }

    getJobType(vehicle: Vehicle): string {
        for (let jobRequestType of this.jobRequestTypes) {
            if (jobRequestType.id == vehicle.jobRequestType) {
                return jobRequestType.name || 'N/A';
            }

        }
        return 'N/A';
    }

    getJobStatus(vehicle: Vehicle): string {
        for (let status of this.statuss) {
            if (status.id == vehicle.status) {
                return status.name || 'N/A';
            }
        }
        return 'N/A';
    }

    // Format phone number (copied from Inshop4Component)
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

    // Format phone number with spaces (copied from Inshop4Component)
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

    // Sorting functionality based on inshop4.component.ts
    sortList(fieldName: string): void {
        this.counter++;

        if (fieldName == 'id') {
            if (this.counter % 2 == 1)
                this.vehicles = this.vehicles.sort((a, b) => (a.id || 0) - (b.id || 0));
            else
                this.vehicles = this.vehicles.sort((a, b) => (b.id || 0) - (a.id || 0));
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

        if (fieldName == 'status') {
            // Set sortStr for status
            for (let vehicle of this.vehicles) {
                vehicle.sortStr = '';
                for (let status of this.statuss) {
                    if (status.id == vehicle.status) {
                        vehicle.sortStr = status.name || '';
                    }
                }
            }

            if (this.counter % 2 == 1)
                this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
            else
                this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
        }

        if (fieldName == 'jobRequestType') {
            // Set sortStr for jobRequestType
            for (let vehicle of this.vehicles) {
                vehicle.sortStr = '';
                for (let jobRequestType of this.jobRequestTypes) {
                    if (jobRequestType.id == vehicle.jobRequestType) {
                        vehicle.sortStr = jobRequestType.name || '';
                    }
                }
            }

            if (this.counter % 2 == 1)
                this.vehicles = this.vehicles.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
            else
                this.vehicles = this.vehicles.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
        }

        if (fieldName == 'paid') {
            if (this.counter % 2 == 1)
                this.vehicles = this.vehicles.sort((a, b) => Number(a.paid) - Number(b.paid));
            else
                this.vehicles = this.vehicles.sort((a, b) => Number(b.paid) - Number(a.paid));
        }

        if (fieldName == 'price') {
            if (this.counter % 2 == 1)
                this.vehicles = this.vehicles.sort((a, b) => this.calculateEstimate(a) - this.calculateEstimate(b));
            else
                this.vehicles = this.vehicles.sort((a, b) => this.calculateEstimate(b) - this.calculateEstimate(a));
        }

        if (fieldName == 'customer') {
            if (this.counter % 2 == 1)
                this.vehicles = this.vehicles.sort((a, b) => this.getCustomerName(a).localeCompare(this.getCustomerName(b)));
            else
                this.vehicles = this.vehicles.sort((a, b) => this.getCustomerName(b).localeCompare(this.getCustomerName(a)));
        }

        if (fieldName == 'createdAt') {
            if (this.counter % 2 == 1)
                this.vehicles = this.vehicles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            else
                this.vehicles = this.vehicles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }




    getTotalEstimates(): number {
        return this.vehicles.reduce((sum, vehicle) => sum + this.calculateEstimate(vehicle), 0);
    }

    getTotalSupplementsAmount(): number {
        return this.vehicles.reduce((sum, vehicle) => {
            if (vehicle.supplements && vehicle.supplements.length > 0) {
                return sum + vehicle.supplements.reduce((supplementSum, supplement) =>
                    supplementSum + (supplement.price || 0), 0);
            }
            return sum;
        }, 0);
    }

    getCurrentReportDate(): string {
        const currentDate = new Date().toLocaleDateString();
        let userName = 'Unknown User';

        if (this.user) {
            const firstName = this.user.firstName || '';
            const lastName = this.user.lastName || '';
            const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
            const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
            userName = `${capitalizedFirstName} ${capitalizedLastName}`.trim();
        }

        return `Report Date: ${currentDate} By ${userName}`;
    }

    // Missing methods for template binding
    getTotalClaims(): number {
        return this.claims.reduce((sum, claim) => sum + (claim.amount || 0), 0);
    }

    getTotalPayments(): number {
        return (this.vehicle.payments || []).reduce((sum, payment) => sum + (payment.amount || 0), 0);
    }

    getTotalBalance(): number {
        return this.getTotalClaims() - this.getTotalPayments();
    }

    onChangeVehiclePaymentMethod(event: any, paymentMethodValue: any): void {
        // Handle payment method change
        console.log('Payment method changed:', event, paymentMethodValue);
        // Add implementation based on your business logic
    }

    setDisclaimerText(disclaimerId: any): void {
        this.disclaimerId = disclaimerId;
        // Find and set disclaimer text based on disclaimerId
        const disclaimer = this.disclaimers.find(d => d.id == disclaimerId);
        if (disclaimer) {
            console.log('Disclaimer set:', disclaimer);
            // Add implementation to set disclaimer text
        }
    }

    setWarrantyText(warrantyId: any): void {
        this.warrantyId = warrantyId;
        // Find and set warranty text based on warrantyId
        const warranty = this.warranties.find(w => w.id == warrantyId);
        if (warranty) {
            console.log('Warranty set:', warranty);
            // Add implementation to set warranty text
        }
    }

    onChangeVehiclePaymentCalendarVerified(event: any, payment: any): void {
        payment.dateVerified = event.target.value;
        payment.userIdVerified = this.user.id;
        payment.reason = "calender Verified";
        console.log(event.target.value);
        console.log("onChangeVehiclePaymentCalendarVerified");
        this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
            next: result => {
                console.log(result);
                this.payment = result;
                payment.reason = "";
            }
        });
    }

    deleteVehiclePayment(vehicle: any, payment: any): void {
        console.log("deleteVehiclePayment " + payment.id);

        this.paymentService.deletePayment(payment.id).subscribe({
            next: result => {
                console.log(result);

                var i = 0;
                for (let payment1 of (this.vehicle.payments || [])) {
                    if (payment1.id == payment.id) {
                        this.vehicle.payments?.splice(i, 1);
                    }
                    i++;
                }
            }
        });
    }

    savePayment(payment: any): void {
        payment.reason = "updates";
        this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
            next: result => {
                this.payment = result;
            }, error: (e) => console.log(e)
        });
    }

    onChangeVehiclePaymentStatus(event: any, payment: any): void {
        payment.paymentStatusId = event.target.value;
        payment.reason = "payment status";
        console.log(event.target.value);
        console.log("onChangeVehiclePaymentStatus");
        this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
            next: result => {
                console.log(result);
                this.payment = result;
                payment.reason = "";
            }
        });
    }

    onChangeNoTax(event: any): void {
        var isCheck: boolean = event.target.checked;
        if (isCheck == true) {
            this.company.taxRate = 0.00;
        } else {
            this.company.taxRate = this.companyDefaultTaxRate;
        }
    }

    createClaimClaim(itemType: any): void {
        let claim: any = {};
        claim.name = "change Me";
        claim.reason = "new";
        claim.userId = this.user.id;
        claim.itemType = itemType.id;

        //claim.amount = 0;
        claim.quantity = 1;
        claim.vehicleId = this.vehicle.id;
        claim.notes = "";
        claim.itemNumber = this.randomString();
        claim.sequenceNumber = -1;

        this.claimService.createClaim(this.currentUser.id, claim).subscribe({
            next: result => {
                if (result) {
                    console.log(result);
                    // claim = result;
                    // claim.createJobOrder = itemType.createJobOrder;
                    // claim.createPurchaseOrder = itemType.createJobOrder;

                    // this.claims.unshift(claim);
                    this.getAllVehicleClaims(this.vehicle.id);
                    this.getAllVehicleReceipt(this.vehicle.id);
                }
            }
        });
    }

    addVehiclePayment(paymentType: any): void {
        console.log("addVehiclePayment");
        var payment = {
            id: 0,
            name: paymentType.name,
            notes: "Please specify",
            paymentTypeId: paymentType.id,
            vehicleId: this.vehicle.id,
            paymentStatusId: 0,
            paymentMethodId: 0,
            reason: "new"
        };

        this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
            next: result => {
                if (result) {
                    console.log(result);
                    this.payment = result;
                    if (this.vehicle.payments) {
                        this.vehicle.payments.unshift(this.payment);
                    }
                }
            }
        });
    }

    scrollToSection(sectionId: string): void {
        // Handle scrolling to section
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    hasPOorJO(): boolean {
        // Check if has PO or JO
        return this.purchaseOrders.length > 0 || this.jobs.length > 0;
    }

    filterClaims(status: number): any[] {
        // Filter claims by status
        return this.claims.filter(claim => claim.status === status);
    }

    lockAllEstimates(status: any): void {
        for (let claim of this.claims) {
            if (claim.status != status) {
                claim.status = status;
                if (claim.status == 0)
                    this.lockClaim('unlock', claim);
                else
                    this.lockClaim('lock', claim);
            }
        }
    }

    lockClaim(reason: any, claim: Claim): void {
        if (reason == 'lock') {
            claim.lockedAt = new Date();
            claim.status = 1;
        }
        else {
            claim.lockedAt = undefined;
            claim.status = 0;
        }
        claim.userId = this.user.id;
        claim.reason = reason;

        this.claimService.createClaim(this.currentUser.id, claim).subscribe({
            next: result => {
                if (result)
                    this.claim = result;
                //sync 
                for (let claim of this.claims) {
                    if (claim.id == this.claim.id) {
                        claim = this.claim;
                    }
                }
                // this.getVehiclePayments(this.vehicle.id);
            }
        })
    }

    onEnterPayment(reason: any, payment: Payment): void {
        payment.reason = reason;
        payment.userId = this.user.id;

        this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
            next: result => {
                if (result)
                    this.payment = result;
                // this.getVehiclePayments(this.vehicle.id);
            }
        })
    }

    onChangeVehiclePaymentCalendar($event: any, payment: Payment): void {
        payment.date = $event.target.value;
        payment.reason = "calender"
        console.log($event.target.value);
        console.log("onChangeVehiclePaymentCalendar");
        this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
            next: result => {
                console.log(result);
                this.payment = result;
                payment.reason = "";
            }
        })
    }

    onChangeVehiclePaymentMethod2($event: any, payment: Payment): void {
        payment.paymentMethodId = $event.target.value;
        payment.reason = "payment method"
        console.log($event.target.value);
        console.log("onChangeVehiclePaymentMethod2");
        this.paymentService.createPayment(this.currentUser.id, payment).subscribe({
            next: result => {
                console.log(result);
                this.payment = result;
                payment.reason = "";
            }
        })
    }

    printPage(componentId: string, title: any) {
        const elementImage = <HTMLElement>document.querySelector("[id='" + componentId + "']");
        const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
        WindowPrt?.document.write('<title>' + title + '</title>');
        WindowPrt?.document.write("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">");
        WindowPrt?.document.write("<link href=\"../styles.css\" rel=\"stylesheet\">");
        WindowPrt?.document.write('<style type=\"text/css\">body{background-color: white;}</style>');
        // WindowPrt?.document.write('<style type=\"text/css\">th{color: white;background: rgb(13, 173, 226);}</style>');
        WindowPrt?.document.write(elementImage.innerHTML);
        WindowPrt?.document.write('<script>onload = function() { window.print(); }</script>');
        WindowPrt?.document.close();
        WindowPrt?.focus();
    }

    droppedClaim(event: CdkDragDrop<string[]>) {
        moveItemInArray(
            this.claims,
            event.previousIndex,
            event.currentIndex
        );

        var sequenceCarriers: SequenceCarrier[] = new Array();
        for (let i = 0; i < this.claims.length; i++) {
            let sequenceCarrier = new SequenceCarrier();
            sequenceCarrier.id = this.claims[i].id;
            sequenceCarrier.index = i;
            sequenceCarriers.push(sequenceCarrier);
        }

        this.claimService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
            next: result => {
                if (result) {
                    this.claims = result;
                    this.claims = this.claims.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                    for (let claim of this.claims) {
                        for (let itemType of this.itemTypes) {
                            if (itemType.id == claim.itemType) {
                                if (itemType.createJobOrder == true) {
                                    claim.createJobOrder = true;
                                }

                                if (itemType.createPurchaseOrder == true) {
                                    console.log("===== found it");
                                    claim.createPurchaseOrder = true;
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    setClaimId(claimId: any): void {
        this.currentClaimId = claimId;
        console.log(this.currentClaimId);
    }

    onEnterClaimClaim(reason: any, claim: Claim): void {
        claim.reason = reason;
        claim.userId = this.user.id;

        this.claimService.createClaim(this.currentUser.id, claim).subscribe({
            next: result => {
                if (result)
                    this.claim = result;

                for (let i = 0; i < this.claims.length; i++) {
                    if (this.claim.id == this.claims[i].id) {
                        this.claims[i] = this.claim;
                        for (let itemType of this.itemTypes) {
                            if (this.claims[i].itemType == itemType.id) {
                                this.claims[i].createJobOrder = itemType.createJobOrder;
                                this.claims[i].createPurchaseOrder = itemType.createPurchaseOrder;
                                this.claim.createJobOrder = itemType.createJobOrder;
                                this.claim.createPurchaseOrder = itemType.createPurchaseOrder;
                            }
                        }
                    }
                }

                if (reason == 'item type') {
                    for (let itemType of this.itemTypes) {
                        if (this.claim.itemType == itemType.id) {
                            if (itemType.createJobOrder == true && claim.jobs.length == 0) {
                                console.log("addVehicleJob");
                            }

                            if (itemType.createPurchaseOrder == true && claim.purchaseOrders.length == 0) {
                                // Add purchase order creation logic here if needed
                            }
                        }
                    }
                }
                // this.getVehiclePayments(this.vehicle.id);
                this.getAllVehicleReceipt(this.vehicle.id);
            }
        })
    }

    onEnterClaim(reason: any, claim: Claim): void {
        claim.reason = reason;
        claim.userId = this.user.id;

        this.claimService.createClaim(this.currentUser.id, claim).subscribe({
            next: result => {
                if (result)
                    this.claim = result;
                if (reason == 'claim type') {
                    for (let itemType of this.itemTypes) {
                        if (this.claim.itemType == itemType.id) {
                            if (itemType.createJobOrder == true && claim.jobs.length == 0) {
                                // Add job creation logic here if needed
                            }

                            if (itemType.createPurchaseOrder == true && claim.purchaseOrders.length == 0) {
                                // Add purchase order creation logic here if needed
                            }
                        }
                    }
                }
                // this.getVehiclePayments(this.vehicle.id);
            }
        })
    }

    droppedPayment(event: CdkDragDrop<string[]>) {
        moveItemInArray(
            this.vehicle.payments || [],
            event.previousIndex,
            event.currentIndex
        );

        var sequenceCarriers: SequenceCarrier[] = new Array();
        for (let i = 0; i < (this.vehicle.payments || []).length; i++) {
            let sequenceCarrier = new SequenceCarrier();
            sequenceCarrier.id = this.vehicle.payments?.[i]?.id;
            sequenceCarrier.index = i;
            sequenceCarriers.push(sequenceCarrier);
        }

        this.paymentService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
            next: result => {
                if (result) {
                    this.vehicle.payments = result;
                    this.vehicle.payments = this.vehicle.payments.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                }
            }
        })
    }

    setPaymentPaymentId(paymentId: any): void {
        this.currentPaymentPaymentId = paymentId;
        console.log(this.currentPaymentPaymentId);
    }

    getTaxClaim(): number {
        // Calculate tax on claims
        return this.claims.reduce((sum, claim) => sum + (claim.tax || 0), 0);
    }

    getTotalClaimsLocked(): number {
        // Calculate total locked claims
        return this.claims.filter(claim => claim.locked).reduce((sum, claim) => sum + (claim.amount || 0), 0);
    }

    getTotalBalanceLocked(): number {
        // Calculate total locked balance
        return this.getTotalClaimsLocked() - this.getTotalPayments();
    }

    // Method to get claim subtotal
    getClaimSubTotal(claim: any): any {

        return +((claim.quantity * claim.amount).toFixed(2));
    }

    // Method to delete vehicle claim
    deleteVehicleClaim(event: any, claim: any): void {

        console.log("deleteVehicleClaim nestedConfirmationService" + claim.id);

        if (claim.purchaseOrders.length == 0 && claim.jobs.length == 0) {

            const customTitle = 'Remote Estimate [' + claim.notes + "] ";
            const message = 'Are you sure you want to remove this estimate?';
            const buttonType = "yesNo" // buttonType: 'yesNo' | 'okCancel' | 'okOnly' | 'yesNoCancel' = 'yesNo';  // Button type
            this.nestedConfirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed) {
                    this.claimService.deleteClaimWithOption(claim.id, this.user.id, 1).subscribe({
                        next: result => {
                            console.log(result);
                            this.getAllVehicleClaims(this.vehicle.id);

                        }
                    })
                } else {

                }
            });


        }

        if (claim.purchaseOrders.length > 0 || claim.jobs.length > 0) {

            const customTitle = 'Remote Estimate [' + claim.notes + "] ";
            var message = 'Are you sure you want to remove this estimate?';
            var message = "";
            message += "Remove "

            if (claim.purchaseOrders.length > 0)
                message += " [" + claim.purchaseOrders.length + "] puchase orders ";
            if (claim.jobs.length > 0)
                message += " [" + claim.jobs.length + "] job orders ";

            message += "at the same time ? "

            const buttonType = "yesNoCancel" // buttonType: 'yesNo' | 'okCancel' | 'okOnly' | 'yesNoCancel' = 'yesNo';  // Button type
            this.nestedConfirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed === undefined) {

                    return;
                }

                if (confirmed) {

                    this.claimService.deleteClaimWithOption(claim.id, this.user.id, 1).subscribe({
                        next: result => {
                            console.log(result);
                            this.getAllVehicleClaims(this.vehicle.id);
                            if (claim.jobs.length > 0) {
                                this.getVehicleJobs2(this.vehicle.id);
                            }
                            if (claim.purchaseOrders.length > 0) {
                                this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
                                this.getAutopartForVehicle(this.vehicle.id, true);
                            }

                        }
                    })

                } else {
                    this.claimService.deleteClaimWithOption(claim.id, this.user.id, 0).subscribe({
                        next: result => {
                            console.log(result);
                            this.getAllVehicleClaims(this.vehicle.id);

                            if (claim.jobs.length > 0) {
                                this.getVehicleJobs2(this.vehicle.id);
                            }
                            if (claim.purchaseOrders.length > 0) {
                                this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
                                this.getAutopartForVehicle(this.vehicle.id, true);
                            }
                        }
                    })
                }
            });

        }

    }

    // Method to add purchase order to claim
    addPurchaseOrderToClaim(claim: any): void {
        const customTitle = 'Reminder';
        const message = 'Please specify description first !';
        const buttonType = "okOnly" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type
        // Call the service to show the confirmation dialog and pass the callback
        if (claim.notes == null || claim.notes == "") {
            this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed) {
                    return;
                } else {
                    return;
                }
            });
        }

        var purchaseOrder = new PurchaseOrderVehicle();
        purchaseOrder.claimId = claim.id;
        purchaseOrder.id = 0;
        purchaseOrder.grade = undefined;
        purchaseOrder.title = claim.notes;
        purchaseOrder.partNumber = undefined;
        purchaseOrder.description = undefined;
        purchaseOrder.salePrice = undefined;
        purchaseOrder.stocknumber = this.randomString();
        this.errorMessagePurchaseOrder = "";
        purchaseOrder.reason = "new";
        purchaseOrder.sequenceNumber = -1;
        purchaseOrder.vehicleId = this.vehicle.id;
        purchaseOrder.companyId = this.vehicle.companyId;

        this.purchseOrderVehicleService.createPurchaseOrderVehicle(this.user.id, purchaseOrder).subscribe({
            next: (res) => {
                console.log(res);
                purchaseOrder = res;

                this.getAllVehicleClaims(this.vehicle.id);
                this.selectedPurchaseOrder = res;
                this.editPurchaseOrder(this.selectedPurchaseOrder, 0);

                setTimeout(() => {
                    this.editPurchaseOrder(this.selectedPurchaseOrder, 0);
                }, 200);

                this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
            },
            error: (e) => console.error(e)
        });
    }

    // Method to add job to claim
    addJobToClaim(claim: Claim): void {


        const customTitle = 'Reminder';
        const message = 'Pelase specity description first ';
        const buttonType = "okOnly" // buttonType: 'yesNo' | 'okCancel' | 'okOnly' | 'yesNoCancel' = 'yesNo';  // Button type
        // Call the service to show the confirmation dialog and pass the callback
        if (claim.notes == null || claim.notes == '') {
            this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed) {

                    return;
                } else {
                    return;
                }
            });
        }

        var job = {
            id: 0,
            name: claim.notes,
            employeeId: 0,
            serviceId: 0,
            claimId: claim.id,
            notes: "Please specify",
            status: 0,
            vehicleId: this.vehicle.id,
            imageModels: new Array(),
            jobRequestType: 0,
            paymentMethod: 0,
            reason: "new"
        };

        this.jobService.createJob(this.currentUser.id, job).subscribe({
            next: result => {
                if (result) {
                    console.log(result);
                    this.job = result;
                    if (this.jobs) {
                        this.jobs.unshift(this.job);
                    }

                    for (let i = 0; i < this.claims.length; i++) {
                        if (claim.id == this.claims[i].id) {
                            this.claims[i].jobs.push(this.job);
                            this.claim.jobs.push(this.job);
                        }
                    }

                    this.getAllVehicleClaims(this.vehicle.id);
                    this.getVehicleJobs2(this.vehicle.id);

                }
            }
        });
    }

    // Method to handle dropped purchase orders for claim
    droppedPurchaseOrdersClaim(event: CdkDragDrop<string[]>, claim: Claim) {
        moveItemInArray(
            claim.purchaseOrders,
            event.previousIndex,
            event.currentIndex
        );

        var sequenceCarriers: SequenceCarrier[] = new Array();
        for (let i = 0; i < claim.purchaseOrders.length; i++) {
            let sequenceCarrier = new SequenceCarrier();
            sequenceCarrier.id = claim.purchaseOrders[i].id;
            sequenceCarrier.index = i;
            sequenceCarriers.push(sequenceCarrier);
        }

        this.purchseOrderVehicleService.updateSeqenceClaim(claim.id, sequenceCarriers).subscribe({
            next: result => {

                if (result) {
                    this.purchaseOrders = result;
                    this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                }
            }
        })
    }

    // Method to sort purchase orders list for claim
    sortListPurchseOrdersClaim(fieldName: any, purchaseOrders: PurchaseOrderVehicle[]): void {
        this.counter++;

        if (fieldName == 'id') {
            if (this.counter % 2 == 1)
                purchaseOrders = purchaseOrders.sort((a, b) => a.id - b.id);
            else
                purchaseOrders = purchaseOrders.sort((a, b) => b.id - a.id);
        }

        if (fieldName == 'createdAt') {
            if (this.counter % 2 == 1)
                purchaseOrders = purchaseOrders.sort((a, b) => a.id - b.id);
            else
                purchaseOrders = purchaseOrders.sort((a, b) => b.id - a.id);
        }


        if (fieldName == 'purchaseStatus') {
            if (this.counter % 2 == 1)
                purchaseOrders = purchaseOrders.sort((a, b) => a.purchaseStatus - b.purchaseStatus);
            else
                purchaseOrders = purchaseOrders.sort((a, b) => b.purchaseStatus - a.purchaseStatus);
        }

        if (fieldName == 'status') {
            if (this.counter % 2 == 1)
                purchaseOrders = purchaseOrders.sort((a, b) => a.status - b.status);
            else
                purchaseOrders = purchaseOrders.sort((a, b) => b.status - a.status);
        }

        if (fieldName == 'title') {
            if (this.counter % 2 == 1)
                purchaseOrders = purchaseOrders.sort((a, b) => a['title'].localeCompare(b['title']));
            else
                purchaseOrders = purchaseOrders.sort((a, b) => b['title'].localeCompare(a['title']));
        }

        if (fieldName == 'description') {
            if (this.counter % 2 == 1)
                purchaseOrders = purchaseOrders.sort((a, b) => a['description'].localeCompare(b['description']));
            else
                purchaseOrders = purchaseOrders.sort((a, b) => b['description'].localeCompare(a['description']));
        }

        if (fieldName == 'partNumber') {
            if (this.counter % 2 == 1)
                purchaseOrders = purchaseOrders.sort((a, b) => a['partNumber'].localeCompare(b['partNumber']));
            else
                purchaseOrders = purchaseOrders.sort((a, b) => b['partNumber'].localeCompare(a['partNumber']));
        }

        if (fieldName == 'grade') {
            purchaseOrders = purchaseOrders.filter(item => item['grade'] !== null);
            if (this.counter % 2 == 1)
                purchaseOrders = purchaseOrders.sort((a, b) => a['grade'].localeCompare(b['grade']));
            else
                purchaseOrders = purchaseOrders.sort((a, b) => b['grade'].localeCompare(a['grade']));
        }


        if (fieldName == 'vendorId') {
            for (let purchaseOrder of purchaseOrders) {
                purchaseOrder.sortStr = "";
                for (let vendor of this.vendors) {
                    if (vendor.id == purchaseOrder.vendorId) {
                        purchaseOrder.sortStr = vendor.name;
                    }
                }
            }

            if (this.counter % 2 == 1)
                purchaseOrders = purchaseOrders.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
            else
                purchaseOrders = purchaseOrders.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
        }

        if (fieldName == 'salePrice') {
            if (this.counter % 2 == 1)
                purchaseOrders = purchaseOrders.sort((a, b) => a.salePrice - b.salePrice);
            else
                purchaseOrders = purchaseOrders.sort((a, b) => b.salePrice - a.salePrice);
        }



    }

    // Method to get employee name by ID
    getEmployeeName(employeId: any): any {

        for (let employee of this.employees) {
            if (employee.id == employeId) {
                return employee.firstName + " " + employee.lastName;
            }
        }
        return "XX" + " " + "XX";
    }

    // Method to get user name by ID
    getUserName(userId: any): any {

        for (let user of this.users) {
            if (user.id == userId) {
                return user.firstName + " " + user.lastName;
            }
        }
        return "XX" + " " + "XX";
    }

    // Method to get tax amount
    getTax(): number {
        var total: number = 0;
        for (let receipt of this.receipts) {
            total += (receipt.quantity * receipt.amount);
        }
        //(Math.round(2.782061 * 100) / 100).toFixed(2)
        return +(Math.round(total * this.company.taxRate)).toFixed(2);
    }

    // Method to get total amount
    getTotal(): number {
        return +(this.getSubtotal() + this.getTax()).toFixed(2);
    }

    // Method to get tax on payments
    getTaxPayments(): number {
        var total: number = 0;
        if (this.vehicle.payments && this.vehicle.payments.length > 0) {
            for (let payment of this.vehicle.payments) {
                total += payment.amount;
            }
            return +(Math.round(total * this.company.taxRate)).toFixed(2);
        } else {
            return total;
        }
    }

    // Method to get total payment with tax
    getTotalPaymentWithTax(): number {
        return +(this.getTaxPayments() + this.getTotalPayments()).toFixed(2);
    }

    // Method to handle dropped autoparts
    droppedAutoprts(event: CdkDragDrop<string[]>) {
        moveItemInArray(
            this.autopartsSearch,
            event.previousIndex,
            event.currentIndex
        );

        var sequenceCarriers: SequenceCarrier[] = new Array();
        for (let i = 0; i < this.autopartsSearch.length; i++) {
            let sequenceCarrier = new SequenceCarrier();
            sequenceCarrier.id = this.autopartsSearch[i].id;
            sequenceCarrier.index = i;
            sequenceCarriers.push(sequenceCarrier);
        }

        this.autopartService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
            next: result => {

                if (result) {
                    this.autopartsSearch = result;
                    this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                }
            }
        })
    }

    // Method to handle autopart vendor change
    onChangeAutopartVentor($event: any, autopart: any): void {

        autopart.vendorId = $event.target.value;
        console.log(autopart.purchaseStatus);
        autopart.reason = "ventor " + this.getVendorName(autopart.vendorId);
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

    getVendorName(vendorId: any): any {
        for (let vendor of this.vendors) {
            if (vendor.id == vendorId) {
                return vendor.name;
            }
        }
    }

    // Method to delete autopart
    deleteAutopart(autoPart: AutoPart, index: any): void {
        //console.log(event.target);

        console.log("deleteAutopart");
        this.autopartService.deleteWithUserId(autoPart.id, this.user.id).subscribe({
            next: data => {
                console.log(" " + data);
                if (this.autopartsSearch.length > 0) {
                    for (let i = 0; i < this.autopartsSearch.length; i++) {
                        if (autoPart.id == this.autopartsSearch[i].id) {
                            this.autopartsSearch.splice(i, 1);
                        }
                    }
                }
                this.getAllVehicleClaims(this.vehicle.id);
                //this.getAutopartForVehicle(this.vehicle.id, true);
            },

            error: (e) => {
                console.log("deleteAutopart error");
                this.message = e.error.message;
                console.error(e);
            }

        });
    }

    // Method to handle file selection for payments
    onSelectFileEditorPayments(event: any): void {
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

                    let imageModel: ImageModel = new ImageModel();
                    this.message1 = '';
                    imageModel.picByte = e.target.result;

                    this.uploadImageWithFilePayments(this.payment.id, imageModel);

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

    // Method to handle dropped items
    dropped(event: any): void {
        console.log('Item dropped:', event);
        if (event.previousIndex !== event.currentIndex) {
            let job = this.jobs[event.previousIndex];
            job.sequence = event.currentIndex + 1;
            this.jobService.updateSeqence(this.vehicle.id, []).subscribe({
                next: (data: any) => {
                    console.log('Job sequence updated:', data);
                    this.jobs = this.jobs.sort((a, b) => a.sequence - b.sequence);
                },
                error: (err: any) => {
                    console.error('Error updating job sequence:', err);
                }
            });
        }
    }

    // Method to handle employee change for claim
    onChangeEmployee2Claim(event: any, employeeId: any, job: any, claim: any): void {
        job.employeeId = employeeId;
        job.reason = "assign";

        for (let employee of this.employees) {
            if (employee.id == employeeId) {
                if (employee.commissionBased == false) {
                    if (job.claimId > 0) {
                        job.price = +((claim.quantity * claim.amount * employee.rolePrecentage / 100).toFixed(0));
                    } else {
                        job.price = +((this.getVehicleRemaining(this.vehicle) * employee.rolePrecentage / 100).toFixed(0));
                    }
                } else {
                    // commission based
                    job.price = +((this.getTotalSupplements(this.vehicle) * employee.rolePrecentage / 100).toFixed(0));
                }
            }
        }

        console.log("onChangeEmployee2Claim");
        this.jobService.createJob(this.currentUser.id, job).subscribe({
            next: result => {
                this.job = result;
                console.log(this.job);
                for (let jobItem of this.jobs) {
                    if (jobItem.id == this.job.id)
                        jobItem = this.job;
                }
                this.getVehicleJobs2(this.vehicle.id);
                this.findAllCurrentEmplyeeJobs();

                if (this.currentEmplyeeId == employeeId) {
                    // this.getMyJobs(employeeId); // TODO: Implement this method
                }

                // this.syncJob(this.job); // TODO: Implement this method
            }
        });
    }

    // Method to delete image job
    deleteImageJob(jobId: any, imageId: any): void {
        console.log('Deleting image job - Job ID:', jobId, 'Image ID:', imageId);
        // TODO: Implement logic to delete image job
    }

    getVehicleHistory(vehicleId: any): void {
        console.log("getVehicleHistory");
        //this.showVehicleHistory = !this.showVehicleHistory;
        // if (this.showVehicleHistory == true)

        this.vehicleHistoryService.getVehicleHistory(vehicleId).subscribe({
            next: result => {
                //console.log(result);
                this.vehicleHistories = result;
                this.vehicleHistories = this.vehicleHistories.sort((a, b) => b.id - a.id);
                var objectStrings = "receipt payment supplement claim autopart";
                for (let history of this.vehicleHistories) {

                    history.objectContextType = 0;
                    //if (myString.startsWith('Hello')) {
                    // Do something
                    //}

                    history.objectString = "";
                    if (history.type == 0) {
                        history.typeString = "add";
                        history.iconClassString = "fa fa-plus";
                        history.colorClassString = "text-success"
                    }
                    if (history.type == 1) {
                        history.typeString = "update"
                        history.iconClassString = "fa fa-save";
                        history.colorClassString = "text-primary"

                    };
                    if (history.type == 2) {
                        history.typeString = "remove";
                        history.iconClassString = "fa fa-trash";
                        history.colorClassString = "text-danger"
                    }

                    if (objectStrings.includes(history.objectName.toLowerCase()) &&
                        !(history.name.toLowerCase().includes("calender") &&
                            !(history.name.toLowerCase().includes("image"))
                            && history.objectKey > 0)) {
                        history.value = '$' + history.value;
                    }

                    if (history.name.toLowerCase() == "vehicle status") {
                        for (let status of this.statuss) {
                            if (history.value == status.id) {
                                history.value = "[" + status.name + "]";
                            }
                        }
                    }

                    if (history.name.toLowerCase() == "vehicle assigned To") {
                        for (let employee of this.employees) {
                            if (history.value == employee.id) {
                                history.value = "[" + employee.firstName + " " + employee.lastName + "]";
                            }
                        }
                    }

                    if (history.name.toLowerCase() == "vehicle key location") {
                        for (let location of this.keyLocations) {
                            if (history.value == location.id) {
                                history.value = "[" + location.name + "]";
                            }
                        }
                    }

                    if (history.name.toLowerCase() == "vehicle location") {
                        for (let location of this.locations) {
                            if (history.value == location.id) {
                                history.value = "[" + location.name + "]";
                            }
                        }
                    }

                    if (history.name.toLowerCase() == "vehicle job request type") {
                        for (let jobRequestType of this.jobRequestTypes) {
                            if (history.value == jobRequestType.id) {
                                history.value = "[" + jobRequestType.name + "]";
                            }
                        }
                    }

                    if (history.name.toLowerCase() == "autopart image"
                        || history.name.toLowerCase() == "autopart image employee") {
                        history.value = ""
                        history.objectContextType = 2;
                    }

                    if (history.name.toLowerCase() == "job image employee" || history.name.toLowerCase() == "job image") {
                        history.value = ""
                        history.objectContextType = 3;
                    }

                    if (history.name.toLowerCase() == "payment image") {
                        history.value = ""
                        history.objectContextType = 5;
                    }


                    if (history.name.toLowerCase() == "note") {
                        //history.value = ""
                        history.objectContextType = 4;
                    }


                    if (history.name.toLowerCase() == "vehicle image") {
                        history.value = ""
                        history.objectContextType = 1;
                    }


                    if (history.name.toLowerCase() == "vehicle image doc type") {
                        history.objectContextType = 1;
                        for (let docType of this.docTypes) {
                            if (history.value == docType.id) {
                                history.value = "[" + docType.name + "]";
                            }
                        }


                    }


                    // if (history.name?.toLowerCase().startsWith("receipt") && history.objectKey > 0) {
                    //   for (let receipt of this.receipts) {
                    //     if (receipt.id == history.objectKey) {
                    //       history.objectString = receipt.name + " $" + receipt.amount;
                    //     }
                    //   }
                    // }

                    // if (history.name?.toLowerCase().startsWith("payment") && history.objectKey > 0) {
                    //   for (let payment of this.payments) {
                    //     if (payment.id == history.objectKey) {
                    //       history.objectString = payment.name + " $" + payment.amount;
                    //     }
                    //   }
                    // }

                    // if (history.name?.toLowerCase().startsWith("payment") && history.objectKey > 0) {
                    //   for (let payment of this.payments) {
                    //     if (payment.id == history.objectKey) {
                    //       history.objectString = payment.name + " $" + payment.amount;
                    //     }
                    //   }
                    // }


                    // if (history.name?.toLowerCase().startsWith("claim") && history.objectKey > 0) {
                    //   for (let claim of this.claims) {
                    //     if (claim.id == history.objectKey) {
                    //       history.objectString = claim.name + " $" + claim.amount;
                    //     }
                    //   }
                    // }

                    // if (history.name?.toLowerCase().startsWith("job") && history.objectKey > 0) {
                    //   for (let job of this.jobs) {
                    //     if (job.id == history.objectKey) {
                    //       history.objectString = job.name + " " + job.notes;
                    //     }
                    //   }
                    // }

                    // if (history.name?.toLowerCase().startsWith("supplement") && history.objectKey > 0) {
                    //   for (let supplement of this.vehicle.supplements) {
                    //     if (supplement.id == history.objectKey) {
                    //       history.objectString = supplement.notes + " $" + supplement.amount;
                    //     }
                    //   }
                    // }
                    //safeguard a bit
                    var hasIt: boolean = false;
                    for (let user of this.users) {
                        if (history.userId == user.id) {
                            history.userName = user.firstName + " " + user.lastName;
                            hasIt = true;
                        }
                    }
                    if (!hasIt) {
                        history.userName = "Xx" + " " + "Xx";
                    }
                }
            }
        })

    }

    // Method to get subtotal amount
    getSubtotal(): number {
        var total: number = 0;
        if (this.receipts.length > 0) {
            for (let receipt of this.receipts) {
                total += (receipt.quantity * receipt.amount);
            }

            return +(total.toFixed(2));
        } else {
            return total;
        }
    }

    // Method to edit purchase order 
    editPurchaseOrder(purchaseOrder: any, index: number): void {
        this.cindexPurchaseOrder = index;
        this.selectedPurchaseOrder = purchaseOrder;
        this.errorMessagePurchaseOrder = "";
        if (this.selectedPurchaseOrder.claimId > 0) {
            for (let claim of this.claims) {
                if (claim.id == this.selectedPurchaseOrder.claimId) {
                    this.claim = claim;
                }
            }
        }
        // No modal manipulation - inline editing only
    }

    // Method to add new purchase order inline
    addNewPurchaseOrder(event?: Event): void {
        // Prevent any Bootstrap modal events from being triggered
        event?.preventDefault();
        event?.stopPropagation();

        console.log('=== Adding new purchase order inline - no modal interaction ===');

        const newPurchaseOrder = {
            id: 0,
            title: '',
            partNumber: '',
            description: '',
            vendorId: 0,
            status: 0,
            purchaseStatus: 0,
            grade: undefined,
            salePrice: 0,
            userId: this.user.id,
            createdAt: new Date(),
            vehicleId: this.vehicle.id,
            companyId: this.vehicle.companyId,
            reason: "new",
            sequenceNumber: -1,
            autoparts: [],
        };

        this.purchseOrderVehicleService.createPurchaseOrderVehicle(this.user.id, newPurchaseOrder).subscribe({
            next: (res: any) => {
                console.log('Purchase order created:', res);
                this.selectedPurchaseOrder = res;

                // Find the index for the new purchase order
                this.cindexPurchaseOrder = 0; // Set to first item since it's sorted by ID desc

                // Refresh the purchase orders list
                this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);

                console.log('=== Purchase order added successfully - editVehicle modal should remain open ===');
            },
            error: (error) => {
                console.error('Error creating purchase order:', error);
            }
        });
    }
    editModeVehicle: boolean = true;

    special(vehicle: Vehicle): void {

        vehicle.reason = "special";
        vehicle.special = !vehicle.special;
        this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
            next: result => {
                console.log(result);
                this.vehicle = result;
                this.vehicle.reason = "";
            }
        })
    }
    successMessage: string = "";

    successMessageVehicle: string = "";
    errorMessageVehicle: string = "";
    step: number = 0;

    setStep(step: number): void {
        this.step = step;
    }

    refresh(): void {
        // this.step = 0;
    }

    setImageForSearch2(vehicleId: any, imageId: any) {


        console.log("setImageForSearch2");

        this.vehicleService.setImageForSearch(imageId, vehicleId).subscribe({
            next: (result) => {
                console.log(result);
                this.vehicleService.get(vehicleId).subscribe({
                    next: (result => {
                        console.log(result);
                        this.vehicle = result;
                        this.vehicle.imageModels = this.vehicle.imageModels.sort((a: any, b: any) => a.sequenceNumber - b.sequenceNumber);
                        this.selectedImage2 = this.vehicle.showInSearchImageId;
                        for (let vehicle of this.vehicles) {
                            if (vehicle.id == this.vehicle.id) {
                                vehicle.showInSearchImageId = imageId;
                            }
                        }
                    })
                });
            }
        });
    }

    openVehicleUrl(url: string) {
        window.open(location.origin + "/#/vehicle/" + url, "_blank");
    }

    searchVin2(): void {

        this.autopartService.getVin(this.vehicle.vin).subscribe({
            next: (res) => {
                console.log(res);
                this.autopart = res;
                // this.vehicle.year = this.autopart.year;
                // this.vehicle.make = this.autopart.make;
                //  this.vehicle.model = this.autopart.model;
                this.vehicle.description2 = this.autopart.year + " " + this.autopart.make + " " + this.autopart.model + ", " + this.autopart.description;

            },
            error: (e) => console.error(e)
        });
    }

    droppedVehicleImage(event: CdkDragDrop<string[]>) {
        moveItemInArray(
            this.vehicle.imageModels,
            event.previousIndex,
            event.currentIndex
        );

        var sequenceCarriers: SequenceCarrier[] = new Array();
        for (let i = 0; i < this.vehicle.imageModels.length; i++) {
            let sequenceCarrier = new SequenceCarrier();
            sequenceCarrier.id = this.vehicle.imageModels[i].id;
            this.vehicle.imageModels[i].sequenceNumber = i;

            sequenceCarrier.index = i;
            sequenceCarriers.push(sequenceCarrier);
        }

        //this.vehicle.imageModels = this.vehicle.imageModels.sort((a: { sequenceNumber: number; }, b: { sequenceNumber: number; }) => a.sequenceNumber - b.sequenceNumber);

        this.vehicleService.updateImageVehicleSeqence(this.vehicle.id, sequenceCarriers).subscribe({
            next: result => {

                if (result) {
                    this.vehicle.imageModels = this.vehicle.imageModels.sort((a: any, b: any) => a.sequenceNumber - b.sequenceNumber);

                }
            }
        })


    }

    unArchive(vehicle: Vehicle): void {
        console.log("unArchive");
        if (vehicle.archived == true) {
            vehicle.archived = false;
            vehicle.reason = "unarchive";
        }
        this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({

            next: result => {
                //console.log("" + result);
                this.vehicle = result;
                this.vehicle.reason = "";
            }
        })
    }

    archiveVehicle(vehicle: Vehicle): void {
        this.displayStyle = "block";

        console.log("archiveVehicle");

        this.vehicle = vehicle;

        // const customTitle = 'Confirmation';
        // const message = 'Are you sure to archive it ?';

        // // Call the service to show the confirmation dialog and pass the callback
        // this.confirmationService.confirm(message, customTitle, (confirmed: boolean) => {
        //   if (confirmed) {
        //     this.vehicle.archived = true;
        //     this.vehicle.reason = "archive";
        //     this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
        //       next: result => {
        //         console.log("archiveVehicle", result);
        //         this.vehicle = result;
        //         this.vehicle.reason = "";
        //         this.searchVehicle(5, 0, this.pageSize);
        //       }
        //     })

        //   } else {
        //      return;
        //   }
        // });



        // if (window.confirm('Are you sure you want to archive this vehicle')) {

        //   this.vehicle.archived = true;
        //   this.vehicle.reason = "archive";
        //   this.vehicleService.createAndUpdateVehicle(this.currentUser.id, this.vehicle).subscribe({
        //     next: result => {
        //       console.log("archiveVehicle", result);
        //       this.vehicle = result;
        //       this.vehicle.reason = "";
        //       this.searchVehicle(5);
        //     }
        //   })
        // }


    }

    createVehicle(vehicle: Vehicle): void {

        this.errorMessage = "";
        this.successMessage = "";
        this.successMessageVehicle = "";
        this.errorMessageVehicle = "";
        console.log("createVehicle");
        var isNewVehicle: boolean = false;

        console.log("createVehicle");

        if (this.vehicle.year == null
            || this.vehicle.year == 0
            || this.vehicle.make == null
            || this.vehicle.make == ""
            || this.vehicle.model == null
            || this.vehicle.model == ""
            || this.vehicle.color == null
            || this.vehicle.color == ""
            || this.vehicle.workRequest == null
            || this.vehicle.workRequest == ""
            || this.vehicle.price == null
            || this.vehicle.price == 0
            || this.vehicle.jobRequestType == null
            || this.vehicle.jobRequestType == 0) {

            this.successMessageVehicle = "";
            this.errorMessageVehicle = "Please fill the vehicle form, Year/Make/Model/Color/Work Request/Price/Job Request Type are required";
            return;
        }

        if (this.vehicle.priorDamage != null && this.vehicle.priorDamage != '' && this.vehicle.priorDamage.length > 2000) {
            this.errorMessageVehicle = "Prior Damages are too long";
            return;
        }

        if (this.vehicle.comments != null && this.vehicle.comments != '' && this.vehicle.comments.length > 2000) {
            this.errorMessageVehicle = "Comments are too long";
            return;
        }


        if (this.vehicle.customer.firstName == null
            || this.vehicle.customer.firstName == ""
            || this.vehicle.customer.lastName == null
            || this.vehicle.customer.lastName == ""
            || this.vehicle.customer.phone == null
            || this.vehicle.customer.phone == ""
            || this.vehicle.customer.street == null
            || this.vehicle.customer.street == ""
            || this.vehicle.customer.city == null
            || this.vehicle.customer.city == ""
            || this.vehicle.customer.state == null
            || this.vehicle.customer.state == ""
            || this.vehicle.customer.zip == null
            || this.vehicle.customer.zip == "") {
            this.errorMessage = "Please fill the form";
            //alert(this.errorMessage);
            // if (window.confirm('Please fill the form')) 

            return;


        } else {


            if (vehicle.id == 0) {
                isNewVehicle = true;
                vehicle.reason = "new";
            } else {
                vehicle.reason = "update";
            }


            vehicle.companyId = this.user.companyId;
            vehicle.customer.companyId = this.user.companyId;

            this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({

                next: async result => {

                    console.log(result);

                    this.vehicle = result;

                    this.successMessageVehicle = "Successfully updated";
                }
            });

        }
    }

    // Method to update purchase order inline
    updatePurchaseOrder(purchaseOrder: any): void {
        // Here you would typically call your API to save the purchase order
        console.log('Updating purchase order:', purchaseOrder);
        // Add your API call here
        // this.purchaseOrderService.updatePurchaseOrder(purchaseOrder).subscribe(...)
    }

    // Method to delete purchase order inline
    deletePurchaseOrderInline(purchaseOrder: any, index: number): void {
        // Use NestedConfirmationService which has higher z-index (3000+)
        if (purchaseOrder.claimId > 0) {
            const customTitle = 'Remove Purchase Order [' + purchaseOrder.title + "]";
            const message = 'Are you sure to remove this from Estimate [' + purchaseOrder.claimId + '] that may have [' + purchaseOrder.autoparts.length + '] parts ?';
            const buttonType = "yesNoCancel";

            this.nestedConfirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed == undefined) {
                    return;
                } else if (confirmed) {
                    this.purchseOrderVehicleService.deletePurchaseOrderVehicleWithOption(purchaseOrder.id, this.user.id, 1).subscribe({
                        next: data => {
                            console.log(" " + data);
                            this.getAllVehicleClaims(this.vehicle.id);
                            this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
                        },
                        error: (e) => {
                            console.log("deletePurchaseOrder error");
                            this.message = e.error.message;
                            console.error(e);
                        }
                    });
                }
            });
        } else {
            const customTitle = 'Remove Purchase Order [' + purchaseOrder.title + "]";
            const message = 'Are you sure to remove it ?';
            const buttonType = "yesNoCancel";

            this.nestedConfirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed == undefined) {
                    return;
                } else if (confirmed) {
                    this.purchseOrderVehicleService.deletePurchaseOrderVehicle(purchaseOrder.id, this.user.id).subscribe({
                        next: data => {
                            console.log(" " + data);
                            this.getAllVehicleClaims(this.vehicle.id);
                            this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
                        },
                        error: (e) => {
                            console.log("deletePurchaseOrder error");
                            this.message = e.error.message;
                            console.error(e);
                        }
                    });
                }
            });
        }
    }





    /**
     * Ensure the editVehicle modal stays visible and properly positioned
     */
    private ensureEditVehicleModalVisible(): void {
        try {
            const editVehicleModal = document.getElementById('editVehicle');
            if (editVehicleModal) {
                console.log('=== Ensuring editVehicle modal is visible ===');
                console.log('Current editVehicle state:', {
                    display: editVehicleModal.style.display,
                    classes: editVehicleModal.className,
                    ariaHidden: editVehicleModal.getAttribute('aria-hidden')
                });

                // Use minimal delay for better performance
                setTimeout(() => {
                    // Restore the editVehicle modal visibility and accessibility
                    editVehicleModal.style.display = 'block';
                    editVehicleModal.classList.add('show');
                    editVehicleModal.removeAttribute('aria-hidden');
                    editVehicleModal.style.zIndex = '1055'; // Reset to original z-index

                    // Force focus back to the editVehicle modal
                    editVehicleModal.focus();

                    // Ensure the original Bootstrap backdrop is present for editVehicle modal
                    let existingBackdrop = document.querySelector('.modal-backdrop');
                    if (!existingBackdrop) {
                        const originalBackdrop = document.createElement('div');
                        originalBackdrop.className = 'modal-backdrop fade show';
                        originalBackdrop.style.zIndex = '1054';
                        document.body.appendChild(originalBackdrop);
                        existingBackdrop = originalBackdrop;
                    }

                    // Ensure backdrop has correct z-index and is visible
                    if (existingBackdrop) {
                        (existingBackdrop as HTMLElement).style.zIndex = '1054';
                        existingBackdrop.classList.add('show');
                    }

                    // Keep modal-open class since editVehicle modal is still open
                    document.body.classList.add('modal-open');

                    // Trigger Bootstrap modal show event to ensure proper state
                    const bootstrap = (window as any).bootstrap;
                    if (bootstrap && bootstrap.Modal) {
                        const modalInstance = bootstrap.Modal.getInstance(editVehicleModal);
                        if (modalInstance) {
                            // Ensure the modal instance knows it's shown
                            modalInstance._isShown = true;
                        }
                    }

                    console.log('editVehicle modal visibility restored');
                }, 10); // Reduced from 50ms to 10ms for better performance
            } else {
                console.error('editVehicle modal element not found!');
            }
        } catch (error) {
            console.error('Error in ensureEditVehicleModalVisible:', error);
        }
    }

    // Method to handle purchase order purchase status change
    onChangePurchaseOrderPurchaseStatus(event: any, purchaseOrder: any): void {
        purchaseOrder.purchaseStatus = event.target.value;
        console.log(purchaseOrder.purchaseStatus);
        if (purchaseOrder.purchaseStatus == 0) {
            purchaseOrder.reason = "no status";
        } else if (purchaseOrder.purchaseStatus == 1) {
            purchaseOrder.reason = "ordered";
            purchaseOrder.orderedAt = new Date();
        } else if (purchaseOrder.purchaseStatus == 2) {
            purchaseOrder.reason = "received";
            purchaseOrder.receivedAt = new Date();
        } else if (purchaseOrder.purchaseStatus == 3) {
            purchaseOrder.reason = "returned";
            purchaseOrder.returnedAt = new Date();
        }

        console.log(purchaseOrder.reason);

        this.purchseOrderVehicleService.createPurchaseOrderVehicle(this.user.id, purchaseOrder).subscribe({
            next: result => {
                console.log(result);
                if (result) {
                    purchaseOrder = result;
                    for (let i = 0; i < this.purchaseOrders.length; i++) {
                        if (this.purchaseOrders[i].id == purchaseOrder.id) {
                            this.purchaseOrders[i] = purchaseOrder;
                        }
                    }
                }
            }
        });
    }

    // Method to get receipt subtotal
    getReceiptSubTotal(receipt: any): number {
        return +((receipt.quantity * receipt.amount).toFixed(2));
    }

    getAllVehicleReceipt(vehicleId: any): void {
        // console.log("getAllVehicleReceipt")
        this.receiptService.getAllVehicleReceipts(vehicleId).subscribe({
            next: result => {
                if (result) {
                    this.receipts = result;
                    this.receipts = this.receipts.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                    // console.log(this.receipts);
                } else {
                    this.receipts = new Array();
                }
            }
        })
    }

    // Method to delete vehicle receipt
    deleteVehicleReceipt(event: any, receipt: any): void {
        console.log("deleteVehicleReceipt" + receipt.id);

        if (receipt.claimId > 0) {
            var message = "";
            const customTitle = 'Remove Receipt [' + receipt.notes + "]";
            message = "Remove estimate [" + receipt.claimId + "] at the same time ?";
            const buttonType = "yesNoCancel";

            this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed == undefined) {
                    console.log("cancelled");
                    return;
                }
                else if (confirmed) {
                    this.receiptService.deleteReceiptWithOptionWithUserId(this.user.id, receipt.id).subscribe({
                        next: (result: any) => {
                            console.log(result);
                            this.getAllVehicleReceipt(this.vehicle.id);
                            this.getAllVehicleClaims(this.vehicle.id);
                        }
                    });
                } else {
                    this.receiptService.deleteReceipt(receipt.id).subscribe({
                        next: (result: any) => {
                            console.log(result);
                            this.getAllVehicleReceipt(this.vehicle.id);
                        }
                    });
                }
            });
        } else {
            this.receiptService.deleteReceipt(receipt.id).subscribe({
                next: (result: any) => {
                    console.log(result);
                    this.getAllVehicleReceipt(this.vehicle.id);
                }
            });
        }
    }

    // Method to handle receipt entry
    onEnterReceipt(action: string, receipt: any): void {
        receipt.reason = action;
        this.receiptService.createReceipt(this.currentUser.id, receipt).subscribe({
            next: (result: any) => {
                if (result) {
                    this.receipt = result;
                    if (this.receipt.claimId > 0) {
                        this.getAllVehicleClaims(this.vehicle.id);
                    }
                }
            }
        });
    }

    // Method to set receipt ID
    setReceiptId(receiptId: any): void {
        this.currentReceiptId = receiptId;
        console.log(this.currentReceiptId);
    }

    // Method to open tab
    openTab(tabName: string): void {
        const element = <HTMLInputElement>document.querySelector("[id='" + tabName + "']");
        if (element)
            element.click();
    }

    // Method to handle warranty change
    OnChangeWarranty(event: any): void {
        var warrantyId = event.target.value;
        this.warrantyText = "";
        for (let warranty of this.warranties) {
            if (warranty.id == warrantyId) {
                this.warrantyText = warranty.text;
            }
        }
    }

    // Method to create receipt
    createReceipt(): void {
        let receipt: any = {};
        receipt.name = "change Me";
        receipt.userId = this.user.id;
        receipt.quantity = 1;
        receipt.vehicleId = this.vehicle.id;
        receipt.notes = "";
        receipt.invoiceNumber = this.randomString();

        this.receiptService.createReceipt(this.user.id, receipt).subscribe({
            next: (result: any) => {
                if (result) {
                    console.log(result);
                    this.getAllVehicleReceipt(this.vehicle.id);
                }
            }
        });
    }

    // Method to handle dropped receipt
    droppedReceipt(event: any): void {
        moveItemInArray(
            this.receipts,
            event.previousIndex,
            event.currentIndex
        );

        var sequenceCarriers: any[] = new Array();
        for (let i = 0; i < this.receipts.length; i++) {
            let sequenceCarrier: any = {};
            sequenceCarrier.id = this.receipts[i].id;
            sequenceCarrier.index = i;
            sequenceCarriers.push(sequenceCarrier);
        }

        this.receiptService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
            next: (result: any) => {
                if (result) {
                    this.receipts = result;
                    this.receipts = this.receipts.sort((a: any, b: any) => a.sequenceNumber - b.sequenceNumber);
                }
            }
        });
    }

    // Method to get vehicle total costs
    getVehicleTotalCosts(vehicle: any, jobs: any): number {
        var total = 0;
        var totalCostsParts = this.getTotalPartCosts(vehicle.id);
        var totalCostJobs = this.getTotalJobPrice(jobs);
        var totalTax = this.getSaleTax(vehicle);
        var totalCostManagement = this.getVehicleCostManagement(vehicle);
        return totalCostsParts + totalCostJobs + totalTax + totalCostManagement;
    }

    // Method to get vehicle gross
    getVehicleGross(vehicle: any, jobs: any): number {
        var total = 0;
        var totalEstimate = this.getVehicleTotalEstimates(vehicle);
        total = totalEstimate - this.getVehicleTotalCosts(vehicle, jobs);
        return total;
    }

    // Method to handle disclaimer change
    onChangeDisclaimer(event: any): void {
        var disclaimerId = event.target.value;
        this.disclaimerText = "";
        for (let disclaimer of this.disclaimers) {
            if (disclaimer.id == disclaimerId) {
                this.disclaimerText = disclaimer.text;
            }
        }
    }

    // Method to filter jobs
    filterJobs(employee: any): any[] {
        var vehicles: any[] = new Array();
        var jobs: any[] = new Array();

        if (employee?.jobs == null) {
            jobs = new Array();
        } else {
            jobs = employee?.jobs;
        }

        const jobMap: { [key: number]: any[] } = {};

        // Group jobs by vehicleId
        jobs.forEach((job: any) => {
            if (!jobMap[job.vehicleId]) {
                jobMap[job.vehicleId] = [];
            }
            jobMap[job.vehicleId].push(job);
        });

        // Assign jobs to corresponding vehicles
        this.vehicles.forEach((vehicle: any) => {
            if (jobMap[vehicle.id]) {
                vehicle.jobs2 = jobMap[vehicle.id];
                vehicle.jobs = vehicle.jobs;
                vehicles.push(vehicle);
            }
        });

        return vehicles;
    }

    // Method to get job status count
    getJobStatusCount(vehicle: any, jobs: any): number {
        vehicle.jobsDone = false;
        var counts = 0;
        for (let job of jobs) {
            if (job.status == 1)
                counts++;
        }
        if (jobs.length > 0 && counts == jobs.length) {
            vehicle.jobsDone = true;
        }
        return counts;
    }

    // Method to change paid status
    changePaidStatus(vehicle: any, paid: boolean): void {
        console.log("changePaidStatus");
        vehicle.paid = paid;

        if (paid == true)
            vehicle.reason = "paid";
        else
            vehicle.reason = "unpaid";

        this.vehicleService.createAndUpdateVehicle(this.currentUser.id, vehicle).subscribe({
            next: result => {
                console.log("changePaidStatus", result);
                // Update the vehicle in the list
                const index = this.vehicles.findIndex(v => v.id === vehicle.id);
                if (index !== -1) {
                    this.vehicles[index] = result;
                    this.vehicles[index].reason = "";
                }
            }
        });
    }

    // Method to get job title
    getJobTitle(job: any): string {
        if (job.paidWeek > 0) {
            return "Job already paid on week [" + job.paidWeek + "]";
        }
        return 'Job Title';
    }

    // Method to get vehicle remaining
    getVehicleRemaining(vehicle: any): number {
        var total = 0;
        var totalEstimate = this.getVehicleTotalEstimates(vehicle);
        var totalCostsParts = this.getTotalPartCosts(vehicle.id);
        return (totalEstimate - totalCostsParts);
    }

    // Method to get sale tax
    getSaleTax(vehicle: any): number {
        var total = 0;
        total = (vehicle.price + this.getTotalSupplements(vehicle)) * this.company.taxRate;
        total = +(total.toFixed(0));
        return total;
    }

    // Method to get vehicle total estimates
    getVehicleTotalEstimates(vehicle: any): number {
        var total = 0;
        total = +vehicle.price + +(this.getTotalSupplements(vehicle));
        return total;
    }

    // Method to get total part costs
    getTotalPartCosts(vehicleId: any): number {
        var totalCosts = 0;

        for (let autopart of this.autopartsSearch) {
            if (autopart.vehicleId == vehicleId) {
                totalCosts += autopart.salePrice;
            }
        }
        return totalCosts;
    }

    // Method to get total job price
    getTotalJobPrice(jobs: any): number {
        var total = 0;
        for (let job of jobs) {
            total += job.price;
        }
        return total;
    }

    // Method to get vehicle cost management
    getVehicleCostManagement(vehicle: any): number {
        return +(this.getVehicleRemaining(vehicle) * this.company.managementRate).toFixed(0);
    }

    // Method to set image for search jobs
    setImageForSearchJobs(autopartId: any, imageId: any): void {
        console.log("setImageForSearchJobs");

        this.jobService.setImageForSearch(imageId, autopartId).subscribe({
            next: (result) => {
                console.log(result);
                if (this.job && this.job.imageModels) {
                    for (let i = 0; i < this.job.imageModels.length; i++) {
                        if (this.job.imageModels[i].id == imageId) {
                            this.job.showInSearchImageId = this.job.imageModels[i].id;
                        }
                    }
                }
            }
        });
    }

    // Method to navigate to different routes
    navigateTo(path: string): void {
        this.router.navigate(['/' + path], { skipLocationChange: false });
    }
    currentDate = new Date();
    // Method to get top image label
    getTopImageLabel(imageModel: any): string {
        if (imageModel.employeeId > 0) {
            return this.getEmployeeName(imageModel.employeeId);
        } else if (imageModel.userId > 0) {
            return this.getUserName(imageModel.userId);
        } else {
            return '';
        }
    }

    jobOrderTypes = [{
        "id": 1,
        "code": "R&I",
        "description": "Remove and inspect"
    },
    {
        "id": 2,
        "code": "Rpr",
        "description": "Repair"
    },
    {
        "id": 3,
        "code": "Repl",
        "description": "Replace"
    },
    {
        "id": 4,
        "code": "Blnd",
        "description": "Blend adjacent panel"
    },
    {
        "id": 5,
        "code": "Add",
        "description": "Add operation, e.g., add clear coat"
    },
    {
        "id": 6,
        "code": "Refn",
        "description": "Feather prime and block"
    },
    {
        "id": 7,
        "code": "R&R",
        "description": "Remove and reinstall"
    },
    {
        "id": 8,
        "code": "O/H",
        "description": "Overhaul (disassemble and reassemble)"
    },
    {
        "id": 9,
        "code": "Adj",
        "description": "Adjust component to proper alignment/function"
    },
    {
        "id": 10,
        "code": "Align",
        "description": "Wheel or suspension alignment"
    },
    {
        "id": 11,
        "code": "Cal",
        "description": "Calibrate electronic systems (e.g., ADAS)"
    },
    {
        "id": 12,
        "code": "SubL",
        "description": "Sublet repair (performed by third-party shop)"
    },
    {
        "id": 13,
        "code": "Dgn",
        "description": "Diagnostic scan (pre/post)"
    }
    ];

    getJobTypeCode(typeId: number): string {
        const jobOrderTypes = this.jobOrderTypes; // Your JobOrderType array
        const jobType = this.jobOrderTypes?.find(jot => jot.id === typeId);
        return jobType?.code || 'Repl';
    }


    showEmployees: boolean = false;

    getReceiptTotal(): any {
        var total = 0;
        for (let receipt of this.estimateResponse.receipts) {
            total += receipt.amount;
        }
        return total;
    }

    getSubtotalClaimsLocked(): number {
        var total: number = 0;
        if (this.claims.length > 0) {
            for (let claim of this.claims) {
                if (claim.status == 1)
                    total += (claim.quantity * claim.amount);
            }

            return +(total.toFixed(2));
        } else {
            return total;
        }

    }

    getTaxClaimLocked(): number {
        var total: number = 0;
        for (let claim of this.claims) {
            if (claim.status == 1)
                total += (claim.quantity * claim.amount);
        }
        //(Math.round(2.782061 * 100) / 100).toFixed(2)
        return +(Math.round(total * this.company.taxRate)).toFixed(2);
    }

    // Method to set image 2
    // setImage2(index: number): void {
    //   if (this.vehicle && this.vehicle.imageModels && this.vehicle.imageModels[index]) {
    //     this.selectedImage = this.vehicle.imageModels[index].id;
    //     this.imageModelSelected = this.vehicle.imageModels[index];
    //   }
    // }

    setImage2(index: any): void {
        this.selectedImage2 = this.vehicle.imageModels[index].id;
        this.imageModelSelected = this.vehicle.imageModels[index];
    }

    // Method to handle enter key events
    onEnter(type: string, data: any): void {
        console.log('Enter key pressed for type:', type, 'with data:', data);
        // TODO: Implement logic to handle enter key events
    }

    // Method to set job ID
    setJobId(jobId: any): void {
        this.currentJobId = jobId;

        console.log(this.currentJobId);
        if (this.vehicleJobsOnly == true) {
            this.fillCalendarVehicleJob();
        } else {
            // this.fillCalendarJob(); // TODO: Implement this method
        }
    }

    // Method to print page for job
    printPageJob(contentId: string, type: string, job: any): void {
        this.job = job;

        setTimeout(function () {

            const elementImage = <HTMLElement>document.querySelector("[id='" + contentId + "']");
            const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
            WindowPrt?.document.write('<title>' + type + '</title>');
            WindowPrt?.document.write("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css\" rel=\"stylesheet\">");
            WindowPrt?.document.write("<link href=\"../styles.css\" rel=\"stylesheet\">");
            WindowPrt?.document.write('<style type=\"text/css\">th{color: white;background: rgb(13, 173, 226);}</style>');
            WindowPrt?.document.write(elementImage.innerHTML);
            WindowPrt?.document.write('<script>onload = function() { window.print(); }</script>');
            WindowPrt?.document.close();
            WindowPrt?.focus();

        }, 100);
    }

    // Method to handle file selection for editor jobs
    onSelectFileEditorJobs(event: any, job: any): void {
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

    // Method to delete purchase order claim
    deletePurchaseOrderClaim(purchaseOrder: any, index: any, claim: any): void {
        if (purchaseOrder.autoparts.length > 0) {
            const message = "Remove [" + purchaseOrder.autoparts.length + "] part/parts at the same time?";

            // Call the service to show the confirmation dialog and pass the callback
            this.confirmPurchseOrderDeletion(purchaseOrder, index, claim);

        } else {
            const customTitle = 'Remove Purchase Order [' + purchaseOrder.title + "]";
            const message = 'Are you sure you want to remove this item?';
            const buttonType = "yesNo" //buttonType: 'yesNo' | 'okCancel' | 'okOnly' = 'yesNo';  // Button type

            // Call the service to show the confirmation dialog and pass the callback
            this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed) {
                    this.purchseOrderVehicleService.deletePurchaseOrderVehicleWithOption(purchaseOrder.id, this.user.id, 0).subscribe({
                        next: data => {
                            console.log(" " + data);

                            // Refresh data - using searchVehicle as equivalent to getAllVehicleClaims
                            this.searchVehicle(this.searchType, this.currantPageNumber, this.pageSize);
                        },

                        error: (e) => {
                            console.log("deletePurchaseOrder error");
                            this.message = e.error.message;
                            console.error(e);
                        }

                    });
                } else {
                    console.log('Item not deleted');
                }
            });
        }
    }

    // Method to set purchase order status
    setPurhaseOrderStatus(status: number): void {
        if (this.selectedPurchaseOrder.title == null || this.selectedPurchaseOrder.title == '') {
            this.errorMessagePurchaseOrder = "Parts Name is required";
            return;
        }

        if (this.selectedPurchaseOrder.description == null || this.selectedPurchaseOrder.description == '') {
            this.errorMessagePurchaseOrder = "Part Description is required";
            return;
        }

        if (this.selectedPurchaseOrder.grade == null || this.selectedPurchaseOrder.grade == '') {
            this.errorMessagePurchaseOrder = "Part Grade is required";
            return;
        }

        if (this.selectedPurchaseOrder.salePrice != null && this.selectedPurchaseOrder.salePrice == 0) {
            this.errorMessagePurchaseOrder = "Part Price is required";
            return;
        }

        if (this.selectedPurchaseOrder.title != null && this.selectedPurchaseOrder.title != '' && this.selectedPurchaseOrder.title.length > 255) {
            this.errorMessagePurchaseOrder = "Parts Name is too long";
            return;
        }

        if (this.selectedPurchaseOrder.description != null && this.selectedPurchaseOrder.description != '' && this.selectedPurchaseOrder.description.length > 500) {
            this.errorMessagePurchaseOrder = "Part Description is too long";
            return;
        }

        if (this.selectedPurchaseOrder.description != null && this.selectedPurchaseOrder.description != '' && this.selectedPurchaseOrder.description.length < 2) {
            this.errorMessagePurchaseOrder = "Part Description is too short";
            return;
        }

        if (this.selectedPurchaseOrder.partNumber != null && this.selectedPurchaseOrder.partNumber != '' && this.selectedPurchaseOrder.partNumber.length > 50) {
            this.errorMessagePurchaseOrder = "Parts Number is too long";
            return;
        }

        if (status == 0) {
            this.selectedPurchaseOrder.status = status;
            this.selectedPurchaseOrder.reason = "un-submit for approval";
            this.selectedPurchaseOrder.submittedAt = null;
            this.selectedPurchaseOrder.submittedBy = 0;
            this.errorMessagePurchaseOrder = "Un-Submitted Successfully";
        }

        if (status == 1) {
            this.selectedPurchaseOrder.status = status;
            this.selectedPurchaseOrder.reason = "submit for approval";
            this.selectedPurchaseOrder.submittedAt = new Date();
            this.selectedPurchaseOrder.submittedBy = this.currentEmplyeeId;
            this.errorMessagePurchaseOrder = "Submitted Successfully";
        }

        if (status == 2) {
            if (this.selectedPurchaseOrder.shipping == null || this.selectedPurchaseOrder.shipping == '') {
                this.errorMessagePurchaseOrder = "Please provide reject reason";
                return;
            } else {
                if (this.selectedPurchaseOrder.shipping != null && this.selectedPurchaseOrder.shipping != '' && this.selectedPurchaseOrder.shipping.length > 500) {
                    this.errorMessagePurchaseOrder = "Reject Reason is too long";
                    return;
                }

                if (this.selectedPurchaseOrder.shipping != null && this.selectedPurchaseOrder.shipping != '' && this.selectedPurchaseOrder.shipping.length < 2) {
                    this.errorMessagePurchaseOrder = "Reject reason is too short";
                    return;
                }

                this.selectedPurchaseOrder.status = status;
                this.selectedPurchaseOrder.reason = "rejected";
                this.selectedPurchaseOrder.rejectedAt = new Date();
                this.selectedPurchaseOrder.rejectedBy = this.currentEmplyeeId;
                this.errorMessagePurchaseOrder = "Rejected Successfully";
            }
        }

        if (status == 3) {
            this.selectedPurchaseOrder.status = status;
            this.selectedPurchaseOrder.reason = "approved";
            this.selectedPurchaseOrder.approvedAt = new Date();
            this.selectedPurchaseOrder.approvedBy = this.currentEmplyeeId;
            this.errorMessagePurchaseOrder = "Approved Successfully";
        }

        this.purchseOrderVehicleService.createPurchaseOrderVehicle(this.currentEmplyeeId, this.selectedPurchaseOrder).subscribe({
            next: (res: any) => {
                console.log(res);
                this.selectedPurchaseOrder = res;
                this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
            },
            error: (e: any) => console.error(e)
        });
    }

    getAllVehiclePurchaseOrderVehicles(vehicleId: any): void {
        this.purchseOrderVehicleService.getAllVehiclePurchaseOrderVehicles(vehicleId).subscribe({
            next: result => {
                if (result) {
                    this.purchaseOrders = result;
                    this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.id - a.id);
                } else {
                    this.purchaseOrders = new Array();
                }
            }
        });
    }

    // Method to add autopart to purchase order
    addAutopartToPurchaseOrder(claim: any, purchaseOrder: any): void {
        // Initialize new autopart
        this.selectedAutopart = {
            id: 0,
            title: purchaseOrder.title,
            stocknumber: this.randomString(),
            claimId: claim.id,
            purchaseOrderId: purchaseOrder.id,
            year: this.vehicle.year,
            make: this.vehicle.make,
            model: this.vehicle.model,
            description: purchaseOrder.description,
            partNumber: purchaseOrder.partNumber,
            grade: purchaseOrder.grade,
            shipping: "FLP",
            warranty: "30D",
            vendorId: purchaseOrder.vendorId,
            salePrice: purchaseOrder.salePrice,
            purchaseStatus: purchaseOrder.purchaseStatus,
            source: purchaseOrder.source,
            orderedAt: purchaseOrder.orderedAt,
            companyId: this.vehicle.companyId,
            status: 0,
            published: false,
            reason: "new",
            vehicleId: this.vehicle.id,
            sequenceNumber: -1,
            imageModels: new Array()
        };

        this.imageModels = new Array();
        this.imageUrl = null;
        this.message1 = "";
        this.errorMessage = "";

        // Create autopart
        this.autopartService.create(this.selectedAutopart).subscribe({
            next: (res: any) => {
                console.log(res);
                this.selectedAutopart = res;
                this.getAllVehicleClaims(this.vehicle.id);
                this.errorMessage = "Created Successfully";

                setTimeout(() => {
                    this.selectedAutopart = res;
                    this.editAutopart(this.selectedAutopart, 0);
                }, 2000);

                this.getAutopartForVehicle(this.vehicle.id, false);
            },
            error: (e: any) => console.error(e)
        });
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

    getAllVehicleClaims(vehicleId: any): void {
        // console.log("getAllVehicleReceipt")
        this.claimService.getAllVehicleClaims(vehicleId).subscribe({
            next: result => {
                if (result) {
                    this.claims = result;
                    this.claims = this.claims.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

                    for (let claim of this.claims) {
                        for (let itemType of this.itemTypes) {
                            if (itemType.id == claim.itemType) {
                                if (itemType.createJobOrder == true) {
                                    claim.createJobOrder = true;
                                }

                                if (itemType.createPurchaseOrder == true) {
                                    claim.createPurchaseOrder = true;
                                }
                            }
                        }
                    }
                    // console.log(this.receipts);
                } else {
                    this.claims = new Array();
                }
            }
        });
    }

    getAutopartForVehicle(vehicleId: any, refresh: boolean): void {
        if (refresh == true) {
            this.autopartsSearch = new Array();
            this.selectedAutopart = new AutoPart();
            this.selectedAutopart.showInSearchImageId = 0;
            this.selectedImage = 0;
        }

        this.autopartService.getAutopartForVehicle(vehicleId).subscribe({
            next: result => {
                console.log(result);
                this.autopartsSearch = result;
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                if (this.autopartsSearch.length > 0) {
                    if (refresh == true) {
                        this.selectedAutopart = this.autopartsSearch[0];
                        this.selectedImage = this.selectedAutopart.showInSearchImageId;
                    }
                }
            }
        });
    }

    // Method to handle dropped autoparts in purchase order
    droppedAutoprtsPurchaseOrder(event: CdkDragDrop<string[]>, purchaseOrder: any): void {
        moveItemInArray(
            purchaseOrder.autoparts,
            event.previousIndex,
            event.currentIndex
        );

        var sequenceCarriers: any[] = new Array();
        for (let i = 0; i < purchaseOrder.autoparts.length; i++) {
            let sequenceCarrier: any = {};
            sequenceCarrier.id = purchaseOrder.autoparts[i].id;
            sequenceCarrier.index = i;
            sequenceCarriers.push(sequenceCarrier);
        }

        this.autopartService.updateSeqencePurchaseOrder(purchaseOrder.id, sequenceCarriers).subscribe({
            next: (result: any) => {
                if (result) {
                    purchaseOrder.autoparts = result;
                    purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a.sequenceNumber - b.sequenceNumber);
                }
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

                    this.uploadAutopartImageWithFile(this.selectedAutopart.id, imageModel);

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


    DataURIToBlob(dataURI: string) {
        const splitDataURI = dataURI.split(',')
        const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
        const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

        const ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i)

        return new Blob([ia], { type: mimeString })
    }



    editAutopart(autoPart: AutoPart, index: any): void {
        this.cindex = index;
        this.cindexAutpartPurchaseOrder = index;
        this.selectedAutopart = autoPart;
        this.detailSelected = true;
        this.selectedImage = this.selectedAutopart.showInSearchImageId;

        if (autoPart.claimId > 0 && autoPart.purchaseOrderId > 0) {
            for (let claim of this.claims) {
                if (claim.id == autoPart.claimId) {
                    this.claim = claim;
                }
            }
        }

        //this.setAutopartViewCount(autoPart.id);

        // for (var i = 0; i < this.carListStringList.length; i++) {

        //   if (this.carListStringList[i].brand == this.selectedAutopart.make) {
        //     this.optionsModel = this.carListStringList[i].models;
        //   }

        // }
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

    private uploadAutopartImageWithFile(autopartId: any, imageModel: ImageModel) {


        console.log("uploadImageWithFile");

        const file = this.DataURIToBlob("" + imageModel.picByte);
        const formData = new FormData();
        formData.append('file', file, 'image.jpg')
        formData.append('autopartId', autopartId) //other param


        this.autopartService.uploadImageWithFileWithUserId(formData, autopartId, this.user.id).subscribe({
            next: (result) => {
                console.log(result);
                this.selectedAutopart.imageModels.push(result);
                if (this.selectedAutopart.imageModels.length == 1) {
                    this.selectedAutopart.showInSearchImageId = result.id;
                }

                //sync this.claims
                for (let i = 0; i < this.claims.length; i++) {
                    for (let j = 0; j < this.claims[i].purchaseOrders.length; j++) {
                        for (let k = 0; k < this.claims[i].purchaseOrders[j].autoparts.length; k++) {
                            if (this.claims[i].purchaseOrders[j].autoparts[k].id == this.selectedAutopart.id) {
                                this.claims[i].purchaseOrders[j].autoparts[k].showInSearchImageId = this.selectedAutopart.showInSearchImageId;
                            }
                        }
                    }
                }

                //sync this.claim
                for (let j = 0; j < this.claim.purchaseOrders.length; j++) {
                    for (let k = 0; k < this.claim.purchaseOrders[j].autoparts.length; k++) {
                        if (this.claim.purchaseOrders[j].autoparts[k].id == this.selectedAutopart.id) {
                            this.claim.purchaseOrders[j].autoparts[k].showInSearchImageId = this.selectedAutopart.showInSearchImageId;
                        }
                    }
                }
            }
        });


    }

    getAutopartDetailFromServer(autopartId: any): void {

        console.log(" autopart detail ");
        this.autopartService.get(autopartId).subscribe({

            next: res => {
                console.log(res);
                this.editAutopart(res, 0);
                // this.applyFilter2('2', false, 0, this.pageSize);

                // if (this.user.partMarketOnly == true)
                //   this.getAllFromUserSatistics2(this.user.id);
                // else
                //   this.getAllFromUserSatistics(this.user.companyId);
                // this.searchPartWithPage(0, this.pageSize, 0, false);
                this.detailSelected = true;
                // this.showSavedItems = true;
            },
            error: err => {
                console.log(err);
            }
        });

    }
    /**
     * Show the editPart modal ensuring it appears above other modals
     */
    showEditPartModal(): void {
        console.log('=== Opening editPart modal ===');
        this.modalStackManager.debugStack();
        this.modalStackManager.showModal('editPart');
        // Reduced delay for better performance
        setTimeout(() => this.modalStackManager.debugStack(), 10);
    }

    openSourceLink(url: any): void {

        window.open(url, '_blank', 'location=yes,height=1000,width=800,scrollbars=yes,status=yes');
    }



    savePurchaseOrder(): void {


        if (this.selectedPurchaseOrder.title == null || this.selectedPurchaseOrder.title == '') {
            this.errorMessagePurchaseOrder = "Parts Name is required";
            return;
        }

        if (this.selectedPurchaseOrder.description == null || this.selectedPurchaseOrder.description == '') {
            this.errorMessagePurchaseOrder = "Part Description is required";
            return;
        }


        if (this.selectedPurchaseOrder.grade == null || this.selectedPurchaseOrder.grade == '') {
            this.errorMessagePurchaseOrder = "Part Grade is required";
            return;
        }

        if (this.selectedPurchaseOrder.salePrice != null && this.selectedPurchaseOrder.salePrice == 0) {
            this.errorMessagePurchaseOrder = "Part Price is required";
            return;
        }


        if (this.selectedPurchaseOrder.title != null && this.selectedPurchaseOrder.title != '' && this.selectedPurchaseOrder.title.length > 255) {
            this.errorMessagePurchaseOrder = "Parts Name is too long";
            return;
        }

        if (this.selectedPurchaseOrder.description != null && this.selectedPurchaseOrder.description != '' && this.selectedPurchaseOrder.description.length > 500) {
            this.errorMessagePurchaseOrder = "Part Description is too long";
            return;
        }


        if (this.selectedPurchaseOrder.description != null && this.selectedPurchaseOrder.description != '' && this.selectedPurchaseOrder.description.length < 2) {
            this.errorMessagePurchaseOrder = "Part Description is too short";
            return;
        }


        if (this.selectedPurchaseOrder.partNumber != null && this.selectedPurchaseOrder.partNumber != '' && this.selectedPurchaseOrder.partNumber.length > 50) {
            this.errorMessagePurchaseOrder = "Parts Number is too long";
            return;
        }



        this.selectedPurchaseOrder.companyId = this.vehicle.companyId;

        this.selectedPurchaseOrder.published = false;

        if (this.selectedPurchaseOrder.id == 0) {
            this.selectedPurchaseOrder.status = 0;
            this.selectedPurchaseOrder.reason = "new";
            this.selectedPurchaseOrder.sequenceNumber = -1;
        } else {
            this.selectedPurchaseOrder.reason = "update";
        }

        this.selectedPurchaseOrder.vehicleId = this.vehicle.id;


        this.purchseOrderVehicleService.createPurchaseOrderVehicle(this.user.id, this.selectedPurchaseOrder).subscribe({
            next: (res) => {
                console.log(res);
                this.selectedPurchaseOrder = res;
                if (this.selectedPurchaseOrder.reason == "new")
                    this.errorMessagePurchaseOrder = "Created Successfully";
                else
                    this.errorMessagePurchaseOrder = "Updated Successfully";
                this.syncClaims(this.selectedPurchaseOrder);
                this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
            },
            error: (e) => console.error(e)
        });
        // } else {
        //   this.message1 = "Please choose a file";
        // }
    }

    /**
     * Close the editPart modal without affecting the parent editVehicle modal
     */
    closeEditPartModal(): void {
        console.log('=== Closing editPart modal ===');
        this.modalStackManager.debugStack();
        this.modalStackManager.hideModal('editPart');
        // Remove setTimeout delay for better performance
        this.modalStackManager.debugStack();
    }

    /**
     * Show the addNewPart modal ensuring it appears above other modals
     */
    showAddNewPartModal(): void {
        console.log('=== Opening addNewPart modal ===');
        this.modalStackManager.debugStack();
        this.modalStackManager.showModal('addNewPart');
        // Reduced delay for better performance
        setTimeout(() => this.modalStackManager.debugStack(), 10);
    }

    /**
     * Manually show the addNewPart modal and its backdrop
     */
    private manuallyShowAddNewPartModal(addNewPartModal: HTMLElement): void {
        try {
            addNewPartModal.classList.add('show');
            addNewPartModal.style.display = 'block';
            // Remove aria-hidden to fix accessibility warning
            addNewPartModal.removeAttribute('aria-hidden');

            // Add the modal backdrop if it doesn't exist
            if (!document.querySelector('.modal-backdrop')) {
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade show modal-level-2';
                document.body.appendChild(backdrop);
            }
        } catch (error) {
            console.error('Error in manuallyShowAddNewPartModal:', error);
        }
    }

    /**
     * Close the addNewPart modal without affecting the parent editVehicle modal
     */
    closeAddNewPartModal(): void {
        console.log('=== Closing addNewPart modal ===');
        this.modalStackManager.debugStack();
        this.modalStackManager.hideModal('addNewPart');
        // Remove setTimeout delay for better performance
        this.modalStackManager.debugStack();
    }

    /**
     * Manually hide the addNewPart modal and its backdrop
     */
    private manuallyHideAddNewPartModal(addNewPartModal: HTMLElement): void {
        try {
            addNewPartModal.classList.remove('show');
            addNewPartModal.style.display = 'none';
            // Restore aria-hidden when modal is hidden
            addNewPartModal.setAttribute('aria-hidden', 'true');

            // Remove the modal backdrop if it exists
            const backdrop = document.querySelector('.modal-backdrop.modal-level-2');
            if (backdrop) {
                backdrop.remove();
            }
        } catch (error) {
            console.error('Error in manuallyHideAddNewPartModal:', error);
        }
    }

    /**
     * Show the partDetails modal ensuring it appears above other modals
     */
    showPartDetailsModal(): void {
        console.log('=== Opening partDetails modal ===');
        this.modalStackManager.debugStack();
        this.modalStackManager.showModal('partDetails');
        // Reduced delay for better performance
        setTimeout(() => this.modalStackManager.debugStack(), 10);
    }

    /**
     * Manually show the partDetails modal and its backdrop
     */
    private manuallyShowPartDetailsModal(partDetailsModal: HTMLElement): void {
        try {
            partDetailsModal.classList.add('show');
            partDetailsModal.style.display = 'block';
            // Remove aria-hidden to fix accessibility warning
            partDetailsModal.removeAttribute('aria-hidden');

            // Add the modal backdrop if it doesn't exist
            if (!document.querySelector('.modal-backdrop')) {
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade show modal-level-2';
                document.body.appendChild(backdrop);
            }
        } catch (error) {
            console.error('Error in manuallyShowPartDetailsModal:', error);
        }
    }

    /**
     * Close the partDetails modal without affecting the parent editVehicle modal
     */
    closePartDetailsModal(): void {
        console.log('=== Closing partDetails modal ===');
        this.modalStackManager.debugStack();
        this.modalStackManager.hideModal('partDetails');
        // Remove setTimeout delay for better performance
        this.modalStackManager.debugStack();
    }

    /**
     * Manually hide the partDetails modal and its backdrop
     */
    private manuallyHidePartDetailsModal(partDetailsModal: HTMLElement): void {
        try {
            partDetailsModal.classList.remove('show');
            partDetailsModal.style.display = 'none';
            // Restore aria-hidden when modal is hidden
            partDetailsModal.setAttribute('aria-hidden', 'true');

            // Remove the modal backdrop if it exists
            const backdrop = document.querySelector('.modal-backdrop.modal-level-2');
            if (backdrop) {
                backdrop.remove();
            }
        } catch (error) {
            console.error('Error in manuallyHidePartDetailsModal:', error);
        }
    }

    /**
     * Manually show the editPart modal and its backdrop
     */
    private manuallyShowEditPartModal(editPartModal: HTMLElement): void {
        try {
            editPartModal.classList.add('show');
            editPartModal.style.display = 'block';
            // Remove aria-hidden to fix accessibility warning
            editPartModal.removeAttribute('aria-hidden');

            // Add the modal backdrop if it doesn't exist
            if (!document.querySelector('.modal-backdrop')) {
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade show modal-level-2';
                document.body.appendChild(backdrop);
            }
        } catch (error) {
            console.error('Error in manuallyShowEditPartModal:', error);
        }
    }

    /**
     * Manually hide the editPart modal and its backdrop
     */
    private manuallyHideEditPartModal(editPartModal: HTMLElement): void {
        try {
            editPartModal.classList.remove('show');
            editPartModal.style.display = 'none';
            // Restore aria-hidden when modal is hidden
            editPartModal.setAttribute('aria-hidden', 'true');

            // Remove the modal backdrop if it exists
            const backdrop = document.querySelector('.modal-backdrop.modal-level-2');
            if (backdrop) {
                backdrop.remove();
            }
        } catch (error) {
            console.error('Error in manuallyHideEditPartModal:', error);
        }
    }

    syncClaims(PurchaseOrder: PurchaseOrderVehicle): void {
        for (let claim of this.claims) {
            if (claim.id == this.purchaseOrder.claimId) {
                this.claim = claim;
            }
        }
    }

    createSupplyment(vehicle: any): void {
        var supplement = new Supplement();
        supplement.name = "Change Me";
        supplement.description = "Change Me";
        supplement.price = 1;
        supplement.userId = this.user.id;
        supplement.companyId = this.user.companyId;
        supplement.vehicleId = vehicle.id;
        supplement.reason = "Supllement";

        this.supplementService.createSupplement(vehicle.id, supplement).subscribe({
            next: (result: any) => {
                if (result != null) {
                    console.log(result);
                    this.vehicle.supplements.unshift(result);
                }
            }
        })
    }

    saveSupplyment(vehicle: any, supplement: any, reason: any): void {
        supplement.reason = reason;
        this.supplementService.createSupplement(vehicle.id, supplement).subscribe({
            next: (result: any) => {
                if (result != null) {
                    console.log(result);
                    for (let i = 0; i < this.vehicle.supplements.length; i++) {
                        if (this.vehicle.supplements[i].id == supplement.id) {
                            this.vehicle.supplements[i] = result;
                        }
                    }
                }
            }
        })
    }

    deleteSupplyment(supplementId: any): void {
        this.supplementService.deleteSupplement(supplementId).subscribe({
            next: (result: any) => {
                for (let i = 0; i < this.vehicle.supplements.length; i++) {
                    if (this.vehicle.supplements[i].id == supplementId) {
                        this.vehicle.supplements.splice(i, 1);
                    }
                }
            }
        })
    }

    // Method to sort autoparts list for purchase order
    sortListAutopartsPurchaseOrder(fieldName: any, purchaseOrder: PurchaseOrderVehicle): void {
        this.counter++;

        if (fieldName == 'id') {
            if (this.counter % 2 == 1)
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a.id - b.id);
            else
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => b.id - a.id);
        }

        if (fieldName == 'createdAt') {
            if (this.counter % 2 == 1)
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a.id - b.id);
            else
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => b.id - a.id);
        }

        if (fieldName == 'year') {
            if (this.counter % 2 == 1)
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a.year - b.year);
            else
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => b.year - a.year);
        }

        if (fieldName == 'purchaseStatus') {
            if (this.counter % 2 == 1)
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a.purchaseStatus - b.purchaseStatus);
            else
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => b.purchaseStatus - a.purchaseStatus);
        }

        if (fieldName == 'title') {
            if (this.counter % 2 == 1)
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a['title'].localeCompare(b['title']));
            else
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => b['title'].localeCompare(a['title']));
        }

        if (fieldName == 'description') {
            if (this.counter % 2 == 1)
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a['description'].localeCompare(b['description']));
            else
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => b['description'].localeCompare(a['description']));
        }

        if (fieldName == 'partNumber') {
            if (this.counter % 2 == 1)
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a['partNumber'].localeCompare(b['partNumber']));
            else
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => b['partNumber'].localeCompare(a['partNumber']));
        }

        if (fieldName == 'grade') {
            purchaseOrder.autoparts = purchaseOrder.autoparts.filter(item => item['grade'] !== null);
            if (this.counter % 2 == 1)
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a['grade'].localeCompare(b['grade']));
            else
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => b['grade'].localeCompare(a['grade']));
        }

        if (fieldName == 'stocknumber') {
            if (this.counter % 2 == 1)
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a['stocknumber'].localeCompare(b['stocknumber']));
            else
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => b['stocknumber'].localeCompare(a['stocknumber']));
        }

        if (fieldName == 'salePrice') {
            if (this.counter % 2 == 1)
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a.salePrice - b.salePrice);
            else
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => b.salePrice - a.salePrice);
        }

        if (fieldName == 'distance') {
            if (this.counter % 2 == 1)
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => a.distance - b.distance);
            else
                purchaseOrder.autoparts = purchaseOrder.autoparts.sort((a: any, b: any) => b.distance - a.distance);
        }
    }

    // Method to edit autopart
    // Method to delete autopart from purchase order
    deleteAutopartPurchaseOrder(autoPart: AutoPart, index: any, purchaseOrder: PurchaseOrderVehicle): void {
        console.log("deleteAutopartPurchaseOrder");

        if (autoPart.purchaseOrderId > 0) {
            const customTitle = 'Remove Part [' + autoPart.title + ']';
            const message = 'Are you sure you want to remove it ?';
            const buttonType = "yesNo";

            this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed) {
                    console.log('Item deleted');
                    this.autopartService.deleteWithUserId(autoPart.id, this.user.id).subscribe({
                        next: data => {
                            console.log(" " + data);
                            this.getAllVehicleClaims(this.vehicle.id);
                            this.getAutopartForVehicle(this.vehicle.id, true);
                        },
                        error: (e) => {
                            console.log("deleteAutopartPurchaseOrder error");
                            this.message = e.error.message;
                            console.error(e);
                        }
                    });
                } else {
                    console.log('Item not deleted');
                }
            });
        } else {
            const customTitle = 'Remove Part [' + autoPart.title + ']';
            const message = 'Are you sure you want to remove it ?';
            const buttonType = "yesNo";

            this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed) {
                    console.log('Item deleted');
                    this.autopartService.deleteWithUserId(autoPart.id, this.user.id).subscribe({
                        next: data => {
                            console.log(" " + data);
                            this.getAllVehicleClaims(this.vehicle.id);
                            this.getAutopartForVehicle(this.vehicle.id, true);
                        },
                        error: (e) => {
                            console.log("deleteAutopartPurchaseOrder error");
                            this.message = e.error.message;
                            console.error(e);
                        }
                    });
                } else {
                    console.log('Item not deleted');
                }
            });
        }
    }

    // Method to handle autopart purchase status change
    onChangeAutopartPurchaseStatus($event: any, autopart: AutoPart): void {
        autopart.purchaseStatus = $event.target.value;
        console.log(autopart.purchaseStatus);
        if (autopart.purchaseStatus == 0) {
            autopart.reason = "no status";
        } else if (autopart.purchaseStatus == 1) {
            autopart.reason = "ordered";
        } else if (autopart.purchaseStatus == 2) {
            autopart.reason = "received"
        } else if (autopart.purchaseStatus == 3) {
            autopart.reason = "returned"
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

    // Method to sort purchase orders list
    sortListPurchseOrders(fieldName: any): void {
        this.counter++;

        if (fieldName == 'id') {
            if (this.counter % 2 == 1)
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.id - b.id);
            else
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.id - a.id);
        }

        if (fieldName == 'claimId') {
            if (this.counter % 2 == 1)
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.claimId - b.claimId);
            else
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.claimId - a.claimId);
        }

        if (fieldName == 'createdAt') {
            if (this.counter % 2 == 1)
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.id - b.id);
            else
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.id - a.id);
        }

        if (fieldName == 'purchaseStatus') {
            if (this.counter % 2 == 1)
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.purchaseStatus - b.purchaseStatus);
            else
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.purchaseStatus - a.purchaseStatus);
        }

        if (fieldName == 'status') {
            if (this.counter % 2 == 1)
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.status - b.status);
            else
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.status - a.status);
        }

        if (fieldName == 'title') {
            if (this.counter % 2 == 1)
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => a['title'].localeCompare(b['title']));
            else
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => b['title'].localeCompare(a['title']));
        }

        if (fieldName == 'description') {
            if (this.counter % 2 == 1)
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => a['description'].localeCompare(b['description']));
            else
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => b['description'].localeCompare(a['description']));
        }

        if (fieldName == 'partNumber') {
            if (this.counter % 2 == 1)
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => a['partNumber'].localeCompare(b['partNumber']));
            else
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => b['partNumber'].localeCompare(a['partNumber']));
        }

        if (fieldName == 'grade') {
            this.purchaseOrders = this.purchaseOrders.filter(item => item['grade'] !== null);
            if (this.counter % 2 == 1)
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => a['grade'].localeCompare(b['grade']));
            else
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => b['grade'].localeCompare(a['grade']));
        }

        if (fieldName == 'vendorId') {
            for (let purchaseOrder of this.purchaseOrders) {
                purchaseOrder.sortStr = "";
                for (let vendor of this.vendors) {
                    if (vendor.id == purchaseOrder.vendorId) {
                        purchaseOrder.sortStr = vendor.name;
                    }
                }
            }

            if (this.counter % 2 == 1)
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => a['sortStr'].localeCompare(b['sortStr']));
            else
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => b['sortStr'].localeCompare(a['sortStr']));
        }

        if (fieldName == 'salePrice') {
            if (this.counter % 2 == 1)
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => a.salePrice - b.salePrice);
            else
                this.purchaseOrders = this.purchaseOrders.sort((a, b) => b.salePrice - a.salePrice);
        }
    }

    // Method to delete purchase order
    deletePurchaseOrder(purchaseOrder: PurchaseOrderVehicle, index: any): void {
        if (purchaseOrder.claimId > 0) {
            const customTitle = 'Remove Purchase Order [' + purchaseOrder.title + "]";
            const message = 'Are you sure to remove this from Estimate [' + purchaseOrder.claimId + '] that may have [' + purchaseOrder.autoparts.length + '] parts ?';
            const buttonType = "yesNoCancel";

            this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed == undefined) {
                    return;
                } else if (confirmed) {
                    this.purchseOrderVehicleService.deletePurchaseOrderVehicleWithOption(purchaseOrder.id, this.user.id, 1).subscribe({
                        next: data => {
                            console.log(" " + data);
                            this.getAllVehicleClaims(this.vehicle.id);
                            this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
                        },
                        error: (e) => {
                            console.log("deletePurchaseOrder error");
                            this.message = e.error.message;
                            console.error(e);
                        }
                    });
                }
            });
        } else {
            const customTitle = 'Remove Purchase Order [' + purchaseOrder.title + "]";
            const message = 'Are you sure to remove it ?';
            const buttonType = "yesNoCancel";

            this.confirmationService.confirm(message, customTitle, buttonType, (confirmed: boolean) => {
                if (confirmed == undefined) {
                    return;
                } else if (confirmed) {
                    this.purchseOrderVehicleService.deletePurchaseOrderVehicle(purchaseOrder.id, this.user.id).subscribe({
                        next: data => {
                            console.log(" " + data);
                            this.getAllVehicleClaims(this.vehicle.id);
                            this.getAllVehiclePurchaseOrderVehicles(this.vehicle.id);
                        },
                        error: (e) => {
                            console.log("deletePurchaseOrder error");
                            this.message = e.error.message;
                            console.error(e);
                        }
                    });
                }
            });
        }
    }

    // Method to create new purchase order
    createNewPurchaseOrder(forPurchaseOrder: boolean): void {
        this.purchaseOrder = new PurchaseOrderVehicle();
        this.selectedPurchaseOrder = new PurchaseOrderVehicle();
        this.selectedPurchaseOrder.id = 0;
        this.selectedPurchaseOrder.grade = undefined;
        this.selectedPurchaseOrder.title = undefined;
        this.selectedPurchaseOrder.partNumber = undefined;
        this.selectedPurchaseOrder.description = undefined;
        this.selectedPurchaseOrder.salePrice = undefined;

        this.selectedPurchaseOrder.stocknumber = this.randomString();
        this.messagePurchaseOrder = "";
        this.errorMessagePurchaseOrder = "";
    }

    // Method to add new parts
    addNewParts(): void {
        this.selectedAutopart = new AutoPart();
        this.selectedAutopart.id = 0;
        this.selectedAutopart.title = undefined;
        this.imageModels = new Array();
        this.imageUrl = null;
        this.selectedAutopart.stocknumber = this.randomString();

        this.message1 = "";
        this.errorMessage = "";
        this.detailSelected = true;
    }

    // Method to create new autopart
    createNewAutopart(): void {

        // if (this.imageModels.length == 0) {
        //   this.errorMessage = "Please choose image or images for the part";
        //   return;
        // }

        this.selectedAutopart.year = this.vehicle.year;
        this.selectedAutopart.make = this.vehicle.make;
        this.selectedAutopart.model = this.vehicle.model;


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
        this.selectedAutopart.companyId = this.vehicle.companyId;
        this.selectedAutopart.status = 0;
        this.selectedAutopart.published = false;
        this.selectedAutopart.reason = "new";
        this.selectedAutopart.vehicleId = this.vehicle.id;
        this.selectedAutopart.sequenceNumber = -1;

        this.autopartService.create(this.selectedAutopart).subscribe({
            next: (res) => {
                console.log(res);
                this.selectedAutopart = res;

                if (this.imageModels.length > 0) {
                    for (let i = 0; i < this.imageModels.length; i++) {

                        this.uploadAutopartImageWithFile(this.selectedAutopart.id, this.imageModels[i]);
                    }
                }

                setTimeout(() => {
                    // this.imageModels = new Array();
                    // this.imageUrl = null;
                    this.getAutopartDetailFromServer(this.selectedAutopart.id);

                }, 2000);
                // setTimeout(() => {

                //   //window.open(`#/detail/` + this.selectedAutopart.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
                //   this.message = "Posted Successfully";
                //   this.selectedAutopart = new AutoPart();
                //   this.imageModels = new Array();
                //   this.imageUrl = null;

                //   this.getAllFromUserSatistics(this.user.companyId);
                //   this.applyFilter2("2", this.forArchived, 0, this.pageSize);
                //   this.cindex = 0;
                // }, 2000);
                this.errorMessage = "Created Successfully";
                this.getAutopartForVehicle(this.vehicle.id, false);
            },
            error: (e) => console.error(e)
        });
        // } else {
        //   this.message1 = "Please choose a file";
        // }
    }

    saveAutopartEditor(): void {
        console.log("saveAutopart");

        // if (this.selectedAutopart.imageModels.length == 0) {
        //   this.message1 = "Please choose image or images for the part";
        //   return;
        // }

        this.selectedAutopart.reason = "update";

        if (this.selectedAutopart.year == null || this.selectedAutopart.year < 1000 ||
            this.selectedAutopart.make == null || this.selectedAutopart.make == "" ||
            this.selectedAutopart.model == null || this.selectedAutopart.model == ''
        ) {
            this.message1 = "Part Infor for year, make and model are required";
            return;
        }

        if (this.selectedAutopart.title == null || this.selectedAutopart.title == '') {
            this.message1 = "Parts Name is required";
            return;
        }

        if (this.selectedAutopart.description == null || this.selectedAutopart.description == '') {
            this.message1 = "Part Description is required";
            return;
        }

        if (this.selectedAutopart.shipping == null || this.selectedAutopart.shipping == '') {
            this.message1 = "Part Shipping is required";
            return;
        }

        if (this.selectedAutopart.warranty == null || this.selectedAutopart.warranty == '') {
            this.message1 = "Part Warranty is required";
            return;
        }

        if (this.selectedAutopart.grade == null || this.selectedAutopart.grade == '') {
            this.message1 = "Part Grade is required";
            return;
        }

        if (this.selectedAutopart.salePrice != null && this.selectedAutopart.salePrice == 0) {
            this.message1 = "Part Price is required";
            return;
        }

        if (this.selectedAutopart.title != null && this.selectedAutopart.title != '' && this.selectedAutopart.title.length > 255) {
            this.message1 = "Parts Name is too long";
            return;
        }

        if (this.selectedAutopart.description != null && this.selectedAutopart.description != '' && this.selectedAutopart.description.length > 2000) {
            this.message1 = "Part Description is too long";
            return;
        }

        if (this.selectedAutopart.comments != null && this.selectedAutopart.comments != '' && this.selectedAutopart.comments.length > 500) {
            this.message1 = "Part comments is too long";
            return;
        }

        if (this.selectedAutopart.description != null && this.selectedAutopart.description != '' && this.selectedAutopart.description.length < 2) {
            this.message1 = "Part Description is too short";
            return;
        }

        if (this.selectedAutopart.comments != null && this.selectedAutopart.comments != '' && this.selectedAutopart.comments.length < 2) {
            this.message1 = "Part comments is too short";
            return;
        }

        if (this.selectedAutopart.partNumber != null && this.selectedAutopart.partNumber != '' && this.selectedAutopart.partNumber.length > 255) {
            this.message1 = "Parts Number is too long";
            return;
        }

        if (this.selectedAutopart.stocknumber != null && this.selectedAutopart.stocknumber != '' && this.selectedAutopart.stocknumber.length < 2) {
            this.message1 = "Part Stock Number is too short";
            return;
        }

        if (this.selectedAutopart.stocknumber != null && this.selectedAutopart.stocknumber != '' && this.selectedAutopart.stocknumber.length > 50) {
            this.message1 = "Part Stock Number is too long";
            return;
        }

        this.autopartService.update(this.selectedAutopart.id, this.selectedAutopart).subscribe({
            next: (res) => {
                console.log(res);
                this.selectedAutopart = res;
                this.selectedImage = this.selectedAutopart.showInSearchImageId;
                this.message1 = "Updated Successfully ";
                // setTimeout(() => {
                //this.getAutoPartById(this.autopartReturned.id);
                //window.open(`/detail/` + this.autopartReturned.id, '_blank', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
                //this.message1 = "Updated Successfully ";
                // }, 200);

                for (let i = 0; i < this.autopartsSearch.length; i++) {
                    if (this.autopartsSearch[i].id == this.selectedAutopart.id) {
                        this.autopartsSearch[i] = this.selectedAutopart;
                        this.autopartsSearch[i].showInSearchImageId = this.selectedAutopart.showInSearchImageId;
                    }
                }
            },
            error: (e) => console.error(e)
        });
    }

    // Method to sort autoparts list
    sortListAutoparts(fieldName: any): void {
        this.counter++;

        if (fieldName == 'id') {
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.id - b.id);
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.id - a.id);
        }

        if (fieldName == 'claimId') {
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.claimId - b.claimId);
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.claimId - a.claimId);
        }

        if (fieldName == 'createdAt') {
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.id - b.id);
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.id - a.id);
        }

        if (fieldName == 'year') {
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.year - b.year);
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.year - a.year);
        }

        if (fieldName == 'purchaseStatus') {
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.purchaseStatus - b.purchaseStatus);
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.purchaseStatus - a.purchaseStatus);
        }

        if (fieldName == 'title') {
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['title'].localeCompare(b['title']));
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['title'].localeCompare(a['title']));
        }

        if (fieldName == 'description') {
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['description'].localeCompare(b['description']));
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['description'].localeCompare(a['description']));
        }

        if (fieldName == 'partNumber') {
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['partNumber'].localeCompare(b['partNumber']));
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['partNumber'].localeCompare(a['partNumber']));
        }

        if (fieldName == 'grade') {
            this.autopartsSearch = this.autopartsSearch.filter(item => item['grade'] !== null);
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['grade'].localeCompare(b['grade']));
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['grade'].localeCompare(a['grade']));
        }

        if (fieldName == 'stocknumber') {
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a['stocknumber'].localeCompare(b['stocknumber']));
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b['stocknumber'].localeCompare(a['stocknumber']));
        }

        if (fieldName == 'salePrice') {
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.salePrice - b.salePrice);
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.salePrice - a.salePrice);
        }

        if (fieldName == 'distance') {
            if (this.counter % 2 == 1)
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => a.distance - b.distance);
            else
                this.autopartsSearch = this.autopartsSearch.sort((a, b) => b.distance - a.distance);
        }
    }

    // Property for showing all payment info
    shallAllPaymentInfo: boolean = false;

    // Method to get payment details
    getDetailsPayment(payment: Payment, index: any): void {
        this.currentIndex = index;
        this.payment = payment;
    }

    // Method to delete payment image
    deleteImagePayment(paymentId: any, imageId: any) {
        console.log("deleteImage");

        this.paymentService.deleteImageWihtUserId(imageId, paymentId, this.currentUser.id).subscribe({
            next: (result) => {
                console.log(result);
                if (this.payment && this.payment.imageModels) {
                    for (let i = 0; i < this.payment.imageModels.length; i++) {
                        if (this.payment.imageModels[i].id == imageId) {
                            this.payment.imageModels.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        });
    }

    // Method to set image for search
    setImageForSearch(vehicleId: any, imageId: any) {
        console.log("setImageForSearch");

        this.vehicleService.setImageForSearch(imageId, vehicleId).subscribe({
            next: (result) => {
                console.log(result);
                this.vehicleService.get(vehicleId).subscribe({
                    next: (result => {
                        console.log(result);
                        this.vehicle = result;
                        this.vehicle.imageModels = this.vehicle.imageModels.sort((a: any, b: any) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0));
                        this.selectedImage = this.vehicle.showInSearchImageId;
                        for (let vehicle of this.vehicles) {
                            if (vehicle.id == this.vehicle.id) {
                                vehicle.showInSearchImageId = imageId;
                                this.vehicle.showInSearchImageId = imageId;
                            }
                        }
                    })
                });
            }
        });
    }

    // Method to set image 4
    setImage4(imageModel: ImageModel): void {
        this.imageModelSelected = new ImageModel();
        this.selectedImage4 = imageModel.id;
        this.imageModelSelected = imageModel;
        this.imageModelSelected.paymentId = this.payment.id;
    }

    // Property for selected vehicle
    selectedVehicle: any = {};

    // Method to add vehicle job 
    addVehicleJob(service: any): void {
        console.log("addVehicleJob");
        var job = {
            id: 0,
            name: service.name,
            employeeId: 0,
            serviceId: service.id,
            notes: "Please specify",
            status: 0,
            imageModels: new Array(),
            vehicleId: this.vehicle.id,
            jobRequestType: 0,
            paymentMethod: 0
        }

        this.jobService.createJob(this.currentUser.id, job).subscribe({
            next: result => {
                if (result) {
                    console.log(result);
                    this.job = result;
                    if (this.jobs) {
                        this.jobs.unshift(this.job);
                    }
                }
            }
        })
    }

    // Method to fill calendar for vehicle job 
    fillCalendarVehicleJob(): void {
        console.log('Filling calendar for vehicle job');

        this.vehicleJobsOnly = true;

        // Filter and process jobs for the current vehicle
        if (this.vehicle && this.jobs) {
            // Sort jobs by sequence number
            this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

            // Update vehicle jobs in vehicles array
            for (let i = 0; i < this.vehicles.length; i++) {
                if (this.vehicles[i].id == this.vehicle.id) {
                    this.vehicles[i].jobs = this.jobs;
                }
            }

            // Update job completed count if vehicle is available
            if (this.vehicle) {
                const status = this.getJobStatus(this.vehicle);
                this.jobCompletedCount = parseInt(status) || 0;
            }
        }
    }


    // Method to get vehicle jobs 2 
    getVehicleJobs2(vehicleId: any): void {
        this.serviceJobs = new Array();
        this.jobCompletedCount = 0;
        this.jobService.getAllVehicleJobs2(vehicleId).subscribe({
            next: result => {
                if (result) {
                    this.jobs = result;
                    this.jobs = this.jobs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                    for (let i = 0; i < this.vehicles.length; i++) {
                        if (this.vehicles[i].id == vehicleId) {
                            this.vehicles[i].jobs = this.jobs;
                        }
                    }
                    if (typeof this.getJobStatus === 'function') {
                        if (this.vehicle) {
                            const status = this.getJobStatus(this.vehicle);
                            this.jobCompletedCount = parseInt(status) || 0;
                        }
                    }

                    if (this.vehicleJobsOnly == true) {
                        this.fillCalendarVehicleJob();
                    }
                } else {
                    this.jobs = new Array();
                    if (this.vehicleJobsOnly == true) {
                        this.fillCalendarVehicleJob();
                    }
                }
                console.log("getVehicleJobs2", this.jobs);
            },
            error: (e) => console.error(e)
        })
    }

    // Method to get job details 
    getDetailsJob(job: any, index: number): void {
        console.log('Getting job details:', job, index);
        this.job = job;
        this.cindex = index;
        // Set current job for detailed view
        if (job && job.id) {
            this.currentJobId = job.id;
        }
    }

    // Method to verify job 
    verifyJob(job: any): void {
        console.log('Verifying job:', job);
        if (job) {
            job.status = 1; // Mark as verified
            this.updateJobStatus(job);
        }
    }

    // Method to notify manager 
    notifyManager(action: string, cssClass: string, job: any): void {
        console.log('Notifying manager:', action, cssClass, job);
        // Basic notification implementation
        if (job) {
            const notification = {
                action: action,
                cssClass: cssClass,
                jobId: job.id,
                message: `Job ${job.name} requires manager attention: ${action}`,
                timestamp: new Date()
            };
            console.log('Manager notification:', notification);
        }
    }

    // Additional missing methods for job management

    onChangeCalendar(event: any, job: any): void {
        console.log('Calendar change for job:', event, job);
        if (job && event && event.target) {
            job.targetDate = event.target.value;
            job.reason = "targetDate";
            this.saveJobNotes(job);
        }
    }

    isJobChecked(job: any): boolean {
        if (job.status != 0)
            return true;
        return false;
    }

    updateJobStatus(job: any): void {
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
                // Update job completed count if vehicle is available
                if (this.vehicle) {
                    const status = this.getJobStatus(this.vehicle);
                    this.jobCompletedCount = parseInt(status) || 0;
                }
            },
            error: (e) => console.log(e)
        })
    }

    deleteVehicleJobClaim(event: any, job: any): void {
        console.log('Deleting vehicle job claim:', event, job);
        if (job && job.id) {
            // Remove job from jobs array
            this.jobs = this.jobs.filter(j => j.id !== job.id);

            // Update vehicle jobs
            for (let i = 0; i < this.vehicles.length; i++) {
                if (this.vehicles[i].jobs) {
                    this.vehicles[i].jobs = this.vehicles[i].jobs.filter(j => j.id !== job.id);
                }
            }

            console.log('Job removed from claim:', job.id);
        }
    }

    saveJobNotes(job: any): void {
        job.reason = "notes";
        this.jobService.createJob(this.currentUser.id, job).subscribe({
            next: result => {
                this.job = result;
                // Job synced successfully
            },
            error: (e) => console.error(e)
        })
    }

    // Method to handle dropped jobs for claim 
    droppedJobsClaim(event: any, claim: any): void {
        console.log('Dropped jobs for claim:', event, claim);
        if (event && event.previousContainer && event.container) {
            // Handle drag and drop logic for jobs
            if (event.previousContainer === event.container) {
                moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            } else {
                // Move job between different containers/claims
                const job = event.previousContainer.data[event.previousIndex];
                if (job && claim) {
                    job.claimId = claim.id;
                    this.saveJobNotes(job);
                }
            }
        }
    }

    // Method to handle dropped purchase orders
    droppedPurchaseOrders(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.purchaseOrders, event.previousIndex, event.currentIndex);
        let sequenceCarriers: SequenceCarrier[] = new Array();
        for (let i = 0; i < this.purchaseOrders.length; i++) {
            let sequenceCarrier: SequenceCarrier = new SequenceCarrier();
            sequenceCarrier.id = this.purchaseOrders[i].id;
            sequenceCarrier.index = i;
            sequenceCarriers.push(sequenceCarrier);
        }
        this.purchseOrderVehicleService.updateSeqence(this.vehicle.id, sequenceCarriers).subscribe({
            next: (data: any) => {
                this.purchaseOrders.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
            },
            error: (err: any) => {
                console.log(err);
            }
        });
    }

    // Method to get subtotal for claims
    getSubtotalClaims(): number {
        var total: number = 0;
        if (this.claims.length > 0) {
            for (let claim of this.claims) {
                total += (claim.quantity * claim.amount);
            }
            return +(total.toFixed(2));
        } else {
            return total;
        }
    }

    // Method to get total purchase orders
    getTotalPurchaseOrders(): number {
        var total = 0;
        for (let purchaseOrder of this.purchaseOrders) {
            total += purchaseOrder.salePrice;
        }
        return total;
    }

    // Additional missing properties and methods
    hover: any = null;
    employees: any[] = new Array();

    // Additional properties for template bindings
    currentEmplyeeId: number = 0;
    fileInput: any;



    // Print functionality
    printReport(): void {
        console.log('Printing report...');

        // Create a complete HTML structure with resolved image URLs
        let printContent = `
      <div id="print-content-report" style="background-color:white">
        <div class="container-fluid" style="background-color:white">
          <div class="row">
            <div class="col-12">
              <h2 class="text-primary mb-1">
                <i class="fas fa-chart-line me-2"></i>${this.reportTitle}
              </h2>
              <p class="text-muted mb-0">Company: ${this.company.name || 'N/A'}</p>
              <p class="text-muted mb-0">${this.getCurrentReportDate()}</p>
            </div>
          </div>
          
          <div class="row mt-4">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th class="text-center">#</th>
                      <th>Vehicle</th>
                      <th>Date</th>
                      <th>Year</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Color</th>
                      <th class="text-end">Estimate</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Job Type</th>
                      <th>Job Status</th>
                      <th class="text-center">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
    `;

        // Add vehicle data rows
        for (let i = 0; i < this.vehicles.length; i++) {
            const vehicle = this.vehicles[i];
            const vehicleImage = this.getVehicleImage(vehicle);
            const customerName = this.getCustomerName(vehicle);
            const phoneNumber = vehicle.customer?.phone ? this.formatPhoneNumber(vehicle.customer.phone) : 'N/A';
            const jobType = this.getJobType(vehicle);
            const jobStatus = this.getJobStatus(vehicle);
            const estimate = this.calculateEstimate(vehicle);
            const createdAt = vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : 'N/A';
            const paidStatus = vehicle.paid ? 'Paid' : 'Unpaid';

            printContent += `
        <tr>
          <td class="text-center fw-bold">${i + 1}</td>
          <td>
            <div class="overflow-hidden hover-img transition rounded-1 border inline-block position-relative">
      `;

            // Add image if available
            if (vehicle.imageModels && vehicle.imageModels.length > 0 && vehicle.showInSearchImageId > 0) {
                printContent += `
          <img src="${vehicleImage}" height="40" alt="Vehicle Image" class="object-fill rounded-1 w-100" />
        `;
            } else {
                // Use a placeholder image if no vehicle image is available
                printContent += `
          <img src="assets/images/Laptop.png" height="40" alt="No Image" class="object-fill rounded-1 w-100" />
        `;
            }

            // Add image count badge if multiple images
            if (vehicle.imageModels && vehicle.imageModels.length > 1) {
                printContent += `
          <span title="${vehicle.imageModels.length} images/photos"
                class="badge position-absolute top-3 end-12 translate-middle badge-pill bg-danger"
                style="top:8px; left:10px">
            ${vehicle.imageModels.length}
          </span>
        `;
            }

            printContent += `
            </div>
          </td>
          <td><small>${createdAt}</small></td>
          <td>${vehicle.year || 'N/A'}</td>
          <td>${vehicle.make || 'N/A'}</td>
          <td>${vehicle.model || 'N/A'}</td>
          <td class="text-center fs-13 text-shadow">
            <i class="fa-solid fa-square" title="${vehicle.color || 'N/A'}"
               style="color: ${vehicle.color || '#000000'}"></i>
          </td>
          <td class="text-end"><span class="fw-bold">$${estimate.toFixed(2)}</span></td>
          <td>${customerName}</td>
          <td><small>${phoneNumber}</small></td>
          <td><span class="badge bg-info">${jobType}</span></td>
          <td><span class="badge bg-warning">${jobStatus}</span></td>
          <td class="text-center">
            <span class="badge ${vehicle.paid ? 'bg-success' : 'bg-danger'}">
              ${paidStatus}
            </span>
          </td>
        </tr>
      `;
        }

        // Close the table and add summary footer
        printContent += `
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div class="row mt-4">
            <div class="col-12">
              <div class="card bg-light">
                <div class="card-body">
                  <div class="row text-center">
                    <div class="col-md-3">
                      <strong>Total Vehicles:</strong> ${this.vehicles.length}
                    </div>
                    <div class="col-md-3">
                      <strong>Paid:</strong> ${this.getPaidVehiclesCount()}
                    </div>
                    <div class="col-md-3">
                      <strong>Unpaid:</strong> ${this.getUnpaidVehiclesCount()}
                    </div>
                    <div class="col-md-3">
                      <strong>Total Estimates:</strong> $${this.getTotalEstimates().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

        // Open print window with the generated content
        const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=1,status=0');
        WindowPrt?.document.write('<title>Vehicle Report</title>');
        WindowPrt?.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">');
        WindowPrt?.document.write('<link href="../styles.css" rel="stylesheet">');
        WindowPrt?.document.write('<style type="text/css">body{background-color: white; padding: 20px;}</style>');
        WindowPrt?.document.write(printContent);
        WindowPrt?.document.write('<script>onload = function() { window.print(); }</script>');
        WindowPrt?.document.close();
        WindowPrt?.focus();
    }

    // PDF Export functionality (basic implementation)
    exportToPDF(): void {
        console.log('Exporting to PDF...');

        const { jsPDF } = require('jspdf');
        const pdf = new jsPDF('portrait', 'mm', 'a4');

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        let yPos = margin;

        // Report Header
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text(this.reportTitle, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15; // Increased margin bottom for report title

        // Company Information
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        if (this.company) {
            pdf.text(`Company: ${this.company.name || ''}`, margin, yPos);
            yPos += 10; // Increased margin bottom for company info
        }

        // Report Date with user traceability
        pdf.text(this.getCurrentReportDate(), margin, yPos);
        yPos += 10; // Increased margin bottom for report date

        // Effective Date Range for Archived
        if (this.paymentTrackingFilters.dataSource === 'archived') {
            const rangeLabel = this.getReportDateRangeLabel();
            if (rangeLabel) {
                pdf.text(`Effective Date Range: ${rangeLabel}`, margin, yPos);
                yPos += 10;
            }
        }

        // Summary Information
        pdf.text(`Total Vehicles: ${this.vehicles.length}`, margin, yPos);
        yPos += 7;
        pdf.text(`Paid Vehicles: ${this.getPaidVehiclesCount()}`, margin, yPos);
        yPos += 7;
        pdf.text(`Unpaid Vehicles: ${this.getUnpaidVehiclesCount()}`, margin, yPos);
        yPos += 7;
        pdf.text(`Total Estimates: $${this.getTotalEstimates().toFixed(2)}`, margin, yPos);
        yPos += 15; // Increased margin bottom for summary info

        // Line separator
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10; // Increased margin bottom for separator line

        // Table Header
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);

        const colWidths = [6, 8, 10, 10, 12, 16, 12, 10, 10, 8, 12, 12]; // Adjusted for portrait
        const headers = ['#', 'Year', 'Make', 'Model', 'Color', 'Customer', 'Phone', 'Job Type', 'Status', 'Paid', 'Estimate', 'Created'];

        // Draw table header
        let xPos = margin;
        headers.forEach((header, index) => {
            pdf.text(header, xPos, yPos);
            xPos += colWidths[index];
        });

        yPos += 5;
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10; // Increased margin bottom for table header

        // Table Data
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);

        // Pagination variables - optimized for different page capacities
        const rowHeight = 6; // Reduced row height to fit more rows
        let rowsOnPage = 0;
        const maxRowsFirstPage = 30; // First page capacity
        const maxRowsOtherPages = 40; // Subsequent pages capacity
        let maxRowsPerPage = maxRowsFirstPage; // Start with first page capacity

        for (let i = 0; i < this.vehicles.length; i++) {
            const vehicle = this.vehicles[i];

            // Check if we need a new page
            if (rowsOnPage >= maxRowsPerPage) {
                pdf.addPage();
                yPos = margin;
                rowsOnPage = 0;

                // After first page, use the higher capacity for subsequent pages
                maxRowsPerPage = maxRowsOtherPages;

                // Re-draw table header on new page
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                xPos = margin;
                headers.forEach((header, index) => {
                    pdf.text(header, xPos, yPos);
                    xPos += colWidths[index];
                });
                yPos += 5;
                pdf.line(margin, yPos, pageWidth - margin, yPos);
                yPos += 10; // Increased margin bottom for table header on new page
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(8);
            }

            // Draw row data
            xPos = margin;

            // Index
            pdf.text((i + 1).toString(), xPos, yPos);
            xPos += colWidths[0];

            // Year
            pdf.text(vehicle.year?.toString() || '', xPos, yPos);
            xPos += colWidths[1];

            // Make
            pdf.text(vehicle.make || '', xPos, yPos);
            xPos += colWidths[2];

            // Model
            pdf.text(vehicle.model || '', xPos, yPos);
            xPos += colWidths[3];

            // Color
            pdf.text(vehicle.color || '', xPos, yPos);
            xPos += colWidths[4];

            // Customer
            const customerName = this.getCustomerName(vehicle);
            pdf.text(customerName, xPos, yPos);
            xPos += colWidths[5];

            // Phone
            const phone = vehicle.customer?.phone ? this.formatPhoneNumber(vehicle.customer.phone) : '';
            pdf.text(phone, xPos, yPos);
            xPos += colWidths[6];

            // Job Type
            const jobType = this.getJobType(vehicle);
            pdf.text(jobType, xPos, yPos);
            xPos += colWidths[7];

            // Status
            const jobStatus = this.getJobStatus(vehicle);
            pdf.text(jobStatus, xPos, yPos);
            xPos += colWidths[8];

            // Paid
            pdf.text(vehicle.paid ? 'Yes' : 'No', xPos, yPos);
            xPos += colWidths[9];

            // Estimate
            const estimate = this.calculateEstimate(vehicle).toFixed(2);
            pdf.text(`$${estimate}`, xPos, yPos);
            xPos += colWidths[10];

            // Created Date
            const createdDate = vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : '';
            pdf.text(createdDate, xPos, yPos);

            yPos += rowHeight;
            rowsOnPage++;
        }

        // Save the PDF
        pdf.save('shop-vehicles-report.pdf');
        console.log('Report PDF export completed');
    }

    exportPaymentTrackingToPDF(): void {
        console.log('Exporting Payment Tracking to PDF...');

        // Validate that we have the correct report loaded
        if (this.currentReport.id !== 'payment-tracking') {
            console.warn('Payment tracking PDF export called but current report is not payment-tracking');
            alert('Please load the Payment Tracking report first before exporting.');
            return;
        }

        // Validate that we have vehicles data
        if (!this.vehicles || this.vehicles.length === 0) {
            console.warn('No vehicles data available for PDF export');
            alert('No vehicle data available to export.');
            return;
        }

        const { jsPDF } = require('jspdf');
        const QRCode = require('qrcode');
        const pdf = new jsPDF('portrait', 'mm', 'a4'); // Changed to portrait as requested

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10; // Standard margin for portrait
        let yPos = margin;

        // Report Header (company and range embedded in title)
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        let title = `${this.company?.name || ''} Payment Tracking Report`;
        if (this.paymentTrackingFilters.dataSource === 'archived') {
            title += ' For Archived Vehicles';
            const rangeLabelForTitle = this.getReportDateRangeLabel();
            if (rangeLabelForTitle) {
                title += `\n( ${rangeLabelForTitle} )`;
            }
        }
        pdf.text(title.trim(), pageWidth / 2, yPos, { align: 'center' });
        yPos += 16;

        // Subheader font
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');

        // Report Date with user traceability
        pdf.text(this.getCurrentReportDate(), margin, yPos);
        yPos += 8;

        // Payment Tracking Summary
        pdf.text(`Total Vehicles: ${this.vehicles.length}`, margin, yPos);
        yPos += 6;

        if (this.paymentMetrics) {
            pdf.text(`Total Estimates: $${(this.paymentMetrics.totalEstimate || 0).toFixed(2)}`, margin, yPos);
            yPos += 6;
            pdf.text(`Total Supplements: $${(this.paymentMetrics.totalSupplementsAmount || 0).toFixed(2)}`, margin, yPos);
            yPos += 6;
            pdf.text(`Total Payments: $${(this.paymentMetrics.totalPaymentAmount || 0).toFixed(2)}`, margin, yPos);
            yPos += 6;
            pdf.text(`Total Receipts: $${(this.paymentMetrics.totalReceiptAmount || 0).toFixed(2)}`, margin, yPos);
            yPos += 6;
            pdf.text(`Outstanding Amount: $${(this.paymentMetrics.outstandingAmount || 0).toFixed(2)}`, margin, yPos);
            yPos += 6;
            pdf.text(`Payment Completion Rate: ${(this.paymentMetrics.paymentCompletionRate || 0).toFixed(1)}%`, margin, yPos);
            yPos += 10;
        } else {
            // Fallback when paymentMetrics is not available
            pdf.text(`Total Payments: $0.00`, margin, yPos);
            yPos += 6;
            pdf.text(`Total Receipts: $0.00`, margin, yPos);
            yPos += 6;
            pdf.text(`Total Supplements: $0.00`, margin, yPos);
            yPos += 6;
            pdf.text(`Outstanding Amount: $0.00`, margin, yPos);
            yPos += 6;
            pdf.text(`Payment Completion Rate: 0.0%`, margin, yPos);
            yPos += 10;
        }

        // Line separator
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;

        // Table Header - Payment Tracking with Date column
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);

        // Define columns with added Date, more space for Phone, and new Paid column - adjusted for portrait
        const colWidths = [5, 8, 8, 10, 10, 12, 14, 14, 8, 10, 8, 10, 10, 10, 7, 7, 7, 10, 10, 10, 10, 8];
        const headers = ['#', 'Date', 'Year', 'Make', 'Model', 'Color', 'Customer', 'Phone', 'Job', 'Status', 'Paid', 'Estimate', 'Payment', 'Receipt', 'Supplement', 'Pay#', 'Rec#', 'Sup#', 'Total', 'Paid', 'Outstanding', 'Result'];

        // Draw table header
        let xPos = margin;
        headers.forEach((header, index) => {
            pdf.text(header, xPos, yPos);
            xPos += colWidths[index];
        });

        yPos += 4;
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;

        // Table Data
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7); // Smaller font for more data

        // Pagination variables
        const rowHeight = 5;
        let rowsOnPage = 0;
        const maxRowsFirstPage = 22; // First page has less space due to header
        const maxRowsPerPage = 40; // Subsequent pages can fit more rows
        let isFirstPage = true;

        for (let i = 0; i < this.vehicles.length; i++) {
            const vehicle = this.vehicles[i];

            // Check if we need a new page
            const currentMaxRows = isFirstPage ? maxRowsFirstPage : maxRowsPerPage;
            if (rowsOnPage >= currentMaxRows) {
                pdf.addPage();
                yPos = margin;
                rowsOnPage = 0;
                isFirstPage = false; // Mark that we're no longer on the first page

                // Re-draw table header on new page
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(8);
                xPos = margin;
                headers.forEach((header, index) => {
                    pdf.text(header, xPos, yPos);
                    xPos += colWidths[index];
                });
                yPos += 4;
                pdf.line(margin, yPos, pageWidth - margin, yPos);
                yPos += 8;
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(7);
            }

            // Draw row data
            xPos = margin;

            // Index
            pdf.text((i + 1).toString(), xPos, yPos);
            xPos += colWidths[0];

            // Date (createdAt)
            const createdAtText = vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : '';
            pdf.text(createdAtText, xPos, yPos);
            xPos += colWidths[1];

            // Year
            pdf.text(vehicle.year?.toString() || '', xPos, yPos);
            xPos += colWidths[2];

            // Make
            pdf.text(vehicle.make || '', xPos, yPos);
            xPos += colWidths[3];

            // Model
            pdf.text(vehicle.model || '', xPos, yPos);
            xPos += colWidths[4];

            // Color
            pdf.text(vehicle.color || '', xPos, yPos);
            xPos += colWidths[5];

            // Customer
            const customerName = this.getCustomerName(vehicle);
            pdf.text(customerName, xPos, yPos);
            xPos += colWidths[6];

            // Phone
            const phone = vehicle.customer?.phone ? this.formatPhoneNumber(vehicle.customer.phone) : '';
            pdf.text(phone, xPos, yPos);
            xPos += colWidths[7];

            // Job Type
            const jobType = this.getJobType(vehicle);
            pdf.text(jobType, xPos, yPos);
            xPos += colWidths[8];

            // Status
            const jobStatus = this.getJobStatus(vehicle);
            pdf.text(jobStatus, xPos, yPos);
            xPos += colWidths[9];

            // Paid Status
            const paidStatus = vehicle.paid ? 'PAID' : 'UNPAID';
            pdf.text(paidStatus, xPos, yPos);
            xPos += colWidths[10];

            // Estimate
            const estimate = this.calculateEstimate(vehicle).toFixed(0);
            pdf.text(`$${estimate}`, xPos, yPos);
            xPos += colWidths[11];

            // Payment Total
            const paymentTotal = this.getVehicleTotalPayments(vehicle).toFixed(0);
            pdf.text(`$${paymentTotal}`, xPos, yPos);
            xPos += colWidths[12];

            // Receipt Total
            const receiptTotal = this.getVehicleTotalReceipts(vehicle).toFixed(0);
            pdf.text(`$${receiptTotal}`, xPos, yPos);
            xPos += colWidths[13];

            // Supplement Total
            const supplementTotal = this.getVehicleTotalSupplements(vehicle).toFixed(0);
            pdf.text(`$${supplementTotal}`, xPos, yPos);
            xPos += colWidths[14];

            // Payment Count
            const paymentCount = this.getVehiclePaymentsCount(vehicle).toString();
            pdf.text(paymentCount, xPos, yPos);
            xPos += colWidths[15];

            // Receipt Count
            const receiptCount = this.getVehicleReceiptsCount(vehicle).toString();
            pdf.text(receiptCount, xPos, yPos);
            xPos += colWidths[16];

            // Supplement Count
            const supplementCount = this.getVehicleSupplementsCount(vehicle).toString();
            pdf.text(supplementCount, xPos, yPos);
            xPos += colWidths[17];

            // Total Amount (Estimate + Supplements)
            const totalAmount = (this.calculateEstimate(vehicle) + this.getVehicleTotalSupplements(vehicle)).toFixed(0);
            pdf.text(`$${totalAmount}`, xPos, yPos);
            xPos += colWidths[18];

            // Total Paid (Payments + Receipts)
            const totalPaid = (this.getVehicleTotalPayments(vehicle) + this.getVehicleTotalReceipts(vehicle)).toFixed(0);
            pdf.text(`$${totalPaid}`, xPos, yPos);
            xPos += colWidths[19];

            // Outstanding Amount
            const outstanding = (parseFloat(totalAmount) - parseFloat(totalPaid)).toFixed(0);
            pdf.text(`$${outstanding}`, xPos, yPos);
            xPos += colWidths[20];

            // Payment Result Status
            const result = this.getVehiclePaymentResult(vehicle);
            pdf.text(result.text, xPos, yPos);

            yPos += rowHeight;
            rowsOnPage++;
        }

        // Generate filename with date range and archived flag if applicable
        const dateRangeSuffix = this.getFilenameFriendlyDateRange();
        const archivedFlag = this.paymentTrackingFilters.dataSource === 'archived' ? '_archived_vehicles' : '';
        const filename = `payment-tracking-report${dateRangeSuffix}${archivedFlag}.pdf`;

        console.log('Generated PDF filename:', filename);
        console.log('Date range suffix:', dateRangeSuffix);
        console.log('Archived flag:', archivedFlag);

        // Add QR Code page for each vehicle
        this.addVehicleQRCodesToPDF(pdf, QRCode).then(() => {
            // Save the PDF after QR codes are added
            pdf.save(filename);
            console.log('Payment Tracking Report PDF export completed');
        }).catch((error) => {
            console.error('Error adding QR codes to PDF:', error);
            // Save PDF even if QR codes fail
            pdf.save(filename);
            console.log('Payment Tracking Report PDF export completed (without QR codes)');
        });
    }

    private addVehicleQRCodesToPDF(pdf: any, QRCode: any): Promise<void> {
        console.log('Adding vehicle QR codes to PDF...');

        return new Promise((resolve, reject) => {
            // Add a new page for QR codes
            pdf.addPage();

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;

            // QR Code page header
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Vehicle QR Codes', pageWidth / 2, margin + 10, { align: 'center' });

            // QR Code settings - minimal spacing for maximum QR codes per row
            const qrSize = 22; // Further reduced QR code size in mm
            const qrSpacing = 1; // Minimal spacing between QR codes
            const infoSpacing = 1; // Minimal spacing between QR code and vehicle info

            // Calculate layout: 8 QR codes per row, 4 rows per page
            const qrPerRow = 8;
            const qrPerPage = 32; // 8 columns × 4 rows
            const qrWidth = (pageWidth - 2 * margin - (qrPerRow - 1) * qrSpacing) / qrPerRow;

            let currentPage = 0;
            let qrCount = 0;
            let completedQRCodes = 0;
            const totalQRCodes = this.vehicles.length;

            // Process all vehicles
            const processVehicle = (index: number) => {
                if (index >= this.vehicles.length) {
                    console.log(`Added ${totalQRCodes} vehicle QR codes to PDF`);
                    resolve();
                    return;
                }

                const vehicle = this.vehicles[index];

                // Check if we need a new page
                if (qrCount >= qrPerPage) {
                    pdf.addPage();
                    currentPage++;
                    qrCount = 0;

                    // Add header for new page
                    pdf.setFontSize(16);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(`Vehicle QR Codes (Page ${currentPage + 1})`, pageWidth / 2, margin + 10, { align: 'center' });
                }

                // Calculate position for this QR code
                const row = Math.floor(qrCount / qrPerRow);
                const col = qrCount % qrPerRow;

                const xPos = margin + col * (qrWidth + qrSpacing);
                const yPos = margin + 20 + row * (qrSize + 15 + qrSpacing); // Reduced height for QR + info

                // Generate QR code URL
                const qrUrl = "https://baycounter.com" + "/#/vehicle2/" + vehicle.token;

                // Generate QR code as data URL
                QRCode.toDataURL(qrUrl, {
                    width: qrSize * 4, // Higher resolution for better quality
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                }).then((qrDataUrl: string) => {
                    // Add index number above QR code
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(`#${index + 1}`, xPos + qrSize / 2, yPos - 2, { align: 'center' });

                    // Add QR code image to PDF
                    pdf.addImage(qrDataUrl, 'PNG', xPos, yPos, qrSize, qrSize);

                    // Add vehicle information below QR code
                    pdf.setFontSize(7);
                    pdf.setFont('helvetica', 'normal');

                    // Vehicle basic info (simplified for smaller space)
                    const vehicleInfo = `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`.trim();
                    const customerInfo = this.getCustomerName(vehicle);
                    const paymentResult = this.getVehiclePaymentResult(vehicle);

                    // Truncate long text to fit in QR code area
                    const maxWidth = qrWidth - 2;
                    const truncatedVehicle = pdf.splitTextToSize(vehicleInfo, maxWidth);
                    const truncatedCustomer = pdf.splitTextToSize(customerInfo, maxWidth);
                    const truncatedResult = pdf.splitTextToSize(paymentResult.text, maxWidth);

                    let textY = yPos + qrSize + infoSpacing + 2; // Added mt-2 equivalent spacing

                    // Vehicle info
                    if (truncatedVehicle.length > 0) {
                        pdf.text(truncatedVehicle[0], xPos + 1, textY);
                        textY += 3; // Increased spacing between lines
                    }

                    // Customer info (truncated to fit)
                    if (truncatedCustomer.length > 0) {
                        pdf.text(truncatedCustomer[0], xPos + 1, textY);
                        textY += 3;
                    }

                    // Payment result (only show if not "Paid ($0.00)")
                    if (truncatedResult.length > 0 && paymentResult.text !== 'Paid ($0.00)') {
                        pdf.setFont('helvetica', 'bold');
                        pdf.text(truncatedResult[0], xPos + 1, textY);
                        pdf.setFont('helvetica', 'normal');
                    }

                    completedQRCodes++;
                    qrCount++;

                    // Process next vehicle
                    processVehicle(index + 1);

                }).catch((error: any) => {
                    console.error('Error generating QR code for vehicle:', vehicle.id, error);

                    // Add index number above error area
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(`#${index + 1}`, xPos + qrSize / 2, yPos - 2, { align: 'center' });

                    // Fallback: Add text instead of QR code
                    pdf.setFontSize(7);
                    pdf.setFont('helvetica', 'normal');
                    pdf.text('QR Error', xPos + qrSize / 2, yPos + qrSize / 2, { align: 'center' });

                    const vehicleInfo = `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`.trim();
                    pdf.text(vehicleInfo, xPos + 1, yPos + qrSize + infoSpacing + 2); // Added mt-2 equivalent spacing

                    completedQRCodes++;
                    qrCount++;

                    // Process next vehicle
                    processVehicle(index + 1);
                });
            };

            // Start processing vehicles
            processVehicle(0);
        });
    }

    // Search functionality
    onSearchChange(event: any): void {
        this.currentSearchTerm = event.target.value.toLowerCase();
        console.log('Search term changed to:', this.currentSearchTerm);
        this.applyFilters();
    }

    // Refresh data
    refreshReport(): void {
        console.log('Refreshing report data...');
        //this.searchVehicle(5, 0, this.pageSize);
        this.searchVehicleForReports(5, 0, this.pageSize);
    }

    // Modal methods
    toggleDivs(): void {
        // Toggle modal visibility styles
        if (this.displayStyle2 === 'visible') {
            this.displayStyle2 = 'hidden';
            // this.displayStyle3 = '0';

            // Clear the modal stack when editVehicle is closed
            this.modalStackManager.clearStack();

            // Properly dismiss the Bootstrap modal to remove backdrop
            try {
                const editVehicleModal = document.getElementById('editVehicle');
                if (editVehicleModal) {
                    const bootstrap = (window as any).bootstrap;
                    if (bootstrap && bootstrap.Modal) {
                        const modalInstance = bootstrap.Modal.getInstance(editVehicleModal);
                        if (modalInstance) {
                            modalInstance.hide();
                        }
                    }
                    // Remove modal-open class from body to restore scrolling
                    document.body.classList.remove('modal-open');
                    // Remove any remaining backdrop
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.remove();
                    }
                }
            } catch (error) {
                console.error('Error dismissing modal:', error);
                // Fallback: force remove modal-open class and backdrop
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
            }
        } else {
            this.displayStyle2 = 'visible';
            //this.displayStyle3 = '1';
        }
    }

    showDocTypedImageModels: boolean = false;

    messageTargetDateReason = "";
    targetDateOriginal: Date = new Date();
    vehicleJob: Vehicle = new Vehicle();

    getDetail(vehicle: Vehicle, index: any): void {


        this.vehicle = vehicle;
        this.vehicleJob = vehicle;
        this.targetDateOriginal = vehicle.targetDate;
        this.errorMessage = "";
        this.successMessage = "";
        this.errorMessageVehicle = "";
        this.successMessageVehicle = "";
        this.selectedImage = 0;
        this.selectedImage2 = 0;

        this.imageModelSelected = new ImageModel();
        this.showDocTypedImageModels = false;

        this.pdfSrc = null;

        // Open editVehicle modal using our ModalStackManager
        console.log('=== Opening editVehicle modal ===');
        this.modalStackManager.debugStack();
        this.modalStackManager.showModal('editVehicle');

        // Show modal
        this.displayStyle2 = 'visible';
        this.displayStyle3 = '1';

        //this.getVehicle(vehicle.id);

        for (var i = 0; i < this.carListStringList.length; i++) {
            if (this.carListStringList[i].brand == this.vehicle.make) {
                this.optionsModel = this.carListStringList[i].models;
            }

        }

        var hasItMake = false;
        for (let make of this.optionsMake) {
            if (make == this.vehicle.make) {
                hasItMake = true;
            }
        }

        if (!hasItMake) {
            this.optionsMake.push(this.vehicle.make);
        }


        var hasIt = false;
        for (let model of this.optionsModel) {
            if (model == this.vehicle.model) {
                hasIt = true;
            }
        }
        if (!hasIt) {
            this.optionsModel.push(this.vehicle.model);
        }
        // this.unLabelList();
        // this.labelList(this.vehicle.damageStrings);

        //this.LabelListTest(this.vehicle.damageStrings);

        this.cindex = index;
        this.currentIndex = index;

        if (this.vehicle.imageModels != null && this.vehicle.imageModels.length > 0) {
            this.vehicle.imageModels = this.vehicle.imageModels.sort((a: any, b: any) => a.sequenceNumber - b.sequenceNumber);
            this.selectedImage = this.vehicle.showInSearchImageId;
        }

        for (let docType of this.docTypes) {
            docType.imageModels = new Array();
        }

        if (this.vehicle.imageModels != null && this.vehicle.imageModels.length > 0) {
            for (let imageModel of this.vehicle.imageModels) {

                if (this.isInDocType(imageModel.docType)) {

                    for (let docType of this.docTypes) {
                        if (imageModel.docType == docType.id) {
                            imageModel.docTypeName = docType.name;
                            docType.imageModels.push(imageModel);
                        }
                    }
                } else {
                    if (this.docTypes[0]) {
                        this.docTypes[0].imageModels.push(imageModel);
                    }
                }
            }
            for (let docType of this.docTypes) {
                //docType.imageModels = docType.imageModels.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                docType.imageModels = docType.imageModels.sort((a: any, b: any) => a.id - b.id);
            }
        }



        this.vehicleHistories = new Array();
        this.getVehicleJobs2(vehicle.id);
        this.getVehiclePayments(vehicle.id);
        this.getAllVehicleReceipt(vehicle.id);
        this.getAllVehicleClaims(vehicle.id);
        this.getAutopartForVehicle(vehicle.id, true);
        this.getAllVehiclePurchaseOrderVehicles(vehicle.id);
        //this.getPdfFiles(vehicle.id)

        this.url = location.origin + "/#/vehicle2/" + this.vehicle.token;
        this.vehicle.url = this.url;
        // this.getVehicleJobs(vehicle.id);
        this.estimateResponse = new EstimateResponse();
        this.aiImages = new Array();


    }

    estimateResponse: EstimateResponse = new EstimateResponse();

    aiImages: number[] = new Array();

    getDetail1(vehicle: Vehicle, index: number): void {
        // Set the selected vehicle for modal display
        this.vehicle = vehicle;
        this.url = location.origin + "/#/vehicle2/" + vehicle.token;

        // Initialize QR code URL




        // Open editVehicle modal using our ModalStackManager
        console.log('=== Opening editVehicle modal ===');
        this.modalStackManager.debugStack();
        this.modalStackManager.showModal('editVehicle');

        // Show modal
        this.displayStyle2 = 'visible';
        this.displayStyle3 = '1';

        this.vehicleHistories = new Array();
        this.getVehicleJobs2(vehicle.id);
        this.getVehiclePayments(vehicle.id);
        this.getAllVehicleReceipt(vehicle.id);
        this.getAllVehicleClaims(vehicle.id);
        this.getAutopartForVehicle(vehicle.id, true);
        this.getAllVehiclePurchaseOrderVehicles(vehicle.id);
    }

    backToListing(): void {

        // if (this.showSavedItems != true)
        //   this.detailSelected = false;

        this.imageModels = new Array();
        this.imageUrl = null;
        this.errorMessage = "";
        this.message1 = "";

        setTimeout(() => {
            if (this.selectedAutopart.id > 0)
                this.scrollService.scrollToElementById(this.selectedAutopart.id);
        }, 200);
    }

    getVehiclePayments(vehicleId: any): void {

        // this.payments = new Array(); // No longer needed - payments come from vehicle.payments
        this.paymentService.getAllVehiclePayments(vehicleId).subscribe({
            next: result => {
                if (result) {
                    this.vehicle.payments = result;
                    this.vehicle.payments = this.vehicle.payments.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
                } else {
                    this.vehicle.payments = new Array();
                }
                // this.serviceJobs = result;
                // console.log("getVehiclePayments", this.payments);
            }


        })
    }
    switchQrCode(): void {
        this.counterQrcode++;
        if (this.counterQrcode % 2 == 1) {
            this.url = location.origin + "/#/vehicle3/" + this.vehicle.token;
        } else {
            this.url = location.origin + "/#/vehicle2/" + this.vehicle.token;
        }
    }


    findAllCurrentEmplyeeJobs(): void {
        this.jobService.findAllCurrentEmplyeeJobs(this.user.companyId).subscribe({
            next: result => {
                console.log(result)
                this.employeeJobCarrier = result;
                this.totalJobCounts = 0;
                for (let employee of this.employeeJobCarrier) {
                    employee.url = location.origin + "/#/operation/" + employee.token;
                    if (employee.jobs) {

                        for (let j = 0; j < employee.jobs.length; j++) {
                            // for (let job of employee.jobs) {
                            this.totalJobCounts++;
                            //this.getJobScore(employee.jobs[j]);

                            for (let i = 0; i < this.jobs.length; i++) {
                                if (this.jobs[i].id == employee.jobs[j].id) {
                                    this.jobs[i] = employee.jobs[j];
                                    // this.getJobScore(this.jobs[i]);
                                }
                            }
                            // for (let job2 of this.jobs) {
                            //   if (job2.id == job.id) {
                            //     job2 = job;
                            //     this.getJobScore(job2);
                            //   }
                            // }
                            //
                        }
                    }
                }


            }
        })
    }

    openUrl(url: string) {
        const mobileWidth = 375;
        const mobileHeight = 667;
        const left = (screen.width - mobileWidth) / 2;
        const top = (screen.height - mobileHeight) / 2;

        window.open(
            location.origin + "/#/" + url,
            "_blank",
            `width=${mobileWidth},height=${mobileHeight},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
    }

    // Helper method to convert data URI to Blob
    // Private method to upload image with file for jobs
    private uploadImageWithFileJobs(jobId: any, imageModel: ImageModel) {
        console.log("uploadImageWithFileJobs");

        const file = this.DataURIToBlob("" + imageModel.picByte);
        const formData = new FormData();
        formData.append('file', file, 'image.jpg')
        formData.append('autopartId', jobId) //other param
        formData.append('description', "test") //other param

        this.jobService.uploadImageWithFileWithUserId(formData, jobId, this.user.id).subscribe({
            next: (result) => {
                console.log(result);
                this.jobService.getJob(jobId).subscribe({
                    next: result => {
                        this.job = result;
                        for (let i = 0; i < this.jobs.length; i++) {
                            if (this.jobs[i].id == jobId) {
                                this.jobs[i] = result;
                            }
                        }
                        this.getDetailsJob(this.job, this.currentIndex);
                    }
                });
            }
        });
    }

    // Helper method for purchase order deletion confirmation
    private confirmPurchseOrderDeletion(purchaseOrder: any, index: any, claim: any): void {
        this.message = "Are you sure you want to delete this purchase order? This action cannot be undone.";

        this.confirmationService.confirm(
            this.message,
            'Confirm Purchase Order Deletion',
            'yesNoCancel',
            (confirmed: boolean) => {
                if (confirmed) {
                    this.purchseOrderVehicleService.deletePurchaseOrderVehicleWithOption(purchaseOrder.id, this.currentEmplyeeId, 'delete').subscribe({
                        next: (data: any) => {
                            console.log('Purchase order deleted successfully', data);
                            this.searchVehicle(this.searchType, this.currantPageNumber, this.pageSize);
                        },
                        error: (err: any) => {
                            console.error('Error deleting purchase order', err);
                        }
                    });
                } else {
                    console.log('Purchase order deletion cancelled');
                }
            }
        );
    }

    // Private method to upload image with file for payments
    private uploadImageWithFilePayments(paymentId: any, imageModel: ImageModel) {
        console.log("uploadImageWithFilePayments");

        const file = this.DataURIToBlob("" + imageModel.picByte);
        const formData = new FormData();
        formData.append('file', file, 'image.jpg')
        formData.append('autopartId', paymentId) //other param
        formData.append('description', "test") //other param

        this.paymentService.uploadImageWithFileWithUserId(formData, paymentId, this.user.id).subscribe({
            next: (result) => {
                console.log(result);
                this.paymentService.getPayment(paymentId).subscribe({
                    next: result => {
                        this.payment = result;
                        for (let i = 0; i < (this.vehicle.payments || []).length; i++) {
                            if (this.vehicle.payments?.[i]?.id == paymentId) {
                                this.vehicle.payments![i] = result;
                            }
                        }
                        this.getDetailsPayment(this.payment, this.currentIndex);
                    },
                    error: err => {
                        console.log(err);
                    }
                });
            },
            error: err => {
                console.log(err);
            }
        });
    }
}
