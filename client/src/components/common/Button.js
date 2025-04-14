import PropTypes from 'prop-types';
import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
  icon,
  iconPosition = 'left',
  isLoading = false,
  ...props
}) => {
  const baseStyles = "font-medium rounded focus:outline-none transition-colors";
  
  const typeStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",
    link: "bg-transparent text-blue-600 hover:underline p-0",
  };
  
  const sizeStyles = {
    small: "py-1 px-3 text-sm",
    medium: "py-2 px-4 text-base",
    large: "py-3 px-6 text-lg",
  };
  
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const widthStyles = fullWidth ? "w-full" : "";
  
  const buttonStyles = `
    ${baseStyles} 
    ${typeStyles[type] || typeStyles.primary} 
    ${sizeStyles[size] || sizeStyles.medium} 
    ${disabledStyles} 
    ${widthStyles} 
    ${className}
  `;

  return (
    <button
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-white"></div>
          Loading...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </div>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'outline', 'link']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  isLoading: PropTypes.bool,
};

export default Button;