import axios from 'axios';
import { formatDistance } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { FaCalendar, FaHeart, FaShare, FaTag, FaUser } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Fetch blog post
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/blogs/${id}`);
        setBlog(response.data);
        setLikeCount(response.data.likes || 0);
        
        // Check if user has liked this post (would normally check against user ID)
        const userLikes = localStorage.getItem('userLikes') ? 
          JSON.parse(localStorage.getItem('userLikes')) : [];
        setHasLiked(userLikes.includes(id));
        
        // Fetch related blogs
        const relatedResponse = await axios.get(`/api/blogs/related/${id}`);
        setRelatedBlogs(relatedResponse.data.slice(0, 3));
        
        setLoading(false);
      } catch (err) {
        setError('Error loading blog post. Please try again later.');
        setLoading(false);
        console.error('Error fetching blog:', err);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    try {
      if (!hasLiked) {
        await axios.post(`/api/blogs/${id}/like`);
        setLikeCount(prev => prev + 1);
        
        // Store user like in localStorage (in production, this would be server-side)
        const userLikes = localStorage.getItem('userLikes') ? 
          JSON.parse(localStorage.getItem('userLikes')) : [];
        userLikes.push(id);
        localStorage.setItem('userLikes', JSON.stringify(userLikes));
        setHasLiked(true);
      } else {
        await axios.post(`/api/blogs/${id}/unlike`);
        setLikeCount(prev => prev - 1);
        
        // Remove user like in localStorage
        const userLikes = localStorage.getItem('userLikes') ? 
          JSON.parse(localStorage.getItem('userLikes')) : [];
        const updatedLikes = userLikes.filter(blogId => blogId !== id);
        localStorage.setItem('userLikes', JSON.stringify(updatedLikes));
        setHasLiked(false);
      }
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
    setShowShareModal(false);
  };

  if (loading) return <div className="text-center p-10">Loading blog post...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!blog) return <div className="text-center p-10">Blog post not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/blogs" className="text-blue-500 hover:text-blue-700">
          &larr; Back to Blogs
        </Link>
      </div>
      
      {/* Blog Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
        
        <div className="flex flex-wrap items-center text-gray-600 mb-4">
          <span className="flex items-center mr-6 mb-2">
            <FaUser className="mr-2" />
            {blog.author.name}
          </span>
          <span className="flex items-center mr-6 mb-2">
            <FaCalendar className="mr-2" />
            {formatDistance(new Date(blog.createdAt), new Date(), { addSuffix: true })}
          </span>
          <span className="flex items-center mb-2">
            <FaTag className="mr-2" />
            {blog.category}
          </span>
        </div>
      </div>
      
      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="mb-8">
          <img 
            src={blog.featuredImage} 
            alt={blog.title}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
      
      {/* Blog Content */}
      <Card className="mb-8 p-6">
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </Card>
      
      {/* Blog Actions */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Button 
            variant={hasLiked ? "primary" : "outline"}
            onClick={handleLike}
            className="flex items-center mr-4"
          >
            <FaHeart className="mr-2" />
            <span>{hasLiked ? 'Liked' : 'Like'}</span>
            <span className="ml-2">{likeCount}</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleShare}
            className="flex items-center"
          >
            <FaShare className="mr-2" />
            Share
          </Button>
        </div>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="hidden md:block">
            <span className="mr-2">Tags:</span>
            {blog.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Author Info */}
      {blog.author && (
        <Card className="mb-8 p-6">
          <div className="flex flex-wrap items-center">
            {blog.author.avatar && (
              <img 
                src={blog.author.avatar} 
                alt={blog.author.name}
                className="w-16 h-16 rounded-full mr-4"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold">{blog.author.name}</h3>
              <p className="text-gray-600">{blog.author.bio || 'Project Creator'}</p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map(relatedBlog => (
              <Link 
                key={relatedBlog.id}
                to={`/blogs/${relatedBlog.id}`}
                className="hover:opacity-90 transition duration-300"
              >
                <Card className="h-full">
                  {relatedBlog.featuredImage && (
                    <img 
                      src={relatedBlog.featuredImage} 
                      alt={relatedBlog.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{relatedBlog.title}</h3>
                    <p className="text-sm text-gray-600">
                      {formatDistance(new Date(relatedBlog.createdAt), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      <Modal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)}
        title="Share This Post"
      >
        <div className="p-4">
          <p className="mb-4">Share this blog post with others:</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, '_blank')}>
              Twitter
            </Button>
            <Button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
              Facebook
            </Button>
            <Button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
              LinkedIn
            </Button>
          </div>
          
          <div className="flex items-center">
            <input 
              type="text"
              value={window.location.href}
              className="flex-grow p-2 border rounded-l-md"
              readOnly
            />
            <Button onClick={copyLinkToClipboard} className="rounded-l-none">
              Copy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlogDetail;