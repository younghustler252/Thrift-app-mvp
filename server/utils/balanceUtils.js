const Contribution = require('../models/Contribution');
const Payout = require('../models/Payout');

/**
 * Gets total contributions, payouts, balance, and status for a user.
 * Optionally filtered by groupId.
 */
const getUserTotals = async (userId, groupId = null) => {
    const matchStage = groupId
        ? { user: userId, group: groupId }
        : { user: userId };

    const [contributionAgg, payoutAgg] = await Promise.all([
        Contribution.aggregate([
            { $match: matchStage },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Payout.aggregate([
            { $match: matchStage },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
    ]);

    const totalContributions = contributionAgg[0]?.total || 0;
    const totalPayouts = payoutAgg[0]?.total || 0;
    const balance = totalPayouts - totalContributions;

    // Define user status based on balance
    let status;
    if (balance === 0) {
        status = 'settled';
    } else if (balance < 0) {
        status = 'awaiting payout';
    } else {
        status = 'post-payout';
    }

    return {
        totalContributions,
        totalPayouts,
        balance,
        status,
    };
};

module.exports = {
    getUserTotals,
};
