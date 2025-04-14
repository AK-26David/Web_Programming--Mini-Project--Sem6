import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Layout from '../components/layout/Layout';
import { formatDate } from '../utils/dateUtils';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [currentUserIsAuthor, setCurrentUserIsAuthor] = useState(false);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        // This would be an actual API call in a real application
        const response = await fetch(`/api/blogs/${id}`);
        
        if (!response.ok) {
          throw new Error('Blog post not found');
        }
        
        const data = await response.json();
        setBlog(data);
        
        // Check if current user is the author (would use auth context in real app)
        const currentUser = JSON.parse(localStorage.getItem('user'));
        setCurrentUserIsAuthor(currentUser && currentUser.id === data.author.id);
        
        // Fetch related blogs
        const relatedResponse = await fetch(`/api/blogs/related/${id}`);
        const relatedData = await relatedResponse.json();
        setRelatedBlogs(relatedData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog details:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        // This would be an actual API call in a real application
        const response = await fetch(`/api/blogs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          navigate('/blogs');
        } else {
          throw new Error('Failed to delete blog post');
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <p>Loading blog post...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/blogs">
            <Button variant="secondary">Back to Blogs</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="blog-detail-page">
        <div className="blog-header">
          <div className="category-tag">{blog.category}</div>
          <h1>{blog.title}</h1>
          
          <div className="blog-meta">
            <div className="author-info">
              <img src={blog.author.avatar} alt={blog.author.name} className="author-avatar" />
              <span className="author-name">{blog.author.name}</span>
            </div>
            <div className="publish-date">
              Published on {formatDate(blog.createdAt)}
            </div>
          </div>
          
          {currentUserIsAuthor && (
            <div className="author-actions">
              <Link to={`/blogs/edit/${id}`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          )}
        </div>

        {blog.featuredImage && (
          <div className="blog-featured-image">
            <img src={blog.featuredImage} alt={blog.title} />
          </div>
        )}

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />

        <div className="blog-tags">
          {blog.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        {relatedBlogs.length > 0 && (
          <div className="related-blogs">
            <h3>Related Articles</h3>
            <div className="related-blogs-grid">
              {relatedBlogs.map(relatedBlog => (
                <div key={relatedBlog.id} className="related-blog-card">
                  <Link to={`/blogs/${relatedBlog.id}`}>
                    <img src={relatedBlog.thumbnail} alt={relatedBlog.title} />
                    <h4>{relatedBlog.title}</h4>
                  </Link>
                  <p className="related-blog-date">{formatDate(relatedBlog.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogDetailPage;