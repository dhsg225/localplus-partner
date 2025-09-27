export declare function formatCurrency(amount: number, currency?: string): string;
export declare function formatDate(date: string | Date, format?: 'short' | 'long' | 'time'): string;
export declare function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void;
export declare function generateId(prefix?: string): string;
export declare function isValidEmail(email: string): boolean;
export declare function isValidPhoneNumber(phone: string): boolean;
export declare function formatPhoneNumber(phone: string): string;
export declare function timeAgo(date: string | Date): string;
export declare function truncateText(text: string, maxLength: number): string;
export declare const localStorage: {
    get<T>(key: string, defaultValue: T): T;
    set<T>(key: string, value: T): void;
    remove(key: string): void;
};
export declare const sessionStorage: {
    get<T>(key: string, defaultValue: T): T;
    set<T>(key: string, value: T): void;
    remove(key: string): void;
};
export declare function isApiError(response: any): boolean;
export declare function getErrorMessage(error: any): string;
