/* ===================================================================
   AgriSwap — Main App Router (SPA)
   Hash-based routing, page rendering, and init
   =================================================================== */

const Router = {
    routes: {},

    // Register routes
    init() {
        this.routes = {
            '#/': renderLanding,
            '#/login': renderAuth,
            '#/register': renderAuth,
            '#/dashboard': renderDashboard,
            '#/browse': renderBrowse,
            '#/create': renderCreateListing,
            '#/my-listings': renderMyListings,
            '#/exchanges': renderExchanges,
        };

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.navigate());

        // Initial route
        this.navigate();
    },

    navigate() {
        const hashFull = window.location.hash || '#/';
        const hashPath = hashFull.split('?')[0];

        // Scroll to top
        window.scrollTo(0, 0);

        // Exact match
        if (this.routes[hashPath]) {
            this.routes[hashPath]();
            this.postNavigate(hashFull);
            return;
        }

        // Dynamic routes
        if (hashPath.startsWith('#/listing/')) {
            renderListingDetail();
            this.postNavigate(hashFull);
            return;
        }

        if (hashPath.startsWith('#/profile/')) {
            renderProfile();
            this.postNavigate(hashFull);
            return;
        }

        // 404 fallback
        this.render404();
        this.postNavigate(hashFull);
    },

    postNavigate(hash) {
        // Update active nav link
        NavbarComponent.highlightActiveLink();

        // Re-init lucide icons
        setTimeout(() => {
            if (window.lucide) lucide.createIcons();
        }, 100);

        // Close mobile nav
        const overlay = document.getElementById('mobile-nav-overlay');
        if (overlay) overlay.classList.add('hidden');
    },

    render404() {
        const app = document.getElementById('app');
        app.innerHTML = `
      <div class="section" style="text-align:center;padding:var(--sp-20) 0;">
        <div class="container">
          <div style="font-size:4rem;margin-bottom:var(--sp-4);">🌾</div>
          <h1 style="font-size:var(--fs-3xl);margin-bottom:var(--sp-4);">Page Not Found</h1>
          <p class="text-muted" style="margin-bottom:var(--sp-8);">The page you're looking for doesn't exist or has been moved.</p>
          <a href="#/" class="btn btn--primary btn--lg">← Back to Home</a>
        </div>
      </div>
    `;
    },
};

// ── GLOBAL: Init on DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
    AppState.init();
    NavbarComponent.init();
    Router.init();
});

// Also handle initial load if DOM is already ready
if (document.readyState !== 'loading') {
    AppState.init();
    NavbarComponent.init();
    Router.init();
}

// ── SECURITY: Number Matching Challenge ──
window.showSecurityChallenge = function (onSuccess, onFailOrCancel) {
    // Generate Target and two decoys (1-99)
    const target = Math.floor(Math.random() * 90) + 10;
    let decoy1 = Math.floor(Math.random() * 90) + 10;
    while (decoy1 === target) decoy1 = Math.floor(Math.random() * 90) + 10;
    let decoy2 = Math.floor(Math.random() * 90) + 10;
    while (decoy2 === target || decoy2 === decoy1) decoy2 = Math.floor(Math.random() * 90) + 10;

    // Shuffle options
    const options = [target, decoy1, decoy2].sort(() => Math.random() - 0.5);

    // Create Modal HTML
    const overlay = document.createElement('div');
    overlay.id = 'security-challenge-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    overlay.style.backdropFilter = 'blur(4px)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    const modal = document.createElement('div');
    modal.style.backgroundColor = 'var(--clr-surface)';
    modal.style.padding = '2rem';
    modal.style.borderRadius = '1rem';
    modal.style.textAlign = 'center';
    modal.style.maxWidth = '320px';
    modal.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';

    modal.innerHTML = `
        <h3 style="margin-bottom:0.5rem;color:var(--clr-text-1);">Security Verification</h3>
        <p style="margin-bottom:1.5rem;color:var(--clr-text-2);font-size:0.95rem;">
            Please tap the number <strong style="font-size:1.4rem;color:var(--clr-primary);">${target}</strong> to prove you are human.
        </p>
        <div style="display:flex;gap:1rem;justify-content:center;">
            ${options.map(num => `
                <button class="btn btn--outline" style="width:60px;height:60px;font-size:1.2rem;border-radius:50%;padding:0;color:var(--clr-primary);border-color:var(--clr-primary);" onclick="window.submitSecurityChallenge(${num}, ${target})">
                    ${num}
                </button>
            `).join('')}
        </div>
        <button class="btn btn--ghost" style="margin-top:1.5rem;font-size:0.85rem;" onclick="const ov=document.getElementById('security-challenge-overlay'); if(ov){ document.body.removeChild(ov); if(window.securityChallengeFail) window.securityChallengeFail(); }">Cancel</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    window.securityChallengeFail = onFailOrCancel;

    // Global responder
    window.submitSecurityChallenge = (selected, actual) => {
        const ov = document.getElementById('security-challenge-overlay');
        if (ov) document.body.removeChild(ov);

        if (selected === actual) {
            onSuccess();
        } else {
            if (typeof Toast !== 'undefined') Toast.error("Security verification failed. Try again.");
            if (onFailOrCancel) onFailOrCancel();
        }
    };
};

// ── EXTERNAL: Google Auth Handler ──
window.handleGoogleLogin = async () => {
    try {
        if (!window.FirebaseAuth || !window.FirebaseSignInWithPopup || !window.FirebaseGoogleProvider) {
            throw new Error("Firebase is not initialized yet. Please try again in a moment.");
        }

        const result = await window.FirebaseSignInWithPopup(window.FirebaseAuth, window.FirebaseGoogleProvider);
        const user = result.user;
        const idToken = await user.getIdToken();

        // Pass security check before fully granting session
        window.showSecurityChallenge(async () => {
            try {
                const response = await Api.post('/auth/google', {
                    idToken: idToken,
                    role: 'farmer' // Default role for Hackathon
                });

                AppState.setAuth(response.token, response.user);

                const redirect = sessionStorage.getItem('agriswap_redirect');
                if (redirect) {
                    sessionStorage.removeItem('agriswap_redirect');
                    window.location.hash = redirect;
                } else {
                    window.location.hash = '#/dashboard';
                }
                if (typeof Toast !== 'undefined') Toast.success(`Welcome, ${response.user.name}! 🎉`);
            } catch (backendError) {
                console.error(backendError);
                if (typeof Toast !== 'undefined') Toast.error("Backend validation failed.");
            }
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        if (typeof Toast !== 'undefined') Toast.error(error.message || "Google Login failed. Please try again or use email.");
    }
};
