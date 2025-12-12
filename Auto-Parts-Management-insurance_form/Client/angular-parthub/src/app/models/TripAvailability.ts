export class TripAvailability {
    id?: number;
    date: string = '';
    availableSpots: number = 0;
    maxCapacity: number = 0;
    price: number = 0;
    isActive: boolean = true;
    createdAt?: string;
    lastModifiedAt?: string;
    tripId?: number;
}