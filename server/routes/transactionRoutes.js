const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  getMyTransactions,
  getTransactionById
} = require('../controllers/transactionController');

const { protect } = require('../middleware/authMiddleware');

// GET /api/transactions?group=&type=&status=
router.get('/', protect, getAllTransactions);

// GET /api/transactions/my
router.get('/my', protect, getMyTransactions);

// GET /api/transactions/:id
router.get('/:id', protect, getTransactionById);

module.exports = router;
