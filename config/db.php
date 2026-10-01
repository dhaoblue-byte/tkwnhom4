<?php
/**
 * ==============================================================================
 * SƠN TÙNG M-TP WORLD - KẾT NỐI CƠ SỞ DỮ LIỆU MYSQL (DATABASE CONNECTION)
 * Sử dụng PHP thuần & thư viện mở rộng mysqli
 * Tự động đồng bộ cấu trúc bảng và tài khoản Admin mặc định
 * ==============================================================================
 */

// Cấu hình thông số kết nối CSDL XAMPP mặc định
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'music_store_db');

// Khởi tạo kết nối máy chủ MySQL
$conn = @mysqli_connect(DB_HOST, DB_USER, DB_PASS);

if (!$conn) {
    die('<div style="font-family:sans-serif;padding:20px;background:#18181b;color:#f87171;border-radius:12px;margin:20px;border:1px solid #3f3f46;">
        <h3 style="margin-top:0;">❌ Lỗi kết nối máy chủ MySQL</h3>
        <p>Vui lòng đảm bảo dịch vụ MySQL trong XAMPP Control Panel đã được bật (Start).</p>
        <p><small>Chi tiết: ' . mysqli_connect_error() . '</small></p>
    </div>');
}

// Thiết lập mã hóa ký tự UTF-8 Tiếng Việt chuẩn
mysqli_set_charset($conn, 'utf8mb4');

// Tự động kiểm tra và tạo CSDL nếu chưa tồn tại
$dbCheck = mysqli_query($conn, "CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
mysqli_select_db($conn, DB_NAME);

/**
 * ------------------------------------------------------------------------------
 * TỰ ĐỘNG KHỞI TẠO CÁC BẢNG DỮ LIỆU NẾU CHƯA CÓ
 * ------------------------------------------------------------------------------
 */

// 1. Bảng users (Tài khoản quản trị & người dùng)
mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'customer') DEFAULT 'customer',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

// Đảm bảo có ít nhất 1 tài khoản Admin
$adminCheck = mysqli_query($conn, "SELECT id FROM `users` WHERE `role` = 'admin' LIMIT 1");
if (mysqli_num_rows($adminCheck) === 0) {
    $defaultHash = password_hash('admin123', PASSWORD_DEFAULT);
    mysqli_query($conn, "INSERT INTO `users` (`username`, `email`, `password`, `role`) 
        VALUES ('admin', 'admin@mtp.vn', '$defaultHash', 'admin')");
}

// 2. Bảng contents (Quản lý MV, Audio, Media của Sơn Tùng M-TP)
mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `contents` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL DEFAULT 'MV',
    `artist` VARCHAR(100) DEFAULT 'Sơn Tùng M-TP',
    `embed_code` TEXT,
    `youtube_url` VARCHAR(255),
    `thumbnail` VARCHAR(500),
    `views` VARCHAR(50) DEFAULT '0',
    `release_date` DATE,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

// Seed dữ liệu mẫu cho contents nếu bảng rỗng
$contentCheck = mysqli_query($conn, "SELECT id FROM `contents` LIMIT 1");
if (mysqli_num_rows($contentCheck) === 0) {
    // Nếu có dữ liệu từ bảng videos cũ, chép sang contents
    $copyFromVideos = mysqli_query($conn, "INSERT INTO `contents` (`title`, `type`, `artist`, `embed_code`, `youtube_url`, `thumbnail`, `views`, `release_date`, `description`, `created_at`)
        SELECT `title`, 'MV', `artist`, `embed_code`, `embed_code`, `thumbnail`, `views`, `release_date`, `description`, `created_at` FROM `videos`");
    
    // Nếu vẫn chưa có gì, chèn dữ liệu chuẩn Sơn Tùng M-TP
    $contentCount = mysqli_query($conn, "SELECT id FROM `contents` LIMIT 1");
    if (mysqli_num_rows($contentCount) === 0) {
        mysqli_query($conn, "INSERT INTO `contents` (`title`, `type`, `artist`, `youtube_url`, `thumbnail`, `views`, `release_date`, `description`) VALUES
        ('ĐỪNG LÀM TRÁI TIM ANH ĐAU', 'MV', 'Sơn Tùng M-TP', 'https://www.youtube.com/watch?v=abPmFUZQ28M', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80', '110M+ views', '2024-06-08', 'Bản tình ca ngọt ngào mở đầu kỷ nguyên mới đầy tươi sáng và giai điệu bắt tai bậc nhất của Sơn Tùng M-TP.'),
        ('CHÚNG TA CỦA TƯƠNG LAI', 'MV', 'Sơn Tùng M-TP', 'https://www.youtube.com/watch?v=psZ1g9fMfeo', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', '85M+ views', '2024-03-08', 'MV chủ đề không gian đa chiều cyberpunk, tiếp nối câu chuyện Chúng Ta Của Hiện Tại với kỹ xảo hoành tráng.'),
        ('HÃY TRAO CHO ANH (feat. Snoop Dogg)', 'MV', 'Sơn Tùng M-TP', 'https://www.youtube.com/watch?v=knW7-x7Y7RE', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80', '290M+ views', '2019-07-01', 'Cú bắt tay lịch sử giữa Sơn Tùng M-TP và huyền thoại rap US-UK Snoop Dogg tại thung lũng sa mạc California.'),
        ('MUỘN RỒI MÀ SAO CÒN (Live Stage)', 'Audio', 'Sơn Tùng M-TP', 'https://www.youtube.com/watch?v=ywpkS_314h4', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80', '180M+ streams', '2021-04-29', 'Bản pop R&B tươi vui mang năng lượng tích cực kể về tâm trạng tương tư trong đêm muộn.'),
        ('HẬU TRƯỜNG SKY TOUR - KỶ NGUYÊN MỚI', 'BehindTheScenes', 'Sơn Tùng M-TP', 'https://www.youtube.com/@sontungmtp', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80', '2.5M+ views', '2025-02-14', 'Những khoảnh khắc chân thực, giọt mồ hôi và nụ cười sau cánh gà concert cùng ekip M-TP.');");
    }
}

// 3. Bảng products (Sản phẩm Merchandise)
mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `products` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(200) NOT NULL,
    `price` DECIMAL(12,2) NOT NULL,
    `stock` INT NOT NULL DEFAULT 0,
    `description` TEXT,
    `image` VARCHAR(255) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

// Seed sản phẩm nếu bảng rỗng
$prodCheck = mysqli_query($conn, "SELECT id FROM `products` LIMIT 1");
if (mysqli_num_rows($prodCheck) === 0) {
    mysqli_query($conn, "INSERT INTO `products` (`name`, `price`, `stock`, `description`, `image`, `category`) VALUES
    ('Official SKY Lightstick Ver. 2 (Bluetooth Sync)', 650000.00, 250, 'Gậy cổ vũ chính thức thế hệ mới với công nghệ đồng bộ màu sắc tự động theo nhạc tại concert.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', 'Lightstick'),
    ('Áo Hoodie \"Chúng Ta Của Tương Lai\" (Oversized Dark Edition)', 890000.00, 120, 'Chất liệu nỉ bông định lượng cao 420gsm, thêu nổi biểu tượng phát quang dạ quang cao cấp.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', 'Merchandise'),
    ('Album \"CHÚNG TA\" - Deluxe Boxset (Chữ Ký & Photobook)', 1250000.00, 80, 'Bản giới hạn đặc biệt bao gồm CD Master Lossless, Photobook 120 trang in màu và chữ ký nghệ sĩ.', 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80', 'Album'),
    ('Áo T-Shirt \"M-TP World Tour\" - Vintage Black', 450000.00, 200, 'Áo thun cotton 100% thoáng mát, thiết kế form rộng street style đậm chất nghệ sĩ Sơn Tùng M-TP.', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 'Merchandise'),
    ('Nón Bucket Hat \"SKY UNIVERSE\" Thêu Phản Quang', 380000.00, 300, 'Thiết kế tối giản phong cách Dark Gothic thời thượng, phù hợp phối đồ đi concert và dạo phố.', 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80', 'Accessories');");
}

// 4. Bảng orders (Đơn đặt hàng Merchandise)
mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NULL,
    `customer_name` VARCHAR(100) NOT NULL,
    `customer_email` VARCHAR(100) NOT NULL,
    `customer_phone` VARCHAR(20) NOT NULL,
    `shipping_address` TEXT NOT NULL,
    `payment_method` VARCHAR(50) DEFAULT 'COD',
    `total_amount` DECIMAL(12,2) NOT NULL,
    `status` ENUM('Pending', 'Processing', 'Completed', 'Cancelled') DEFAULT 'Pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

// 5. Bảng order_details (Chi tiết sản phẩm trong đơn)
mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `order_details` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `price` DECIMAL(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

// Seed đơn hàng mẫu nếu chưa có đơn nào
$orderCheck = mysqli_query($conn, "SELECT id FROM `orders` LIMIT 1");
if (mysqli_num_rows($orderCheck) === 0) {
    mysqli_query($conn, "INSERT INTO `orders` (`customer_name`, `customer_email`, `customer_phone`, `shipping_address`, `payment_method`, `total_amount`, `status`, `created_at`) VALUES
    ('Nguyễn Văn Tuấn (Sky Hà Nội)', 'tuan.skyhn@gmail.com', '0912345678', 'Số 15 Phố Huế, Hoàn Kiếm, Hà Nội', 'COD', 1540000.00, 'Completed', '2026-09-24 14:20:00'),
    ('Trần Thị Thảo (Sky Sài Gòn)', 'thaotran94@gmail.com', '0988776655', 'Toà nhà Landmark 81, Bình Thạnh, TP.HCM', 'BankTransfer', 890000.00, 'Processing', '2026-09-25 18:45:00'),
    ('Lê Hoàng Phúc', 'phuc.le@yahoo.com', '0903112233', '45 Trần Phú, Hải Châu, Đà Nẵng', 'COD', 650000.00, 'Pending', '2026-09-27 10:15:00');");

    // Chi tiết đơn
    mysqli_query($conn, "INSERT INTO `order_details` (`order_id`, `product_id`, `quantity`, `price`) VALUES
    (1, 1, 1, 650000.00),
    (1, 2, 1, 890000.00),
    (2, 2, 1, 890000.00),
    (3, 1, 1, 650000.00);");
}
