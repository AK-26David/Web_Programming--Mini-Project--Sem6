import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [projects, setProjects] = useState([]);

  // Fetch projects from the backend
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/projects')
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  return (
    <div className="home-page">
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Make a Difference with Crowdfunding</h1>
          <p className="hero-description">
            Support innovative projects, charitable causes, and creative ideas.
          </p>
          <a href="/projects" className="cta-btn">Explore Projects</a>
        </div>
      </header>

      <section className="featured-projects">
        <h2>Featured Projects</h2>
        <div className="projects-list">
          {projects.map((project) => (
            <div className="project-card" key={project._id}>
              <img src={project.image} alt={project.title} />
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <a href={`/projects/${project._id}`} className="btn">Learn More</a>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 CrowdFund Platform | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default HomePage;
