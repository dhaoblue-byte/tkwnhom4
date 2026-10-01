<?php
/**
 * ==============================================================================
 * SƠN TÙNG M-TP WORLD - FORM THÊM MỚI / SỬA SẢN PHẨM MERCHANDISE
 * Dùng chung cho tạo sản phẩm mới hoặc chỉnh sửa vật phẩm có sẵn
 * ==============================================================================
 */

// 1. Kiểm tra quyền Admin
require_once __DIR__ . '/includes/auth.php';

// 2. Kết nối CSDL MySQL
require_once __DIR__ . '/../config/db.php';

// Xác định chế độ Thêm mới hay Sửa
$editId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$isEditing = ($editId > 0);
$page_title = $isEditing ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Mới Sản Phẩm';

$message = '';
$messageType = '';

// Dữ liệu ban đầu của form
$item = [
    'name' => '',
    'category' => 'Merchandise',
    'price' => 500000,
    'stock' => 100,
    'image' => '',
    'description' => ''
];

// Nếu đang sửa, nạp dữ liệu từ CSDL
if ($isEditing) {
    $stmt = mysqli_query($conn, "SELECT * FROM `products` WHERE `id` = $editId LIMIT 1");
    if ($stmt && mysqli_num_rows($stmt) > 0) {
        $item = mysqli_fetch_assoc($stmt);
    } else {
        header("Location: shop.php?error=notfound");
        exit;
    }
}

// 3. Xử lý gửi biểu mẫu POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $category = trim($_POST['category'] ?? 'Merchandise');
    $price = (float)($_POST['price'] ?? 0);
    $stock = (int)($_POST['stock'] ?? 0);
    $image = trim($_POST['image'] ?? '');
    $description = trim($_POST['description'] ?? '');

    // Kiểm tra tính hợp lệ dữ liệu
    if (empty($name)) {
        $message = 'Vui lòng nhập Tên sản phẩm Merchandise!';
        $messageType = 'danger';
    } elseif ($price <= 0) {
        $message = 'Giá bán sản phẩm phải lớn hơn 0đ!';
        $messageType = 'danger';
    } else {
        // Chống SQL Injection an toàn
        $sName = mysqli_real_escape_string($conn, $name);
        $sCat = mysqli_real_escape_string($conn, $category);
        $sImg = mysqli_real_escape_string($conn, $image);
        $sDesc = mysqli_real_escape_string($conn, $description);

        if ($isEditing) {
            // Cập nhật sản phẩm
            $updateSql = "UPDATE `products` SET 
                `name` = '$sName',
                `category` = '$sCat',
                `price` = $price,
                `stock` = $stock,
                `image` = '$sImg',
                `description` = '$sDesc'
                WHERE `id` = $editId";

            if (mysqli_query($conn, $updateSql)) {
                $message = "Đã cập nhật sản phẩm thành công!";
                $messageType = "success";
                $item = array_merge($item, $_POST);
            } else {
                $message = "Lỗi cập nhật CSDL: " . mysqli_error($conn);
                $messageType = "danger";
            }
        } else {
            // Thêm mới sản phẩm
            $insertSql = "INSERT INTO `products` (`name`, `category`, `price`, `stock`, `image`, `description`) 
                VALUES ('$sName', '$sCat', $price, $stock, '$sImg', '$sDesc')";

            if (mysqli_query($conn, $insertSql)) {
                header("Location: shop.php?msg=created");
                exit;
            } else {
                $message = "Lỗi thêm sản phẩm vào CSDL: " . mysqli_error($conn);
                $messageType = "danger";
            }
        }
    }
}

// Nạp Header Dark Minimalist
require_once __DIR__ . '/includes/header.php';
?>

<!-- Header tiêu đề trang -->
<div class="mb-8 flex items-center justify-between">
  <div>
    <h2 class="text-2xl font-black text-white tracking-tight flex items-center gap-2">
      <i class="fa-solid fa-cart-shopping text-amber-400"></i>
      <span><?php echo $isEditing ? 'CHỈNH SỬA SẢN PHẨM #' . $editId : 'THÊM MỚI SẢN PHẨM MERCH'; ?></span>
    </h2>
    <p class="text-xs text-zinc-400 mt-1">
      <?php echo $isEditing ? 'Cập nhật giá cả, số lượng kho và hình ảnh sản phẩm.' : 'Khởi tạo vật phẩm merchandise mới cho cửa hàng chính thức.'; ?>
    </p>
  </div>

  <a href="shop.php" class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-full border border-zinc-700 transition flex items-center gap-1.5">
    <i class="fa-solid fa-arrow-left"></i>
    <span>Quay Lại Cửa Hàng</span>
  </a>
</div>

<!-- Flash Alert -->
<?php if (!empty($message)): ?>
  <div id="flash-alert" class="mb-6 p-4 rounded-2xl <?php echo $messageType === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'; ?> text-xs flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <i class="fa-solid <?php echo $messageType === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'; ?> text-base"></i>
      <span><?php echo htmlspecialchars($message); ?></span>
    </div>
    <button onclick="this.parentElement.remove()" class="text-zinc-400 hover:text-white">✕</button>
  </div>
<?php endif; ?>

<!-- ========================================================================
     FORM NHẬP LIỆU SẢN PHẨM (DARK FORM)
     ======================================================================== -->
<div class="max-w-4xl bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-8 shadow-2xl">
  <form action="" method="POST" class="space-y-6">
    
    <!-- Hàng 1: Tên sản phẩm & Danh mục -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2">
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Tên Sản Phẩm Merchandise <span class="text-rose-400">*</span>
        </label>
        <input 
          type="text" 
          name="name" 
          required 
          value="<?php echo htmlspecialchars($item['name']); ?>" 
          placeholder="VD: Áo Hoodie \"Chúng Ta Của Tương Lai\" (Black Edition)" 
          class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
        />
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Danh Mục Sản Phẩm <span class="text-rose-400">*</span>
        </label>
        <select 
          name="category" 
          class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
        >
          <option value="Merchandise" <?php echo ($item['category'] === 'Merchandise') ? 'selected' : ''; ?>>Áo Hoodie & T-Shirt</option>
          <option value="Lightstick" <?php echo ($item['category'] === 'Lightstick') ? 'selected' : ''; ?>>Lightstick Cổ Vũ</option>
          <option value="Album" <?php echo ($item['category'] === 'Album') ? 'selected' : ''; ?>>Album & Đĩa Nhạc</option>
          <option value="Accessories" <?php echo ($item['category'] === 'Accessories') ? 'selected' : ''; ?>>Phụ Kiện & Nón</option>
        </select>
      </div>
    </div>

    <!-- Hàng 2: Giá bán & Số lượng tồn kho -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Giá Bán (VNĐ) <span class="text-rose-400">*</span>
        </label>
        <div class="relative">
          <input 
            type="number" 
            name="price" 
            required 
            min="1000"
            step="1000"
            value="<?php echo htmlspecialchars($item['price']); ?>" 
            placeholder="650000" 
            class="w-full pl-4 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
          />
          <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-amber-400 pointer-events-none">
            VNĐ
          </span>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Số Lượng Tồn Kho <span class="text-rose-400">*</span>
        </label>
        <input 
          type="number" 
          name="stock" 
          required 
          min="0"
          value="<?php echo htmlspecialchars($item['stock']); ?>" 
          placeholder="100" 
          class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
        />
      </div>
    </div>

    <!-- Hàng 3: URL Hình ảnh sản phẩm -->
    <div>
      <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
        Đường Dẫn Ảnh Sản Phẩm (Image URL)
      </label>
      <input 
        type="text" 
        name="image" 
        value="<?php echo htmlspecialchars($item['image']); ?>" 
        placeholder="https://images.unsplash.com/... hoặc assets/images/..." 
        class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
      />
    </div>

    <!-- Hàng 4: Mô tả chi tiết -->
    <div>
      <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
        Mô Tả Sản Phẩm & Chất Liệu
      </label>
      <textarea 
        name="description" 
        rows="4" 
        placeholder="Thông tin về chất liệu vải, công nghệ in ấn, tính năng đặc biệt..." 
        class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
      ><?php echo htmlspecialchars($item['description']); ?></textarea>
    </div>

    <!-- Nút Submit Bo Tròn Pill Button -->
    <div class="pt-6 border-t border-zinc-800/80 flex items-center gap-4">
      <button 
        type="submit" 
        class="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-amber-400/20 transition duration-200 flex items-center gap-2"
      >
        <i class="fa-solid fa-floppy-disk"></i>
        <span><?php echo $isEditing ? 'Lưu Sản Phẩm' : 'Đăng Bán Sản Phẩm'; ?></span>
      </button>

      <a 
        href="shop.php" 
        class="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded-full border border-zinc-800 transition"
      >
        Hủy Bỏ
      </a>
    </div>

  </form>
</div>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
