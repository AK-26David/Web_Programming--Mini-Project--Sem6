import React from 'react';
import { Link } from 'react-router-dom';  // Import Link for routing
import './Navbar.css';  // You can create a separate CSS file to style your navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">CrowdFund</Link> {/* Use Link for routing */}
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li> {/* Link to Home */}
        <li><Link to="/projects">Projects</Link></li> {/* Link to Projects */}
        <li><Link to="/about">About</Link></li> {/* Link to About */}
        <li><Link to="/contact">Contact</Link></li> {/* Link to Contact */}
        <li><Link to="/login" className="login-btn">Login</Link></li> {/* Link to Login */}
        <li><Link to="/signup" className="signup-btn">Sign Up</Link></li> {/* Link to Sign Up */}
      </ul>
    </nav>
  );
};

export default Navbar;
