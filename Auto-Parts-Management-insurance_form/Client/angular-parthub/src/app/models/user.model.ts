import { Address } from "./address.model";
import { Role } from "./role.model";

export class User {
    id?: any;
    username?: string;
    activated?: boolean;

    firstName?: string;
    lastName?: string;

    email?: string;
    password?: string;

    newPassword?: string;

    newPasswordComfirmed?: string;

    bussnessName?: string;

    bussinessname?: string;

    bussinessUrl?: string;

    phone?: string;

    addresses: Address[] = new Array();
    roles: Role[] = new Array();

    allowMainPage?: boolean = false;
    allowArchiveVehicle?: boolean = false;


    shopDisplayUser?: boolean = false;

    allowAddCompany?: boolean = false;
    allowEditCompany?: boolean = false;
    allowAssignUser?: boolean = false;

    allowAddEmployee?: boolean = false;
    allowAddService?: boolean = false;

    allowAddPayment?: boolean = false;
    allowVerifyPayment?: boolean = false;

    allowUpdateJobStatus?: boolean = false;
    allowChangeJobTargetDate?: boolean = false;

    allowUpdateUser?: boolean = false;

    allowAddAndUpdateVehicle?: boolean = false;
    allowUpdateCustomerInfo?: boolean = false;

    allowUpdateVehicleStatus?: boolean = false;

    allowAddNotes?: boolean = false;
    allowAddReceipt?: boolean = false;
    allowAddCounterInvoice?: boolean = false;

    allowAddUpdateAutopart?: boolean = false;

    allowAddUpdatePurchaseOrder?: boolean = false;
    allowApproveRejectPurchaseOrder?: boolean = false;

    allowAddUpdateEstimate?: boolean = false;
    allowLockEstimate?: boolean = false;
    allowUnlockEstimate?: boolean = false;
    allowViewReport?: boolean = false;
    allowAddAndUpdateReport?: boolean = false;

    allowAddExpense?: boolean = false;

    companyId?: number = 0;

    employeeRoleId?: number = 0;

    partMarketOnly?: boolean = false;

    serachCount?: number = 0;
    totalCount?: number = 0;

    totalCountListed?: number = 0;
    totalCountArchived?: number = 0;

    createdAt: Date = new Date();

    companyUuid?: any;
    companyName?: any;

    token?: any;
}