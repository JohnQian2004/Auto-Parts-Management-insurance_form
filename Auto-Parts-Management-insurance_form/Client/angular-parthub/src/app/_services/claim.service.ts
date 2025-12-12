import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim.model';
import { Config } from '../models/config.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ClaimService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/claims';

  constructor(private http: HttpClient) { }


  createClaim(userId: any, claim: Claim): Observable<Claim> {

    return this.http.post<any>(this.API_URL + "/" + userId, claim, httpOptions);
  }

  updateSeqence(vehicleId: any, SequenceCarriers: SequenceCarrier[]): Observable<Claim[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + vehicleId, SequenceCarriers, httpOptions);
  }

  getClaim(claimId: any): Observable<Claim> {

    return this.http.get<Claim>(this.API_URL + "/" + claimId, httpOptions);
  }

  getAiEstimate(data:any): Observable<any> {

    return this.http.post<any>(this.config.baseUrl + "/fitments/ai/estimate", data, httpOptions);
  }


  deleteClaim(claimId: any, userId: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + claimId + "/" + userId, httpOptions);
  }

  deleteClaimWithOption(claimId: any, userId: any, optionNumber: any): Observable<any> {

    return this.http.delete<any>(this.API_URL + "/" + claimId + "/" + userId + "/" + optionNumber, httpOptions);
  }


  getAllVehicleClaims(vehicleId: any): Observable<Claim[]> {

    return this.http.get<Claim[]>(this.API_URL + "/vehicle/" + vehicleId, httpOptions);
  }
}
