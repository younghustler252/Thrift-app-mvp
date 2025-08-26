const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler')


// @desc    Update or add user's bank info
// @route   PUT /api/users/bank-info
// @access  Private
const updateBankInfo = asyncHandler(async (req , res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
        
    const {bankName , accountNumber, accountName} = req.body;

    if (!bankName ||!accountNumber || !accountName) {
        res.status(400)
        throw new Error("please all fields are required");
    }

    user.bankInfo ={
        bankName,
        accountNumber,
        accountName
    }
    await user.save();

    res.status(200).json({
        message: 'bank info successfuly updated',
        bankInfo: user.bankInfo,
    })
})

const getMyBankInfo = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('bankInfo name email');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    res.status(200).json({
    success: true,
    data: {
        name: user.name,
        email: user.email,
        bankInfo: user.bankInfo,
    }
});

        
})

// @desc    Get another user's bank info (e.g. group admin)
// @route   GET /api/users/:id/bank-info
// @access  Private

const getUserBankInfo = asyncHandler(async (req, res) => {
    const targetUserId = req.params.id;

    const user = await User.findById(targetUserId).select('bankInfo name email')

    if (!user) {
        res.status(404);
        throw new Error("user not found");
    }
    res.status(200).json({
        name: user.name,
        email: user.email,
        bankInfo: user.bankInfo,
    });
        
})
module.exports = {updateBankInfo, getMyBankInfo, getUserBankInfo};