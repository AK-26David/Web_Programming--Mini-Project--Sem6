import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProgressBar from '../components/common/ProgressBar';
import FundingModal from '../components/projects/FundingModal';
import { useAuth } from '../context/AuthContext';
import { getProjectById } from '../services/projectService';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFundingModal, setShowFundingModal] = useState(false);
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(id);
        setProject(data);
      } catch (err) {
        setError('Failed to load project details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);

  const handleFundingClick = () => {
    if (!user) {
      navigate('/login', { state: { from: `/projects/${id}` } });
      return;
    }
    setShowFundingModal(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded mb-6"></div>
          <div className="h-40 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-base font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">{error || "Project not found"}</p>
          <button 
            onClick={() => navigate('/projects')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Projects
          </button>
        </div>
      </div>
    );
  }

  const fundingPercentage = Math.min(
    Math.round((project.currentAmount / project.targetAmount) * 100),
    100
  );

  const daysLeft = Math.max(
    Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24)),
    0
  );

  const isOwner = user && user._id === project.createdBy._id;
  const isActive = new Date(project.deadline) > new Date();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Project Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
              {project.category}
            </span>
            {isActive ? (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Active
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Closed
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500">
            Created {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
        <p className="text-sm text-gray-500 mb-4">By {project.createdBy.name}</p>
      </div>

      {/* Project Image */}
      <div className="mb-8">
        {project.imageUrl ? (
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-96 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {/* Funding Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-4">
          <ProgressBar percentage={fundingPercentage} />
          <div className="flex justify-between text-sm mt-2">
            <span className="font-medium text-lg">${project.currentAmount.toLocaleString()}</span>
            <span className="text-gray-600">of ${project.targetAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{fundingPercentage}%</p>
            <p className="text-gray-500 text-sm">Funded</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{daysLeft}</p>
            <p className="text-gray-500 text-sm">{daysLeft === 1 ? 'Day' : 'Days'} Left</p>
          </div>
        </div>

        {isActive && !isOwner && (
          <button
            onClick={handleFundingClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition"
          >
            Fund This Project
          </button>
        )}
        
        {isOwner && (
          <button
            onClick={() => navigate(`/projects/${id}/edit`)}
            className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition"
          >
            Edit Project
          </button>
        )}
      </div>

      {/* Project Description */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">About This Project</h2>
        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{project.description}</p>
        </div>
      </div>

      {/* Project Updates */}
      {project.updates && project.updates.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Project Updates</h2>
          <div className="space-y-6">
            {project.updates.map((update, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{update.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(update.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 whitespace-pre-line">{update.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Funding Modal */}
      {showFundingModal && (
        <FundingModal 
          project={project}
          onClose={() => setShowFundingModal(false)}
          onSuccess={() => {
            setShowFundingModal(false);
            // Refresh project data
            getProjectById(id).then(data => setProject(data));
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;