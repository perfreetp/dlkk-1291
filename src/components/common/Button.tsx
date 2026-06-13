import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-[#1E3A5F] text-white hover:bg-[#2D5A87] focus:ring-[#1E3A5F] shadow-sm',
      secondary: 'bg-[#F5A623] text-white hover:bg-[#E09000] focus:ring-[#F5A623] shadow-sm',
      outline: 'border-2 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F]/5 focus:ring-[#1E3A5F]',
      ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200',
      danger: 'bg-[#E53E3E] text-white hover:bg-[#C53030] focus:ring-[#E53E3E]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
