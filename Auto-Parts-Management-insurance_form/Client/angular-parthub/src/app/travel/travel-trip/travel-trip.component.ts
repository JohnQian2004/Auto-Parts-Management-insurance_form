import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TripData, DateAvailability, getTripCategoryName } from '../mock-travel-data';

@Component({
  selector: 'app-travel-trip',
  templateUrl: './travel-trip.component.html',
  styleUrls: ['./travel-trip.component.css']
})
export class TravelTripComponent implements OnChanges {
  @Input() trip: TripData | null = null;
  @Input() showModal = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() bookTrip = new EventEmitter<TripData>();

  activeTab = 'overview';
  currentImageIndex = 0;

  ngOnChanges(): void {
    // Reset image index when trip changes
    this.currentImageIndex = 0;
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

  // Helper methods for new data structure
  getAvailableDates(): DateAvailability[] {
    return this.trip ? this.trip.availability.filter(date => date.available > 0) : [];
  }

  getTotalAvailableSpots(): number {
    return this.trip ? this.trip.availability.reduce((total, date) => total + date.available, 0) : 0;
  }

  isTripAvailable(): boolean {
    return this.trip ? this.trip.availability.some(date => date.available > 0) : false;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  // Image Gallery Methods
  getCurrentImage(): string {
    return this.trip?.images[this.currentImageIndex] || '';
  }

  nextImage(): void {
    if (this.trip && this.trip.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.trip.images.length;
    }
  }

  previousImage(): void {
    if (this.trip && this.trip.images.length > 0) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.trip.images.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  selectImage(index: number): void {
    if (this.trip && index >= 0 && index < this.trip.images.length) {
      this.currentImageIndex = index;
    }
  }

  getImageCount(): number {
    return this.trip?.images.length || 0;
  }

  // Category helper method
  getTripCategoryName(trip: TripData): string {
    return getTripCategoryName(trip);
  }
} 