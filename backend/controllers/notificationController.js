const Notification = require('../models/Notification');

// In-memory fallback list of subscribers for local demo mode
const memorySubscribers = [];

/**
 * @desc    Đăng ký nhận thông báo tour, nhạc mới và ưu đãi
 * @route   POST /api/notifications/subscribe
 * @access  Public
 */
const subscribe = async (req, res) => {
  try {
    const { email, fullName, interests } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp địa chỉ email để đăng ký nhận thông báo.'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Địa chỉ email không đúng định dạng.'
      });
    }

    try {
      let sub = await Notification.findOne({ email: email.toLowerCase() });
      if (sub) {
        return res.status(200).json({
          success: true,
          message: 'Email này đã đăng ký trước đó. Chúng tôi sẽ cập nhật tin tức mới nhất cho bạn!',
          data: sub
        });
      }

      sub = await Notification.create({
        email: email.toLowerCase(),
        fullName: fullName || 'Sky Fan',
        interests: interests || ['music', 'tours'],
        ipAddress: req.ip || ''
      });

      return res.status(201).json({
        success: true,
        message: 'Đăng ký nhận thông báo thành công! Chào mừng bạn đến với cộng đồng Sơn Tùng M-TP.',
        data: sub
      });
    } catch (dbErr) {
      console.warn('[Notification Controller] DB unavailable, saving to memory fallback:', dbErr.message);

      const exists = memorySubscribers.find((s) => s.email === email.toLowerCase());
      if (exists) {
        return res.status(200).json({
          success: true,
          message: 'Email này đã đăng ký trước đó. Bạn sẽ luôn nhận được thông báo sớm nhất!',
          data: exists
        });
      }

      const newSub = {
        _id: 'sub_' + Date.now(),
        email: email.toLowerCase(),
        fullName: fullName || 'Sky Fan',
        interests: interests || ['music', 'tours'],
        subscribedAt: new Date()
      };
      memorySubscribers.push(newSub);

      return res.status(201).json({
        success: true,
        message: 'Đăng ký thành công (Demo Mode)! Chào mừng bạn gia nhập danh sách nhận thông báo ưu tiên.',
        data: newSub
      });
    }
  } catch (error) {
    console.error('[Notification Subscribe Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xử lý đăng ký nhận thông báo: ' + error.message
    });
  }
};

module.exports = {
  subscribe
};
