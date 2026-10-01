const Content = require('../models/Content');

// Dữ liệu mẫu chuẩn cấu trúc mới: title, type, release_date, youtube_url, cover_image
const sampleContents = [
  {
    _id: 'content_01',
    title: 'ĐỪNG LÀM TRÁI TIM ANH ĐAU',
    type: 'MV',
    release_date: new Date('2024-06-08'),
    cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    youtube_url: 'https://www.youtube.com/watch?v=abPmFUZQ28M',
    duration: '05:32',
    views: '110M+ views',
    description: 'Bản tình ca ngọt ngào làm say lòng hàng triệu khán giả với giai điệu lãng mạn và hình ảnh nên thơ.'
  },
  {
    _id: 'content_02',
    title: 'CHÚNG TA CỦA TƯƠNG LAI',
    type: 'MV',
    release_date: new Date('2024-03-08'),
    cover_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    youtube_url: 'https://www.youtube.com/watch?v=psZ1g9fMfeo',
    duration: '04:45',
    views: '85M+ views',
    description: 'Chương tiếp theo của câu chuyện Chúng Ta Của Hiện Tại với thế giới đa chiều Cyberpunk đầy cảm xúc.'
  },
  {
    _id: 'content_03',
    title: 'HÃY TRAO CHO ANH (feat. Snoop Dogg)',
    type: 'MV',
    release_date: new Date('2019-07-01'),
    cover_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    youtube_url: 'https://www.youtube.com/watch?v=knW7-x7Y7RE',
    duration: '04:22',
    views: '290M+ views',
    description: 'Cú bắt tay lịch sử giữa nghệ sĩ Sơn Tùng M-TP và huyền thoại rap US-UK Snoop Dogg.'
  },
  {
    _id: 'content_04',
    title: 'MUỘN RỒI MÀ SAO CÒN (Live Stage Audio)',
    type: 'Audio',
    release_date: new Date('2021-04-29'),
    cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    youtube_url: 'https://open.spotify.com',
    duration: '04:36',
    views: '180M+ streams',
    description: 'Bản pop r&b tươi vui mang năng lượng tích cực kể về tâm trạng tương tư trong đêm muộn.'
  },
  {
    _id: 'content_05',
    title: 'HẬU TRƯỜNG SKY TOUR - CHÁY HẾT MÌNH CÙNG SKY',
    type: 'BehindTheScenes',
    release_date: new Date('2025-02-14'),
    cover_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    youtube_url: 'https://www.youtube.com/@sontungmtp',
    duration: '18:24',
    views: '2.5M+ views',
    description: 'Những khoảnh khắc chân thực, giọt mồ hôi và nụ cười sau cánh gà concert cùng ekip M-TP.'
  }
];

/**
 * @desc    Lấy danh sách nội dung (MV, Audio, BehindTheScenes)
 * @route   GET /api/content
 * @access  Public
 */
const getContent = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type) {
      // Case-insensitive regex match (e.g. mv, audio, behindthescenes)
      query.type = new RegExp('^' + type + '$', 'i');
    }

    let contents = [];
    try {
      contents = await Content.find(query).sort({ release_date: -1 });
    } catch (dbErr) {
      console.warn('[Content Controller] DB unavailable, using sample data:', dbErr.message);
    }

    if (!contents || contents.length === 0) {
      contents = sampleContents.filter((item) => {
        if (type && item.type.toLowerCase() !== type.toLowerCase()) {
          return false;
        }
        return true;
      });
    }

    return res.status(200).json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tải danh sách nội dung: ' + error.message
    });
  }
};

/**
 * @desc    Lấy chi tiết một nội dung media
 * @route   GET /api/content/:id
 * @access  Public
 */
const getContentById = async (req, res) => {
  try {
    let item;
    try {
      item = await Content.findById(req.params.id);
    } catch (dbErr) {
      item = sampleContents.find((c) => c._id === req.params.id);
    }

    if (!item) {
      item = sampleContents.find((c) => c._id === req.params.id);
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nội dung yêu cầu.'
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết nội dung: ' + error.message
    });
  }
};

module.exports = {
  getContent,
  getContentById
};
