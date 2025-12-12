import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface TripActivityDto {
  id?: number;
  time: string;
  description: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
  tripId: number;
  itineraryId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TripActivityService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  // Get all activities for a specific trip
  getActivitiesByTripId(tripId: number): Observable<TripActivityDto[]> {
    const url = `${this.baseUrl}/trip-activities/trip/${tripId}`;
    return this.http.get<TripActivityDto[]>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get a specific activity by ID
  getActivityById(id: number): Observable<TripActivityDto> {
    const url = `${this.baseUrl}/trip-activities/${id}`;
    return this.http.get<TripActivityDto>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new activity to a trip
  addActivity(tripId: number, activityDto: TripActivityDto): Observable<TripActivityDto> {
    const url = `${this.baseUrl}/trip-activities/trip/${tripId}`;
    const payload = { ...activityDto, tripId };
    return this.http.post<TripActivityDto>(url, payload, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing activity
  updateActivity(id: number, activityDto: TripActivityDto): Observable<TripActivityDto> {
    const url = `${this.baseUrl}/trip-activities/${id}`;
    return this.http.put<TripActivityDto>(url, activityDto, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete an activity (soft delete)
  deleteActivity(id: number): Observable<void> {
    const url = `${this.baseUrl}/trip-activities/${id}`;
    return this.http.delete<void>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update sort order for an activity
  updateSortOrder(id: number, sortOrder: number): Observable<TripActivityDto> {
    const url = `${this.baseUrl}/trip-activities/${id}/sort-order`;
    return this.http.patch<TripActivityDto>(url, { sortOrder }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update status (activate/deactivate) for an activity
  updateStatus(id: number, isActive: boolean): Observable<TripActivityDto> {
    const url = `${this.baseUrl}/trip-activities/${id}/status`;
    return this.http.patch<TripActivityDto>(url, { isActive }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Reorder activities for an itinerary day
  reorderActivities(itineraryId: number, activityIds: number[]): Observable<TripActivityDto[]> {
    const url = `${this.baseUrl}/trip-activities/itinerary/${itineraryId}/reorder`;
    return this.http.put<TripActivityDto[]>(url, activityIds, {
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
    console.error('TripActivityService error:', error);
    return throwError(() => error);
  }
}
