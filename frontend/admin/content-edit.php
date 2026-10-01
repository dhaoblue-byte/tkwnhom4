<?php
/**
 * ==============================================================================
 * SƠN TÙNG M-TP WORLD - FORM THÊM MỚI / CHỈNH SỬA CONTENT
 * Dùng chung cho tạo mới MV/Audio hoặc cập nhật tác phẩm đã có
 * ==============================================================================
 */

// 1. Kiểm tra quyền Admin
require_once __DIR__ . '/includes/auth.php';

// 2. Kết nối CSDL MySQL
require_once __DIR__ . '/../config/db.php';

// Xác định chế độ Thêm mới hay Chỉnh sửa
$editId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$isEditing = ($editId > 0);
$page_title = $isEditing ? 'Chỉnh Sửa Tác Phẩm' : 'Thêm Mới Tác Phẩm';

$message = '';
$messageType = '';

// Dữ liệu mặc định của form
$item = [
    'title' => '',
    'type' => 'MV',
    'artist' => 'Sơn Tùng M-TP',
    'youtube_url' => '',
    'embed_code' => '',
    'thumbnail' => '',
    'views' => '',
    'release_date' => date('Y-m-d'),
    'description' => ''
];

// Nếu đang ở chế độ Chỉnh sửa, truy vấn lấy dữ liệu hiện tại
if ($isEditing) {
    $stmt = mysqli_query($conn, "SELECT * FROM `contents` WHERE `id` = $editId LIMIT 1");
    if ($stmt && mysqli_num_rows($stmt) > 0) {
        $item = mysqli_fetch_assoc($stmt);
    } else {
        header("Location: content.php?error=notfound");
        exit;
    }
}

// 3. Xử lý lưu biểu mẫu qua phương thức POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $type = trim($_POST['type'] ?? 'MV');
    $artist = trim($_POST['artist'] ?? 'Sơn Tùng M-TP');
    $youtube_url = trim($_POST['youtube_url'] ?? '');
    $thumbnail = trim($_POST['thumbnail'] ?? '');
    $views = trim($_POST['views'] ?? '');
    $release_date = trim($_POST['release_date'] ?? date('Y-m-d'));
    $description = trim($_POST['description'] ?? '');

    // Kiểm tra dữ liệu bắt buộc
    if (empty($title)) {
        $message = 'Vui lòng nhập Tiêu đề bài hát / MV!';
        $messageType = 'danger';
    } else {
        // Làm sạch dữ liệu chống SQL Injection
        $sTitle = mysqli_real_escape_string($conn, $title);
        $sType = mysqli_real_escape_string($conn, $type);
        $sArtist = mysqli_real_escape_string($conn, $artist);
        $sYoutube = mysqli_real_escape_string($conn, $youtube_url);
        $sThumbnail = mysqli_real_escape_string($conn, $thumbnail);
        $sViews = mysqli_real_escape_string($conn, $views);
        $sDate = mysqli_real_escape_string($conn, $release_date);
        $sDesc = mysqli_real_escape_string($conn, $description);

        if ($isEditing) {
            // Cập nhật bản ghi có sẵn
            $updateSql = "UPDATE `contents` SET 
                `title` = '$sTitle',
                `type` = '$sType',
                `artist` = '$sArtist',
                `youtube_url` = '$sYoutube',
                `thumbnail` = '$sThumbnail',
                `views` = '$sViews',
                `release_date` = '$sDate',
                `description` = '$sDesc'
                WHERE `id` = $editId";

            if (mysqli_query($conn, $updateSql)) {
                $message = "Đã cập nhật tác phẩm thành công!";
                $messageType = "success";
                // Cập nhật lại biến item để form hiển thị giá trị mới
                $item = array_merge($item, $_POST);
            } else {
                $message = "Lỗi cập nhật CSDL: " . mysqli_error($conn);
                $messageType = "danger";
            }
        } else {
            // Thêm mới bản ghi vào CSDL
            $insertSql = "INSERT INTO `contents` (`title`, `type`, `artist`, `youtube_url`, `thumbnail`, `views`, `release_date`, `description`) 
                VALUES ('$sTitle', '$sType', '$sArtist', '$sYoutube', '$sThumbnail', '$sViews', '$sDate', '$sDesc')";

            if (mysqli_query($conn, $insertSql)) {
                $newId = mysqli_insert_id($conn);
                header("Location: content.php?msg=created");
                exit;
            } else {
                $message = "Lỗi thêm mới CSDL: " . mysqli_error($conn);
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
      <i class="fa-solid fa-pen-to-square text-amber-400"></i>
      <span><?php echo $isEditing ? 'CHỈNH SỬA TÁC PHẨM #' . $editId : 'THÊM MỚI TÁC PHẨM'; ?></span>
    </h2>
    <p class="text-xs text-zinc-400 mt-1">
      <?php echo $isEditing ? 'Cập nhật nội dung MV/Audio đã phát hành.' : 'Đăng tải MV, Audio hoặc tài liệu âm nhạc mới lên hệ thống.'; ?>
    </p>
  </div>

  <a href="content.php" class="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-full border border-zinc-700 transition flex items-center gap-1.5">
    <i class="fa-solid fa-arrow-left"></i>
    <span>Quay Lại Danh Sách</span>
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
     FORM NHẬP LIỆU NỘI DUNG (DARK FORM)
     ======================================================================== -->
<div class="max-w-4xl bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-8 shadow-2xl">
  <form action="" method="POST" class="space-y-6">
    
    <!-- Hàng 1: Tiêu đề & Thể loại -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2">
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Tiêu Đề Tác Phẩm <span class="text-rose-400">*</span>
        </label>
        <input 
          type="text" 
          name="title" 
          required 
          value="<?php echo htmlspecialchars($item['title']); ?>" 
          placeholder="VD: ĐỪNG LÀM TRÁI TIM ANH ĐAU" 
          class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
        />
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Thể Loại <span class="text-rose-400">*</span>
        </label>
        <select 
          name="type" 
          class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
        >
          <option value="MV" <?php echo ($item['type'] === 'MV') ? 'selected' : ''; ?>>Official MV</option>
          <option value="Audio" <?php echo ($item['type'] === 'Audio') ? 'selected' : ''; ?>>Bản Audio</option>
          <option value="BehindTheScenes" <?php echo ($item['type'] === 'BehindTheScenes') ? 'selected' : ''; ?>>Behind The Scenes</option>
          <option value="Gallery" <?php echo ($item['type'] === 'Gallery') ? 'selected' : ''; ?>>Bộ Ảnh / Gallery</option>
        </select>
      </div>
    </div>

    <!-- Hàng 2: Nghệ sĩ & Lượt xem -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Nghệ Sĩ Thể Hiện
        </label>
        <input 
          type="text" 
          name="artist" 
          value="<?php echo htmlspecialchars($item['artist']); ?>" 
          placeholder="Sơn Tùng M-TP" 
          class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
        />
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Lượt Xem / Stream Hiển Thị
        </label>
        <input 
          type="text" 
          name="views" 
          value="<?php echo htmlspecialchars($item['views']); ?>" 
          placeholder="VD: 110M+ views hoặc 50M+ streams" 
          class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
        />
      </div>
    </div>

    <!-- Hàng 3: URL YouTube & Thumbnail -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Liên Kết YouTube / Media URL
        </label>
        <input 
          type="url" 
          name="youtube_url" 
          value="<?php echo htmlspecialchars($item['youtube_url']); ?>" 
          placeholder="https://www.youtube.com/watch?v=..." 
          class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
        />
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Ảnh Bìa / Thumbnail URL
        </label>
        <input 
          type="text" 
          name="thumbnail" 
          id="thumb-input"
          value="<?php echo htmlspecialchars($item['thumbnail']); ?>" 
          placeholder="https://images.unsplash.com/... hoặc đường dẫn ảnh" 
          class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
        />
      </div>
    </div>

    <!-- Hàng 4: Ngày phát hành -->
    <div>
      <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
        Ngày Phát Hành Chính Thức
      </label>
      <input 
        type="date" 
        name="release_date" 
        value="<?php echo htmlspecialchars($item['release_date']); ?>" 
        class="w-full sm:w-64 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
      />
    </div>

    <!-- Hàng 5: Mô tả tác phẩm -->
    <div>
      <label class="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
        Mô Tả Chi Tiết / Cảm Hứng Nghệ Thuật
      </label>
      <textarea 
        name="description" 
        rows="4" 
        placeholder="Giới thiệu về giai điệu, phong cách sản xuất âm nhạc, ekip thực hiện..." 
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
        <span><?php echo $isEditing ? 'Lưu Thay Đổi' : 'Đăng Tác Phẩm'; ?></span>
      </button>

      <a 
        href="content.php" 
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
