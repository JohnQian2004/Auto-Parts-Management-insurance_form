import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { InsuranceClaim } from '../models/insurance.claim.model';
import { InsuranceDocument } from '../models/insurance.document.model';
import { InsuranceClaimViewResponse } from '../models/insurance.claim.view.response.model';
import { InsuranceClaimStatusUpdate } from '../models/insurance.claim.status.update.model';
import { SequenceCarrier } from '../models/sequence.carrier.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class InsuranceService {

  config: Config = new Config();

  API_URL = this.config.baseUrl + '/insurance';

  constructor(private http: HttpClient) { }

  // Authentication endpoints
  validateAccess(companyCode: string, publicUuid: string, privateKey: string): Observable<any> {
    const params = new HttpParams().set('privateKey', privateKey);
    return this.http.get<any>(`${this.API_URL}/access/${companyCode}/${publicUuid}`, { params });
  }

  // Claims Management
  getClaim(companyCode: string, publicUuid: string, privateKey: string): Observable<InsuranceClaimViewResponse> {
    const params = new HttpParams().set('privateKey', privateKey);
    return this.http.get<InsuranceClaimViewResponse>(`${this.API_URL}/claim/${companyCode}/${publicUuid}`, { params });
  }

  updateClaimStatus(companyCode: string, publicUuid: string, privateKey: string, update: InsuranceClaimStatusUpdate): Observable<InsuranceClaim> {
    const params = new HttpParams().set('privateKey', privateKey);
    return this.http.post<InsuranceClaim>(`${this.API_URL}/status/${companyCode}/${publicUuid}`, update, { params });
  }

  // Document Management
  uploadDocument(companyCode: string, publicUuid: string, privateKey: string, 
                description: string, docTypeId: string, file: File): Observable<InsuranceDocument> {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('docTypeId', docTypeId);
    formData.append('file', file);
    
    const params = new HttpParams().set('privateKey', privateKey);
    return this.http.post<InsuranceDocument>(`${this.API_URL}/documents/${companyCode}/${publicUuid}`, formData, { params });
  }

  getDocuments(companyCode: string, publicUuid: string, privateKey: string): Observable<InsuranceDocument[]> {
    const params = new HttpParams().set('privateKey', privateKey);
    return this.http.get<InsuranceDocument[]>(`${this.API_URL}/documents/${companyCode}/${publicUuid}`, { params });
  }

  updateDocument(companyCode: string, documentId: number, privateKey: string, 
                description?: string, docTypeId?: string, file?: File): Observable<any> {
    const formData = new FormData();
    if (description) formData.append('description', description);
    if (docTypeId) formData.append('docTypeId', docTypeId);
    if (file) formData.append('file', file);
    
    const params = new HttpParams().set('privateKey', privateKey);
    return this.http.put<any>(`${this.API_URL}/documents/${companyCode}/${documentId}`, formData, { params });
  }

  deleteDocument(companyCode: string, documentId: number, privateKey: string): Observable<any> {
    const params = new HttpParams().set('privateKey', privateKey);
    return this.http.delete<any>(`${this.API_URL}/documents/${companyCode}/${documentId}`, { params });
  }

  // Document sequence management
  updateSequenceNumber(companyCode: string, publicUuid: string, privateKey: string, 
                      sequenceCarriers: SequenceCarrier[]): Observable<InsuranceDocument[]> {
    const params = new HttpParams().set('privateKey', privateKey);
    return this.http.post<InsuranceDocument[]>(`${this.API_URL}/documents/sequence/${companyCode}/${publicUuid}`, sequenceCarriers, { params });
  }

  // Document type assignment
  setDocumentDocType(companyCode: string, documentId: number, docTypeId: number, privateKey: string): Observable<any> {
    const params = new HttpParams().set('privateKey', privateKey);
    return this.http.put<any>(`${this.API_URL}/documents/${companyCode}/${documentId}/doctype/${docTypeId}`, null, { params });
  }

  // File download
  downloadDocument(token: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/documents/download/${token}`, { responseType: 'blob' });
  }

  // Bulk upload
  bulkUploadDocuments(companyCode: string, publicUuid: string, privateKey: string, 
                     files: File[], docTypeId: string, descriptions: string[]): Observable<InsuranceDocument[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('docTypeId', docTypeId);
    descriptions.forEach(description => formData.append('descriptions', description));
    
    const params = new HttpParams().set('privateKey', privateKey);
    return this.http.post<InsuranceDocument[]>(`${this.API_URL}/documents/bulk/${companyCode}/${publicUuid}`, formData, { params });
  }
}
