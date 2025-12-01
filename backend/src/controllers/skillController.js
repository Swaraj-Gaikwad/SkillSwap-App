const { validationResult } = require('express-validator');
const Skill = require('../models/Skill');

exports.createSkill = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, tags, level, availability } = req.body;

        const skill = new Skill({
            title,
            description,
            tags: tags || [],
            level: level || 'intermediate',
            availability: availability || 'available',
            owner: req.userId
        });

        await skill.save();
        await skill.populate('owner', 'name email skills');

        res.status(201).json({ message: 'Skill created successfully', skill });
    } catch (error) {
        console.error('Create skill error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllSkills = async (req, res) => {
    try {
        const { tag, level, search } = req.query;
        const filter = {};

        if (tag) {
            filter.tags = tag.toLowerCase();
        }
        if (level) {
            filter.level = level;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skills = await Skill.find(filter)
            .populate('owner', 'name email skills')
            .sort({ createdAt: -1 });

        res.json({ skills, count: skills.length });
    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id)
            .populate('owner', 'name email skills bio');

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        res.json({ skill });
    } catch (error) {
        console.error('Get skill error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateSkill = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        if (skill.owner.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this skill' });
        }

        const { title, description, tags, level, availability } = req.body;

        if (title) skill.title = title;
        if (description) skill.description = description;
        if (tags) skill.tags = tags;
        if (level) skill.level = level;
        if (availability) skill.availability = availability;

        await skill.save();
        await skill.populate('owner', 'name email skills');

        res.json({ message: 'Skill updated successfully', skill });
    } catch (error) {
        console.error('Update skill error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);

        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        if (skill.owner.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this skill' });
        }

        await skill.deleteOne();

        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Delete skill error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.matchSkills = async (req, res) => {
    try {
        const { tags } = req.query;

        if (!tags) {
            return res.status(400).json({ error: 'Tags parameter is required' });
        }

        const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());

        const matchedSkills = await Skill.aggregate([
            {
                $match: {
                    tags: { $in: tagArray }
                }
            },
            {
                $addFields: {
                    matchCount: {
                        $size: {
                            $setIntersection: ['$tags', tagArray]
                        }
                    }
                }
            },
            {
                $sort: { matchCount: -1, createdAt: -1 }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    'owner.passwordHash': 0
                }
            }
        ]);

        res.json({ skills: matchedSkills, count: matchedSkills.length });
    } catch (error) {
        console.error('Match skills error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
