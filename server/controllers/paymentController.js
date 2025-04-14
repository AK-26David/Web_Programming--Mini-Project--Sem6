const Payment = require('../models/Payment');
const Project = require('../models/Projects');
// We'll use environment variables for Razorpay credentials
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "exists" : "undefined");

/**
 * Create a new payment order
 * @route POST /api/payments/create-order
 * @access Private
 */
const createOrder = async (req, res) => {
  try {
    const { amount, projectId } = req.body;
    
    if (!amount || !projectId) {
      return res.status(400).json({ message: 'Amount and project ID are required' });
    }
    
    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Create order with Razorpay
    const options = {
      amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise)
      currency: "INR",
      receipt: "order_" + Math.random().toString(36).substring(2, 15),
      payment_capture: 1 // Auto-capture
    };
    
    const order = await razorpay.orders.create(options);
    
    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      message: 'Failed to create order',
      error: error.message
    });
  }
};

/**
 * Verify payment after completion
 * @route POST /api/payments/verify
 * @access Private
 */
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature,
      projectId,
      amount
    } = req.body;
    
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !projectId) {
      return res.status(400).json({ 
        message: 'Order ID, Payment ID, Signature, and Project ID are required' 
      });
    }
    
    // Verify signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');
    
    if (digest !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }
    
    // Save payment record
    const payment = new Payment({
      project: projectId,
      supporter: req.user.id,
      amount,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      status: 'completed'
    });
    
    await payment.save();
    
    // Update project funding stats if needed
    await Project.findByIdAndUpdate(projectId, {
      $inc: { currentFunding: amount }
    });
    
    res.status(200).json({
      success: true,
      payment: {
        id: payment._id,
        status: payment.status,
        amount: payment.amount,
        projectId: payment.project,
        timestamp: payment.createdAt
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

/**
 * Get payment details by ID
 * @route GET /api/payments/:id
 * @access Private
 */
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('supporter', 'name email')
      .populate('project', 'title description');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Only allow access to the payment's supporter or the project owner
    if (payment.supporter._id.toString() !== req.user.id) {
      // Check if user is project owner (you would need to fetch the project)
      const project = await Project.findById(payment.project._id);
      if (!project || project.creator.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to access this payment' });
      }
    }
    
    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
};

/**
 * Get all payments for the logged in user
 * @route GET /api/payments/user
 * @access Private
 */
const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ supporter: req.user.id })
      .populate('project', 'title description')
      .sort({ createdAt: -1 }); // Most recent first
    
    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({
      message: 'Failed to fetch payment history',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentById,
  getUserPayments
};