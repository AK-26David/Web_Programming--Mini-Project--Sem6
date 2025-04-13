// server/controllers/projectController.js
const Project = require('../models/Project');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;
  
  const category = req.query.category ? { category: req.query.category } : {};
  const status = req.query.status ? { status: req.query.status } : {};
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i'
        }
      }
    : {};
  
  const count = await Project.countDocuments({ ...keyword, ...category, ...status });
  const projects = await Project.find({ ...keyword, ...category, ...status })
    .populate('creator', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  
  res.json({
    projects,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
exports.getFeaturedProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ status: 'active' })
    .populate('creator', 'name avatar')
    .sort({ currentAmount: -1 })
    .limit(4);
  
  res.json(projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('creator', 'name avatar email')
    .populate('supporters.user', 'name avatar');
  
  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    fundingGoal,
    category,
    coverImage,
    images,
    endDate
  } = req.body;
  
  const project = await Project.create({
    title,
    description,
    fundingGoal,
    category,
    coverImage: coverImage || 'default-project.jpg',
    images: images || [],
    creator: req.user._id,
    endDate
  });
  
  if (project) {
    // Add project to user's created projects
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { createdProjects: project._id } }
    );
    
    res.status(201).json(project);
  } else {
    res.status(400);
    throw new Error('Invalid project data');
  }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  
  // Check if user is project creator
  if (project.creator.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this project');
  }
  
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate('creator', 'name avatar');
  
  res.json(updatedProject);
});

// @desc    Add project update
// @route   POST /api/projects/:id/updates
// @access  Private
exports.addProjectUpdate = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  
  // Check if user is project creator
  if (project.creator.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this project');
  }
  
  project.updates.push({
    title,
    content
  });
  
  await project.save();
  res.status(201).json(project);
});

// @desc    Get user created projects
// @route   GET /api/projects/user/created
// @access  Private
exports.getUserCreatedProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ creator: req.user._id })
    .sort({ createdAt: -1 });
  
  res.json(projects);
});

// @desc    Get user supported projects
// @route   GET /api/projects/user/supported
// @access  Private
exports.getUserSupportedProjects = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('supportedProjects');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  res.json(user.supportedProjects);
});