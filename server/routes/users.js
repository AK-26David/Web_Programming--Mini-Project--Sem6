// server/routes/users.js
const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all users (admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
    const users = await User.find().select('-password');
    res.json(users);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
    const user = await User.findById(req.params.id)
        .select('-password')
        .populate('createdProjects')
        .populate('supportedProjects');
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
});

module.exports = router;