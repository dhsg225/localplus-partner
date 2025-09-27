import React from 'react';
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
    required?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}
export declare const FormInput: React.FC<FormInputProps>;
export {};
