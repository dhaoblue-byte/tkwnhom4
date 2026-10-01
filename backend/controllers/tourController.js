const Tour = require('../models/Tour');

// Dữ liệu mẫu chuẩn cấu trúc mới: title, location, venue, event_date, ticket_link, status
const sampleTours = [
  {
    _id: 'tour_01',
    title: 'SKY TOUR 2026 - THE RESURRECTION',
    location: 'Hà Nội, Việt Nam',
    venue: 'Sân vận động Quốc gia Mỹ Đình',
    event_date: new Date('2026-11-15T19:30:00.000Z'),
    ticket_link: 'https://ticketbox.vn',
    status: 'Upcoming',
    priceRange: '800.000đ - 3.800.000đ',
    description: 'Đêm diễn mở màn siêu bão âm nhạc SKY TOUR tại thủ đô Hà Nội với visual stage 360 độ cực đại.'
  },
  {
    _id: 'tour_02',
    title: 'SKY TOUR 2026 - ELECTRIC NIGHT',
    location: 'TP. Hồ Chí Minh, Việt Nam',
    venue: 'Sân vận động Quân khu 7',
    event_date: new Date('2026-11-28T19:30:00.000Z'),
    ticket_link: 'https://ticketbox.vn',
    status: 'Upcoming',
    priceRange: '850.000đ - 4.500.000đ',
    description: 'Cháy hết mình cùng SKY Sài Gòn trong bữa tiệc âm thanh đẳng cấp quốc tế.'
  },
  {
    _id: 'tour_03',
    title: 'SKY TOUR 2026 - OCEAN BREEZE',
    location: 'Đà Nẵng, Việt Nam',
    venue: 'Cung Thể thao Tiên Sơn',
    event_date: new Date('2026-12-12T19:30:00.000Z'),
    ticket_link: '#',
    status: 'Sold Out',
    priceRange: '650.000đ - 3.200.000đ',
    description: 'Sân khấu ven biển miền Trung với toàn bộ vé đã Sold Out chỉ sau 15 phút mở bán.'
  },
  {
    _id: 'tour_04',
    title: 'M-TP WORLD TOUR - BANGKOK TAKEOVER',
    location: 'Bangkok, Thailand',
    venue: 'Impact Arena Muang Thong Thani',
    event_date: new Date('2027-01-16T19:00:00.000Z'),
    ticket_link: '#',
    status: 'Upcoming',
    priceRange: '1.200.000đ - 6.000.000đ',
    description: 'Bước tiến vươn tầm châu Á của Sơn Tùng M-TP tại đấu trường âm nhạc quốc tế Impact Arena.'
  }
];

/**
 * @desc    Lấy lịch diễn công khai (sắp xếp theo ngày diễn)
 * @route   GET /api/tours
 * @access  Public
 */
const getTours = async (req, res) => {
  try {
    let tours = [];
    try {
      tours = await Tour.find().sort({ event_date: 1 });
    } catch (dbErr) {
      console.warn('[Tour Controller] DB unavailable, using sample data:', dbErr.message);
    }

    if (!tours || tours.length === 0) {
      tours = sampleTours;
    }

    return res.status(200).json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tải danh sách tour: ' + error.message
    });
  }
};

/**
 * @desc    Lấy chi tiết một show diễn
 * @route   GET /api/tours/:id
 * @access  Public
 */
const getTourById = async (req, res) => {
  try {
    let tour;
    try {
      tour = await Tour.findById(req.params.id);
    } catch (dbErr) {
      tour = sampleTours.find((t) => t._id === req.params.id);
    }

    if (!tour) {
      tour = sampleTours.find((t) => t._id === req.params.id);
    }

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tour diễn yêu cầu.'
      });
    }

    return res.status(200).json({
      success: true,
      data: tour
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết tour: ' + error.message
    });
  }
};

/**
 * @desc    Thêm show diễn mới (Dành cho Admin)
 * @route   POST /api/tours
 * @access  Private (Admin only)
 */
const createTour = async (req, res) => {
  try {
    const { title, location, venue, event_date, ticket_link, status, priceRange, description } = req.body;

    if (!title || !location || !venue || !event_date) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ: title, location, venue và event_date.'
      });
    }

    try {
      const newTour = await Tour.create({
        title,
        location,
        venue,
        event_date,
        ticket_link: ticket_link || '#',
        status: status || 'Upcoming',
        priceRange: priceRange || 'Liên hệ',
        description: description || ''
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo show diễn mới thành công!',
        data: newTour
      });
    } catch (dbErr) {
      // Memory fallback in demo mode
      const mockTour = {
        _id: 'tour_mock_' + Date.now(),
        title,
        location,
        venue,
        event_date: new Date(event_date),
        ticket_link: ticket_link || '#',
        status: status || 'Upcoming',
        priceRange,
        description
      };
      sampleTours.push(mockTour);

      return res.status(201).json({
        success: true,
        message: 'Tạo show diễn mới thành công (Demo Mode)!',
        data: mockTour
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo show diễn: ' + error.message
    });
  }
};

/**
 * @desc    Sửa show diễn (Dành cho Admin)
 * @route   PUT /api/tours/:id
 * @access  Private (Admin only)
 */
const updateTour = async (req, res) => {
  try {
    const tourId = req.params.id;

    try {
      let tour = await Tour.findById(tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy show diễn để cập nhật.'
        });
      }

      tour = await Tour.findByIdAndUpdate(tourId, req.body, {
        new: true,
        runValidators: true
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật show diễn thành công!',
        data: tour
      });
    } catch (dbErr) {
      const idx = sampleTours.findIndex((t) => t._id === tourId);
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy show diễn để cập nhật.'
        });
      }

      sampleTours[idx] = { ...sampleTours[idx], ...req.body };
      return res.status(200).json({
        success: true,
        message: 'Cập nhật show diễn thành công (Demo Mode)!',
        data: sampleTours[idx]
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật show diễn: ' + error.message
    });
  }
};

/**
 * @desc    Xóa show diễn (Dành cho Admin)
 * @route   DELETE /api/tours/:id
 * @access  Private (Admin only)
 */
const deleteTour = async (req, res) => {
  try {
    const tourId = req.params.id;

    try {
      const tour = await Tour.findByIdAndDelete(tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy show diễn để xóa.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Xóa show diễn thành công!'
      });
    } catch (dbErr) {
      const idx = sampleTours.findIndex((t) => t._id === tourId);
      if (idx !== -1) {
        sampleTours.splice(idx, 1);
      }
      return res.status(200).json({
        success: true,
        message: 'Xóa show diễn thành công (Demo Mode)!'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi xóa show diễn: ' + error.message
    });
  }
};

module.exports = {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
};
