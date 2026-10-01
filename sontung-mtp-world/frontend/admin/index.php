<?php
/**
 * ==============================================================================
 * SƠN TÙNG M-TP WORLD - BẢNG ĐIỀU KHIỂN QUẢN TRỊ (DASHBOARD)
 * Thống kê tổng quan nội dung âm nhạc, sản phẩm Merchandise & đơn hàng
 * ==============================================================================
 */

// 1. Kiểm tra quyền Admin bảo mật
require_once __DIR__ . '/includes/auth.php';

// 2. Kết nối CSDL MySQL
require_once __DIR__ . '/../config/db.php';

// Tiêu đề trang
$page_title = 'Dashboard Thống Kê';

// 3. Truy vấn các chỉ số KPI thống kê tổng quan
// a. Tổng số Content (MV, Audio, Behind The Scenes)
$resContent = mysqli_query($conn, "SELECT COUNT(*) as total FROM `contents`");
$totalContent = $resContent ? (int)mysqli_fetch_assoc($resContent)['total'] : 0;

// b. Tổng số Sản phẩm Merchandise
$resProducts = mysqli_query($conn, "SELECT COUNT(*) as total FROM `products`");
$totalProducts = $resProducts ? (int)mysqli_fetch_assoc($resProducts)['total'] : 0;

// c. Tổng số Đơn hàng
$resOrders = mysqli_query($conn, "SELECT COUNT(*) as total FROM `orders`");
$totalOrders = $resOrders ? (int)mysqli_fetch_assoc($resOrders)['total'] : 0;

// d. Tổng Doanh thu đơn hàng (không tính đơn đã hủy)
$resRevenue = mysqli_query($conn, "SELECT SUM(total_amount) as revenue FROM `orders` WHERE `status` != 'Cancelled'");
$rowRev = $resRevenue ? mysqli_fetch_assoc($resRevenue) : null;
$totalRevenue = ($rowRev && $rowRev['revenue']) ? (float)$rowRev['revenue'] : 0;

// 4. Lấy 5 đơn hàng mới nhất
$recentOrdersQuery = "SELECT * FROM `orders` ORDER BY `created_at` DESC LIMIT 5";
$recentOrders = mysqli_query($conn, $recentOrdersQuery);

// 5. Lấy 4 nội dung MV/Audio mới nhất
$recentContentQuery = "SELECT * FROM `contents` ORDER BY `id` DESC LIMIT 4";
$recentContents = mysqli_query($conn, $recentContentQuery);

// Nạp Header giao diện Dark Minimalist
require_once __DIR__ . '/includes/header.php';
?>

<!-- ========================================================================
     KHỐI TIÊU ĐỀ CHÀO MỪNG DASHBOARD
     ======================================================================== -->
<div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
  <div>
    <h2 class="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
      <span>TỔNG QUAN HỆ THỐNG</span>
      <span class="text-xs px-2.5 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-full font-bold uppercase">Live Stats</span>
    </h2>
    <p class="text-xs text-zinc-400 mt-1">Xin chào <strong class="text-white">@<?php echo htmlspecialchars($currentUser['username']); ?></strong>! Dưới đây là dữ liệu thời gian thực của website Sơn Tùng M-TP World.</p>
  </div>

  <!-- Nút Thao Tác Nhanh -->
  <div class="flex items-center gap-3">
    <a href="content-edit.php" class="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-full border border-zinc-700/80 transition flex items-center gap-2">
      <i class="fa-solid fa-plus text-amber-400"></i>
      <span>Đăng MV Mới</span>
    </a>
    <a href="shop-edit.php" class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-full shadow-lg shadow-amber-400/20 transition flex items-center gap-2">
      <i class="fa-solid fa-cart-plus"></i>
      <span>Thêm Sản Phẩm Merch</span>
    </a>
  </div>
</div>

<!-- ========================================================================
     BẢNG 4 THẺ THỐNG KÊ KPI CHÍNH
     ======================================================================== -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
  
  <!-- KPI 1: Tổng MV & Audio -->
  <div class="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition relative overflow-hidden group">
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Nội Dung Media</span>
      <div class="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
        <i class="fa-solid fa-clapperboard"></i>
      </div>
    </div>
    <div class="text-3xl font-black text-white mb-1"><?php echo number_format($totalContent); ?></div>
    <div class="text-[11px] text-zinc-500 flex items-center gap-1.5">
      <span class="text-emerald-400 font-semibold flex items-center"><i class="fa-solid fa-arrow-trend-up mr-1"></i>MV & Audio</span>
      <span>đang phát trực tuyến</span>
    </div>
  </div>

  <!-- KPI 2: Tổng Sản phẩm Merch -->
  <div class="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition relative overflow-hidden group">
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Merchandise</span>
      <div class="w-10 h-10 rounded-2xl bg-sky-400/10 text-sky-400 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
        <i class="fa-solid fa-shirt"></i>
      </div>
    </div>
    <div class="text-3xl font-black text-white mb-1"><?php echo number_format($totalProducts); ?></div>
    <div class="text-[11px] text-zinc-500 flex items-center gap-1.5">
      <span class="text-sky-400 font-semibold">Áo, Nón, Lightstick</span>
      <span>trong kho</span>
    </div>
  </div>

  <!-- KPI 3: Tổng Đơn Hàng -->
  <div class="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition relative overflow-hidden group">
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Đơn Đặt Hàng</span>
      <div class="w-10 h-10 rounded-2xl bg-purple-400/10 text-purple-400 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
        <i class="fa-solid fa-boxes-packing"></i>
      </div>
    </div>
    <div class="text-3xl font-black text-white mb-1"><?php echo number_format($totalOrders); ?></div>
    <div class="text-[11px] text-zinc-500 flex items-center gap-1.5">
      <span class="text-purple-400 font-semibold">Đơn hàng fan mua</span>
      <span>qua website</span>
    </div>
  </div>

  <!-- KPI 4: Doanh thu Merch -->
  <div class="p-6 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition relative overflow-hidden group">
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs font-bold uppercase tracking-wider text-zinc-400">Doanh Thu Merch</span>
      <div class="w-10 h-10 rounded-2xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
        <i class="fa-solid fa-dong-sign"></i>
      </div>
    </div>
    <div class="text-2xl font-black text-emerald-400 mb-1"><?php echo number_format($totalRevenue, 0, ',', '.'); ?>đ</div>
    <div class="text-[11px] text-zinc-500 flex items-center gap-1.5">
      <span class="text-emerald-400 font-semibold">Doanh số thực tế</span>
      <span>từ fan Sky</span>
    </div>
  </div>

</div>

<!-- ========================================================================
     HAI KHỐI DANH SÁCH CHI TIẾT
     ======================================================================== -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  
  <!-- Cột 1: Danh sách Đơn hàng mới nhất (2/3 chiều rộng) -->
  <div class="lg:col-span-2 bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-6">
    <div class="flex items-center justify-between pb-5 border-b border-zinc-800/80 mb-5">
      <div>
        <h3 class="font-bold text-white text-base">Đơn Hàng Mới Đặt</h3>
        <p class="text-xs text-zinc-400">Danh sách các đơn mua Merch gần đây nhất</p>
      </div>
      <a href="orders.php" class="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5">
        <span>Xem tất cả đơn</span>
        <i class="fa-solid fa-arrow-right text-[10px]"></i>
      </a>
    </div>

    <?php if ($recentOrders && mysqli_num_rows($recentOrders) > 0): ?>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-zinc-500 border-b border-zinc-800/60 pb-2 uppercase tracking-wider text-[10px]">
              <th class="py-3 px-2">Mã Đơn</th>
              <th class="py-3 px-2">Khách Hàng</th>
              <th class="py-3 px-2">Số Tiền</th>
              <th class="py-3 px-2">Trạng Thái</th>
              <th class="py-3 px-2">Thời Gian</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-900">
            <?php while ($ord = mysqli_fetch_assoc($recentOrders)): ?>
              <?php
                // Xác định màu sắc badge trạng thái
                $statusClass = 'bg-zinc-800 text-zinc-300';
                if ($ord['status'] === 'Completed') $statusClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                elseif ($ord['status'] === 'Processing') $statusClass = 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
                elseif ($ord['status'] === 'Pending') $statusClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                elseif ($ord['status'] === 'Cancelled') $statusClass = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
              ?>
              <tr class="hover:bg-zinc-900/40 transition">
                <td class="py-3.5 px-2 font-mono font-bold text-amber-400">#<?php echo $ord['id']; ?></td>
                <td class="py-3.5 px-2">
                  <div class="font-bold text-white"><?php echo htmlspecialchars($ord['customer_name']); ?></div>
                  <div class="text-[11px] text-zinc-500"><?php echo htmlspecialchars($ord['customer_phone']); ?></div>
                </td>
                <td class="py-3.5 px-2 font-bold text-white">
                  <?php echo number_format($ord['total_amount'], 0, ',', '.'); ?>đ
                </td>
                <td class="py-3.5 px-2">
                  <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase <?php echo $statusClass; ?>">
                    <?php echo $ord['status']; ?>
                  </span>
                </td>
                <td class="py-3.5 px-2 text-zinc-400">
                  <?php echo date('d/m/Y H:i', strtotime($ord['created_at'])); ?>
                </td>
              </tr>
            <?php endwhile; ?>
          </tbody>
        </table>
      </div>
    <?php else: ?>
      <div class="py-12 text-center text-zinc-500 text-xs">
        <i class="fa-solid fa-box-open text-2xl mb-2 text-zinc-600 block"></i>
        Chưa có đơn hàng nào trong hệ thống.
      </div>
    <?php endif; ?>
  </div>

  <!-- Cột 2: Tác Phẩm MV / Audio Mới Nhất (1/3 chiều rộng) -->
  <div class="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between">
    <div>
      <div class="flex items-center justify-between pb-5 border-b border-zinc-800/80 mb-5">
        <div>
          <h3 class="font-bold text-white text-base">Tác Phẩm Mới</h3>
          <p class="text-xs text-zinc-400">MV / Audio của Sơn Tùng M-TP</p>
        </div>
        <a href="content.php" class="text-xs font-bold text-amber-400 hover:text-amber-300">
          Xem hết
        </a>
      </div>

      <div class="space-y-4">
        <?php if ($recentContents && mysqli_num_rows($recentContents) > 0): ?>
          <?php while ($c = mysqli_fetch_assoc($recentContents)): ?>
            <div class="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-zinc-900/60 transition group">
              <div class="w-14 h-14 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-zinc-800 relative">
                <img 
                  src="<?php echo htmlspecialchars($c['thumbnail'] ?? 'assets/images/hero banner.jpg'); ?>" 
                  alt="<?php echo htmlspecialchars($c['title']); ?>" 
                  class="w-full h-full object-cover group-hover:scale-105 transition"
                  onerror="this.src='https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[9px] font-black uppercase px-2 py-0.5 bg-zinc-800 text-amber-400 rounded-md">
                    <?php echo htmlspecialchars($c['type'] ?? 'MV'); ?>
                  </span>
                  <span class="text-[10px] text-zinc-500">
                    <?php echo !empty($c['release_date']) ? date('d/m/Y', strtotime($c['release_date'])) : 'Mới'; ?>
                  </span>
                </div>
                <h4 class="font-bold text-white text-xs truncate group-hover:text-amber-400 transition-colors">
                  <?php echo htmlspecialchars($c['title']); ?>
                </h4>
                <div class="text-[10px] text-zinc-500 mt-0.5">
                  🔥 <?php echo htmlspecialchars($c['views'] ?? '0'); ?>
                </div>
              </div>
            </div>
          <?php endwhile; ?>
        <?php else: ?>
          <div class="py-8 text-center text-zinc-500 text-xs">Chưa có nội dung media nào.</div>
        <?php endif; ?>
      </div>
    </div>

    <!-- Nút sang trang quản lý Content -->
    <div class="pt-5 border-t border-zinc-800/80 mt-6">
      <a href="content.php" class="w-full py-2.5 bg-zinc-900 hover:bg-white hover:text-black text-white text-xs font-bold rounded-xl transition text-center block uppercase tracking-wider">
        Quản Lý Toàn Bộ Content
      </a>
    </div>
  </div>

</div>

<?php
// Nạp Footer layout
require_once __DIR__ . '/includes/footer.php';
?>
