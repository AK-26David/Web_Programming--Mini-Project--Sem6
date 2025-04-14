import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogList from '../components/blog/BlogList';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import Layout from '../components/layout/Layout';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // This would be an actual API call in a real application
        const response = await fetch('/api/blogs/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching blog categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        // This would be an actual API call in a real application
        const response = await fetch(
          `/api/blogs?page=${currentPage}&category=${selectedCategory}&search=${searchQuery}`
        );
        const data = await response.json();
        
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, selectedCategory, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  return (
    <Layout>
      <div className="blogs-page">
        <div className="page-header">
          <div className="header-content">
            <h1>Blog & Updates</h1>
            <p>Stay informed with the latest news, project updates, and success stories</p>
          </div>
          <div className="header-actions">
            <Link to="/blogs/create">
              <Button variant="primary">Write a Blog Post</Button>
            </Link>
          </div>
        </div>

        <div className="search-section">
          <SearchBar 
            placeholder="Search blog posts..." 
            onSearch={handleSearch} 
            initialValue={searchQuery}
          />
        </div>

        <div className="category-filters">
          <button 
            className={selectedCategory === 'all' ? 'active' : ''} 
            onClick={() => handleCategoryChange('all')}
          >
            All Posts
          </button>
          {categories.map(category => (
            <button 
              key={category.id}
              className={selectedCategory === category.id ? 'active' : ''} 
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading blog posts...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="no-results">
            <h3>No blog posts found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        ) : (
          <>
            <BlogList blogs={blogs} />
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages}
              onPageChange={handlePageChange} 
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default BlogsPage;