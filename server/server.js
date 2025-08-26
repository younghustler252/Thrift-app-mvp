console.log('Thrift App is starting...');

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const payoutRoutes = require('./routes/payoutRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(logger);

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/notifications', notificationRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('✅ Thrift App Backend is running...');
});

// Error handler (should come after routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
