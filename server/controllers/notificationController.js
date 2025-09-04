const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Send a notification (call this in other controllers as helper)
// @access  Internal use
const sendNotification = async ({
    userId,
    title,
    message,
    type = 'system',
    data = {},
}) => {
    try {
        const notification = await Notification.create({
            user: userId,
            title,
            message,
            type,
            data,
        });
        return notification;
    } catch (err) {
        console.error('Notification Error:', err.message);
    }
};

// @desc    Get logged-in user's notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({
        createdAt: -1,
    });

    res.json({ success: true, count: notifications.length, notifications });
});

// @desc    Mark single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    if (!notification.isRead) {
        notification.isRead = true;
        await notification.save();
    }

    res.json({ success: true, message: 'Notification marked as read' });
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { $set: { isRead: true } },
    );

    res.json({ success: true, message: 'All notifications marked as read' });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    res.json({ success: true, message: 'Notification deleted' });
});

module.exports = {
    sendNotification, // internal use in other controllers
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
