import PropTypes from 'prop-types';
import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  image,
  imageAlt,
  footer,
  onClick,
  className = '',
  elevation = 'medium',
  hoverEffect = false,
  bordered = false,
  imagePosition = 'top',
}) => {
  const elevationStyles = {
    none: '',
    low: 'shadow-sm',
    medium: 'shadow',
    high: 'shadow-lg',
  };

  const borderStyles = bordered ? 'border border-gray-200' : '';
  const hoverStyles = hoverEffect ? 'transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg' : '';
  const cursorStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`
        bg-white rounded-lg overflow-hidden
        ${elevationStyles[elevation]}
        ${borderStyles}
        ${hoverStyles}
        ${cursorStyles}
        ${className}
      `}
      onClick={onClick}
    >
      {image && imagePosition === 'top' && (
        <div className="w-full">
          <img 
            src={image}
            alt={imageAlt || 'Card image'}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      {(title || subtitle) && (
        <div className="px-4 pt-4">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {subtitle && <h4 className="text-sm text-gray-600 mb-2">{subtitle}</h4>}
        </div>
      )}
      
      <div className="p-4 pt-2">
        {children}
      </div>
      
      {image && imagePosition === 'bottom' && (
        <div className="w-full">
          <img 
            src={image}
            alt={imageAlt || 'Card image'}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  footer: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  elevation: PropTypes.oneOf(['none', 'low', 'medium', 'high']),
  hoverEffect: PropTypes.bool,
  bordered: PropTypes.bool,
  imagePosition: PropTypes.oneOf(['top', 'bottom']),
};

export default Card;