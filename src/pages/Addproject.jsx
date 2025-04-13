import React, { useState } from 'react';
import './AddProject.css'; // Import your CSS file for styling

const AddProjectForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    image: '',
    category: 'Tech',
    creator: '',
    deadline: ''
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    // Validate if goal is a valid number (non-negative)
    if (formData.goal < 0) {
      setError('Goal must be a positive number');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Something went wrong');

      const data = await res.json();
      console.log('Project added:', data);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        goal: '',
        image: '',
        category: 'Tech',
        creator: '',
        deadline: ''
      });
    } catch (err) {
      setError('Failed to add project. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="add-project-container">
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit} className="project-form">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Goal Amount:
          <input
            type="number"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Image URL:
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </label>

        <label>
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option>Tech</option>
            <option>Art</option>
            <option>Education</option>
            <option>Health</option>
            <option>Community</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Creator Email:
          <input
            type="email"
            name="creator"
            value={formData.creator}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Deadline:
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="submit-btn">
          Submit Project
        </button>
      </form>

      {success && <p className="success-message">✅ Project submitted successfully!</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddProjectForm;
