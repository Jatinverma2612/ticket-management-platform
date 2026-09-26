const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token containing user id and role
 * @param {Object} user - User object containing _id and role
 * @returns {string} - Signed JWT token
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    secret,
    {
      expiresIn: '7d',
    }
  );
};

module.exports = generateToken;
