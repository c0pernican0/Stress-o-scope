import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'cosmic' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
  const baseStyles = "font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 ease-out transform active:scale-95 relative overflow-hidden group";

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = `
        bg-gradient-to-r from-nebula-purple-600 to-nebula-purple-700 
        text-white shadow-lg shadow-nebula-purple-500/25
        hover:from-nebula-purple-500 hover:to-nebula-purple-600 
        hover:shadow-xl hover:shadow-nebula-purple-500/40 hover:scale-105
        focus:ring-nebula-purple-500
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent 
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
      `;
      break;
    case 'secondary':
      variantStyles = `
        bg-white/10 backdrop-blur-md text-white border border-white/20
        hover:bg-white/20 hover:border-white/30 hover:scale-105
        focus:ring-white/50 shadow-lg
      `;
      break;
    case 'cosmic':
      variantStyles = `
        bg-gradient-to-r from-cosmic-blue-500 via-nebula-purple-500 to-aurora-pink-500 
        text-white shadow-lg shadow-cosmic-blue-500/25
        hover:shadow-2xl hover:shadow-cosmic-blue-500/40 hover:scale-105
        focus:ring-cosmic-blue-400
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent 
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
        animate-pulse-slow
      `;
      break;
    case 'ghost':
      variantStyles = `
        text-white hover:bg-white/10 
        focus:ring-white/30 hover:scale-105
        border border-transparent hover:border-white/20
      `;
      break;
    case 'gradient':
      variantStyles = `
        bg-gradient-to-br from-star-gold-400 via-aurora-pink-500 to-nebula-purple-600
        text-white shadow-lg shadow-star-gold-500/25
        hover:shadow-2xl hover:shadow-star-gold-500/40 hover:scale-105
        focus:ring-star-gold-400
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent 
        before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
      `;
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-4 py-2 text-sm';
      break;
    case 'md':
      sizeStyles = 'px-6 py-3 text-base';
      break;
    case 'lg':
      sizeStyles = 'px-8 py-4 text-lg';
      break;
    case 'xl':
      sizeStyles = 'px-10 py-5 text-xl';
      break;
  }

  const disabledStyles = disabled 
    ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100 hover:shadow-none' 
    : 'cursor-pointer';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
