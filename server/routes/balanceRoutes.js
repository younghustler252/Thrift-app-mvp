const express = require('express');
const {
    getUserBalance,
    getGlobalBalance,
    getAllUserGroupBalances,
    getGroupUserBalances,
} = require('../controllers/balanceController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

/**
 * 👤 User - Get their own balance in a specific group
 * GET /balance/group/:groupId
 */
router.get('/group/:groupId', protect, getUserBalance);

/**
 * 👤 User - Get their balances across all groups
 * GET /balance/groups
 */
router.get('/groups', protect, getAllUserGroupBalances);

/**
 * 👤 User - Get their global balance (total across all groups)
 * GET /balance/global
 */
router.get('/global', protect, getGlobalBalance);

/**
 * 🛡️ Admin/Creator - Get all user balances in a group
 * GET /balance/group/:groupId/users
 */
router.get('/group/:groupId/users', protect, getGroupUserBalances);

module.exports = router;
