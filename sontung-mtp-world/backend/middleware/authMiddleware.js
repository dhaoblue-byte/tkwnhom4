const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const User = require('../models/User');

/**
 * Protect routes - Verifies JWT Bearer Token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập. Vui lòng đăng nhập và đính kèm JWT Token (Bearer token).'
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Try finding user in database
    try {
      req.user = await User.findById(decoded.id).select('-password');
    } catch (dbErr) {
      // Fallback if DB is not reachable in dev
      req.user = { _id: decoded.id, email: decoded.email, role: decoded.role || 'fan' };
    }

    if (!req.user) {
      req.user = { _id: decoded.id, email: decoded.email, role: decoded.role || 'fan' };
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn.'
    });
  }
};

/**
 * Authorize specific roles (e.g., admin)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Quyền truy cập bị từ chối. Chỉ dành cho vai trò: ${roles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
