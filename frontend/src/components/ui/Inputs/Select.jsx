import React from 'react';

export const Select = ({
    label = null,
    value = "",
    onChange,
    name = "",
    id = "",
    options = [],
    placeholder = "Selecciona...",
    error = null,
    disabled = false,
    fullWidth = false,
    className = "",
    ...props
}) => {
    const baseClasses = `
    px-3 py-2 text-sm
    border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-brand-primary
    transition-colors duration-200
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
    ${fullWidth ? 'w-full' : ''}
  `;

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

            <select
                name={name}
                id={id || name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={baseClasses}
                {...props}
            >
                {placeholder && (
                    <option value="">{placeholder}</option>
                )}
                {options.map((option, index) => (
                    <option
                        key={option.value || index}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <span className="text-xs text-red-600 font-medium">{error}</span>
            )}
        </div>
    );
};