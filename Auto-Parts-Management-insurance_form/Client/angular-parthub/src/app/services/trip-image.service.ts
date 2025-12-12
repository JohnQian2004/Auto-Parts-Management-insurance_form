import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface TripImageDto {
  id?: number;
  imageUrl: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
  tripId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TripImageService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  // Get all images for a specific trip
  getImagesByTripId(tripId: number): Observable<TripImageDto[]> {
    const url = `${this.baseUrl}/trip-images/trip/${tripId}`;
    return this.http.get<TripImageDto[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Get a specific image by ID
  getImageById(id: number): Observable<TripImageDto> {
    const url = `${this.baseUrl}/trip-images/${id}`;
    return this.http.get<TripImageDto>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new image to a trip
  addImage(tripId: number, imageDto: TripImageDto): Observable<TripImageDto> {
    const url = `${this.baseUrl}/trip-images`;
    const payload = { ...imageDto, tripId };
    return this.http.post<TripImageDto>(url, payload).pipe(
      catchError(this.handleError)
    );
  }

  // Update an existing image
  updateImage(id: number, imageDto: TripImageDto): Observable<TripImageDto> {
    const url = `${this.baseUrl}/trip-images/${id}`;
    return this.http.put<TripImageDto>(url, imageDto).pipe(
      catchError(this.handleError)
    );
  }

  // Delete an image (soft delete)
  deleteImage(id: number): Observable<void> {
    const url = `${this.baseUrl}/trip-images/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Update sort order for an image
  updateSortOrder(id: number, sortOrder: number): Observable<TripImageDto> {
    const url = `${this.baseUrl}/trip-images/${id}/sort-order`;
    return this.http.patch<TripImageDto>(url, { sortOrder }).pipe(
      catchError(this.handleError)
    );
  }

  // Update status (activate/deactivate) for an image
  updateStatus(id: number, isActive: boolean): Observable<TripImageDto> {
    const url = `${this.baseUrl}/trip-images/${id}/status`;
    return this.http.patch<TripImageDto>(url, { isActive }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('TripImageService error:', error);
    return throwError(() => error);
  }
}
