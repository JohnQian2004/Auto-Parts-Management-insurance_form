import { Payment } from "./payment.model";
 
export class DayDataCarrier {
    
    dayName: string = ""; //e.g. Monday, Tuesday etc
    date: Date = new Date();

    data: Payment[] = new Array();

}