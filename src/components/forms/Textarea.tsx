import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={4}
          className={`w-full px-4 py-2.5 rounded-lg border resize-none ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-200 focus:border-[#1E3A5F] focus:ring-[#1E3A5F]'
          } focus:ring-2 focus:ring-opacity-20 transition-colors text-gray-900 placeholder-gray-400 ${
            props.disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
