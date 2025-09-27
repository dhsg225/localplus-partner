import type { Restaurant } from '../types';
export declare const restaurantService: {
    getRestaurants(): Promise<Restaurant[]>;
    getRestaurantsByLocation(location: string): Promise<Restaurant[]>;
    getRestaurantById(id: string): Promise<Restaurant | null>;
    createRestaurant(restaurant: Omit<Restaurant, "id" | "created_at" | "updated_at">): Promise<Restaurant>;
    updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant>;
    getRestaurantsByOwner(userId: string): Promise<Restaurant[]>;
    getRestaurantsByCuisine(cuisines: string[]): Promise<Restaurant[]>;
};
