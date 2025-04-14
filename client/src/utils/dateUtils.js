/**
 * Format a date string or object into a readable format
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
  
    if (!date) return '';
  
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided to formatDate:', date);
      return '';
    }
  
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
  };
  
  /**
   * Calculate and return a human-readable relative time (e.g., "2 hours ago")
   * @param {Date|string} date - Date to compare against current time
   * @returns {string} Human-readable time difference
   */
  export const getRelativeTime = (date) => {
    if (!date) return '';
  
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided to getRelativeTime:', date);
      return '';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    // For dates older than a week, use the formatDate function
    return formatDate(dateObj);
  };
  
  /**
   * Format date in MM/DD/YYYY format
   * @param {Date|string} date - Date to format
   * @returns {string} Date in MM/DD/YYYY format
   */
  export const formatShortDate = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided to formatShortDate:', date);
      return '';
    }
    
    return formatDate(dateObj, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  
  /**
   * Calculate days remaining between a date and now
   * @param {Date|string} endDate - Target date to compare with today
   * @returns {number} Days remaining (negative if in past)
   */
  export const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;
    
    const endDateObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    if (isNaN(endDateObj.getTime())) {
      console.error('Invalid date provided to getDaysRemaining:', endDate);
      return 0;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const end = new Date(endDateObj);
    end.setHours(0, 0, 0, 0);
    
    const diffInTime = end.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
    
    return diffInDays;
  };