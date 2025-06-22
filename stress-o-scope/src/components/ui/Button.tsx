import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'cosmic';
  size?: 'sm' | 'md' | 'lg';
  // onClick, disabled, type, className are inherited from ButtonHTMLAttributes
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  const baseStyles = "font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out";

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-nebula-purple text-white hover:bg-opacity-80 focus:ring-nebula-purple';
      break;
    case 'secondary':
      variantStyles = 'bg-gray-200 text-deep-space hover:bg-gray-300 focus:ring-gray-400';
      break;
    case 'cosmic':
      variantStyles = 'bg-gradient-to-r from-nebula-purple to-cosmic-blue text-white hover:shadow-lg hover:shadow-star-gold/30 focus:ring-star-gold transform hover:scale-105';
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-sm';
      break;
    case 'md':
      sizeStyles = 'px-4 py-2 text-base';
      break;
    case 'lg':
      sizeStyles = 'px-6 py-3 text-lg';
      break;
  }

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
