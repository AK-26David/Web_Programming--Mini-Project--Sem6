const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'created'
  },
  paymentMethod: {
    type: String
  },
  items: [{
    // If you want to track items being purchased
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Optional: Create this model if needed
  }],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project' // Reference to your Projects model
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);