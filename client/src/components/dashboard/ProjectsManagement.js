import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Modal from '../common/Modal';
import ProgressBar from '../common/ProgressBar';
import SearchBar from '../common/SearchBar';

/**
 * ProjectsManagement component allows users to manage their created projects
 * as well as track the performance of each project
 * 
 * @param {Array} projects - Array of user's projects
 * @param {boolean} loading - Loading state indicator
 * @param {Function} onDeleteProject - Function to delete a project
 * @param {Function} onUpdateProjectStatus - Function to update project status
 */
const ProjectsManagement = ({ 
  projects = [], 
  loading = false, 
  onDeleteProject,
  onUpdateProjectStatus 
}) => {
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter and sort projects when criteria changes
  useEffect(() => {
    let result = [...projects];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(project => project.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'endDate':
          return new Date(a.endDate) - new Date(b.endDate);
        case 'funding':
          return b.currentFunding - a.currentFunding;
        case 'progress':
          const progressA = a.currentFunding / a.fundingGoal;
          const progressB = b.currentFunding / b.fundingGoal;
          return progressB - progressA;
        default:
          return 0;
      }
    });
    
    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter, sortBy]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const confirmDeleteProject = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete && onDeleteProject) {
      onDeleteProject(projectToDelete.id);
    }
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const handleStatusChange = (projectId, newStatus) => {
    if (onUpdateProjectStatus) {
      onUpdateProjectStatus(projectId, newStatus);
    }
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'draft': return 'status-draft';
      case 'funded': return 'status-funded';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'draft': return 'Draft';
      case 'funded': return 'Funded';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Card className="projects-management projects-management--loading">
        <div className="projects-management__loading-indicator">
          Loading your projects...
        </div>
      </Card>
    );
  }

  return (
    <Card className="projects-management">
      <div className="projects-management__header">
        <h2 className="projects-management__title">My Projects</h2>
        <Link to="/create-project" className="projects-management__create-btn">
          + Create New Project
        </Link>
      </div>

      <div className="projects-management__filters">
        <SearchBar 
          placeholder="Search projects..." 
          onSearch={handleSearch} 
          initialValue={searchTerm}
          className="projects-management__search"
        />
        
        <div className="projects-management__filter-controls">
          <div className="projects-management__filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select 
              id="status-filter" 
              value={statusFilter} 
              onChange={handleStatusFilterChange}
              className="projects-management__select"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="funded">Funded</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="projects-management__filter-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select 
              id="sort-by" 
              value={sortBy} 
              onChange={handleSortChange}
              className="projects-management__select"
            >
              <option value="recent">Most Recent</option>
              <option value="endDate">End Date</option>
              <option value="funding">Total Funding</option>
              <option value="progress">Funding Progress</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="projects-management__empty">
          <p>No projects found{searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
          {!searchTerm && !projects.length && (
            <Link to="/create-project" className="projects-management__empty-cta">
              Create your first project
            </Link>
          )}
        </div>
      ) : (
        <div className="projects-management__list">
          {filteredProjects.map(project => (
            <div key={project.id} className="project-management-item">
              <div className="project-management-item__header">
                <h3 className="project-management-item__title">
                  <Link to={`/project/${project.id}`}>{project.title}</Link>
                </h3>
                <span className={`project-management-item__status ${getStatusClass(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
              </div>
              
              <div className="project-management-item__funding-info">
                <div className="project-management-item__funding-progress">
                  <ProgressBar 
                    value={project.currentFunding} 
                    max={project.fundingGoal}
                    className="project-management-item__progress-bar"
                  />
                  <div className="project-management-item__funding-text">
                    <span>{formatCurrency(project.currentFunding)}</span>
                    <span>of {formatCurrency(project.fundingGoal)}</span>
                  </div>
                </div>
                
                <div className="project-management-item__stats">
                  <div className="project-management-item__stat">
                    <span className="project-management-item__stat-label">Backers</span>
                    <span className="project-management-item__stat-value">
                      {project.backersCount || 0}
                    </span>
                  </div>
                  <div className="project-management-item__stat">
                    <span className="project-management-item__stat-label">End Date</span>
                    <span className="project-management-item__stat-value">
                      {formatDate(project.endDate)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="project-management-item__actions">
                <Link 
                  to={`/project/${project.id}/edit`} 
                  className="project-management-item__action-btn project-management-item__edit-btn"
                >
                  Edit Project
                </Link>
                
                <Link 
                  to={`/project/${project.id}/dashboard`} 
                  className="project-management-item__action-btn project-management-item__analytics-btn"
                >
                  Analytics
                </Link>
                
                {project.status === 'draft' && (
                  <button 
                    onClick={() => handleStatusChange(project.id, 'active')}
                    className="project-management-item__action-btn project-management-item__publish-btn"
                  >
                    Publish
                  </button>
                )}
                
                {project.status === 'active' && (
                  <button 
                    onClick={() => handleStatusChange(project.id, 'cancelled')}
                    className="project-management-item__action-btn project-management-item__cancel-btn"
                  >
                    Cancel
                  </button>
                )}
                
                <button 
                  onClick={() => confirmDeleteProject(project)}
                  className="project-management-item__action-btn project-management-item__delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && projectToDelete && (
        <Modal 
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirm Delete"
        >
          <div className="delete-project-modal">
            <p>Are you sure you want to delete the project "{projectToDelete.title}"?</p>
            <p className="delete-project-modal__warning">
              This action cannot be undone.
            </p>
            <div className="delete-project-modal__actions">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="delete-project-modal__cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="delete-project-modal__delete-btn"
              >
                Delete Project
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};

ProjectsManagement.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      category: PropTypes.string,
      currentFunding: PropTypes.number.isRequired,
      fundingGoal: PropTypes.number.isRequired,
      backersCount: PropTypes.number,
      createdAt: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['draft', 'active', 'funded', 'completed', 'cancelled']).isRequired
    })
  ),
  loading: PropTypes.bool,
  onDeleteProject: PropTypes.func,
  onUpdateProjectStatus: PropTypes.func
};

export default ProjectsManagement;