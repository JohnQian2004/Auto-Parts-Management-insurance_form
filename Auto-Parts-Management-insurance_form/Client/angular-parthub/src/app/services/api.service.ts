import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private currentLanguage = 'en';

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  // Getter for base URL that uses config service
  get baseUrl(): string {
    return this.configService.apiBaseUrl;
  }

  private getLanguageParam(): string {
    return this.currentLanguage || this.configService.defaultLanguage;
  }

  // Method to refresh data when industry changes
  refreshDataOnIndustryChange(): void {
    // This method can be called when industry changes to trigger data refresh
    // Components can listen to this or use the industryChanged event
    console.log('Industry changed, data refresh triggered');
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

 
 
  // Admin API
  getAdminStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/stats`, {
      headers: this.getAuthHeaders()
    });
  }

  getVendorStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/vendor-stats`, {
      headers: this.getAuthHeaders()
    });
  }

  getCustomerStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/customer-stats`, {
      headers: this.getAuthHeaders()
    });
  }

  getRecentOrders(): Observable<any> {
    // This method is specifically for admin users to get recent orders from all users
    // Use the admin orders endpoint with a small page size to get recent orders
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '5');
    
    return this.http.get(`${this.baseUrl}/admin/orders`, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      map((response: any) => response.content || [])
    );
  }

  getRecentUsers(): Observable<any> {
    // Admin users endpoint doesn't exist in backend yet, return empty array
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  getRecentProducts(): Observable<any> {
    // Use the products endpoint with a small page size to get recent products
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '5');
    
    return this.http.get(`${this.baseUrl}/products`, {
      params,
      headers: this.getAuthHeaders()
    }).pipe(
      map((response: any) => response.content || [])
    );
  }

  // ===== TRIP MANAGEMENT API =====
  
  // Get all trips (admin)
  getAllTrips(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trips`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get trip by ID
  getTripById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/trips/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Create new trip
  createTrip(tripData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/trips`, tripData, {
      headers: this.getAuthHeaders()
    });
  }

  // Update existing trip
  updateTrip(id: number, tripData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/trips/${id}`, tripData, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete trip
  deleteTrip(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/trips/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get trips by category
  getTripsByCategory(categoryId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/trips/category/${categoryId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get trips by difficulty
  getTripsByDifficulty(difficulty: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/trips/difficulty/${difficulty}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Search trips
  searchTrips(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get(`${this.baseUrl}/trips/search`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  // Get trip availability
  getTripAvailability(tripId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/trips/${tripId}/availability`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update trip availability
  updateTripAvailability(tripId: number, availabilityData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/trips/${tripId}/availability`, availabilityData, {
      headers: this.getAuthHeaders()
    });
  }

  // Get trip itinerary
  getTripItinerary(tripId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/trips/${tripId}/itinerary`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update trip itinerary
  updateTripItinerary(tripId: number, itineraryData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/trips/${tripId}/itinerary`, itineraryData, {
      headers: this.getAuthHeaders()
    });
  }

  // Admin Orders API
  getAdminOrders(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get(`${this.baseUrl}/admin/orders`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  getAdminPostedProductOrders(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get(`${this.baseUrl}/admin/orders/posted-products`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  getAdminPurchasedOrders(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get(`${this.baseUrl}/admin/orders/purchased`, {
      params,
      headers: this.getAuthHeaders()
    });
  }

  // Admin Users API
  getUsers(): Observable<any> {
    // Admin users endpoint doesn't exist in backend yet, return empty array
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  // Admin Vendors API
  getVendors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/vendors`, {
      headers: this.getAuthHeaders()
    });
  }

 
   getVendorOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/vendors/orders`, {
      headers: this.getAuthHeaders()
    });
  }

   // Language API
  getAvailableLanguages(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/languages`);
  }

  getLanguageJson(lang: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/languages/${lang}`);
  }

  // Auth
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  // Users
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile`, profileData, {
      headers: this.getAuthHeaders()
    });
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/change-password`, passwordData, {
      headers: this.getAuthHeaders()
    });
  }

  changeUsername(usernameData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/change-username`, usernameData, {
      headers: this.getAuthHeaders()
    });
  }

  getUserOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/orders`, {
      headers: this.getAuthHeaders()
    });
  }

  // Vendors
  getVendorProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/vendors/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  updateVendorProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/vendors/profile`, profileData, {
      headers: this.getAuthHeaders()
    });
  }

  // Cart
  getCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cart`, {
      headers: this.getAuthHeaders()
    });
  }

  addToCart(cartItem: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/add`, cartItem, {
      headers: this.getAuthHeaders()
    });
  }

  updateCartItem(itemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/cart/items/${itemId}/quantity`, null, {
      params: new HttpParams().set('quantity', quantity.toString()),
      headers: this.getAuthHeaders()
    });
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/items/${itemId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Shipping Addresses
  getShippingAddresses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/addresses`, {
      headers: this.getAuthHeaders()
    });
  }

  addShippingAddress(address: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/addresses`, address, {
      headers: this.getAuthHeaders()
    });
  }

  updateShippingAddress(addressId: number, address: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/useraddresses/${addressId}`, address, {
      headers: this.getAuthHeaders()
    });
  }

  deleteShippingAddress(addressId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/shipping-addresses/${addressId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Orders
  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, orderData, {
      headers: this.getAuthHeaders()
    });
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders`, {
      headers: this.getAuthHeaders()
    });
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${orderId}`, {
      headers: this.getAuthHeaders()
    });
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}/cancel`, {}, {
      headers: this.getAuthHeaders()
    });
  }

   
  // System Settings API
  getSystemSettings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/settings`, {
      headers: this.getAuthHeaders()
    });
  }

  getSettingsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/settings/${category}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateSystemSettings(category: string, settings: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/settings/${category}`, settings, {
      headers: this.getAuthHeaders()
    });
  }

  updateAllSystemSettings(settings: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/settings`, settings, {
      headers: this.getAuthHeaders()
    });
  }

  resetSystemSettings(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/settings/reset`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  resetCategorySettings(category: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/settings/${category}/reset`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  getIndustryTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/settings/industries/templates`, {
      headers: this.getAuthHeaders()
    });
  }

  setIndustryTemplate(templateName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/settings/industries/template/${templateName}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  exportSystemSettings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/settings/export`, {
      headers: this.getAuthHeaders()
    });
  }

  importSystemSettings(configuration: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/settings/import`, configuration, {
      headers: this.getAuthHeaders()
    });
  }

  // Industry switching for demo purposes (no auth required)
  updateSystemSettingsForDemo(settings: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/demo/industry`, settings);
  }

  // Get demo industries (no auth required)
  getDemoIndustries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/industry-templates`);
  }

  // Database reset methods
  resetDatabase(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/reset/database`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  resetProducts(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/reset/products`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  resetCategories(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/reset/categories`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  resetTranslations(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/reset/translations`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // New industry-specific reset methods
  resetDatabaseWithIndustry(industryId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/reset/database/industry/${industryId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  resetDatabaseWithAllIndustries(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/reset/database/all-industries`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  getAvailableIndustries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/reset/available-industries`, {
      headers: this.getAuthHeaders()
    });
  }

  // Enhanced reset database with optional industry parameter
  resetDatabaseEnhanced(industryId?: string): Observable<any> {
    let params = new HttpParams();
    if (industryId) {
      params = params.set('industryId', industryId);
    }
    
    return this.http.post(`${this.baseUrl}/admin/reset/database`, {}, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  getIndustries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/industry-management`);
  }

  getActiveIndustries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/industry-management/active`);
  }
} 