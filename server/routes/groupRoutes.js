// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const {
  createGroup,
  getGroups,
  getGroupById,
  joinGroup,
  updateGroup,
  deleteGroup,
  createInvite
} = require('../controllers/groupController');
const { protect, isCreator } = require('../middleware/authMiddleware');

// Create group
router.post('/', protect, createGroup);

// Get all groups user belongs to
router.get('/', protect, getGroups);

// Get specific group
router.get('/:id', protect, getGroupById);

// Join group
router.post('/:id/join', protect, joinGroup);

// Update group (creator only)
router.put('/:id', protect, isCreator, updateGroup);

// Archive group (creator only)
router.delete('/:id', protect, isCreator, deleteGroup);

// Generate invite (creator only)
router.post('/:id/invite', protect, isCreator, createInvite);

module.exports = router;
