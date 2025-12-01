const express = require('express');
const { body } = require('express-validator');
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
    '/',
    auth,
    [
        body('skillId').notEmpty().withMessage('Skill ID is required'),
        body('startTime').isISO8601().withMessage('Valid start time is required'),
        body('endTime').isISO8601().withMessage('Valid end time is required')
    ],
    sessionController.createSession
);

router.get('/', auth, sessionController.getMySessions);

router.get('/:id', auth, sessionController.getSessionById);

router.patch(
    '/:id/status',
    auth,
    [
        body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled'])
    ],
    sessionController.updateSessionStatus
);

module.exports = router;
