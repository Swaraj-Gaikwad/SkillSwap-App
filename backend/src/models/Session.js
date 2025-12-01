const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    startTime: {
        type: Date,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

sessionSchema.index({ participants: 1 });
sessionSchema.index({ startTime: 1 });

module.exports = mongoose.model('Session', sessionSchema);
