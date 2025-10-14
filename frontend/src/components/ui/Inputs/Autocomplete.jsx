import React from 'react';

export const Autocomplete = ({
    placeholder = "Buscar...",
    value = "",
    onChange,
    name = "",
    id = "",
    suggestions = [],
    showSuggestions = false,
    onSuggestionClick,
    renderSuggestion = null,
    disabled = false,
    fullWidth = true,
    className = "",
    ...props
}) => {
    const baseClasses = `
    px-3 py-2 text-sm
    border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-brand-primary
    transition-colors duration-200
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
    ${fullWidth ? 'w-full' : ''}
  `;

    return (
        <div className={`relative ${fullWidth ? 'flex-1' : ''} ${className}`}>
            <input
                type="text"
                name={name}
                id={id || name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={baseClasses}
                {...props}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion.id || suggestion.value || index}
                            onClick={() => onSuggestionClick?.(suggestion)}
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                            {renderSuggestion
                                ? renderSuggestion(suggestion)
                                : suggestion.label || suggestion.name || suggestion
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};