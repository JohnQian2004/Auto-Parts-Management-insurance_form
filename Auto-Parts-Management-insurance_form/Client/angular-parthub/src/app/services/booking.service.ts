import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from '../models/Booking';
import { BookingCompanion } from '../models/BookingCompanion';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.apiBaseUrl;
  }

  // Get authentication headers
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

  // Create booking
  createBooking(tripId: number, customerId: number, travelDate: string, numberOfPeople: number, specialRequests?: string): Observable<Booking> {
    const params: any = {
      tripId: tripId.toString(),
      customerId: customerId.toString(),
      travelDate: travelDate,
      numberOfPeople: numberOfPeople.toString()
    };

    if (specialRequests) {
      params.specialRequests = specialRequests;
    }

    return this.http.post<Booking>(`${this.baseUrl}/bookings`, null, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  // Create booking with companions in a single atomic operation
  createBookingWithCompanions(
    tripId: number,
    customerId: number,
    travelDate: string,
    numberOfPeople: number,
    companions: Omit<BookingCompanion, 'id' | 'createdAt'>[],
    specialRequests?: string
  ): Observable<Booking> {
    const params: any = {
      tripId: tripId.toString(),
      customerId: customerId.toString(),
      travelDate: travelDate,
      numberOfPeople: numberOfPeople.toString()
    };

    if (specialRequests) {
      params.specialRequests = specialRequests;
    }

    return this.http.post<Booking>(`${this.baseUrl}/bookings/with-companions`, companions, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  // Get booking by ID
  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/bookings/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get booking by reference
  getBookingByReference(bookingReference: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/bookings/reference/${bookingReference}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get bookings by customer
  getBookingsByCustomer(customerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/customer/${customerId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get bookings by trip
  getBookingsByTrip(tripId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/trip/${tripId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get bookings by status
  getBookingsByStatus(status: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/status/${status}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get bookings by payment status
  getBookingsByPaymentStatus(status: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/payment-status/${status}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get incomplete bookings for a customer
  getIncompleteBookingsByCustomer(customerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/customer/${customerId}/incomplete`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get expired incomplete bookings (for admin use)
  getExpiredIncompleteBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/incomplete/expired`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update booking status
  updateBookingStatus(id: number, status: string): Observable<Booking> {
    const params = { status: status };
    return this.http.put<Booking>(`${this.baseUrl}/bookings/${id}/status`, null, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  // Update payment status
  updatePaymentStatus(id: number, status: string, paymentIntentId?: string): Observable<Booking> {
    const params: any = { status: status };
    if (paymentIntentId) {
      params.paymentIntentId = paymentIntentId;
    }
    return this.http.put<Booking>(`${this.baseUrl}/bookings/${id}/payment-status`, null, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  // Cancel booking
  cancelBooking(id: number, cancellationReason: string): Observable<void> {
    const params = { cancellationReason: cancellationReason };
    return this.http.put<void>(`${this.baseUrl}/bookings/${id}/cancel`, null, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  // Delete booking
  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/bookings/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Add booking companion
  addBookingCompanion(bookingId: number, companion: Omit<BookingCompanion, 'id' | 'createdAt'>): Observable<BookingCompanion> {
    return this.http.post<BookingCompanion>(`${this.baseUrl}/bookings/${bookingId}/companions`, companion, {
      headers: this.getAuthHeaders()
    });
  }

  // Get booking companions
  getBookingCompanions(bookingId: number): Observable<BookingCompanion[]> {
    return this.http.get<BookingCompanion[]>(`${this.baseUrl}/bookings/${bookingId}/companions`, {
      headers: this.getAuthHeaders()
    });
  }

  // Remove booking companion
  removeBookingCompanion(companionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/bookings/companions/${companionId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get booking with payment data by ID
  getBookingWithPaymentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/bookings/${id}/with-payment`, {
      headers: this.getAuthHeaders()
    });
  }
}