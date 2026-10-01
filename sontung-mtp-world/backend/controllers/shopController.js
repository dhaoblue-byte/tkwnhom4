const Product = require('../models/Product');
const Order = require('../models/Order');

// Dữ liệu mẫu chuẩn cấu trúc mới: name, price, images, sizes, stock, description
const sampleProducts = [
  {
    _id: 'prod_01',
    name: 'Official SKY Lightstick Ver. 2 (Bluetooth Sync)',
    price: 650000,
    images: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
    ],
    sizes: ['Standard'],
    stock: 250,
    description: 'Gậy cổ vũ chính thức thế hệ mới, đồng bộ hiệu ứng ánh sáng tự động theo từng bài hát concert.',
    category: 'lightstick',
    isBestSeller: true
  },
  {
    _id: 'prod_02',
    name: 'Hoodie "Chúng Ta Của Tương Lai" - Midnight Black',
    price: 890000,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 80,
    description: 'Chất liệu nỉ cotton 100% định lượng cao 380gsm, thêu logo phản quang công nghệ độc quyền.',
    category: 'apparel',
    isBestSeller: true
  },
  {
    _id: 'prod_03',
    name: 'T-Shirt Oversized "M-TP World Tour" - Vintage White',
    price: 450000,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    stock: 120,
    description: 'Form áo rộng rãi chuẩn streetwear thời thượng, in lụa thủ công cao cấp họa tiết world tour.',
    category: 'apparel',
    isBestSeller: false
  },
  {
    _id: 'prod_04',
    name: 'Album "Chúng Ta" Special Boxset + 100p Photobook',
    price: 790000,
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80'
    ],
    sizes: ['Boxset'],
    stock: 50,
    description: 'Hộp đĩa CD cao cấp kèm photobook 100 trang ảnh độc quyền chưa từng công bố, chữ ký in kim loại.',
    category: 'album',
    isBestSeller: true
  }
];

// In-memory fallback orders
const memoryOrders = [];

/**
 * @desc    Lấy danh sách vật phẩm Merchandise
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const { category, bestSeller } = req.query;
    let query = {};
    if (category) query.category = category;
    if (bestSeller === 'true') query.isBestSeller = true;

    let products = [];
    try {
      products = await Product.find(query).sort({ createdAt: -1 });
    } catch (dbErr) {
      console.warn('[Shop Controller] DB unavailable, using sample products:', dbErr.message);
    }

    if (!products || products.length === 0) {
      products = sampleProducts.filter((item) => {
        let match = true;
        if (category && item.category !== category) match = false;
        if (bestSeller === 'true' && !item.isBestSeller) match = false;
        return match;
      });
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tải danh sách sản phẩm: ' + error.message
    });
  }
};

/**
 * @desc    Lấy chi tiết một sản phẩm Merchandise
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    let product;
    try {
      product = await Product.findById(req.params.id);
    } catch (dbErr) {
      product = sampleProducts.find((p) => p._id === req.params.id);
    }

    if (!product) {
      product = sampleProducts.find((p) => p._id === req.params.id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm yêu cầu.'
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi lấy chi tiết sản phẩm: ' + error.message
    });
  }
};

/**
 * @desc    Đặt hàng Merchandise đơn giản (Simple Checkout)
 * @route   POST /api/orders
 * @access  Public (Hỗ trợ cả khách vãng lai lẫn thành viên đăng nhập)
 */
const createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, items, paymentMethod } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin giao hàng và danh sách sản phẩm cần đặt.'
      });
    }

    // Calculate total
    const totalAmount = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);

    const orderData = {
      customerName,
      customerEmail: customerEmail.toLowerCase(),
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      status: 'pending'
    };

    try {
      const order = await Order.create(orderData);
      return res.status(201).json({
        success: true,
        message: 'Đặt hàng thành công! Mã đơn hàng của bạn đã được ghi nhận.',
        data: order
      });
    } catch (dbErr) {
      // Memory fallback for local demo
      const mockOrder = {
        _id: 'order_mock_' + Date.now(),
        ...orderData,
        createdAt: new Date()
      };
      memoryOrders.push(mockOrder);

      return res.status(201).json({
        success: true,
        message: 'Đặt hàng thành công (Demo Mode)! Mã đơn hàng: #' + mockOrder._id,
        data: mockOrder
      });
    }
  } catch (error) {
    console.error('[Order Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi tạo đơn hàng: ' + error.message
    });
  }
};

/**
 * @desc    Thêm sản phẩm mới (Dành cho Admin)
 * @route   POST /api/products
 * @access  Private (Admin only)
 */
const createProduct = async (req, res) => {
  try {
    const { name, price, images, sizes, stock, description, category } = req.body;

    if (!name || !price || !images) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ: name, price và images.'
      });
    }

    try {
      const product = await Product.create({
        name,
        price,
        images,
        sizes: sizes || ['S', 'M', 'L'],
        stock: stock || 100,
        description,
        category: category || 'apparel'
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo sản phẩm Merchandise mới thành công!',
        data: product
      });
    } catch (dbErr) {
      const mockProd = {
        _id: 'prod_mock_' + Date.now(),
        name,
        price,
        images,
        sizes,
        stock,
        description,
        category
      };
      sampleProducts.push(mockProd);

      return res.status(201).json({
        success: true,
        message: 'Tạo sản phẩm mới thành công (Demo Mode)!',
        data: mockProd
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi tạo sản phẩm: ' + error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createOrder,
  createProduct
};
