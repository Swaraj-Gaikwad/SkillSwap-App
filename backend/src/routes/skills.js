const express = require('express');
const { body } = require('express-validator');
const skillController = require('../controllers/skillController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
    '/',
    auth,
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('tags').optional().isArray(),
        body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    ],
    skillController.createSkill
);

router.get('/', auth, skillController.getAllSkills);

router.get('/match', auth, skillController.matchSkills);

router.get('/:id', auth, skillController.getSkillById);

router.put(
    '/:id',
    auth,
    [
        body('title').optional().trim().notEmpty(),
        body('description').optional().trim().notEmpty(),
        body('tags').optional().isArray(),
        body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    ],
    skillController.updateSkill
);

router.delete('/:id', auth, skillController.deleteSkill);

module.exports = router;
