import PropTypes from 'prop-types';
import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  className = '',
  variant = 'default', // 'default', 'simple', 'rounded'
  size = 'medium', // 'small', 'medium', 'large'
}) => {
  // Avoid invalid page configurations
  if (currentPage < 1 || totalPages < 1 || currentPage > totalPages) {
    return null;
  }

  // Generate page numbers to show
  const generatePageNumbers = () => {
    const pageNumbers = [];
    
    // Calculate range to display
    const totalPageNumbersToShow = siblingCount * 2 + 1;
    
    if (totalPages <= totalPageNumbersToShow) {
      // If we have less pages than we want to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Start and end of range
      let startPage = Math.max(1, currentPage - siblingCount);
      let endPage = Math.min(totalPages, currentPage + siblingCount);
      
      // Adjust when near boundaries
      if (currentPage <= siblingCount) {
        // Near start
        endPage = totalPageNumbersToShow;
      } else if (currentPage >= totalPages - siblingCount) {
        // Near end
        startPage = totalPages - totalPageNumbersToShow + 1;
      }
      
      // Add ellipsis and boundary pages
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }
      
      // Add range of pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis and last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };
  
  // Style configuration
  const variantStyles = {
    default: {
      base: 'relative inline-flex items-center justify-center border',
      active: 'bg-blue-600 text-white border-blue-600',
      inactive: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
    },
    simple: {
      base: 'relative inline-flex items-center justify-center',
      active: 'font-semibold text-blue-600',
      inactive: 'text-gray-600 hover:text-gray-900',
    },
    rounded: {
      base: 'relative inline-flex items-center justify-center rounded-full border',
      active: 'bg-blue-600 text-white border-blue-600',
      inactive: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
    },
  };
  
  const sizeStyles = {
    small: 'h-7 w-7 text-xs',
    medium: 'h-9 w-9 text-sm',
    large: 'h-11 w-11 text-base',
  };
  
  const currentVariant = variantStyles[variant] || variantStyles.default;
  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <nav className="inline-flex items-center space-x-1" aria-label="Pagination">
        {/* First Page Button */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`
              ${currentVariant.base} 
              ${currentSize}
              ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : currentVariant.inactive}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
            aria-label="First Page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M9.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {/* Previous Button */}
        {showPrevNext && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              ${currentVariant.base} 
              ${currentSize}
              ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : currentVariant.inactive}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
            aria-label="Previous Page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {/* Page Numbers */}
        {pageNumbers.map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => pageNumber !== '...' ? handlePageChange(pageNumber) : null}
            disabled={pageNumber === '...'}
            className={`
              ${currentVariant.base} 
              ${currentSize}
              ${pageNumber === currentPage ? currentVariant.active : currentVariant.inactive}
              ${pageNumber === '...' ? 'cursor-default' : ''}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
            aria-current={pageNumber === currentPage ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        ))}
        
        {/* Next Button */}
        {showPrevNext && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              ${currentVariant.base} 
              ${currentSize}
              ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : currentVariant.inactive}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
            aria-label="Next Page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {/* Last Page Button */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`
              ${currentVariant.base} 
              ${currentSize}
              ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : currentVariant.inactive}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
            aria-label="Last Page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </nav>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
  showFirstLast: PropTypes.bool,
  showPrevNext: PropTypes.bool,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'simple', 'rounded']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default Pagination;