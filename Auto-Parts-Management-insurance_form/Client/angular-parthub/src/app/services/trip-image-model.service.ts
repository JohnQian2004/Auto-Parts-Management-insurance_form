import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TripImageModel } from '../models/TripImageModel';
import { environment } from '../../environments/environment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class TripImageModelService {

  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = `${this.configService.apiBaseUrl}/trip-image-model`;
  }

  /**
   * Get authentication headers for authenticated requests
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.configService.getAuthToken();
    let headers = new HttpHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  // ========== READ OPERATIONS (Public Access) ==========

  /**
   * Get all images for a specific trip - ordered by sort order
   */
  getImagesByTripId(tripId: number): Observable<TripImageModel[]> {
    return this.http.get<TripImageModel[]>(`${this.baseUrl}/trip/${tripId}`);
  }

  /**
   * Get a specific image by ID
   */
  getImageById(id: number): Observable<TripImageModel> {
    return this.http.get<TripImageModel>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get main image for a specific trip
   */
  getMainImageByTripId(tripId: number): Observable<TripImageModel> {
    return this.http.get<TripImageModel>(`${this.baseUrl}/trip/${tripId}/main`);
  }

  /**
   * Count images for a trip
   */
  countImagesByTripId(tripId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/trip/${tripId}/count`);
  }

  // ========== WRITE OPERATIONS (Admin Access) ==========

  /**
   * Add a new image to a trip (metadata only)
   */
  addImage(tripId: number, imageData: TripImageModel): Observable<TripImageModel> {
    return this.http.post<TripImageModel>(`${this.baseUrl}/trip/${tripId}`, imageData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Add image from base64 string
   */
  addImageFromBase64(tripId: number, base64Str: string, description?: string): Observable<TripImageModel> {
    const params = description ? new HttpParams().set('description', description) : new HttpParams();
    return this.http.post<TripImageModel>(`${this.baseUrl}/trip/${tripId}/base64`, base64Str, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Add image from file upload
   */
  addImageFromFile(tripId: number, file: File, description?: string): Observable<TripImageModel> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }
    return this.http.post<TripImageModel>(`${this.baseUrl}/trip/${tripId}/file`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Update an existing image
   */
  updateImage(id: number, imageData: Partial<TripImageModel>): Observable<TripImageModel> {
    return this.http.put<TripImageModel>(`${this.baseUrl}/${id}`, imageData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Delete an image (metadata only)
   */
  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Delete an image and associated files
   */
  deleteImageWithFiles(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/with-files`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Soft delete (deactivate) an image
   */
  deactivateImage(id: number): Observable<TripImageModel> {
    return this.http.put<TripImageModel>(`${this.baseUrl}/${id}/deactivate`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Update sort order for an image
   */
  updateSortOrder(id: number, sortOrder: number): Observable<TripImageModel> {
    const params = new HttpParams().set('sortOrder', sortOrder.toString());
    return this.http.put<TripImageModel>(`${this.baseUrl}/${id}/sort-order`, {}, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Update main image status
   */
  updateMainImageStatus(id: number, isMainImage: boolean): Observable<TripImageModel> {
    const params = new HttpParams().set('isMainImage', isMainImage.toString());
    return this.http.put<TripImageModel>(`${this.baseUrl}/${id}/main-image`, {}, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Update status (activate/deactivate) for an image
   */
  updateStatus(id: number, isActive: boolean): Observable<TripImageModel> {
    const params = new HttpParams().set('isActive', isActive.toString());
    return this.http.put<TripImageModel>(`${this.baseUrl}/${id}/status`, {}, { 
      params,
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Reorder images for a trip
   */
  reorderImages(tripId: number, imageIds: number[]): Observable<TripImageModel[]> {
    return this.http.put<TripImageModel[]>(`${this.baseUrl}/trip/${tripId}/reorder`, imageIds, {
      headers: this.getAuthHeaders()
    });
  }

  // ========== IMAGE SERVING URLS ==========

  /**
   * Get the URL for serving the original image
   */
  getOriginalImageUrl(imageId: number): string {
    return `${this.baseUrl}/getOriginal/${imageId}`;
  }

  /**
   * Get the URL for serving the resized image (500x500)
   */
  getResizedImageUrl(imageId: number): string {
    return `${this.baseUrl}/getResize/${imageId}`;
  }

  // ========== UTILITY METHODS ==========

  /**
   * Create a new TripImageModel instance with default values
   */
  createImageModel(data?: Partial<TripImageModel>): TripImageModel {
    return new TripImageModel({
      fileName: '',
      description: '',
      sortOrder: 0,
      isActive: true,
      isMainImage: false,
      ...data
    });
  }

  /**
   * Convert backend response to TripImageModel instance
   */
  convertFromBackend(data: any): TripImageModel {
    return new TripImageModel({
      id: data.id,
      fileName: data.fileName || '',
      fileSize: data.fileSize,
      description: data.description || '',
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      isMainImage: data.isMainImage !== undefined ? data.isMainImage : false,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      tripId: data.tripId
    });
  }

  /**
   * Convert multiple backend responses to TripImageModel instances
   */
  convertArrayFromBackend(data: any[]): TripImageModel[] {
    return data.map(item => this.convertFromBackend(item));
  }

  /**
   * Prepare image data for backend submission
   */
  prepareForBackend(imageModel: TripImageModel): any {
    return {
      id: imageModel.id,
      fileName: imageModel.fileName,
      fileSize: imageModel.fileSize,
      description: imageModel.description,
      sortOrder: imageModel.sortOrder,
      isActive: imageModel.isActive,
      isMainImage: imageModel.isMainImage,
      tripId: imageModel.tripId
    };
  }
}
