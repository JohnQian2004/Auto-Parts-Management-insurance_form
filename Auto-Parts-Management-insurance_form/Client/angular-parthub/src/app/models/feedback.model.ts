export class Feedback {

    id: any = 0;
    companyId?: number;
    userId?: number;

    name?: string ;
    comments?: string ;
    
    viewed?: boolean;
    reply?: string;
    replyViewd?: boolean;

    createdAt: Date = new Date();
    updatedAt: Date = new Date();
    replyedAt: Date = new Date();
    
    user?:any;

    company?:any;

    totalCount?:any;
    serachCount?:any;
    searchCount?:any;

    reason:any = "";
     
}