const mongoose = require("mongoose");
const OrderSchema = mongoose.Schema({
    isPaid: Boolean,
    amount: Number,
    investor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },

});
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;