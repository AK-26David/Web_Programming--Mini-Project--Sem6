import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const { 
    _id, 
    title, 
    content, 
    coverImage, 
    author, 
    createdAt, 
    tags,
    relatedProject 
  } = blog;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Truncate content for preview
  const truncatedContent = content.length > 150 
    ? `${content.substring(0, 150)}...` 
    : content;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <Link to={`/blogs/${_id}`}>
        <div className="h-48 overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
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
        <div className="flex flex-wrap gap-1 mb-2">
          {tags && tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          
          {relatedProject && (
            <Link to={`/projects/${relatedProject._id}`}>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {relatedProject.title}
              </span>
            </Link>
          )}
        </div>
        
        <Link to={`/blogs/${_id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3">{truncatedContent}</p>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              {author?.name ? author.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span>{author?.name || 'Anonymous'}</span>
          </div>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;