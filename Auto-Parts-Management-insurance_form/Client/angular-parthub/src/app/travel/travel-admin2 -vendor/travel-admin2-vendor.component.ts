import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { AuthService, User } from '../../services/auth.service';
import { CategoriesService, Category } from '../../services/categories.service';
import { TripDto, TripsService } from '../../services/trips.service';
import { TripData, getAllTrips, getImageUrl } from '../mock-travel-data';
import { Trip, TripImageModel, SubscriptionPlan, VendorSubscription, SubscriptionFlowStep, UsageMetrics } from '../../models';
import { ConfigService } from '../../services/config.service';
import { SubscriptionService } from '../../services/subscription.service';
import { AdminSubscriptionService, AdminStats as AdminSubscriptionStats, PlanAnalytics } from '../../services/admin-subscription.service';
import { VendorSubscriptionService } from '../../services/vendor-subscription.service';

interface BookingData {
  id: string;
  tripId: number;
  tripName: string;
  customerName: string;
  customerEmail: string;
  travelDate: string;
  numberOfPeople: number;
  totalPrice: number;
  bookingDate: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
}

interface AdminStats {
  totalTrips: number;
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  popularDestinations: string[];
  recentBookings: BookingData[];
}

interface SettingsData {
  companyName: string;
  contactEmail: string;
  phoneNumber: string;
  timezone: string;
  maxBookingDays: number;
  cancellationHours: number;
  autoConfirm: boolean;
  paymentRequired: 'immediate' | '24hours' | '7days';
  emailNotifications: boolean;
  smsNotifications: boolean;
  bookingAlerts: boolean;
  cancellationAlerts: boolean;
  sessionTimeout: number;
  twoFactorAuth: boolean;
  auditLogging: boolean;
}

@Component({
  selector: 'app-travel-admin2-vendor',
  templateUrl: './travel-admin2-vendor.component.html',
  styleUrls: ['./travel-admin2-vendor.component.css'],
  styles: [`
    .plan-wizard {
      .wizard-steps {
        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          background-color: #e9ecef;
          color: #6c757d;
          transition: all 0.3s ease;
          
          &.active {
            background-color: #0d6efd;
            color: white;
          }
          
          &.completed {
            background-color: #198754;
            color: white;
          }
        }
        
        .step-title {
          font-weight: 500;
          color: #6c757d;
          transition: color 0.3s ease;
          
          &.active {
            color: #0d6efd;
          }
        }
        
        .step-desc {
          color: #6c757d;
          font-size: 0.875rem;
        }
        
        .step-line {
          height: 2px;
          background-color: #e9ecef;
          transition: background-color 0.3s ease;
          
          &.active {
            background-color: #0d6efd;
          }
        }
      }
      
      .step-content {
        min-height: 300px;
      }
      
      .step-panel {
        padding: 20px 0;
      }
    }
  `]
})
export class TravelAdmin2VendorComponent implements OnInit, OnDestroy {

  // Admin state
  activeTab = 'dashboard';
  isLoading = false;

  // Stripe integration
  private stripe: Stripe | null = null;
  isStripeLoaded = false;

  // User authentication
  currentUser: User | null = null;
  private userSubscription: Subscription;

  // Data arrays
  trips: TripData[] = [];
  tripsDb: TripDto[] = []; // Database trips using backend DTO structure
  bookings: BookingData[] = [];
  customers: CustomerData[] = [];
  stats: AdminStats = {
    totalTrips: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageBookingValue: 0,
    popularDestinations: [],
    recentBookings: []
  };

  // Trip management
  selectedTrip: TripData | null = null;
  selectedTripDb: Trip | null = null;
  showTripModal = false;
  isEditingTrip = false;
  activeTripTab = 'basic';
  showPreviewModal = false;
  
  // New Trip Editor Component
  showNewTripEditor = false;

  // Booking management
  selectedBooking: BookingData | null = null;
  showBookingModal = false;

  // Customer management
  selectedCustomer: CustomerData | null = null;
  showCustomerModal = false;
  isEditingCustomer = false;

  // Category management
  selectedCategory: Category | null = null;
  showCategoryModal = false;
  isEditingCategory = false;

  // Subscription management
  subscriptionPlans: SubscriptionPlan[] = [];
  vendorSubscriptions: VendorSubscription[] = [];
  selectedPlan: SubscriptionPlan | null = null;
  selectedSubscription: VendorSubscription | null = null;
  showPlanModal = false;
  showPlanWizard = false;
  showSubscriptionModal = false;
  isEditingPlan = false;
  planSearchTerm = '';
  subscriptionSearchTerm = '';
  planStatusFilter = '';
  subscriptionStatusFilter = '';
  planPriceFilter = '';

  // Phase 1: Trial subscription properties
  activeSubscription: VendorSubscription | null = null;
  isLoadingPlans = false;
  isSubscribing = false;

  // Search and filters
  searchTerm = '';
  statusFilter = '';
  dateFilter = '';
  customerSearchTerm = '';
  customerStatusFilter = '';

  // Analytics
  analyticsStartDate = '';
  analyticsEndDate = '';
  
  // Plan Analytics
  planAnalytics: PlanAnalytics[] = [];
  revenueAnalytics: any = null;
  subscriptionGrowth: any = null;
  adminStats: AdminSubscriptionStats | null = null;
  showAnalyticsModal = false;
  selectedAnalyticsPlan: SubscriptionPlan | null = null;
  analyticsLoading = false;
  analyticsDateRange = 'monthly';
  
  // Chart data
  revenueChartData: any = null;
  growthChartData: any = null;
  planPerformanceChartData: any = null;

  // Settings
  settings: SettingsData = {
    companyName: 'Travel Adventures Inc.',
    contactEmail: 'contact@traveladventures.com',
    phoneNumber: '+1 (555) 123-4567',
    timezone: 'UTC',
    maxBookingDays: 365,
    cancellationHours: 24,
    autoConfirm: false,
    paymentRequired: 'immediate',
    emailNotifications: true,
    smsNotifications: false,
    bookingAlerts: true,
    cancellationAlerts: true,
    sessionTimeout: 30,
    twoFactorAuth: false,
    auditLogging: true
  };

  // Form data for new/edit trip
  tripForm = {
    name: '',
    destination: '',
    duration: '',
    basePrice: 0,
    categoryId: 1,
    description: '',
    totalCapacity: 0,
    image: '', // Main image URL
    images: [] as string[], // Array of image URLs
    availability: [] as { date: string; available: number; maxCapacity: number; price?: number }[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    itinerary: [] as { day: number; title: string; description: string; activities: { time: string; description: string }[]; meals: { type: string; description: string }[] }[],
    highlights: [] as string[],
    difficulty: 'Easy' as 'Easy' | 'Moderate' | 'Challenging',
    groupSize: { min: 1, max: 20 },
    bestTime: '',
    cancellationPolicy: ''
  };

  // Categories for trip form
  allCategories: Category[] = [];

  // Form data for new/edit customer
  customerForm = {
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive' | 'vip'
  };

  // Form data for new/edit category
  categoryForm = {
    name: '',
    description: '',
    imageUrl: '',
    isActive: true
  };

  // Form data for new/edit subscription plan
  planForm: Partial<SubscriptionPlan> = {
    name: '',
    description: '',
    price: 0,
    durationMonths: 1,
    maxTrips: 0,
    features: '',
    isActive: true,
    trialDays: 0,
    trialPrice: 0,
    isTrialOnly: false
  };

  // New clean wizard configuration
  currentStep: number = 1;

  // Availability management properties
  newAvailabilityDate = '';
  newAvailabilityCapacity = 30;
  newAvailabilityPrice = 0;

  // Image URL properties for direct template access
  baseUrlResizeImage = '';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private authService: AuthService,
    private router: Router,
    private categoriesService: CategoriesService,
    private tripsService: TripsService,
    private configService: ConfigService,
    private subscriptionService: SubscriptionService,
    private adminSubscriptionService: AdminSubscriptionService,
    private vendorSubscriptionService: VendorSubscriptionService
  ) {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    // Set browser title
    this.titleService.setTitle('Travel Admin');

    // Set meta tags
    this.metaService.updateTag({ name: 'description', content: 'Admin dashboard for managing travel operations, trips, and bookings' });
    this.metaService.updateTag({ name: 'keywords', content: 'travel admin, management, trips, bookings, dashboard' });

    // Set image URL properties for direct template access
    this.baseUrlResizeImage = `${this.configService.apiBaseUrl}/trip-image-model/getResize`;

    // Initialize Stripe
    this.initializeStripe();

    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadData(): void {
    this.isLoading = true;

    // Load categories from backend using public endpoint
    this.categoriesService.getAllCategories().subscribe({
      next: (categories) => {
        // Add "All Categories" option at the beginning
        this.allCategories = [
          ...categories
        ];
        console.log('Categories loaded from public endpoint:', this.allCategories);
      },
      error: (error) => {
        console.error('Error loading categories from public endpoint:', error);
        // Fallback to regular private endpoint
        this.loadCategoriesFallback();
      }
    });

    setTimeout(() => {
      this.trips = getAllTrips();
      this.bookings = this.generateMockBookings();
      this.customers = this.generateMockCustomers();

      // Load backend trip data
      this.loadBackendTrips();

      // Load subscription data
      this.loadSubscriptionPlans();
      this.loadVendorSubscriptions();

      // Load analytics data
      this.loadAdminStats();
      this.loadPlanAnalytics();
      this.loadRevenueAnalytics();
      this.loadSubscriptionGrowth();

      this.calculateStats();
      this.isLoading = false;
    }, 1000);
  }

  // Fallback method to load categories from regular private endpoint
  private loadCategoriesFallback(): void {
    this.categoriesService.getAllCategoriesPrivate().subscribe({
      next: (categories) => {
        // Add "All Categories" option at the beginning
        this.allCategories = [
          {
            id: 0,
            name: 'All Categories',
            description: 'Show all travel categories',
            imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            isActive: true,
            createdByUsername: 'admin',
            createdAt: new Date().toISOString()
          },
          ...categories
        ];
        console.log('Categories loaded from fallback endpoint:', this.allCategories);
      },
      error: (error) => {
        console.error('Error loading categories from fallback endpoint:', error);
        this.allCategories = [];
      }
    });
  }

  // Refresh only categories from backend
  private refreshCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (categories) => {
        // Add "All Categories" option at the beginning
        this.allCategories = [
          {
            id: 0,
            name: 'All Categories',
            description: 'Show all travel categories',
            imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            isActive: true,
            createdByUsername: 'admin',
            createdAt: new Date().toISOString()
          },
          ...categories
        ];
        console.log('Categories refreshed from backend:', this.allCategories);
      },
      error: (error) => {
        console.error('Error refreshing categories:', error);
        // Fallback to regular private endpoint
        this.loadCategoriesFallback();
      }
    });
  }

  // Load backend trip data
  private loadBackendTrips(): void {
    this.tripsService.getAllTrips().subscribe({
      next: (response) => {
        // response.content is already TripDto[] which matches our Trip model structure
        this.tripsDb = response.content;
        console.log('Backend trips loaded:', this.tripsDb);
      },
      error: (error) => {
        console.error('Error loading backend trips:', error);
        // Initialize with empty array if backend fails
        this.tripsDb = [];
      }
    });
  }

  generateMockBookings(): BookingData[] {
    const mockBookings: BookingData[] = [
      {
        id: 'TB001',
        tripId: 1,
        tripName: 'Paris Weekend Getaway',
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        travelDate: '2026-03-15',
        numberOfPeople: 2,
        totalPrice: 599.98,
        bookingDate: '2026-02-15',
        status: 'Confirmed',
        paymentStatus: 'Paid'
      },
      {
        id: 'TB002',
        tripId: 2,
        tripName: 'Rome Cultural Experience',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        travelDate: '2026-03-20',
        numberOfPeople: 3,
        totalPrice: 1199.97,
        bookingDate: '2026-02-20',
        status: 'Confirmed',
        paymentStatus: 'Paid'
      },
      {
        id: 'TB003',
        tripId: 3,
        tripName: 'Barcelona Adventure',
        customerName: 'Mike Davis',
        customerEmail: 'mike.davis@email.com',
        travelDate: '2026-03-25',
        numberOfPeople: 1,
        totalPrice: 349.99,
        bookingDate: '2026-02-25',
        status: 'Pending',
        paymentStatus: 'Pending'
      },
      {
        id: 'TB004',
        tripId: 4,
        tripName: 'Amsterdam Canal Cruise',
        customerName: 'Lisa Wilson',
        customerEmail: 'lisa.w@email.com',
        travelDate: '2026-03-10',
        numberOfPeople: 2,
        totalPrice: 399.98,
        bookingDate: '2026-02-10',
        status: 'Confirmed',
        paymentStatus: 'Paid'
      },
      {
        id: 'TB005',
        tripId: 5,
        tripName: 'Prague Castle Tour',
        customerName: 'David Brown',
        customerEmail: 'david.brown@email.com',
        travelDate: '2026-03-12',
        numberOfPeople: 4,
        totalPrice: 999.96,
        bookingDate: '2026-02-12',
        status: 'Cancelled',
        paymentStatus: 'Failed'
      }
    ];
    return mockBookings;
  }

  generateMockCustomers(): CustomerData[] {
    const mockCustomers: CustomerData[] = [
      {
        id: 'C001',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        totalBookings: 3,
        totalSpent: 1799.94,
        status: 'active'
      },
      {
        id: 'C002',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 234-5678',
        totalBookings: 2,
        totalSpent: 1199.97,
        status: 'active'
      },
      {
        id: 'C003',
        name: 'Mike Davis',
        email: 'mike.davis@email.com',
        phone: '+1 (555) 345-6789',
        totalBookings: 1,
        totalSpent: 349.99,
        status: 'inactive'
      },
      {
        id: 'C004',
        name: 'Lisa Wilson',
        email: 'lisa.w@email.com',
        phone: '+1 (555) 456-7890',
        totalBookings: 5,
        totalSpent: 2499.95,
        status: 'vip'
      },
      {
        id: 'C005',
        name: 'David Brown',
        email: 'david.brown@email.com',
        phone: '+1 (555) 567-8901',
        totalBookings: 2,
        totalSpent: 999.96,
        status: 'active'
      }
    ];
    return mockCustomers;
  }

  calculateStats(): void {
    this.stats = {
      totalTrips: this.trips.length,
      totalBookings: this.bookings.length,
      totalRevenue: this.bookings
        .filter(b => b.paymentStatus === 'Paid')
        .reduce((sum, b) => sum + b.totalPrice, 0),
      averageBookingValue: this.bookings.length > 0
        ? this.bookings.reduce((sum, b) => sum + b.totalPrice, 0) / this.bookings.length
        : 0,
      popularDestinations: this.getPopularDestinations(),
      recentBookings: this.bookings.slice(0, 5)
    };
  }

  getPopularDestinations(): string[] {
    const destinations = this.trips.map(trip => trip.destination);
    const counts = destinations.reduce((acc, dest) => {
      acc[dest] = (acc[dest] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([dest]) => dest);
  }

  // Tab navigation
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Trip management
  addNewTrip(): void {
    this.isEditingTrip = false;
    this.selectedTrip = null;
    this.resetTripForm();
    this.activeTripTab = 'basic';
    this.showTripModal = true;
    // Initialize availability form with default values
    this.newAvailabilityDate = '';
    this.newAvailabilityCapacity = 30;
    this.newAvailabilityPrice = 0;
  }

  editTrip(trip: TripData): void {
    this.isEditingTrip = true;
    this.selectedTrip = trip;
    this.activeTripTab = 'basic';
    this.tripForm = {
      name: trip.name,
      destination: trip.destination,
      duration: trip.duration,
      basePrice: trip.basePrice,
      categoryId: trip.categoryId,
      description: trip.description,
      totalCapacity: trip.maxCapacity,
      image: trip.image,
      images: [...trip.images],
      availability: trip.availability,
      inclusions: [...trip.inclusions],
      exclusions: [...trip.exclusions],
      itinerary: [...trip.itinerary],
      highlights: [...trip.highlights],
      difficulty: trip.difficulty,
      groupSize: { ...trip.groupSize },
      bestTime: trip.bestTime,
      cancellationPolicy: trip.cancellationPolicy
    };
    // Initialize availability form with default values
    this.newAvailabilityDate = '';
    this.newAvailabilityCapacity = 30;
    this.newAvailabilityPrice = trip.basePrice;
    this.showTripModal = true;
  }

  deleteTrip(tripId: number): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      // In a real app, this would call an API
      this.trips = this.trips.filter(trip => trip.id !== tripId);
      this.calculateStats();
    }
  }

  // Database Trip Management - Placeholder methods
  addNewTripDb(): void {
    // TODO: Implement database trip creation
    console.log('addNewTripDb() - Database trip creation not yet implemented');
    alert('Database trip creation not yet implemented. This will integrate with the new Trip model classes.');
  }

  // New Trip Editor Component Methods
  openNewTripEditor(): void {
    this.showNewTripEditor = true;
    this.selectedTripDb = null; // Reset for new trip
  }

  editTripWithNewEditor(trip: any): void {
    console.log('editTripWithNewEditor called with trip:', trip);
    this.selectedTripDb = trip;
    this.showNewTripEditor = true;
    console.log('After setting - selectedTripDb:', this.selectedTripDb, 'showNewTripEditor:', this.showNewTripEditor);
  }

  closeNewTripEditor(): void {
    this.showNewTripEditor = false;
    this.selectedTripDb = null;
  }

  /**
   * Saves a trip using the new modular approach
   * - For new trips: Creates the full trip
   * - For existing trips: Updates only basic trip information using updateTripBasic
   * - Nested objects (images, inclusions, exclusions, etc.) are managed separately
   *   through individual services for better performance and reduced database locks
   */
  onSaveNewTrip(trip: Trip): void {
    console.log('Trip to save:', trip);
    
    // Convert Trip model to TripDto format for backend
    const tripDto: TripDto = {
      id: trip.id,
      name: trip.name || '',
      destination: trip.destination || '',
      duration: trip.duration || '',
      basePrice: trip.basePrice || 0,
      mainImage: trip.mainImage || '',
      categoryId: trip.categoryId || 0,
      description: trip.description || '',
      difficulty: trip.difficulty || 'EASY',
      groupSizeMin: trip.groupSizeMin || 1,
      groupSizeMax: trip.groupSizeMax || 20,
      maxCapacity: trip.maxCapacity || 0,
      bestTime: trip.bestTime || '',
      cancellationPolicy: trip.cancellationPolicy || '',
      isActive: trip.isActive !== undefined ? trip.isActive : true,
      images: (trip.images || []).map(img => ({
        id: img.id,
        imageUrl: img.imageUrl,
        sortOrder: img.sortOrder,
        isActive: img.isActive,
        createdAt: img.createdAt,
        lastModifiedAt: img.createdAt // Use createdAt as lastModifiedAt if not available
      })),
      inclusions: (trip.inclusions || []).map(inc => ({
        id: inc.id,
        inclusion: inc.inclusion,
        sortOrder: inc.sortOrder,
        isActive: inc.isActive,
        createdAt: inc.createdAt,
        lastModifiedAt: inc.createdAt // Use createdAt as lastModifiedAt if not available
      })),
      exclusions: (trip.exclusions || []).map(exc => ({
        id: exc.id,
        exclusion: exc.exclusion,
        sortOrder: exc.sortOrder,
        isActive: exc.isActive,
        createdAt: exc.createdAt,
        lastModifiedAt: exc.createdAt // Use createdAt as lastModifiedAt if not available
      })),
      highlights: (trip.highlights || []).map(hl => ({
        id: hl.id,
        highlight: hl.highlight,
        sortOrder: hl.sortOrder,
        isActive: hl.isActive,
        createdAt: hl.createdAt,
        lastModifiedAt: hl.createdAt // Use createdAt as lastModifiedAt if not available
      })),
      availability: (trip.availability || []).map(avail => ({
        id: avail.id,
        date: avail.date,
        availableSpots: avail.availableSpots,
        maxCapacity: avail.availableSpots, // Use availableSpots as maxCapacity for now
        price: trip.basePrice || 0, // Use base price as default
        isActive: avail.isActive,
        createdAt: avail.createdAt,
        lastModifiedAt: avail.lastModifiedAt
      })),
      itinerary: trip.itinerary || []
    };

    // Create basic trip DTO for the new modular approach
    // This only updates the core trip information, not the nested objects
    // Nested objects (images, inclusions, exclusions, etc.) will be managed separately
    const basicTripDto: TripDto = {
      id: trip.id,
      name: trip.name || '',
      destination: trip.destination || '',
      duration: trip.duration || '',
      basePrice: trip.basePrice || 0,
      mainImage: trip.mainImage || '',
      categoryId: trip.categoryId || 0,
      description: trip.description || '',
      difficulty: trip.difficulty || 'EASY',
      groupSizeMin: trip.groupSizeMin || 1,
      groupSizeMax: trip.groupSizeMax || 20,
      maxCapacity: trip.maxCapacity || 0,
      bestTime: trip.bestTime || '',
      cancellationPolicy: trip.cancellationPolicy || '',
      isActive: trip.isActive !== undefined ? trip.isActive : true
    };

    console.log('🚀 MODULAR APPROACH: Using updateTripBasic for core trip info');
    console.log('📋 Basic trip data being sent:', basicTripDto);
    console.log('⚠️  Note: Nested objects (images, inclusions, etc.) are NOT included in this update');

    this.isLoading = true;

    if (trip.id) {
      // Update existing trip using the new modular approach
      console.log('Updating existing trip with ID:', trip.id, 'using updateTripBasic');
      this.tripsService.updateTripBasic(trip.id, basicTripDto).subscribe({
        next: (updatedTrip) => {
          console.log('Trip basic info updated successfully:', updatedTrip);
          this.isLoading = false;
          this.closeNewTripEditor();
          this.loadBackendTrips(); // Refresh trips list from backend
          // Show success message
          alert('Trip basic information updated successfully!');
        },
        error: (error) => {
          console.error('Error updating trip basic info:', error);
          this.isLoading = false;
          alert('Failed to update trip basic information. Please try again.');
        }
      });
    } else {
      // Create new trip
      console.log('Creating new trip');
      this.tripsService.createTrip(tripDto).subscribe({
        next: (createdTrip) => {
          console.log('Trip created successfully:', createdTrip);
          this.isLoading = false;
          this.closeNewTripEditor();
          this.loadBackendTrips(); // Refresh trips list from backend
          // Show success message
          alert('Trip created successfully!');
        },
        error: (error) => {
          console.error('Error creating trip:', error);
          this.isLoading = false;
          alert('Failed to create trip. Please try again.');
        }
      });
    }
  }

  editTripDb(trip: any): void {
    // TODO: Implement database trip editing
    console.log('editTripDb() - Database trip editing not yet implemented', trip);
    this.isEditingTrip = true;
    this.activeTripTab = 'basic';

    this.selectedTripDb = trip;
    this.showTripModal = true;

    //console.log('editTripDb() - Database trip editing not yet implemented', trip);
    // alert('Database trip editing not yet implemented. This will integrate with the new Trip model classes.');
  }

  deleteTripDb(tripId: number): void {
    // TODO: Implement database trip deletion
    if (confirm('Are you sure you want to delete this database trip?')) {
      console.log('deleteTripDb() - Database trip deletion not yet implemented', tripId);
      alert('Database trip deletion not yet implemented. This will integrate with the new Trip model classes.');
    }
  }

  previewTripDb(trip: any): void {
    // TODO: Implement database trip preview
    this.selectedTripDb = trip;
    this.showPreviewModal = true;
    console.log('previewTripDb() - Database trip preview not yet implemented', trip);
    //alert('Database trip preview not yet implemented. This will integrate with the new Trip model classes.');
  }

  previewTrip(trip: TripData): void {
    this.selectedTrip = trip;
    this.showPreviewModal = true;
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.selectedTripDb = null;
    this.selectedTrip = null;
  }

  // Trip modal tab navigation
  setActiveTripTab(tab: string): void {
    this.activeTripTab = tab;
  }

  nextTripTab(): void {
    const tabs = ['basic', 'images', 'details', 'availability', 'itinerary', 'inclusions'];
    const currentIndex = tabs.indexOf(this.activeTripTab);
    if (currentIndex < tabs.length - 1) {
      this.activeTripTab = tabs[currentIndex + 1];
    }
  }

  previousTripTab(): void {
    const tabs = ['basic', 'images', 'details', 'availability', 'itinerary', 'inclusions'];
    const currentIndex = tabs.indexOf(this.activeTripTab);
    if (currentIndex > 0) {
      this.activeTripTab = tabs[currentIndex - 1];
    }
  }

  getTripTabTitle(): string {
    const tabTitles = {
      'basic': 'Basic Information',
      'images': 'Trip Images',
      'details': 'Trip Details',
      'availability': 'Availability & Pricing',
      'itinerary': 'Itinerary',
      'inclusions': 'Inclusions & Exclusions'
    };
    return tabTitles[this.activeTripTab as keyof typeof tabTitles] || 'Basic Information';
  }

  getFormProgress(): number {
    const tabs = ['basic', 'images', 'details', 'availability', 'itinerary', 'inclusions'];
    const currentIndex = tabs.indexOf(this.activeTripTab);
    return ((currentIndex + 1) / tabs.length) * 100;
  }

  saveTrip(): void {
    if (this.validateTripForm()) {
      if (this.isEditingTrip && this.selectedTrip) {
        // Update existing trip
        const index = this.trips.findIndex(t => t.id === this.selectedTrip!.id);
        if (index !== -1) {
          this.trips[index] = {
            ...this.selectedTrip,
            name: this.tripForm.name,
            destination: this.tripForm.destination,
            duration: this.tripForm.duration,
            basePrice: this.tripForm.basePrice,
            categoryId: this.tripForm.categoryId,
            description: this.tripForm.description,
            maxCapacity: this.tripForm.totalCapacity,
            image: this.tripForm.image,
            images: this.tripForm.images,
            availability: this.tripForm.availability,
            inclusions: this.tripForm.inclusions,
            exclusions: this.tripForm.exclusions,
            itinerary: this.tripForm.itinerary,
            highlights: this.tripForm.highlights,
            difficulty: this.tripForm.difficulty,
            groupSize: this.tripForm.groupSize,
            bestTime: this.tripForm.bestTime,
            cancellationPolicy: this.tripForm.cancellationPolicy
          };
        }
      } else {
        // Add new trip
        const newTrip: TripData = {
          id: Math.max(...this.trips.map(t => t.id)) + 1,
          name: this.tripForm.name,
          destination: this.tripForm.destination,
          duration: this.tripForm.duration,
          basePrice: this.tripForm.basePrice,
          image: this.tripForm.image,
          images: this.tripForm.images,
          maxCapacity: this.tripForm.totalCapacity,
          availability: this.tripForm.availability,
          categoryId: this.tripForm.categoryId,
          description: this.tripForm.description,
          inclusions: this.tripForm.inclusions,
          exclusions: this.tripForm.exclusions,
          itinerary: this.tripForm.itinerary,
          highlights: this.tripForm.highlights,
          difficulty: this.tripForm.difficulty,
          groupSize: this.tripForm.groupSize,
          bestTime: this.tripForm.bestTime,
          cancellationPolicy: this.tripForm.cancellationPolicy
        };
        this.trips.push(newTrip);
      }

      this.calculateStats();
      this.closeTripModal();
    }
  }

  validateTripForm(): boolean {
    return this.tripForm.name.trim() !== '' &&
      this.tripForm.destination.trim() !== '' &&
      this.tripForm.duration.trim() !== '' &&
      this.tripForm.basePrice > 0 &&
      this.tripForm.categoryId > 0 &&
      this.tripForm.description.trim() !== '' &&
      this.tripForm.totalCapacity > 0 &&
      this.tripForm.image.trim() !== '' &&
      this.tripForm.availability.length > 0 &&
      this.validateAvailabilityData();
  }

  resetTripForm(): void {
    this.tripForm = {
      name: '',
      destination: '',
      duration: '',
      basePrice: 0,
      categoryId: 1,
      description: '',
      totalCapacity: 0,
      image: '',
      images: [],
      availability: [],
      inclusions: [],
      exclusions: [],
      itinerary: [],
      highlights: [],
      difficulty: 'Easy',
      groupSize: { min: 1, max: 20 },
      bestTime: '',
      cancellationPolicy: ''
    };
    // Reset availability form fields
    this.newAvailabilityDate = '';
    this.newAvailabilityCapacity = 30;
    this.newAvailabilityPrice = 0;
  }

  closeTripModal(): void {
    this.showTripModal = false;
    this.selectedTrip = null;
    this.resetTripForm();
  }

  // Customer management
  addNewCustomer(): void {
    this.isEditingCustomer = false;
    this.selectedCustomer = null;
    this.resetCustomerForm();
    this.showCustomerModal = true;
  }

  editCustomer(customer: CustomerData): void {
    this.isEditingCustomer = true;
    this.selectedCustomer = customer;
    this.customerForm = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status
    };
    this.showCustomerModal = true;
  }

  viewCustomer(customer: CustomerData): void {
    this.selectedCustomer = customer;
    this.showCustomerModal = true;
  }

  saveCustomer(): void {
    if (this.validateCustomerForm()) {
      if (this.isEditingCustomer && this.selectedCustomer) {
        // Update existing customer
        const index = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
        if (index !== -1) {
          this.customers[index] = {
            ...this.selectedCustomer,
            name: this.customerForm.name,
            email: this.customerForm.email,
            phone: this.customerForm.phone,
            status: this.customerForm.status
          };
        }
      } else {
        // Add new customer
        const newCustomer: CustomerData = {
          id: 'C' + (this.customers.length + 1).toString().padStart(3, '0'),
          name: this.customerForm.name,
          email: this.customerForm.email,
          phone: this.customerForm.phone,
          totalBookings: 0,
          totalSpent: 0,
          status: this.customerForm.status
        };
        this.customers.push(newCustomer);
      }

      this.closeCustomerModal();
    }
  }

  validateCustomerForm(): boolean {
    return this.customerForm.name.trim() !== '' &&
      this.customerForm.email.trim() !== '' &&
      this.customerForm.phone.trim() !== '';
  }

  resetCustomerForm(): void {
    this.customerForm = {
      name: '',
      email: '',
      phone: '',
      status: 'active'
    };
  }

  closeCustomerModal(): void {
    this.showCustomerModal = false;
    this.selectedCustomer = null;
    this.resetCustomerForm();
  }

  getFilteredCustomers(): CustomerData[] {
    return this.customers.filter(customer => {
      const matchesSearch = this.customerSearchTerm === '' ||
        customer.name.toLowerCase().includes(this.customerSearchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.customerSearchTerm.toLowerCase()) ||
        customer.phone.includes(this.customerSearchTerm);

      const matchesStatus = this.customerStatusFilter === '' || customer.status === this.customerStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  getCustomerStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'active';
      case 'inactive': return 'inactive';
      case 'vip': return 'vip';
      default: return 'inactive';
    }
  }

  // Analytics
  generateReport(): void {
    // In a real app, this would generate and download a report
    console.log('Generating report for date range:', this.analyticsStartDate, 'to', this.analyticsEndDate);
    alert('Report generation feature coming soon!');
  }

  // Settings
  saveSettings(): void {
    // In a real app, this would save to backend
    console.log('Saving settings:', this.settings);
    alert('Settings saved successfully!');
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      this.settings = {
        companyName: 'Travel Adventures Inc.',
        contactEmail: 'contact@traveladventures.com',
        phoneNumber: '+1 (555) 123-4567',
        timezone: 'UTC',
        maxBookingDays: 365,
        cancellationHours: 24,
        autoConfirm: false,
        paymentRequired: 'immediate',
        emailNotifications: true,
        smsNotifications: false,
        bookingAlerts: true,
        cancellationAlerts: true,
        sessionTimeout: 30,
        twoFactorAuth: false,
        auditLogging: true
      };
      alert('Settings reset to defaults!');
    }
  }

  // Booking management
  viewBooking(booking: BookingData): void {
    this.selectedBooking = booking;
    this.showBookingModal = true;
  }

  updateBookingStatus(booking: BookingData, status: 'Confirmed' | 'Pending' | 'Cancelled'): void {
    booking.status = status;
    if (status === 'Cancelled') {
      booking.paymentStatus = 'Failed';
    }
    this.calculateStats();
  }

  updatePaymentStatus(booking: BookingData, paymentStatus: 'Paid' | 'Pending' | 'Failed'): void {
    booking.paymentStatus = paymentStatus;
    this.calculateStats();
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedBooking = null;
  }

  // Search and filters
  getFilteredBookings(): BookingData[] {
    return this.bookings.filter(booking => {
      const matchesSearch = this.searchTerm === '' ||
        booking.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        booking.tripName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.statusFilter === '' || booking.status === this.statusFilter;
      const matchesDate = this.dateFilter === '' || booking.travelDate === this.dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.dateFilter = '';
  }

  // Utility methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'Confirmed': return 'green';
      case 'Pending': return 'orange';
      case 'Cancelled': return 'red';
      default: return 'gray';
    }
  }

  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'Paid': return 'green';
      case 'Pending': return 'orange';
      case 'Failed': return 'red';
      default: return 'gray';
    }
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  // Helper methods for new data structure
  getTotalAvailableSpots(trip: TripData): number {
    return trip.availability.reduce((total, date) => total + date.available, 0);
  }

  getAvailableDates(trip: TripData): string[] {
    return trip.availability
      .filter(date => date.available > 0)
      .map(date => date.date);
  }

  // Helper methods for managing trip details
  addInclusion(): void {
    this.tripForm.inclusions.push('');
  }

  removeInclusion(index: number): void {
    this.tripForm.inclusions.splice(index, 1);
  }

  addExclusion(): void {
    this.tripForm.exclusions.push('');
  }

  removeExclusion(index: number): void {
    this.tripForm.exclusions.splice(index, 1);
  }

  addHighlight(): void {
    this.tripForm.highlights.push('');
  }

  removeHighlight(index: number): void {
    this.tripForm.highlights.splice(index, 1);
  }

  addItineraryDay(): void {
    this.tripForm.itinerary.push({
      day: this.tripForm.itinerary.length + 1,
      title: '',
      description: '',
      activities: [],
      meals: []
    });
  }

  // Helper method to check if current tab is valid
  isCurrentTabValid(): boolean {
    switch (this.activeTripTab) {
      case 'basic':
        return this.tripForm.name.trim() !== '' &&
          this.tripForm.destination.trim() !== '' &&
          this.tripForm.duration.trim() !== '' &&
          this.tripForm.basePrice > 0 &&
          this.tripForm.categoryId > 0 &&
          this.tripForm.description.trim() !== '' &&
          this.tripForm.totalCapacity > 0;
      case 'details':
        return this.tripForm.difficulty.trim() !== '' &&
          this.tripForm.groupSize.min > 0 &&
          this.tripForm.groupSize.max >= this.tripForm.groupSize.min &&
          this.tripForm.bestTime.trim() !== '' &&
          this.tripForm.cancellationPolicy.trim() !== '';
      case 'availability':
        return this.tripForm.availability.length > 0;
      case 'itinerary':
        return this.tripForm.itinerary.length > 0 &&
          this.tripForm.itinerary.every(day => day.title.trim() !== '' && day.description.trim() !== '');
      case 'inclusions':
        return this.tripForm.inclusions.length > 0 || this.tripForm.exclusions.length > 0;
      default:
        return false;
    }
  }

  // Check if entire form is complete
  isFormComplete(): boolean {
    return this.tripForm.name.trim() !== '' &&
      this.tripForm.destination.trim() !== '' &&
      this.tripForm.duration.trim() !== '' &&
      this.tripForm.basePrice > 0 &&
      this.tripForm.categoryId > 0 &&
      this.tripForm.description.trim() !== '' &&
      this.tripForm.totalCapacity > 0 &&
      this.tripForm.difficulty.trim() !== '' &&
      this.tripForm.groupSize.min > 0 &&
      this.tripForm.groupSize.max >= this.tripForm.groupSize.min &&
      this.tripForm.bestTime.trim() !== '' &&
      this.tripForm.cancellationPolicy.trim() !== '' &&
      this.tripForm.availability.length > 0 &&
      this.tripForm.itinerary.length > 0 &&
      this.tripForm.itinerary.every(day => day.title.trim() !== '' && day.description.trim() !== '') &&
      (this.tripForm.inclusions.length > 0 || this.tripForm.exclusions.length > 0);
  }

  removeItineraryDay(index: number): void {
    this.tripForm.itinerary.splice(index, 1);
    // Reorder day numbers
    this.tripForm.itinerary.forEach((item, i) => {
      item.day = i + 1;
    });
  }

  addActivity(dayIndex: number): void {
    this.tripForm.itinerary[dayIndex].activities.push({ time: '', description: '' });
  }

  removeActivity(dayIndex: number, activityIndex: number): void {
    this.tripForm.itinerary[dayIndex].activities.splice(activityIndex, 1);
  }

  addMeal(dayIndex: number): void {
    this.tripForm.itinerary[dayIndex].meals.push({ type: '', description: '' });
  }

  removeMeal(dayIndex: number, mealIndex: number): void {
    this.tripForm.itinerary[dayIndex].meals.splice(mealIndex, 1);
  }

  // Availability management methods
  addAvailabilityDate(): void {
    if (this.newAvailabilityDate && this.newAvailabilityCapacity > 0 && this.newAvailabilityPrice > 0) {
      // Check if date already exists
      const existingDate = this.tripForm.availability.find(avail => avail.date === this.newAvailabilityDate);
      if (existingDate) {
        alert('This date already exists in the availability list.');
        return;
      }

      // Validate capacity
      if (this.newAvailabilityCapacity > this.tripForm.totalCapacity) {
        alert(`Capacity cannot exceed total trip capacity (${this.tripForm.totalCapacity})`);
        return;
      }

      // Validate date is not in the past
      const selectedDate = new Date(this.newAvailabilityDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        alert('Cannot add dates in the past.');
        return;
      }

      this.tripForm.availability.push({
        date: this.newAvailabilityDate,
        available: this.newAvailabilityCapacity,
        maxCapacity: this.newAvailabilityCapacity,
        price: this.newAvailabilityPrice
      });

      // Sort availability dates chronologically
      this.tripForm.availability.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Reset form
      this.newAvailabilityDate = '';
      this.newAvailabilityCapacity = Math.min(30, this.tripForm.totalCapacity);
      this.newAvailabilityPrice = this.tripForm.basePrice;
    }
  }

  removeAvailabilityDate(index: number): void {
    this.tripForm.availability.splice(index, 1);
  }

  // Validate availability data when editing
  validateAvailabilityData(): boolean {
    return this.tripForm.availability.every(avail =>
      avail.available <= avail.maxCapacity &&
      avail.maxCapacity <= this.tripForm.totalCapacity &&
      (avail.price || 0) > 0
    );
  }

  getAvailabilityStatus(avail: { date: string; available: number; maxCapacity: number; price?: number }): string {
    if (avail.available === 0) {
      return 'Sold Out';
    } else if (avail.available <= avail.maxCapacity * 0.2) {
      return 'Limited';
    } else if (avail.available <= avail.maxCapacity * 0.5) {
      return 'Filling Up';
    } else {
      return 'Available';
    }
  }

  getAvailabilityStatusClass(avail: { date: string; available: number; maxCapacity: number; price?: number }): string {
    if (avail.available === 0) {
      return 'bg-danger';
    } else if (avail.available <= avail.maxCapacity * 0.2) {
      return 'bg-warning';
    } else if (avail.available <= avail.maxCapacity * 0.5) {
      return 'bg-info';
    } else {
      return 'bg-success';
    }
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Update availability price when base price changes
  onBasePriceChange(): void {
    if (this.newAvailabilityPrice === 0 || this.newAvailabilityPrice === this.tripForm.basePrice) {
      this.newAvailabilityPrice = this.tripForm.basePrice;
    }
  }

  // Update availability capacity when total capacity changes
  onTotalCapacityChange(): void {
    if (this.newAvailabilityCapacity > this.tripForm.totalCapacity) {
      this.newAvailabilityCapacity = this.tripForm.totalCapacity;
    }
  }

  // ===== IMAGE MANAGEMENT METHODS =====

  addImage(): void {
    this.tripForm.images.push('');
  }

  removeImage(index: number): void {
    this.tripForm.images.splice(index, 1);
  }

  generateRandomImage(): void {
    this.tripForm.image = getImageUrl();
  }

  generateRandomImageForIndex(index: number): void {
    this.tripForm.images[index] = getImageUrl();
  }



  // ===== CATEGORY MANAGEMENT METHODS =====

  addNewCategory(): void {
    this.isEditingCategory = false;
    this.selectedCategory = null;
    this.categoryForm = {
      name: '',
      description: '',
      imageUrl: '',
      isActive: true
    };
    this.showCategoryModal = true;
  }

  editCategory(category: Category): void {
    this.isEditingCategory = true;
    this.selectedCategory = category;
    this.categoryForm = {
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      isActive: category.isActive
    };
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.selectedCategory = null;
    this.isEditingCategory = false;
    this.categoryForm = {
      name: '',
      description: '',
      imageUrl: '',
      isActive: true
    };
  }

  saveCategory(): void {
    if (!this.isCategoryFormValid()) {
      return;
    }

    this.isLoading = true;

    if (this.isEditingCategory && this.selectedCategory) {
      // Update existing category
      const updateData = {
        name: this.categoryForm.name.trim(),
        description: this.categoryForm.description.trim(),
        imageUrl: this.categoryForm.imageUrl.trim(),
        isActive: this.categoryForm.isActive
      };

      this.categoriesService.updateCategory(this.selectedCategory.id, updateData).subscribe({
        next: (updatedCategory) => {
          console.log('Category updated successfully:', updatedCategory);
          this.refreshCategories(); // Refresh only categories from backend
          this.closeCategoryModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating category:', error);
          alert('Failed to update category. Please try again.');
          this.isLoading = false;
        }
      });
    } else {
      // Add new category
      const newCategoryData = {
        name: this.categoryForm.name.trim(),
        description: this.categoryForm.description.trim(),
        imageUrl: this.categoryForm.imageUrl.trim(),
        isActive: this.categoryForm.isActive
      };

      this.categoriesService.createCategory(newCategoryData).subscribe({
        next: (createdCategory) => {
          console.log('Category created successfully:', createdCategory);
          this.refreshCategories(); // Refresh only categories from backend
          this.closeCategoryModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating category:', error);
          alert('Failed to create category. Please try again.');
          this.isLoading = false;
        }
      });
    }
  }

  deleteCategory(categoryId: number): void {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      this.isLoading = true;

      this.categoriesService.deleteCategory(categoryId).subscribe({
        next: () => {
          console.log('Category deleted successfully');
          this.refreshCategories(); // Refresh only categories from backend
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete category. Please try again.');
          this.isLoading = false;
        }
      });
    }
  }

  getTripsInCategory(categoryId: number): number {
    return this.trips.filter(trip => trip.categoryId === categoryId).length;
  }

  isCategoryFormValid(): boolean {
    return this.categoryForm.name.trim() !== '' &&
           this.categoryForm.description.trim() !== '';
  }

  // ===== SUBSCRIPTION PLAN MANAGEMENT =====

  loadSubscriptionPlans(): void {
    this.vendorSubscriptionService.getVendorSubscriptionPlans().subscribe({
      next: (plans: SubscriptionPlan[]) => {
        this.subscriptionPlans = plans;
        console.log('Subscription plans loaded with subscriber counts:', plans);
      },
      error: (error: any) => {
        console.error('Error loading subscription plans:', error);
      }
    });
  }

  loadVendorSubscriptions(): void {
    if (!this.currentUser?.id) {
      console.error('No current user ID available');
      return;
    }
    
    // Load all vendor subscriptions
    this.vendorSubscriptionService.getVendorSubscriptions(this.currentUser.id).subscribe({
      next: (subscriptions) => {
        this.vendorSubscriptions = subscriptions;
        console.log('Vendor subscriptions loaded:', subscriptions);
        
        // Get current active plan (highest priority)
        if (this.currentUser?.id) {
          this.vendorSubscriptionService.getCurrentActivePlan(this.currentUser.id).subscribe({
            next: (currentPlan) => {
              this.activeSubscription = currentPlan;
              console.log('Current active plan (highest priority):', currentPlan);
            },
            error: (error: any) => {
              console.error('Error loading current active plan:', error);
              // Fallback to first active subscription
              this.activeSubscription = subscriptions.find(sub => sub.status === 'ACTIVE') || null;
            }
          });
        } else {
          // Fallback to first active subscription if no user ID
          this.activeSubscription = subscriptions.find(sub => sub.status === 'ACTIVE') || null;
        }
      },
      error: (error: any) => {
        console.error('Error loading vendor subscriptions:', error);
      }
    });
  }

  // Plan management methods
  addNewPlan(): void {
    this.isEditingPlan = false;
    this.selectedPlan = null;
    this.resetPlanForm();
    this.currentStep = 1;
    this.showPlanWizard = true;
  }

  editPlan(plan: SubscriptionPlan): void {
    this.isEditingPlan = true;
    this.selectedPlan = plan;
    this.planForm = { ...plan };
    this.currentStep = 1;
    this.showPlanWizard = true;
  }

  deletePlan(planId: number): void {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      this.subscriptionService.deleteSubscriptionPlan(planId).subscribe({
        next: () => {
          this.loadSubscriptionPlans();
          console.log('Plan deleted successfully');
        },
        error: (error: any) => {
          console.error('Error deleting plan:', error);
          alert('Failed to delete plan. Please try again.');
        }
      });
    }
  }

  savePlan(): void {
    if (!this.isPlanFormValid()) {
      return;
    }

    const planData = {
      name: this.planForm.name!,
      description: this.planForm.description!,
      price: this.planForm.price!,
      durationMonths: this.planForm.durationMonths!,
      maxTrips: this.planForm.maxTrips,
      features: this.planForm.features && this.planForm.features.trim() ? this.planForm.features : '',
      isActive: this.planForm.isActive!,
      trialDays: this.planForm.trialDays || 0,
      trialPrice: this.planForm.trialPrice || 0,
      isTrialOnly: this.planForm.isTrialOnly || false,
      discountPercent: this.planForm.discountPercent || 0
    };

    // Debug logging
    console.log('Saving plan with data:', planData);
    console.log('isTrialOnly value:', this.planForm.isTrialOnly);
    console.log('price value:', this.planForm.price);

    if (this.isEditingPlan && this.selectedPlan) {
      this.subscriptionService.updateSubscriptionPlan(this.selectedPlan.id!, planData).subscribe({
        next: (updatedPlan: any) => {
          this.loadSubscriptionPlans();
          this.closePlanWizard();
          console.log('Plan updated successfully:', updatedPlan);
        },
        error: (error: any) => {
          console.error('Error updating plan:', error);
          alert('Failed to update plan. Please try again.');
        }
      });
    } else {
      this.subscriptionService.createSubscriptionPlan(planData).subscribe({
        next: (createdPlan: any) => {
          this.loadSubscriptionPlans();
          this.closePlanWizard();
          console.log('Plan created successfully:', createdPlan);
        },
        error: (error: any) => {
          console.error('Error creating plan:', error);
          alert('Failed to create plan. Please try again.');
        }
      });
    }
  }

  // New clean wizard navigation
  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  getStepTitle(step: number): string {
    const titles = ['', 'Basic Info', 'Pricing', 'Features', 'Review'];
    return titles[step] || '';
  }

  getStepDescription(step: number): string {
    const descriptions = ['', 'Plan name and description', 'Price and billing cycle', 'Plan features and limits', 'Review and create plan'];
    return descriptions[step] || '';
  }

  onTrialOnlyChange(): void {
    console.log('onTrialOnlyChange called, isTrialOnly:', this.planForm.isTrialOnly);
    if (this.planForm.isTrialOnly) {
      // When trial-only is enabled, set price to 0 and duration to 0
      this.planForm.price = 0;
      this.planForm.durationMonths = 0;
      this.planForm.trialPrice = 0;
      console.log('Set trial-only values: price=0, duration=0');
    } else {
      // When trial-only is disabled, set default values
      this.planForm.price = 29.99;
      this.planForm.durationMonths = 1;
      console.log('Set regular plan values: price=29.99, duration=1');
    }
  }

  onDurationMonthsChange(value: any): void {
    // Convert string to number to ensure proper validation
    this.planForm.durationMonths = Number(value);
    console.log('Duration months changed to:', this.planForm.durationMonths);
    
    // Auto-calculate discount for yearly plans
    this.calculateAutoDiscount();
  }

  onPriceChange(): void {
    // Auto-calculate discount when price changes
    this.calculateAutoDiscount();
  }

  onDiscountChange(): void {
    // When user manually changes discount, recalculate the price
    if (this.planForm.discountPercent && this.planForm.discountPercent > 0 && this.planForm.durationMonths === 12 && this.planForm.price) {
      // Calculate discounted price based on monthly equivalent
      const monthlyEquivalent = this.planForm.price / this.planForm.durationMonths;
      const originalYearlyPrice = monthlyEquivalent * 12;
      const discountedPrice = originalYearlyPrice * (1 - this.planForm.discountPercent / 100);
      this.planForm.price = Math.round(discountedPrice * 100) / 100;
    }
  }

  calculateAutoDiscount(): void {
    if (!this.planForm.price || !this.planForm.durationMonths) {
      this.planForm.discountPercent = 0;
      return;
    }

    const monthlyPrice = this.planForm.price / this.planForm.durationMonths;
    const expectedYearlyPrice = monthlyPrice * 12;
    
    // Calculate discount percentage
    if (this.planForm.durationMonths === 12 && this.planForm.price < expectedYearlyPrice) {
      const discount = ((expectedYearlyPrice - this.planForm.price) / expectedYearlyPrice) * 100;
      this.planForm.discountPercent = Math.round(discount * 100) / 100; // Round to 2 decimal places
    } else {
      this.planForm.discountPercent = 0;
    }
  }

  getDiscountInfo(): { hasDiscount: boolean, monthlyEquivalent: number, savings: number } {
    if (!this.planForm.price || !this.planForm.durationMonths || this.planForm.durationMonths === 1) {
      return { hasDiscount: false, monthlyEquivalent: 0, savings: 0 };
    }

    const monthlyEquivalent = this.planForm.price / this.planForm.durationMonths;
    const expectedYearlyPrice = monthlyEquivalent * 12;
    const savings = expectedYearlyPrice - this.planForm.price;

    return {
      hasDiscount: this.planForm.durationMonths === 12 && this.planForm.price < expectedYearlyPrice,
      monthlyEquivalent: Math.round(monthlyEquivalent * 100) / 100,
      savings: Math.round(savings * 100) / 100
    };
  }

  getPlanSavings(plan: SubscriptionPlan): number {
    if (!plan.discountPercent || plan.discountPercent <= 0 || !plan.price || !plan.durationMonths) {
      return 0;
    }
    
    const monthlyEquivalent = plan.price / plan.durationMonths;
    const expectedYearlyPrice = monthlyEquivalent * 12;
    const savings = expectedYearlyPrice - plan.price;
    
    return Math.round(savings * 100) / 100;
  }

  getMonthlyEquivalent(plan: SubscriptionPlan): number {
    if (!plan.price || !plan.durationMonths) {
      return 0;
    }
    
    const monthlyEquivalent = plan.price / plan.durationMonths;
    return Math.round(monthlyEquivalent * 100) / 100;
  }

 
  syncAllPlansWithStripe(): void {
    // Vendors don't have permission to sync plans with Stripe
    alert('Vendors do not have permission to sync plans with Stripe. Please contact an administrator.');
  }

  updateStripePrice(plan: SubscriptionPlan): void {
    // Vendors don't have permission to update Stripe prices
    alert('Vendors do not have permission to update Stripe prices. Please contact an administrator.');
  }

  archiveStripeProduct(plan: SubscriptionPlan): void {
    // Vendors don't have permission to archive Stripe products
    alert('Vendors do not have permission to archive Stripe products. Please contact an administrator.');
  }

 
  // Analytics Methods
  loadAdminStats(): void {
    this.analyticsLoading = true;
    // For vendors, we'll use mock data since they don't have access to admin stats
    // In a real implementation, you might want to create vendor-specific stats endpoints
    const mockStats = {
      totalPlans: this.subscriptionPlans.length,
      activePlans: this.subscriptionPlans.filter(plan => plan.isActive).length,
      totalSubscriptions: this.vendorSubscriptions.length,
      activeSubscriptions: this.vendorSubscriptions.filter(sub => sub.status === 'ACTIVE').length,
      monthlyRevenue: 0, // Vendors don't see revenue data
      yearlyRevenue: 0
    };
    
    // Simulate API call delay
    setTimeout(() => {
      this.adminStats = mockStats;
      this.analyticsLoading = false;
    }, 1000);
  }

  loadPlanAnalytics(planId?: number): void {
    this.analyticsLoading = true;
    // For vendors, we'll use mock data since they don't have access to plan analytics
    const mockAnalytics = [
      {
        planId: 1,
        planName: 'Basic Plan',
        totalSubscriptions: 5,
        activeSubscriptions: 4,
        revenue: 0, // Vendors don't see revenue data
        conversionRate: 0.8,
        churnRate: 0.2,
        averageLifetime: 12
      }
    ];
    
    // Simulate API call delay
    setTimeout(() => {
      this.planAnalytics = mockAnalytics;
      this.preparePlanPerformanceChart();
      this.analyticsLoading = false;
    }, 1000);
  }

  loadRevenueAnalytics(): void {
    this.analyticsLoading = true;
    // For vendors, we'll use mock data since they don't have access to revenue analytics
    const mockRevenue = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      monthlyRevenue: [0, 0, 0, 0, 0, 0], // Vendors don't see revenue data
      yearlyRevenue: [0, 0, 0, 0, 0, 0]
    };
    
    // Simulate API call delay
    setTimeout(() => {
      this.revenueAnalytics = mockRevenue;
      this.prepareRevenueChart();
      this.analyticsLoading = false;
    }, 1000);
  }

  loadSubscriptionGrowth(): void {
    this.analyticsLoading = true;
    // For vendors, we'll use mock data since they don't have access to admin analytics
    // In a real implementation, you might want to create vendor-specific analytics endpoints
    const mockGrowth = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      newSubscriptions: [5, 8, 12, 6, 9, 11],
      cancelledSubscriptions: [1, 2, 1, 3, 2, 1],
      netGrowth: [4, 6, 11, 3, 7, 10]
    };
    
    // Simulate API call delay
    setTimeout(() => {
      this.subscriptionGrowth = mockGrowth;
      this.prepareGrowthChart();
      this.analyticsLoading = false;
    }, 1000);
  }

  viewPlanAnalytics(plan: SubscriptionPlan): void {
    // This method handles analytics requests from the subscription plan report component
    console.log('Viewing analytics for plan:', plan);
    // You can add specific analytics loading logic here if needed
  }

  // Event handlers for child components
  onPlanCreated(plan: SubscriptionPlan): void {
    console.log('Plan created:', plan);
    this.loadSubscriptionPlans();
  }

  onPlanDeleted(planId: number): void {
    console.log('Plan deleted:', planId);
    this.loadSubscriptionPlans();
  }

  onTrialDaysChange(): void {
    if (this.planForm.trialDays && this.planForm.trialDays > 0) {
      // Always set trial price to 0 for free trials
      this.planForm.trialPrice = 0;
      
      // If this is a trial-only plan, ensure no regular billing
      if (this.planForm.isTrialOnly) {
        this.planForm.price = 0;
        this.planForm.durationMonths = 0;
      }
    } else {
      // When no trial is selected, reset trial price
      this.planForm.trialPrice = 0;
      
      // If this was a trial-only plan and no trial is selected, it becomes invalid
      // Don't automatically reset isTrialOnly flag - let user decide
    }
  }

  toggleTrialOnlyMode(): void {
    this.planForm.isTrialOnly = !this.planForm.isTrialOnly;
    if (this.planForm.isTrialOnly) {
      // Set to trial-only mode
      this.planForm.price = 0;
      this.planForm.durationMonths = 0;
      if (!this.planForm.trialDays || this.planForm.trialDays === 0) {
        this.planForm.trialDays = 14; // Default to 14-day trial
      }
      this.planForm.trialPrice = 0;
    } else {
      // Reset to regular plan with optional trial
      this.planForm.price = 0;
      this.planForm.durationMonths = 1;
      // Keep existing trial settings if any
    }
  }


  closeAnalyticsModal(): void {
    this.showAnalyticsModal = false;
    this.selectedAnalyticsPlan = null;
  }

  onAnalyticsDateRangeChange(): void {
    this.loadRevenueAnalytics();
    this.loadSubscriptionGrowth();
  }

  // Chart preparation methods
  prepareRevenueChart(): void {
    if (!this.revenueAnalytics) return;
    
    this.revenueChartData = {
      labels: this.revenueAnalytics.labels,
      datasets: [{
        label: 'Revenue',
        data: this.revenueAnalytics.data,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: true
      }]
    };
  }

  prepareGrowthChart(): void {
    if (!this.subscriptionGrowth) return;
    
    this.growthChartData = {
      labels: this.subscriptionGrowth.labels,
      datasets: [
        {
          label: 'New Subscriptions',
          data: this.subscriptionGrowth.newSubscriptions,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2
        },
        {
          label: 'Cancelled Subscriptions',
          data: this.subscriptionGrowth.cancelledSubscriptions,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2
        },
        {
          label: 'Net Growth',
          data: this.subscriptionGrowth.netGrowth,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 2
        }
      ]
    };
  }

  preparePlanPerformanceChart(): void {
    if (!this.planAnalytics || this.planAnalytics.length === 0) return;
    
    this.planPerformanceChartData = {
      labels: this.planAnalytics.map(p => p.planName),
      datasets: [
        {
          label: 'Total Subscriptions',
          data: this.planAnalytics.map(p => p.totalSubscriptions),
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        },
        {
          label: 'Active Subscriptions',
          data: this.planAnalytics.map(p => p.activeSubscriptions),
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }
      ]
    };
  }

  // Helper method to get subscription plan by ID
  getSubscriptionPlanById(planId: number): SubscriptionPlan | null {
    return this.subscriptionPlans.find(plan => plan.id === planId) || null;
  }

  closePlanModal(): void {
    this.showPlanModal = false;
    this.resetPlanForm();
    this.currentStep = 1;
    this.isEditingPlan = false;
  }

  closePlanWizard(): void {
    this.showPlanWizard = false;
    this.resetPlanForm();
    this.currentStep = 1;
  }


  resetPlanForm(): void {
    this.planForm = {
      name: '',
      description: '',
      price: 0,
      durationMonths: 1,
      maxTrips: 0,
      features: '',
      isActive: true,
      trialDays: 0,
      trialPrice: 0,
      isTrialOnly: false,
      discountPercent: 0
    };
  }

  isPlanFormValid(): boolean {
    const basicFieldsValid = !!(this.planForm.name?.trim() && this.planForm.description?.trim());
    
    // For trial-only plans, skip price and billing cycle validation
    if (this.planForm.isTrialOnly) {
      return basicFieldsValid && (this.planForm.trialDays !== undefined && this.planForm.trialDays > 0);
    }
    
    // For regular plans, require price and duration
    return basicFieldsValid &&
           this.planForm.price !== undefined &&
           this.planForm.price >= 0 && // Allow 0 for free plans
           this.planForm.durationMonths !== undefined &&
           this.planForm.durationMonths > 0;
  }

  // Subscription management methods
  viewSubscription(subscription: VendorSubscription): void {
    this.selectedSubscription = subscription;
    this.showSubscriptionModal = true;
  }

  closeSubscriptionModal(): void {
    this.showSubscriptionModal = false;
    this.selectedSubscription = null;
  }

  cancelSubscription(subscriptionId: number): void {
    if (confirm('Are you sure you want to cancel this subscription?')) {
      this.subscriptionService.cancelSubscription(subscriptionId).subscribe({
        next: () => {
          this.loadVendorSubscriptions();
          this.activeSubscription = null; // Clear active subscription
          console.log('Subscription cancelled successfully');
        },
        error: (error: any) => {
          console.error('Error cancelling subscription:', error);
          alert('Failed to cancel subscription. Please try again.');
        }
      });
    }
  }

  // Phase 1: Trial subscription methods
  onSubscribeToPlan(plan: SubscriptionPlan): void {
    if (!this.currentUser?.id) {
      alert('User ID not available');
      return;
    }

    this.isSubscribing = true;

    // Treat as trial when explicitly trial-only, or has trial days with free trial price, or plan price is zero
    const isTrialFlow = Boolean(
      plan.isTrialOnly ||
      ((plan.trialDays || 0) > 0 && (plan.trialPrice === undefined || plan.trialPrice === null || plan.trialPrice === 0)) ||
      (plan.price !== undefined && plan.price !== null && plan.price === 0)
    );

    if (isTrialFlow) {
      // Handle trial-only plans (no Stripe required)
      this.subscriptionService.createVendorSubscription(
        this.currentUser.id, 
        plan.id!, 
        new Date().toISOString().split('T')[0]
      ).subscribe({
        next: (subscription) => {
          console.log('Trial subscription created:', subscription);
          this.activeSubscription = subscription;
          this.isSubscribing = false;
          alert('Trial subscription started successfully!');
          this.loadVendorSubscriptions(); // Refresh subscriptions
        },
        error: (err) => {
          console.error('Failed to create trial subscription:', err);
          alert('Failed to start trial: ' + (err.error?.message || err.message));
          this.isSubscribing = false;
        }
      });
    } else {
      // Handle paid plans (requires Stripe integration)
      this.showPaymentModal(plan);
    }
  }

  // UI helper methods
  canSubscribeToPlan(plan: SubscriptionPlan): boolean {
    // Can't subscribe if already have active subscription
    if (this.activeSubscription) return false;
    
    // Can't subscribe if currently subscribing
    if (this.isSubscribing) return false;
    
    // Can't subscribe if plan is not active
    if (!plan.isActive) return false;
    
    return true;
  }

  getSubscriptionStatus(): string {
    if (!this.activeSubscription) {
      return 'No active subscription';
    }
    
    return this.activeSubscription.status === 'ACTIVE' ? 'Active' : 'Inactive';
  }

  getPlanDisplayPrice(plan: SubscriptionPlan): string {
    if (plan.isTrialOnly) {
      return 'Free Trial';
    }
    
    const price = plan.price || 0;
    const duration = plan.durationMonths || 1;
    
    if (duration === 1) {
      return `$${price}/month`;
    } else {
      return `$${price}/${duration} months`;
    }
  }

  getActiveSubscriptionByVendor(): VendorSubscription | null {
    return this.activeSubscription;
  }

  // Filter methods
  get filteredPlans(): SubscriptionPlan[] {
    return this.subscriptionPlans.filter(plan => {
      const matchesSearch = !this.planSearchTerm || 
        plan.name.toLowerCase().includes(this.planSearchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(this.planSearchTerm.toLowerCase());
      
      const matchesStatus = !this.planStatusFilter || 
        (this.planStatusFilter === 'active' && plan.isActive) ||
        (this.planStatusFilter === 'inactive' && !plan.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }

  get filteredSubscriptions(): VendorSubscription[] {
    if (!this.vendorSubscriptions) {
      return [];
    }
    return this.vendorSubscriptions.filter(subscription => {
      const matchesSearch = !this.subscriptionSearchTerm || 
        subscription.id?.toString().includes(this.subscriptionSearchTerm) ||
        subscription.vendorId.toString().includes(this.subscriptionSearchTerm);
      
      const matchesStatus = !this.subscriptionStatusFilter || 
        subscription.status === this.subscriptionStatusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  // Utility methods
  getPlanById(planId: number): SubscriptionPlan | undefined {
    return this.subscriptionPlans.find(plan => plan.id === planId);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getTripImageUrl(trip: any): string {
    if (trip.image) {
      return trip.image;
    }
    if (trip.images && trip.images.length > 0) {
      return trip.images[0];
    }
    return '';
  }

  clearPlanFilters(): void {
    this.planSearchTerm = '';
    this.planStatusFilter = '';
    this.planPriceFilter = '';
  }

  getMonthlyRevenue(): number {
    return this.adminStats?.monthlyRevenue || 0;
  }

  getTotalSubscribers(): number {
    return this.adminStats?.activeSubscriptions || 0;
  }

  getActivePlansCount(): number {
    return this.adminStats?.activePlans || 0;
  }

  duplicatePlan(plan: SubscriptionPlan): void {
    const duplicatedPlan = {
      ...plan,
      id: undefined,
      name: `${plan.name} (Copy)`,
      stripeProductId: undefined,
      stripePriceId: undefined
    };
    this.planForm = duplicatedPlan;
    this.isEditingPlan = false;
    this.showPlanModal = true;
  }

  getSubscriberCount(planId: number): number {
    if (!this.vendorSubscriptions) {
      return 0;
    }
    return this.vendorSubscriptions.filter(sub => sub.planId === planId && sub.status === 'active').length;
  }

  // Stripe Integration Methods
  private async initializeStripe(): Promise<void> {
    try {
      this.stripe = await loadStripe(environment.stripe.publishableKey);
      this.isStripeLoaded = true;
      console.log('✅ Stripe initialized for admin component');
    } catch (error) {
      console.error('❌ Error loading Stripe:', error);
    }
  }

  getStripeDashboardUrl(plan: SubscriptionPlan): string {
    if (plan.stripeProductId) {
      return `https://dashboard.stripe.com/products/${plan.stripeProductId}`;
    }
    return '';
  }

  isPlanSyncedWithStripe(plan: SubscriptionPlan): boolean {
    return Boolean(plan.stripeSync && plan.stripeProductId && plan.stripePriceId);
  }

  getStripeSyncStatus(plan: SubscriptionPlan): string {
    if (plan.isTrialOnly) {
      return 'Trial-only (No Stripe needed)';
    }
    if (this.isPlanSyncedWithStripe(plan)) {
      return `Synced ${plan.lastSyncDate ? new Date(plan.lastSyncDate).toLocaleDateString() : ''}`;
    }
    return 'Not synced';
  }

  syncPlanWithStripe(plan: SubscriptionPlan): void {
    // Vendors don't have permission to sync plans with Stripe
    alert('Vendors do not have permission to sync plans with Stripe. Please contact an administrator.');
  }

   

  openStripeDashboard(plan: SubscriptionPlan): void {
    const dashboardUrl = this.getStripeDashboardUrl(plan);
    if (dashboardUrl) {
      window.open(dashboardUrl, '_blank');
    } else {
      this.showErrorMessage('Stripe dashboard URL not available for this plan.');
    }
  }

  // Vendor subscription handler
  onVendorSubscriptionRequested(plan: SubscriptionPlan): void {
    console.log('Vendor subscription requested for plan:', plan);
    // Call our new subscription method
    this.onSubscribeToPlan(plan);
  }

  onVendorSubscriptionCancelled(plan: SubscriptionPlan): void {
    console.log('Vendor subscription cancelled for plan:', plan);
    // Refresh subscriptions to update UI
    this.loadVendorSubscriptions();
  }

  private showSuccessMessage(message: string): void {
    // You can implement a toast notification here
    alert(`✅ ${message}`);
  }

  private showErrorMessage(message: string): void {
    // You can implement a toast notification here
    alert(`❌ ${message}`);
  }

  // Payment modal properties
  showPaymentModalFlag = false;
  selectedPlanForPayment: SubscriptionPlan | null = null;
  paymentError: string | null = null;

  showPaymentModal(plan: SubscriptionPlan): void {
    this.selectedPlanForPayment = plan;
    this.showPaymentModalFlag = true;
    this.paymentError = null;
  }

  hidePaymentModal(): void {
    this.showPaymentModalFlag = false;
    this.selectedPlanForPayment = null;
    this.paymentError = null;
    this.isSubscribing = false;
  }

  onPaymentSuccess(paymentData: any): void {
    console.log('Payment successful:', paymentData);
    
    if (!this.currentUser?.id || !this.selectedPlanForPayment) {
      this.paymentError = 'Missing user or plan information';
      return;
    }

    // Create paid subscription with Stripe
    this.createPaidSubscription(this.selectedPlanForPayment, paymentData.paymentMethod.id);
  }

  onPaymentError(error: string): void {
    console.error('Payment error:', error);
    this.paymentError = error;
    this.isSubscribing = false;
  }

  onPaymentCancel(): void {
    this.hidePaymentModal();
  }

  createPaidSubscription(plan: SubscriptionPlan, paymentMethodId: string): void {
    if (!this.currentUser?.id) {
      this.paymentError = 'User ID not available';
      return;
    }

    // Use the existing Stripe subscription endpoint
    if (!plan.id) {
      this.paymentError = 'Plan ID not available';
      return;
    }

    const subscriptionData = {
      vendorId: this.currentUser.id,
      planId: plan.id,
      paymentMethodId: paymentMethodId,
      startDate: new Date().toISOString().split('T')[0]
    };

    this.subscriptionService.createPaidVendorSubscription(subscriptionData).subscribe({
      next: (response) => {
        console.log('Paid subscription created:', response);
        this.activeSubscription = response.vendorSubscription;
        this.hidePaymentModal();
        alert('Paid subscription started successfully!');
        this.loadVendorSubscriptions(); // Refresh subscriptions
      },
      error: (err) => {
        console.error('Failed to create paid subscription:', err);
        this.paymentError = 'Failed to create subscription: ' + (err.error?.message || err.message);
        this.isSubscribing = false;
      }
    });
  }
}