const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Skill title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 1000
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        default: 'intermediate'
    },
    availability: {
        type: String,
        enum: ['available', 'busy', 'unavailable'],
        default: 'available'
    }
}, {
    timestamps: true
});

skillSchema.index({ tags: 1 });
skillSchema.index({ owner: 1 });

module.exports = mongoose.model('Skill', skillSchema);
