<?php
/**
 * ==============================================================================
 * SƠN TÙNG M-TP WORLD - QUẢN LÝ NỘI DUNG MEDIA (CONTENT MANAGEMENT)
 * Danh sách MV, Audio, Phim tài liệu/Behind the scenes của Sơn Tùng M-TP
 * ==============================================================================
 */

// 1. Kiểm tra quyền Admin
require_once __DIR__ . '/includes/auth.php';

// 2. Kết nối CSDL MySQL
require_once __DIR__ . '/../config/db.php';

$page_title = 'Quản Lý Content & MV';
$flashMessage = '';
$flashType = 'success';

// 3. Xử lý thao tác XÓA (Delete Content) qua tham số GET ?action=delete&id=...
if (isset($_GET['action']) && $_GET['action'] === 'delete' && !empty($_GET['id'])) {
    $deleteId = (int)$_GET['id'];
    
    // Kiểm tra bản ghi tồn tại
    $checkSql = "SELECT id, title FROM `contents` WHERE `id` = $deleteId LIMIT 1";
    $checkRes = mysqli_query($conn, $checkSql);
    
    if ($checkRes && mysqli_num_rows($checkRes) > 0) {
        $item = mysqli_fetch_assoc($checkRes);
        $delSql = "DELETE FROM `contents` WHERE `id` = $deleteId";
        if (mysqli_query($conn, $delSql)) {
            $flashMessage = "Đã xóa thành công tác phẩm: \"" . htmlspecialchars($item['title']) . "\"!";
            $flashType = 'success';
        } else {
            $flashMessage = "Lỗi xóa dữ liệu: " . mysqli_error($conn);
            $flashType = 'danger';
        }
    } else {
        $flashMessage = "Không tìm thấy nội dung cần xóa!";
        $flashType = 'danger';
    }
}

// 4. Lọc nội dung theo phân loại (filter type)
$filterType = trim($_GET['type'] ?? '');
$whereClause = "";
if (!empty($filterType)) {
    $safeType = mysqli_real_escape_string($conn, $filterType);
    $whereClause = "WHERE `type` = '$safeType'";
}

// 5. Truy vấn danh sách toàn bộ nội dung
$sql = "SELECT * FROM `contents` $whereClause ORDER BY `id` DESC";
$result = mysqli_query($conn, $sql);

// Nạp Header Dark Minimalist
require_once __DIR__ . '/includes/header.php';
?>

<!-- Tiêu đề trang & Nút thêm mới -->
<div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <h2 class="text-2xl font-black text-white tracking-tight flex items-center gap-2">
      <i class="fa-solid fa-clapperboard text-amber-400"></i>
      <span>QUẢN LÝ CONTENT & MEDIA</span>
    </h2>
    <p class="text-xs text-zinc-400 mt-1">Danh sách MV, Audio, Hậu trường chính thức của nghệ sĩ Sơn Tùng M-TP.</p>
  </div>

  <a href="content-edit.php" class="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-full shadow-lg shadow-amber-400/20 transition flex items-center justify-center gap-2">
    <i class="fa-solid fa-plus text-sm"></i>
    <span>Thêm Tác Phẩm Mới</span>
  </a>
</div>

<!-- Thông báo Flash Alert -->
<?php if (!empty($flashMessage)): ?>
  <div id="flash-alert" class="mb-6 p-4 rounded-2xl <?php echo $flashType === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'; ?> text-xs flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <i class="fa-solid <?php echo $flashType === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'; ?> text-base"></i>
      <span><?php echo $flashMessage; ?></span>
    </div>
    <button onclick="this.parentElement.remove()" class="text-zinc-400 hover:text-white">✕</button>
  </div>
<?php endif; ?>

<!-- Thanh Filter Phân Loại -->
<div class="flex flex-wrap items-center gap-2 mb-6">
  <a href="content.php" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo empty($filterType) ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Tất cả thể loại
  </a>
  <a href="content.php?type=MV" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo $filterType === 'MV' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Official MV
  </a>
  <a href="content.php?type=Audio" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo $filterType === 'Audio' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Bản Audio
  </a>
  <a href="content.php?type=BehindTheScenes" class="px-4 py-2 rounded-xl text-xs font-bold transition <?php echo $filterType === 'BehindTheScenes' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'; ?>">
    Behind The Scenes
  </a>
</div>

<!-- ========================================================================
     BẢNG DANH SÁCH TÁC PHẨM (DARK TABLE)
     ======================================================================== -->
<div class="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl">
  <div class="overflow-x-auto">
    <table class="w-full text-left text-xs">
      <thead>
        <tr class="text-zinc-400 border-b border-zinc-800/80 uppercase tracking-wider text-[11px] bg-zinc-900/60">
          <th class="py-4 px-6 w-16 text-center">ID</th>
          <th class="py-4 px-6 w-32">Thumbnail</th>
          <th class="py-4 px-6">Tiêu Đề & Mô Tả</th>
          <th class="py-4 px-6 w-28">Thể Loại</th>
          <th class="py-4 px-6 w-32">Lượt Xem</th>
          <th class="py-4 px-6 w-32">Ngày Ra Mắt</th>
          <th class="py-4 px-6 w-32 text-center">Hành Động</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-zinc-900">
        <?php if ($result && mysqli_num_rows($result) > 0): ?>
          <?php while ($row = mysqli_fetch_assoc($result)): ?>
            <tr class="hover:bg-zinc-900/40 transition">
              <!-- ID -->
              <td class="py-4 px-6 text-center font-mono font-bold text-zinc-500">
                #<?php echo $row['id']; ?>
              </td>

              <!-- Thumbnail -->
              <td class="py-4 px-6">
                <div class="w-24 h-14 rounded-xl overflow-hidden bg-black border border-zinc-800 relative group">
                  <img 
                    src="<?php echo htmlspecialchars($row['thumbnail'] ?? $row['cover_image'] ?? 'assets/images/hero banner.jpg'); ?>" 
                    alt="<?php echo htmlspecialchars($row['title']); ?>" 
                    class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onerror="this.src='https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'"
                  />
                  <?php if (!empty($row['youtube_url'])): ?>
                    <a href="<?php echo htmlspecialchars($row['youtube_url']); ?>" target="_blank" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                      <i class="fa-solid fa-play text-xs"></i>
                    </a>
                  <?php endif; ?>
                </div>
              </td>

              <!-- Tiêu Đề & Mô Tả -->
              <td class="py-4 px-6">
                <div class="font-bold text-white text-sm hover:text-amber-400 transition-colors">
                  <?php echo htmlspecialchars($row['title']); ?>
                </div>
                <div class="text-zinc-500 text-[11px] line-clamp-2 mt-1 leading-relaxed max-w-md">
                  <?php echo htmlspecialchars($row['description'] ?? 'Chưa có phần mô tả nội dung.'); ?>
                </div>
              </td>

              <!-- Thể Loại (Badge) -->
              <td class="py-4 px-6">
                <?php
                  $typeBadge = 'bg-zinc-800 text-zinc-300 border border-zinc-700';
                  if ($row['type'] === 'MV') $typeBadge = 'bg-amber-400/10 text-amber-400 border border-amber-400/20';
                  elseif ($row['type'] === 'Audio') $typeBadge = 'bg-sky-400/10 text-sky-400 border border-sky-400/20';
                  elseif ($row['type'] === 'BehindTheScenes') $typeBadge = 'bg-purple-400/10 text-purple-400 border border-purple-400/20';
                ?>
                <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider <?php echo $typeBadge; ?>">
                  <?php echo htmlspecialchars($row['type'] ?? 'MV'); ?>
                </span>
              </td>

              <!-- Lượt Xem -->
              <td class="py-4 px-6 font-semibold text-zinc-300">
                🔥 <?php echo htmlspecialchars($row['views'] ?? '0'); ?>
              </td>

              <!-- Ngày Ra Mắt -->
              <td class="py-4 px-6 text-zinc-400 text-[11px]">
                📅 <?php echo !empty($row['release_date']) ? date('d/m/Y', strtotime($row['release_date'])) : 'N/A'; ?>
              </td>

              <!-- Nút Thao Tác (Sửa / Xóa) -->
              <td class="py-4 px-6 text-center">
                <div class="flex items-center justify-center gap-2">
                  <!-- Nút SỬA -->
                  <a 
                    href="content-edit.php?id=<?php echo $row['id']; ?>" 
                    class="px-3 py-1.5 bg-zinc-900 hover:bg-amber-400 hover:text-black text-zinc-300 border border-zinc-700/80 rounded-xl transition duration-200 font-bold text-[11px] flex items-center gap-1.5"
                    title="Chỉnh sửa nội dung"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span>Sửa</span>
                  </a>

                  <!-- Nút XÓA -->
                  <a 
                    href="content.php?action=delete&id=<?php echo $row['id']; ?>" 
                    onclick="return confirm('Bạn có chắc chắn muốn xóa vĩnh viễn tác phẩm: <?php echo addslashes($row['title']); ?>?');"
                    class="px-3 py-1.5 bg-zinc-900 hover:bg-rose-600 hover:text-white text-zinc-400 hover:border-rose-600 border border-zinc-700/80 rounded-xl transition duration-200 font-bold text-[11px] flex items-center gap-1.5"
                    title="Xóa tác phẩm"
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
              <i class="fa-solid fa-film text-3xl mb-3 text-zinc-700 block"></i>
              Không tìm thấy nội dung nào trong hệ thống.
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
