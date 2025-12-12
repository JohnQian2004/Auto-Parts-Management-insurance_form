import { TripImage } from './TripImage';
import { TripImageModel } from './TripImageModel';
import { TripInclusion } from './TripInclusion';
import { TripExclusion } from './TripExclusion';
import { TripHighlight } from './TripHighlight';
import { TripAvailability } from './TripAvailability';
import { TripItinerary } from './TripItinerary';
import { Category } from './Category';

export enum TripDifficulty {
    EASY = 'EASY',
    MODERATE = 'MODERATE',
    CHALLENGING = 'CHALLENGING'
}

export class Trip {
    id?: number;
    name: string = '';
    destination: string = '';
    duration: string = '';
    basePrice: number = 0;
    mainImage: string = '';
    images: TripImage[] = [];
    imageModels: TripImageModel[] = [];
    categoryId: number = 0;
    categoryName: string = '';
    description: string = '';
    inclusions: TripInclusion[] = [];
    exclusions: TripExclusion[] = [];
    highlights: TripHighlight[] = [];
    difficulty: TripDifficulty = TripDifficulty.EASY;
    groupSizeMin: number = 1;
    groupSizeMax: number = 1;
    maxCapacity: number = 1;
    bestTime: string = '';
    cancellationPolicy: string = '';
    isActive: boolean = true;
    availability: TripAvailability[] = [];
    itinerary: TripItinerary[] = [];
    createdBy?: number;
    createdByUsername: string = '';
    lastModifiedBy?: number;
    lastModifiedByUsername: string = '';
    createdAt?: string;
    lastModifiedAt?: string;
}