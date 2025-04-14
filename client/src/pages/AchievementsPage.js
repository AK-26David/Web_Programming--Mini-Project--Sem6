import React, { useEffect, useState } from 'react';
import AchievementList from '../components/achievements/AchievementList';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import Layout from '../components/layout/Layout';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: 'all',
    timeFrame: 'all'
  });
  const [statistics, setStatistics] = useState({
    totalRaised: 0,
    successfulProjects: 0,
    totalBackers: 0,
    averageFunding: 0
  });

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        // This would be actual API calls in a real application
        const achievementsResponse = await fetch(
          `/api/achievements?page=${currentPage}&category=${filters.category}&timeFrame=${filters.timeFrame}&search=${searchQuery}`
        );
        const achievementsData = await achievementsResponse.json();
        
        const statsResponse = await fetch('/api/achievements/stats');
        const statsData = await statsResponse.json();
        
        setAchievements(achievementsData.achievements);
        setTotalPages(achievementsData.totalPages);
        setStatistics(statsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching achievements data:', error);
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [currentPage, filters, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  return (
    <Layout>
      <div className="achievements-page">
        <div className="page-header">
          <h1>Platform Achievements</h1>
          <p>Celebrating our community's successes and milestones</p>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <h3>${statistics.totalRaised.toLocaleString()}</h3>
            <p>Total Funds Raised</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.successfulProjects.toLocaleString()}</h3>
            <p>Successfully Funded Projects</p>
          </div>
          <div className="stat-card">
            <h3>{statistics.totalBackers.toLocaleString()}</h3>
            <p>Backers Worldwide</p>
          </div>
          <div className="stat-card">
            <h3>${statistics.averageFunding.toLocaleString()}</h3>
            <p>Average Project Funding</p>
          </div>
        </div>

        <div className="search-section">
          <SearchBar 
            placeholder="Search achievements..." 
            onSearch={handleSearch} 
            initialValue={searchQuery}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="funding">Funding Milestones</option>
              <option value="innovation">Innovation Awards</option>
              <option value="community">Community Impact</option>
              <option value="global">Global Recognition</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Time Frame:</label>
            <select 
              value={filters.timeFrame} 
              onChange={(e) => handleFilterChange('timeFrame', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading achievements...</p>
          </div>
        ) : achievements.length === 0 ? (
          <div className="no-results">
            <h3>No achievements found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <AchievementList achievements={achievements} />
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages}
              onPageChange={handlePageChange} 
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default AchievementsPage;