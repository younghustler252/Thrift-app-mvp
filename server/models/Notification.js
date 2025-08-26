const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['payment', 'payout', 'group', 'system'],
        default: 'system'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,  // Optional: useful for linking (e.g., paymentId, groupId)
        default: {}
    },
    
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1 });


module.exports = mongoose.model('Notification', notificationSchema);
