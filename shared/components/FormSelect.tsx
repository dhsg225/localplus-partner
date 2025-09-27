import React from 'react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  options: SelectOption[]
  placeholder?: string
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  helpText,
  required,
  options,
  placeholder,
  className = '',
  ...props
}) => {
  const selectId = props.id || `select-${Math.random().toString(36).substring(2, 9)}`
  
  const selectClasses = `
    block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    disabled:bg-gray-50 disabled:text-gray-500
    ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
    ${className}
  `.trim()

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  )
} 