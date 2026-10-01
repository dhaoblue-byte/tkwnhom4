<?php
/**
 * ==============================================================================
 * SƠN TÙNG M-TP WORLD - XỬ LÝ ĐĂNG XUẤT ADMIN (LOGOUT HANDLER)
 * Hủy toàn bộ Session và chuyển hướng an toàn về trang login.php
 * ==============================================================================
 */

session_start();

// Xóa tất cả các biến session
$_SESSION = [];

// Xóa cookie phiên nếu có
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Hủy hoàn toàn phiên làm việc
session_destroy();

// Chuyển hướng người dùng về trang đăng nhập
header("Location: login.php");
exit;
