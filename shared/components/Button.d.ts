import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    rounded?: 'normal' | 'full';
    theme?: 'blue' | 'red' | 'gray';
}
export declare const Button: React.FC<ButtonProps>;
export {};
