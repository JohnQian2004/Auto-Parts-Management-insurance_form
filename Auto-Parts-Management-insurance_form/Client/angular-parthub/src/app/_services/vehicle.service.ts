import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

import { Vehicle } from '../models/vehicle.model';
import { GroupBy } from '../models/groupBy.model';
import { Config } from '../models/config.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';
import { ReportCarrier } from '../models/report.carrier.model';
import { PdfFile } from '../models/pdfFile.model';
import { ImageModel } from '../models/imageModel.model';




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class VehicleService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/vehicles';

  API_URL_PDF = this.config.baseUrl + '/pdf';


  API_URL_OVERVIEW = this.config.baseUrl + '/overviews/status';

  API_URL_OVERVIEW_SPECIAL = this.config.baseUrl + '/overviews/special';

  API_URL_LOCATION_OVERVIEW = this.config.baseUrl + '/overviews/location';

  API_URL_OVERVIEW_VEHICLE = this.config.baseUrl + '/overviews/vehicle';

  API_URL_SEARCH_Phone = this.config.baseUrl + '/vehicles/customer/phone';

  API_URL_SEARCH_LastName = this.config.baseUrl + '/vehicles/customer/lastname';

  baseUrlSearchByYearMakeModelColor = this.config.baseUrl + '/vehicles/search';

  API_URL_IMAGE_VEHICLE = this.config.baseUrl + '/vehicle/images';


  constructor(private http: HttpClient) { }

  get(id: any): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.API_URL}/${id}`);
  }

  getByUuid(uuid: any): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.API_URL}/search/vehicle/${uuid}`);
  }

  setImageForSearch(imageId: any, vehicleId: String): Observable<any> {

    return this.http.put(this.API_URL_IMAGE_VEHICLE + "/" + vehicleId + "/" + imageId, null);
  }

  setImageDocType(docType: any, imageId: any, vehicleId: String): Observable<any> {

    return this.http.put(this.API_URL_IMAGE_VEHICLE + "/" + vehicleId + "/" + imageId + "/" + docType, null);
  }

  setImageDocTypeWithUserId(docType: any, imageId: any, vehicleId: String, userId: any): Observable<any> {

    return this.http.put(this.API_URL_IMAGE_VEHICLE + "/" + vehicleId + "/" + imageId + "/" + docType + "/" + userId, null);
  }

  deleteImage(imageId: any, autopartId: String, userId: any): Observable<any> {

    return this.http.delete(this.API_URL_IMAGE_VEHICLE + "/" + autopartId + "/" + imageId + "/" + userId);
  }

  createAndUpdateVehicle(userId: any, vehicle: Vehicle): Observable<Vehicle> {

    return this.http.post<any>(this.API_URL + "/" + userId, vehicle, httpOptions);
  }

  createAndUpdateVehicleExternal(userId: any, vehicle: Vehicle): Observable<Vehicle> {

    return this.http.post<any>(this.API_URL + "/external/" + userId, vehicle, httpOptions);
  }


  getVehicle(vehicleId: any): Observable<Vehicle> {

    return this.http.get<Vehicle>(this.API_URL + "/" + vehicleId, httpOptions);
  }

  searchLastName(companyId: any, lastName: any): Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(this.API_URL_SEARCH_LastName + "/" + companyId + "/" + lastName, httpOptions);
  }

  searchVehicleVin6(companyId: any, Vin6: any): Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(this.API_URL + "/vin/" + companyId + "/" + Vin6, httpOptions);
  }

  searchPhone(companyId: any, phone: any): Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(this.API_URL_SEARCH_Phone + "/" + companyId + "/" + phone, httpOptions);
  }

  searchEmplyeeVehicles(uuid: any): Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(this.API_URL + "/search/employee/" + uuid, httpOptions);
  }

  uploadImage(data: any, vehicleId: String): Observable<any> {

    return this.http.post(this.API_URL_IMAGE_VEHICLE + "/" + vehicleId, data);
  }

  uploadImageWithFile(data: any, vehicleId: String): Observable<any> {

    return this.http.post(this.API_URL_IMAGE_VEHICLE + "/file/" + vehicleId, data);
  }

  uploadImageWithFileUserId(data: any, vehicleId: String, userId: any): Observable<any> {

    return this.http.post(this.API_URL_IMAGE_VEHICLE + "/file/" + vehicleId + "/" + userId, data);
  }


  uploadImageWithFileUuidEmployee(data: any, vehicleId: String, uuidEmployee: any): Observable<any> {

    return this.http.post(this.API_URL_IMAGE_VEHICLE + "/file/employee/" + vehicleId + "/" + uuidEmployee, data);
  }

  uploadPdfWithFile(data: any, vehicleId: String, userId: any): Observable<any> {

    return this.http.post(this.API_URL_PDF + "/file/" + vehicleId + "/" + userId, data);
  }

  deletePdf(pdfFileToken: any, vehicleId: String, userId: any): Observable<any> {

    return this.http.delete(this.API_URL_PDF + "/" + vehicleId + "/" + pdfFileToken + "/" + userId);
  }

  getPdfFiles(vehicleId: any): Observable<PdfFile[]> {
    return this.http.get<PdfFile[]>(this.API_URL_PDF + "/" + vehicleId);
  }

  searchByYearMakeModelColor(data: any): Observable<any> {
    return this.http.post(this.baseUrlSearchByYearMakeModelColor, data);
  }

  searchByYearMakeModelColorSnapshot(data: any): Observable<any> {
    return this.http.post(this.config.baseUrl + '/vehicles/search/snapshot', data);
  }

  getOverview(companyId: any): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.API_URL_OVERVIEW + "/" + companyId, httpOptions);
  }

  getOverviewSpecial(companyId: any): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.API_URL_OVERVIEW_SPECIAL + "/" + companyId, httpOptions);
  }

  getJobRequestTypeOverview(companyId: any): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.config.baseUrl + '/overviews/jobrequesttype' + "/" + companyId, httpOptions);
  }

  getJobRequestTypeOverviewSpecial(companyId: any): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.config.baseUrl + '/overviews/jobrequesttype/special' + "/" + companyId, httpOptions);
  }

  getAssignedToOverview(companyId: any): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.config.baseUrl + '/overviews/assignedto' + "/" + companyId, httpOptions);
  }

  updateSeqence(companyId: any, SequenceCarriers: SequenceCarrier[]): Observable<Vehicle[]> {

    return this.http.post<any>(this.API_URL + "/sequence/" + companyId, SequenceCarriers, httpOptions);
  }

  updateImageVehicleSeqence(vehicleId: any, SequenceCarriers: SequenceCarrier[]): Observable<ImageModel[]> {

    return this.http.post<any>(this.API_URL_IMAGE_VEHICLE + "/sequence/" + vehicleId, SequenceCarriers, httpOptions);
  }

  getLocationOverview(companyId: any): Observable<GroupBy[]> {

    return this.http.get<GroupBy[]>(this.API_URL_LOCATION_OVERVIEW + "/" + companyId, httpOptions);
  }

  getVehicleCountOverview(companyId: any, data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.API_URL_OVERVIEW_VEHICLE + "/" + companyId, data, httpOptions);
  }

  getVehicleCountDaily(companyId: any, data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.API_URL_OVERVIEW_VEHICLE + "/daily/" + companyId, data, httpOptions);
  }


  getAllVehiclesDate(companyId: any, data: any): Observable<Vehicle[]> {

    return this.http.post<Vehicle[]>(this.API_URL + "/date/" + companyId, data, httpOptions);
  }

  getAllVehiclesStatus(companyId: any, status: any): Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(this.API_URL + "/status/" + companyId + "/" + status, httpOptions);

  }


  deleteVehicle(vehicleId: any): Observable<Vehicle> {

    return this.http.delete<any>(this.API_URL + "/" + vehicleId, httpOptions);
  }

  getAllVehiclesWithUuid(uuid: any): Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(this.API_URL + "/search/company/" + uuid, httpOptions);

  }

  getAllVehiclesWithUuidWithJobs(uuid: any): Observable<Vehicle[]> {

    return this.http.get<Vehicle[]>(this.API_URL + "/search/company/job/" + uuid, httpOptions);

  }

  getVehicleCountShopOverview(companyId: any, data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/vehicle/shop/" + companyId, data, httpOptions);
  }

  getShopvehicleImageCountOverview(data: any): Observable<ReportCarrier> {

    return this.http.post<ReportCarrier>(this.config.baseUrl + "/overviews/shop/vehicle/image/", data);
  }
}
