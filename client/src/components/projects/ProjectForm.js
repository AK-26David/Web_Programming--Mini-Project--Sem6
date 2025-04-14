import React, { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../common/Button';

const ProjectForm = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    fundingGoal: '',
    endDate: '',
    images: [],
    rewards: [
      {
        title: '',
        amount: '',
        description: '',
        estimatedDelivery: '',
        limit: ''
      }
    ],
    risks: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  
  // Fetch project data if editing
  useEffect(() => {
    if (isEditing && id) {
      const fetchProject = async () => {
        try {
          // Replace with your actual API call
          const response = await fetch(`/api/projects/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch project');
          }
          const data = await response.json();
          
          // Format the date to be compatible with input[type="date"]
          const formattedEndDate = data.endDate 
            ? new Date(data.endDate).toISOString().split('T')[0]
            : '';
            
          // Format reward delivery dates
          const formattedRewards = data.rewards.map(reward => ({
            ...reward,
            estimatedDelivery: reward.estimatedDelivery 
              ? new Date(reward.estimatedDelivery).toISOString().split('T')[0]
              : ''
          }));
          
          setFormData({
            ...data,
            endDate: formattedEndDate,
            rewards: formattedRewards
          });
          
          // Set image previews
          if (data.images && data.images.length > 0) {
            setPreviewImages(data.images);
          }
        } catch (error) {
          console.error('Error fetching project:', error);
        }
      };
      
      fetchProject();
    }
  }, [isEditing, id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user changes it
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleRewardChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRewards = [...formData.rewards];
    updatedRewards[index] = { ...updatedRewards[index], [name]: value };
    
    setFormData(prev => ({ ...prev, rewards: updatedRewards }));
    
    // Clear error for this field
    if (errors[`rewards.${index}.${name}`]) {
      setErrors(prev => ({ ...prev, [`rewards.${index}.${name}`]: '' }));
    }
  };
  
  const addReward = () => {
    setFormData(prev => ({
      ...prev,
      rewards: [
        ...prev.rewards,
        {
          title: '',
          amount: '',
          description: '',
          estimatedDelivery: '',
          limit: ''
        }
      ]
    }));
  };
  
  const removeReward = (index) => {
    if (formData.rewards.length > 1) {
      const updatedRewards = formData.rewards.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, rewards: updatedRewards }));
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Create preview URLs
    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
    
    // In a real app, you'd handle image upload to a server here
    // For now, we'll just store the File objects
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };
  
  const removeImage = (index) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
    
    // Remove from form data as well
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate basic fields
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    if (!formData.fundingGoal) {
      newErrors.fundingGoal = 'Funding goal is required';
    } else if (isNaN(formData.fundingGoal) || Number(formData.fundingGoal) <= 0) {
      newErrors.fundingGoal = 'Funding goal must be a positive number';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else {
      const selectedDate = new Date(formData.endDate);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.endDate = 'End date must be in the future';
      }
    }
    
    // Validate images
    if (previewImages.length === 0) {
      newErrors.images = 'At least one project image is required';
    }
    
    // Validate rewards
    formData.rewards.forEach((reward, index) => {
      if (!reward.title.trim()) {
        newErrors[`rewards.${index}.title`] = 'Reward title is required';
      }
      
      if (!reward.amount) {
        newErrors[`rewards.${index}.amount`] = 'Amount is required';
      } else if (isNaN(reward.amount) || Number(reward.amount) <= 0) {
        newErrors[`rewards.${index}.amount`] = 'Amount must be a positive number';
      }
      
      if (!reward.description.trim()) {
        newErrors[`rewards.${index}.description`] = 'Description is required';
      }
      
      if (!reward.estimatedDelivery) {
        newErrors[`rewards.${index}.estimatedDelivery`] = 'Estimated delivery date is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you'd handle image upload first
      // Then submit all data including image URLs
      
      // Example API call (replace with your actual implementation)
      const url = isEditing 
        ? `/api/projects/${id}` 
        : '/api/projects';
        
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save project');
      }
      
      const savedProject = await response.json();
      
      // Redirect to the project page
      navigate(`/projects/${savedProject.id}`);
      
    } catch (error) {
      console.error('Error saving project:', error);
      setErrors(prev => ({ 
        ...prev, 
        form: 'Failed to save project. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Project' : 'Create New Project'}
      </h1>
      
      {errors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Project Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter a catchy title for your project"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1 error-message">{errors.title}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="category">
              Category*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a category</option>
              <option value="technology">Technology</option>
              <option value="art">Art</option>
              <option value="design">Design</option>
              <option value="film">Film & Video</option>
              <option value="games">Games</option>
              <option value="music">Music</option>
              <option value="publishing">Publishing</option>
              <option value="food">Food</option>
              <option value="fashion">Fashion</option>
              <option value="community">Community</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1 error-message">{errors.category}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe your project in detail"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1 error-message">{errors.description}</p>}
          </div>
        </div>
        
        {/* Funding Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Funding Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="fundingGoal">
                Funding Goal ($)*
              </label>
              <input
                type="number"
                id="fundingGoal"
                name="fundingGoal"
                value={formData.fundingGoal}
                onChange={handleChange}
                min="1"
                step="1"
                className={`w-full p-2 border rounded ${errors.fundingGoal ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. 5000"
              />
              {errors.fundingGoal && <p className="text-red-500 text-sm mt-1 error-message">{errors.fundingGoal}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="endDate">
                Campaign End Date*
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1 error-message">{errors.endDate}</p>}
            </div>
          </div>
        </div>
        
        {/* Project Images */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Project Images</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Upload Images*
            </label>
            
            <div className="flex flex-wrap gap-4 mb-4">
              {previewImages.map((src, index) => (
                <div key={index} className="relative w-32 h-32">
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
              
              <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                <FaUpload className="text-gray-400 mb-2" size={24} />
                <span className="text-gray-500 text-sm">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            
            {errors.images && <p className="text-red-500 text-sm error-message">{errors.images}</p>}
            <p className="text-gray-500 text-sm">Upload high-quality images that showcase your project. First image will be your main project image.</p>
          </div>
        </div>
        
        {/* Rewards */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Rewards</h2>
          
          {formData.rewards.map((reward, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Reward #{index + 1}</h3>
                {formData.rewards.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReward(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Reward Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={reward.title}
                    onChange={(e) => handleRewardChange(index, e)}
                    className={`w-full p-2 border rounded ${errors[`rewards.${index}.title`] ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Early Bird Special"
                  />
                  {errors[`rewards.${index}.title`] && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors[`rewards.${index}.title`]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">
                    Amount ($)*
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={reward.amount}
                    onChange={(e) => handleRewardChange(index, e)}
                    min="1"
                    step="1"
                    className={`w-full p-2 border rounded ${errors[`rewards.${index}.amount`] ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. 25"
                  />
                  {errors[`rewards.${index}.amount`] && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors[`rewards.${index}.amount`]}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={reward.description}
                  onChange={(e) => handleRewardChange(index, e)}
                  rows="3"
                  className={`w-full p-2 border rounded ${errors[`rewards.${index}.description`] ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Describe what backers will receive"
                />
                {errors[`rewards.${index}.description`] && (
                  <p className="text-red-500 text-sm mt-1 error-message">{errors[`rewards.${index}.description`]}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Estimated Delivery*
                  </label>
                  <input
                    type="date"
                    name="estimatedDelivery"
                    value={reward.estimatedDelivery}
                    onChange={(e) => handleRewardChange(index, e)}
                    className={`w-full p-2 border rounded ${errors[`rewards.${index}.estimatedDelivery`] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors[`rewards.${index}.estimatedDelivery`] && (
                    <p className="text-red-500 text-sm mt-1 error-message">{errors[`rewards.${index}.estimatedDelivery`]}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">
                    Limit (Optional)
                  </label>
                  <input
                    type="number"
                    name="limit"
                    value={reward.limit}
                    onChange={(e) => handleRewardChange(index, e)}
                    min="0"
                    step="1"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Leave blank for unlimited"
                  />
                  <p className="text-gray-500 text-sm mt-1">Maximum number of backers for this reward tier</p>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addReward}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <FaPlus size={14} />
            <span>Add Another Reward</span>
          </button>
        </div>
        
        {/* Risks and Challenges */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Risks and Challenges</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="risks">
              Project Risks and Challenges
            </label>
            <textarea
              id="risks"
              name="risks"
              value={formData.risks}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Describe any potential risks or challenges your project might face"
            />
            <p className="text-gray-500 text-sm mt-1">Being transparent about risks helps build trust with potential backers</p>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;