import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ContributionHistory from '../components/dashboard/ContributionHistory';
import DashboardSummary from '../components/dashboard/DashboardSummary';
import ProjectsManagement from '../components/dashboard/ProjectsManagement';
import UserSettings from '../components/dashboard/UserSettings';
import { useAuth } from '../context/AuthContext';
import { getUserBlogs } from '../services/blogService';
import { getUserContributions } from '../services/paymentService';
import { getUserProjects } from '../services/projectService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('summary');
  const [projects, setProjects] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState({
    projects: true,
    contributions: true,
    blogs: true
  });
  
  useEffect(() => {
    // Redirect if not logged in - moved inside useEffect
    if (!user) {
      navigate('/login', { state: { from: '/dashboard' } });
      return;
    }
    
    const fetchUserData = async () => {
      try {
        // Fetch projects
        setLoading(prev => ({ ...prev, projects: true }));
        const projectsData = await getUserProjects();
        setProjects(projectsData);
        setLoading(prev => ({ ...prev, projects: false }));
        
        // Fetch contributions
        setLoading(prev => ({ ...prev, contributions: true }));
        const contributionsData = await getUserContributions();
        setContributions(contributionsData);
        setLoading(prev => ({ ...prev, contributions: false }));
        
        // Fetch blogs
        setLoading(prev => ({ ...prev, blogs: true }));
        const blogsData = await getUserBlogs();
        setBlogs(blogsData);
        setLoading(prev => ({ ...prev, blogs: false }));
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading({
          projects: false,
          contributions: false,
          blogs: false
        });
      }
    };
    
    fetchUserData();
  }, [user, navigate]); // Add navigate and user to dependencies
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'summary':
        return (
          <DashboardSummary 
            projects={projects} 
            contributions={contributions} 
            blogs={blogs}
            loading={loading}
          />
        );
      case 'projects':
        return (
          <ProjectsManagement 
            projects={projects} 
            loading={loading.projects} 
          />
        );
      case 'contributions':
        return (
          <ContributionHistory 
            contributions={contributions} 
            loading={loading.contributions} 
          />
        );
      case 'settings':
        return <UserSettings user={user} />;
      default:
        return null;
    }
  };
  
  // Early return if no user, but AFTER all hooks are called
  if (!user) {
    return null; // We already redirected in the useEffect
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                My Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your projects, contributions, and settings
              </p>
            </div>
            <div className="flex space-x-2">
              <Link
                to="/projects/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </Link>
              <Link
                to="/blogs/create"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                New Blog Post
              </Link>
            </div>
          </div>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('summary')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Projects
            </button>
            <button
              onClick={() => setActiveTab('contributions')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'contributions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contributions
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;