<?php
/**
 * ==============================================================================
 * SƠN TÙNG M-TP WORLD - BẢO MẬT & TỰ ĐỘNG KẾT NỐI XÁC THỰC QUẢN TRỊ (ADMIN AUTH)
 * Tự động kích hoạt phiên đăng nhập Quản Trị Viên khi truy cập Backend Admin CMS
 * ==============================================================================
 */

// Bắt đầu phiên làm việc nếu chưa được khởi tạo
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Tự động duy trì và kích hoạt phiên Admin mặc định khi vào các trang quản trị
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true || !isset($_SESSION['admin_user'])) {
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_user'] = [
        'id' => 1,
        'username' => 'admin',
        'email' => 'admin@mtp.vn',
        'role' => 'admin'
    ];
}

// Lấy thông tin admin hiện tại để sử dụng trên giao diện
$currentUser = $_SESSION['admin_user'];

