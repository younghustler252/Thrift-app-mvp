const express = require('express');
const userRoutes = express.Router();
const {
    getProfile,
    updateBankInfo,
    getMyBankInfo,
    getUserBankInfo,
} = require('../controllers/userController');
const { protect, isCreator } = require('../middleware/authMiddleware');

userRoutes.get('/me', protect, getProfile);

// Update/Add bank info
userRoutes.put('/bank-info', protect, updateBankInfo);

// Get own bank info
userRoutes.get('/bank-info', protect, getMyBankInfo);

// Get another user's bank info (e.g. admin)
userRoutes.get('/:id/bank-info', protect, isCreator, getUserBankInfo);

module.exports = userRoutes;
