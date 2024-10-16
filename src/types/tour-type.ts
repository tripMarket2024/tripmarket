export interface TourType {
    duration: number;
    location: string;
    description: string;
    price: number;
    discount?: number;
    images: string[];
}