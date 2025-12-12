import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { EmployeeRole } from '../models/employee.role.model';
 

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class EmployeeRoleService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/employeeroles';

  constructor(private http: HttpClient) { }


  createEmployeeRole(userId: any, employeeRole: EmployeeRole): Observable<EmployeeRole> {

    return this.http.post<any>(this.API_URL + "/" + userId, employeeRole, httpOptions);
  }

  getEmployeeRole(employeeRoleId: any): Observable<EmployeeRole> {

    return this.http.get<EmployeeRole>(this.API_URL + "/" + employeeRoleId, httpOptions);
  }

  deleteEmployeeRole(employeeRoleId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + employeeRoleId, httpOptions);
  }

  getAllCompanyEmployeeRole(companyId: any): Observable<EmployeeRole[]> {

    return this.http.get<EmployeeRole[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  getAllCompanyEmployeeRoleUuid(uuid: any): Observable<EmployeeRole[]> {

    return this.http.get<EmployeeRole[]>(this.API_URL + "/company/uuid/" + uuid, httpOptions);
  }

}
