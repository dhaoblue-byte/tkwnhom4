/**
 * Auth Manager for Sơn Tùng M-TP World
 * Delegates session management to api.js and ensures seamless compatibility.
 */
const auth = {
  getToken() {
    return window.api ? window.api.getToken() : localStorage.getItem('mtp_auth_token');
  },

  getUser() {
    return window.api ? window.api.getUser() : null;
  },

  isLoggedIn() {
    return window.api ? window.api.isLoggedIn() : !!this.getToken();
  },

  saveSession(token, user) {
    if (window.api) {
      window.api.setSession(token, user);
    }
  },

  logout() {
    if (window.api) {
      window.api.logout();
    }
  },

  updateAuthUI() {
    if (window.api) {
      window.api.updateAuthUI();
    }
  }
};

window.auth = auth;
