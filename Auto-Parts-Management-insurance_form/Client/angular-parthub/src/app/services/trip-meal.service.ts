import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface TripMealDto {
  id?: number;
  mealType: string;
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
export class TripMealService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  // Get all meals for a specific trip
  getMealsByTripId(tripId: number): Observable<TripMealDto[]> {
    const url = `${this.baseUrl}/trip-meals/trip/${tripId}`;
    return this.http.get<TripMealDto[]>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get a specific meal by ID
  getMealById(id: number): Observable<TripMealDto> {
    const url = `${this.baseUrl}/trip-meals/${id}`;
    return this.http.get<TripMealDto>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new meal to a trip
  addMeal(tripId: number, mealDto: TripMealDto): Observable<TripMealDto> {
    const url = `${this.baseUrl}/trip-meals/trip/${tripId}`;
    const payload = { ...mealDto, tripId };
    return this.http.post<TripMealDto>(url, payload, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing meal
  updateMeal(id: number, mealDto: TripMealDto): Observable<TripMealDto> {
    const url = `${this.baseUrl}/trip-meals/${id}`;
    return this.http.put<TripMealDto>(url, mealDto, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a meal (soft delete)
  deleteMeal(id: number): Observable<void> {
    const url = `${this.baseUrl}/trip-meals/${id}`;
    return this.http.delete<void>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update sort order for a meal
  updateSortOrder(id: number, sortOrder: number): Observable<TripMealDto> {
    const url = `${this.baseUrl}/trip-meals/${id}/sort-order`;
    return this.http.patch<TripMealDto>(url, { sortOrder }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update status (activate/deactivate) for a meal
  updateStatus(id: number, isActive: boolean): Observable<TripMealDto> {
    const url = `${this.baseUrl}/trip-meals/${id}/status`;
    return this.http.patch<TripMealDto>(url, { isActive }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Reorder meals for an itinerary day
  reorderMeals(itineraryId: number, mealIds: number[]): Observable<TripMealDto[]> {
    const url = `${this.baseUrl}/trip-meals/itinerary/${itineraryId}/reorder`;
    return this.http.put<TripMealDto[]>(url, mealIds, {
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
    console.error('TripMealService error:', error);
    return throwError(() => error);
  }
}
