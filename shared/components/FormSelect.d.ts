import React from 'react';
interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helpText?: string;
    required?: boolean;
    options: SelectOption[];
    placeholder?: string;
}
export declare const FormSelect: React.FC<FormSelectProps>;
export {};
