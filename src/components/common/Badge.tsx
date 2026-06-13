interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-[#1E3A5F]/10 text-[#1E3A5F]',
    secondary: 'bg-[#F5A623]/10 text-[#F5A623]',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-orange-100 text-orange-600',
    danger: 'bg-red-100 text-red-600',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
