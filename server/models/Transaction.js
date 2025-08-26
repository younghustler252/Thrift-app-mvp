const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    type: {
        type: String,
        enum: ['contribution', 'payout'],
        required: true
    },
    referenceModel: {
        type: String,
        required: true,
        enum: ['Contribution', 'Payout']
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'referenceModel'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

transactionSchema.index({ user: 1 });
transactionSchema.index({ group: 1 });
transactionSchema.index({ referenceModel: 1, referenceId: 1 });
transactionSchema.index({ status: 1 });


module.exports = mongoose.model('Transaction', transactionSchema);
