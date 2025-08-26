const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.patch('/:id/read', protect, markAsRead);
router.patch('/mark-all-read', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
