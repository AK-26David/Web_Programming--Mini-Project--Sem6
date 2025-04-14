import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({
  children,
  showHeader = true,
  showFooter = true,
  showSidebar = false,
  headerProps = {},
  footerProps = {},
  sidebarProps = {},
  contentClassName = '',
  fullWidth = false,
  withPadding = true,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Close sidebar when route changes (on mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);
  
  // Toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Pass hamburger menu toggle function to header
  const extendedHeaderProps = {
    ...headerProps,
    showSidebarToggle: showSidebar,
    toggleSidebar: toggleSidebar,
  };
  
  // Pass sidebar state to sidebar component
  const extendedSidebarProps = {
    ...sidebarProps,
    isOpen: isSidebarOpen,
    toggleSidebar: toggleSidebar,
  };
  
  // Apply different layout based on sidebar visibility
  const contentContainerClasses = `
    flex flex-col 
    ${showSidebar ? 'md:ml-64' : ''}
    min-h-screen
  `;
  
  // Content area classes
  const contentClasses = `
    flex-grow
    ${withPadding ? 'px-4 py-6 md:px-6 lg:px-8' : ''}
    ${fullWidth ? 'w-full' : 'container mx-auto'}
    ${contentClassName}
  `;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Show sidebar if enabled */}
      {showSidebar && <Sidebar {...extendedSidebarProps} />}

      {/* Main content area */}
      <div className={contentContainerClasses}>
        {/* Show header if enabled */}
        {showHeader && <Header {...extendedHeaderProps} />}
        
        {/* Page content */}
        <main className={contentClasses}>
          {children}
        </main>
        
        {/* Show footer if enabled */}
        {showFooter && <Footer {...footerProps} />}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  showHeader: PropTypes.bool,
  showFooter: PropTypes.bool,
  showSidebar: PropTypes.bool,
  headerProps: PropTypes.object,
  footerProps: PropTypes.object,
  sidebarProps: PropTypes.object,
  contentClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
  withPadding: PropTypes.bool,
};

export default Layout;