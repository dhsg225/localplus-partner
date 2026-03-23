import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helpText,
  required,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const inputId = props.id || `input-${Math.random().toString(36).substring(2, 9)}`
  
  const inputClasses = `
    block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500
    ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `.trim()

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
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