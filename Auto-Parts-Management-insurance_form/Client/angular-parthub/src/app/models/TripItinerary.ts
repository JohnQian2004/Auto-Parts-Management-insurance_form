import { TripActivity } from './TripActivity';
import { TripMeal } from './TripMeal';

export class TripItinerary {
    id?: number;
    dayNumber: number = 1;
    title: string = '';
    description: string = '';
    accommodation: string = '';
    sortOrder: number = 0;
    isActive: boolean = true;
    createdAt?: string;
    lastModifiedAt?: string;
    activities: TripActivity[] = [];
    meals: TripMeal[] = [];
    tripId?: number;
}