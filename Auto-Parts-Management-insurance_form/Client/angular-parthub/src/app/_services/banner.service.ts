import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config.model';
import { Banner } from '../models/banner.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  config: Config = new Config();
  API_URL = this.config.baseUrl + '/banners';

  constructor(private http: HttpClient) { }

  /**
   * Get all active banners for a specific domain, page, and position
   * Public endpoint - no authentication required
   */
  getBannersByDomainPageAndPosition(domain: string, page: string, position: string): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.API_URL}/domain/${domain}/page/${page}/position/${position}`, httpOptions);
  }

  /**
   * Get all banners for system management (Admin only)
   */
  getAllBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.API_URL}/system`, httpOptions);
  }

  /**
   * Get a specific banner by ID
   */
  getBanner(bannerId: any): Observable<Banner> {
    return this.http.get<Banner>(`${this.API_URL}/${bannerId}`, httpOptions);
  }

  /**
   * Create a new banner (Admin only)
   */
  createBanner(banner: Banner): Observable<Banner> {
    return this.http.post<Banner>(`${this.API_URL}`, banner, httpOptions);
  }

  /**
   * Update an existing banner (Admin only)
   */
  updateBanner(id: number, banner: Banner): Observable<Banner> {
    return this.http.put<Banner>(`${this.API_URL}/${id}`, banner, httpOptions);
  }

  /**
   * Delete a banner (Admin only)
   */
  deleteBanner(bannerId: any): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${bannerId}`, httpOptions);
  }

  /**
   * Toggle banner active status (Admin only)
   */
  toggleBannerStatus(id: number): Observable<Banner> {
    return this.http.patch<Banner>(`${this.API_URL}/${id}/toggle`, {}, httpOptions);
  }

  /**
   * LEGACY METHOD: Create or update a banner with userId
   * This method exists for backward compatibility with the existing banner component
   */
  createUpdateBanner(userId: any, banner: Banner): Observable<Banner> {
    if (banner.id && banner.id > 0) {
      // Update existing banner
      return this.updateBanner(banner.id, banner);
    } else {
      // Create new banner
      return this.createBanner(banner);
    }
  }

  /**
   * LEGACY METHOD: Set a banner as active with userId
   * This method exists for backward compatibility with the existing banner component
   */
  setActive(id: any, banner: Banner): Observable<Banner> {
    if (banner.id) {
      return this.toggleBannerStatus(banner.id);
    } else {
      throw new Error('Banner ID is required to set active status');
    }
  }

  /**
   * LEGACY METHOD: Get active banner
   */
  getActiveBanner(): Observable<Banner> {
    return this.http.get<Banner>(`${this.API_URL}/system/active`, httpOptions);
  }
}
