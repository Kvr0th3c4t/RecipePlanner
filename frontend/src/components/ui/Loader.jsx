import React from 'react'

export const Loader = ({
    variant = "fullscreen",
    size = "md",
    text = "Cargando...",
    subtitle = "Cocinando tu página..."
}) => {

    const spinnerSizes = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    };

    const containerVariants = {
        fullscreen: 'flex justify-center items-center h-full',
        inline: 'flex justify-center items-center py-8',
        overlay: 'fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm z-50'
    };

    return (
        <div className={containerVariants[variant]}>
            <div className="text-center">
                <div className={`${spinnerSizes[size]} border-4 border-dashed rounded-full animate-spin border-brand-primary mx-auto`}></div>
                <h2 className="text-gray-900 mt-4 font-medium">{text}</h2>
                {subtitle && (
                    <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );
}