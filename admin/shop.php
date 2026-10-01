<?php
/**
 * ==============================================================================
 * SƠN TÙNG M-TP WORLD - QUẢN LÝ CỬA HÀNG MERCHANDISE (SHOP MANAGEMENT)
 * Quản lý danh mục các sản phẩm chính thức: Lightstick, Áo, Mũ, Album...
 * ==============================================================================
 */

// 1. Kiểm tra quyền Admin
require_once __DIR__ . '/includes/auth.php';

// 2. Kết nối CSDL MySQL
require_once __DIR__ . '/../config/db.php';

$page_title = 'Quản Lý Sản Phẩm Merchandise';
$flashMessage = '';
$flashType = 'success';

// 3. Xử lý thao tác XÓA Sản phẩm (?action=delete&id=...)
if (isset($_GET['action']) && $_GET['action'] === 'delete' && !empty($_GET['id'])) {
    $deleteId = (int)$_GET['id'];

    $checkSql = "SELECT id, name FROM `products` WHERE `id` = $deleteId LIMIT 1";
    $checkRes = mysqli_query($conn, $checkSql);

    if ($checkRes && mysqli_num_rows($checkRes) > 0) {
        $prod = mysqli_fetch_assoc($checkRes);
        $delSql = "DELETE FROM `products` WHERE `id` = $deleteId";
        if (mysqli_query($conn, $delSql)) {
            $flashMessage = "Đã xóa thành công sản phẩm: \"" . htmlspecialchars($prod['name']) . "\"!";
            $flashType = 'success';
        } else {
            $flashMessage = "Lỗi khi xóa sản phẩm: " . mysqli_error($conn);
            $flashType = 'danger';
        }
    } else {
        $flashMessage = "Không tìm thấy sản phẩm cần xóa!";
        $flashType = 'danger';
    }
}

// 4. Lọc theo danh mục sản phẩm (Category filter)
$filterCat = trim($_GET['category'] ?? '');
$whereClause = "";
if (!empty($filterCat)) {
    $safeCat = mysqli_real_escape_string($conn, $filterCat);
    $whereClause = "WHERE `category` = '$safeCat'";
}

// 5. Lấy danh sách sản phẩm
$sql = "SELECT * FROM `products` $whereClause ORDER BY `id` DESC";
$result = mysqli_query($conn, $sql);

// Nạp Header Dark Minimalist
require_once __DIR__ . '/includes/header.php';
?>

<!-- Tiêu đề trang & Nút Thêm Mới -->
<div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <h2 class="text-2xl font-black text-white tracking-tight flex items-center gap-2">
      <i class="fa-solid fa-shirt text-amber-400"></i>
      <span>QUẢN LÝ SHOP MERCHANDISE</span>
    </h2>
    <p class="text-xs text-zinc-400 mt-1">Quản lý kho hàng, cập nhật giá bán các vật phẩm chính thức của Sơn Tùng M-TP.</p>
  </div>

  <a href="shop-edit.php" class="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-full shadow-lg shadow-amber-400/20 transition flex items-center justify-center gap-2">
    <i class="fa-solid fa-cart-plus text-sm"></i>
    <span>Thêm Sản Phẩm Mới</span>
  </a>
</div>

<!-- Flash Alert thông báo kết quả -->
<?php if (!empty($flashMessage)): ?>
  <div id="flash-alert" class="mb-6 p-4 rounded-2xl <?php echo $flashType === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'; ?> text-xs flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <i class="fa-solid <?php echo $flashType === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'; ?> text-base"></i>
      <span><?php echo $flashMessage; ?></span>
    </div>
    <button onclick="this.parentElement.remove()" class="text-zinc-400 hover:text-white">✕</button>
  </div>
<?php endif; ?>

<!-- Thanh Filter Phân Loại Danh Mục -->
<div class="flex flex-wrap items-center gap-2 mb-6">
  <a href="shop.php" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo empty($filterCat) ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Tất cả mặt hàng
  </a>
  <a href="shop.php?category=Lightstick" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo $filterCat === 'Lightstick' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Lightstick
  </a>
  <a href="shop.php?category=Merchandise" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo $filterCat === 'Merchandise' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Áo Hoodie & T-Shirt
  </a>
  <a href="shop.php?category=Album" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo $filterCat === 'Album' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Album & Đĩa Nhạc
  </a>
  <a href="shop.php?category=Accessories" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo $filterCat === 'Accessories' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Phụ Kiện / Nón
  </a>
</div>

<!-- ========================================================================
     BẢNG SẢN PHẨM MERCHANDISE (DARK TABLE)
     ======================================================================== -->
<div class="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl">
  <div class="overflow-x-auto">
    <table class="w-full text-left text-xs">
      <thead>
        <tr class="text-zinc-400 border-b border-zinc-800/80 uppercase tracking-wider text-[11px] bg-zinc-900/60">
          <th class="py-4 px-6 w-16 text-center">ID</th>
          <th class="py-4 px-6 w-24">Hình Ảnh</th>
          <th class="py-4 px-6">Tên Sản Phẩm & Mô Tả</th>
          <th class="py-4 px-6 w-32">Danh Mục</th>
          <th class="py-4 px-6 w-36">Giá Bán</th>
          <th class="py-4 px-6 w-28 text-center">Tồn Kho</th>
          <th class="py-4 px-6 w-32 text-center">Hành Động</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-900">
        <?php if ($result && mysqli_num_rows($result) > 0): ?>
          <?php while ($prod = mysqli_fetch_assoc($result)): ?>
            <tr class="hover:bg-zinc-900/40 transition">
              <!-- ID -->
              <td class="py-4 px-6 text-center font-mono font-bold text-zinc-500">
                #<?php echo $prod['id']; ?>
              </td>

              <!-- Ảnh sản phẩm -->
              <td class="py-4 px-6">
                <div class="w-16 h-16 rounded-2xl overflow-hidden bg-black border border-zinc-800 flex items-center justify-center p-1">
                  <img 
                    src="<?php echo htmlspecialchars($prod['image'] ?? 'assets/images/hero banner.jpg'); ?>" 
                    alt="<?php echo htmlspecialchars($prod['name']); ?>" 
                    class="w-full h-full object-cover rounded-xl"
                    onerror="this.src='https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80'"
                  />
                </div>
              </td>

              <!-- Tên & Mô tả -->
              <td class="py-4 px-6">
                <div class="font-bold text-white text-sm hover:text-amber-400 transition-colors">
                  <?php echo htmlspecialchars($prod['name']); ?>
                </div>
                <div class="text-zinc-500 text-[11px] line-clamp-2 mt-1 leading-relaxed max-w-md">
                  <?php echo htmlspecialchars($prod['description'] ?? 'Chưa có thông tin mô tả vật phẩm.'); ?>
                </div>
              </td>

              <!-- Danh mục -->
              <td class="py-4 px-6">
                <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-zinc-900 border border-zinc-700 text-zinc-300">
                  <?php echo htmlspecialchars($prod['category'] ?? 'Merchandise'); ?>
                </span>
              </td>

              <!-- Giá bán format VNĐ -->
              <td class="py-4 px-6">
                <span class="font-black text-white text-sm text-amber-400">
                  <?php echo number_format($prod['price'], 0, ',', '.'); ?>đ
                </span>
              </td>

              <!-- Tồn kho -->
              <td class="py-4 px-6 text-center">
                <?php if ($prod['stock'] > 10): ?>
                  <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <?php echo $prod['stock']; ?> chiếc
                  </span>
                <?php elseif ($prod['stock'] > 0): ?>
                  <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Sắp hết: <?php echo $prod['stock']; ?>
                  </span>
                <?php else: ?>
                  <span class="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Hết hàng
                  </span>
                <?php endif; ?>
              </td>

              <!-- Nút Thao tác -->
              <td class="py-4 px-6 text-center">
                <div class="flex items-center justify-center gap-2">
                  <a 
                    href="shop-edit.php?id=<?php echo $prod['id']; ?>" 
                    class="px-3 py-1.5 bg-zinc-900 hover:bg-amber-400 hover:text-black text-zinc-300 border border-zinc-700/80 rounded-xl transition duration-200 font-bold text-[11px] flex items-center gap-1.5"
                    title="Chỉnh sửa sản phẩm"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span>Sửa</span>
                  </a>

                  <a 
                    href="shop.php?action=delete&id=<?php echo $prod['id']; ?>" 
                    onclick="return confirm('Bạn có chắc chắn muốn xóa sản phẩm: <?php echo addslashes($prod['name']); ?>?');"
                    class="px-3 py-1.5 bg-zinc-900 hover:bg-rose-600 hover:text-white text-zinc-400 hover:border-rose-600 border border-zinc-700/80 rounded-xl transition duration-200 font-bold text-[11px] flex items-center gap-1.5"
                    title="Xóa sản phẩm"
                  >
                    <i class="fa-solid fa-trash"></i>
                    <span>Xóa</span>
                  </a>
                </div>
              </td>
            </tr>
          <?php endwhile; ?>
        <?php else: ?>
          <tr>
            <td colspan="7" class="py-16 text-center text-zinc-500">
              <i class="fa-solid fa-bag-shopping text-3xl mb-3 text-zinc-700 block"></i>
              Không tìm thấy sản phẩm nào trong kho Merchandise.
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
