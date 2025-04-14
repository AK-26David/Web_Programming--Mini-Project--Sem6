// server/routes/projects.js
const express = require('express');
const { 
    getProjects, 
    getProjectById, 
    createProject,
    updateProject,
    addProjectUpdate,
    getFeaturedProjects,
    getUserCreatedProjects,
    getUserSupportedProjects
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/user/created', protect, getUserCreatedProjects);
router.get('/user/supported', protect, getUserSupportedProjects);
router.post('/', protect, createProject);
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProject);
router.post('/:id/updates', protect, addProjectUpdate);

module.exports = router;

