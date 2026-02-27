/* ===================================================================
   AgriSwap — Client State Management
   Manages auth tokens, current user, and reactive state
   =================================================================== */

const AppState = {
  // Auth
  token: localStorage.getItem('agriswap_token') || null,
  user: JSON.parse(localStorage.getItem('agriswap_user') || 'null'),

  // Initialize state from localStorage
  init() {
    this.token = localStorage.getItem('agriswap_token') || null;
    this.user = JSON.parse(localStorage.getItem('agriswap_user') || 'null');
    this.updateAuthUI();
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!this.token && !!this.user;
  },

  // Set auth data after login/register
  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('agriswap_token', token);
    localStorage.setItem('agriswap_user', JSON.stringify(user));
    this.updateAuthUI();
  },

  // Clear auth data on logout
  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('agriswap_token');
    localStorage.removeItem('agriswap_user');
    this.updateAuthUI();
  },

  // Update navbar based on auth status
  updateAuthUI() {
    const guestEl = document.getElementById('guest-actions');
    const userEl = document.getElementById('user-actions');
    const authOnlyLinks = document.querySelectorAll('.auth-only');

    if (!guestEl || !userEl) return;

    if (this.isLoggedIn()) {
      guestEl.classList.add('hidden');
      userEl.classList.remove('hidden');
      authOnlyLinks.forEach(el => el.style.display = '');

      // Update avatar
      const avatarCircle = document.getElementById('avatar-circle');
      if (avatarCircle && this.user.name) {
        avatarCircle.textContent = this.user.name.charAt(0).toUpperCase();
      }

      // Update name display
      const nameObj = document.getElementById('user-display-name');
      if (nameObj && this.user.name) {
        nameObj.textContent = this.user.name;
      }
    } else {
      guestEl.classList.remove('hidden');
      userEl.classList.add('hidden');
      authOnlyLinks.forEach(el => el.style.display = 'none');
    }
  },

  // Get user's initial for avatar
  getUserInitial() {
    return this.user?.name?.charAt(0)?.toUpperCase() || '?';
  }
};
