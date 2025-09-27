export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export interface Business {
    id: string;
    google_place_id?: string;
    name: string;
    category: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string;
    email?: string;
    website_url?: string;
    partnership_status: 'pending' | 'active' | 'suspended';
    created_at: string;
    updated_at: string;
}
export interface DiscountOffer {
    id: string;
    business_id: string;
    discount_percentage: number;
    description: string;
    terms_conditions?: string;
    valid_from: string;
    valid_until?: string;
    max_redemptions_per_user: number;
    total_redemption_limit?: number;
    is_active: boolean;
    created_at: string;
}
export interface UserRedemption {
    id: string;
    user_id: string;
    business_id: string;
    discount_offer_id: string;
    redemption_code: string;
    redeemed_at: string;
    amount_saved: number;
    verification_status: 'pending' | 'verified' | 'disputed';
}
export declare function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
export declare const businessAPI: {
    getAllBusinesses(): Promise<Business[]>;
    getBusinessesNearby(lat: number, lng: number, radiusKm: number): Promise<any[]>;
    addBusiness(businessData: Omit<Business, "id" | "created_at" | "updated_at">): Promise<any>;
    addDiscountOffer(offerData: Omit<DiscountOffer, "id" | "created_at">): Promise<any>;
    recordRedemption(redemptionData: Omit<UserRedemption, "id">): Promise<any>;
    canUserRedeem(userId: string, businessId: string, discountOfferId: string): Promise<boolean>;
};
