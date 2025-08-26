const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

// @desc    Get all transactions (admin or member), filterable
// @route   GET /api/transactions?group=&type=&status=
// @access  Private
const getAllTransactions = asyncHandler(async (req, res) => {
    const { group, type, status } = req.query;
  
    const filter = {};
    if (group) filter.group = group;

    // Better consistency: use your schema's "type" field directly
    if (type) filter.type = type; 

    if (status) filter.status = status;
        
    const transactions = await Transaction.find(filter)
        .populate('user', 'name email')
        .populate('group', 'name')
        .populate({
            path: 'referenceId',
            select: 'amount cycle status',
            populate: [
                { path: 'user', select: 'name email' },
                { path: 'receiver', select: 'name email' }
            ]
        })
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
});

// @desc    Get all transactions by the logged-in user
// @route   GET /api/transactions/my
// @access  Private
const getMyTransactions = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        res.status(401);
        throw new Error("Not authorized");
    }

    const transactions = await Transaction.find({ user: userId })
        .populate('group', 'name')
        .populate({
            path: 'referenceId',
            select: 'amount cycle status',
            populate: { path: 'group', select: 'name' }
        })
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, transactions });
});

// @desc    Get single transaction detail
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findById(id)
        .populate('user', 'name email')
        .populate('group', 'name')
        .populate({
            path: 'referenceId',
            populate: [
                { path: 'user', select: 'name email' },
                { path: 'receiver', select: 'name email' },
                { path: 'group', select: 'name' }
            ]
        });

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    res.status(200).json({ success: true, transaction });
});

module.exports = {
    getAllTransactions,
    getMyTransactions,
    getTransactionById
};
