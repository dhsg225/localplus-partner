export interface Business {
    id: string;
    name: string;
    partnership_status: 'pending' | 'active' | 'suspended';
    category?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
}
export declare const businessService: {
    getBusinessesForSignup(): Promise<Business[]>;
    getBusinessesForUser(): Promise<Business[]>;
    getActiveBusinesses(): Promise<Business[]>;
    linkUserToBusiness(userId: string, businessId: string, role?: string): Promise<boolean>;
};
