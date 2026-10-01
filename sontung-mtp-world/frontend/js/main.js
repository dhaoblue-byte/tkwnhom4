/**
 * ==========================================================================
 * SƠN TÙNG M-TP WORLD - INTERACTIVE MOTION ENGINE (GSAP + VANILLA JS ES6)
 * Role: Creative Technologist / Frontend Motion Developer
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Motion & Visual Effects
  initLogoGlowAndGlitch();
  initSpotlightMouseParallax();
  initSmoothNavigation();

  // 2. Initialize Modals & Micro-interactions
  initNotificationModal();
  initAuthModal();
  initAboutModal();
  initMobileMenu();

  // 3. Initialize REST API Data & Dynamic Stagger Animations
  loadTours();
  loadContents();
  loadProducts();
  setupFilterTabs();
  setupSubscribeForm();

  // 4. Update Auth UI session state & Social Links
  if (window.api) {
    window.api.updateAuthUI();
  }
  loadSocialLinks();
  loadHomeRecords();
  initHeroVideoController();
});

/* ==========================================================================
 * HERO BACKGROUND VIDEO CONTROLLER (SOUND & PLAYBACK)
 * ========================================================================== */
function initHeroVideoController() {
  const video = document.getElementById('hero-artist-video');
  const soundBtn = document.getElementById('hero-sound-toggle-btn');
  const soundIcon = document.getElementById('hero-sound-icon');
  const soundText = document.getElementById('hero-sound-text');
  const playBtn = document.getElementById('hero-play-toggle-btn');
  const playIcon = document.getElementById('hero-play-icon');

  if (!video) return;

  // Auto-play guarantee across all browsers
  const startAutoplay = () => {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const resumeOnFirstClick = () => {
          video.play().catch(() => {});
        };
        document.addEventListener('click', resumeOnFirstClick, { once: true });
      });
    }
  };
  startAutoplay();

  if (soundBtn && soundIcon) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.muted) {
        video.muted = false;
        soundIcon.className = 'fa-solid fa-volume-high text-sm text-amber-400';
        if (soundText) soundText.textContent = 'TẮT TIẾNG';
        soundBtn.classList.add('border-amber-400', 'bg-amber-400/20');
      } else {
        video.muted = true;
        soundIcon.className = 'fa-solid fa-volume-xmark text-sm';
        if (soundText) soundText.textContent = 'BẬT TIẾNG';
        soundBtn.classList.remove('border-amber-400', 'bg-amber-400/20');
      }
    });
  }

  if (playBtn && playIcon) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        playIcon.className = 'fa-solid fa-pause text-xs';
      } else {
        video.pause();
        playIcon.className = 'fa-solid fa-play text-xs';
      }
    });
  }
}

async function loadSocialLinks() {
  if (!window.api || !window.api.getSettings) return;
  try {
    const res = await window.api.getSettings();
    const s = res && res.data;
    if (!s) return;

    // Social Links
    const socials = s.socials;
    if (socials) {
      if (socials.youtube) document.querySelectorAll('#social-link-youtube, #about-social-youtube').forEach(el => el.setAttribute('href', socials.youtube));
      if (socials.spotify) document.querySelectorAll('#social-link-spotify, #about-social-spotify').forEach(el => el.setAttribute('href', socials.spotify));
      if (socials.apple) document.querySelectorAll('#social-link-apple, #about-social-apple').forEach(el => el.setAttribute('href', socials.apple));
      if (socials.tiktok) document.querySelectorAll('#social-link-tiktok, #about-social-tiktok').forEach(el => el.setAttribute('href', socials.tiktok));
      if (socials.facebook) document.querySelectorAll('#social-link-facebook, #about-social-facebook').forEach(el => el.setAttribute('href', socials.facebook));
      if (socials.instagram) document.querySelectorAll('#social-link-instagram, #about-social-instagram').forEach(el => el.setAttribute('href', socials.instagram));
    }

    // Home Page Settings
    if (s.home) {
      if (s.home.title && document.getElementById('brand-logo')) document.getElementById('brand-logo').innerText = s.home.title;
      if (s.home.badge && document.getElementById('home-hero-badge')) document.getElementById('home-hero-badge').innerText = s.home.badge;
      if (s.home.desc && document.getElementById('home-hero-desc')) document.getElementById('home-hero-desc').innerText = s.home.desc;
    }

    // Global Footer Settings
    if (s.global) {
      if (s.global.companyName) document.querySelectorAll('.global-company-name').forEach(el => el.innerText = s.global.companyName);
      if (s.global.copyright) document.querySelectorAll('.global-copyright').forEach(el => el.innerText = s.global.copyright);
    }
  } catch (e) {}
}

async function loadHomeRecords() {
  const container = document.getElementById('home-records-container');
  if (!container || !window.api || !window.api.getRecords) return;
  try {
    const res = await window.api.getRecords();
    const list = res.data || [];
    if (!list || list.length === 0) return;
    container.innerHTML = list.map(item => `
      <div class="bg-gradient-to-b from-[#181924] to-[#0d0e14] border border-zinc-700/80 hover:border-amber-400 rounded-3xl p-8 sm:p-10 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/20 group cursor-default shadow-xl">
        <div class="text-4xl sm:text-5xl font-black text-white tracking-tight group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          ${item.value || ''}
        </div>
        <div class="text-xs sm:text-sm font-black text-amber-400 uppercase tracking-wider mt-4 mb-2">
          ${item.title || ''}
        </div>
        <div class="text-xs sm:text-sm text-zinc-300 font-medium">
          ${item.desc || ''}
        </div>
      </div>
    `).join('');
  } catch (e) {}
}

/* ==========================================================================
 * 1. LOGO GLOW & GLITCH MOTION EFFECT
 * ========================================================================== */
function initLogoGlowAndGlitch() {
  const logo = document.getElementById('hero-mtp-logo');
  if (!logo) return;

  const hasGsap = typeof gsap !== 'undefined';
  let isGlitching = false;

  logo.addEventListener('mouseenter', () => {
    if (isGlitching) return;
    isGlitching = true;

    logo.classList.add('is-glitching');

    if (hasGsap) {
      const glitchTl = gsap.timeline({
        onComplete: () => {
          logo.classList.remove('is-glitching');
          isGlitching = false;
        }
      });

      glitchTl
        .to(logo, { x: -4, y: 2, skewX: -2, duration: 0.06, ease: 'power4.inOut' })
        .to(logo, { x: 4, y: -2, skewX: 2, duration: 0.06, ease: 'power4.inOut' })
        .to(logo, { x: -2, y: -1, skewX: -1, duration: 0.05, ease: 'power3.inOut' })
        .to(logo, { x: 2, y: 1, skewX: 1, duration: 0.05, ease: 'power3.inOut' })
        .to(logo, { x: 0, y: 0, skewX: 0, duration: 0.08, ease: 'power2.out' });

      gsap.to(logo, {
        filter: 'drop-shadow(0 0 35px rgba(255, 255, 255, 0.95))',
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    } else {
      setTimeout(() => {
        logo.classList.remove('is-glitching');
        isGlitching = false;
      }, 350);
    }
  });
}

/* ==========================================================================
 * 2. SPOTLIGHT MOUSE PARALLAX EFFECT (3D DEPTH)
 * ========================================================================== */
function initSpotlightMouseParallax() {
  const heroSection = document.getElementById('home');
  const portrait = document.querySelector('.artist-portrait-img');
  const spotlightBeam = document.querySelector('.hero-spotlight-beam');
  const spotlightCore = document.querySelector('.hero-spotlight-core');

  if (!heroSection || !portrait) return;

  const hasGsap = typeof gsap !== 'undefined';

  const handleMouseMove = (e) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const xNorm = (e.clientX / width - 0.5) * 2;
    const yNorm = (e.clientY / height - 0.5) * 2;

    if (hasGsap) {
      gsap.to(portrait, {
        x: xNorm * 10,
        y: yNorm * 7,
        rotationY: xNorm * 1.5,
        duration: 1.2,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      if (spotlightBeam) {
        gsap.to(spotlightBeam, {
          x: `calc(-50% + ${xNorm * -16}px)`,
          y: yNorm * -10,
          duration: 1.6,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      if (spotlightCore) {
        gsap.to(spotlightCore, {
          x: `calc(-50% + ${xNorm * -8}px)`,
          y: yNorm * -6,
          duration: 1.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    } else {
      portrait.style.transform = `translate(${xNorm * 10}px, ${yNorm * 7}px)`;
    }
  };

  const handleMouseLeave = () => {
    if (hasGsap) {
      gsap.to(portrait, {
        x: 0,
        y: 0,
        rotationY: 0,
        duration: 1.5,
        ease: 'power3.out'
      });

      if (spotlightBeam) {
        gsap.to(spotlightBeam, {
          x: '-50%',
          y: 0,
          duration: 1.8,
          ease: 'power3.out'
        });
      }

      if (spotlightCore) {
        gsap.to(spotlightCore, {
          x: '-50%',
          y: 0,
          duration: 1.8,
          ease: 'power3.out'
        });
      }
    } else {
      portrait.style.transform = 'translate(0, 0)';
    }
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('mouseleave', handleMouseLeave);
}

/* ==========================================================================
 * 3. SMOOTH NAVIGATION TRANSITIONS
 * ========================================================================== */
function initSmoothNavigation() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const hasGsap = typeof gsap !== 'undefined';

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const mobileNav = document.getElementById('mobile-nav-panel');
      if (mobileNav && !mobileNav.classList.contains('hidden')) {
        mobileNav.classList.add('hidden');
      }

      const headerOffset = 90;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      if (hasGsap && typeof ScrollToPlugin !== 'undefined') {
        gsap.to(window, {
          duration: 1.1,
          scrollTo: { y: offsetPosition, autoKill: false },
          ease: 'power3.inOut'
        });
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }

      history.pushState(null, null, targetId);
    });
  });
}

/* ==========================================================================
 * 4. MODAL ANIMATION HELPERS (GSAP ENTRANCE & EXIT)
 * ========================================================================== */
function openModalWithGsap(modalElement) {
  if (!modalElement) return;

  const card = modalElement.querySelector('.dark-modal-card') || modalElement.querySelector('.dark-card') || modalElement.children[0];
  modalElement.style.opacity = '1';
  modalElement.style.pointerEvents = 'auto';
  modalElement.classList.remove('hidden');

  if (card) {
    card.style.opacity = '1';
    card.style.pointerEvents = 'auto';
  }

  if (typeof gsap !== 'undefined') {
    gsap.fromTo(
      modalElement,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
    if (card) {
      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.92, y: 25 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)' }
      );
    }
  }
}

function closeModalWithGsap(modalElement) {
  if (!modalElement || modalElement.classList.contains('hidden')) return;

  const card = modalElement.querySelector('.dark-modal-card') || modalElement.querySelector('.dark-card') || modalElement.children[0];

  if (typeof gsap !== 'undefined') {
    if (card) {
      gsap.to(card, {
        opacity: 0,
        scale: 0.94,
        y: 15,
        duration: 0.25,
        ease: 'power2.in'
      });
    }
    gsap.to(modalElement, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        modalElement.classList.add('hidden');
        modalElement.style.opacity = '1';
        modalElement.style.pointerEvents = 'auto';
      }
    });
  } else {
    modalElement.classList.add('hidden');
    modalElement.style.opacity = '1';
    modalElement.style.pointerEvents = 'auto';
  }
}

/* ==========================================================================
 * 5. NOTIFICATION MODAL (BELL BUTTON INTERACTION)
 * ========================================================================== */
function initNotificationModal() {
  const bellBtn = document.getElementById('header-bell-btn');
  const notifModal = document.getElementById('notification-modal') || document.getElementById('modal-bell');
  const closeBtn = document.getElementById('close-notification-modal') || document.getElementById('close-modal-bell');

  if (!bellBtn || !notifModal) return;

  bellBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openModalWithGsap(notifModal);
  });

  closeBtn?.addEventListener('click', () => {
    closeModalWithGsap(notifModal);
  });

  notifModal.addEventListener('click', (e) => {
    if (e.target === notifModal) {
      closeModalWithGsap(notifModal);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !notifModal.classList.contains('hidden')) {
      closeModalWithGsap(notifModal);
    }
  });
}

/* ==========================================================================
 * 6. AUTH MODAL (LOGIN & REGISTER WITH ROLE-BASED ACCESS CONTROL)
 * ========================================================================== */
function initAuthModal() {
  const authModal = document.getElementById('modal-auth') || document.getElementById('auth-modal');
  const closeBtn = document.getElementById('close-modal-auth') || document.getElementById('close-auth-modal');
  const userBtn = document.getElementById('header-user-btn');
  const heroLoginBtn = document.getElementById('btn-login-hero');

  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const authMsg = document.getElementById('auth-modal-msg');

  const btnLoginSubmit = document.getElementById('btn-login-submit');
  const btnRegisterSubmit = document.getElementById('btn-register-submit');

  if (!authModal) return;

  const triggerOpen = () => {
    if (window.api && window.api.isLoggedIn()) {
      const user = window.api.getUser();
      if (confirm(`Bạn đang đăng nhập với tài khoản @${user.username} (${user.role}).\nBạn có muốn đăng xuất không?`)) {
        window.api.logout();
      }
      return;
    }
    openModalWithGsap(authModal);
  };

  userBtn?.addEventListener('click', triggerOpen);
  heroLoginBtn?.addEventListener('click', triggerOpen);

  closeBtn?.addEventListener('click', () => closeModalWithGsap(authModal));
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeModalWithGsap(authModal);
  });

  tabLogin?.addEventListener('click', () => {
    tabLogin.classList.add('border-white', 'text-white');
    tabLogin.classList.remove('border-transparent', 'text-zinc-500', 'text-gray-500');
    tabRegister.classList.remove('border-white', 'text-white');
    tabRegister.classList.add('border-transparent', 'text-zinc-500');
    formLogin?.classList.remove('hidden');
    formRegister?.classList.add('hidden');
    if (authMsg) authMsg.classList.add('hidden');
  });

  tabRegister?.addEventListener('click', () => {
    tabRegister.classList.add('border-white', 'text-white');
    tabRegister.classList.remove('border-transparent', 'text-zinc-500', 'text-gray-500');
    tabLogin.classList.remove('border-white', 'text-white');
    tabLogin.classList.add('border-transparent', 'text-zinc-500');
    formRegister?.classList.remove('hidden');
    formLogin?.classList.add('hidden');
    if (authMsg) authMsg.classList.add('hidden');
  });

  // Handler xử lý Đăng Nhập
  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
      if (authMsg) {
        authMsg.classList.remove('hidden');
        authMsg.innerText = 'Vui lòng điền đầy đủ Email/Username và Mật khẩu.';
      }
      return;
    }

    const res = await window.api.login(email, password);
    if (res.success && res.token) {
      closeModalWithGsap(authModal);
      const user = res.data;
      const isAdmin = user && (user.role === 'admin' || user.username === 'admin');

      if (isAdmin) {
        window.location.href = 'admin/index.html';
      } else {
        alert(`Đăng nhập thành công! Chào mừng @${user.username || 'Sky Fan'} gia nhập Sơn Tùng M-TP World.`);
        if (window.api) window.api.updateAuthUI();
      }
    } else {
      if (authMsg) {
        authMsg.classList.remove('hidden');
        authMsg.innerText = res.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.';
      }
    }
  };

  // Handler xử lý Đăng Ký Tài Khoản Sky Fan
  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!name || !email || !password) {
      if (authMsg) {
        authMsg.classList.remove('hidden');
        authMsg.innerText = 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu (tối thiểu 6 ký tự).';
      }
      return;
    }

    const res = await window.api.register(name, email, password);
    if (res.success && res.token) {
      closeModalWithGsap(authModal);
      alert(`Đăng ký tài khoản Sky Fan thành công! Chào mừng @${res.data.username} gia nhập vũ trụ Sơn Tùng M-TP.`);
      if (window.api) window.api.updateAuthUI();
    } else {
      if (authMsg) {
        authMsg.classList.remove('hidden');
        authMsg.innerText = res.message || 'Đăng ký không thành công.';
      }
    }
  };

  formLogin?.addEventListener('submit', handleLoginSubmit);
  formRegister?.addEventListener('submit', handleRegisterSubmit);

  btnLoginSubmit?.addEventListener('click', (e) => {
    handleLoginSubmit(e);
  });

  btnRegisterSubmit?.addEventListener('click', (e) => {
    handleRegisterSubmit(e);
  });
}

/* ==========================================================================
 * 7. ABOUT ARTIST MODAL
 * ========================================================================== */
function initAboutModal() {
  const aboutModal = document.getElementById('about-modal');
  const btnAbout = document.getElementById('btn-about-artist');
  const closeBtn = document.getElementById('close-about-modal');

  if (!aboutModal || !btnAbout) return;

  btnAbout.addEventListener('click', () => openModalWithGsap(aboutModal));
  closeBtn?.addEventListener('click', () => closeModalWithGsap(aboutModal));

  aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) closeModalWithGsap(aboutModal);
  });
}

/* ==========================================================================
 * 8. MOBILE MENU TOGGLE
 * ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-toggle-btn');
  const panel = document.getElementById('mobile-nav-panel');

  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const isClosed = panel.classList.contains('hidden');
    if (isClosed) {
      panel.classList.remove('hidden');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(panel, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
      }
    } else {
      panel.classList.add('hidden');
    }
  });
}

/* ==========================================================================
 * 9. REST API DATA LOADERS WITH GSAP STAGGER ANIMATIONS
 * ========================================================================== */
async function loadTours() {
  const container = document.getElementById('tours-container');
  if (!container) return;

  try {
    const res = await window.api.getTours();
    const tours = res.data || [];

    if (tours.length === 0) {
      container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">Chưa có lịch tour diễn mới.</div>`;
      return;
    }

    container.innerHTML = tours
      .map((tour) => {
        const dateVal = tour.event_date || tour.date;
        const dateObj = new Date(dateVal);
        const formattedDate = dateObj.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        const isSoldOut = tour.status === 'Sold Out' || tour.ticketStatus === 'sold_out';
        let badgeClass = isSoldOut
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          : 'bg-white/10 text-white border-white/20';
        let badgeText = isSoldOut ? 'SOLD OUT' : 'UPCOMING';

        let actionBtn = isSoldOut
          ? `<button disabled class="bg-gray-800 text-gray-500 py-2 px-5 rounded-full text-xs font-bold uppercase tracking-wider cursor-not-allowed">Đã Hết Vé</button>`
          : `<button onclick="window.handleBuyTicket('${(tour.ticket_link || tour.ticketUrl || '#').replace(/'/g, "\\'")}', '${(tour.title || '').replace(/'/g, "\\'")}')" class="btn-pill-about py-2 px-5 text-xs font-bold uppercase tracking-wider inline-block cursor-pointer">Mua Vé</button>`;

        return `
          <div class="tour-card p-6 sm:p-8 rounded-3xl bg-[#0d0e12] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs uppercase font-bold tracking-widest text-gray-400">${tour.location || 'VIETNAM'}</span>
                <span class="text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase ${badgeClass}">
                  ${badgeText}
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-white group-hover:text-gray-200 transition-colors mb-2">
                ${tour.title}
              </h3>
              <p class="text-xs text-gray-400 mb-6 line-clamp-2">
                ${tour.description || 'Trải nghiệm đại tiệc âm nhạc cùng Sơn Tùng M-TP.'}
              </p>
              <div class="space-y-2 border-t border-white/10 pt-4 mb-6 text-xs text-gray-300">
                <div class="flex items-center gap-2">
                  <span class="text-white">📅</span>
                  <span>${formattedDate}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-white">📍</span>
                  <span>${tour.venue}, ${tour.location}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-white">🎟️</span>
                  <span class="font-semibold text-white">${tour.priceRange || '800.000đ - 3.800.000đ'}</span>
                </div>
              </div>
            </div>
            <div>
              ${actionBtn}
            </div>
          </div>
        `;
      })
      .join('');

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        '.tour-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }
      );
    }
  } catch (err) {
    console.error('Lỗi tải lịch tour:', err);
  }
}

async function loadContents(filterType = '') {
  const container = document.getElementById('content-container');
  if (!container) return;

  try {
    const res = await window.api.getContent(filterType);
    const items = res.data || [];

    if (items.length === 0) {
      container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">Chưa có nội dung cho danh mục này.</div>`;
      return;
    }

    container.innerHTML = items
      .map((item) => {
        const cover = item.cover_image || item.thumbnail;
        const mediaUrl = item.youtube_url || item.mediaUrl || '#';
        const typeBadge = item.type ? item.type.toUpperCase() : 'MEDIA';

        return `
          <div class="content-card rounded-3xl overflow-hidden bg-[#0d0e12] border border-white/10 hover:border-white/30 transition-all flex flex-col group">
            <div class="relative aspect-video overflow-hidden bg-black">
              <img src="${cover}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div class="absolute top-3 left-3">
                <span class="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wider">${typeBadge}</span>
              </div>
              <div class="absolute bottom-3 right-3 text-xs bg-black/80 px-2 py-1 rounded text-gray-400 font-mono">
                ${item.duration || '04:15'}
              </div>
              <button onclick="window.handleWatchMedia('${mediaUrl}', '${(item.title || '').replace(/'/g, "\\'")}')" class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 cursor-pointer">
                <div class="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg shadow-2xl transform group-hover:scale-110 transition-transform">
                  ▶
                </div>
              </button>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-lg text-white group-hover:text-gray-300 transition-colors mb-2 line-clamp-1">
                  ${item.title}
                </h4>
                <p class="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                  ${item.description || ''}
                </p>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/10">
                <span>🔥 ${item.views || 'Triệu view'}</span>
                <button onclick="window.handleWatchMedia('${mediaUrl}', '${(item.title || '').replace(/'/g, "\\'")}')" class="text-white hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                  Khám phá <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        '.content-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }
      );
    }
  } catch (err) {
    console.error('Lỗi tải media:', err);
  }
}

async function loadProducts(category = '') {
  const container = document.getElementById('products-container');
  if (!container) return;

  try {
    const res = await window.api.getProducts(category);
    const products = res.data || [];

    if (products.length === 0) {
      container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">Chưa có sản phẩm trong danh mục này.</div>`;
      return;
    }

    container.innerHTML = products
      .map((prod) => {
        const formattedPrice = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(prod.price);

        let imgUrl = '';
        if (Array.isArray(prod.images) && prod.images.length > 0) {
          imgUrl = prod.images[0];
        } else if (typeof prod.images === 'string' && prod.images.length > 5) {
          imgUrl = prod.images;
        } else if (typeof prod.image === 'string' && prod.image.length > 5) {
          imgUrl = prod.image;
        }
        if (!imgUrl || imgUrl === 'h') {
          imgUrl = 'https://bethesky.vn/_u/nd/43/sn_1720243454835.png';
        }

        return `
          <div class="product-card rounded-3xl overflow-hidden bg-[#0d0e12] border border-white/10 hover:border-white/30 transition-all flex flex-col group">
            <div class="relative aspect-square overflow-hidden bg-black/60 p-6 flex items-center justify-center">
              <img src="${imgUrl}" alt="${prod.name}" class="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105" onerror="this.onerror=null; this.src='https://bethesky.vn/_u/nd/43/sn_1720243454835.png'" />
              ${prod.isBestSeller ? '<span class="absolute top-3 left-3 bg-white text-black text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg tracking-wider">BEST SELLER</span>' : ''}
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">
                  <span>${prod.category || 'MERCH'}</span>
                  <span>Kho: ${prod.stock || 100}</span>
                </div>
                <h4 class="font-bold text-sm text-white group-hover:text-gray-300 transition-colors mb-2 line-clamp-2">
                  ${prod.name}
                </h4>
                <div class="text-base font-extrabold text-white mb-4">
                  ${formattedPrice}
                </div>
              </div>
              <button onclick="handleQuickOrder('${prod._id}', '${prod.name}', ${prod.price})" class="btn-pill-login py-2.5 w-full justify-center text-xs font-bold uppercase tracking-wider">
                Đặt Hàng Ngay
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        '.product-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }
      );
    }
  } catch (err) {
    console.error('Lỗi tải sản phẩm:', err);
  }
}

// Media Watch Handler (Chiếu trực tiếp trên nền tảng web - Tuyệt đối không chuyển tiếp sang YouTube)
window.handleWatchMedia = (mediaUrl, title) => {
  if (window.api && !window.api.requireAuth('Vui lòng đăng nhập tài khoản Sky để thưởng thức trọn vẹn Music Video và nội dung âm nhạc!')) {
    return;
  }

  // Trích xuất YouTube Video ID chính thức
  let ytid = 'FN7ALfpGxiI';
  if (mediaUrl) {
    const match = mediaUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
    if (match && match[1]) ytid = match[1];
  }
  const t = (title || '').toLowerCase();
  if (t.includes('nơi này có anh')) ytid = 'FN7ALfpGxiI';
  else if (t.includes('muộn rồi')) ytid = 'xypzmu5mMPY';
  else if (t.includes('đừng làm trái tim')) ytid = 'abPmFUZQ28M';
  else if (t.includes('chúng ta của tương lai')) ytid = 'psZ1g9fMfeo';
  else if (t.includes('hãy trao cho anh')) ytid = 'knW7-x7Y7RE';
  else if (t.includes('chạy ngay đi')) ytid = '32sYGCOYJUM';
  else if (t.includes('lạc trôi')) ytid = 'Llw9Q6akRo4';

  let cinemaModal = document.getElementById('modal-cinema-theater');
  let cinemaIframe = document.getElementById('cinema-modal-iframe');
  let cinemaTitle = document.getElementById('cinema-modal-title');

  if (!cinemaModal) {
    cinemaModal = document.createElement('div');
    cinemaModal.id = 'modal-cinema-theater';
    cinemaModal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 md:p-8 transition-all duration-300';
    cinemaModal.innerHTML = `
      <div class="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-red-500/10 flex flex-col max-h-[94vh]">
        <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60">
          <div class="flex items-center gap-3">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
              <i class="fa-solid fa-film"></i> RẠP CHIẾU 4K TRỰC TIẾP
            </span>
            <div>
              <h3 id="cinema-modal-title" class="text-sm sm:text-base font-black text-white line-clamp-1 uppercase tracking-wide">${title || 'Tác Phẩm Âm Nhạc'}</h3>
              <span class="text-[11px] text-zinc-400 font-semibold">Sơn Tùng M-TP &bull; M-TP Entertainment</span>
            </div>
          </div>
          <button id="close-cinema-modal" class="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/80 flex items-center justify-center text-sm transition cursor-pointer" title="Đóng rạp chiếu">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="relative w-full aspect-video bg-black flex items-center justify-center">
          <iframe id="cinema-modal-iframe" src="https://www.youtube.com/embed/${ytid}?autoplay=1&enablejsapi=1&rel=0&playsinline=1" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <div class="px-6 py-3.5 bg-zinc-900/80 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span class="flex items-center gap-1.5 text-amber-400 font-bold"><i class="fa-solid fa-fire"></i> Đang chiếu trực tiếp trên web Sơn Tùng M-TP World</span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 font-bold"><i class="fa-solid fa-check"></i> 1080p / 4K Ultra HD</span>
        </div>
      </div>
    `;
    document.body.appendChild(cinemaModal);
    cinemaModal.querySelector('#close-cinema-modal')?.addEventListener('click', () => {
      const iframe = cinemaModal.querySelector('iframe');
      if (iframe) iframe.src = '';
      cinemaModal.remove();
    });
    cinemaModal.addEventListener('click', (e) => {
      if (e.target.id === 'modal-cinema-theater') {
        const iframe = cinemaModal.querySelector('iframe');
        if (iframe) iframe.src = '';
        cinemaModal.remove();
      }
    });
    return;
  }

  if (cinemaTitle) cinemaTitle.innerText = title;
  if (cinemaIframe) cinemaIframe.src = `https://www.youtube.com/embed/${ytid}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`;
  cinemaModal.classList.remove('hidden');
};

// Tour Ticket Purchase Handler (Bảo vệ: Bắt buộc đăng nhập trước khi mua vé)
window.handleBuyTicket = (link, title) => {
  if (window.api && !window.api.requireAuth('Vui lòng đăng nhập tài khoản Sky để mua vé tham gia SKY TOUR!')) {
    return;
  }
  if (link && link !== '#' && !link.startsWith('javascript:')) {
    window.open(link, '_blank');
  } else {
    alert(`Đã xác nhận đặt chỗ cho: ${title}.\nBan tổ chức sẽ liên hệ gửi vé điện tử qua Email tài khoản Sky của bạn.`);
  }
};

// Simple Merchandise Order Placement
window.handleQuickOrder = async (productId, productName, price) => {
  if (window.api && !window.api.requireAuth('Vui lòng đăng nhập tài khoản Sky để mua hàng và đặt sản phẩm Merchandise!')) {
    return;
  }

  const user = window.api ? window.api.getUser() : null;
  const name = prompt('Nhập họ và tên người nhận:', user ? user.username : 'Nguyễn Văn A');
  if (!name) return;

  const phone = prompt('Nhập số điện thoại nhận hàng:', '0901234567');
  if (!phone) return;

  const address = prompt('Nhập địa chỉ giao hàng:', 'Hà Nội, Việt Nam');
  if (!address) return;

  const email = prompt('Nhập email nhận thông báo đơn:', user ? user.email : 'sky@mtp.vn');
  if (!email) return;

  const orderData = {
    name: name,
    customerName: name,
    customerEmail: email,
    phone: phone,
    customerPhone: phone,
    address: address,
    shippingAddress: address,
    amount: price,
    total_amount: price,
    items: `${productName} (x1)`,
    paymentMethod: 'COD'
  };

  const res = await window.api.createOrder(orderData);
  if (res.success) {
    alert(`Đặt hàng thành công vật phẩm "${productName}"!\nCảm ơn bạn đã ủng hộ Sơn Tùng M-TP Official Merchandise.`);
  } else {
    alert('Đặt hàng thất bại: ' + (res.message || 'Lỗi xử lý'));
  }
};

/* ==========================================================================
 * 10. FILTER TABS & NOTIFICATION FORM
 * ========================================================================== */
function setupFilterTabs() {
  document.querySelectorAll('.content-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.content-filter-btn').forEach((b) => {
        b.classList.remove('bg-white', 'text-black');
        b.classList.add('text-gray-400');
      });
      btn.classList.add('bg-white', 'text-black');
      btn.classList.remove('text-gray-400');
      loadContents(btn.dataset.type);
    });
  });

  document.querySelectorAll('.shop-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.shop-filter-btn').forEach((b) => {
        b.classList.remove('bg-white', 'text-black');
        b.classList.add('text-gray-400');
      });
      btn.classList.add('bg-white', 'text-black');
      btn.classList.remove('text-gray-400');
      loadProducts(btn.dataset.category);
    });
  });
}

function setupSubscribeForm() {
  const form = document.getElementById('subscribe-form');
  const alertBox = document.getElementById('subscribe-alert');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('subscribe-email');
    const email = emailInput?.value.trim();

    if (!email) return;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Đang gửi...';
    btn.disabled = true;

    try {
      const res = await window.api.subscribeNotification(email, 'Sky Fan');

      if (alertBox) {
        alertBox.classList.remove('hidden', 'text-rose-400', 'text-emerald-400');
        if (res.success) {
          alertBox.classList.add('text-emerald-400');
          alertBox.innerText = res.message || 'Đăng ký nhận tin thành công!';
          form.reset();
        } else {
          alertBox.classList.add('text-rose-400');
          alertBox.innerText = res.message || 'Đăng ký không thành công.';
        }
      }
    } catch (err) {
      if (alertBox) {
        alertBox.classList.remove('hidden', 'text-emerald-400');
        alertBox.classList.add('text-rose-400');
        alertBox.innerText = 'Lỗi kết nối máy chủ.';
      }
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}

/**
 * Open Admin Portal Handler
 */
function openAdminPanel() {
  const user = window.api ? window.api.getUser() : null;
  if (!user || (user.role !== 'admin' && user.username !== 'admin')) {
    alert('Vui lòng đăng nhập bằng tài khoản Quản trị (Username: admin / Mật khẩu: admin123).');
    const authModal = document.getElementById('auth-modal');
    if (authModal) openModalWithGsap(authModal);
    return;
  }
  
  // Navigate to Admin Portal
  const loc = window.location;
  if (loc.pathname.includes('admin/')) {
    window.location.reload();
  } else {
    window.location.href = 'admin/index.php';
  }
}

window.openAdminPanel = openAdminPanel;




