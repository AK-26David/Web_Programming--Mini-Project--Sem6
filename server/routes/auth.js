// server/routes/auth.js
const express = require('express');
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

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

// server/routes/payments.js
const express = require('express');
const { 
    createOrder, 
    verifyPayment, 
    getPaymentById,
    getUserPayments
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/user', protect, getUserPayments);
router.get('/:id', protect, getPaymentById);

module.exports = router;

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