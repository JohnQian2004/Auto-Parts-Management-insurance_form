import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface TripInclusionDto {
  id?: number;
  inclusion: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
  tripId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TripInclusionService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  // Get all inclusions for a specific trip
  getInclusionsByTripId(tripId: number): Observable<TripInclusionDto[]> {
    const url = `${this.baseUrl}/trip-inclusions/trip/${tripId}`;
    return this.http.get<TripInclusionDto[]>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get a specific inclusion by ID
  getInclusionById(id: number): Observable<TripInclusionDto> {
    const url = `${this.baseUrl}/trip-inclusions/${id}`;
    return this.http.get<TripInclusionDto>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new inclusion to a trip
  addInclusion(tripId: number, inclusionDto: TripInclusionDto): Observable<TripInclusionDto> {
    const url = `${this.baseUrl}/trip-inclusions/trip/${tripId}`;
    const payload = { ...inclusionDto, tripId };
    return this.http.post<TripInclusionDto>(url, payload, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing inclusion
  updateInclusion(id: number, inclusionDto: TripInclusionDto): Observable<TripInclusionDto> {
    const url = `${this.baseUrl}/trip-inclusions/${id}`;
    return this.http.put<TripInclusionDto>(url, inclusionDto, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete an inclusion (soft delete)
  deleteInclusion(id: number): Observable<void> {
    const url = `${this.baseUrl}/trip-inclusions/${id}`;
    return this.http.delete<void>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update sort order for an inclusion
  updateSortOrder(id: number, sortOrder: number): Observable<TripInclusionDto> {
    const url = `${this.baseUrl}/trip-inclusions/${id}/sort-order`;
    return this.http.patch<TripInclusionDto>(url, { sortOrder }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update status (activate/deactivate) for an inclusion
  updateStatus(id: number, isActive: boolean): Observable<TripInclusionDto> {
    const url = `${this.baseUrl}/trip-inclusions/${id}/status`;
    return this.http.patch<TripInclusionDto>(url, { isActive }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Reorder inclusions for a trip
  reorderInclusions(tripId: number, inclusionIds: number[]): Observable<TripInclusionDto[]> {
    const url = `${this.baseUrl}/trip-inclusions/trip/${tripId}/reorder`;
    return this.http.put<TripInclusionDto[]>(url, inclusionIds, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.configService.getAuthToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private handleError(error: any) {
    console.error('TripInclusionService error:', error);
    return throwError(() => error);
  }
}
