import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface TripHighlightDto {
  id?: number;
  highlight: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
  tripId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TripHighlightService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  // Get all highlights for a specific trip
  getHighlightsByTripId(tripId: number): Observable<TripHighlightDto[]> {
    const url = `${this.baseUrl}/trip-highlights/trip/${tripId}`;
    return this.http.get<TripHighlightDto[]>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get a specific highlight by ID
  getHighlightById(id: number): Observable<TripHighlightDto> {
    const url = `${this.baseUrl}/trip-highlights/${id}`;
    return this.http.get<TripHighlightDto>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new highlight to a trip
  addHighlight(tripId: number, highlightDto: TripHighlightDto): Observable<TripHighlightDto> {
    const url = `${this.baseUrl}/trip-highlights`;
    const payload = { ...highlightDto, tripId };
    return this.http.post<TripHighlightDto>(url, payload, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing highlight
  updateHighlight(id: number, highlightDto: TripHighlightDto): Observable<TripHighlightDto> {
    const url = `${this.baseUrl}/trip-highlights/${id}`;
    return this.http.put<TripHighlightDto>(url, highlightDto, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a highlight (soft delete)
  deleteHighlight(id: number): Observable<void> {
    const url = `${this.baseUrl}/trip-highlights/${id}`;
    return this.http.delete<void>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update sort order for a highlight
  updateSortOrder(id: number, sortOrder: number): Observable<TripHighlightDto> {
    const url = `${this.baseUrl}/trip-highlights/${id}/sort-order`;
    return this.http.patch<TripHighlightDto>(url, { sortOrder }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update status (activate/deactivate) for a highlight
  updateStatus(id: number, isActive: boolean): Observable<TripHighlightDto> {
    const url = `${this.baseUrl}/trip-highlights/${id}/status`;
    return this.http.patch<TripHighlightDto>(url, { isActive }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Bulk reorder highlights for a trip
  reorderHighlights(tripId: number, highlightIds: number[]): Observable<TripHighlightDto[]> {
    const url = `${this.baseUrl}/trip-highlights/trip/${tripId}/reorder`;
    return this.http.put<TripHighlightDto[]>(url, highlightIds, {
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
    console.error('TripHighlightService error:', error);
    return throwError(() => error);
  }
}
