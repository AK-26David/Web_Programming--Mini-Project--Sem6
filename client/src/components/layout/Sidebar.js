import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ 
  isOpen, 
  toggleSidebar,
  userName = '',
  userAvatar = '',
  onLogout,
  showMobileSidebar = true
}) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');
  
  // Menu items configuration
  const menuItems = [
    {
      section: 'General',
      items: [
        { name: 'Home', path: '/', icon: 'home' },
        { name: 'Explore Projects', path: '/projects', icon: 'search' },
        { name: 'Start a Project', path: '/create-project', icon: 'plus-circle' },
        { name: 'Blog', path: '/blogs', icon: 'book-open' },
        { name: 'Success Stories', path: '/achievements', icon: 'award' },
      ],
    },
    {
      section: 'Account',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: 'grid' },
        { name: 'My Projects', path: '/dashboard/projects', icon: 'folder' },
        { name: 'Contributions', path: '/dashboard/contributions', icon: 'dollar-sign' },
        { name: 'Messages', path: '/dashboard/messages', icon: 'message-circle', badge: 3 },
        { name: 'Settings', path: '/dashboard/settings', icon: 'settings' },
      ],
    },
  ];

  // Toggle section collapse
  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection('');
    } else {
      setActiveSection(section);
    }
  };

  // Check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Render icon based on name
  const renderIcon = (iconName) => {
    const icons = {
      'home': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      'search': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      'plus-circle': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'book-open': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      'award': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      'grid': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      'folder': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      'dollar-sign': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'message-circle': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      'settings': (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };

    return icons[iconName] || null;
  };

  // Mobile sidebar styles (outside of sidebar frame)
  const mobileSidebarClass = showMobileSidebar
    ? `fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`
    : '';

  // Main sidebar styles
  const sidebarClasses = `
    fixed top-0 bottom-0 left-0 z-40
    w-64 bg-white shadow-lg
    transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:z-0
    flex flex-col h-full
  `;

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {showMobileSidebar && (
        <div className={mobileSidebarClass} onClick={toggleSidebar} />
      )}
      
      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* User profile section */}
        {(userName || userAvatar) && (
          <div className="px-4 py-6 bg-blue-600 text-white">
            <div className="flex items-center">
              {userAvatar ? (
                <img 
                  src={userAvatar}
                  alt={`${userName}'s avatar`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-blue-400 flex items-center justify-center text-xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-3">
                <h3 className="font-medium">{userName}</h3>
                <Link to="/profile" className="text-sm text-blue-200 hover:text-white transition-colors">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((menuSection) => (
            <div key={menuSection.section} className="mb-4">
              {/* Section Header */}
              <button
                className="flex items-center justify-between w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
                onClick={() => toggleSection(menuSection.section)}
              >
                <span className="font-medium">{menuSection.section}</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${activeSection === menuSection.section ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Section Items */}
              <div
                className={`transition-all duration-300 ${activeSection === menuSection.section || activeSection === '' ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}
              >
                {menuSection.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`
                      flex items-center justify-between px-6 py-3 text-sm
                      ${isActive(item.path) 
                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{renderIcon(item.icon)}</span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout button */}
        {onLogout && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  userName: PropTypes.string,
  userAvatar: PropTypes.string,
  onLogout: PropTypes.func,
  showMobileSidebar: PropTypes.bool,
};

export default Sidebar;