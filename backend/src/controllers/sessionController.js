const { validationResult } = require('express-validator');
const Session = require('../models/Session');
const Skill = require('../models/Skill');

exports.createSession = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { skillId, startTime, endTime, notes } = req.body;

        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        const session = new Session({
            skill: skillId,
            participants: [req.userId, skill.owner],
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            notes: notes || '',
            status: 'pending'
        });

        await session.save();
        await session.populate(['skill', { path: 'participants', select: 'name email' }]);

        res.status(201).json({ message: 'Session created successfully', session });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            participants: req.userId
        })
            .populate('skill')
            .populate('participants', 'name email')
            .sort({ startTime: -1 });

        res.json({ sessions, count: sessions.length });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('skill')
            .populate('participants', 'name email bio');

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const isParticipant = session.participants.some(
            p => p._id.toString() === req.userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({ error: 'Not authorized to view this session' });
        }

        res.json({ session });
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateSessionStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const isParticipant = session.participants.some(
            p => p.toString() === req.userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({ error: 'Not authorized to update this session' });
        }

        session.status = status;
        await session.save();
        await session.populate(['skill', { path: 'participants', select: 'name email' }]);

        res.json({ message: 'Session status updated successfully', session });
    } catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
