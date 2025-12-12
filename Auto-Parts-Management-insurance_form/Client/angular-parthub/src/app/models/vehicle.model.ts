import { Customer } from "./customer.model";
import { ImageModel } from "./imageModel.model";
import { Job } from "./job.model";
import { PdfFile } from "./pdfFile.model";
import { Service } from "./service.model";

export class Vehicle {

    id?: any = 0;
    year: number = 0;
    make: string = "";
    model: string = "";
    trim?: any;
    submodel?: any;
    engineDesc?: any;
    color: string = "";

    token: string = "";

    miles?: string;
    vin?: any;
    plate?: string;

    repairType?: number;

    description?: string;
    description2?: string = "";

    workRequest?: string;

    damages?: string[];

    damageStrings?: string[];
    customerId?: number;

    sequenceNumber: number = 0;

    customer: Customer = new Customer();

    userId?: number;
    companyId?: number;

    picByte?: any[];

    createdAt: Date = new Date();
    updatedAt: Date = new Date();

    price: number = 0;
    supplymentPrice: number = 0;

    claimNumber?: string;
    currentJobNumber?: string;

    status: number = 0;

    statusString?: any;

    sortStr: any = "";

    imageModels: ImageModel[] = new Array();

    pdfFiles: PdfFile[] = new Array();

    showInSearchImageId: number = 0;

    daysInShop: number = 0;
    rentalCountDown: number = 0;
    targetDateCountDown: number = 0;
    targetDateChangeReason?: string = "";

    daysInShopPrecentage?: number;
    loanerCarName?: any;
    insuranceCompany: string = "";
    insuranceCompanyId: any = 0;
    location: number = 0;
    //employees: Employee[] = new Array(); 
    services: Service[] = new Array();

    serachString: string = "";

    reason: string = "";

    comments: string = "";
    special: boolean = false;
    archived: boolean = false;
    paid: boolean = false;

    paymentStatus: number = 0;
    paymentMethod: number = 0;
    jobRequestType: number = 0;



    approvalStatus: number = 0;

    targetDate: Date = new Date();
    rentalDate: Date = new Date();

    assignedTo?: any; //employeeId

    serviceManager?: any;

    priorDamage: string = "";
    viewJobs: boolean = false;

    jobs: Job[] = new Array();
    jobs2: Job[] = new Array();
    jobs3: Job[] = new Array();

    shallDisplay: boolean = true;

    inTakeWay: number = 0;

    keyLocation: number = 0; //employeeId

    searchCount: any;

    jobsDone?: boolean = false;

    editable?: boolean = false;

    autoparts?: any[] = new Array();

    supplements: any[] = new Array();

    payments?: any[] = new Array();

    receipts?: any[] = new Array();

    statuss?: any[] = new Array();

    employees?: any[] = new Array();

    lastUpdateObjectName?: any;

    lastVehicleHistory?: any;

    lastUpdateIconName?: any;

    vehicleHistories: any[] = new Array();

    url?: any = "";
}