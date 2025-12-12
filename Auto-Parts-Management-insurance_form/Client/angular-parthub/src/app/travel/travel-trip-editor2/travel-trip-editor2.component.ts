import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Trip, TripDifficulty } from '../../models/Trip';
import { TripImage } from '../../models/TripImage';
import { TripImageModel } from '../../models/TripImageModel';
import { TripAvailability } from '../../models/TripAvailability';
import { TripItinerary } from '../../models/TripItinerary';
import { TripActivity } from '../../models/TripActivity';
import { TripMeal } from '../../models/TripMeal';
import { TripHighlight } from '../../models/TripHighlight';
import { TripInclusion } from '../../models/TripInclusion';
import { TripExclusion } from '../../models/TripExclusion';
import { Category } from '../../models/Category';
import { TripDto } from '../../services/trips.service';
import { environment } from '../../../environments/environment';

// Import main trips service and individual trip detail services for CRUD operations
import { TripsService } from '../../services/trips.service';
import { TripImageService } from '../../services/trip-image.service';
import { TripImageModelService } from '../../services/trip-image-model.service';
import { TripInclusionService } from '../../services/trip-inclusion.service';
import { TripExclusionService } from '../../services/trip-exclusion.service';
import { TripHighlightService } from '../../services/trip-highlight.service';
import { TripAvailabilityService } from '../../services/trip-availability.service';
import { TripItineraryService } from '../../services/trip-itinerary.service';
import { TripActivityService } from '../../services/trip-activity.service';
import { TripMealService } from '../../services/trip-meal.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-travel-trip-editor2',
  templateUrl: './travel-trip-editor2.component.html',
  styleUrls: ['./travel-trip-editor2.component.css']
})
export class TravelTripEditor2Component implements OnInit, OnChanges {
  @Input() showModal = false;
  @Input() trip: Trip | null = null;
  @Input() allCategories: Category[] = [];
  @Input() isEditingTrip = false;
  @Input() isLoading = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveTrip = new EventEmitter<Trip>();

  activeTripTab = 'basic';

  // Form data structure adapted for Trip objects
  tripForm: Partial<Trip> = {
    name: '',
    destination: '',
    duration: '',
    basePrice: 0,
    maxCapacity: 0,
    categoryId: 0,
    description: '',
    mainImage: '',
    images: [],
    imageModels: [],
    difficulty: 'EASY' as any, // Will be converted to enum when saving
    groupSizeMin: 1,
    groupSizeMax: 20,
    bestTime: '',
    cancellationPolicy: '',
    highlights: [],
    availability: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    isActive: true
  };

  // New availability form fields
  newAvailabilityDate = '';
  newAvailabilityMaxCapacity = 0;
  newAvailabilitySpots = 0;
  newAvailabilityPrice = 0;

  // New image model properties
  tripImageModels: TripImageModel[] = [];
  mainImageModel: TripImageModel | null = null;
  selectedFile: File | null = null;
  newImageDescription = '';
  isUploadingImage = false;

  // Image URL properties for direct template access
  baseUrlResizeImage = '';
  baseUrlOriginalImage = '';

  constructor(
    // Inject main trips service for loading complete trip data
    private tripsService: TripsService,
    // Inject individual trip detail services for CRUD operations
    private tripImageService: TripImageService,
    public tripImageModelService: TripImageModelService,
    private tripInclusionService: TripInclusionService,
    private tripExclusionService: TripExclusionService,
    private tripHighlightService: TripHighlightService,
    private tripAvailabilityService: TripAvailabilityService,
    private tripItineraryService: TripItineraryService,
    private tripActivityService: TripActivityService,
    private tripMealService: TripMealService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    // Set image URL properties for direct template access
    this.baseUrlResizeImage = `${this.configService.apiBaseUrl}/trip-image-model/getResize`;
    this.baseUrlOriginalImage = `${this.configService.apiBaseUrl}/trip-image-model/getOriginal`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges called with:', changes);
    console.log('Current trip value:', this.trip);
    console.log('Current isEditingTrip value:', this.isEditingTrip);

    if (changes['trip']) {
      console.log('Trip input changed from:', changes['trip'].previousValue, 'to:', changes['trip'].currentValue);
      // Use setTimeout to ensure the input binding is complete
      setTimeout(() => {
        this.initializeForm();
      }, 0);
    }
  }

  initializeForm(): void {
    console.log('initializeForm called, trip:', this.trip, 'isEditingTrip:', this.isEditingTrip);
    if (this.trip) {
      // Don't override the input value, just initialize the form
      this.tripForm = { ...this.trip };
      console.log('Form initialized with trip data:', this.tripForm);

      // Load individual trip details if editing an existing trip
      if (this.trip.id) {
        this.loadTripDetails(this.trip.id);
      }
    } else {
      this.resetForm();
      console.log('Form reset to empty state');
    }
  }

  /**
   * Load complete trip data including all details from the main trips service
   */
  private loadTripDetails(tripId: number): void {
    console.log('Loading complete trip data for trip ID:', tripId);

    // Use the main trips service to get the complete trip with all details
    this.tripsService.getTripById(tripId).subscribe({
      next: (completeTrip) => {
        console.log('Loaded complete trip data:', completeTrip);

        // Map service data to model types with proper default values
        this.tripForm.images = (completeTrip.images || []).map(img => ({
          id: img.id,
          imageUrl: img.imageUrl || '',
          sortOrder: img.sortOrder || 0,
          isActive: img.isActive !== undefined ? img.isActive : true,
          createdAt: img.createdAt
        }));

        this.tripForm.inclusions = (completeTrip.inclusions || []).map(inc => ({
          id: inc.id,
          inclusion: inc.inclusion || '',
          sortOrder: inc.sortOrder || 0,
          isActive: inc.isActive !== undefined ? inc.isActive : true,
          createdAt: inc.createdAt,
          lastModifiedAt: inc.lastModifiedAt
        }));

        this.tripForm.exclusions = (completeTrip.exclusions || []).map(exc => ({
          id: exc.id,
          exclusion: exc.exclusion || '',
          sortOrder: exc.sortOrder || 0,
          isActive: exc.isActive !== undefined ? exc.isActive : true,
          createdAt: exc.createdAt,
          lastModifiedAt: exc.lastModifiedAt
        }));

        this.tripForm.highlights = (completeTrip.highlights || []).map(hl => ({
          id: hl.id,
          highlight: hl.highlight || '',
          sortOrder: hl.sortOrder || 0,
          isActive: hl.isActive !== undefined ? hl.isActive : true,
          createdAt: hl.createdAt,
          lastModifiedAt: hl.lastModifiedAt
        }));

        this.tripForm.availability = (completeTrip.availability || []).map(avail => ({
          id: avail.id,
          date: avail.date || '',
          maxCapacity: avail.maxCapacity || 0,
          availableSpots: avail.availableSpots || 0,
          price: avail.price || 0,
          tripId: this.trip?.id || 0,
          isActive: avail.isActive !== undefined ? avail.isActive : true,
          createdAt: avail.createdAt,
          lastModifiedAt: avail.lastModifiedAt
        }));

        this.tripForm.itinerary = (completeTrip.itinerary || []).map(item => ({
          id: item.id,
          dayNumber: item.dayNumber || 0,
          title: item.title || '',
          description: item.description || '',
          accommodation: item.accommodation || '',
          sortOrder: item.sortOrder || 0,
          isActive: item.isActive !== undefined ? item.isActive : true,
          createdAt: item.createdAt,
          lastModifiedAt: item.lastModifiedAt,
          activities: (item.activities || []).map(activity => ({
            id: activity.id,
            time: activity.time || '',
            description: activity.description || '',
            sortOrder: activity.sortOrder || 0,
            isActive: activity.isActive !== undefined ? activity.isActive : true,
            createdAt: activity.createdAt,
            lastModifiedAt: activity.lastModifiedAt
          })),
          meals: (item.meals || []).map(meal => ({
            id: meal.id,
            mealType: meal.mealType || '',
            description: meal.description || '',
            sortOrder: meal.sortOrder || 0,
            isActive: meal.isActive !== undefined ? meal.isActive : true,
            createdAt: meal.createdAt,
            lastModifiedAt: meal.lastModifiedAt
          }))
        }));

        // Update other basic trip properties
        this.tripForm.id = completeTrip.id;
        this.tripForm.name = completeTrip.name || '';
        this.tripForm.destination = completeTrip.destination || '';
        this.tripForm.duration = completeTrip.duration || '';
        this.tripForm.basePrice = completeTrip.basePrice || 0;
        this.tripForm.maxCapacity = completeTrip.maxCapacity || 0;
        this.tripForm.categoryId = completeTrip.categoryId || 0;
        this.tripForm.description = completeTrip.description || '';
        this.tripForm.mainImage = completeTrip.mainImage || '';
        this.tripForm.difficulty = completeTrip.difficulty ? TripDifficulty[completeTrip.difficulty as keyof typeof TripDifficulty] : TripDifficulty.EASY;
        this.tripForm.groupSizeMin = completeTrip.groupSizeMin || 1;
        this.tripForm.groupSizeMax = completeTrip.groupSizeMax || 20;
        this.tripForm.bestTime = completeTrip.bestTime || '';
        this.tripForm.cancellationPolicy = completeTrip.cancellationPolicy || '';
        this.tripForm.isActive = completeTrip.isActive !== undefined ? completeTrip.isActive : true;
        this.tripForm.createdAt = completeTrip.createdAt;
        this.tripForm.lastModifiedAt = completeTrip.lastModifiedAt;



        console.log('Form updated with complete trip data:', this.tripForm);
      },
      error: (error) => {
        console.error('Error loading complete trip data:', error);
        alert('Failed to load trip details. Please try again.');
      }
    });
  }

  resetForm(): void {
    this.tripForm = {
      name: '',
      destination: '',
      duration: '',
      basePrice: 0,
      maxCapacity: 0,
      categoryId: 0,
      description: '',
      mainImage: '',
      images: [],
      imageModels: [],
      difficulty: TripDifficulty.EASY,
      groupSizeMin: 1,
      groupSizeMax: 20,
      bestTime: '',
      cancellationPolicy: '',
      highlights: [],
      availability: [],
      itinerary: [],
      inclusions: [],
      exclusions: [],
      isActive: true
    };
    this.activeTripTab = 'basic';
  }

  // Tab management
  setActiveTripTab(tab: string): void {
    this.activeTripTab = tab;

    // Load image models when switching to image model tab
    if (tab === 'imagemodel' && this.trip?.id) {
      this.loadTripImageModels();
    }
  }

  nextTripTab(): void {
    const tabs = ['basic', 'details', 'availability', 'itinerary', 'images', 'imagemodel', 'inclusions'];
    const currentIndex = tabs.indexOf(this.activeTripTab);
    if (currentIndex < tabs.length - 1) {
      this.activeTripTab = tabs[currentIndex + 1];
    }
  }

  previousTripTab(): void {
    const tabs = ['basic', 'details', 'availability', 'itinerary', 'images', 'imagemodel', 'inclusions'];
    const currentIndex = tabs.indexOf(this.activeTripTab);
    if (currentIndex > 0) {
      this.activeTripTab = tabs[currentIndex - 1];
    }
  }

  getTripTabTitle(): string {
    const tabTitles: { [key: string]: string } = {
      'basic': 'Basic Information',
      'details': 'Highlights',
      'availability': 'Availability & Pricing',
      'itinerary': 'Itinerary Planning',
      'images': 'Trip Images',
      'imagemodel': 'New Image System',
      'inclusions': 'Inclusions & Exclusions'
    };
    return tabTitles[this.activeTripTab] || 'Unknown Tab';
  }

  getFormProgress(): number {
    const tabs = ['basic', 'details', 'availability', 'itinerary', 'images', 'imagemodel', 'inclusions'];
    const currentIndex = tabs.indexOf(this.activeTripTab);
    return Math.round(((currentIndex + 1) / tabs.length) * 100);
  }

  // Helper method to format dates for backend (LocalDateTime compatible)
  private formatDateForBackend(date: Date): string {
    // Use ISO string but remove timezone and milliseconds for LocalDateTime compatibility
    return date.toISOString().slice(0, 19);
  }

  // Form validation
  isCurrentTabValid(): boolean {
    switch (this.activeTripTab) {
      case 'basic':
        return !!(this.tripForm.name?.trim() && this.tripForm.destination?.trim() &&
          this.tripForm.duration?.trim() && (this.tripForm.basePrice || 0) > 0 &&
          (this.tripForm.maxCapacity || 0) > 0 && (this.tripForm.categoryId || 0) > 0 &&
          this.tripForm.description?.trim() && this.tripForm.difficulty &&
          (this.tripForm.groupSizeMin || 0) > 0 && (this.tripForm.groupSizeMax || 0) >= (this.tripForm.groupSizeMin || 0) &&
          this.tripForm.bestTime?.trim() && this.tripForm.cancellationPolicy?.trim());
      case 'details':
        return (this.tripForm.highlights?.length || 0) > 0;
      case 'availability':
        return (this.tripForm.availability?.length || 0) > 0;
      case 'itinerary':
        return (this.tripForm.itinerary?.length || 0) > 0;
      case 'images':
        return !!(this.tripForm.mainImage?.trim());
      case 'inclusions':
        return (this.tripForm.inclusions?.length || 0) > 0 || (this.tripForm.exclusions?.length || 0) > 0;
      default:
        return true;
    }
  }

  // Check if basic info is valid for saving
  isBasicInfoValid(): boolean {
    return !!(this.tripForm.name?.trim() && this.tripForm.destination?.trim() &&
      this.tripForm.duration?.trim() && (this.tripForm.basePrice || 0) > 0 &&
      (this.tripForm.maxCapacity || 0) > 0 && (this.tripForm.categoryId || 0) > 0 &&
      this.tripForm.description?.trim() && this.tripForm.difficulty &&
      (this.tripForm.groupSizeMin || 0) > 0 && (this.tripForm.groupSizeMax || 0) >= (this.tripForm.groupSizeMin || 0) &&
      this.tripForm.bestTime?.trim() && this.tripForm.cancellationPolicy?.trim());
  }

  // Save or update trip basic info
  saveTripBasicInfo(): void {
    if (!this.isBasicInfoValid()) {
      alert('Please fill in all required fields before saving.');
      return;
    }

    if (this.trip?.id) {
      // Update existing trip
      this.updateTripBasicInfo();
    } else {
      // Create new trip
      this.createNewTrip();
    }
  }

  // Update existing trip basic info
  private updateTripBasicInfo(): void {
    if (!this.trip?.id) return;

    const updatedTrip: Partial<Trip> = {
      id: this.trip.id,
      name: this.tripForm.name || '',
      destination: this.tripForm.destination || '',
      duration: this.tripForm.duration || '',
      basePrice: this.tripForm.basePrice || 0,
      maxCapacity: this.tripForm.maxCapacity || 0,
      categoryId: this.tripForm.categoryId || 0,
      description: this.tripForm.description || '',
      mainImage: this.tripForm.mainImage || '',
      difficulty: this.tripForm.difficulty as any,
      groupSizeMin: this.tripForm.groupSizeMin || 1,
      groupSizeMax: this.tripForm.groupSizeMax || 20,
      bestTime: this.tripForm.bestTime || '',
      cancellationPolicy: this.tripForm.cancellationPolicy || '',
      isActive: this.tripForm.isActive !== undefined ? this.tripForm.isActive : true
    };

    // Call the main trips service to update
    this.tripsService.updateTrip(this.trip.id, this.convertTripToDto(updatedTrip as Trip)).subscribe({
      next: (updatedTripResponse) => {
        console.log('Trip basic info updated successfully:', updatedTripResponse);
        // Update the local trip object with the response data
        if (this.trip) {
          this.trip.name = updatedTripResponse.name || this.trip.name;
          this.trip.destination = updatedTripResponse.destination || this.trip.destination;
          this.trip.duration = updatedTripResponse.duration || this.trip.duration;
          this.trip.basePrice = updatedTripResponse.basePrice || this.trip.basePrice;
          this.trip.maxCapacity = updatedTripResponse.maxCapacity || this.trip.maxCapacity;
          this.trip.categoryId = updatedTripResponse.categoryId || this.trip.categoryId;
          this.trip.description = updatedTripResponse.description || this.trip.description;
          this.trip.mainImage = updatedTripResponse.mainImage || this.trip.mainImage;
          this.trip.difficulty = (updatedTripResponse.difficulty as any) || this.trip.difficulty;
          this.trip.groupSizeMin = updatedTripResponse.groupSizeMin || this.trip.groupSizeMin;
          this.trip.groupSizeMax = updatedTripResponse.groupSizeMax || this.trip.groupSizeMax;
          this.trip.bestTime = updatedTripResponse.bestTime || this.trip.bestTime;
          this.trip.cancellationPolicy = updatedTripResponse.cancellationPolicy || this.trip.cancellationPolicy;
          this.trip.lastModifiedAt = updatedTripResponse.lastModifiedAt || this.trip.lastModifiedAt;
        }
        alert('Trip basic info updated successfully!');
      },
      error: (error) => {
        console.error('Error updating trip basic info:', error);
        alert('Failed to update trip. Please try again.');
      }
    });
  }

  // Create new trip
  private createNewTrip(): void {
    const newTrip: Trip = {
      name: this.tripForm.name || '',
      destination: this.tripForm.destination || '',
      duration: this.tripForm.duration || '',
      basePrice: this.tripForm.basePrice || 0,
      maxCapacity: this.tripForm.maxCapacity || 0,
      categoryId: this.tripForm.categoryId || 0,
      description: this.tripForm.description || '',
      mainImage: this.tripForm.mainImage || '',
      difficulty: this.tripForm.difficulty as any,
      groupSizeMin: this.tripForm.groupSizeMin || 1,
      groupSizeMax: this.tripForm.groupSizeMax || 20,
      bestTime: this.tripForm.bestTime || '',
      cancellationPolicy: this.tripForm.cancellationPolicy || '',
      isActive: this.tripForm.isActive !== undefined ? this.tripForm.isActive : true
    } as Trip;

    // Call the main trips service to create
    this.tripsService.createTrip(this.convertTripToDto(newTrip)).subscribe({
      next: (createdTrip) => {
        console.log('New trip created successfully:', createdTrip);
        // Update the local trip object and form with the response data
        if (this.trip) {
          this.trip.id = createdTrip.id;
          this.trip.name = createdTrip.name || this.trip.name;
          this.trip.destination = createdTrip.destination || this.trip.destination;
          this.trip.duration = createdTrip.duration || this.trip.duration;
          this.trip.basePrice = createdTrip.basePrice || this.trip.basePrice;
          this.trip.maxCapacity = createdTrip.maxCapacity || this.trip.maxCapacity;
          this.trip.categoryId = createdTrip.categoryId || this.trip.categoryId;
          this.trip.description = createdTrip.description || this.trip.description;
          this.trip.mainImage = createdTrip.mainImage || this.trip.mainImage;
          this.trip.difficulty = (createdTrip.difficulty as any) || this.trip.difficulty;
          this.trip.groupSizeMin = createdTrip.groupSizeMin || this.trip.groupSizeMin;
          this.trip.groupSizeMax = createdTrip.groupSizeMax || this.trip.groupSizeMax;
          this.trip.bestTime = createdTrip.bestTime || this.trip.bestTime;
          this.trip.cancellationPolicy = createdTrip.cancellationPolicy || this.trip.cancellationPolicy;
          this.trip.isActive = createdTrip.isActive !== undefined ? createdTrip.isActive : this.trip.isActive;
          this.trip.createdAt = createdTrip.createdAt || this.trip.createdAt;
          this.trip.lastModifiedAt = createdTrip.lastModifiedAt || this.trip.lastModifiedAt;
        } else {
          // If no existing trip, create a new one with the response data
          this.trip = {
            id: createdTrip.id,
            name: createdTrip.name || '',
            destination: createdTrip.destination || '',
            duration: createdTrip.duration || '',
            basePrice: createdTrip.basePrice || 0,
            maxCapacity: createdTrip.maxCapacity || 0,
            categoryId: createdTrip.categoryId || 0,
            description: createdTrip.description || '',
            mainImage: createdTrip.mainImage || '',
            difficulty: createdTrip.difficulty || TripDifficulty.EASY as any,
            groupSizeMin: createdTrip.groupSizeMin || 1,
            groupSizeMax: createdTrip.groupSizeMax || 20,
            bestTime: createdTrip.bestTime || '',
            cancellationPolicy: createdTrip.cancellationPolicy || '',
            isActive: createdTrip.isActive !== undefined ? createdTrip.isActive : true,
            // Add default values for missing properties
            categoryName: '',
            createdByUsername: '',
            lastModifiedByUsername: '',
            images: [],
            imageModels: [],
            highlights: [],
            inclusions: [],
            exclusions: [],
            availability: [],
            itinerary: []
          } as Trip;
        }

        // Update form with the new trip ID
        this.tripForm.id = createdTrip.id;

        alert('New trip created successfully! You can now add details, availability, and other information.');
      },
      error: (error) => {
        console.error('Error creating new trip:', error);
        alert('Failed to create trip. Please try again.');
      }
    });
  }

  // Helper method to convert Trip to TripDto
  private convertTripToDto(trip: Trip): TripDto {
    return {
      id: trip.id,
      name: trip.name,
      destination: trip.destination,
      duration: trip.duration,
      basePrice: trip.basePrice,
      mainImage: trip.mainImage,
      categoryId: trip.categoryId,
      description: trip.description,
      difficulty: trip.difficulty,
      groupSizeMin: trip.groupSizeMin,
      groupSizeMax: trip.groupSizeMax,
      maxCapacity: trip.maxCapacity,
      bestTime: trip.bestTime,
      cancellationPolicy: trip.cancellationPolicy,
      isActive: trip.isActive,
      images: trip.images?.map(img => ({
        id: img.id,
        imageUrl: img.imageUrl,
        sortOrder: img.sortOrder,
        isActive: img.isActive,
        createdAt: img.createdAt,
        lastModifiedAt: img.lastModifiedAt
      })) || [],
      imageModels: trip.imageModels?.map(img => ({
        id: img.id,
        fileName: img.fileName,
        fileSize: img.fileSize,
        description: img.description,
        sortOrder: img.sortOrder,
        isActive: img.isActive,
        isMainImage: img.isMainImage,
        createdAt: img.createdAt?.toISOString(),
        updatedAt: img.updatedAt?.toISOString(),
        tripId: img.tripId
      })),
      inclusions: trip.inclusions?.map(inc => ({
        id: inc.id,
        inclusion: inc.inclusion,
        sortOrder: inc.sortOrder,
        isActive: inc.isActive,
        createdAt: inc.createdAt,
        lastModifiedAt: inc.lastModifiedAt
      })) || [],
      exclusions: trip.exclusions?.map(exc => ({
        id: exc.id,
        exclusion: exc.exclusion,
        sortOrder: exc.sortOrder,
        isActive: exc.isActive,
        createdAt: exc.createdAt
      })) || [],
      highlights: trip.highlights?.map(hl => ({
        id: hl.id,
        highlight: hl.highlight,
        sortOrder: hl.sortOrder,
        isActive: hl.isActive,
        createdAt: hl.createdAt
      })) || [],
      availability: trip.availability?.map(avail => ({
        id: avail.id,
        date: avail.date,
        availableSpots: avail.availableSpots,
        maxCapacity: avail.maxCapacity,
        price: avail.price,
        isActive: avail.isActive,
        createdAt: avail.createdAt,
        lastModifiedAt: avail.lastModifiedAt
      })) || [],
      itinerary: trip.itinerary?.map(itin => ({
        id: itin.id,
        dayNumber: itin.dayNumber,
        title: itin.title,
        description: itin.description,
        accommodation: itin.accommodation,
        sortOrder: itin.sortOrder,
        isActive: itin.isActive,
        activities: itin.activities?.map(act => ({
          id: act.id,
          time: act.time,
          description: act.description,
          sortOrder: act.sortOrder,
          isActive: act.isActive,
          createdAt: act.createdAt,
          lastModifiedAt: act.lastModifiedAt
        })) || [],
        meals: itin.meals?.map(meal => ({
          id: meal.id,
          mealType: meal.mealType,
          description: meal.description,
          sortOrder: meal.sortOrder,
          isActive: meal.isActive,
          createdAt: meal.createdAt,
          lastModifiedAt: meal.lastModifiedAt
        })) || [],
        createdAt: itin.createdAt,
        lastModifiedAt: itin.lastModifiedAt
      })) || [],
      createdAt: trip.createdAt,
      lastModifiedAt: trip.lastModifiedAt
    };
  }

  isFormComplete(): boolean {
    return this.isCurrentTabValid() && this.activeTripTab === 'inclusions';
  }

  // Form actions
  onCloseModal(): void {
    this.closeModal.emit();
  }

  onSaveTrip(): void {
    if (this.isFormComplete()) {
      const tripToSave: Trip = {
        ...this.tripForm,
        difficulty: this.tripForm.difficulty as any, // Convert string to enum
        id: this.trip?.id
      } as Trip;

      this.saveTrip.emit(tripToSave);
    }
  }

  // Price and capacity management
  onBasePriceChange(): void {
    // Base price change doesn't affect availability in simplified model
  }

  onTotalCapacityChange(): void {
    // Update availability spots if they exceed new total capacity
    this.tripForm.availability?.forEach(avail => {
      if (avail.availableSpots > (this.tripForm.maxCapacity || 0)) {
        avail.availableSpots = this.tripForm.maxCapacity || 0;
      }
    });
  }

  // Availability management with service integration
  addAvailabilityDate(): void {
    if (this.newAvailabilityDate && this.newAvailabilitySpots && this.trip?.id) {
      const newAvailability = {
        tripId: this.trip?.id || 0,
        date: this.newAvailabilityDate,
        maxCapacity: this.newAvailabilityMaxCapacity,
        availableSpots: this.newAvailabilitySpots,
        price: this.newAvailabilityPrice,
        isActive: true
      };

      this.tripAvailabilityService.addAvailability(this.trip.id, newAvailability).subscribe({
        next: (savedAvailability) => {
          console.log('Availability added successfully:', savedAvailability);
          if (!this.tripForm.availability) {
            this.tripForm.availability = [];
          }
          this.tripForm.availability.push({
            id: savedAvailability.id || 0,
            date: savedAvailability.date,
            maxCapacity: savedAvailability.maxCapacity || 0,
            availableSpots: savedAvailability.availableSpots,
            price: savedAvailability.price || 0,
            tripId: this.trip?.id || 0,
            isActive: savedAvailability.isActive || true,
            createdAt: savedAvailability.createdAt || new Date().toISOString(),
            lastModifiedAt: savedAvailability.lastModifiedAt || new Date().toISOString()
          });

          // Reset form
          this.newAvailabilityDate = '';
          this.newAvailabilityMaxCapacity = 0;
          this.newAvailabilitySpots = 0;
          this.newAvailabilityPrice = 0;
        },
        error: (error) => {
          console.error('Error adding availability:', error);
          alert('Failed to add availability. Please try again.');
        }
      });
    }
  }

  removeAvailabilityDate(index: number): void {
    const availability = this.tripForm.availability?.[index];
    if (availability?.id && this.trip?.id) {
      this.tripAvailabilityService.deleteAvailability(availability.id).subscribe({
        next: () => {
          console.log('Availability deleted successfully');
          this.tripForm.availability?.splice(index, 1);
        },
        error: (error) => {
          console.error('Error deleting availability:', error);
          alert('Failed to delete availability. Please try again.');
        }
      });
    } else {
      // If no ID (new item), just remove from array
      this.tripForm.availability?.splice(index, 1);
    }
  }

  saveAvailabilityDate(index: number): void {
    const availability = this.tripForm.availability?.[index];
    if (!availability || !this.trip?.id) return;

    if (availability.id) {
      // Update existing availability
      this.tripAvailabilityService.updateAvailability(availability.id, {
        tripId: this.trip.id,
        date: availability.date,
        maxCapacity: availability.maxCapacity || 0,
        availableSpots: availability.availableSpots,
        price: availability.price || 0,
        isActive: availability.isActive || true
      }).subscribe({
        next: (updatedAvailability) => {
          console.log('Availability updated successfully:', updatedAvailability);
          // Update the local availability with the response data
          this.tripForm.availability![index] = {
            ...availability,
            availableSpots: updatedAvailability.availableSpots,
            lastModifiedAt: updatedAvailability.lastModifiedAt || new Date().toISOString()
          };
        },
        error: (error) => {
          console.error('Error updating availability:', error);
          alert('Failed to update availability. Please try again.');
        }
      });
    } else {
      // Create new availability
      this.tripAvailabilityService.addAvailability(this.trip.id, {
        tripId: this.trip.id,
        date: availability.date,
        maxCapacity: availability.maxCapacity || 0,
        availableSpots: availability.availableSpots,
        price: availability.price || 0,
        isActive: availability.isActive || true
      }).subscribe({
        next: (savedAvailability) => {
          console.log('Availability created successfully:', savedAvailability);
          // Update the local availability with the response data (including the new ID)
          this.tripForm.availability![index] = {
            ...availability,
            id: savedAvailability.id || 0,
            createdAt: savedAvailability.createdAt || new Date().toISOString(),
            lastModifiedAt: savedAvailability.lastModifiedAt || new Date().toISOString()
          };
        },
        error: (error) => {
          console.error('Error creating availability:', error);
          alert('Failed to create availability. Please try again.');
        }
      });
    }
  }

  getAvailabilityStatus(avail: TripAvailability): string {
    if (avail.availableSpots === 0) return 'Sold Out';
    if (avail.availableSpots <= 5) return 'Limited';
    if (avail.availableSpots <= 15) return 'Filling Up';
    return 'Available';
  }

  getAvailabilityStatusClass(avail: TripAvailability): string {
    if (avail.availableSpots === 0) return 'bg-danger';
    if (avail.availableSpots <= 5) return 'bg-warning';
    if (avail.availableSpots <= 15) return 'bg-info';
    return 'bg-success';
  }

  // Itinerary management with service integration
  addItineraryDay(): void {
    if (!this.tripForm.itinerary) {
      this.tripForm.itinerary = [];
    }

    const newDay = {
      dayNumber: (this.tripForm.itinerary.length || 0) + 1,
      title: '',
      description: '',
      accommodation: '',
      sortOrder: this.tripForm.itinerary.length || 0,
      isActive: true,
      activities: [],
      meals: []
    };

    this.tripForm.itinerary.push(newDay);
  }

  saveItineraryDay(dayIndex: number): void {
    const day = this.tripForm.itinerary?.[dayIndex];
    if (!day || !this.trip?.id) return;

    if (day.title.trim() === '' || day.description.trim() === '') {
      alert('Please enter both title and description before saving.');
      return;
    }

    if (day.id) {
      // Update existing itinerary day
      this.tripItineraryService.updateItinerary(day.id, {
        dayNumber: day.dayNumber || dayIndex + 1,
        title: day.title,
        description: day.description,
        accommodation: day.accommodation || '',
        sortOrder: day.sortOrder || dayIndex,
        isActive: day.isActive !== undefined ? day.isActive : true,
        tripId: this.trip.id
      }).subscribe({
        next: (updatedDay) => {
          console.log('Itinerary day updated successfully');
          // Update the local day with the response data
          this.tripForm.itinerary![dayIndex] = {
            id: updatedDay.id,
            dayNumber: updatedDay.dayNumber || dayIndex + 1,
            title: updatedDay.title,
            description: updatedDay.description,
            accommodation: updatedDay.accommodation || '',
            sortOrder: updatedDay.sortOrder || dayIndex,
            isActive: updatedDay.isActive !== undefined ? updatedDay.isActive : true,
            createdAt: updatedDay.createdAt,
            lastModifiedAt: updatedDay.lastModifiedAt,
            activities: day.activities || [],
            meals: day.meals || []
          };
        },
        error: (error) => {
          console.error('Error updating itinerary day:', error);
          alert('Failed to update itinerary day. Please try again.');
        }
      });
    } else {
      // Create new itinerary day - use path variable for tripId
      this.tripItineraryService.addItinerary(this.trip.id, {
        dayNumber: dayIndex + 1,
        title: day.title,
        description: day.description,
        accommodation: day.accommodation || '',
        sortOrder: dayIndex,
        isActive: day.isActive !== undefined ? day.isActive : true,
        tripId: this.trip.id
      }).subscribe({
        next: (newDay) => {
          console.log('Itinerary day added successfully');
          // Update the local day with the response data (including the new ID)
          this.tripForm.itinerary![dayIndex] = {
            id: newDay.id,
            dayNumber: newDay.dayNumber || dayIndex + 1,
            title: newDay.title,
            description: newDay.description,
            accommodation: newDay.accommodation || '',
            sortOrder: newDay.sortOrder || dayIndex,
            isActive: newDay.isActive !== undefined ? newDay.isActive : true,
            createdAt: newDay.createdAt,
            lastModifiedAt: newDay.lastModifiedAt,
            activities: day.activities || [],
            meals: day.meals || []
          };
        },
        error: (error) => {
          console.error('Error adding itinerary day:', error);
          alert('Failed to add itinerary day. Please try again.');
        }
      });
    }
  }

  removeItineraryDay(dayIndex: number): void {
    const day = this.tripForm.itinerary?.[dayIndex];
    if (day?.id && this.trip?.id) {
      this.tripItineraryService.deleteItinerary(day.id).subscribe({
        next: () => {
          console.log('Itinerary day deleted successfully');
          this.tripForm.itinerary?.splice(dayIndex, 1);
          // Renumber remaining days
          this.tripForm.itinerary?.forEach((remainingDay, index) => {
            remainingDay.dayNumber = index + 1;
          });
        },
        error: (error) => {
          console.error('Error deleting itinerary day:', error);
          alert('Failed to delete itinerary day. Please try again.');
        }
      });
    } else {
      // If no ID (new item), just remove from array
      this.tripForm.itinerary?.splice(dayIndex, 1);
      // Renumber remaining days
      this.tripForm.itinerary?.forEach((remainingDay, index) => {
        remainingDay.dayNumber = index + 1;
      });
    }
  }

  addActivity(dayIndex: number): void {
    if (this.tripForm.itinerary && this.tripForm.itinerary[dayIndex]) {
      // Check if the itinerary day has been saved (has an ID)
      if (!this.tripForm.itinerary[dayIndex].id) {
        alert('Please save the itinerary day first before adding activities.');
        return;
      }

      const newActivity = {
        time: '',
        description: '',
        sortOrder: this.tripForm.itinerary[dayIndex].activities.length || 0,
        isActive: true
      };
      this.tripForm.itinerary[dayIndex].activities.push(newActivity);
    }
  }

  saveActivity(dayIndex: number, activityIndex: number): void {
    const activity = this.tripForm.itinerary?.[dayIndex]?.activities[activityIndex];
    if (!activity || !this.trip?.id) return;

    // Check if the itinerary day has been saved (has an ID)
    if (!this.tripForm.itinerary![dayIndex].id) {
      alert('Please save the itinerary day first before adding activities.');
      return;
    }

    if (activity.time.trim() === '' || activity.description.trim() === '') {
      alert('Please enter both time and description before saving.');
      return;
    }

    if (activity.id) {
      // Update existing activity
      this.tripActivityService.updateActivity(activity.id, {
        time: activity.time,
        description: activity.description,
        sortOrder: activity.sortOrder || activityIndex,
        isActive: activity.isActive !== undefined ? activity.isActive : true,
        tripId: this.trip.id
      }).subscribe({
        next: (updatedActivity) => {
          console.log('Activity updated successfully');
          // Update the local activity with the response data
          this.tripForm.itinerary![dayIndex].activities[activityIndex] = {
            id: updatedActivity.id,
            time: updatedActivity.time,
            description: updatedActivity.description,
            sortOrder: updatedActivity.sortOrder || activityIndex,
            isActive: updatedActivity.isActive !== undefined ? updatedActivity.isActive : true,
            createdAt: updatedActivity.createdAt,
            lastModifiedAt: updatedActivity.lastModifiedAt
          };
        },
        error: (error) => {
          console.error('Error updating activity:', error);
          alert('Failed to update activity. Please try again.');
        }
      });
    } else {
      // Create new activity
      this.tripActivityService.addActivity(this.trip.id, {
        time: activity.time,
        description: activity.description,
        sortOrder: activityIndex,
        isActive: activity.isActive !== undefined ? activity.isActive : true,
        tripId: this.trip.id,
        itineraryId: this.tripForm.itinerary![dayIndex].id
      }).subscribe({
        next: (newActivity) => {
          console.log('Activity added successfully');
          // Update the local activity with the response data (including the new ID)
          this.tripForm.itinerary![dayIndex].activities[activityIndex] = {
            id: newActivity.id,
            time: newActivity.time,
            description: newActivity.description,
            sortOrder: newActivity.sortOrder || activityIndex,
            isActive: newActivity.isActive !== undefined ? newActivity.isActive : true,
            createdAt: newActivity.createdAt,
            lastModifiedAt: newActivity.lastModifiedAt
          };
          console.log('New activity created with itineraryId:', newActivity.itineraryId);
        },
        error: (error) => {
          console.error('Error adding activity:', error);
          alert('Failed to add activity. Please try again.');
        }
      });
    }
  }

  removeActivity(dayIndex: number, activityIndex: number): void {
    const activity = this.tripForm.itinerary?.[dayIndex]?.activities[activityIndex];
    if (activity?.id) {
      this.tripActivityService.deleteActivity(activity.id).subscribe({
        next: () => {
          console.log('Activity deleted successfully');
          this.tripForm.itinerary?.[dayIndex]?.activities.splice(activityIndex, 1);
        },
        error: (error) => {
          console.error('Error deleting activity:', error);
          alert('Failed to delete activity. Please try again.');
        }
      });
    } else {
      // If no ID (new item), just remove from array
      this.tripForm.itinerary?.[dayIndex]?.activities.splice(activityIndex, 1);
    }
  }

  addMeal(dayIndex: number): void {
    if (this.tripForm.itinerary && this.tripForm.itinerary[dayIndex]) {
      // Check if the itinerary day has been saved (has an ID)
      if (!this.tripForm.itinerary[dayIndex].id) {
        alert('Please save the itinerary day first before adding meals.');
        return;
      }

      const newMeal = {
        mealType: '',
        description: '',
        sortOrder: this.tripForm.itinerary[dayIndex].meals.length || 0,
        isActive: true
      };
      this.tripForm.itinerary[dayIndex].meals.push(newMeal);
    }
  }

  saveMeal(dayIndex: number, mealIndex: number): void {
    const meal = this.tripForm.itinerary?.[dayIndex]?.meals[mealIndex];
    if (!meal || !this.trip?.id) return;

    // Check if the itinerary day has been saved (has an ID)
    if (!this.tripForm.itinerary![dayIndex].id) {
      alert('Please save the itinerary day first before adding meals.');
      return;
    }

    if (meal.mealType.trim() === '' || meal.description.trim() === '') {
      alert('Please enter both meal type and description before saving.');
      return;
    }

    if (meal.id) {
      // Update existing meal
      this.tripMealService.updateMeal(meal.id, {
        mealType: meal.mealType,
        description: meal.description,
        sortOrder: meal.sortOrder || mealIndex,
        isActive: meal.isActive !== undefined ? meal.isActive : true,
        tripId: this.trip.id
      }).subscribe({
        next: (updatedMeal) => {
          console.log('Meal updated successfully');
          // Update the local meal with the response data
          this.tripForm.itinerary![dayIndex].meals[mealIndex] = {
            id: updatedMeal.id,
            mealType: updatedMeal.mealType,
            description: updatedMeal.description,
            sortOrder: updatedMeal.sortOrder || mealIndex,
            isActive: updatedMeal.isActive !== undefined ? updatedMeal.isActive : true,
            createdAt: updatedMeal.createdAt,
            lastModifiedAt: updatedMeal.lastModifiedAt
          };
        },
        error: (error) => {
          console.error('Error updating meal:', error);
          alert('Failed to update meal. Please try again.');
        }
      });
    } else {
      // Create new meal
      this.tripMealService.addMeal(this.trip.id, {
        mealType: meal.mealType,
        description: meal.description,
        sortOrder: mealIndex,
        isActive: meal.isActive !== undefined ? meal.isActive : true,
        tripId: this.trip.id,
        itineraryId: this.tripForm.itinerary![dayIndex].id
      }).subscribe({
        next: (newMeal) => {
          console.log('Meal added successfully');
          // Update the local meal with the response data (including the new ID)
          this.tripForm.itinerary![dayIndex].meals[mealIndex] = {
            id: newMeal.id,
            mealType: newMeal.mealType,
            description: newMeal.description,
            sortOrder: newMeal.sortOrder || mealIndex,
            isActive: newMeal.isActive !== undefined ? newMeal.isActive : true,
            createdAt: newMeal.createdAt,
            lastModifiedAt: newMeal.lastModifiedAt
          };
          console.log('New meal created with itineraryId:', newMeal.itineraryId);
        },
        error: (error) => {
          console.error('Error adding meal:', error);
          alert('Failed to add meal. Please try again.');
        }
      });
    }
  }

  removeMeal(dayIndex: number, mealIndex: number): void {
    const meal = this.tripForm.itinerary?.[dayIndex]?.meals[mealIndex];
    if (meal?.id) {
      this.tripMealService.deleteMeal(meal.id).subscribe({
        next: () => {
          console.log('Meal deleted successfully');
          this.tripForm.itinerary?.[dayIndex]?.meals.splice(mealIndex, 1);
        },
        error: (error) => {
          console.error('Error deleting meal:', error);
          alert('Failed to delete meal. Please try again.');
        }
      });
    } else {
      // If no ID (new item), just remove from array
      this.tripForm.itinerary?.[dayIndex]?.meals.splice(mealIndex, 1);
    }
  }

  // Image management with service integration
  addImage(): void {
    if (!this.tripForm.images) {
      this.tripForm.images = [];
    }

    const newImage = {
      imageUrl: '',
      sortOrder: this.tripForm.images.length || 0,
      isActive: true
    };

    this.tripForm.images.push(newImage);
  }

  saveImage(index: number): void {
    const image = this.tripForm.images?.[index];
    if (!image || !this.trip?.id) return;

    if (image.imageUrl.trim() === '') {
      alert('Please enter an image URL before saving.');
      return;
    }

    if (image.id) {
      // Update existing image
      this.tripImageService.updateImage(image.id, {
        id: image.id,
        imageUrl: image.imageUrl,
        sortOrder: image.sortOrder || 0,
        isActive: image.isActive !== undefined ? image.isActive : true,
        tripId: this.trip.id,
        createdAt: image.createdAt
      }).subscribe({
        next: (updatedImage) => {
          console.log('Image updated successfully:', updatedImage);
          // Update the local image with the response data
          if (this.tripForm.images && this.tripForm.images[index]) {
            this.tripForm.images[index] = {
              ...this.tripForm.images[index],
              imageUrl: updatedImage.imageUrl,
              sortOrder: updatedImage.sortOrder || 0,
              isActive: updatedImage.isActive !== undefined ? updatedImage.isActive : true
            };
          }
          alert('Image updated successfully!');
        },
        error: (error) => {
          console.error('Error updating image:', error);
          alert('Failed to update image. Please try again.');
        }
      });
    } else {
      // Create new image
      this.tripImageService.addImage(this.trip.id, {
        imageUrl: image.imageUrl,
        sortOrder: image.sortOrder || 0,
        isActive: image.isActive !== undefined ? image.isActive : true,
        tripId: this.trip.id
      }).subscribe({
        next: (savedImage) => {
          console.log('Image created successfully:', savedImage);
          // Update the local image with the response data including ID
          if (this.tripForm.images && this.tripForm.images[index]) {
            this.tripForm.images[index] = {
              ...this.tripForm.images[index],
              id: savedImage.id,
              imageUrl: savedImage.imageUrl,
              sortOrder: savedImage.sortOrder || 0,
              isActive: savedImage.isActive !== undefined ? savedImage.isActive : true,
              createdAt: savedImage.createdAt || new Date().toISOString()
            };
          }
          alert('Image saved successfully!');
        },
        error: (error) => {
          console.error('Error creating image:', error);
          alert('Failed to save image. Please try again.');
        }
      });
    }
  }

  removeImage(index: number): void {
    const image = this.tripForm.images?.[index];
    if (image?.id && this.trip?.id) {
      this.tripImageService.deleteImage(image.id).subscribe({
        next: () => {
          console.log('Image deleted successfully');
          this.tripForm.images?.splice(index, 1);
        },
        error: (error) => {
          console.error('Error deleting image:', error);
          alert('Failed to delete image. Please try again.');
        }
      });
    } else {
      // If no ID (new item), just remove from array
      this.tripForm.images?.splice(index, 1);
    }
  }

  saveMainImage(): void {
    if (!this.trip?.id || !this.tripForm.mainImage?.trim()) return;

    // For main image, we update the trip itself
    // This would typically call the trip update service
    // For now, we'll just show a success message
    alert('Main image updated successfully!');
  }

  generateRandomImage(): void {
    const randomImages = [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3',
      'https://picsum.photos/800/600?random=4',
      'https://picsum.photos/800/600?random=5'
    ];
    this.tripForm.mainImage = randomImages[Math.floor(Math.random() * randomImages.length)];
  }

  generateRandomImageForIndex(index: number): void {
    if (this.tripForm.images && this.tripForm.images[index]) {
      const randomImages = [
        'https://picsum.photos/800/600?random=10',
        'https://picsum.photos/800/600?random=11',
        'https://picsum.photos/800/600?random=12',
        'https://picsum.photos/800/600?random=13',
        'https://picsum.photos/800/600?random=14'
      ];
      this.tripForm.images[index].imageUrl = randomImages[Math.floor(Math.random() * randomImages.length)];
    }
  }

  updateImageUrl(index: number, value: string): void {
    if (this.tripForm.images && this.tripForm.images[index]) {
      this.tripForm.images[index].imageUrl = value;
    }
  }

  updateActivityTime(dayIndex: number, activityIndex: number, value: string): void {
    if (this.tripForm.itinerary && this.tripForm.itinerary[dayIndex] && this.tripForm.itinerary[dayIndex].activities) {
      if (!this.tripForm.itinerary[dayIndex].activities[activityIndex]) {
        this.tripForm.itinerary[dayIndex].activities[activityIndex] = { time: '', description: '', sortOrder: 0, isActive: true };
      }
      this.tripForm.itinerary[dayIndex].activities[activityIndex].time = value;
    }
  }

  updateActivityDescription(dayIndex: number, activityIndex: number, value: string): void {
    if (this.tripForm.itinerary && this.tripForm.itinerary[dayIndex] && this.tripForm.itinerary[dayIndex].activities) {
      if (!this.tripForm.itinerary[dayIndex].activities[activityIndex]) {
        this.tripForm.itinerary[dayIndex].activities[activityIndex] = { time: '', description: '', sortOrder: 0, isActive: true };
      }
      this.tripForm.itinerary[dayIndex].activities[activityIndex].description = value;
    }
  }

  updateMealType(dayIndex: number, mealIndex: number, value: string): void {
    if (this.tripForm.itinerary && this.tripForm.itinerary[dayIndex] && this.tripForm.itinerary[dayIndex].meals) {
      if (!this.tripForm.itinerary[dayIndex].meals[mealIndex]) {
        this.tripForm.itinerary[dayIndex].meals[mealIndex] = { mealType: '', description: '', sortOrder: 0, isActive: true };
      }
      this.tripForm.itinerary[dayIndex].meals[mealIndex].mealType = value;
    }
  }

  updateMealDescription(dayIndex: number, mealIndex: number, value: string): void {
    if (this.tripForm.itinerary && this.tripForm.itinerary[dayIndex] && this.tripForm.itinerary[dayIndex].meals) {
      if (!this.tripForm.itinerary[dayIndex].meals[mealIndex]) {
        this.tripForm.itinerary[dayIndex].meals[mealIndex] = { mealType: '', description: '', sortOrder: 0, isActive: true };
      }
      this.tripForm.itinerary[dayIndex].meals[mealIndex].description = value;
    }
  }

  // Highlights, inclusions, exclusions management with service integration
  addHighlight(): void {
    if (!this.tripForm.highlights) {
      this.tripForm.highlights = [];
    }

    const newHighlight = {
      highlight: '',
      sortOrder: this.tripForm.highlights.length || 0,
      isActive: true
    };

    this.tripForm.highlights.push(newHighlight);
  }

  saveHighlight(index: number): void {
    const highlight = this.tripForm.highlights?.[index];
    if (highlight && this.trip?.id) {
      // If highlight has an ID, update existing highlight
      if (highlight.id) {
        this.tripHighlightService.updateHighlight(highlight.id, {
          id: highlight.id,
          highlight: highlight.highlight,
          sortOrder: highlight.sortOrder || 0,
          isActive: highlight.isActive !== undefined ? highlight.isActive : true,
          tripId: this.trip.id,
          createdAt: highlight.createdAt,
          // lastModifiedAt is handled automatically by the backend
        }).subscribe({
          next: (updatedHighlight) => {
            console.log('Highlight updated successfully:', updatedHighlight);
            // Update the local highlight with the response data
            if (this.tripForm.highlights && this.tripForm.highlights[index]) {
              this.tripForm.highlights[index] = {
                ...this.tripForm.highlights[index],
                id: updatedHighlight.id,
                highlight: updatedHighlight.highlight,
                sortOrder: updatedHighlight.sortOrder || 0,
                isActive: updatedHighlight.isActive !== undefined ? updatedHighlight.isActive : true,
                createdAt: updatedHighlight.createdAt
              };
            }
            //alert('Highlight saved successfully!');
          },
          error: (error) => {
            console.error('Error updating highlight:', error);
            alert('Failed to save highlight. Please try again.');
          }
        });
      } else {
        // If no ID, create new highlight
        this.tripHighlightService.addHighlight(this.trip.id, {
          highlight: highlight.highlight,
          sortOrder: highlight.sortOrder || 0,
          isActive: highlight.isActive !== undefined ? highlight.isActive : true,
          tripId: this.trip.id
          // createdAt and lastModifiedAt are handled automatically by the backend
        }).subscribe({
          next: (savedHighlight) => {
            console.log('Highlight created successfully:', savedHighlight);
            // Update the local highlight with the response data including ID
            if (this.tripForm.highlights && this.tripForm.highlights[index]) {
              this.tripForm.highlights[index] = {
                ...this.tripForm.highlights[index],
                id: savedHighlight.id,
                highlight: savedHighlight.highlight,
                sortOrder: savedHighlight.sortOrder || 0,
                isActive: savedHighlight.isActive !== undefined ? savedHighlight.isActive : true,
                createdAt: savedHighlight.createdAt
              };
            }
            //alert('Highlight saved successfully!');
          },
          error: (error) => {
            console.error('Error creating highlight:', error);
            alert('Failed to save highlight. Please try again.');
          }
        });
      }
    } else {
      alert('Please select a trip first or enter highlight text.');
    }
  }

  moveHighlightUp(index: number): void {
    if (index > 0 && this.tripForm.highlights && this.trip?.id) {
      // UX trick: Show reordering immediately for better user experience
      const highlights = [...this.tripForm.highlights];
      const [movedItem] = highlights.splice(index, 1);
      highlights.splice(index - 1, 0, movedItem);

      // Update sortOrder for all items
      highlights.forEach((highlight, i) => {
        highlight.sortOrder = i;
      });

      // Apply local changes immediately for instant visual feedback
      this.tripForm.highlights = highlights;
      console.log('Highlights reordered locally for UX');



      // Now call backend to persist the changes
      const newOrder = [...this.tripForm.highlights.map(h => h.id || 0)];
      this.tripHighlightService.reorderHighlights(this.trip.id, newOrder).subscribe({
        next: (reorderedHighlights) => {

          // Map DTOs to model format and update the form
          this.tripForm.highlights = reorderedHighlights.map(dto => ({
            id: dto.id,
            highlight: dto.highlight,
            sortOrder: dto.sortOrder || 0,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            createdAt: dto.createdAt
          }));
          console.log('Highlights reordered successfully:', reorderedHighlights);
        },
        error: (error) => {
          console.error('Error reordering highlights:', error);
          alert('Failed to reorder highlights. Please try again.');
        }
      });
    }
  }

  moveHighlightDown(index: number): void {
    if (this.tripForm.highlights && index < this.tripForm.highlights.length - 1 && this.trip?.id) {
      // UX trick: Show reordering immediately for better user experience
      const highlights = [...this.tripForm.highlights];
      const [movedItem] = highlights.splice(index, 1);
      highlights.splice(index + 1, 0, movedItem);

      // Update sortOrder for all items
      highlights.forEach((highlight, i) => {
        highlight.sortOrder = i;
      });

      // Apply local changes immediately for instant visual feedback
      this.tripForm.highlights = highlights;
      console.log('Highlights reordered locally for UX');

      // Now call backend to persist the changes
      const newOrder = [...this.tripForm.highlights.map(h => h.id || 0)];
      this.tripHighlightService.reorderHighlights(this.trip.id, newOrder).subscribe({
        next: (reorderedHighlights) => {
          // Map DTOs to model format and update the form
          this.tripForm.highlights = reorderedHighlights.map(dto => ({
            id: dto.id,
            highlight: dto.highlight,
            sortOrder: dto.sortOrder || 0,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            createdAt: dto.createdAt
          }));
          console.log('Highlights reordered successfully:', reorderedHighlights);
        },
        error: (error) => {
          console.error('Error reordering highlights:', error);
          alert('Failed to reorder highlights. Please try again.');
        }
      });
    }
  }

  removeHighlight(index: number): void {
    const highlight = this.tripForm.highlights?.[index];
    if (highlight?.id && this.trip?.id) {
      this.tripHighlightService.deleteHighlight(highlight.id).subscribe({
        next: () => {
          console.log('Highlight deleted successfully');
          // Remove from the array since it's now inactive
          this.tripForm.highlights?.splice(index, 1);
        },
        error: (error) => {
          console.error('Error deleting highlight:', error);
          alert('Failed to delete highlight. Please try again.');
        }
      });
    } else {
      // If no ID (new item), just remove from array
      this.tripForm.highlights?.splice(index, 1);
    }
  }

  addInclusion(): void {
    if (!this.tripForm.inclusions) {
      this.tripForm.inclusions = [];
    }

    const newInclusion = {
      inclusion: '',
      sortOrder: this.tripForm.inclusions.length || 0,
      isActive: true
    };

    this.tripForm.inclusions.push(newInclusion);
  }

  saveInclusion(index: number): void {
    const inclusion = this.tripForm.inclusions?.[index];
    if (!inclusion || !this.trip?.id) return;

    if (inclusion.inclusion.trim() === '') {
      alert('Please enter inclusion text before saving.');
      return;
    }

    if (inclusion.id) {
      // Update existing inclusion
      this.tripInclusionService.updateInclusion(inclusion.id, {
        inclusion: inclusion.inclusion,
        sortOrder: inclusion.sortOrder || 0,
        isActive: inclusion.isActive !== undefined ? inclusion.isActive : true,
        tripId: this.trip.id
      }).subscribe({
        next: (updatedInclusion) => {
          console.log('Inclusion updated successfully');
          // Update the local inclusion with the response data
          this.tripForm.inclusions![index] = {
            id: updatedInclusion.id,
            inclusion: updatedInclusion.inclusion,
            sortOrder: updatedInclusion.sortOrder || 0,
            isActive: updatedInclusion.isActive !== undefined ? updatedInclusion.isActive : true,
            createdAt: updatedInclusion.createdAt
          };
        },
        error: (error) => {
          console.error('Error updating inclusion:', error);
          alert('Failed to update inclusion. Please try again.');
        }
      });
    } else {
      // Create new inclusion
      this.tripInclusionService.addInclusion(this.trip.id, {
        inclusion: inclusion.inclusion,
        sortOrder: inclusion.sortOrder || 0,
        isActive: inclusion.isActive !== undefined ? inclusion.isActive : true,
        tripId: this.trip.id
      }).subscribe({
        next: (newInclusion) => {
          console.log('Inclusion added successfully');
          // Update the local inclusion with the response data (including the new ID)
          this.tripForm.inclusions![index] = {
            id: newInclusion.id,
            inclusion: newInclusion.inclusion,
            sortOrder: newInclusion.sortOrder || 0,
            isActive: newInclusion.isActive !== undefined ? newInclusion.isActive : true,
            createdAt: newInclusion.createdAt
          };
        },
        error: (error) => {
          console.error('Error adding inclusion:', error);
          alert('Failed to add inclusion. Please try again.');
        }
      });
    }
  }

  moveInclusionUp(index: number): void {
    if (index > 0 && this.tripForm.inclusions && this.trip?.id) {
      // UX trick: Show reordering immediately for better user experience
      const inclusions = [...this.tripForm.inclusions];
      const [movedItem] = inclusions.splice(index, 1);
      inclusions.splice(index - 1, 0, movedItem);

      // Update sortOrder for all items
      inclusions.forEach((inclusion, i) => {
        inclusion.sortOrder = i;
      });

      // Apply local changes immediately for instant visual feedback
      this.tripForm.inclusions = inclusions;
      console.log('Inclusions reordered locally for UX:', this.tripForm.inclusions);

      // Now call backend to persist the changes
      const newOrder = [...this.tripForm.inclusions.map(inc => inc.id || 0)];
      this.tripInclusionService.reorderInclusions(this.trip.id, newOrder).subscribe({
        next: (reorderedInclusions) => {
          console.log('Backend returned reordered inclusions:', reorderedInclusions);

          // Map DTOs to model format and update the form
          const mappedInclusions = reorderedInclusions.map(dto => ({
            id: dto.id,
            inclusion: dto.inclusion,
            sortOrder: dto.sortOrder || 0,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            createdAt: dto.createdAt
          }));

          // Force change detection by creating a new array reference
          this.tripForm.inclusions = [...mappedInclusions];
          console.log('Final inclusions after backend update:', this.tripForm.inclusions);

          // Force Angular change detection
          //this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error reordering inclusions:', error);
          alert('Failed to reorder inclusions. Please try again.');
        }
      });
    }
  }

  moveInclusionDown(index: number): void {
    if (this.tripForm.inclusions && index < this.tripForm.inclusions.length - 1 && this.trip?.id) {
      // UX trick: Show reordering immediately for better user experience
      const inclusions = [...this.tripForm.inclusions];
      const [movedItem] = inclusions.splice(index, 1);
      inclusions.splice(index + 1, 0, movedItem);

      // Update sortOrder for all items
      inclusions.forEach((inclusion, i) => {
        inclusion.sortOrder = i;
      });

      // Apply local changes immediately for instant visual feedback
      this.tripForm.inclusions = inclusions;
      console.log('Inclusions reordered locally for UX:', this.tripForm.inclusions);

      // Now call backend to persist the changes
      const newOrder = [...this.tripForm.inclusions.map(inc => inc.id || 0)];
      this.tripInclusionService.reorderInclusions(this.trip.id, newOrder).subscribe({
        next: (reorderedInclusions) => {
          console.log('Backend returned reordered inclusions:', reorderedInclusions);

          // Map DTOs to model format and update the form
          const mappedInclusions = reorderedInclusions.map(dto => ({
            id: dto.id,
            inclusion: dto.inclusion,
            sortOrder: dto.sortOrder || 0,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            createdAt: dto.createdAt
          }));

          // Force change detection by creating a new array reference
          this.tripForm.inclusions = [...mappedInclusions];
          console.log('Final inclusions after backend update:', this.tripForm.inclusions);

          // Force Angular change detection
          // this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error reordering inclusions:', error);
          alert('Failed to reorder inclusions. Please try again.');
        }
      });
    }
  }

  removeInclusion(index: number): void {
    const inclusion = this.tripForm.inclusions?.[index];
    if (inclusion?.id && this.trip?.id) {
      this.tripInclusionService.deleteInclusion(inclusion.id).subscribe({
        next: () => {
          console.log('Inclusion deleted successfully');
          this.tripForm.inclusions?.splice(index, 1);
        },
        error: (error) => {
          console.error('Error deleting inclusion:', error);
          alert('Failed to delete inclusion. Please try again.');
        }
      });
    } else {
      // If no ID (new item), just remove from array
      this.tripForm.inclusions?.splice(index, 1);
    }
  }

  addExclusion(): void {
    if (!this.tripForm.exclusions) {
      this.tripForm.exclusions = [];
    }

    const newExclusion = {
      exclusion: '',
      sortOrder: this.tripForm.exclusions.length || 0,
      isActive: true
    };

    this.tripForm.exclusions.push(newExclusion);
  }

  saveExclusion(index: number): void {
    const exclusion = this.tripForm.exclusions?.[index];
    if (!exclusion || !this.trip?.id) return;

    if (exclusion.exclusion.trim() === '') {
      alert('Please enter exclusion text before saving.');
      return;
    }

    if (exclusion.id) {
      // Update existing exclusion
      this.tripExclusionService.updateExclusion(exclusion.id, {
        exclusion: exclusion.exclusion,
        sortOrder: exclusion.sortOrder || 0,
        isActive: exclusion.isActive !== undefined ? exclusion.isActive : true,
        tripId: this.trip.id
      }).subscribe({
        next: (updatedExclusion) => {
          console.log('Exclusion updated successfully');
          // Update the local exclusion with the response data
          this.tripForm.exclusions![index] = {
            id: updatedExclusion.id,
            exclusion: updatedExclusion.exclusion,
            sortOrder: updatedExclusion.sortOrder || 0,
            isActive: updatedExclusion.isActive !== undefined ? updatedExclusion.isActive : true,
            createdAt: updatedExclusion.createdAt
          };
        },
        error: (error) => {
          console.error('Error updating exclusion:', error);
          alert('Failed to update exclusion. Please try again.');
        }
      });
    } else {
      // Create new exclusion
      this.tripExclusionService.addExclusion(this.trip.id, {
        exclusion: exclusion.exclusion,
        sortOrder: exclusion.sortOrder || 0,
        isActive: exclusion.isActive !== undefined ? exclusion.isActive : true,
        tripId: this.trip.id
      }).subscribe({
        next: (newExclusion) => {
          console.log('Exclusion added successfully');
          // Update the local exclusion with the response data (including the new ID)
          this.tripForm.exclusions![index] = {
            id: newExclusion.id,
            exclusion: newExclusion.exclusion,
            sortOrder: newExclusion.sortOrder || 0,
            isActive: newExclusion.isActive !== undefined ? newExclusion.isActive : true,
            createdAt: newExclusion.createdAt
          };
        },
        error: (error) => {
          console.error('Error adding exclusion:', error);
          alert('Failed to add exclusion. Please try again.');
        }
      });
    }
  }

  moveExclusionUp(index: number): void {
    if (index > 0 && this.tripForm.exclusions && this.trip?.id) {
      // UX trick: Show reordering immediately for better user experience
      const exclusions = [...this.tripForm.exclusions];
      const [movedItem] = exclusions.splice(index, 1);
      exclusions.splice(index - 1, 0, movedItem);

      // Update sortOrder for all items
      exclusions.forEach((exclusion, i) => {
        exclusion.sortOrder = i;
      });

      // Apply local changes immediately for instant visual feedback
      this.tripForm.exclusions = exclusions;
      console.log('Exclusions reordered locally for UX');

      // Now call backend to persist the changes
      const newOrder = [...this.tripForm.exclusions.map(exc => exc.id || 0)];
      this.tripExclusionService.reorderExclusions(this.trip.id, newOrder).subscribe({
        next: (reorderedExclusions) => {
          // Map DTOs to model format and update the form
          this.tripForm.exclusions = reorderedExclusions.map(dto => ({
            id: dto.id,
            exclusion: dto.exclusion,
            sortOrder: dto.sortOrder || 0,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            createdAt: dto.createdAt
          }));
          console.log('Exclusions reordered successfully:', reorderedExclusions);
        },
        error: (error) => {
          console.error('Error reordering exclusions:', error);
          alert('Failed to reorder exclusions. Please try again.');
        }
      });
    }
  }

  moveExclusionDown(index: number): void {
    if (this.tripForm.exclusions && index < this.tripForm.exclusions.length - 1 && this.trip?.id) {
      // UX trick: Show reordering immediately for better user experience
      const exclusions = [...this.tripForm.exclusions];
      const [movedItem] = exclusions.splice(index, 1);
      exclusions.splice(index + 1, 0, movedItem);

      // Update sortOrder for all items
      exclusions.forEach((exclusion, i) => {
        exclusion.sortOrder = i;
      });

      // Apply local changes immediately for instant visual feedback
      this.tripForm.exclusions = exclusions;
      console.log('Exclusions reordered locally for UX');

      // Now call backend to persist the changes
      const newOrder = [...this.tripForm.exclusions.map(exc => exc.id || 0)];
      this.tripExclusionService.reorderExclusions(this.trip.id, newOrder).subscribe({
        next: (reorderedExclusions) => {
          // Map DTOs to model format and update the form
          this.tripForm.exclusions = reorderedExclusions.map(dto => ({
            id: dto.id,
            exclusion: dto.exclusion,
            sortOrder: dto.sortOrder || 0,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            createdAt: dto.createdAt
          }));
          console.log('Exclusions reordered successfully:', reorderedExclusions);
        },
        error: (error) => {
          console.error('Error reordering exclusions:', error);
          alert('Failed to reorder exclusions. Please try again.');
        }
      });
    }
  }

  removeExclusion(index: number): void {
    const exclusion = this.tripForm.exclusions?.[index];
    if (exclusion?.id && this.trip?.id) {
      this.tripExclusionService.deleteExclusion(exclusion.id).subscribe({
        next: () => {
          console.log('Exclusion deleted successfully');
          this.tripForm.exclusions?.splice(index, 1);
        },
        error: (error) => {
          console.error('Error deleting exclusion:', error);
          alert('Failed to delete exclusion. Please try again.');
        }
      });
    } else {
      // If no ID (new item), just remove from array
      this.tripForm.exclusions?.splice(index, 1);
    }
  }

  // Activity reordering methods
  moveActivityUp(dayIndex: number, activityIndex: number): void {
    if (activityIndex > 0 && this.tripForm.itinerary && this.tripForm.itinerary[dayIndex] && this.tripForm.itinerary[dayIndex].activities) {
      const day = this.tripForm.itinerary[dayIndex];
      if (!day.id) {
        alert('Please save the itinerary day first before reordering activities.');
        return;
      }

      // UX trick: Show reordering immediately for better user experience
      const activities = [...day.activities];
      const [movedItem] = activities.splice(activityIndex, 1);
      activities.splice(activityIndex - 1, 0, movedItem);

      // Update sortOrder for all items
      activities.forEach((activity, i) => {
        activity.sortOrder = i;
      });

      // Apply local changes immediately for instant visual feedback
      day.activities = activities;
      console.log('Activities reordered locally for UX');

      // Now call backend to persist the changes
      const newOrder = [...day.activities.map(act => act.id || 0)];
      this.tripActivityService.reorderActivities(day.id, newOrder).subscribe({
        next: (reorderedActivities) => {
          // Map DTOs to model format and update the form
          day.activities = reorderedActivities.map(dto => ({
            id: dto.id,
            time: dto.time,
            description: dto.description,
            sortOrder: dto.sortOrder || 0,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            createdAt: dto.createdAt,
            lastModifiedAt: dto.lastModifiedAt
          }));
          console.log('Activities reordered successfully:', reorderedActivities);
        },
        error: (error) => {
          console.error('Error reordering activities:', error);
          alert('Failed to reorder activities. Please try again.');
        }
      });
    }
  }

  moveActivityDown(dayIndex: number, activityIndex: number): void {
    if (this.tripForm.itinerary && this.tripForm.itinerary[dayIndex] && this.tripForm.itinerary[dayIndex].activities &&
      activityIndex < this.tripForm.itinerary[dayIndex].activities.length - 1) {
      const day = this.tripForm.itinerary[dayIndex];
      if (!day.id) {
        alert('Please save the itinerary day first before reordering activities.');
        return;
      }

      // UX trick: Show reordering immediately for better user experience
      const activities = [...day.activities];
      const [movedItem] = activities.splice(activityIndex, 1);
      activities.splice(activityIndex + 1, 0, movedItem);

      // Update sortOrder for all items
      activities.forEach((activity, i) => {
        activity.sortOrder = i;
      });

      // Apply local changes immediately for instant visual feedback
      day.activities = activities;
      console.log('Activities reordered locally for UX');

      // Now call backend to persist the changes
      const newOrder = [...day.activities.map(act => act.id || 0)];
      this.tripActivityService.reorderActivities(day.id, newOrder).subscribe({
        next: (reorderedActivities) => {
          // Map DTOs to model format and update the form
          day.activities = reorderedActivities.map(dto => ({
            id: dto.id,
            time: dto.time,
            description: dto.description,
            sortOrder: dto.sortOrder || 0,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            createdAt: dto.createdAt,
            lastModifiedAt: dto.lastModifiedAt
          }));
          console.log('Activities reordered successfully:', reorderedActivities);
        },
        error: (error) => {
          console.error('Error reordering activities:', error);
          alert('Failed to reorder activities. Please try again.');
        }
      });
    }
  }

  // Meal reordering methods
  moveMealUp(dayIndex: number, mealIndex: number): void {
    if (mealIndex > 0 && this.tripForm.itinerary && this.tripForm.itinerary[dayIndex] && this.tripForm.itinerary[dayIndex].meals) {
      const day = this.tripForm.itinerary[dayIndex];
      if (!day.id) {
        alert('Please save the itinerary day first before reordering meals.');
        return;
      }

      // UX trick: Show reordering immediately for better user experience
      const meals = [...day.meals];
      const [movedItem] = meals.splice(mealIndex, 1);
      meals.splice(mealIndex - 1, 0, movedItem);

      // Update sortOrder for all items
      meals.forEach((meal, i) => {
        meal.sortOrder = i;
      });

      // Apply local changes immediately for instant visual feedback
      day.meals = meals;
      console.log('Meals reordered locally for UX');

      // Now call backend to persist the changes
      const newOrder = [...day.meals.map(meal => meal.id || 0)];
      this.tripMealService.reorderMeals(day.id, newOrder).subscribe({
        next: (reorderedMeals) => {
          // Map DTOs to model format and update the form
          day.meals = reorderedMeals.map(dto => ({
            id: dto.id,
            mealType: dto.mealType,
            description: dto.description,
            sortOrder: dto.sortOrder || 0,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            createdAt: dto.createdAt,
            lastModifiedAt: dto.lastModifiedAt
          }));
          console.log('Meals reordered successfully:', reorderedMeals);
        },
        error: (error) => {
          console.error('Error reordering meals:', error);
          alert('Failed to reorder meals. Please try again.');
        }
      });
    }
  }

  moveMealDown(dayIndex: number, mealIndex: number): void {
    if (this.tripForm.itinerary && this.tripForm.itinerary[dayIndex] && this.tripForm.itinerary[dayIndex].meals &&
      mealIndex < this.tripForm.itinerary[dayIndex].meals.length - 1) {
      const day = this.tripForm.itinerary[dayIndex];
      if (!day.id) {
        alert('Please save the itinerary day first before reordering meals.');
        return;
      }

      // UX trick: Show reordering immediately for better user experience
      const meals = [...day.meals];
      const [movedItem] = meals.splice(mealIndex, 1);
      meals.splice(mealIndex + 1, 0, movedItem);

      // Update sortOrder for all items
      meals.forEach((meal, i) => {
        meal.sortOrder = i;
      });

      // Apply local changes immediately for instant visual feedback
      day.meals = meals;
      console.log('Meals reordered locally for UX');

      // Now call backend to persist the changes
      const newOrder = [...day.meals.map(meal => meal.id || 0)];
      this.tripMealService.reorderMeals(day.id, newOrder).subscribe({
        next: (reorderedMeals) => {
          // Map DTOs to model format and update the form
          day.meals = reorderedMeals.map(dto => ({
            id: dto.id,
            mealType: dto.mealType,
            description: dto.description,
            sortOrder: dto.sortOrder || 0,
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            createdAt: dto.createdAt,
            lastModifiedAt: dto.lastModifiedAt
          }));
          console.log('Meals reordered successfully:', reorderedMeals);
        },
        error: (error) => {
          console.error('Error reordering meals:', error);
          alert('Failed to reorder meals. Please try again.');
        }
      });
    }
  }

  // Utility methods
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // ========== NEW IMAGE MODEL METHODS ==========

  /**
   * Load trip image models when switching to image model tab
   */
  loadTripImageModels(): void {
    if (!this.trip?.id) return;

    this.tripImageModelService.getImagesByTripId(this.trip.id).subscribe({
      next: (images) => {
        this.tripImageModels = this.tripImageModelService.convertArrayFromBackend(images);
        this.mainImageModel = this.tripImageModels.find(img => img.isMainImage) || null;
        console.log('Loaded trip image models:', this.tripImageModels);
      },
      error: (error) => {
        console.error('Error loading trip image models:', error);
        this.tripImageModels = [];
        this.mainImageModel = null;
      }
    });
  }



  /**
   * Open file upload dialog
   */
  openFileUploadDialog(): void {
    const fileInput = document.getElementById('hiddenImageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file || !this.trip?.id) return;

    if (file.size > 10 * 1024 * 1024 || !file.type.startsWith('image/')) {
      alert(file.size > 10 * 1024 * 1024 ? 'File size must be less than 10MB' : 'Please select an image file');
      return;
    }

    this.isUploadingImage = true;
    this.tripImageModelService.addImageFromFile(this.trip.id, file, this.newImageDescription.trim())
      .subscribe({
        next: (uploadedImage) => {
          const imageModel = this.tripImageModelService.convertFromBackend(uploadedImage);
          this.tripImageModels.push(imageModel);
          if (this.tripImageModels.length === 1) this.setMainImage(imageModel);
          this.clearFileSelection();
          this.isUploadingImage = false;
          console.log('Image uploaded successfully:', imageModel);
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Please try again.');
          this.isUploadingImage = false;
        }
      });
  }

  /**
   * Upload selected image
   */
  uploadSelectedImage(): void {
    if (!this.selectedFile || !this.newImageDescription.trim() || !this.trip?.id) {
      alert('Please select a file and provide a description');
      return;
    }

    this.isUploadingImage = true;

    this.tripImageModelService.addImageFromFile(
      this.trip.id,
      this.selectedFile,
      this.newImageDescription.trim()
    ).subscribe({
      next: (uploadedImage) => {
        const imageModel = this.tripImageModelService.convertFromBackend(uploadedImage);
        this.tripImageModels.push(imageModel);

        // If this is the first image, set it as main
        if (this.tripImageModels.length === 1) {
          this.setMainImage(imageModel);
        }

        this.clearFileSelection();
        this.isUploadingImage = false;
        console.log('Image uploaded successfully:', imageModel);
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
        this.isUploadingImage = false;
      }
    });
  }

  /**
   * Clear file selection
   */
  clearFileSelection(): void {
    this.selectedFile = null;
    this.newImageDescription = '';
    const fileInput = document.getElementById('hiddenImageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * Set image as main image
   */
  setMainImage(image: TripImageModel): void {
    if (!image.id || !this.trip?.id) return;

    // First, unset any existing main image
    if (this.mainImageModel && this.mainImageModel.id) {
      this.tripImageModelService.updateMainImageStatus(this.mainImageModel.id, false).subscribe({
        next: () => {
          this.mainImageModel!.isMainImage = false;
        },
        error: (error) => {
          console.error('Error updating main image status:', error);
        }
      });
    }

    // Set new main image
    this.tripImageModelService.updateMainImageStatus(image.id, true).subscribe({
      next: (updatedImage) => {
        const imageModel = this.tripImageModelService.convertFromBackend(updatedImage);
        const index = this.tripImageModels.findIndex(img => img.id === image.id);
        if (index !== -1) {
          this.tripImageModels[index] = imageModel;
        }
        this.mainImageModel = imageModel;
        console.log('Main image updated:', imageModel);
      },
      error: (error) => {
        console.error('Error setting main image:', error);
        alert('Failed to set main image. Please try again.');
      }
    });
  }

  /**
   * Remove main image
   */
  removeMainImage(): void {
    if (!this.mainImageModel?.id) return;

    this.tripImageModelService.updateMainImageStatus(this.mainImageModel.id, false).subscribe({
      next: () => {
        this.mainImageModel!.isMainImage = false;
        this.mainImageModel = null;
        console.log('Main image removed');
      },
      error: (error) => {
        console.error('Error removing main image:', error);
        alert('Failed to remove main image. Please try again.');
      }
    });
  }

  /**
   * Toggle image active status
   */
  toggleImageStatus(image: TripImageModel): void {
    if (!image.id) return;

    this.tripImageModelService.updateStatus(image.id, !image.isActive).subscribe({
      next: (updatedImage) => {
        const imageModel = this.tripImageModelService.convertFromBackend(updatedImage);
        const index = this.tripImageModels.findIndex(img => img.id === image.id);
        if (index !== -1) {
          this.tripImageModels[index] = imageModel;
        }
        console.log('Image status updated:', imageModel);
      },
      error: (error) => {
        console.error('Error updating image status:', error);
        alert('Failed to update image status. Please try again.');
      }
    });
  }

  /**
   * Delete image model
   */
  deleteImageModel(image: TripImageModel): void {
    if (!image.id) return;

    if (confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      this.tripImageModelService.deleteImageWithFiles(image.id).subscribe({
        next: () => {
          // Remove from local arrays
          this.tripImageModels = this.tripImageModels.filter(img => img.id !== image.id);
          if (this.mainImageModel?.id === image.id) {
            this.mainImageModel = null;
          }
          console.log('Image deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting image:', error);
          alert('Failed to delete image. Please try again.');
        }
      });
    }
  }

  /**
   * Move image up in order
   */
  moveImageUp(image: TripImageModel): void {
    const currentIndex = this.tripImageModels.findIndex(img => img.id === image.id);
    if (currentIndex <= 0 || !this.trip?.id) return;

    const newOrder = [...this.tripImageModels.map(img => img.id || 0)];
    const [movedItem] = newOrder.splice(currentIndex, 1);
    newOrder.splice(currentIndex - 1, 0, movedItem);

    this.tripImageModelService.reorderImages(this.trip.id, newOrder).subscribe({
      next: (reorderedImages) => {
        this.tripImageModels = this.tripImageModelService.convertArrayFromBackend(reorderedImages);
        this.mainImageModel = this.tripImageModels.find(img => img.isMainImage) || null;
        console.log('Images reordered successfully');
      },
      error: (error) => {
        console.error('Error reordering images:', error);
        alert('Failed to reorder images. Please try again.');
      }
    });
  }

  /**
   * Move image down in order
   */
  moveImageDown(image: TripImageModel): void {
    const currentIndex = this.tripImageModels.findIndex(img => img.id === image.id);
    if (currentIndex === -1 || currentIndex >= this.tripImageModels.length - 1 || !this.trip?.id) return;

    const newOrder = [...this.tripImageModels.map(img => img.id || 0)];
    const [movedItem] = newOrder.splice(currentIndex, 1);
    newOrder.splice(currentIndex + 1, 0, movedItem);

    this.tripImageModelService.reorderImages(this.trip.id, newOrder).subscribe({
      next: (reorderedImages) => {
        this.tripImageModels = this.tripImageModelService.convertArrayFromBackend(reorderedImages);
        this.mainImageModel = this.tripImageModels.find(img => img.isMainImage) || null;
        console.log('Images reordered successfully');
      },
      error: (error) => {
        console.error('Error reordering images:', error);
        alert('Failed to reorder images. Please try again.');
      }
    });
  }

  /**
   * Update image description
   */
  updateImageDescription(image: TripImageModel, newDescription: string): void {
    if (!image.id || !newDescription.trim()) return;

    this.tripImageModelService.updateImage(image.id, { description: newDescription.trim() }).subscribe({
      next: (updatedImage) => {
        const imageModel = this.tripImageModelService.convertFromBackend(updatedImage);
        const index = this.tripImageModels.findIndex(img => img.id === image.id);
        if (index !== -1) {
          this.tripImageModels[index] = imageModel;
        }
        console.log('Image description updated:', imageModel);
      },
      error: (error) => {
        console.error('Error updating image description:', error);
        alert('Failed to update image description. Please try again.');
      }
    });
  }

  /**
   * Refresh image gallery
   */
  refreshImageGallery(): void {
    this.loadTripImageModels();
  }

  /**
   * Reorder images (bulk operation)
   */
  reorderImages(): void {
    if (!this.trip?.id || this.tripImageModels.length === 0) return;

    const newOrder = this.tripImageModels.map(img => img.id || 0);
    this.tripImageModelService.reorderImages(this.trip.id, newOrder).subscribe({
      next: (reorderedImages) => {
        this.tripImageModels = this.tripImageModelService.convertArrayFromBackend(reorderedImages);
        this.mainImageModel = this.tripImageModels.find(img => img.isMainImage) || null;
        console.log('Images reordered successfully');
      },
      error: (error) => {
        console.error('Error reordering images:', error);
        alert('Failed to reorder images. Please try again.');
      }
    });
  }
}
