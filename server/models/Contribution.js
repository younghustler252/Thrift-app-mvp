const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: [1, 'Amount must be greater than zero'],
        },
        cycle: {
            type: Number,
            required: true,
        },
        proofUrl: {
            type: String,
            default: null, // 🔗 Cloudinary URL of receipt/screenshot
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        datePaid: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);

contributionSchema.index({ group: 1, cycle: 1 });
contributionSchema.index({ user: 1, group: 1 });
contributionSchema.index({ status: 1 });

module.exports = mongoose.model('Contribution', contributionSchema);
