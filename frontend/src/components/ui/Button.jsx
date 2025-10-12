export const Button = ({
    variant = "primary",
    size = "md",
    fullWidth = false,
    icon = null,
    badge = null,
    disabled = false,
    onClick,
    type = "button",
    children,
    ...props
}) => {

    const variants = {
        primary: 'bg-brand-secondary/85 hover:bg-brand-secondary text-white',
        secondary: 'bg-brand-primary/85 hover:bg-brand-primary text-white',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        ghost: 'bg-gray-500 hover:bg-gray-600 text-white',
        link: 'bg-blue-400 hover:bg-blue-600 text-white',
        warning: 'bg-yellow-400 hover:bg-yellow-600 text-white'
    };

    const sizes = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-6 py-2.5',
        lg: 'px-8 py-3 text-lg'
    };

    const baseClasses = 'rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2';

    const widthClass = fullWidth ? 'flex-1 w-full' : '';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass}`}
            {...props}
        >
            {icon && icon}
            {children}
            {badge && (
                <span className="text-[0.60rem] tracking-wide font-bold bg-brand-secondary/85 px-3 py-1 rounded-full shadow-sm">
                    {badge}
                </span>
            )}
        </button>
    );
};