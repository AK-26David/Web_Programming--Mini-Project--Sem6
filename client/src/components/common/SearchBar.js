import PropTypes from 'prop-types';
import React, { useState } from 'react';

const SearchBar = ({
  onSearch,
  placeholder = 'Search...',
  initialValue = '',
  debounceTime = 300,
  showSearchButton = true,
  size = 'medium',
  className = '',
  fullWidth = false,
  clearable = true,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (debounceTime > 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      const newTimeoutId = setTimeout(() => {
        onSearch(value);
      }, debounceTime);
      
      setTimeoutId(newTimeoutId);
    } else {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    onSearch(searchTerm);
  };
  
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };
  
  const sizeClasses = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-5 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <form 
      onSubmit={handleSubmit}
      className={`flex items-center ${widthClass} ${className}`}
    >
      <div className={`relative flex-1 ${widthClass}`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        <input
          type="search"
          value={searchTerm}
          onChange={handleInputChange}
          className={`
            ${sizeClasses[size]}
            pl-10 ${clearable ? 'pr-10' : 'pr-4'}
            w-full border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          `}
          placeholder={placeholder}
        />
        
        {clearable && searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
      
      {showSearchButton && (
        <button
          type="submit"
          className={`
            ml-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${sizeClasses[size]}
          `}
        >
          Search
        </button>
      )}
    </form>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
  debounceTime: PropTypes.number,
  showSearchButton: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  clearable: PropTypes.bool,
};

export default SearchBar;