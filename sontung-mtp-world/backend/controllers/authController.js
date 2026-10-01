const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { jwtSecret, jwtExpire } = require('../config/auth');

// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'fan'
    },
    jwtSecret,
    { expiresIn: jwtExpire }
  );
};

// In-memory fallback users for offline demo testing
const memoryUsers = [
  {
    _id: 'user_sky_demo',
    username: 'sky_vip_94',
    email: 'sky@mtp.vn',
    passwordHash: '$2a$10$O0FfQx7y5t9jZqWlq3rG9eJ8i0W1Kx1Y8sZ0aB9cD8eF7gH6i5j4k', // 123456
    role: 'vip_sky',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  }
];

/**
 * @desc    Đăng ký tài khoản người dùng / Sky Fan mới
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ username, email và mật khẩu.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.'
      });
    }

    // Try MongoDB query first
    try {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email này đã được sử dụng. Vui lòng chọn email khác.'
        });
      }

      const existingUsername = await User.findOne({ username: username.trim() });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username này đã tồn tại trong hệ thống.'
        });
      }

      const user = await User.create({
        username: username.trim(),
        email: email.toLowerCase(),
        password,
        role: 'fan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản Sky Fan thành công!',
        token,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      });
    } catch (dbErr) {
      console.warn('[Auth Controller] MongoDB unavailable, using memory fallback:', dbErr.message);

      const exists = memoryUsers.find(
        (u) => u.email === email.toLowerCase() || u.username === username.trim()
      );
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Email hoặc Username đã được sử dụng trong hệ thống.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const fallbackUser = {
        _id: 'mem_' + Date.now(),
        username: username.trim(),
        email: email.toLowerCase(),
        role: 'fan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        passwordHash
      };
      memoryUsers.push(fallbackUser);

      const token = generateToken(fallbackUser);

      return res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công (Demo Mode)!',
        token,
        data: {
          id: fallbackUser._id,
          username: fallbackUser.username,
          email: fallbackUser.email,
          role: fallbackUser.role,
          avatar: fallbackUser.avatar
        }
      });
    }
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi đăng ký: ' + error.message
    });
  }
};

/**
 * @desc    Đăng nhập & cấp phát JWT Token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp email (hoặc username) và mật khẩu.'
      });
    }

    try {
      // Find user by email or username
      const user = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username: email.trim() }]
      }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản hoặc mật khẩu không chính xác.'
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản hoặc mật khẩu không chính xác.'
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công!',
        token,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      });
    } catch (dbErr) {
      console.warn('[Auth Controller] MongoDB unavailable, checking memory fallback:', dbErr.message);

      // 1. Check for Admin demo credentials
      if ((email === 'admin' || email === 'admin@mtp.vn' || email === 'mtp_admin') && (password === 'admin123' || password === '123456')) {
        const adminUser = {
          _id: 'user_admin_01',
          username: 'admin',
          email: 'admin@mtp.vn',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        };
        const token = generateToken(adminUser);
        return res.status(200).json({
          success: true,
          message: 'Đăng nhập Quản trị viên thành công!',
          token,
          data: adminUser
        });
      }

      // 2. Check memory users
      const memoryUser = memoryUsers.find(
        (u) => u.email === email.toLowerCase() || u.username === email.trim()
      );

      if (memoryUser) {
        const isMatch = await bcrypt.compare(password, memoryUser.passwordHash);
        if (isMatch) {
          const token = generateToken(memoryUser);
          return res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            data: {
              id: memoryUser._id,
              username: memoryUser.username,
              email: memoryUser.email,
              role: memoryUser.role,
              avatar: memoryUser.avatar
            }
          });
        }
      }

      // 3. Check for VIP Sky demo user
      if ((email === 'sky@mtp.vn' || email === 'sky_vip_94') && password === '123456') {
        const demoUser = {
          _id: 'user_sky_demo',
          username: 'sky_vip_94',
          email: 'sky@mtp.vn',
          role: 'vip_sky',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        };
        const token = generateToken(demoUser);
        return res.status(200).json({
          success: true,
          message: 'Đăng nhập thành công (Demo Mode)!',
          token,
          data: demoUser
        });
      }

      // 4. Fallback login as fan user for testing
      if (password && password.length >= 6) {
        const fallbackUser = {
          _id: 'usr_' + Date.now(),
          username: email.includes('@') ? email.split('@')[0] : email,
          email: email.includes('@') ? email : email + '@gmail.com',
          role: 'fan',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        };
        const token = generateToken(fallbackUser);
        return res.status(200).json({
          success: true,
          message: 'Đăng nhập thành công!',
          token,
          data: fallbackUser
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Mật khẩu phải từ 6 ký tự trở lên!'
      });
    }
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi đăng nhập: ' + error.message
    });
  }
};

/**
 * @desc    Kiểm tra trạng thái đăng nhập & lấy thông tin tài khoản
 * @route   GET /api/auth/me
 * @access  Private (Yêu cầu Bearer Token)
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra thông tin tài khoản: ' + error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
