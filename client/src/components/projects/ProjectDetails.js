import React, { useEffect, useState } from 'react';
import { FaBookmark, FaHeart, FaShare } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import FundingModal from './FundingModal';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        setProject(data);
        
        // Check if user has liked or bookmarked this project (would come from user data)
        // This is placeholder logic - replace with actual API calls
        setIsBookmarked(localStorage.getItem(`bookmark-${id}`) === 'true');
        setIsLiked(localStorage.getItem(`like-${id}`) === 'true');
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleFund = () => {
    setShowFundingModal(true);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    localStorage.setItem(`bookmark-${id}`, !isBookmarked);
    // Here you would also update this on your backend
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    localStorage.setItem(`like-${id}`, !isLiked);
    // Here you would also update this on your backend
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Project link copied to clipboard!');
    // You could replace this with a nicer notification component
  };

  if (loading) return <div className="text-center py-10">Loading project details...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!project) return <div className="text-center py-10">Project not found</div>;

  const {
    title,
    creator,
    createdAt,
    category,
    description,
    images,
    currentFunding,
    fundingGoal,
    backers,
    endDate,
    updates,
    comments
  } = project;

  const percentFunded = (currentFunding / fundingGoal) * 100;
  const daysLeft = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 mb-4">{description.substring(0, 150)}...</p>
        
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={creator.avatar || '/default-avatar.png'} 
            alt={creator.name}
            className="w-10 h-10 rounded-full" 
          />
          <div>
            <p className="font-medium">{creator.name}</p>
            <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="font-medium">${currentFunding.toLocaleString()}</span>
            <span className="text-gray-600">of ${fundingGoal.toLocaleString()} goal</span>
          </div>
          <ProgressBar progress={percentFunded} />
          
          <div className="flex justify-between mt-4">
            <div>
              <p className="font-bold">{backers}</p>
              <p className="text-sm text-gray-600">Backers</p>
            </div>
            <div>
              <p className="font-bold">{daysLeft}</p>
              <p className="text-sm text-gray-600">Days left</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <Button 
          variant="primary" 
          className="flex-1"
          onClick={handleFund}
        >
          Fund This Project
        </Button>
        
        <Button 
          variant="outline"
          className="w-12 h-12 flex items-center justify-center"
          onClick={handleLike}
        >
          <FaHeart className={isLiked ? 'text-red-500' : 'text-gray-400'} />
        </Button>
        
        <Button 
          variant="outline"
          className="w-12 h-12 flex items-center justify-center"
          onClick={handleBookmark}
        >
          <FaBookmark className={isBookmarked ? 'text-blue-500' : 'text-gray-400'} />
        </Button>
        
        <Button 
          variant="outline"
          className="w-12 h-12 flex items-center justify-center"
          onClick={handleShare}
        >
          <FaShare className="text-gray-600" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Image Gallery */}
          {images && images.length > 0 && (
            <div className="mb-8">
              <img 
                src={images[0]} 
                alt={title}
                className="w-full h-96 object-cover rounded-lg mb-2" 
              />
              <div className="flex gap-2 overflow-x-auto">
                {images.slice(1).map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`${title} ${index + 2}`}
                    className="w-24 h-24 object-cover rounded-lg cursor-pointer" 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Project Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Project</h2>
            <div className="prose max-w-none">
              {description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Updates */}
          {updates && updates.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Project Updates</h2>
              {updates.map((update, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold">{update.title}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(update.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{update.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comments */}
          {comments && comments.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
              {comments.map((comment, index) => (
                <div key={index} className="mb-4 p-4 border-b">
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src={comment.user.avatar || '/default-avatar.png'} 
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full" 
                    />
                    <span className="font-medium">{comment.user.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Reward Tiers */}
          <div className="sticky top-4">
            <h3 className="text-xl font-bold mb-4">Support Tiers</h3>
            {project.rewards.map((reward, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
                <h4 className="font-bold text-lg">${reward.amount}</h4>
                <h5 className="font-medium mb-2">{reward.title}</h5>
                <p className="text-sm mb-3">{reward.description}</p>
                <div className="text-sm text-gray-600 mb-4">
                  <p>Estimated delivery: {new Date(reward.estimatedDelivery).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                  <p>{reward.backers} backers</p>
                </div>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => {
                    setShowFundingModal(true);
                    // You could set selected reward here
                  }}
                >
                  Select Reward
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funding Modal */}
      {showFundingModal && (
        <FundingModal
          project={project}
          onClose={() => setShowFundingModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;