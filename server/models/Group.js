const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
    email: { type: String, required: true },  
    token: { type: String, required: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    invitedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "accepted", "declined", "expired"], default: "pending" },
    expiresAt: { type: Date, required: true }
});

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a group name'],
    },
    description: {
        type: String,
        default: ''
    },
    contributionType: {
        type: String,
        enum: ['fixed', 'flexible'],
        default: 'fixed',
    },
    contributionAmount: {
        type: Number,
        required: function () {
            return this.contributionType === "fixed";
        }
    },
    frequency: {
        type: String,
        required: [true, 'Please add a contribution frequency'],
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date'],
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            role: { 
                type: String, 
                enum: ["creator", "member"], 
                default: "member" 
            },

            joinedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    rotationOrder: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
        },  
    ],
    currentReceiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    currentCycle: {
        type: Number,
        default: 1,
    },
    readyForPayout: { 
        type: Boolean, 
        default: false 
    },
   
    status: {
        type: String,
        enum: ['active', 'completed', 'paused'],
        default: 'active'
    },
    invites: [inviteSchema],
    
    privacy: { type: String, 
        enum: ["private", "public"], 
        default: "private" 
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    
        
}, {timestamps: true});

groupSchema.index({ createdBy: 1 });
groupSchema.index({ status: 1 });
groupSchema.index({ 'invites.email': 1 });


module.exports = mongoose.model('Group', groupSchema);
