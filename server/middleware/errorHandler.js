// middlewares/errorMiddleware.js

// Not found middleware
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack.red || err.stack);

    const statusCode =
        res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // hide stack in production
    });
};

module.exports = { notFound, errorHandler };
