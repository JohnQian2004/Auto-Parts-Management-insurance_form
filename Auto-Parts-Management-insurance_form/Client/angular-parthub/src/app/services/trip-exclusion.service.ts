import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface TripExclusionDto {
  id?: number;
  exclusion: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
  tripId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TripExclusionService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  // Get all exclusions for a specific trip
  getExclusionsByTripId(tripId: number): Observable<TripExclusionDto[]> {
    const url = `${this.baseUrl}/trip-exclusions/trip/${tripId}`;
    return this.http.get<TripExclusionDto[]>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get a specific exclusion by ID
  getExclusionById(id: number): Observable<TripExclusionDto> {
    const url = `${this.baseUrl}/trip-exclusions/${id}`;
    return this.http.get<TripExclusionDto>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new exclusion to a trip
  addExclusion(tripId: number, exclusionDto: TripExclusionDto): Observable<TripExclusionDto> {
    const url = `${this.baseUrl}/trip-exclusions/trip/${tripId}`;
    const payload = { ...exclusionDto, tripId };
    return this.http.post<TripExclusionDto>(url, payload, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing exclusion
  updateExclusion(id: number, exclusionDto: TripExclusionDto): Observable<TripExclusionDto> {
    const url = `${this.baseUrl}/trip-exclusions/${id}`;
    return this.http.put<TripExclusionDto>(url, exclusionDto, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete an exclusion (soft delete)
  deleteExclusion(id: number): Observable<void> {
    const url = `${this.baseUrl}/trip-exclusions/${id}`;
    return this.http.delete<void>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update sort order for an exclusion
  updateSortOrder(id: number, sortOrder: number): Observable<TripExclusionDto> {
    const url = `${this.baseUrl}/trip-exclusions/${id}/sort-order`;
    return this.http.patch<TripExclusionDto>(url, { sortOrder }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update status (activate/deactivate) for an exclusion
  updateStatus(id: number, isActive: boolean): Observable<TripExclusionDto> {
    const url = `${this.baseUrl}/trip-exclusions/${id}/status`;
    return this.http.patch<TripExclusionDto>(url, { isActive }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Reorder exclusions for a trip
  reorderExclusions(tripId: number, exclusionIds: number[]): Observable<TripExclusionDto[]> {
    const url = `${this.baseUrl}/trip-exclusions/trip/${tripId}/reorder`;
    return this.http.put<TripExclusionDto[]>(url, exclusionIds, {
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
    console.error('TripExclusionService error:', error);
    return throwError(() => error);
  }
}
