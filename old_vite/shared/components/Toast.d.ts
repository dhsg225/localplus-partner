import React from 'react';
interface ToastContextType {
    showToast: (msg: string, type?: 'success' | 'error') => void;
}
export declare const useToast: () => ToastContextType;
export declare const ToastProvider: React.FC<{
    children: React.ReactNode;
}>;
export {};
