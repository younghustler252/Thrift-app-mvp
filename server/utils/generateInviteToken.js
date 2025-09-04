const crypto = require('crypto');

const generateInviteToken = () => {
    return crypto.randomBytes(20).toString('hex'); // secure token
};

module.exports = generateInviteToken;
