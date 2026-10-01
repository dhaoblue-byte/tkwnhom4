    </main>

    <!-- Footer Hệ Thống Quản Trị -->
    <footer class="border-t border-zinc-900 bg-zinc-950/60 px-8 py-5 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Hệ thống Backend Sơn Tùng M-TP World &bull; PHP Native & MySQL</span>
      </div>
      <div>
        &copy; <?php echo date('Y'); ?> M-TP Entertainment. Toàn bộ quyền quản trị được bảo lưu.
      </div>
    </footer>
  </div>

  <!-- Client-side helpers -->
  <script>
    // Tự động ẩn các thông báo alert sau 4 giây
    document.addEventListener('DOMContentLoaded', () => {
      const alertBox = document.getElementById('flash-alert');
      if (alertBox) {
        setTimeout(() => {
          alertBox.style.transition = 'opacity 0.5s ease';
          alertBox.style.opacity = '0';
          setTimeout(() => alertBox.remove(), 500);
        }, 4000);
      }
    });
  </script>
</body>
</html>
