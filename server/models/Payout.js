// models/Payout.js
const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    receiver: {   // The member who should get paid this cycle
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cycle: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    proofUrl: { // admin uploads transfer receipt proof
        type: String,
        default: null
    },
    paidAt: { type: Date }

}, { timestamps: true });

payoutSchema.index({ group: 1, cycle: 1 });
payoutSchema.index({ receiver: 1 });


module.exports = mongoose.model('Payout', payoutSchema);
