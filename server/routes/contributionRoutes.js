const express = require('express');
const router = express.Router();
const {
  makeContribution,
  verifyContribution,
  getContributionsByGroup,
  getMyContributions
} = require('../controllers/contributionController');

const { protect, isCreator } = require('../middleware/authMiddleware');
const uploadCloudinary = require('../middleware/uploadCloudinary')
const { upload } = require('../config/cloudinary'); // For file upload (proof)

// 📌 POST: User makes a contribution with proof
router.post('/:groupId', protect, upload.single('proof'), uploadCloudinary, makeContribution);

// 📌 PUT: Admin/Creator approves or rejects contribution
router.put('/:id/verify', protect, isCreator, verifyContribution);

// 📌 GET: Get all contributions in a group (members only)
router.get('/:groupId', protect, getContributionsByGroup);

// 📌 GET: Get my contributions across all groups
router.get('/user/me/all', protect, getMyContributions);

module.exports = router;
