
export class Booking {
    id?: number;
    tripId!: number;
    customerId!: number;
    bookingReference: string = '';
    bookingDate!: string; // YYYY-MM-DD
    travelDate!: string; // YYYY-MM-DD
    numberOfPeople!: number;
    totalAmount!: number;
    bookingStatus: string = 'PENDING';
    paymentStatus: string = 'PENDING';
    paymentIntentId: string = '';
    specialRequests: string = '';
    cancellationReason: string = '';
    incompleteBookingExpiresAt?: string; // ISO date format
    //companions: BookingCompanion[] = [];
    createdAt?: string;
    lastModifiedAt?: string;
    // Additional customer fields from backend
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail?: string;
    customerPhone?: string;
    updatedAt?: string;
}