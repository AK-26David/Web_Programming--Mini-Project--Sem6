const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Crowdfunding Platform API');
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit the process with failure
  }
};

// Load model
const Project = require('./models/Project');

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// ✅ POST a new project
app.post('/api/projects', async (req, res) => {
  const { title, description, goal, image, category, creator, deadline } = req.body;

  // Validate required fields
  if (!title || !description || !goal || !creator || !deadline) {
    return res.status(400).json({ message: 'Please provide all required fields: title, description, goal, creator, and deadline.' });
  }

  try {
    const newProject = new Project({
      title,
      description,
      goal,
      image,
      category,
      creator,
      deadline
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
