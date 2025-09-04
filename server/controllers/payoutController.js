const asyncHandler = require('express-async-handler');
const Payout = require('../models/Payout');
const Group = require('../models/Group');
const Transaction = require('../models/Transaction');
const { sendNotification } = require('../models/Notification');

// @desc    Create a payout (only when group is ready)
// @route   POST /api/payouts/:groupId
// @access  Private (creator only)
const createPayout = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.readyForPayout)
        return res
            .status(400)
            .json({ message: 'Group is not ready for payout yet' });

    const receiverId = group.currentReceiver;
    if (!receiverId)
        return res.status(400).json({ message: 'No current receiver defined' });

    // Check if payout already created for this cycle
    const existing = await Payout.findOne({
        group: groupId,
        cycle: group.currentCycle,
    });
    if (existing) {
        return res
            .status(400)
            .json({ message: 'Payout already created for this cycle' });
    }

    const payoutAmount = group.members.length * group.contributionAmount;

    // Create payout
    const payout = await Payout.create({
        group: groupId,
        receiver: receiverId,
        cycle: group.currentCycle,
        amount: payoutAmount,
    });

    // Log transaction
    await Transaction.create({
        user: receiverId,
        group: groupId,
        referenceModel: 'Payout',
        referenceId: payout._id,
        amount: payoutAmount,
        status: 'pending',
    });

    res.status(201).json({
        message: 'Payout created',
        payout,
    });
});

// @desc    Mark payout as completed (upload proof)
// @route   PUT /api/payouts/:id/complete
// @access  Private (creator only)
const completePayout = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const payout = await Payout.findById(id);
    if (!payout) return res.status(404).json({ message: 'Payout not found' });
    if (payout.status === 'completed') {
        return res.status(400).json({ message: 'Payout already completed' });
    }

    if (!req.file || !req.file.cloudinaryUrl) {
        return res.status(400).json({ error: 'No proof file uploaded' });
    }

    payout.status = 'completed';
    payout.proofUrl = req.file.cloudinaryUrl;
    await payout.save();

    // Update transaction
    await Transaction.findOneAndUpdate(
        { referenceId: payout._id, referenceModel: 'Payout' },
        { status: 'completed', proofUrl: payout.proofUrl },
    );

    // Advance to next cycle + next receiver
    const group = await Group.findById(payout.group);
    const currentIndex = group.rotationOrder.findIndex(
        (u) => u.toString() === payout.receiver.toString(),
    );
    const nextIndex = (currentIndex + 1) % group.rotationOrder.length;
    group.currentReceiver = group.rotationOrder[nextIndex];
    group.currentCycle += 1;
    group.readyForPayout = false;

    // If all members have received payout, mark group completed
    if (group.currentCycle >= group.rotationOrder.length) {
        group.status = 'completed';
    }

    await group.save();

    // Notify receiver
    await sendNotification({
        user: payout.receiver,
        title: 'You received a payout',
        message: `₦${payout.amount} has been paid to you from ${group.name}`,
        type: 'payout',
        data: {
            groupId: group._id,
            payoutId: payout._id,
        },
    });

    res.status(200).json({
        message: 'Payout completed successfully',
        payout,
    });
});

// @desc    Get all payouts in a group
// @route   GET /api/payouts/:groupId
// @access  Private (members only)
const getPayoutsByGroup = asyncHandler(async (req, res) => {
    const { groupId } = req.params;

    const payouts = await Payout.find({ group: groupId })
        .populate('receiver', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json(payouts);
});

// @desc    Get my payouts (user)
// @route   GET /api/payouts/my
// @access  Private
const getMyPayouts = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const payouts = await Payout.find({ receiver: userId })
        .populate('group', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json(payouts);
});

module.exports = {
    createPayout,
    completePayout,
    getPayoutsByGroup,
    getMyPayouts,
};
