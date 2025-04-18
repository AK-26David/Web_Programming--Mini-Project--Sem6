const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema({
    Project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    ideaRating: {
        type: Number,
        required: true,
    },
    approachRating: {
        type: Number,
        required: true,
    },
    websiteRating: {
        type: Number,
        required: true,
    },
    instagramRating: {
        type: Number,
        required: true,
    },
    overallRating: {
        type: Number,
        required: true,
    }
});
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;