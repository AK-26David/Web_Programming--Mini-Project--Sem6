import React, { useEffect, useState } from 'react';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import Layout from '../components/layout/Layout';
import ProjectFilters from '../components/projects/ProjectFilters';
import ProjectGrid from '../components/projects/ProjectGrid';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    sortBy: 'newest'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // This would be an actual API call in a real application
        const response = await fetch(
          `/api/projects?page=${currentPage}&category=${filters.category}&status=${filters.status}&sort=${filters.sortBy}&search=${searchQuery}`
        );
        const data = await response.json();
        
        setProjects(data.projects);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage, filters, searchQuery]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  return (
    <Layout>
      <div className="projects-page">
        <div className="page-header">
          <h1>Discover Projects</h1>
          <p>Find and support creative projects that inspire you</p>
        </div>

        <div className="search-section">
          <SearchBar 
            placeholder="Search projects..." 
            onSearch={handleSearch} 
            initialValue={searchQuery}
          />
        </div>

        <div className="projects-content">
          <aside className="filters-sidebar">
            <ProjectFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </aside>

          <main className="projects-main">
            {loading ? (
              <div className="loading-container">
                <p>Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="no-results">
                <h3>No projects found</h3>
                <p>Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                <div className="results-info">
                  <p>Showing {projects.length} projects</p>
                </div>
                <ProjectGrid projects={projects} />
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages}
                  onPageChange={handlePageChange} 
                />
              </>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;