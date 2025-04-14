import React, { useEffect, useState } from 'react';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import Button from '../common/Button';
import SearchBar from '../common/SearchBar';

const ProjectFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    sortBy: initialFilters.sortBy || 'newest',
    fundingStatus: initialFilters.fundingStatus || '',
    timeFrame: initialFilters.timeFrame || '',
    search: initialFilters.search || '',
    minFunding: initialFilters.minFunding || '',
    maxFunding: initialFilters.maxFunding || '',
  });

  const [activeFilterCount, setActiveFilterCount] = useState(0);

  useEffect(() => {
    // Calculate the number of active filters (excluding search)
    const count = Object.entries(filters).reduce((count, [key, value]) => {
      if (key !== 'search' && value !== '') {
        return count + 1;
      }
      return count;
    }, 0);
    
    setActiveFilterCount(count);
  }, [filters]);

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const handleClearFilters = () => {
    const resetFilters = {
      category: '',
      sortBy: 'newest',
      fundingStatus: '',
      timeFrame: '',
      search: filters.search, // Preserve search term
      minFunding: '',
      maxFunding: '',
    };
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <span className="font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button 
          onClick={toggleExpand}
          className="text-gray-500 hover:text-gray-700"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Hide filters" : "Show filters"}
        >
          {isExpanded ? <FaTimes size={16} /> : <FaFilter size={16} />}
        </button>
      </div>

      {/* Filter Content - Always visible on desktop, toggleable on mobile */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block p-4 border-t md:border-t-0`}>
        <div className="mb-4">
          <SearchBar 
            value={filters.search}
            onChange={handleSearchChange}
            onSearch={handleApplyFilters}
            placeholder="Search projects"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Category Filter */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="art">Art</option>
              <option value="design">Design</option>
              <option value="film">Film & Video</option>
              <option value="games">Games</option>
              <option value="music">Music</option>
              <option value="publishing">Publishing</option>
              <option value="food">Food</option>
              <option value="fashion">Fashion</option>
              <option value="community">Community</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium" htmlFor="sortBy">
              Sort By
            </label>
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="newest">Newest First</option>
              <option value="trending">Trending</option>
              <option value="mostFunded">Most Funded</option>
              <option value="endingSoon">Ending Soon</option>
              <option value="mostBackers">Most Backers</option>
            </select>
          </div>

          {/* Funding Status Filter */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium" htmlFor="fundingStatus">
              Funding Status
            </label>
            <select
              id="fundingStatus"
              name="fundingStatus"
              value={filters.fundingStatus}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Projects</option>
              <option value="active">Active Projects</option>
              <option value="funded">Fully Funded</option>
              <option value="almostFunded">Almost Funded (more than 75%)</option>
              <option value="needsHelp">Needs Help (less than 25%)</option>
              <option value="completed">Completed Projects</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Time Frame Filter */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium" htmlFor="timeFrame">
              Time Frame
            </label>
            <select
              id="timeFrame"
              name="timeFrame"
              value={filters.timeFrame}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Any Time</option>
              <option value="endingSoon">Ending Soon (less than 3 days)</option>
              <option value="endingWeek">Ending This Week</option>
              <option value="endingMonth">Ending This Month</option>
              <option value="justLaunched">Just Launched (less than 3 days)</option>
              <option value="launched7days">Launched Last 7 Days</option>
              <option value="launched30days">Launched Last 30 Days</option>
            </select>
          </div>

          {/* Funding Range Filters */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium" htmlFor="minFunding">
              Min Funding Goal ($)
            </label>
            <input
              type="number"
              id="minFunding"
              name="minFunding"
              value={filters.minFunding}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Min amount"
              min="0"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium" htmlFor="maxFunding">
              Max Funding Goal ($)
            </label>
            <input
              type="number"
              id="maxFunding"
              name="maxFunding"
              value={filters.maxFunding}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Max amount"
              min="0"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
          <button
            onClick={handleClearFilters}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-1"
          >
            <FaTimes size={12} />
            Clear filters
          </button>
          <Button 
            onClick={handleApplyFilters} 
            variant="primary"
            className="w-full sm:w-auto"
          >
            <FaSearch className="mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;