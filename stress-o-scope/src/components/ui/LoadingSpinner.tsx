import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string; // Optional text to display below the spinner
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  text,
}) => {
  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'w-6 h-6 border-2';
      break;
    case 'md':
      sizeClasses = 'w-10 h-10 border-4';
      break;
    case 'lg':
      sizeClasses = 'w-16 h-16 border-[6px]';
      break;
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-solid border-star-gold border-t-transparent ${sizeClasses}`}
        role="status"
        aria-live="polite"
        aria-label={text ? undefined : "Loading"} // Only set aria-label if no text is provided
      >
        <span className="sr-only">{text ? text : "Loading..."}</span>
      </div>
      {text && <p className="mt-3 text-sm text-gray-300">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
