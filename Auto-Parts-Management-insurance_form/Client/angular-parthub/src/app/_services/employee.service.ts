import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Company } from '../models/company.model';
import { Employee } from '../models/employee.model';
import { Config } from '../models/config.model';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class EmployeeService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/employees';

  constructor(private http: HttpClient) { }


  createEmployee(userId: any, employee: Employee): Observable<Company> {

    return this.http.post<any>(this.API_URL + "/" + userId, employee, httpOptions);
  }

  getEmployee(employeeId: any): Observable<Employee> {

    return this.http.get<Employee>(this.API_URL + "/" + employeeId, httpOptions);
  }

  getEmployeeWithUuid(uuid: any): Observable<Employee> {

    return this.http.get<Employee>(this.API_URL + "/uuid/" + uuid, httpOptions);
  }

  getCompanyEmployeesByEmployeeUuid(uuid: any): Observable<Employee[]> {

    return this.http.get<Employee[]>(this.API_URL + "/employee/uuid/" + uuid, httpOptions);
  }
 

  deleteEmployee(employeeId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + employeeId, httpOptions);
  }

  getAllEmployees(): Observable<Employee[]> {

    return this.http.get<Employee[]>(this.API_URL, httpOptions);
  }

  getComponyEmployees(companyId: any): Observable<Employee[]> {

    return this.http.get<Employee[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }

  getComponyEmployeesUuid(uuid: any): Observable<Employee[]> {

    return this.http.get<Employee[]>(this.API_URL + "/company/uuid/" + uuid, httpOptions);
  }
}
