/* ===================================================================
   AgriSwap — Auth Pages (Login & Register)
   With Farmer / Customer role selection
   =================================================================== */

function renderAuth() {
  const hash = window.location.hash;
  const isLogin = hash.includes('login');
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M12 22V12M12 12C12 12 8 8 4 7M12 12C12 12 16 8 20 7M12 12C12 12 9 6 7 2M12 12C12 12 15 6 17 2" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="4" cy="7" r="1.5" fill="#22c55e" opacity="0.6"/>
            <circle cx="20" cy="7" r="1.5" fill="#22c55e" opacity="0.6"/>
            <circle cx="7" cy="2" r="1.5" fill="#fbbf24" opacity="0.6"/>
            <circle cx="17" cy="2" r="1.5" fill="#fbbf24" opacity="0.6"/>
          </svg>
          <p class="auth-logo__text">Agri<span class="logo-accent">Swap</span></p>
        </div>
        <h1 class="auth-card__title">${isLogin ? 'Welcome Back!' : 'Join AgriSwap'}</h1>
        <p class="auth-card__subtitle">${isLogin ? 'Log in to continue trading' : 'Create your free account to start exchanging'}</p>

        <!-- ===== ROLE SELECTOR ===== -->
        <div class="role-selector" id="role-selector">
          <p style="text-align:center;font-size:var(--fs-sm);font-weight:600;color:var(--clr-text-2);margin-bottom:var(--sp-3);">I am a</p>
          <div class="role-toggle">
            <button type="button" class="role-btn role-btn--active" id="role-farmer" onclick="selectRole('farmer')">
              <span class="role-btn__icon">🧑‍🌾</span>
              <span class="role-btn__label">Farmer</span>
              <span class="role-btn__desc">List & exchange produce</span>
            </button>
            <button type="button" class="role-btn" id="role-customer" onclick="selectRole('customer')">
              <span class="role-btn__icon">🛒</span>
              <span class="role-btn__label">Customer</span>
              <span class="role-btn__desc">Browse & buy from farmers</span>
            </button>
          </div>
          <input type="hidden" id="auth-role" value="farmer" />
        </div>

        <div style="margin-bottom: var(--sp-6);">
          <button type="button" class="btn btn--outline btn--block" style="display:flex;align-items:center;justify-content:center;gap:0.5rem;padding:0.75rem;font-weight:600;color:var(--clr-text-1);" onclick="handleGoogleLogin()">
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign in with Google
          </button>
        </div>

        <div style="display:flex;align-items:center;text-align:center;color:var(--clr-text-3);margin-bottom:var(--sp-6);">
          <hr style="flex:1;border:none;border-top:1px solid var(--clr-border);">
          <span style="padding:0 1rem;font-size:var(--fs-sm);font-weight:500;">OR</span>
          <hr style="flex:1;border:none;border-top:1px solid var(--clr-border);">
        </div>

        <form id="auth-form" class="auth-form">
          ${!isLogin ? `
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" id="auth-name" placeholder="e.g. Ramesh Kumar" required />
          </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label">${isLogin ? 'Email Address' : 'Phone Number'}</label>
            ${isLogin
      ? '<input type="email" class="form-input" id="auth-email" placeholder="e.g. test@hackathon.com" required />'
      : '<input type="tel" class="form-input" id="auth-phone" placeholder="e.g. 9876543210" required maxlength="10" pattern="[0-9]{10}" />'
    }
          </div>

          ${!isLogin ? `
          <div class="form-group">
            <label class="form-label">District</label>
            <input type="text" class="form-input" id="auth-district" placeholder="e.g. Varanasi" required />
          </div>
          <div class="form-group">
            <label class="form-label">State</label>
            <select class="form-select" id="auth-state" required>
              <option value="">Select State</option>
              <option>Andhra Pradesh</option><option>Bihar</option><option>Chhattisgarh</option>
              <option>Gujarat</option><option>Haryana</option><option>Himachal Pradesh</option>
              <option>Jharkhand</option><option>Karnataka</option><option>Kerala</option>
              <option>Madhya Pradesh</option><option>Maharashtra</option><option>Odisha</option>
              <option>Punjab</option><option>Rajasthan</option><option>Tamil Nadu</option>
              <option>Telangana</option><option>Uttar Pradesh</option><option>Uttarakhand</option>
              <option>West Bengal</option><option>Other</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Pincode</label>
            <input type="text" class="form-input" id="auth-pincode" placeholder="e.g. 221001" maxlength="6" pattern="[0-9]{6}" />
          </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label">${isLogin ? 'OTP / Password' : 'Create Password'}</label>
            <input type="password" class="form-input" id="auth-password" placeholder="${isLogin ? 'Enter OTP or password' : 'Choose a password'}" required minlength="4" />
          </div>

          <button type="submit" class="btn btn--primary btn--lg btn--block" id="auth-submit-btn">
            ${isLogin ? '🔑 Log In' : '🚀 Create Account'}
          </button>
        </form>

        <div class="auth-switch">
          ${isLogin
      ? "Don't have an account? <a href='#/register'>Sign Up Free</a>"
      : "Already have an account? <a href='#/login'>Log In</a>"
    }
        </div>
      </div>
    </div>
  `;

  bindAuthForm(isLogin);
}

/** Toggle role selection */
function selectRole(role) {
  const farmerBtn = document.getElementById('role-farmer');
  const customerBtn = document.getElementById('role-customer');
  const roleInput = document.getElementById('auth-role');

  farmerBtn.classList.toggle('role-btn--active', role === 'farmer');
  customerBtn.classList.toggle('role-btn--active', role === 'customer');
  if (roleInput) roleInput.value = role;
}

/** Require login — call this before any protected action */
function requireLogin(redirectHash) {
  if (!AppState.isLoggedIn()) {
    Toast.warning('Please log in to continue.');
    // Store intended destination
    sessionStorage.setItem('agriswap_redirect', redirectHash || window.location.hash);
    window.location.hash = '#/login';
    return false;
  }
  return true;
}

function bindAuthForm(isLogin) {
  const form = document.getElementById('auth-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('auth-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Please wait...';

    const password = document.getElementById('auth-password').value;
    const role = document.getElementById('auth-role')?.value || 'farmer';

    try {
      if (isLogin) {
        const email = document.getElementById('auth-email').value.trim();
        const data = await Api.login({ email, password, role });
        AppState.setAuth(data.token, data.user || { id: data.id, name: data.name || email, email, role });
        Toast.success('Welcome back! 🎉');
      } else {
        const name = document.getElementById('auth-name').value.trim();
        const phone = document.getElementById('auth-phone').value.trim();
        const district = document.getElementById('auth-district').value.trim();
        const state = document.getElementById('auth-state').value;
        const pincode = document.getElementById('auth-pincode')?.value?.trim() || '';

        const data = await Api.register({ name, phone, password, role, district, state, pincode });
        AppState.setAuth(data.token, data.user || { id: data.id, name, phone, role, district, state });
        Toast.success('Account created! Welcome to AgriSwap 🌾');
      }

      // Redirect to saved destination or dashboard
      const redirect = sessionStorage.getItem('agriswap_redirect');
      if (redirect) {
        sessionStorage.removeItem('agriswap_redirect');
        window.location.hash = redirect;
      } else {
        window.location.hash = '#/dashboard';
      }
    } catch (err) {
      Toast.error(err.message || 'Something went wrong');
      btn.disabled = false;
      btn.textContent = isLogin ? '🔑 Log In' : '🚀 Create Account';
    }
  });
}
