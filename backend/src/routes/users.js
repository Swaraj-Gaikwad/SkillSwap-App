const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, userController.getProfile);

router.put(
    '/profile',
    auth,
    [
        body('name').optional().trim().notEmpty(),
        body('skills').optional().isArray(),
        body('bio').optional().isLength({ max: 500 })
    ],
    userController.updateProfile
);

router.get('/:id', auth, userController.getUserById);

module.exports = router;
