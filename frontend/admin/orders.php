<?php
/**
 * ==============================================================================
 * SƠN TÙNG M-TP WORLD - QUẢN LÝ ĐƠN HÀNG MERCHANDISE (ORDERS MANAGEMENT)
 * Xem danh sách fan đã mua Merch thông qua truy vấn JOIN orders & order_details
 * Chỉ thực hiện chức năng XEM theo đúng đặc tả yêu cầu
 * ==============================================================================
 */

// 1. Kiểm tra quyền Admin
require_once __DIR__ . '/includes/auth.php';

// 2. Kết nối CSDL MySQL
require_once __DIR__ . '/../config/db.php';

$page_title = 'Quản Lý Đơn Đặt Hàng';

// 3. Lọc theo trạng thái đơn hàng (Filter status)
$filterStatus = trim($_GET['status'] ?? '');
$whereClause = "";
if (!empty($filterStatus)) {
    $safeStatus = mysqli_real_escape_string($conn, $filterStatus);
    $whereClause = "WHERE o.`status` = '$safeStatus'";
}

// 4. Truy vấn SELECT JOIN từ bảng orders và order_details kết nối với products
$sql = "SELECT 
            o.*,
            COALESCE(SUM(od.quantity), 1) as total_quantity,
            GROUP_CONCAT(CONCAT(COALESCE(p.name, 'Sản phẩm Merch'), ' × ', od.quantity) SEPARATOR ' • ') as item_names
        FROM `orders` o
        LEFT JOIN `order_details` od ON o.id = od.order_id
        LEFT JOIN `products` p ON od.product_id = p.id
        $whereClause
        GROUP BY o.id
        ORDER BY o.created_at DESC";

$result = mysqli_query($conn, $sql);

// 5. Thống kê nhanh các trạng thái
$cntAll = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as c FROM `orders`"))['c'] ?? 0;
$cntPending = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as c FROM `orders` WHERE `status` = 'Pending'"))['c'] ?? 0;
$cntProcessing = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as c FROM `orders` WHERE `status` = 'Processing'"))['c'] ?? 0;
$cntCompleted = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as c FROM `orders` WHERE `status` = 'Completed'"))['c'] ?? 0;

// Nạp Header Dark Minimalist
require_once __DIR__ . '/includes/header.php';
?>

<!-- Tiêu đề trang -->
<div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <h2 class="text-2xl font-black text-white tracking-tight flex items-center gap-2">
      <i class="fa-solid fa-cart-shopping text-amber-400"></i>
      <span>QUẢN LÝ ĐƠN HÀNG MERCH</span>
    </h2>
    <p class="text-xs text-zinc-400 mt-1">
      Danh sách các đơn đặt mua áo, nón, lightstick và phụ kiện của người hâm mộ SKY.
    </p>
  </div>

  <div class="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800">
    <i class="fa-solid fa-eye text-amber-400"></i>
    <span>Chế độ: <strong>Chỉ Xem (Read-Only)</strong></span>
  </div>
</div>

<!-- ========================================================================
     THẺ THỐNG KÊ TRẠNG THÁI ĐƠN HÀNG
     ======================================================================== -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
  <div class="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
    <div>
      <div class="text-[10px] uppercase font-bold text-zinc-500">Tất Cả Đơn</div>
      <div class="text-xl font-black text-white mt-0.5"><?php echo $cntAll; ?></div>
    </div>
    <div class="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs">
      <i class="fa-solid fa-list"></i>
    </div>
  </div>

  <div class="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
    <div>
      <div class="text-[10px] uppercase font-bold text-amber-400">Chờ Xử Lý</div>
      <div class="text-xl font-black text-amber-400 mt-0.5"><?php echo $cntPending; ?></div>
    </div>
    <div class="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-xs">
      <i class="fa-solid fa-clock"></i>
    </div>
  </div>

  <div class="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
    <div>
      <div class="text-[10px] uppercase font-bold text-sky-400">Đang Xử Lý</div>
      <div class="text-xl font-black text-sky-400 mt-0.5"><?php echo $cntProcessing; ?></div>
    </div>
    <div class="w-8 h-8 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center text-xs">
      <i class="fa-solid fa-truck-fast"></i>
    </div>
  </div>

  <div class="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
    <div>
      <div class="text-[10px] uppercase font-bold text-emerald-400">Đã Hoàn Thành</div>
      <div class="text-xl font-black text-emerald-400 mt-0.5"><?php echo $cntCompleted; ?></div>
    </div>
    <div class="w-8 h-8 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center text-xs">
      <i class="fa-solid fa-check"></i>
    </div>
  </div>
</div>

<!-- Thanh Filter Trạng Thái -->
<div class="flex flex-wrap items-center gap-2 mb-6">
  <a href="orders.php" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo empty($filterStatus) ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Tất cả đơn
  </a>
  <a href="orders.php?status=Pending" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo $filterStatus === 'Pending' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Chờ xử lý (Pending)
  </a>
  <a href="orders.php?status=Processing" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo $filterStatus === 'Processing' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Đang giao (Processing)
  </a>
  <a href="orders.php?status=Completed" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo $filterStatus === 'Completed' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Đã giao xong (Completed)
  </a>
  <a href="orders.php?status=Cancelled" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo $filterStatus === 'Cancelled' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Đã hủy (Cancelled)
  </a>
</div>

<!-- ========================================================================
     BẢNG DANH SÁCH ĐƠN HÀNG (DARK TABLE)
     ======================================================================== -->
<div class="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl">
  <div class="overflow-x-auto">
    <table class="w-full text-left text-xs">
      <thead>
        <tr class="text-zinc-400 border-b border-zinc-800/80 uppercase tracking-wider text-[11px] bg-zinc-900/60">
          <th class="py-4 px-6 w-20">Mã Đơn</th>
          <th class="py-4 px-6">Thông Tin Fan Mua Hàng</th>
          <th class="py-4 px-6">Sản Phẩm Đặt Mua</th>
          <th class="py-4 px-6 w-28 text-center">Số Lượng</th>
          <th class="py-4 px-6 w-36">Tổng Tiền</th>
          <th class="py-4 px-6 w-32 text-center">Trạng Thái</th>
          <th class="py-4 px-6 w-36">Thời Gian Đặt</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-900">
        <?php if ($result && mysqli_num_rows($result) > 0): ?>
          <?php while ($ord = mysqli_fetch_assoc($result)): ?>
            <?php
              $badgeClass = 'bg-zinc-800 text-zinc-300';
              if ($ord['status'] === 'Completed') $badgeClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
              elseif ($ord['status'] === 'Processing') $badgeClass = 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
              elseif ($ord['status'] === 'Pending') $badgeClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
              elseif ($ord['status'] === 'Cancelled') $badgeClass = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
            ?>
            <tr class="hover:bg-zinc-900/40 transition">
              <!-- Mã đơn -->
              <td class="py-4 px-6 font-mono font-bold text-amber-400">
                #<?php echo $ord['id']; ?>
              </td>

              <!-- Thông tin người mua -->
              <td class="py-4 px-6">
                <div class="font-bold text-white text-sm">
                  <?php echo htmlspecialchars($ord['customer_name']); ?>
                </div>
                <div class="text-[11px] text-zinc-400 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span><i class="fa-solid fa-phone text-zinc-500 mr-1"></i><?php echo htmlspecialchars($ord['customer_phone']); ?></span>
                  <span><i class="fa-solid fa-envelope text-zinc-500 mr-1"></i><?php echo htmlspecialchars($ord['customer_email']); ?></span>
                </div>
                <?php if (!empty($ord['shipping_address'])): ?>
                  <div class="text-[10px] text-zinc-500 mt-1 line-clamp-1 italic">
                    <i class="fa-solid fa-location-dot text-zinc-600 mr-1"></i><?php echo htmlspecialchars($ord['shipping_address']); ?>
                  </div>
                <?php endif; ?>
              </td>

              <!-- Sản phẩm mua (JOIN từ order_details & products) -->
              <td class="py-4 px-6">
                <div class="text-zinc-200 text-xs font-semibold leading-relaxed">
                  <?php echo htmlspecialchars($ord['item_names'] ?? 'Merchandise Sơn Tùng M-TP'); ?>
                </div>
                <div class="text-[10px] text-zinc-500 mt-0.5">
                  Thanh toán: <span class="text-zinc-400 font-mono"><?php echo htmlspecialchars($ord['payment_method'] ?? 'COD'); ?></span>
                </div>
              </td>

              <!-- Số lượng -->
              <td class="py-4 px-6 text-center">
                <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-300">
                  <?php echo $ord['total_quantity']; ?> món
                </span>
              </td>

              <!-- Tổng tiền -->
              <td class="py-4 px-6">
                <div class="font-black text-amber-400 text-sm">
                  <?php echo number_format($ord['total_amount'], 0, ',', '.'); ?>đ
                </div>
              </td>

              <!-- Trạng thái -->
              <td class="py-4 px-6 text-center">
                <span class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider <?php echo $badgeClass; ?>">
                  <?php echo $ord['status']; ?>
                </span>
              </td>

              <!-- Thời gian -->
              <td class="py-4 px-6 text-zinc-400 text-[11px] whitespace-nowrap">
                📅 <?php echo date('d/m/Y', strtotime($ord['created_at'])); ?>
                <div class="text-[10px] text-zinc-500">
                  <?php echo date('H:i:s', strtotime($ord['created_at'])); ?>
                </div>
              </td>
            </tr>
          <?php endwhile; ?>
        <?php else: ?>
          <tr>
            <td colspan="7" class="py-16 text-center text-zinc-500">
              <i class="fa-solid fa-cart-arrow-down text-3xl mb-3 text-zinc-700 block"></i>
              Không tìm thấy đơn hàng nào trong phân loại này.
            </td>
          </tr>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
