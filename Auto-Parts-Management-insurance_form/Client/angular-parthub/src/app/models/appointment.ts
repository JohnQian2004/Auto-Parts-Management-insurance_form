import { PayrollHistory } from "./payroll.history.model";

export class Appointment {
    date: string = "";
    patient: string = "";
    cost: number = 0;
    dayName?: any;
    fullDate?: any;

    payrollHistory: PayrollHistory = new PayrollHistory();


}