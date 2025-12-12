import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface TripAvailabilityDto {
  id?: number;
  date: string;
  maxCapacity: number;
  availableSpots: number;
  price: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
  tripId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TripAvailabilityService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all availability slots for a specific trip
  getAvailabilityByTripId(tripId: number): Observable<TripAvailabilityDto[]> {
    const url = `${this.baseUrl}/trip-availability/trip/${tripId}`;
    return this.http.get<TripAvailabilityDto[]>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get a specific availability slot by ID
  getAvailabilityById(id: number): Observable<TripAvailabilityDto> {
    const url = `${this.baseUrl}/trip-availability/${id}`;
    return this.http.get<TripAvailabilityDto>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new availability slot to a trip
  addAvailability(tripId: number, availabilityDto: TripAvailabilityDto): Observable<TripAvailabilityDto> {
    const url = `${this.baseUrl}/trip-availability/trip/${tripId}`;
    const payload = { ...availabilityDto, tripId };
    return this.http.post<TripAvailabilityDto>(url, payload, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing availability slot
  updateAvailability(id: number, availabilityDto: TripAvailabilityDto): Observable<TripAvailabilityDto> {
    const url = `${this.baseUrl}/trip-availability/${id}`;
    return this.http.put<TripAvailabilityDto>(url, availabilityDto, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete an availability slot (soft delete)
  deleteAvailability(id: number): Observable<void> {
    const url = `${this.baseUrl}/trip-availability/${id}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Update capacity for an availability slot
  updateCapacity(id: number, maxCapacity: number): Observable<TripAvailabilityDto> {
    const url = `${this.baseUrl}/trip-availability/${id}/capacity`;
    return this.http.patch<TripAvailabilityDto>(url, { maxCapacity }, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Update available spots for an availability slot
  updateAvailableSpots(id: number, availableSpots: number): Observable<TripAvailabilityDto> {
    const url = `${this.baseUrl}/trip-availability/${id}/available-spots`;
    return this.http.patch<TripAvailabilityDto>(url, { availableSpots }, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Update status (activate/deactivate) for an availability slot
  updateStatus(id: number, isActive: boolean): Observable<TripAvailabilityDto> {
    const url = `${this.baseUrl}/trip-availability/${id}/status`;
    return this.http.patch<TripAvailabilityDto>(url, { isActive }, { headers: this.getAuthHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Update price for an availability slot
  updatePrice(id: number, price: number): Observable<TripAvailabilityDto> {
    const url = `${this.baseUrl}/trip-availability/${id}/price`;
    return this.http.put<TripAvailabilityDto>(url, null, {
      params: { price: price.toString() },
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('TripAvailabilityService error:', error);
    return throwError(() => error);
  }
}
