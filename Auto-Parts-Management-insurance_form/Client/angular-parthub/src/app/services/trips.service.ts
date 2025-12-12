import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from './config.service';

// Trip-related interfaces matching the backend
export interface TripAvailability {
  id?: number;
  date: string;
  availableSpots: number;
  maxCapacity: number;
  price: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface TripActivity {
  id?: number;
  time: string;
  description: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface TripMeal {
  id?: number;
  mealType: string;
  description: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface TripItinerary {
  id?: number;
  dayNumber: number;
  title: string;
  description: string;
  accommodation: string;
  sortOrder?: number;
  isActive?: boolean;
  activities?: TripActivity[];
  meals?: TripMeal[];
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface TripImage {
  id?: number;
  imageUrl: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface TripImageModel {
  id?: number;
  fileName: string;
  fileSize?: number;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
  isMainImage?: boolean;
  createdAt?: string;
  updatedAt?: string;
  tripId?: number;
}

export interface TripInclusion {
  id?: number;
  inclusion: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface TripExclusion {
  id?: number;
  exclusion: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface TripHighlight {
  id?: number;
  highlight: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface TripDto {
  id?: number;
  name: string;
  destination: string;
  duration: string;
  basePrice: number;
  mainImage?: string;
  categoryId: number;
  description: string;
  difficulty: 'EASY' | 'MODERATE' | 'CHALLENGING';
  groupSizeMin: number;
  groupSizeMax: number;
  maxCapacity: number;
  bestTime?: string;
  cancellationPolicy?: string;
  isActive?: boolean;
  images?: TripImage[];
  imageModels?: TripImageModel[]; // Add this line
  inclusions?: TripInclusion[];
  exclusions?: TripExclusion[];
  highlights?: TripHighlight[];
  availability?: TripAvailability[];
  itinerary?: TripItinerary[];
  createdAt?: string;
  lastModifiedAt?: string;
}

export interface TripResponse {
  content: TripDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  private currentLanguage = 'en';

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  get baseUrl(): string {
    return this.configService.apiBaseUrl;
  }

  private getLanguageParam(): string {
    return this.currentLanguage || this.configService.defaultLanguage;
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

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.error?.message || 'An error occurred while processing your request'));
  }

  // ===== TRIP CRUD OPERATIONS =====

  // Get all trips with pagination
  getAllTrips(page: number = 0, size: number = 20): Observable<TripResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<TripResponse>(`${this.baseUrl}/trips`, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get trip by ID
  getTripById(id: number): Observable<TripDto> {
    return this.http.get<TripDto>(`${this.baseUrl}/trips/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Create new trip
  createTrip(tripData: TripDto): Observable<TripDto> {
    return this.http.post<TripDto>(`${this.baseUrl}/trips`, tripData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update existing trip
  updateTrip(id: number, tripData: TripDto): Observable<TripDto> {
    return this.http.put<TripDto>(`${this.baseUrl}/trips/${id}`, tripData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update trip basic information only (new modular approach)
  updateTripBasic(id: number, tripData: TripDto): Observable<TripDto> {
    return this.http.put<TripDto>(`${this.baseUrl}/trips/${id}/basic`, tripData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete trip
  deleteTrip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/trips/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ===== TRIP QUERY OPERATIONS =====

  // Get trips by category
  getTripsByCategory(categoryId: number, page: number = 0, size: number = 20): Observable<TripResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<TripResponse>(`${this.baseUrl}/trips/category/${categoryId}`, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get trips by difficulty
  getTripsByDifficulty(difficulty: string, page: number = 0, size: number = 20): Observable<TripResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<TripResponse>(`${this.baseUrl}/trips/difficulty/${difficulty}`, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Search trips
  searchTrips(query: string, page: number = 0, size: number = 20): Observable<TripResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<TripResponse>(`${this.baseUrl}/trips/search`, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get trips by price range
  getTripsByPriceRange(minPrice: number, maxPrice: number, page: number = 0, size: number = 20): Observable<TripResponse> {
    const params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString())
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<TripResponse>(`${this.baseUrl}/trips/price-range`, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ===== TRIP DETAILS OPERATIONS =====

  // Get trip availability
  getTripAvailability(tripId: number): Observable<TripAvailability[]> {
    return this.http.get<TripAvailability[]>(`${this.baseUrl}/trips/${tripId}/availability`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update trip availability
  updateTripAvailability(tripId: number, availabilityData: TripAvailability[]): Observable<TripAvailability[]> {
    return this.http.put<TripAvailability[]>(`${this.baseUrl}/trips/${tripId}/availability`, availabilityData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get trip itinerary
  getTripItinerary(tripId: number): Observable<TripItinerary[]> {
    return this.http.get<TripItinerary[]>(`${this.baseUrl}/trips/${tripId}/itinerary`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update trip itinerary
  updateTripItinerary(tripId: number, itineraryData: TripItinerary[]): Observable<TripItinerary[]> {
    return this.http.put<TripItinerary[]>(`${this.baseUrl}/trips/${tripId}/itinerary`, itineraryData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get trip activities
  getTripActivities(tripId: number): Observable<TripActivity[]> {
    return this.http.get<TripActivity[]>(`${this.baseUrl}/trips/${tripId}/activities`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get trip meals
  getTripMeals(tripId: number): Observable<TripMeal[]> {
    return this.http.get<TripMeal[]>(`${this.baseUrl}/trips/${tripId}/meals`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ===== PUBLIC TRIP ENDPOINTS =====

  // Get public trips (no authentication required)
  getPublicTrips(page: number = 0, size: number = 20): Observable<TripResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<TripResponse>(`${this.baseUrl}/trips`, {
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get public trip by ID
  getPublicTripById(id: number): Observable<TripDto> {
    return this.http.get<TripDto>(`${this.baseUrl}/trips/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get available trips
  getAvailableTrips(date?: string): Observable<TripDto[]> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    
    return this.http.get<TripDto[]>(`${this.baseUrl}/trips/available`, {
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get trips with low availability
  getTripsWithLowAvailability(): Observable<TripDto[]> {
    return this.http.get<TripDto[]>(`${this.baseUrl}/trips/low-availability`).pipe(
      catchError(this.handleError)
    );
  }
}
