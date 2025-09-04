const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Group = require('../models/Group');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('not authorized, token failed');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('not authorized, no token');
    }
});

// isGroupAdmin.js
const isCreator = asyncHandler(async (req, res, next) => {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
        res.status(404);
        throw new Error('Group not found');
    }

    const isCreator = group.members.some(
        (m) =>
            m.user.toString() === req.user._id.toString() &&
            m.role === 'creator',
    );
    if (!isCreator) {
        res.status(403);
        throw new Error('Only the group creator can perform this action');
    }

    req.group = group; // pass group forward
    next();
});

// middleware/adminMiddleware.js

const admin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as admin');
    }
});

module.exports = admin;

module.exports = { protect, isCreator, admin };
