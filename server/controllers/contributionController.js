const asyncHandler = require('express-async-handler');
const Contribution = require('../models/Contribution');
const Group = require('../models/Group');
const Transaction = require('../models/Transaction');
const Payout = require('../models/Payout');
const { sendNotification } = require('./notificationController');

// @desc    User makes a contribution
// @route   POST /api/contributions/:groupId
// @access  Private
const makeContribution = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { amount } = req.body;
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group || group.isDeleted) throw new Error('Group not found');

    const isMember = group.members.some(
        (m) => m.user.toString() === userId.toString(),
    );
    if (!isMember) throw new Error('You are not a member of this group');

    const cycle = group.currentCycle;

    // Prevent duplicate contributions for this cycle
    const existing = await Contribution.findOne({
        user: userId,
        group: groupId,
        cycle,
        status: { $in: ['pending', 'approved'] },
    });

    if (existing) {
        return res
            .status(400)
            .json({
                error: "You've already submitted a contribution for this cycle",
            });
    }

    // Validate amount
    if (
        group.contributionType === 'fixed' &&
        amount !== group.contributionAmount
    ) {
        throw new Error(
            `This group requires a fixed amount of ₦${group.contributionAmount}`,
        );
    }

    if (group.contributionType === 'flexible' && (!amount || amount <= 0)) {
        throw new Error('Flexible contributions must be greater than 0');
    }

    if (!req.file || !req.file.cloudinaryUrl) {
        throw new Error('Please upload a valid payment proof');
    }

    // Create contribution
    const contribution = await Contribution.create({
        user: userId,
        group: groupId,
        amount,
        cycle,
        proofUrl: req.file.cloudinaryUrl,
    });

    // Log transaction
    await Transaction.create({
        user: userId,
        group: groupId,
        type: 'contribution', // ✅ match enum
        referenceModel: 'Contribution',
        referenceId: contribution._id,
        amount,
        status: 'pending',
    });

    // Notify group creator
    await sendNotification({
        user: group.createdBy,
        title: 'New Contribution Submitted',
        message: `${req.user.name} submitted a contribution in ${group.name}`,
        type: 'payment',
        data: { groupId, contributionId: contribution._id },
    });

    res.status(201).json({
        message: 'Contribution submitted successfully and is pending approval',
        contribution,
    });
});

// @desc    Approve or reject a contribution
// @route   PUT /api/contributions/:id/verify
// @access  Private (Admin/Creator)
const verifyContribution = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
        throw new Error('Status must be "approved" or "rejected"');
    }

    const contribution = await Contribution.findById(id).populate('user group');
    if (!contribution) throw new Error('Contribution not found');

    if (contribution.status !== 'pending') {
        return res
            .status(400)
            .json({ message: `Already ${contribution.status}` });
    }

    // Only creator can verify
    const group = await Group.findById(contribution.group._id);
    if (!group || group.isDeleted) throw new Error('Group not found');
    if (group.createdBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Only the group creator can verify contributions');
    }

    contribution.status = status;
    await contribution.save();

    // Update matching transaction
    await Transaction.findOneAndUpdate(
        { referenceId: contribution._id, referenceModel: 'Contribution' },
        { status },
    );

    if (status === 'approved') {
        const memberCount = group.members.length;

        // Count how many unique users have approved contributions for this cycle
        const approvedContributions = await Contribution.distinct('user', {
            group: group._id,
            cycle: group.currentCycle,
            status: 'approved',
        });

        const allPaid = approvedContributions.length === memberCount;

        if (allPaid) {
            group.readyForPayout = true;

            // Flexible group payout = sum of contributions
            let payoutAmount;
            if (group.contributionType === 'fixed') {
                payoutAmount = group.members.length * group.contributionAmount;
            } else {
                const cycleContributions = await Contribution.find({
                    group: group._id,
                    cycle: group.currentCycle,
                    status: 'approved',
                });
                payoutAmount = cycleContributions.reduce(
                    (sum, c) => sum + c.amount,
                    0,
                );
            }

            await Payout.create({
                group: group._id,
                receiver: group.currentReceiver,
                cycle: group.currentCycle,
                amount: payoutAmount,
                status: 'pending',
            });

            await group.save();
        }
    }

    // Notify contributor
    await sendNotification({
        user: contribution.user._id,
        title: `Contribution ${status}`,
        message: `Your contribution in ${group.name} was ${status}`,
        type: 'payment',
        data: { groupId: group._id, contributionId: contribution._id },
    });

    res.status(200).json({
        message: `Contribution ${status} successfully`,
        contribution,
    });
});

// @desc    Get contributions for a group
// @route   GET /api/contributions/:groupId
// @access  Private
const getContributionsByGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group || group.isDeleted) throw new Error('Group not found');

    const isMember = group.members.some(
        (m) => m.user.toString() === userId.toString(),
    );
    if (!isMember) throw new Error("You're not a member of this group");

    const contributions = await Contribution.find({ group: groupId })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json(contributions);
});

// @desc    Get logged-in user's contributions across groups
// @route   GET /api/contributions/my
// @access  Private
const getMyContributions = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const contributions = await Contribution.find({ user: userId })
        .populate('group', 'name contributionAmount frequency contributionType')
        .sort({ createdAt: -1 });

    res.status(200).json(contributions);
});

module.exports = {
    makeContribution,
    verifyContribution,
    getContributionsByGroup,
    getMyContributions,
};
