const express = require('express');
const router = express.Router();

const {
    createPayout,
    completePayout,
    getPayoutsByGroup,
    getMyPayouts,
} = require('../controllers/payoutController');

const { protect, isCreator } = require('../middleware/authMiddleware');
const uploadClodinary = require('../middleware/uploadCloudinary');
const { upload } = require('../config/cloudinary'); // handles Cloudinary/file uploads

// 📌 POST: Create a payout for current cycle (creator only)
router.post('/:groupId', protect, isCreator, createPayout);

// 📌 PUT: Mark payout as completed with proof upload
router.put(
    '/:id/complete',
    protect,
    isCreator,
    upload.single('proof'),
    uploadClodinary,
    completePayout,
);

// 📌 GET: All payouts in a group (member access)
router.get('/group/:groupId', protect, getPayoutsByGroup);

// 📌 GET: My payouts (as receiver)
router.get('/my', protect, getMyPayouts);

module.exports = router;
