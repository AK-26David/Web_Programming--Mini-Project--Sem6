import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '../common/ProgressBar';

const ProjectCard = ({ project }) => {
    const { 
    _id, 
    title, 
    description, 
    imageUrl, 
    currentAmount, 
    targetAmount, 
    category,
    createdBy,
    deadline 
    } = project;

  // Calculate funding percentage
    const fundingPercentage = Math.min(
    Math.round((currentAmount / targetAmount) * 100),
    100
    );

  // Format deadline date
    const formattedDeadline = new Date(deadline).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
    });

  // Truncate description
    const truncatedDescription = description.length > 120 
    ? `${description.substring(0, 120)}...` 
    : description;

    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
        <Link to={`/projects/${_id}`}>
        <div className="h-48 overflow-hidden">
            {imageUrl ? (
            <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover"
            />
            ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
            </div>
            )}
        </div>
        </Link>
        
        <div className="p-4">
        <div className="flex justify-between items-start mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {category}
            </span>
            <span className="text-sm text-gray-500">{formattedDeadline}</span>
        </div>
        
        <Link to={`/projects/${_id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600">
            {title}
            </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3">{truncatedDescription}</p>
        
        <div className="mb-3">
            <ProgressBar percentage={fundingPercentage} />
            <div className="flex justify-between text-sm mt-1">
            <span className="font-medium">${currentAmount.toLocaleString()}</span>
            <span className="text-gray-600">{fundingPercentage}% of ${targetAmount.toLocaleString()}</span>
            </div>
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
            <span>By {createdBy.name || 'Anonymous'}</span>
            <Link 
            to={`/projects/${_id}`}
            className="text-blue-600 hover:underline"
            >
            View details →
            </Link>
        </div>
        </div>
    </div>
    );
};

export default ProjectCard;