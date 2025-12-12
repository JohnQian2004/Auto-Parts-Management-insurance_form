export class BookingCompanion {
    id?: number;
    bookingId?: number;
    firstName: string = '';
    lastName: string = '';
    dateOfBirth!: string; // YYYY-MM-DD
    gender: string = '';
    passportNumber: string = '';
    nationality: string = '';
    emergencyContactName: string = '';
    emergencyContactPhone: string = '';
    dietaryRestrictions: string = '';
    medicalConditions: string = '';
    createdAt?: string;
}