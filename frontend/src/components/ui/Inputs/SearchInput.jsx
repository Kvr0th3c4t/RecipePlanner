import React from 'react';

export const SearchInput = ({
    placeholder = "Buscar...",
    value = "",
    onChange,
    name = "",
    id = "",
    disabled = false,
    fullWidth = true,
    className = "",
    ...props
}) => {
    const baseClasses = `
    px-3 py-2 text-sm
    border border-gray-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-brand-primary
    transition-colors duration-200
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
    ${fullWidth ? 'flex-1 w-full' : ''}
  `;

    return (
        <input
            type="text"
            name={name}
            id={id || name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`${baseClasses} ${className}`}
            {...props}
        />
    );
};