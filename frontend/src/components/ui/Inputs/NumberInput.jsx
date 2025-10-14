import React from 'react';

export const NumberInput = ({
    label = null,
    placeholder = "",
    value = "",
    onChange,
    name = "",
    id = "",
    error = null,
    disabled = false,
    min = null,
    max = null,
    step = 1,
    centered = true,
    className = "",
    ...props
}) => {
    const baseClasses = `
    w-20 px-2 py-2 text-sm
    border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-brand-primary
    transition-colors duration-200
    ${centered ? 'text-center' : ''}
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
  `;

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label
                    htmlFor={id || name}
                    className="text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}

            <input
                type="number"
                name={name}
                id={id || name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                className={baseClasses}
                {...props}
            />

            {error && (
                <span className="text-xs text-red-600 font-medium">{error}</span>
            )}
        </div>
    );
};