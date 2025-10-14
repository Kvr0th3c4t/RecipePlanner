import React from 'react';

export const Input = ({
    type = "text",
    variant = "default",
    label = null,
    placeholder = "",
    value = "",
    onChange,
    name = "",
    id = "",
    error = null,
    helperText = null,
    disabled = false,
    fullWidth = false,
    className = "",
    ...props
}) => {
    const variants = {
        default: 'px-3 py-2 text-sm',
        large: 'text-4xl md:text-5xl font-light pt-2 px-2 py-1 leading-tight',
    };

    const baseClasses = `
    border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-brand-primary
    transition-colors duration-200
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
    ${fullWidth ? 'w-full' : ''}
  `;

    const variantClasses = variants[variant] || variants.default;

    return (
        <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''} ${className}`}>
            {label && (
                <label
                    htmlFor={id || name}
                    className="text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}

            <input
                type={type}
                name={name}
                id={id || name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`${baseClasses} ${variantClasses}`}
                {...props}
            />

            {helperText && !error && (
                <span className="text-xs text-gray-500">{helperText}</span>
            )}
            {error && (
                <span className="text-xs text-red-600 font-medium">{error}</span>
            )}
        </div>
    );
};