import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdByUsername: string;
  lastModifiedByUsername?: string;
  createdAt: string;
  lastModifiedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
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

  // Get all categories (public endpoint - no authentication required)
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/public/categories`);
  }

  // Get all categories (private endpoint - requires authentication)
  getAllCategoriesPrivate(): Observable<Category[]> {
    const headers = this.getAuthHeaders();
    const token = this.configService.getAuthToken();
    
    console.log('Making authenticated request to:', `${this.baseUrl}/admin/categories`);
    console.log('Auth token present:', !!token);
    console.log('Headers:', headers);
    
    return this.http.get<Category[]>(`${this.baseUrl}/admin/categories`, {
      headers: headers
    });
  }

  // Alternative admin endpoint (in case backend uses /admin/categories)
  getAllCategoriesAdmin(): Observable<Category[]> {
    const headers = this.getAuthHeaders();
    const token = this.configService.getAuthToken();
    
    console.log('Making admin request to:', `${this.baseUrl}/admin/categories`);
    console.log('Auth token present:', !!token);
    console.log('Headers:', headers);
    
    return this.http.get<Category[]>(`${this.baseUrl}/admin/categories`, {
      headers: headers
    });
  }

  // Get category by ID (public endpoint)
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/public/categories/${id}`);
  }

  // Get category by ID (private endpoint)
  getCategoryByIdPrivate(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/admin/categories/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Create new category (private endpoint - requires authentication)
  createCategory(category: Omit<Category, 'id' | 'createdAt' | 'lastModifiedAt' | 'createdByUsername' | 'lastModifiedByUsername'>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/admin/categories`, category, {
      headers: this.getAuthHeaders()
    });
  }

  // Update category (private endpoint - requires authentication)
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/admin/categories/${id}`, category, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete category (private endpoint - requires authentication)
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/categories/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get active categories only (public endpoint)
  getActiveCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/public/categories`).pipe(
      map(categories => categories.filter(cat => cat.isActive))
    );
  }

  // Search categories by name (public endpoint)
  searchCategories(query: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/public/categories/search?q=${encodeURIComponent(query)}`);
  }
} 