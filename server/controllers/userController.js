const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json(user); // password is already removed by toJSON()
});

// @desc    Update or add user's bank info
// @route   PUT /api/users/bank-info
// @access  Private

const updateBankInfo = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    const { bankName, accountNumber, accountName } = req.body;

    if (!bankName || !accountNumber || !accountName) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }

    user.bankInfo = {
        bankName,
        accountNumber,
        accountName,
    };

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Bank info successfully updated',
        data: user.bankInfo,
    });
});

// @desc    Get my bank info
// @route   GET /api/users/bank-info
// @access  Private
const getMyBankInfo = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select(
        'bankInfo name email',
    );

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Bank info retrieved successfully',
        data: {
            name: user.name,
            email: user.email,
            bankInfo: user.bankInfo,
        },
    });
});

// @desc    Get another user's bank info (restricted to group creator/admin)
// @route   GET /api/users/:id/bank-info
// @access  Private (Creator/Admin only)
const getUserBankInfo = asyncHandler(async (req, res) => {
    // middleware (e.g. isCreator or isAdmin) should be added in route
    const targetUserId = req.params.id;

    const user = await User.findById(targetUserId).select(
        'bankInfo name email',
    );

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Bank info retrieved successfully',
        data: {
            name: user.name,
            email: user.email,
            bankInfo: user.bankInfo,
        },
    });
});

module.exports = { updateBankInfo, getMyBankInfo, getUserBankInfo, getProfile };
