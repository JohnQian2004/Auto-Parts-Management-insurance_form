import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Trip } from '../../models/Trip';
import { TripImageModel } from '../../models/TripImageModel';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-travel-trip-detail2',
  templateUrl: './travel-trip-detail2.component.html',
  styleUrls: ['./travel-trip-detail2.component.css']
})
export class TravelTripDetail2Component implements OnChanges {
  @Input() trip: Trip | null = null;
  @Input() showModal = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() bookTrip = new EventEmitter<Trip>();

  activeTab = 'overview';
  currentImageIndex = 0;

  // New image system properties
  tripImageModels: TripImageModel[] = [];
  mainImageModel: TripImageModel | null = null;
  baseUrlResizeImage: string = '';
  baseUrlOriginalImage: string = '';

  constructor(private configService: ConfigService) {
    // Set image URL properties for direct template access
    this.baseUrlResizeImage = `${this.configService.apiBaseUrl}/trip-image-model/getResize`;
    this.baseUrlOriginalImage = `${this.configService.apiBaseUrl}/trip-image-model/getOriginal`;
  }

  ngOnChanges(): void {
    // Reset image index when trip changes
    this.currentImageIndex = 0;
    // Load new image data when trip changes
    if (this.trip?.id) {
      this.loadTripImageModels();
    }
  }

  // Load trip image models for the new image system
  public loadTripImageModels(): void {
    // Use the imageModels from the trip data
    if (this.trip?.imageModels) {
      this.tripImageModels = this.trip.imageModels;
      // Find the main image
      this.mainImageModel = this.trip.imageModels.find(img => img.isMainImage) || null;
    } else {
      this.tripImageModels = [];
      this.mainImageModel = null;
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onBookTrip(): void {
    if (this.trip) {
      this.bookTrip.emit(this.trip);
    }
  }

  onModalOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCloseModal();
    }
  }

  onModalContentClick(event: Event): void {
    event.stopPropagation();
  }

  // Helper methods for Trip data structure
  getAvailableDates(): any[] {
    return this.trip?.availability || [];
  }

  getTotalAvailableSpots(): number {
    return this.trip ? this.trip.availability.reduce((total, date) => total + date.availableSpots, 0) : 0;
  }

  isTripAvailable(): boolean {
    return this.trip ? this.trip.availability.some(date => date.availableSpots > 0) : false;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  // Image Gallery Methods - Updated for new image system
  getCurrentImage(): string {
    // First try to use the new TripImageModel system
    if (this.tripImageModels && this.tripImageModels.length > 0) {
      const currentImage = this.tripImageModels[this.currentImageIndex];
      if (currentImage) {
        return `${this.baseUrlResizeImage}/${currentImage.id}`;
      }
    }
    
    // Fallback to old system
    if (!this.trip || !this.trip.images || this.trip.images.length === 0) {
      return this.trip?.mainImage || '';
    }
    return this.trip.images[this.currentImageIndex]?.imageUrl || this.trip.mainImage || '';
  }

  nextImage(): void {
    // Use new image system if available
    if (this.tripImageModels && this.tripImageModels.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.tripImageModels.length;
    } else if (this.trip && this.trip.images && this.trip.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.trip.images.length;
    }
  }

  previousImage(): void {
    // Use new image system if available
    if (this.tripImageModels && this.tripImageModels.length > 0) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.tripImageModels.length - 1 
        : this.currentImageIndex - 1;
    } else if (this.trip && this.trip.images && this.trip.images.length > 0) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.trip.images.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  selectImage(index: number): void {
    // Use new image system if available
    if (this.tripImageModels && index >= 0 && index < this.tripImageModels.length) {
      this.currentImageIndex = index;
    } else if (this.trip && this.trip.images && index >= 0 && index < this.trip.images.length) {
      this.currentImageIndex = index;
    }
  }

  getImageCount(): number {
    // Return count from new image system if available, otherwise fallback to old
    if (this.tripImageModels && this.tripImageModels.length > 0) {
      return this.tripImageModels.length;
    }
    return this.trip?.images?.length || 0;
  }

  // Get highlights as array of strings
  getHighlights(): string[] {
    return this.trip?.highlights?.map(h => h.highlight) || [];
  }

  // Get inclusions as array of strings
  getInclusions(): string[] {
    return this.trip?.inclusions?.map(i => i.inclusion) || [];
  }

  // Get exclusions as array of strings
  getExclusions(): string[] {
    return this.trip?.exclusions?.map(e => e.exclusion) || [];
  }

  // Get difficulty display text
  getDifficultyText(): string {
    if (!this.trip?.difficulty) return 'Not specified';
    return this.trip.difficulty.charAt(0).toUpperCase() + this.trip.difficulty.slice(1).toLowerCase();
  }

  // Get category name
  getCategoryName(): string {
    return this.trip?.categoryName || 'Uncategorized';
  }
}
