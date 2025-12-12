export class TripImage {
    id?: number;
    imageUrl: string = '';
    sortOrder: number = 0;
    isActive: boolean = true;
    createdAt?: string;
    lastModifiedAt?: string;
    tripId?: number;
}