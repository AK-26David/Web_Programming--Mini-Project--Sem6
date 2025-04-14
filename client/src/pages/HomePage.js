import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AchievementCard from '../components/achievements/AchievementCard';
import BlogCard from '../components/blog/BlogCard';
import Button from '../components/common/Button';
import SearchBar from '../components/common/SearchBar';
import Layout from '../components/layout/Layout';
import ProjectGrid from '../components/projects/ProjectGrid';

const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [topAchievements, setTopAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        // These would be actual API calls in a real application
        const projectsResponse = await fetch('/api/projects/featured');
        const projectsData = await projectsResponse.json();
        
        const blogsResponse = await fetch('/api/blogs/recent');
        const blogsData = await blogsResponse.json();
        
        const achievementsResponse = await fetch('/api/achievements/top');
        const achievementsData = await achievementsResponse.json();
        
        setFeaturedProjects(projectsData);
        setRecentBlogs(blogsData);
        setTopAchievements(achievementsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching home page data:', error);
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Fund Ideas That Matter</h1>
          <p>Join our community of creators and backers to bring innovative projects to life</p>
          <div className="hero-actions">
            <Link to="/projects/create">
              <Button variant="primary" size="large">Start a Project</Button>
            </Link>
            <Link to="/projects">
              <Button variant="secondary" size="large">Explore Projects</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <h2>Discover Projects</h2>
        <SearchBar placeholder="Search for projects, categories, or creators" />
      </section>

      {/* Featured Projects Section */}
      <section className="featured-projects-section">
        <div className="section-header">
          <h2>Featured Projects</h2>
          <Link to="/projects">View All</Link>
        </div>
        {loading ? (
          <div className="loading">Loading featured projects...</div>
        ) : (
          <ProjectGrid projects={featuredProjects} />
        )}
      </section>

      {/* Recent Blogs Section */}
      <section className="recent-blogs-section">
        <div className="section-header">
          <h2>Latest Updates</h2>
          <Link to="/blogs">View All</Link>
        </div>
        {loading ? (
          <div className="loading">Loading recent blogs...</div>
        ) : (
          <div className="blog-grid">
            {recentBlogs.slice(0, 3).map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>

      {/* Achievements Section */}
      <section className="achievements-section">
        <div className="section-header">
          <h2>Notable Achievements</h2>
          <Link to="/achievements">View All</Link>
        </div>
        {loading ? (
          <div className="loading">Loading achievements...</div>
        ) : (
          <div className="achievements-grid">
            {topAchievements.slice(0, 4).map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to Turn Your Idea Into Reality?</h2>
        <p>Join thousands of creators who have successfully funded their projects</p>
        <Link to="/register">
          <Button variant="primary" size="large">Get Started Today</Button>
        </Link>
      </section>
    </Layout>
  );
};

export default HomePage;