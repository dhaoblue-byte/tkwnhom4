<?php
/**
 * ==============================================================================
 * SƠN TÙNG M-TP WORLD - ADMIN PANEL HEADER & SIDEBAR MENU
 * Giao diện Dark Minimalist chuẩn phong cách Sơn Tùng M-TP (Nền #000000)
 * ==============================================================================
 */

// Xác định trang hiện tại để gán class active cho Sidebar
$current_page = basename($_SERVER['PHP_SELF']);
$admin_name = isset($_SESSION['admin_user']['username']) ? $_SESSION['admin_user']['username'] : 'Admin';
$admin_email = isset($_SESSION['admin_user']['email']) ? $_SESSION['admin_user']['email'] : 'admin@mtp.vn';
?>
<!DOCTYPE html>
<html lang="vi" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo isset($page_title) ? $page_title . ' - M-TP Admin CMS' : 'Sơn Tùng M-TP World - Admin Panel'; ?></title>
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
  
  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- FontAwesome 6 Pro CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              gold: '#fbbf24',
              goldHover: '#f59e0b',
              dark: '#000000',
              surface: '#09090b',
              card: '#121215',
              border: '#27272a'
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <style>
    body {
      background-color: #000000;
      color: #f4f4f5;
      font-family: 'Inter', sans-serif;
    }
    /* Tùy chỉnh thanh cuộn dark */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #09090b;
    }
    ::-webkit-scrollbar-thumb {
      background: #27272a;
      border-radius: 9999px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #3f3f46;
    }
  </style>
</head>
<body class="bg-black text-zinc-100 min-h-screen flex selection:bg-brand-gold selection:text-black">

  <!-- ========================================================================
       SIDEBAR CỐ ĐỊNH BÊN TRÁI (DARK MINIMALIST SIDEBAR)
       ======================================================================== -->
  <aside class="fixed top-0 left-0 h-screen w-64 bg-zinc-950/90 backdrop-blur-xl border-r border-zinc-800/80 flex flex-col justify-between z-40">
    <div>
      <!-- Logo Thương Hiệu M-TP -->
      <div class="h-20 flex items-center px-6 border-b border-zinc-800/60">
        <a href="index.php" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div class="font-black text-sm tracking-wider uppercase text-white group-hover:text-amber-400 transition-colors">SƠN TÙNG M-TP</div>
            <div class="text-[10px] tracking-widest uppercase font-bold text-amber-400/90">ADMIN CMS &bull; V2</div>
          </div>
        </a>
      </div>

      <!-- Menu Điều Hướng Chính -->
      <nav class="p-4 space-y-1.5 text-xs font-bold tracking-wider uppercase">
        <div class="px-3 py-2 text-[10px] tracking-widest text-zinc-500 uppercase font-semibold">Bảng điều khiển</div>
        
        <!-- 1. DASHBOARD -->
        <a href="index.php" class="flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition duration-200 <?php echo ($current_page === 'index.php') ? 'bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-400/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800'; ?>">
          <i class="fa-solid fa-chart-line text-sm w-4 text-center"></i>
          <span>DASHBOARD</span>
        </a>

        <div class="pt-3 px-3 py-2 text-[10px] tracking-widest text-zinc-500 uppercase font-semibold">Nội dung & Cửa hàng</div>

        <!-- 2. CONTENT (MV, AUDIO, BEHIND THE SCENES) -->
        <a href="content.php" class="flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition duration-200 <?php echo ($current_page === 'content.php' || $current_page === 'content-edit.php') ? 'bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-400/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800'; ?>">
          <i class="fa-solid fa-clapperboard text-sm w-4 text-center"></i>
          <span>CONTENT</span>
        </a>

        <!-- 3. SHOP (MERCHANDISE PRODUCTS) -->
        <a href="shop.php" class="flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition duration-200 <?php echo ($current_page === 'shop.php' || $current_page === 'shop-edit.php') ? 'bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-400/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800'; ?>">
          <i class="fa-solid fa-shirt text-sm w-4 text-center"></i>
          <span>SHOP</span>
        </a>

        <!-- 4. ORDERS (MERCH ORDERS) -->
        <a href="orders.php" class="flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition duration-200 <?php echo ($current_page === 'orders.php') ? 'bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-400/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800'; ?>">
          <i class="fa-solid fa-cart-shopping text-sm w-4 text-center"></i>
          <span>ORDERS</span>
        </a>

        <!-- GHI CHÚ: Menu TOUR / CONCERT tạm thời ẩn theo yêu cầu giai đoạn này -->
      </nav>
    </div>

    <!-- Khu vực Footer Sidebar & Đăng xuất -->
    <div class="p-4 border-t border-zinc-800/60 bg-zinc-950/60 space-y-3">
      <!-- Nút xem website người dùng -->
      <a href="../frontend/index.html" target="_blank" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800/80 transition group">
        <span class="flex items-center gap-2">
          <i class="fa-solid fa-arrow-up-right-from-square text-amber-400"></i>
          <span>Xem Website</span>
        </span>
        <i class="fa-solid fa-chevron-right text-[10px] text-zinc-600 group-hover:translate-x-0.5 transition-transform"></i>
      </a>

      <!-- 5. LOGOUT -->
      <a href="logout.php" onclick="return confirm('Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?');" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-white hover:bg-rose-600/90 border border-rose-500/20 hover:border-rose-600 transition duration-200">
        <i class="fa-solid fa-arrow-right-from-bracket text-sm w-4 text-center"></i>
        <span>LOGOUT</span>
      </a>
    </div>
  </aside>

  <!-- ========================================================================
       KHU VỰC NỘI DUNG CHÍNH (MAIN CONTENT AREA)
       ======================================================================== -->
  <div class="flex-1 ml-64 flex flex-col min-h-screen bg-black">
    <!-- Topbar Điều Khiển -->
    <header class="h-20 sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-zinc-800/80 px-8 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Trang Quản Trị</span>
        <span class="text-zinc-600 text-xs">/</span>
        <h1 class="text-base font-extrabold text-white tracking-wide"><?php echo isset($page_title) ? $page_title : 'Dashboard'; ?></h1>
      </div>

      <!-- User Profile Badge -->
      <div class="flex items-center gap-4">
        <div class="text-right hidden sm:block">
          <div class="text-xs font-bold text-white leading-tight">@<?php echo htmlspecialchars($admin_name); ?></div>
          <div class="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Hệ Thống Quản Trị</div>
        </div>
        <div class="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700/80 flex items-center justify-center font-bold text-amber-400 text-sm shadow-md">
          <i class="fa-solid fa-user-shield"></i>
        </div>
      </div>
    </header>

    <!-- Thân trang nội dung bắt đầu từ đây -->
    <main class="flex-1 p-8">
