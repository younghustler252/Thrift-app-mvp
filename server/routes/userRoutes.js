const express = require('express');
const userRoutes = express.Router()
const { updateBankInfo , getMyBankInfo, getUserBankInfo} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')


userRoutes.get('/profile', protect, (req, res) => {
  res.json(req.user);
})


// Update/Add bank info
userRoutes.put('/bank-info', protect, updateBankInfo);

// Get own bank info
userRoutes.get('/bank-info', protect, getMyBankInfo);

// Get another user's bank info (e.g. admin)
userRoutes.get('/:id/bank-info', protect, getUserBankInfo);

module.exports = userRoutes;