export class TripActivity {
    id?: number;
    time: string = '';
    description: string = '';
    sortOrder: number = 0;
    isActive: boolean = true;
    createdAt?: string;
    lastModifiedAt?: string;
    tripId?: number;
    itineraryId?: number;
}