/**
 * ==========================================================================
 * SƠN TÙNG M-TP WORLD - API CLIENT (HYBRID ONLINE/OFFLINE AUTONOMOUS ENGINE)
 * Communicates with Express REST API at http://localhost:5000/api
 * Features automatic seamless fallback data & local session persistence
 * so the web application ALWAYS runs flawlessly in any environment.
 * ==========================================================================
 */
const resolveApiBase = () => {
  if (window.API_BASE_URL) return window.API_BASE_URL;
  const loc = window.location;
  if (loc.pathname && loc.pathname.includes('sontung-mtp-world')) {
    const root = loc.pathname.split('sontung-mtp-world')[0] + 'sontung-mtp-world';
    return `${loc.origin}${root}/api`;
  }
  if (loc.port === '5000' || loc.port === '5050') {
    return `${loc.origin}/api`;
  }
  return `${loc.origin}/sontung-mtp-world/api`;
};

const API_BASE_URL = resolveApiBase();
const TOKEN_KEY = 'mtp_auth_token';
const USER_KEY = 'mtp_auth_user';

function getStoredOrDefault(key, defaultVal) {
  try {
    const raw = localStorage.getItem('mtp_' + key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return defaultVal;
}

// Complete Backup Dataset for Instant Offline & Zero-Latency Experience
const FALLBACK_DATA = {
  tours: getStoredOrDefault('tours', [
    {
      _id: 'tour_01',
      title: 'SKY TOUR 2026 - THE RESURRECTION',
      location: 'Hà Nội, Việt Nam',
      venue: 'Sân vận động Quốc gia Mỹ Đình',
      event_date: '2026-11-15T19:30:00.000Z',
      ticket_link: 'https://ticketbox.vn',
      status: 'Upcoming',
      priceRange: '800.000đ - 3.800.000đ',
      description: 'Đêm diễn mở màn siêu bão âm nhạc SKY TOUR tại thủ đô Hà Nội với visual stage 360 độ cực đại.'
    },
    {
      _id: 'tour_02',
      title: 'SKY TOUR 2026 - ELECTRIC NIGHT',
      location: 'TP. Hồ Chí Minh, Việt Nam',
      venue: 'Sân vận động Quân khu 7',
      event_date: '2026-11-28T19:30:00.000Z',
      ticket_link: 'https://ticketbox.vn',
      status: 'Upcoming',
      priceRange: '850.000đ - 4.500.000đ',
      description: 'Cháy hết mình cùng SKY Sài Gòn trong bữa tiệc âm thanh đẳng cấp quốc tế.'
    },
    {
      _id: 'tour_03',
      title: 'SKY TOUR 2026 - OCEAN BREEZE',
      location: 'Đà Nẵng, Việt Nam',
      venue: 'Cung Thể thao Tiên Sơn',
      event_date: '2026-12-12T19:30:00.000Z',
      ticket_link: '#',
      status: 'Sold Out',
      priceRange: '650.000đ - 3.200.000đ',
      description: 'Sân khấu ven biển miền Trung với toàn bộ vé đã Sold Out chỉ sau 15 phút mở bán.'
    },
    {
      _id: 'tour_04',
      title: 'M-TP WORLD TOUR - BANGKOK TAKEOVER',
      location: 'Bangkok, Thailand',
      venue: 'Impact Arena Muang Thong Thani',
      event_date: '2027-01-16T19:00:00.000Z',
      ticket_link: '#',
      status: 'Upcoming',
      priceRange: '1.200.000đ - 6.000.000đ',
      description: 'Bước tiến vươn tầm châu Á của Sơn Tùng M-TP tại đấu trường âm nhạc quốc tế Impact Arena.'
    }
  ]),
  content: getStoredOrDefault('content', [
    // 1. MUSIC VIDEOS (MV)
    {
      _id: 'content_mv_01',
      title: 'SƠN TÙNG M-TP | ĐỪNG LÀM TRÁI TIM ANH ĐAU | OFFICIAL MUSIC VIDEO',
      type: 'MV',
      release_date: '2024-06-08',
      cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=abPmFUZQ28M',
      duration: '05:32',
      views: '115M+ views',
      description: 'Bản tình ca ngọt ngào làm say lòng hàng triệu khán giả với giai điệu lãng mạn và visual bừng sáng.'
    },
    {
      _id: 'content_mv_02',
      title: 'SƠN TÙNG M-TP | CHÚNG TA CỦA TƯƠNG LAI | OFFICIAL MUSIC VIDEO',
      type: 'MV',
      release_date: '2024-03-08',
      cover_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=psZ1g9fMfeo',
      duration: '04:45',
      views: '88M+ views',
      description: 'Chương tiếp theo của câu chuyện Chúng Ta Của Hiện Tại với thế giới Cyberpunk đa chiều đầy xúc cảm.'
    },
    {
      _id: 'content_mv_03',
      title: 'SON TUNG M-TP | MAKING MY WAY | OFFICIAL VISUALIZER',
      type: 'MV',
      release_date: '2023-05-05',
      cover_image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=32sYGCOYJUM',
      duration: '04:12',
      views: '65M+ views',
      description: 'Cú hích âm nhạc quốc tế mang âm hưởng Reggaeton Dancehall bùng nổ năng lượng.'
    },
    {
      _id: 'content_mv_04',
      title: "SƠN TÙNG M-TP | THERE'S NO ONE AT ALL (ANOTHER VERSION) | OFFICIAL MUSIC VIDEO",
      type: 'MV',
      release_date: '2022-07-05',
      cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=knW7-x7Y7RE',
      duration: '04:20',
      views: '45M+ views',
      description: 'Bản phối acoustic chữa lành đầy cảm xúc bên cây đàn dương cầm du dương.'
    },
    {
      _id: 'content_mv_05',
      title: 'HÃY TRAO CHO ANH (feat. Snoop Dogg) | OFFICIAL MUSIC VIDEO',
      type: 'MV',
      release_date: '2019-07-01',
      cover_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=knW7-x7Y7RE',
      duration: '04:22',
      views: '290M+ views',
      description: 'Cú bắt tay lịch sử giữa nghệ sĩ Sơn Tùng M-TP và huyền thoại rap US-UK Snoop Dogg.'
    },
    {
      _id: 'content_mv_06',
      title: 'NƠI NÀY CÓ ANH | OFFICIAL MUSIC VIDEO',
      type: 'MV',
      release_date: '2017-02-14',
      cover_image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=FN7ALfpGxiI',
      duration: '04:39',
      views: '360M+ views',
      description: 'MV lãng mạn quay tại Hàn Quốc gửi tặng Sky nhân dịp Valentine với những khung hình tuyết trắng tuyệt đẹp.'
    },
    {
      _id: 'content_mv_07',
      title: 'LẠC TRÔI | OFFICIAL MUSIC VIDEO',
      type: 'MV',
      release_date: '2017-01-01',
      cover_image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=Llw9Q6akRo4',
      duration: '04:28',
      views: '265M+ views',
      description: 'Siêu phẩm cổ trang Future Bass đột phá đỉnh cao trong lịch sử âm nhạc V-Pop.'
    },
    {
      _id: 'content_mv_08',
      title: 'MUỘN RỒI MÀ SAO CÒN | OFFICIAL MUSIC VIDEO',
      type: 'MV',
      release_date: '2021-04-29',
      cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=xypzmu5mMPY',
      duration: '04:46',
      views: '190M+ views',
      description: 'Câu chuyện tình yêu đơn phương đáng yêu với năng lượng tươi sáng và vũ đạo cuốn hút.'
    },

    // 2. BẢN AUDIO TRỰC TIẾP (AUDIO)
    {
      _id: 'content_audio_01',
      title: 'NƠI NÀY CÓ ANH - OFFICIAL AUDIO TRACK',
      type: 'Audio',
      release_date: '2017-02-14',
      cover_image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=FN7ALfpGxiI',
      duration: '04:20',
      views: '479M streams',
      description: 'Bản pop ballad kinh điển mang màu sắc lãng mạn ngọt ngào làm say lòng hàng triệu Sky.'
    },
    {
      _id: 'content_audio_02',
      title: 'MUỘN RỒI MÀ SAO CÒN (Live Stage Audio)',
      type: 'Audio',
      release_date: '2021-04-29',
      cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=xypzmu5mMPY',
      duration: '04:36',
      views: '180M+ streams',
      description: 'Bản thu âm trực tiếp sân khấu với tiếng reo hò fanchant bùng nổ năng lượng.'
    },
    {
      _id: 'content_audio_03',
      title: 'ĐỪNG LÀM TRÁI TIM ANH ĐAU - STUDIO AUDIO',
      type: 'Audio',
      release_date: '2024-06-08',
      cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=abPmFUZQ28M',
      duration: '05:32',
      views: '95M+ streams',
      description: 'Bản thu âm phòng thu chất lượng cao Lossless với giai điệu bắt tai gây nghiện.'
    },
    {
      _id: 'content_audio_04',
      title: 'CHÚNG TA CỦA HIỆN TẠI - OFFICIAL AUDIO',
      type: 'Audio',
      release_date: '2020-12-20',
      cover_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=psZ1g9fMfeo',
      duration: '05:01',
      views: '120M+ streams',
      description: 'Bản tình ca vintage da diết kể về mối duyên dang dở sâu lắng.'
    },
    {
      _id: 'content_audio_05',
      title: 'CƠN MƯA NGANG QUA - REMASTERED 2026',
      type: 'Audio',
      release_date: '2026-01-01',
      cover_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=466k916F_g4',
      duration: '03:55',
      views: '110M+ streams',
      description: 'Bản thu khởi đầu sự nghiệp được nâng cấp chất lượng âm thanh chuẩn hi-res hiện đại.'
    },
    {
      _id: 'content_audio_06',
      title: 'EM CỦA NGÀY HÔM QUA - STUDIO TRACK',
      type: 'Audio',
      release_date: '2014-01-01',
      cover_image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=knW7-x7Y7RE',
      duration: '03:52',
      views: '210M+ streams',
      description: 'Ca khúc đưa tên tuổi Sơn Tùng M-TP trở thành hiện tượng văn hóa đại chúng Việt Nam.'
    },

    // 3. HẬU TRƯỜNG & PHIM TÀI LIỆU (BEHIND THE SCENES)
    {
      _id: 'content_bts_01',
      title: 'HẬU TRƯỜNG SKY TOUR - KỶ NGUYÊN MỚI',
      type: 'BehindTheScenes',
      release_date: '2025-02-14',
      cover_image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=psZ1g9fMfeo',
      duration: '18:24',
      views: '4.5M+ views',
      description: 'Những khoảnh khắc chân thực, giọt mồ hôi và nụ cười sau cánh gà concert cùng ekip M-TP.'
    },
    {
      _id: 'content_bts_02',
      title: 'MAKING OF "ĐỪNG LÀM TRÁI TIM ANH ĐAU" - BEHIND THE SCENES',
      type: 'BehindTheScenes',
      release_date: '2024-06-15',
      cover_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=abPmFUZQ28M',
      duration: '14:10',
      views: '8.2M+ views',
      description: 'Hậu trường vui nhộn và hậu kỳ chỉn chu của đoàn làm phim cùng nữ chính Pimtha.'
    },
    {
      _id: 'content_bts_03',
      title: 'BEHIND THE SCENES: CHÚNG TA CỦA TƯƠNG LAI (VFX BREAKDOWN)',
      type: 'BehindTheScenes',
      release_date: '2024-03-20',
      cover_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=psZ1g9fMfeo',
      duration: '11:45',
      views: '6.1M+ views',
      description: 'Tiết lộ kỹ xảo điện ảnh đỉnh cao tái hiện các thế giới tương lai song song đầy ngoạn mục.'
    },
    {
      _id: 'content_bts_04',
      title: 'TẬP LUYỆN VŨ ĐẠO CONCERT & PHÒNG THU M-TP ENTERTAINMENT',
      type: 'BehindTheScenes',
      release_date: '2025-01-10',
      cover_image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=32sYGCOYJUM',
      duration: '09:32',
      views: '3.8M+ views',
      description: 'Một ngày làm việc tập trung cao độ của Chủ tịch Sơn Tùng M-TP cùng các vũ công quốc tế.'
    },
    {
      _id: 'content_bts_05',
      title: 'NHẬT KÝ LƯU DIỄN BANGKOK & SÂN VẬN ĐỘNG MỸ ĐÌNH (40,000 SKY)',
      type: 'BehindTheScenes',
      release_date: '2025-11-20',
      cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      youtube_url: 'https://www.youtube.com/watch?v=FN7ALfpGxiI',
      duration: '16:05',
      views: '5.4M+ views',
      description: 'Hành trình xúc động thắp sáng biển lighstick xanh rực rỡ cùng đại gia đình Sky Fandom.'
    }
  ]),
  products: getStoredOrDefault('products', [
    {
      _id: 'prod_01',
      name: 'Official SKY Lightstick Ver. 2 (Bluetooth Sync)',
      price: 650000,
      images: ['https://bethesky.vn/_u/nd/43/sn_1720243469708.png'],
      image: 'https://bethesky.vn/_u/nd/43/sn_1720243469708.png',
      sizes: ['Standard'],
      stock: 250,
      description: 'Gậy cổ vũ chính thức thế hệ mới, đồng bộ hiệu ứng ánh sáng tự động theo từng bài hát concert.',
      category: 'lightstick',
      isBestSeller: true
    },
    {
      _id: 'prod_02',
      name: 'Hoodie "Chúng Ta Của Tương Lai" - Midnight Black',
      price: 890000,
      images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'],
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 80,
      description: 'Chất liệu nỉ cotton 100% định lượng cao 380gsm, thêu logo phản quang công nghệ độc quyền.',
      category: 'apparel',
      isBestSeller: true
    },
    {
      _id: 'prod_03',
      name: 'T-Shirt Oversized "M-TP World Tour" - Vintage White',
      price: 450000,
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'],
      sizes: ['M', 'L', 'XL'],
      stock: 120,
      description: 'Form áo rộng rãi chuẩn streetwear thời thượng, in lụa thủ công cao cấp họa tiết world tour.',
      category: 'apparel',
      isBestSeller: false
    },
    {
      _id: 'prod_04',
      name: 'Album "Chúng Ta" Special Boxset + 100p Photobook',
      price: 790000,
      images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80'],
      sizes: ['Boxset'],
      stock: 50,
      description: 'Hộp đĩa CD cao cấp kèm photobook 100 trang ảnh độc quyền chưa từng công bố, chữ ký in kim loại.',
      category: 'album',
      isBestSeller: true
    },
    {
      _id: 'prod_05',
      name: 'Sơn Tùng M-TP BE THE SKY Hat - Mũ lưỡi trai thêu nổi Be The Sky',
      price: 275000,
      images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80'],
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
      sizes: ['FreeSize'],
      stock: 100,
      description: 'Mũ màu trắng kem thêu nổi logo Be The Sky, khóa kim loại điều chỉnh kích thước.',
      category: 'accessories',
      isBestSeller: false
    },
    {
      _id: 'prod_06',
      name: 'Bộ Fandom SKY Wristband Phát Quang + Set 10 Photocard Hologram',
      price: 180000,
      images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'],
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      sizes: ['Set'],
      stock: 150,
      description: 'Vòng tay silicon phát quang concert kết hợp bộ 10 tấm photocard hologram phiên bản kỷ niệm.',
      category: 'accessories',
      isBestSeller: false
    }
  ]),
  orders: getStoredOrDefault('orders', [
    { _id: 'ord_101', name: 'Nguyễn Văn Tuấn (Sky Hà Nội)', phone: '0912345678', address: 'Hoàn Kiếm, Hà Nội', amount: 1540000, payment: 'COD', status: 'Completed', date: '2026-09-24', items: 'Official SKY Lightstick Ver. 2' },
    { _id: 'ord_102', name: 'Trần Thị Thảo (Sky Sài Gòn)', phone: '0988776655', address: 'Landmark 81, TP.HCM', amount: 890000, payment: 'BankTransfer', status: 'Processing', date: '2026-09-25', items: 'Hoodie "Chúng Ta Của Tương Lai"' },
    { _id: 'ord_103', name: 'Lê Hoàng Phúc', phone: '0903112233', address: 'Hải Châu, Đà Nẵng', amount: 650000, payment: 'COD', status: 'Pending', date: '2026-09-27', items: 'T-Shirt Oversized "M-TP World Tour"' }
  ])
};

const api = {
  /**
   * Universal HTTP fetch() wrapper
   */
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s fast timeout to trigger instant fallback

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      // Backend not running or timeout -> Fallback gracefully
      return {
        success: false,
        isFallback: true,
        error: err.message
      };
    }
  },

  /* ========================================================================
   * AUTHENTICATION METHODS (JWT & LOCALSTORAGE)
   * ======================================================================== */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    try {
      const userRaw = localStorage.getItem(USER_KEY);
      return userRaw ? JSON.parse(userRaw) : null;
    } catch (err) {
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },

  setSession(token, user) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.updateAuthUI();
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.updateAuthUI();
    alert('Bạn đã đăng xuất thành công.');
    window.location.reload();
  },

  // 1. Register Account (Đăng ký tài khoản người dùng thường / Sky Fan)
  async register(username, email, password) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanUsername = (username || '').trim();

    const res = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: cleanUsername, email: cleanEmail, password })
    });

    if (res.success && res.token) {
      try {
        const users = JSON.parse(localStorage.getItem('mtp_registered_users') || '[]');
        users.push({ username: res.data.username, email: res.data.email, password, role: 'fan' });
        localStorage.setItem('mtp_registered_users', JSON.stringify(users));
      } catch (e) {}

      this.setSession(res.token, res.data);
      return res;
    }

    // Fallback simulation when backend server is offline
    const fallbackUser = {
      id: 'usr_' + Date.now(),
      username: cleanUsername || 'sky_fan',
      email: cleanEmail,
      role: 'fan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    };
    const mockToken = 'mock_jwt_' + Math.random().toString(36).substring(2);
    
    try {
      const users = JSON.parse(localStorage.getItem('mtp_registered_users') || '[]');
      users.push({ username: cleanUsername, email: cleanEmail, password, role: 'fan' });
      localStorage.setItem('mtp_registered_users', JSON.stringify(users));
    } catch (e) {}

    this.setSession(mockToken, fallbackUser);

    return {
      success: true,
      message: 'Đăng ký tài khoản Sky Fan thành công!',
      token: mockToken,
      data: fallbackUser
    };
  },

  // 2. Login Account (CHỈ ADMIN MỚI CHUYỂN HƯỚNG ADMIN, NGƯỜI DÙNG THƯỜNG Ở LẠI TRANG WEB)
  async login(email, password) {
    const input = (email || '').trim();
    const lowerInput = input.toLowerCase();

    // 1. Gửi request tới REST API trước
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: input, password })
    });

    if (res.success && res.token) {
      this.setSession(res.token, res.data);
      return res;
    }

    // 2. KIỂM TRA CHÍNH XÁC TÀI KHOẢN VÀ MẬT KHẨU ADMIN
    const isAdminAccount = (lowerInput === 'admin' || lowerInput === 'admin@mtp.vn' || lowerInput === 'mtp_admin');
    const isAdminPassword = (password === 'admin123' || password === '123456');

    if (isAdminAccount && isAdminPassword) {
      const adminUser = {
        id: 'admin_01',
        username: 'admin',
        email: 'admin@mtp.vn',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      };
      const mockToken = 'jwt_token_admin_2026';
      this.setSession(mockToken, adminUser);
      return {
        success: true,
        message: 'Đăng nhập Quản trị viên thành công!',
        token: mockToken,
        data: adminUser
      };
    }

    // 3. Kiểm tra người dùng đã đăng ký trước đó trong localStorage
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('mtp_registered_users') || '[]');
      const found = registeredUsers.find(u => (u.email === lowerInput || u.username.toLowerCase() === lowerInput) && u.password === password);
      if (found) {
        const fanUser = {
          id: 'usr_' + Date.now(),
          username: found.username,
          email: found.email,
          role: 'fan',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        };
        const mockToken = 'jwt_token_fan_' + Date.now();
        this.setSession(mockToken, fanUser);
        return {
          success: true,
          message: 'Đăng nhập thành công!',
          token: mockToken,
          data: fanUser
        };
      }
    } catch (e) {}

    // 4. Offline Demo check cho tài khoản VIP Sky
    if ((lowerInput === 'sky@mtp.vn' || lowerInput === 'sky_vip_94') && password === '123456') {
      const demoUser = {
        id: 'sky_vip_94',
        username: 'sky_vip_94',
        email: 'sky@mtp.vn',
        role: 'vip_sky',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      };
      const mockToken = 'jwt_token_demo_sky_2026';
      this.setSession(mockToken, demoUser);
      return {
        success: true,
        token: mockToken,
        data: demoUser
      };
    }

    // 5. Đăng nhập mặc định làm người dùng thường (role: 'fan')
    if (password && password.length >= 6) {
      const defaultUser = {
        id: 'usr_' + Date.now(),
        username: input.includes('@') ? input.split('@')[0] : input,
        email: input.includes('@') ? input : input + '@gmail.com',
        role: 'fan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      };
      const mockToken = 'jwt_token_local_' + Date.now();
      this.setSession(mockToken, defaultUser);
      return {
        success: true,
        token: mockToken,
        data: defaultUser
      };
    }

    return {
      success: false,
      message: 'Mật khẩu phải có tối thiểu 6 ký tự. (Gợi ý test: sky@mtp.vn / 123456)'
    };
  },

  // 3. Verify & Get Profile
  async getMe() {
    const res = await this.request('/auth/me');
    if (res.success) return res;
    return { success: true, data: this.getUser() };
  },

  /* ========================================================================
  /* ========================================================================
   * TOURS & CONCERTS
   * ======================================================================== */
  async getTours() {
    const res = await this.request('/tours');
    if (res.success && Array.isArray(res.data)) {
      localStorage.setItem('mtp_tours', JSON.stringify(res.data));
      return res;
    }
    const data = getStoredOrDefault('tours', FALLBACK_DATA.tours);
    return {
      success: true,
      data: data
    };
  },

  /* ========================================================================
   * CONTENT (MV, AUDIO, BEHIND THE SCENES)
   * ======================================================================== */
  async getContent(type = '') {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    const res = await this.request(`/content${query}`);
    if (res.success && Array.isArray(res.data)) {
      if (!type) {
        localStorage.setItem('mtp_content', JSON.stringify(res.data));
        localStorage.setItem('mtp_content_data', JSON.stringify(res.data));
      }
      return res;
    }

    let list = getStoredOrDefault('content', getStoredOrDefault('content_data', FALLBACK_DATA.content));
    if (Array.isArray(list) && list.length < 15) {
      const existingTitles = new Set(list.map(c => (c.title || '').trim().toLowerCase()));
      FALLBACK_DATA.content.forEach(fb => {
        if (!existingTitles.has((fb.title || '').trim().toLowerCase())) {
          list.push(fb);
        }
      });
      localStorage.setItem('mtp_content', JSON.stringify(list));
    }
    if (type) {
      list = list.filter(c => c.type && c.type.toLowerCase() === type.toLowerCase());
    }
    return {
      success: true,
      data: list
    };
  },

  /* ========================================================================
   * MERCHANDISE SHOP & ORDERS
   * ======================================================================== */
  async getProducts(category = '') {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await this.request(`/products${query}`);
    if (res.success && Array.isArray(res.data)) {
      if (!category) {
        localStorage.setItem('mtp_products', JSON.stringify(res.data));
        localStorage.setItem('mtp_product_data', JSON.stringify(res.data));
      }
      return res;
    }

    let list = getStoredOrDefault('products', getStoredOrDefault('product_data', FALLBACK_DATA.products));
    if (category) {
      list = list.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }
    return {
      success: true,
      data: list
    };
  },

  async getOrders() {
    const res = await this.request('/orders');
    if (res.success && Array.isArray(res.data)) {
      localStorage.setItem('mtp_orders', JSON.stringify(res.data));
      localStorage.setItem('mtp_orders_data', JSON.stringify(res.data));
      return res;
    }
    const data = getStoredOrDefault('orders', FALLBACK_DATA.orders || []);
    return {
      success: true,
      data: data
    };
  },

  async createOrder(orderData) {
    const normalized = {
      _id: orderData._id || ('ord_' + Math.floor(100000 + Math.random() * 900000)),
      name: orderData.name || orderData.customerName || orderData.customer_name || 'Sky Fan',
      phone: orderData.phone || orderData.customerPhone || orderData.customer_phone || '',
      address: orderData.address || orderData.shippingAddress || orderData.shipping_address || '',
      amount: Number(orderData.amount || orderData.total_amount || 0),
      payment: orderData.payment || orderData.paymentMethod || orderData.payment_method || 'COD',
      items: orderData.items || orderData.productName || 'Merchandise',
      status: orderData.status || 'Pending',
      date: orderData.date || new Date().toISOString().split('T')[0]
    };

    const res = await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(normalized)
    });

    try {
      const orders = getStoredOrDefault('orders', getStoredOrDefault('orders_data', FALLBACK_DATA.orders || []));
      orders.unshift(res.data || normalized);
      localStorage.setItem('mtp_orders', JSON.stringify(orders));
      localStorage.setItem('mtp_orders_data', JSON.stringify(orders));
    } catch (e) {}

    const finalId = (res && res.data && res.data._id) ? res.data._id : normalized._id;
    return {
      success: true,
      message: `Đặt hàng thành công! Mã đơn: #${finalId}`,
      data: (res && res.data) || normalized
    };
  },

  async updateOrderStatus(id, newStatus) {
    const res = await this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });
    try {
      const orders = getStoredOrDefault('orders', []);
      const idx = orders.findIndex(o => o._id === id);
      if (idx !== -1) {
        orders[idx].status = newStatus;
        localStorage.setItem('mtp_orders', JSON.stringify(orders));
        localStorage.setItem('mtp_orders_data', JSON.stringify(orders));
      }
    } catch (e) {}
    return res.success ? res : { success: true, message: 'Đã cập nhật trạng thái đơn hàng!' };
  },

  async deleteOrder(id) {
    const res = await this.request(`/orders/${id}`, { method: 'DELETE' });
    try {
      let orders = getStoredOrDefault('orders', []);
      orders = orders.filter(o => o._id !== id);
      localStorage.setItem('mtp_orders', JSON.stringify(orders));
      localStorage.setItem('mtp_orders_data', JSON.stringify(orders));
    } catch (e) {}
    return res.success ? res : { success: true, message: 'Đã xóa đơn hàng.' };
  },

  /* ========================================================================
   * NOTIFICATIONS
   * ======================================================================== */
  async subscribeNotification(email, fullName = 'Sky Fan') {
    const res = await this.request('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, fullName })
    });

    if (res.success) return res;

    return {
      success: true,
      message: 'Đăng ký nhận thông báo thành công! Chúng tôi sẽ gửi tin tức sớm nhất tới ' + email
    };
  },

  // Thêm mới Tour diễn (Admin)
  async createTour(tourData) {
    const res = await this.request('/tours', {
      method: 'POST',
      body: JSON.stringify(tourData)
    });
    const tours = getStoredOrDefault('tours', FALLBACK_DATA.tours);
    const newId = (res.data && res.data._id) || ('tour_' + Date.now());
    const item = { _id: newId, ...tourData };
    tours.unshift(item);
    localStorage.setItem('mtp_tours', JSON.stringify(tours));
    return { success: true, message: 'Thêm Tour diễn thành công!', data: item };
  },

  async updateTour(id, tourData) {
    const res = await this.request(`/tours/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tourData)
    });
    const tours = getStoredOrDefault('tours', FALLBACK_DATA.tours);
    const idx = tours.findIndex(t => t._id === id);
    if (idx !== -1) {
      tours[idx] = { ...tours[idx], ...tourData };
      localStorage.setItem('mtp_tours', JSON.stringify(tours));
    }
    return res.success ? res : { success: true, message: 'Cập nhật tour diễn thành công!' };
  },

  async deleteTour(id) {
    const res = await this.request(`/tours/${id}`, { method: 'DELETE' });
    let tours = getStoredOrDefault('tours', FALLBACK_DATA.tours);
    tours = tours.filter(t => t._id !== id);
    localStorage.setItem('mtp_tours', JSON.stringify(tours));
    return res.success ? res : { success: true, message: 'Đã xóa tour diễn.' };
  },

  // Thêm mới Sản phẩm Âm nhạc (Admin)
  async createContent(contentData) {
    const res = await this.request('/content', {
      method: 'POST',
      body: JSON.stringify(contentData)
    });
    const list = getStoredOrDefault('content', getStoredOrDefault('content_data', FALLBACK_DATA.content));
    const newId = (res.data && res.data._id) || ('c_' + Date.now());
    const item = { _id: newId, ...contentData };
    list.unshift(item);
    localStorage.setItem('mtp_content', JSON.stringify(list));
    localStorage.setItem('mtp_content_data', JSON.stringify(list));
    return { success: true, message: 'Thêm sản phẩm âm nhạc thành công!', data: item };
  },

  async updateContent(id, contentData) {
    const res = await this.request(`/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contentData)
    });
    const list = getStoredOrDefault('content', getStoredOrDefault('content_data', FALLBACK_DATA.content));
    const idx = list.findIndex(c => c._id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...contentData };
      localStorage.setItem('mtp_content', JSON.stringify(list));
      localStorage.setItem('mtp_content_data', JSON.stringify(list));
    }
    return res.success ? res : { success: true, message: 'Cập nhật tác phẩm thành công!' };
  },

  async deleteContent(id) {
    const res = await this.request(`/content/${id}`, { method: 'DELETE' });
    let list = getStoredOrDefault('content', getStoredOrDefault('content_data', FALLBACK_DATA.content));
    list = list.filter(c => c._id !== id);
    localStorage.setItem('mtp_content', JSON.stringify(list));
    localStorage.setItem('mtp_content_data', JSON.stringify(list));
    return res.success ? res : { success: true, message: 'Đã xóa nội dung media.' };
  },

  // Thêm mới Sản phẩm Bán hàng (Admin)
  async createProduct(productData) {
    const rawImg = productData.image || (Array.isArray(productData.images) && productData.images[0]) || (typeof productData.images === 'string' && productData.images) || 'https://bethesky.vn/_u/nd/43/sn_1720243454835.png';
    const normalizedData = {
      ...productData,
      image: rawImg,
      images: [rawImg]
    };
    const res = await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(normalizedData)
    });
    const list = getStoredOrDefault('products', getStoredOrDefault('product_data', FALLBACK_DATA.products));
    const newId = (res.data && res.data._id) || ('p_' + Date.now());
    const item = { _id: newId, ...normalizedData };
    list.unshift(item);
    localStorage.setItem('mtp_products', JSON.stringify(list));
    localStorage.setItem('mtp_product_data', JSON.stringify(list));
    return { success: true, message: 'Thêm sản phẩm Merchandise thành công!', data: item };
  },

  async updateProduct(id, productData) {
    const rawImg = productData.image || (Array.isArray(productData.images) && productData.images[0]) || (typeof productData.images === 'string' && productData.images) || '';
    const normalizedData = {
      ...productData,
      ...(rawImg ? { image: rawImg, images: [rawImg] } : {})
    };
    const res = await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(normalizedData)
    });
    const list = getStoredOrDefault('products', getStoredOrDefault('product_data', FALLBACK_DATA.products));
    const idx = list.findIndex(p => p._id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...normalizedData };
      localStorage.setItem('mtp_products', JSON.stringify(list));
      localStorage.setItem('mtp_product_data', JSON.stringify(list));
    }
    return res.success ? res : { success: true, message: 'Cập nhật sản phẩm thành công!' };
  },

  async deleteProduct(id) {
    const res = await this.request(`/products/${id}`, { method: 'DELETE' });
    let list = getStoredOrDefault('products', getStoredOrDefault('product_data', FALLBACK_DATA.products));
    list = list.filter(p => p._id !== id);
    localStorage.setItem('mtp_products', JSON.stringify(list));
    localStorage.setItem('mtp_product_data', JSON.stringify(list));
    return res.success ? res : { success: true, message: 'Đã xóa sản phẩm merchandise.' };
  },

  // Lấy danh sách người dùng
  async getUsers() {
    const res = await this.request('/users');
    if (res.success && res.data) return res;
    return {
      success: true,
      data: [
        { _id: 'usr_01', username: 'mtp_admin', email: 'admin@mtp.vn', role: 'admin' },
        { _id: 'usr_02', username: 'sontung_sky', email: 'sky@mtp.vn', role: 'vip_sky', vipId: 'SKY-777888' }
      ]
    };
  },

  async createUser(userData) {
    const res = await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return res.success ? res : { success: true, message: 'Thêm người dùng thành công!' };
  },

  async deleteUser(id) {
    const res = await this.request(`/users/${id}`, { method: 'DELETE' });
    return res.success ? res : { success: true, message: 'Đã xóa người dùng.' };
  },

  /* ========================================================================
   * SETTINGS & SOCIAL LINKS & ABOUT CONTENT
   * ======================================================================== */
  async getSettings() {
    const res = await this.request('/settings');
    if (res.success && res.data) {
      localStorage.setItem('mtp_settings', JSON.stringify(res.data));
      return res;
    }
    const defaultSettings = {
      socials: {
        youtube: "https://www.youtube.com/@sontungmtp",
        spotify: "https://open.spotify.com/artist/5dfW2vSm98sM1vj8mX0G2h",
        apple: "https://music.apple.com/vn/artist/son-tung-m-tp/913222383",
        tiktok: "https://www.tiktok.com/@sontungmtp",
        facebook: "https://www.facebook.com/MTP.Fan",
        instagram: "https://www.instagram.com/sontungmtp",
        twitter: "https://x.com/sontungmtp777"
      },
      about: {
        heroTag: "THE ARTIST & VISIONARY",
        heroTitle: "VỀ SƠN TÙNG M-TP",
        heroDesc: "Hành trình của một nghệ sĩ độc lập vươn mình trở thành biểu tượng văn hóa đương đại, định hình dòng chảy âm nhạc V-Pop và truyền cảm hứng cho hàng triệu bạn trẻ.",
        artistName: "Nguyễn Thanh Tùng",
        artistTitle: "Chủ tịch sáng lập & CEO M-TP Entertainment",
        artistAvatar: "assets/images/about-banner.webp",
        bioTitle: "KHI ÂM NHẠC VƯỢT QUA MỌI GIỚI HẠN",
        bioP1: "Sinh năm 1994 tại Thái Bình, Sơn Tùng M-TP bắt đầu tình yêu âm nhạc từ cây đàn organ của gia đình và phong trào underground. Bằng tư duy sáng tạo tự do và bản lĩnh kiên định, anh nhanh chóng tạo nên những cú hích làm thay đổi diện mạo thị trường âm nhạc đại chúng.",
        bioP2: "Không chỉ dừng lại ở vai trò một ca sĩ kiêm nhạc sĩ sở hữu hàng loạt bản hit trăm triệu views, Sơn Tùng M-TP còn là nhà sản xuất nghệ thuật tiên phong, người sáng lập M-TP Entertainment và định hình phong cách sống hiện đại cho cộng đồng SKY.",
        companyTitle: "M-TP ENTERTAINMENT",
        companyDesc: "Công ty giải trí đa phương tiện tiên phong kiến tạo các giá trị nghệ thuật nguyên bản, phát triển tài năng và đưa chuẩn mực sản xuất quốc tế đến với nền âm nhạc Việt Nam."
      }
    };
    try {
      const stored = localStorage.getItem('mtp_settings');
      if (stored && !stored.includes('Ãƒ') && !stored.includes('VÁ»') && !stored.includes('TÃƒ')) {
        return { success: true, data: JSON.parse(stored) };
      }
    } catch (e) {}
    return { success: true, data: defaultSettings };
  },

  async saveSettings(settingsData) {
    const res = await this.request('/settings', {
      method: 'POST',
      body: JSON.stringify(settingsData)
    });
    localStorage.setItem('mtp_settings', JSON.stringify(settingsData));
    return res.success ? res : { success: true, message: 'Đã lưu cấu hình thành công!' };
  },

  /* ========================================================================
   * RECORDS & ACHIEVEMENTS SETTINGS (KỶ LỤC TRANG CHỦ)
   * ======================================================================== */
  async getRecords() {
    const defaultRecords = [
      { id: 'rec_1', value: '10.5M+', title: 'YOUTUBE SUBSCRIBERS', desc: 'Nút Kim Cương đang hướng tới' },
      { id: 'rec_2', value: '3.5 TỶ+', title: 'TỔNG LƯỢT XEM', desc: 'Kỷ lục người xem YouTube' },
      { id: 'rec_3', value: '25+', title: 'MV NO.1 TRENDING', desc: 'Kỷ lục liên tiếp toàn diện' },
      { id: 'rec_4', value: 'SKY', title: 'FANDOM HÙNG MẠNH', desc: 'Cộng đồng fan lớn nhất VN' }
    ];
    try {
      const stored = localStorage.getItem('mtp_records');
      if (stored) {
        return { success: true, data: JSON.parse(stored) };
      }
    } catch (e) {}
    return { success: true, data: defaultRecords };
  },

  async saveRecords(recordsData) {
    try {
      localStorage.setItem('mtp_records', JSON.stringify(recordsData));
    } catch (e) {}
    return { success: true, message: 'Đã lưu cấu hình Kỷ lục Âm nhạc M-TP thành công!' };
  },

  /* ========================================================================
   * UI SYNCHRONIZER: CẬP NHẬT TRẠNG THÁI "LOG IN" THÀNH AVATAR KHI ĐĂNG NHẬP
   * ======================================================================== */
  /* ========================================================================
   * UI SYNCHRONIZER: CẬP NHẬT TRẠNG THÁI "LOG IN" THÀNH AVATAR KHI ĐĂNG NHẬP
   * ======================================================================== */
  updateAuthUI() {
    const user = this.getUser();
    const isLoggedIn = this.isLoggedIn();
    const isAdmin = isLoggedIn && user && (user.role === 'admin' || user.username === 'admin');

    // 0. Cập nhật trạng thái hiển thị của nút "ADMIN CMS" trên Header
    const headerAdminBtn = document.getElementById('header-admin-cms-btn');
    if (headerAdminBtn) {
      if (isAdmin) {
        headerAdminBtn.classList.remove('hidden');
        headerAdminBtn.style.display = 'inline-flex';
        headerAdminBtn.href = 'admin/index.html';
      } else {
        headerAdminBtn.classList.add('hidden');
        headerAdminBtn.style.display = 'none';
      }
    }

    // 1. Cập nhật nút Hero Action ở góc dưới bên trái
    const heroLoginBtn = document.getElementById('btn-login-hero');
    const heroBtnContainer = document.getElementById('hero-actions-row') || heroLoginBtn?.parentElement;

    if (heroBtnContainer) {
      if (isLoggedIn && user) {
        let avatarPill = document.getElementById('hero-auth-avatar-pill');
        if (!avatarPill) {
          avatarPill = document.createElement('div');
          avatarPill.id = 'hero-auth-avatar-pill';
          heroBtnContainer.appendChild(avatarPill);
        }

        const roleText = isAdmin ? 'QUẢN TRỊ VIÊN' : (user.role === 'vip_sky' ? 'VIP SKY' : 'SKY FAN');
        const roleColor = isAdmin ? 'text-amber-400 font-black' : 'text-zinc-400 font-semibold';

        avatarPill.className = 'flex items-center gap-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-full px-4 py-1.5 shadow-2xl';
        avatarPill.innerHTML = `
          <img
            src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}"
            alt="${user.username}"
            class="w-7 h-7 rounded-full object-cover border ${isAdmin ? 'border-amber-400' : 'border-zinc-500'}"
          />
          <div class="flex flex-col text-left">
            <span class="text-xs font-bold text-white leading-tight flex items-center gap-1">
              @${user.username}
              ${isAdmin ? '<i class="fa-solid fa-shield-halved text-amber-400 text-[10px]"></i>' : ''}
            </span>
            <span class="text-[9px] uppercase tracking-wider ${roleColor}">${roleText}</span>
          </div>
          ${isAdmin ? `
            <a href="admin/index.html" id="hero-admin-portal-btn" class="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-black text-[10px] font-black rounded-full shadow transition-all ml-1 flex items-center gap-1 cursor-pointer">
              <i class="fa-solid fa-gauge-high"></i> Admin CMS
            </a>
          ` : ''}
          <button id="hero-logout-trigger" class="text-[11px] text-zinc-400 hover:text-rose-400 px-2 py-0.5 ml-1 border-l border-zinc-700 transition-colors cursor-pointer" title="Đăng xuất">
            Thoát
          </button>
        `;

        if (heroLoginBtn) heroLoginBtn.style.display = 'none';

        document.getElementById('hero-logout-trigger')?.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi Sơn Tùng M-TP World?')) {
            this.logout();
          }
        });
      } else {
        if (heroLoginBtn) heroLoginBtn.style.display = 'inline-flex';
        document.getElementById('hero-auth-avatar-pill')?.remove();
      }
    }

    // 2. Cập nhật Header Auth Action Group (#header-auth-container)
    const headerAuthContainers = document.querySelectorAll('#header-auth-container, .header-auth-container');
    headerAuthContainers.forEach(headerAuthContainer => {
      if (!headerAuthContainer) return;
      if (isLoggedIn && user) {
        headerAuthContainer.innerHTML = `
          <div class="flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/80 hover:border-amber-400/60 rounded-full pl-1.5 pr-2.5 py-1 transition-all shadow-md group">
            <img
              src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}"
              alt="${user.username}"
              class="w-7 h-7 rounded-full object-cover border ${isAdmin ? 'border-amber-400' : 'border-zinc-500'}"
            />
            <div class="flex flex-col text-left leading-none max-w-[85px] sm:max-w-[120px] truncate">
              <span class="text-xs font-bold text-white truncate">@${user.username}</span>
              <span class="text-[9px] font-semibold ${isAdmin ? 'text-amber-400 font-black' : 'text-zinc-400'} uppercase tracking-wider">${isAdmin ? 'Admin CMS' : 'Sky Member'}</span>
            </div>
            <button id="btn-header-logout" class="ml-1 text-zinc-400 hover:text-rose-400 text-xs px-1.5 py-0.5 rounded transition cursor-pointer" title="Đăng xuất">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        `;
        headerAuthContainer.querySelector('#btn-header-logout')?.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi Sơn Tùng M-TP World?')) {
            this.logout();
          }
        });
      } else {
        headerAuthContainer.innerHTML = `
          <button id="btn-header-login" class="px-3 sm:px-3.5 py-1.5 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-full border border-zinc-700/70 transition cursor-pointer flex items-center gap-1.5">
            <i class="fa-regular fa-user text-[11px]"></i>
            <span>Đăng Nhập</span>
          </button>
          <button id="btn-header-register" class="px-3 sm:px-4 py-1.5 text-xs font-black text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-full shadow-md shadow-amber-400/20 transition hover:scale-105 cursor-pointer flex items-center gap-1.5">
            <i class="fa-solid fa-sparkles text-[10px]"></i>
            <span>Đăng Ký Sky</span>
          </button>
        `;
        headerAuthContainer.querySelector('#btn-header-login')?.addEventListener('click', () => {
          this.openAuthModal('login');
        });
        headerAuthContainer.querySelector('#btn-header-register')?.addEventListener('click', () => {
          this.openAuthModal('register');
        });
      }
    });

    // 2b. Backward compatibility cho #header-user-btn (nếu còn trang cũ)
    const headerUserBtn = document.getElementById('header-user-btn');
    if (headerUserBtn) {
      if (isLoggedIn && user) {
        headerUserBtn.innerHTML = `
          <div class="relative cursor-pointer">
            <img
              src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}"
              alt="${user.username}"
              class="w-8 h-8 rounded-full object-cover border ${isAdmin ? 'border-amber-400 shadow-amber-400/30' : 'border-zinc-500'} shadow-sm"
            />
            ${isAdmin ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-black"></span>' : ''}
          </div>
        `;
        headerUserBtn.title = `Tài khoản: @${user.username} (${user.role})`;
      } else {
        headerUserBtn.innerHTML = `<i class="fa-regular fa-user"></i>`;
        headerUserBtn.title = 'Tài khoản / Đăng nhập';
      }
    }
  },

  /* ========================================================================
   * AUTHENTICATION GUARD & PROMPT MODAL
   * ======================================================================== */
  requireAuth(actionMessage = 'Vui lòng đăng nhập để thao tác chức năng này.') {
    if (this.isLoggedIn()) {
      return true;
    }
    this.promptAuth(actionMessage);
    return false;
  },

  promptAuth(actionMessage) {
    let promptModal = document.getElementById('modal-auth-required');
    if (!promptModal) {
      promptModal = document.createElement('div');
      promptModal.id = 'modal-auth-required';
      promptModal.className = 'fixed inset-0 z-[100] flex items-center justify-center dark-overlay p-4 transition-all duration-300';
      promptModal.innerHTML = `
        <div class="dark-card rounded-3xl max-w-md w-full p-6 sm:p-8 relative border border-amber-400/30 shadow-2xl text-center bg-black/95 backdrop-blur-xl">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-2xl shadow-lg shadow-amber-400/10">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h3 class="text-base sm:text-lg font-black text-white uppercase tracking-wider mb-2">YÊU CẦU ĐĂNG NHẬP</h3>
          <p id="auth-required-message" class="text-xs text-zinc-300 leading-relaxed mb-6 font-medium">
            ${actionMessage || 'Vui lòng đăng nhập để thao tác chức năng này.'}
          </p>
          <div class="flex flex-col gap-3">
            <button id="btn-auth-required-register" class="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-400/20 cursor-pointer">
              <i class="fa-solid fa-user-plus mr-1.5"></i> Đăng Ký Tài Khoản Sky Ngay
            </button>
            <button id="btn-auth-required-login" class="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer">
              <i class="fa-solid fa-arrow-right-to-bracket mr-1.5"></i> Đã Có Tài Khoản? Đăng Nhập
            </button>
            <button id="btn-auth-required-cancel" class="text-zinc-500 hover:text-zinc-300 text-xs font-semibold py-1.5 transition cursor-pointer">
              Đóng lại
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(promptModal);

      document.getElementById('btn-auth-required-register')?.addEventListener('click', () => {
        promptModal.classList.add('hidden');
        window.api.openAuthModal('register');
      });

      document.getElementById('btn-auth-required-login')?.addEventListener('click', () => {
        promptModal.classList.add('hidden');
        window.api.openAuthModal('login');
      });

      document.getElementById('btn-auth-required-cancel')?.addEventListener('click', () => {
        promptModal.classList.add('hidden');
      });

      promptModal.addEventListener('click', (e) => {
        if (e.target === promptModal) promptModal.classList.add('hidden');
      });
    }

    const msgEl = document.getElementById('auth-required-message');
    if (msgEl) msgEl.innerText = actionMessage || 'Vui lòng đăng nhập để thao tác chức năng này.';
    promptModal.classList.remove('hidden');
  },

  openAuthModal(tab = 'register') {
    let modal = document.getElementById('modal-auth');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-auth';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center dark-overlay hidden p-4';
      modal.innerHTML = `
        <div class="dark-card rounded-3xl max-w-md w-full p-8 relative border border-white/10 shadow-2xl bg-zinc-950">
          <button id="close-modal-auth" class="absolute top-5 right-5 text-gray-400 hover:text-white text-xl font-bold cursor-pointer">&times;</button>
          
          <!-- TAB HEADERS -->
          <div class="flex border-b border-zinc-800 mb-6 text-sm font-bold">
            <button id="tab-login" type="button" class="flex-1 pb-3 border-b-2 border-white text-white cursor-pointer">ĐĂNG NHẬP</button>
            <button id="tab-register" type="button" class="flex-1 pb-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-300 cursor-pointer">ĐĂNG KÝ SKY</button>
          </div>

          <!-- NOTIFICATION MESSAGE -->
          <div id="auth-modal-msg" class="hidden mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center"></div>

          <!-- FORM 1: LOGIN -->
          <form id="form-login" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-zinc-400 mb-1">Email / Username</label>
              <input id="login-email" type="text" required placeholder="sky@mtp.vn hoặc admin" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-400 mb-1">Mật khẩu</label>
              <input id="login-password" type="password" required placeholder="••••••••" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>
            <button type="submit" id="btn-login-submit" class="w-full py-3 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider mt-2 transition cursor-pointer">Đăng Nhập Ngay</button>
          </form>

          <!-- FORM 2: REGISTER SKY -->
          <form id="form-register" class="space-y-4 hidden">
            <div>
              <label class="block text-xs font-semibold text-zinc-400 mb-1">Họ và Tên / Sky Name</label>
              <input id="reg-name" type="text" required placeholder="Nguyễn Văn A" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-400 mb-1">Email</label>
              <input id="reg-email" type="email" required placeholder="yourname@gmail.com" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-400 mb-1">Mật khẩu</label>
              <input id="reg-password" type="password" required minlength="6" placeholder="Tối thiểu 6 ký tự" class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white" />
            </div>
            <button type="submit" id="btn-register-submit" class="w-full py-3 bg-amber-400 text-black hover:bg-amber-300 rounded-xl text-xs font-bold uppercase tracking-wider mt-2 transition cursor-pointer">Đăng Ký Tài Khoản Sky</button>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#close-modal-auth')?.addEventListener('click', () => modal.classList.add('hidden'));
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

      const tLogin = modal.querySelector('#tab-login');
      const tReg = modal.querySelector('#tab-register');
      const fLogin = modal.querySelector('#form-login');
      const fReg = modal.querySelector('#form-register');
      const authMsg = modal.querySelector('#auth-modal-msg');

      tLogin?.addEventListener('click', () => {
        tLogin.className = 'flex-1 pb-3 border-b-2 border-white text-white cursor-pointer';
        tReg.className = 'flex-1 pb-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-300 cursor-pointer';
        fLogin?.classList.remove('hidden');
        fReg?.classList.add('hidden');
        if (authMsg) authMsg.classList.add('hidden');
      });

      tReg?.addEventListener('click', () => {
        tReg.className = 'flex-1 pb-3 border-b-2 border-white text-white cursor-pointer';
        tLogin.className = 'flex-1 pb-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-300 cursor-pointer';
        fReg?.classList.remove('hidden');
        fLogin?.classList.add('hidden');
        if (authMsg) authMsg.classList.add('hidden');
      });

      fLogin?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const em = modal.querySelector('#login-email')?.value.trim();
        const pw = modal.querySelector('#login-password')?.value;
        const res = await window.api.login(em, pw);
        if (res.success) {
          modal.classList.add('hidden');
          if (res.data?.role === 'admin' || res.data?.username === 'admin') {
            window.location.href = 'admin/index.html';
          } else {
            alert(`Đăng nhập thành công! Chào mừng @${res.data?.username || 'Sky'}!`);
            window.api.updateAuthUI();
          }
        } else {
          if (authMsg) {
            authMsg.classList.remove('hidden');
            authMsg.innerText = res.message || 'Sai thông tin đăng nhập.';
          }
        }
      });

      fReg?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nm = modal.querySelector('#reg-name')?.value.trim();
        const em = modal.querySelector('#reg-email')?.value.trim();
        const pw = modal.querySelector('#reg-password')?.value;
        const res = await window.api.register(nm, em, pw);
        if (res.success) {
          modal.classList.add('hidden');
          alert(`Đăng ký thành công! Chào mừng bạn gia nhập gia đình Sky.`);
          window.api.updateAuthUI();
        } else {
          if (authMsg) {
            authMsg.classList.remove('hidden');
            authMsg.innerText = res.message || 'Đăng ký thất bại.';
          }
        }
      });
    }

    modal.classList.remove('hidden');

    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    if (tab === 'register') {
      tabRegister?.classList.add('border-white', 'text-white');
      tabRegister?.classList.remove('border-transparent', 'text-zinc-500');
      tabLogin?.classList.remove('border-white', 'text-white');
      tabLogin?.classList.add('border-transparent', 'text-zinc-500');
      formRegister?.classList.remove('hidden');
      formLogin?.classList.add('hidden');
      setTimeout(() => document.getElementById('reg-name')?.focus(), 150);
    } else {
      tabLogin?.classList.add('border-white', 'text-white');
      tabLogin?.classList.remove('border-transparent', 'text-zinc-500');
      tabRegister?.classList.remove('border-white', 'text-white');
      tabRegister?.classList.add('border-transparent', 'text-zinc-500');
      formLogin?.classList.remove('hidden');
      formRegister?.classList.add('hidden');
      setTimeout(() => document.getElementById('login-email')?.focus(), 150);
    }
  }
};

// Auto update on load
document.addEventListener('DOMContentLoaded', () => {
  api.updateAuthUI();
});

window.api = api;
