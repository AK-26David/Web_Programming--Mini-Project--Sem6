import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Layout from '../components/layout/Layout';
import ProjectCard from '../components/projects/ProjectCard';
import { formatDate } from '../utils/dateUtils';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // These would be actual API calls in a real application
        const profileResponse = await fetch(`/api/users/${username}`);
        
        if (!profileResponse.ok) {
          throw new Error('User not found');
        }
        
        const profileData = await profileResponse.json();
        setProfile(profileData);
        
        // Check if viewing own profile
        const currentUser = JSON.parse(localStorage.getItem('user'));
        setIsCurrentUser(currentUser && currentUser.username === username);
        
        // Fetch projects created by this user
        const projectsResponse = await fetch(`/api/users/${username}/projects`);
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <p>Loading profile...</p>
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
          <Link to="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-cover-photo" style={{ backgroundImage: `url(${profile.coverPhoto})` }}>
            {isCurrentUser && (
              <button className="edit-cover-photo">
                Edit Cover
              </button>
            )}
          </div>
          
          <div className="profile-info">
            <div className="profile-avatar">
              <img src={profile.avatar} alt={profile.name} />
              {isCurrentUser && (
                <button className="edit-avatar">
                  Edit
                </button>
              )}
            </div>
            
            <div className="profile-details">
              <h1>{profile.name}</h1>
              <p className="username">@{profile.username}</p>
              
              <div className="profile-stats">
                <div className="stat">
                  <span className="count">{profile.projectsCount}</span>
                  <span className="label">Projects</span>
                </div>
                <div className="stat">
                  <span className="count">{profile.backingsCount}</span>
                  <span className="label">Backings</span>
                </div>
                <div className="stat">
                  <span className="count">{profile.followersCount}</span>
                  <span className="label">Followers</span>
                </div>
              </div>
              
              <p className="bio">{profile.bio}</p>
              
              <div className="profile-links">
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="profile-link">
                    Website
                  </a>
                )}
                {profile.socialLinks?.map((link, index) => (
                  <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="profile-link">
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="profile-actions">
              {isCurrentUser ? (
                <Link to="/dashboard/settings">
                  <Button variant="secondary">Edit Profile</Button>
                </Link>
              ) : (
                <Button variant={profile.isFollowing ? "secondary" : "primary"}>
                  {profile.isFollowing ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="profile-tabs">
          <button 
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => handleTabChange('projects')}
          >
            Projects
          </button>
          <button 
            className={activeTab === 'backed' ? 'active' : ''}
            onClick={() => handleTabChange('backed')}
          >
            Backed Projects
          </button>
          <button 
            className={activeTab === 'blogs' ? 'active' : ''}
            onClick={() => handleTabChange('blogs')}
          >
            Blog Posts
          </button>
          <button 
            className={activeTab === 'achievements' ? 'active' : ''}
            onClick={() => handleTabChange('achievements')}
          >
            Achievements
          </button>
        </div>
        
        <div className="profile-content">
          {activeTab === 'projects' && (
            <div className="projects-section">
              {projects.length === 0 ? (
                <div className="empty-state">
                  <h3>No projects yet</h3>
                  {isCurrentUser && (
                    <p>Ready to bring your idea to life? Start your first project now!</p>
                  )}
                  {isCurrentUser && (
                    <Link to="/projects/create">
                      <Button variant="primary">Create Project</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="projects-grid">
                  {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'backed' && (
            <div className="backed-projects-section">
              {/* Similar structure to projects section */}
              {profile.backedProjects && profile.backedProjects.length > 0 ? (
                <div className="projects-grid">
                  {profile.backedProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No backed projects yet</h3>
                  {isCurrentUser && (
                    <>
                      <p>Discover and support innovative projects in our community!</p>
                      <Link to="/projects">
                        <Button variant="primary">Explore Projects</Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'blogs' && (
            <div className="blogs-section">
              {/* Blog posts content */}
              {profile.blogPosts && profile.blogPosts.length > 0 ? (
                <div className="blogs-list">
                  {profile.blogPosts.map(blog => (
                    <div key={blog.id} className="blog-item">
                      <Link to={`/blogs/${blog.id}`}>
                        <h3>{blog.title}</h3>
                      </Link>
                      <p className="blog-excerpt">{blog.excerpt}</p>
                      <div className="blog-meta">
                        <span className="blog-date">{formatDate(blog.createdAt)}</span>
                        <span className="blog-category">{blog.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No blog posts yet</h3>
                  {isCurrentUser && (
                    <>
                      <p>Share your insights and project updates with the community!</p>
                      <Link to="/blogs/create">
                        <Button variant="primary">Write a Blog Post</Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'achievements' && (
            <div className="achievements-section">
              {/* Achievements content */}
              {profile.achievements && profile.achievements.length > 0 ? (
                <div className="achievements-grid">
                  {profile.achievements.map(achievement => (
                    <div key={achievement.id} className="achievement-item">
                      <div className="achievement-icon">
                        <img src={achievement.icon} alt={achievement.title} />
                      </div>
                      <div className="achievement-content">
                        <h3>{achievement.title}</h3>
                        <p>{achievement.description}</p>
                        <span className="achievement-date">{formatDate(achievement.awardedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No achievements yet</h3>
                  {isCurrentUser && (
                    <p>Create and fund projects to earn achievements!</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;