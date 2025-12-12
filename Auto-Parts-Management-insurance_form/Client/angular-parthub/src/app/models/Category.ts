export class Category {
    id?: number;
    name: string = '';
    description: string = '';
    imageUrl: string = '';
    isActive: boolean = true;
    createdByUsername?: string;
    lastModifiedByUsername?: string;
    createdAt?: string;
    lastModifiedAt?: string;
}