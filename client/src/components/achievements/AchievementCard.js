import PropTypes from 'prop-types';
import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import Card from '../common/Card';

/**
 * AchievementCard component displays a single achievement with its details
 * 
 * @param {Object} achievement - The achievement object containing title, description, date, etc.
 * @param {string} className - Optional additional CSS classes
 */
const AchievementCard = ({ achievement, className = '' }) => {
  const {
    id,
    title,
    description,
    iconUrl,
    dateEarned,
    category,
    points,
    isLocked = false
  } = achievement;

  return (
    <Card className={`achievement-card ${isLocked ? 'achievement-locked' : ''} ${className}`}>
      <div className="achievement-card__container">
        <div className="achievement-card__icon-container">
          {iconUrl ? (
            <img 
              src={iconUrl} 
              alt={`${title} icon`} 
              className={`achievement-card__icon ${isLocked ? 'achievement-card__icon--locked' : ''}`}
            />
          ) : (
            <div className="achievement-card__icon-placeholder">
              {isLocked ? '🔒' : '🏆'}
            </div>
          )}
        </div>
        
        <div className="achievement-card__content">
          <h3 className="achievement-card__title">
            {title}
            {points > 0 && <span className="achievement-card__points">{points} pts</span>}
          </h3>
          
          <p className="achievement-card__description">
            {isLocked ? 'Complete the required actions to unlock this achievement' : description}
          </p>
          
          {category && (
            <span className="achievement-card__category">{category}</span>
          )}
          
          {dateEarned && !isLocked && (
            <div className="achievement-card__date">
              Earned on: {formatDate(dateEarned)}
            </div>
          )}
          
          {isLocked && (
            <div className="achievement-card__locked-message">
              Locked
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

AchievementCard.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    iconUrl: PropTypes.string,
    dateEarned: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    category: PropTypes.string,
    points: PropTypes.number,
    isLocked: PropTypes.bool
  }).isRequired,
  className: PropTypes.string
};

export default AchievementCard;