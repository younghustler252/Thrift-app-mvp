const asyncHandler = require('express-async-handler');
const { getUserTotals } = require('../utils/balanceUtils.js');
const Contribution = require('../models/Contribution.js');
const Payout = require('../models/Payout.js');

// ✅ 1. [ADMIN] Get balances of **all users in a specific group**
const getGroupUserBalances = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    // Get unique users who have either contributed or been paid in the group
    const [contributors, payees] = await Promise.all([
        Contribution.distinct('user', { group: groupId }),
        Payout.distinct('user', { group: groupId }),
    ]);

    const userIds = [...new Set([...contributors, ...payees])];

    // Get totals per user
    const userBalances = await Promise.all(
        userIds.map(async (userId) => {
            const { totalContributions, totalPayouts, balance, status } =
                await getUserTotals(userId, groupId);

            return {
                userId,
                totalContributions,
                totalPayouts,
                balance,
                status,
            };
        }),
    );

    res.json({
        groupId,
        totalUsers: userBalances.length,
        userBalances,
    });
});

// ✅ 2. [USER] Get **current user** balance in a specific group
const getUserBalance = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    const { totalContributions, totalPayouts, balance, status } =
        await getUserTotals(userId, groupId);

    res.json({
        groupId,
        userId,
        totalContributions,
        totalPayouts,
        balance,
        status,
    });
});

// ✅ 3. [USER] Get **all group balances** the user is involved in
const getAllUserGroupBalances = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get group IDs from user's contributions and payouts
    const [contributionGroups, payoutGroups] = await Promise.all([
        Contribution.distinct('group', { user: userId }),
        Payout.distinct('group', { user: userId }),
    ]);

    const groupIds = [...new Set([...contributionGroups, ...payoutGroups])];

    const groupBalances = await Promise.all(
        groupIds.map(async (groupId) => {
            const { totalContributions, totalPayouts, balance, status } =
                await getUserTotals(userId, groupId);

            return {
                groupId,
                totalContributions,
                totalPayouts,
                balance,
                status,
            };
        }),
    );

    res.json({
        userId,
        groupBalances,
    });
});

// ✅ 4. [USER] Global total balance across all groups
const getGlobalBalance = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const { totalContributions, totalPayouts, balance, status } =
        await getUserTotals(userId);

    res.json({
        userId,
        totalContributions,
        totalPayouts,
        balance,
        status,
    });
});

module.exports = {
    getGroupUserBalances, // ✅ ADMIN - View group summary of users
    getUserBalance, // ✅ USER - Single group
    getAllUserGroupBalances, // ✅ USER - All groups
    getGlobalBalance, // ✅ USER - Global
};
