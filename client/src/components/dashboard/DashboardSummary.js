import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';

/**
 * DashboardSummary component displays an overview of the user's platform activity
 * including stats about their projects, contributions, and achievements
 * 
 * @param {Object} userData - User data containing stats and information
 * @param {boolean} loading - Loading state indicator
 * @param {Function} onRefresh - Function to trigger data refresh
 */
const DashboardSummary = ({ userData, loading = false, onRefresh }) => {
  const [metrics, setMetrics] = useState({
    projectsCreated: 0,
    projectsFunded: 0,
    totalContributed: 0,
    totalRaised: 0,
    achievements: 0,
    completedAchievements: 0,
    totalFollowers: 0,
    totalFollowing: 0
  });

  // Update metrics when userData changes
  useEffect(() => {
    if (userData) {
      setMetrics({
        projectsCreated: userData.projects?.length || 0,
        projectsFunded: userData.contributions?.length || 0,
        totalContributed: userData.contributions?.reduce((sum, contrib) => sum + contrib.amount, 0) || 0,
        totalRaised: userData.projects?.reduce((sum, project) => sum + project.currentFunding, 0) || 0,
        achievements: userData.achievements?.length || 0,
        completedAchievements: userData.achievements?.filter(a => !a.isLocked).length || 0,
        totalFollowers: userData.followers?.length || 0,
        totalFollowing: userData.following?.length || 0
      });
    }
  }, [userData]);

  const renderMetricCard = (title, value, icon, subtitle = null) => (
    <div className="dashboard-metric-card">
      <div className="dashboard-metric-icon">{icon}</div>
      <div className="dashboard-metric-content">
        <div className="dashboard-metric-value">{value}</div>
        <div className="dashboard-metric-title">{title}</div>
        {subtitle && <div className="dashboard-metric-subtitle">{subtitle}</div>}
      </div>
    </div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className="dashboard-summary dashboard-summary--loading">
        <div className="dashboard-summary__loading-indicator">
          Loading dashboard data...
        </div>
      </Card>
    );
  }

  return (
    <Card className="dashboard-summary">
      <div className="dashboard-summary__header">
        <h2 className="dashboard-summary__title">Dashboard Summary</h2>
        {onRefresh && (
          <button 
            className="dashboard-summary__refresh-btn" 
            onClick={onRefresh}
            aria-label="Refresh dashboard data"
          >
            ↻ Refresh
          </button>
        )}
      </div>

      <div className="dashboard-summary__metrics-grid">
        {renderMetricCard(
          "Projects Created", 
          metrics.projectsCreated, 
          "📊"
        )}
        
        {renderMetricCard(
          "Projects Funded", 
          metrics.projectsFunded, 
          "💸"
        )}
        
        {renderMetricCard(
          "Total Contributed", 
          formatCurrency(metrics.totalContributed), 
          "💰"
        )}
        
        {renderMetricCard(
          "Total Raised", 
          formatCurrency(metrics.totalRaised), 
          "💵"
        )}
      </div>

      <div className="dashboard-summary__achievements">
        <h3 className="dashboard-summary__section-title">Achievements Progress</h3>
        <ProgressBar 
          value={metrics.completedAchievements} 
          max={metrics.achievements}
          label={`${metrics.completedAchievements}/${metrics.achievements} Unlocked`}
        />
      </div>

      <div className="dashboard-summary__community">
        <h3 className="dashboard-summary__section-title">Community</h3>
        <div className="dashboard-summary__community-stats">
          {renderMetricCard(
            "Followers", 
            metrics.totalFollowers, 
            "👥"
          )}
          
          {renderMetricCard(
            "Following", 
            metrics.totalFollowing, 
            "👤"
          )}
        </div>
      </div>

      {userData?.recentActivity && userData.recentActivity.length > 0 && (
        <div className="dashboard-summary__recent-activity">
          <h3 className="dashboard-summary__section-title">Recent Activity</h3>
          <ul className="dashboard-summary__activity-list">
            {userData.recentActivity.slice(0, 5).map((activity, index) => (
              <li key={index} className="dashboard-summary__activity-item">
                <span className="dashboard-summary__activity-icon">
                  {activity.type === 'contribution' ? '💰' : 
                   activity.type === 'comment' ? '💬' : 
                   activity.type === 'project' ? '🚀' : 
                   activity.type === 'achievement' ? '🏆' : '📝'}
                </span>
                <span className="dashboard-summary__activity-text">
                  {activity.description}
                </span>
                <span className="dashboard-summary__activity-time">
                  {activity.timeAgo}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

DashboardSummary.propTypes = {
  userData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    projects: PropTypes.array,
    contributions: PropTypes.array,
    achievements: PropTypes.array,
    followers: PropTypes.array,
    following: PropTypes.array,
    recentActivity: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        timeAgo: PropTypes.string.isRequired
      })
    )
  }),
  loading: PropTypes.bool,
  onRefresh: PropTypes.func
};

export default DashboardSummary;