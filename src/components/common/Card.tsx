import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', style, hover = false, onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${
        hover ? 'hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''
      } ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl ${className}`}>
      {children}
    </div>
  );
}
