import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';

/**
 * ContributionHistory component displays a user's contributions to projects
 * with filtering, sorting, and pagination capabilities
 * 
 * @param {Array} contributions - Array of user's contributions
 * @param {boolean} loading - Loading state indicator
 */
const ContributionHistory = ({ contributions = [], loading = false }) => {
  const [filteredContributions, setFilteredContributions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort contributions when criteria changes
  useEffect(() => {
    let result = [...contributions];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(contribution => 
        contribution.project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contribution.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'amount-high':
          return b.amount - a.amount;
        case 'amount-low':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
    
    setFilteredContributions(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [contributions, searchTerm, sortBy]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContributions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContributions.length / itemsPerPage);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProjectStatus = (status) => {
    switch (status) {
      case 'active': return { label: 'Active', className: 'status-active' };
      case 'funded': return { label: 'Funded', className: 'status-funded' };
      case 'completed': return { label: 'Completed', className: 'status-completed' };
      case 'cancelled': return { label: 'Cancelled', className: 'status-cancelled' };
      default: return { label: status, className: '' };
    }
  };

  if (loading) {
    return (
      <Card className="contribution-history contribution-history--loading">
        <div className="contribution-history__loading-indicator">
          Loading contribution history...
        </div>
      </Card>
    );
  }

  const totalContributed = contributions.reduce((sum, contrib) => sum + contrib.amount, 0);

  return (
    <Card className="contribution-history">
      <div className="contribution-history__header">
        <h2 className="contribution-history__title">Contribution History</h2>
        <div className="contribution-history__total">
          Total Contributed: <span>{formatCurrency(totalContributed)}</span>
        </div>
      </div>

      <div className="contribution-history__filters">
        <SearchBar 
          placeholder="Search projects..." 
          onSearch={handleSearch} 
          initialValue={searchTerm}
          className="contribution-history__search"
        />
        
        <div className="contribution-history__filter-controls">
          <div className="contribution-history__filter-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select 
              id="sort-by" 
              value={sortBy} 
              onChange={handleSortChange}
              className="contribution-history__select"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount (High to Low)</option>
              <option value="amount-low">Amount (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredContributions.length === 0 ? (
        <div className="contribution-history__empty">
          <p>No contributions found{searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
          {!searchTerm && !contributions.length && (
            <Link to="/projects" className="contribution-history__empty-cta">
              Discover projects to fund
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="contribution-history__list">
            {currentItems.map(contribution => {
              const projectStatus = getProjectStatus(contribution.project.status);
              
              return (
                <div key={contribution.id} className="contribution-item">
                  <div className="contribution-item__header">
                    <div className="contribution-item__project-info">
                      <h3 className="contribution-item__project-title">
                        <Link to={`/project/${contribution.project.id}`}>
                          {contribution.project.title}
                        </Link>
                      </h3>
                      <span className={`contribution-item__project-status ${projectStatus.className}`}>
                        {projectStatus.label}
                      </span>
                    </div>
                    <div className="contribution-item__date">
                      {formatDate(contribution.date)}
                    </div>
                  </div>
                  
                  <div className="contribution-item__details">
                    <div className="contribution-item__amount">
                      {formatCurrency(contribution.amount)}
                    </div>
                    
                    {contribution.reward && (
                      <div className="contribution-item__reward">
                        <span className="contribution-item__reward-label">Reward:</span>
                        <span className="contribution-item__reward-name">{contribution.reward.title}</span>
                      </div>
                    )}
                    
                    {contribution.status && (
                      <div className="contribution-item__payment-status">
                        Payment: <span className={`contribution-item__payment-badge contribution-item__payment-badge--${contribution.status}`}>
                          {contribution.status}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {contribution.comment && (
                    <div className="contribution-item__comment">
                      <p>"{contribution.comment}"</p>
                    </div>
                  )}
                  
                  <div className="contribution-item__actions">
                    <Link 
                      to={`/project/${contribution.project.id}`} 
                      className="contribution-item__action-btn contribution-item__view-btn"
                    >
                      View Project
                    </Link>
                    
                    {contribution.receiptUrl && (
                      <a 
                        href={contribution.receiptUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contribution-item__action-btn contribution-item__receipt-btn"
                      >
                        View Receipt
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="contribution-history__pagination"
            />
          )}
        </>
      )}
    </Card>
  );
};

ContributionHistory.propTypes = {
  contributions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      project: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired
      }).isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.string,
      comment: PropTypes.string,
      receiptUrl: PropTypes.string,
      reward: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string.isRequired
      })
    })
  ),
  loading: PropTypes.bool
};

export default ContributionHistory;