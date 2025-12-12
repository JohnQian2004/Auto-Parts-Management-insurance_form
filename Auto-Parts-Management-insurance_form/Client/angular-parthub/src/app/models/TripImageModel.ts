export class TripImageModel {
    id?: number;
    fileName: string = '';
    fileSize?: number;
    description: string = '';
    sortOrder: number = 0;
    isActive: boolean = true;
    isMainImage: boolean = false;
    createdAt?: Date;
    updatedAt?: Date;
    tripId?: number;

    constructor(data?: Partial<TripImageModel>) {
        if (data) {
            Object.assign(this, data);
        }
    }

    // Helper method to create a new instance with default values
    static create(data?: Partial<TripImageModel>): TripImageModel {
        return new TripImageModel(data);
    }

    // Helper method to create from backend response
    static fromBackend(data: any): TripImageModel {
        return new TripImageModel({
            id: data.id,
            fileName: data.fileName || '',
            fileSize: data.fileSize,
            description: data.description || '',
            sortOrder: data.sortOrder || 0,
            isActive: data.isActive !== undefined ? data.isActive : true,
            isMainImage: data.isMainImage !== undefined ? data.isMainImage : false,
            createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
            tripId: data.tripId
        });
    }
}
