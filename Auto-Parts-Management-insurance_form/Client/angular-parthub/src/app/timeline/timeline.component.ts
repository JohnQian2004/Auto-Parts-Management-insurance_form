import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';
import { PayrollHistory } from '../models/payroll.history.model';

@Component({
  selector: 'my-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent {

  @Input() payrollHistories: any = [];
 

  getPayrollTotal():any{
    var total = 0;
    for(let payrollHistory of this.payrollHistories){
      total += payrollHistory.job.price;
    }
    return total;
  }
}
