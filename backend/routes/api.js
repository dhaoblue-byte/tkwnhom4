const express = require('express');
const router = express.Router();

// Controllers
const { register, login, getMe } = require('../controllers/authController');
const { getTours, getTourById, createTour, updateTour, deleteTour } = require('../controllers/tourController');
const { getContent, getContentById } = require('../controllers/contentController');
const { getProducts, getProductById, createOrder, createProduct } = require('../controllers/shopController');
const { subscribe } = require('../controllers/notificationController');

// Middlewares
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * =============================================================
 * 1. AUTHENTICATION ROUTES
 * =============================================================
 */
// @route   POST /api/auth/register (Đăng ký tài khoản)
router.post('/auth/register', register);

// @route   POST /api/auth/login (Đăng nhập & nhận JWT Token)
router.post('/auth/login', login);

// @route   GET /api/auth/me (Kiểm tra trạng thái & lấy thông tin user)
router.get('/auth/me', protect, getMe);

/**
 * =============================================================
 * 2. TOUR ROUTES
 * =============================================================
 */
// @route   GET /api/tours (Lấy lịch diễn công khai)
router.get('/tours', getTours);

// @route   GET /api/tours/:id (Chi tiết một show diễn)
router.get('/tours/:id', getTourById);

// @route   POST /api/tours (Thêm show diễn - Chỉ Admin)
router.post('/tours', protect, authorize('admin'), createTour);

// @route   PUT /api/tours/:id (Sửa show diễn - Chỉ Admin)
router.put('/tours/:id', protect, authorize('admin'), updateTour);

// @route   DELETE /api/tours/:id (Xóa show diễn - Chỉ Admin)
router.delete('/tours/:id', protect, authorize('admin'), deleteTour);

/**
 * =============================================================
 * 3. CONTENT ROUTES (MV, AUDIO, BEHIND THE SCENES)
 * =============================================================
 */
// @route   GET /api/content (Lấy nội dung media)
router.get('/content', getContent);

// @route   GET /api/content/:id (Chi tiết nội dung)
router.get('/content/:id', getContentById);

/**
 * =============================================================
 * 4. MERCHANDISE SHOP & ORDER ROUTES
 * =============================================================
 */
// @route   GET /api/products (Danh sách Merchandise)
router.get('/products', getProducts);

// @route   GET /api/products/:id (Chi tiết Merchandise)
router.get('/products/:id', getProductById);

// @route   POST /api/products (Tạo sản phẩm mới - Chỉ Admin)
router.post('/products', protect, authorize('admin'), createProduct);

// @route   POST /api/orders (Đặt hàng Merchandise đơn giản)
router.post('/orders', createOrder);

/**
 * =============================================================
 * 5. NOTIFICATION SUBSCRIPTION
 * =============================================================
 */
// @route   POST /api/notifications/subscribe (Đăng ký nhận tin)
router.post('/notifications/subscribe', subscribe);

/**
 * =============================================================
 * HEALTH CHECK
 * =============================================================
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Sơn Tùng M-TP World API Gateway',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
