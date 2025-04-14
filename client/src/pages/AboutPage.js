import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Layout from '../components/layout/Layout';

const AboutPage = () => {
  return (
    <Layout>
      <div className="about-page">
        <section className="hero-section">
          <div className="hero-content">
            <h1>About Our Platform</h1>
            <p>Empowering creators and innovators to bring their ideas to life</p>
          </div>
        </section>

        <section className="mission-section">
          <div className="container">
            <h2>Our Mission</h2>
            <p>
              We believe that great ideas can come from anywhere. Our mission is to provide a platform
              where creators, innovators, and entrepreneurs can connect with a community of backers
              who are passionate about supporting new projects and initiatives.
            </p>
            <p>
              By removing traditional barriers to funding, we aim to democratize innovation and
              enable projects that might otherwise never see the light of day. We're committed to
              fostering a vibrant ecosystem where creativity thrives and impactful ideas become reality.
            </p>
          </div>
        </section>

        <section className="how-it-works">
          <div className="container">
            <h2>How It Works</h2>
            
            <div className="steps-container">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Create Your Project</h3>
                <p>
                  Share your vision with the world. Outline your goals, funding needs, 
                  timeline, and the unique aspects of your project that make it special.
                </p>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <h3>Set Funding Goals</h3>
                <p>
                  Determine how much funding you need to bring your project to life. 
                  Create compelling rewards to thank your backers for their support.
                </p>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <h3>Launch & Promote</h3>
                <p>
                  Once your project is ready, launch it to our community and beyond. 
                  Share updates and engage with your backers throughout the campaign.
                </p>
              </div>
              
              <div className="step">
                <div className="step-number">4</div>
                <h3>Get Funded</h3>
                <p>
                  If your project reaches its funding goal, you'll receive the funds to 
                  bring your idea to reality. Then fulfill your promises to backers.
                </p>
              </div>
            </div>
            
            <div className="cta-button">
              <Link to="/projects/create">
                <Button variant="primary" size="large">Start Your Project</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="container">
            <h2>Our Impact</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>$50M+</h3>
                <p>Funds Raised</p>
              </div>
              
              <div className="stat-card">
                <h3>10,000+</h3>
                <p>Successful Projects</p>
              </div>
              
              <div className="stat-card">
                <h3>500K+</h3>
                <p>Community Members</p>
              </div>
              
              <div className="stat-card">
                <h3>150+</h3>
                <p>Countries Represented</p>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section">
          <div className="container">
            <h2>Our Team</h2>
            <p className="section-intro">
              We're a passionate team of creators, entrepreneurs, and technologists who believe
              in the power of community-driven funding to change the world.
            </p>
            
            <div className="team-grid">
              {/* These would be actual team members in a real application */}
              <div className="team-member">
                <div className="member-photo"></div>
                <h3>Jane Smith</h3>
                <p className="member-title">CEO & Co-Founder</p>
                <p className="member-bio">
                  Former venture capitalist with a passion for democratizing access to funding.
                </p>
              </div>
              
              <div className="team-member">
                <div className="member-photo"></div>
                <h3>John Doe</h3>
                <p className="member-title">CTO & Co-Founder</p>
                <p className="member-bio">
                  Software engineer with 15+ years experience building scalable platforms.
                </p>
              </div>
              
              <div className="team-member">
                <div className="member-photo"></div>
                <h3>Sarah Johnson</h3>
                <p className="member-title">Head of Community</p>
                <p className="member-bio">
                  Community builder focused on creating meaningful connections between creators and backers.
                </p>
              </div>
              
              <div className="team-member">
                <div className="member-photo"></div>
                <h3>Michael Chen</h3>
                <p className="member-title">Product Lead</p>
                <p className="member-bio">
                  Designer and product strategist with a background in user experience research.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="join-section">
          <div className="container">
            <h2>Join Our Community</h2>
            <p>
              Whether you're a creator with a bold idea or someone who wants to support innovation,
              there's a place for you in our community.
            </p>
            <div className="cta-buttons">
              <Link to="/projects">
                <Button variant="primary" size="large">Explore Projects</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="large">Sign Up Today</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;