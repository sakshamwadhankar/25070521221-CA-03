const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'flexi_secret_key_student_platform_2026_super_secure',
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;
