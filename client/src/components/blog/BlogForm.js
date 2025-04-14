import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSpinner, FaTimes, FaUpload } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';

const BlogForm = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    tags: [],
    featuredImage: null,
    imagePreview: ''
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [richTextEditor, setRichTextEditor] = useState(null);
  
  const categories = [
    'Project Updates',
    'Success Stories',
    'Crowdfunding Tips',
    'Industry News',
    'Community Spotlight',
    'Behind the Scenes',
    'Other'
  ];

  // If editing, fetch the blog data
  useEffect(() => {
    if (isEditing && id) {
      const fetchBlog = async () => {
        try {
          const response = await axios.get(`/api/blogs/${id}`);
          const blog = response.data;
          
          setFormData({
            title: blog.title || '',
            summary: blog.summary || '',
            content: blog.content || '',
            category: blog.category || '',
            tags: blog.tags || [],
            featuredImage: null,
            imagePreview: blog.featuredImage || ''
          });
          
          // Initialize rich text editor with content
          if (richTextEditor) {
            richTextEditor.setContent(blog.content);
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching blog post for editing:', err);
          setLoading(false);
        }
      };
      
      fetchBlog();
    }
  }, [isEditing, id, richTextEditor]);

  // Initialize rich text editor on component mount
  useEffect(() => {
    // This is a placeholder for a rich text editor integration
    // In a real implementation, you would initialize something like TinyMCE, CKEditor, etc.
    const mockEditor = {
      getContent: () => formData.content,
      setContent: (content) => {
        setFormData(prev => ({ ...prev, content }));
      },
      addEventListener: (event, callback) => {
        // Mock event listener
      }
    };
    
    setRichTextEditor(mockEditor);
    
    // Clean up editor on unmount
    return () => {
      // Cleanup logic for the editor would go here
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          featuredImage: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
      
      // Clear image error if exists
      if (errors.featuredImage) {
        setErrors(prev => ({ ...prev, featuredImage: '' }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: null,
      imagePreview: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!isEditing && !formData.featuredImage && !formData.imagePreview) {
      newErrors.featuredImage = 'Please upload a featured image';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Update content from rich text editor if available
    if (richTextEditor) {
      setFormData(prev => ({
        ...prev,
        content: richTextEditor.getContent()
      }));
    }
    
    const isValid = validateForm();
    if (!isValid) return;
    
    setSubmitting(true);
    
    try {
      // Create FormData object for file upload
      const blogFormData = new FormData();
      blogFormData.append('title', formData.title);
      blogFormData.append('summary', formData.summary);
      blogFormData.append('content', formData.content);
      blogFormData.append('category', formData.category);
      blogFormData.append('tags', JSON.stringify(formData.tags));
      
      if (formData.featuredImage) {
        blogFormData.append('featuredImage', formData.featuredImage);
      }
      
      let response;
      if (isEditing) {
        response = await axios.put(`/api/blogs/${id}`, blogFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('/api/blogs', blogFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      // Redirect to the blog post page
      navigate(`/blogs/${response.data.id}`);
    } catch (err) {
      console.error('Error submitting form:', err);
      
      // Handle validation errors from the server
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        // Generic error message
        alert(`Failed to ${isEditing ? 'update' : 'create'} blog post. Please try again.`);
      }
      
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.summary || formData.content || formData.tags.length > 0 || formData.featuredImage) {
      setShowConfirmModal(true);
    } else {
      navigate(-1);
    }
  };

  const confirmCancel = () => {
    setShowConfirmModal(false);
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter blog title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          {/* Summary */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="summary">
              Summary *
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md ${errors.summary ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="A brief summary of your blog post"
              rows="3"
            />
            {errors.summary && (
              <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
            )}
          </div>
          
          {/* Content */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="content">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Write your blog post content here"
              rows="12"
            />
            <p className="text-sm text-gray-500 mt-1">
              This is a simple editor. In a real implementation, a rich text editor would be integrated here.
            </p>
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>
          
          {/* Category */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="category">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          
          {/* Tags */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="tags">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                className="flex-1 p-3 border border-gray-300 rounded-md"
                placeholder="Add a tag and press Enter"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Press Enter to add each tag
            </p>
          </div>
          
          {/* Featured Image */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Featured Image {!isEditing && '*'}
            </label>
            
            {formData.imagePreview ? (
              <div className="relative mb-4">
                <img
                  src={formData.imagePreview}
                  alt="Featured image preview"
                  className="w-full max-h-80 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                  errors.featuredImage ? 'border-red-500' : 'border-gray-300'
                }`}
                onClick={() => document.getElementById('featuredImage').click()}
              >
                <FaUpload className="mx-auto text-gray-400 text-3xl mb-2" />
                <p className="text-gray-600">Click to upload a featured image</p>
                <p className="text-sm text-gray-500 mt-1">
                  Recommended: 1200 x 630 pixels
                </p>
              </div>
            )}
            
            <input
              type="file"
              id="featuredImage"
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            
            {errors.featuredImage && (
              <p className="text-red-500 text-sm mt-1">{errors.featuredImage}</p>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  {isEditing ? 'Updating...' : 'Publishing...'}
                </>
              ) : (
                <>{isEditing ? 'Update Post' : 'Publish Post'}</>
              )}
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Confirm Cancel Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Discard Changes"
      >
        <div className="p-6">
          <p className="mb-6">
            You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.
          </p>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Continue Editing
            </Button>
            <Button
              variant="danger"
              onClick={confirmCancel}
            >
              Discard Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlogForm;