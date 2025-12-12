import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { PaymentStatus } from '../models/payment.status.model';
import { Rental } from '../models/rental.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class RentalService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/rentals';

  constructor(private http: HttpClient) { }


  createRental(userId: any, rental: Rental): Observable<Rental> {

    return this.http.post<any>(this.API_URL + "/" + userId, rental, httpOptions);
  }

  getRental(rentalId: any): Observable<Rental> {

    return this.http.get<Rental>(this.API_URL + "/" + rentalId, httpOptions);
  }

  deleteRental(rentalId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + rentalId, httpOptions);
  }

  getAllCompanyRental(companyId: any): Observable<Rental[]> {

    return this.http.get<Rental[]>(this.API_URL + "/company/" + companyId, httpOptions);
  }


}
