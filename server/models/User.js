// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Name is required']
    },
    email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
    },
    role: {
    type: String,
    enum: ['student', 'faculty', 'sponsor'],
    default: 'student'
    },
    avatar: {
    type: String,
    default: 'default-avatar.png'
    },
    department: {
    type: String
    },
    bio: {
    type: String
    },
    createdProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
    }],
    supportedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
    }],
    createdAt: {
    type: Date,
    default: Date.now
    }
}, { timestamps: true });

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
    next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);