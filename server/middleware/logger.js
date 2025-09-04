const logger = async (req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} request to ${req.originalUrl}`,
    );
    next();
};

module.exports = logger;
