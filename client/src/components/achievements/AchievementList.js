import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import AchievementCard from './AchievementCard';

/**
 * AchievementList component displays a filterable and paginated list of achievements
 * 
 * @param {Array} achievements - List of achievement objects
 * @param {boolean} loading - Loading state indicator
 * @param {boolean} showFilters - Whether to show filtering options
 * @param {string} className - Optional additional CSS classes
 */
const AchievementList = ({ 
  achievements = [], 
  loading = false, 
  showFilters = true,
  className = ''
}) => {
  // State for filtering and pagination
  const [filteredAchievements, setFilteredAchievements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'locked', 'unlocked' 
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'oldest', 'points'
  const [currentPage, setCurrentPage] = useState(1);
  const achievementsPerPage = 12;

  // Filter and sort achievements when any filtering criteria changes
  useEffect(() => {
    let result = [...achievements];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(achievement => 
        achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (achievement.category && achievement.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply locked/unlocked filter
    if (filter === 'locked') {
      result = result.filter(achievement => achievement.isLocked);
    } else if (filter === 'unlocked') {
      result = result.filter(achievement => !achievement.isLocked);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        // For locked achievements, put them last
        if (a.isLocked !== b.isLocked) return a.isLocked ? 1 : -1;
        // For unlocked achievements, sort by date earned (recent first)
        if (!a.isLocked && !b.isLocked) {
          return new Date(b.dateEarned) - new Date(a.dateEarned);
        }
        return 0;
      } else if (sortBy === 'oldest') {
        // For locked achievements, put them last
        if (a.isLocked !== b.isLocked) return a.isLocked ? 1 : -1;
        // For unlocked achievements, sort by date earned (oldest first)
        if (!a.isLocked && !b.isLocked) {
          return new Date(a.dateEarned) - new Date(b.dateEarned);
        }
        return 0;
      } else if (sortBy === 'points') {
        // Sort by points (highest first)
        return (b.points || 0) - (a.points || 0);
      }
      return 0;
    });
    
    setFilteredAchievements(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [achievements, searchTerm, filter, sortBy]);

  // Calculate pagination
  const indexOfLastAchievement = currentPage * achievementsPerPage;
  const indexOfFirstAchievement = indexOfLastAchievement - achievementsPerPage;
  const currentAchievements = filteredAchievements.slice(
    indexOfFirstAchievement, 
    indexOfLastAchievement
  );
  
  const totalPages = Math.ceil(filteredAchievements.length / achievementsPerPage);

  // Handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="achievement-list__loading">Loading achievements...</div>;
  }

  return (
    <div className={`achievement-list ${className}`}>
      {showFilters && (
        <div className="achievement-list__filters">
          <SearchBar 
            placeholder="Search achievements..." 
            onSearch={handleSearch} 
            initialValue={searchTerm}
          />
          
          <div className="achievement-list__filter-controls">
            <div className="achievement-list__filter-group">
              <label htmlFor="achievement-filter">Show:</label>
              <select 
                id="achievement-filter" 
                value={filter} 
                onChange={handleFilterChange}
                className="achievement-list__select"
              >
                <option value="all">All Achievements</option>
                <option value="unlocked">Unlocked Only</option>
                <option value="locked">Locked Only</option>
              </select>
            </div>
            
            <div className="achievement-list__filter-group">
              <label htmlFor="achievement-sort">Sort by:</label>
              <select 
                id="achievement-sort" 
                value={sortBy} 
                onChange={handleSortChange}
                className="achievement-list__select"
              >
                <option value="recent">Recently Earned</option>
                <option value="oldest">Oldest First</option>
                <option value="points">Points (High to Low)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {filteredAchievements.length === 0 ? (
        <div className="achievement-list__empty">
          <p>No achievements found{searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
        </div>
      ) : (
        <>
          <div className="achievement-list__grid">
            {currentAchievements.map(achievement => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement}
                className="achievement-list__item"
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="achievement-list__pagination"
            />
          )}
        </>
      )}
    </div>
  );
};

AchievementList.propTypes = {
  achievements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      iconUrl: PropTypes.string,
      dateEarned: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      category: PropTypes.string,
      points: PropTypes.number,
      isLocked: PropTypes.bool
    })
  ),
  loading: PropTypes.bool,
  showFilters: PropTypes.bool,
  className: PropTypes.string
};

export default AchievementList;