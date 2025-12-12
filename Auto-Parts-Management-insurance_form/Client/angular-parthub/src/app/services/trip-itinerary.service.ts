import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface TripItineraryDto {
  id?: number;
  dayNumber: number;
  title: string;
  description: string;
  accommodation: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
  tripId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TripItineraryService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  // Get all itinerary days for a specific trip
  getItineraryByTripId(tripId: number): Observable<TripItineraryDto[]> {
    const url = `${this.baseUrl}/trip-itinerary/trip/${tripId}`;
    return this.http.get<TripItineraryDto[]>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get a specific itinerary day by ID
  getItineraryById(id: number): Observable<TripItineraryDto> {
    const url = `${this.baseUrl}/trip-itinerary/${id}`;
    return this.http.get<TripItineraryDto>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new itinerary day to a trip
  addItinerary(tripId: number, itineraryDto: TripItineraryDto): Observable<TripItineraryDto> {
    const url = `${this.baseUrl}/trip-itinerary/trip/${tripId}`;
    const payload = { ...itineraryDto, tripId };
    return this.http.post<TripItineraryDto>(url, payload, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing itinerary day
  updateItinerary(id: number, itineraryDto: TripItineraryDto): Observable<TripItineraryDto> {
    const url = `${this.baseUrl}/trip-itinerary/${id}`;
    return this.http.put<TripItineraryDto>(url, itineraryDto, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete an itinerary day (soft delete)
  deleteItinerary(id: number): Observable<void> {
    const url = `${this.baseUrl}/trip-itinerary/${id}`;
    return this.http.delete<void>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update sort order for an itinerary day
  updateSortOrder(id: number, sortOrder: number): Observable<TripItineraryDto> {
    const url = `${this.baseUrl}/trip-itinerary/${id}/sort-order`;
    return this.http.patch<TripItineraryDto>(url, { sortOrder }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update status (activate/deactivate) for an itinerary day
  updateStatus(id: number, isActive: boolean): Observable<TripItineraryDto> {
    const url = `${this.baseUrl}/trip-itinerary/${id}/status`;
    return this.http.patch<TripItineraryDto>(url, { isActive }, {
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
    console.error('TripItineraryService error:', error);
    return throwError(() => error);
  }
}
