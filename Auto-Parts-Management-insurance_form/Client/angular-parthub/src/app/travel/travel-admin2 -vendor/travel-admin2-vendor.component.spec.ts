import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TravelAdminComponent } from './travel-admin.component';
import { TripData } from '../mock-travel-data';

describe('TravelAdminComponent', () => {
  let component: TravelAdminComponent;
  let fixture: ComponentFixture<TravelAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelAdminComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.activeTab).toBe('dashboard');
    expect(component.isLoading).toBe(false);
    expect(component.trips).toEqual([]);
    expect(component.bookings).toEqual([]);
    expect(component.searchTerm).toBe('');
    expect(component.statusFilter).toBe('');
    expect(component.dateFilter).toBe('');
  });

  it('should load data on init', () => {
    spyOn(component, 'loadData');
    component.ngOnInit();
    expect(component.loadData).toHaveBeenCalled();
  });

  it('should set active tab', () => {
    component.setActiveTab('trips');
    expect(component.activeTab).toBe('trips');
  });

  it('should calculate stats correctly', () => {
    // Mock data
    component.trips = [
      { id: 1, name: 'Trip 1', destination: 'Paris', duration: '3 days', basePrice: 300, image: '', images: [], availability: [], maxCapacity: 10, categoryId: 1, description: '', inclusions: [], exclusions: [], itinerary: [], highlights: [], difficulty: 'Easy', groupSize: { min: 2, max: 10 }, bestTime: '', cancellationPolicy: '' }
    ] as TripData[];

    component.bookings = [
      { id: 'TB001', tripId: 1, tripName: 'Trip 1', customerName: 'John', customerEmail: 'john@test.com', travelDate: '2024-03-15', numberOfPeople: 2, totalPrice: 600, bookingDate: '2024-02-15', status: 'Confirmed', paymentStatus: 'Paid' }
    ];

    component.calculateStats();

    expect(component.stats.totalTrips).toBe(1);
    expect(component.stats.totalBookings).toBe(1);
    expect(component.stats.totalRevenue).toBe(600);
    expect(component.stats.averageBookingValue).toBe(600);
    expect(component.stats.popularDestinations).toContain('Paris');
  });

  it('should add new trip', () => {
    component.addNewTrip();
    expect(component.isEditingTrip).toBe(false);
    expect(component.selectedTrip).toBeNull();
    expect(component.showTripModal).toBe(true);
  });

  it('should edit trip', () => {
    const mockTrip = { id: 1, name: 'Test Trip', destination: 'Paris', duration: '3 days', basePrice: 300, image: '', images: [], availability: [], maxCapacity: 10, categoryId: 1, description: 'Test description', inclusions: [], exclusions: [], itinerary: [], highlights: [], difficulty: 'Easy', groupSize: { min: 2, max: 10 }, bestTime: '', cancellationPolicy: '' } as TripData;

    component.editTrip(mockTrip);

    expect(component.isEditingTrip).toBe(true);
    expect(component.selectedTrip).toBe(mockTrip);
    expect(component.showTripModal).toBe(true);
    expect(component.tripForm.name).toBe('Test Trip');
    expect(component.tripForm.destination).toBe('Paris');
  });

  it('should validate trip form', () => {
    // Test invalid form
    component.tripForm = {
      name: '',
      destination: '',
      duration: '',
      basePrice: 0,
      categoryId: 0,
      description: '',
      totalCapacity: 0,
      availability: []
    };
    expect(component.validateTripForm()).toBe(false);

    // Test valid form
    component.tripForm = {
      name: 'Test Trip',
      destination: 'Paris',
      duration: '3 days',
      basePrice: 300,
      categoryId: 1,
      description: 'Test description',
      totalCapacity: 10,
      availability: []
    };
    expect(component.validateTripForm()).toBe(true);
  });

  it('should reset trip form', () => {
    component.tripForm = {
      name: 'Test',
      destination: 'Paris',
      duration: '3 days',
      basePrice: 300,
      categoryId: 1,
      description: 'Test',
      totalCapacity: 10,
      availability: []
    };

    component.resetTripForm();

    expect(component.tripForm.name).toBe('');
    expect(component.tripForm.destination).toBe('');
    expect(component.tripForm.basePrice).toBe(0);
  });

  it('should close trip modal', () => {
    component.showTripModal = true;
    component.selectedTrip = {} as TripData;
    component.tripForm = { name: 'Test', destination: '', duration: '', basePrice: 0, categoryId: 0, description: '', totalCapacity: 0, availability: [] };

    component.closeTripModal();

    expect(component.showTripModal).toBe(false);
    expect(component.selectedTrip).toBeNull();
    expect(component.tripForm.name).toBe('');
  });

  it('should view booking', () => {
    const mockBooking = { id: 'TB001', tripId: 1, tripName: 'Test Trip', customerName: 'John', customerEmail: 'john@test.com', travelDate: '2024-03-15', numberOfPeople: 2, totalPrice: 600, bookingDate: '2024-02-15', status: 'Confirmed', paymentStatus: 'Paid' };

    component.viewBooking(mockBooking);

    expect(component.selectedBooking).toBe(mockBooking);
    expect(component.showBookingModal).toBe(true);
  });

  it('should update booking status', () => {
    const mockBooking = { id: 'TB001', tripId: 1, tripName: 'Test Trip', customerName: 'John', customerEmail: 'john@test.com', travelDate: '2024-03-15', numberOfPeople: 2, totalPrice: 600, bookingDate: '2024-02-15', status: 'Pending', paymentStatus: 'Pending' };

    component.updateBookingStatus(mockBooking, 'Confirmed');

    expect(mockBooking.status).toBe('Confirmed');
  });

  it('should update payment status', () => {
    const mockBooking = { id: 'TB001', tripId: 1, tripName: 'Test Trip', customerName: 'John', customerEmail: 'john@test.com', travelDate: '2024-03-15', numberOfPeople: 2, totalPrice: 600, bookingDate: '2024-02-15', status: 'Confirmed', paymentStatus: 'Pending' };

    component.updatePaymentStatus(mockBooking, 'Paid');

    expect(mockBooking.paymentStatus).toBe('Paid');
  });

  it('should close booking modal', () => {
    component.showBookingModal = true;
    component.selectedBooking = { id: 'TB001', tripId: 1, tripName: 'Test Trip', customerName: 'John', customerEmail: 'john@test.com', travelDate: '2024-03-15', numberOfPeople: 2, totalPrice: 600, bookingDate: '2024-02-15', status: 'Confirmed', paymentStatus: 'Paid' };

    component.closeBookingModal();

    expect(component.showBookingModal).toBe(false);
    expect(component.selectedBooking).toBeNull();
  });

  it('should filter bookings correctly', () => {
    component.bookings = [
      { id: 'TB001', tripId: 1, tripName: 'Paris Trip', customerName: 'John Smith', customerEmail: 'john@test.com', travelDate: '2024-03-15', numberOfPeople: 2, totalPrice: 600, bookingDate: '2024-02-15', status: 'Confirmed', paymentStatus: 'Paid' },
      { id: 'TB002', tripId: 2, tripName: 'Rome Trip', customerName: 'Jane Doe', customerEmail: 'jane@test.com', travelDate: '2024-03-20', numberOfPeople: 3, totalPrice: 900, bookingDate: '2024-02-20', status: 'Pending', paymentStatus: 'Pending' }
    ];

    // Test search filter
    component.searchTerm = 'John';
    let filtered = component.getFilteredBookings();
    expect(filtered.length).toBe(1);
    expect(filtered[0].customerName).toBe('John Smith');

    // Test status filter
    component.searchTerm = '';
    component.statusFilter = 'Confirmed';
    filtered = component.getFilteredBookings();
    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe('Confirmed');

    // Test date filter
    component.statusFilter = '';
    component.dateFilter = '2024-03-15';
    filtered = component.getFilteredBookings();
    expect(filtered.length).toBe(1);
    expect(filtered[0].travelDate).toBe('2024-03-15');
  });

  it('should clear filters', () => {
    component.searchTerm = 'test';
    component.statusFilter = 'Confirmed';
    component.dateFilter = '2024-03-15';

    component.clearFilters();

    expect(component.searchTerm).toBe('');
    expect(component.statusFilter).toBe('');
    expect(component.dateFilter).toBe('');
  });

  it('should get status color', () => {
    expect(component.getStatusColor('Confirmed')).toBe('green');
    expect(component.getStatusColor('Pending')).toBe('orange');
    expect(component.getStatusColor('Cancelled')).toBe('red');
    expect(component.getStatusColor('Unknown')).toBe('gray');
  });

  it('should get payment status color', () => {
    expect(component.getPaymentStatusColor('Paid')).toBe('green');
    expect(component.getPaymentStatusColor('Pending')).toBe('orange');
    expect(component.getPaymentStatusColor('Failed')).toBe('red');
    expect(component.getPaymentStatusColor('Unknown')).toBe('gray');
  });

  it('should format currency', () => {
    expect(component.formatCurrency(123.45)).toBe('$123.45');
    expect(component.formatCurrency(0)).toBe('$0.00');
    expect(component.formatCurrency(1000)).toBe('$1000.00');
  });

  it('should format date', () => {
    const date = '2024-03-15';
    const formatted = component.formatDate(date);
    expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });

  it('should get popular destinations', () => {
    component.trips = [
      { id: 1, name: 'Trip 1', destination: 'Paris', duration: '3 days', basePrice: 300, image: '', images: [], availability: [], maxCapacity: 10, categoryId: 1, description: '', inclusions: [], exclusions: [], itinerary: [], highlights: [], difficulty: 'Easy', groupSize: { min: 2, max: 10 }, bestTime: '', cancellationPolicy: '' },
      { id: 2, name: 'Trip 2', destination: 'Paris', duration: '3 days', basePrice: 300, image: '', images: [], availability: [], maxCapacity: 10, categoryId: 1, description: '', inclusions: [], exclusions: [], itinerary: [], highlights: [], difficulty: 'Easy', groupSize: { min: 2, max: 10 }, bestTime: '', cancellationPolicy: '' },
      { id: 3, name: 'Trip 3', destination: 'Rome', duration: '3 days', basePrice: 300, image: '', images: [], availability: [], maxCapacity: 10, categoryId: 1, description: '', inclusions: [], exclusions: [], itinerary: [], highlights: [], difficulty: 'Easy', groupSize: { min: 2, max: 10 }, bestTime: '', cancellationPolicy: '' }
    ] as TripData[];

    const destinations = component.getPopularDestinations();
    expect(destinations).toContain('Paris');
    expect(destinations).toContain('Rome');
    expect(destinations[0]).toBe('Paris'); // Paris appears twice, so it should be first
  });

  it('should delete trip', () => {
    component.trips = [
      { id: 1, name: 'Trip 1', destination: 'Paris', duration: '3 days', basePrice: 300, image: '', images: [], availability: [], maxCapacity: 10, categoryId: 1, description: '', inclusions: [], exclusions: [], itinerary: [], highlights: [], difficulty: 'Easy', groupSize: { min: 2, max: 10 }, bestTime: '', cancellationPolicy: '' },
      { id: 2, name: 'Trip 2', destination: 'Rome', duration: '3 days', basePrice: 300, image: '', images: [], availability: [], maxCapacity: 10, categoryId: 1, description: '', inclusions: [], exclusions: [], itinerary: [], highlights: [], difficulty: 'Easy', groupSize: { min: 2, max: 10 }, bestTime: '', cancellationPolicy: '' }
    ] as TripData[];

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'calculateStats');

    component.deleteTrip(1);

    expect(component.trips.length).toBe(1);
    expect(component.trips[0].id).toBe(2);
    expect(component.calculateStats).toHaveBeenCalled();
  });

  it('should not delete trip when cancelled', () => {
    component.trips = [
      { id: 1, name: 'Trip 1', destination: 'Paris', duration: '3 days', basePrice: 300, image: '', images: [], availability: [], maxCapacity: 10, categoryId: 1, description: '', inclusions: [], exclusions: [], itinerary: [], highlights: [], difficulty: 'Easy', groupSize: { min: 2, max: 10 }, bestTime: '', cancellationPolicy: '' }
    ] as TripData[];

    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteTrip(1);

    expect(component.trips.length).toBe(1);
  });
}); 