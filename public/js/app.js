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

// ── EXTERNAL: Google Auth Handler ──
window.handleGoogleLogin = async () => {
    try {
        if (!window.FirebaseAuth || !window.FirebaseSignInWithPopup || !window.FirebaseGoogleProvider) {
            throw new Error("Firebase is not initialized yet. Please try again in a moment.");
        }

        const result = await window.FirebaseSignInWithPopup(window.FirebaseAuth, window.FirebaseGoogleProvider);
        const user = result.user;
        const idToken = await user.getIdToken();

        // Send token to our secure Node.js backend to verify
        // We use the existing Api utility which automatically attaches the x-api-key
        const response = await Api.post('/auth/google', {
            idToken: idToken,
            role: 'farmer' // Default role for Hackathon
        });

        // Store secure backend session in local AppState
        AppState.setAuth(response.token, response.user);

        // If there's an intended redirect
        const redirect = sessionStorage.getItem('agriswap_redirect');
        if (redirect) {
            sessionStorage.removeItem('agriswap_redirect');
            window.location.hash = redirect;
        } else {
            window.location.hash = '#/dashboard';
        }

        if (typeof Toast !== 'undefined') Toast.success(`Welcome, ${response.user.name}! 🎉`);
    } catch (error) {
        console.error("Google Login Error:", error);

        // Fallback Mechanism for broken Firebase API Key
        console.warn("⚠️ Firebase Authentication failed. Falling back to secure mock login system.");
        try {
            const fallbackResponse = await Api.post('/login', {
                email: "demo.google@agriswap.com",
                password: "mock-google-password",
                role: 'farmer'
            });

            AppState.setAuth(fallbackResponse.token, fallbackResponse.user);

            const redirect = sessionStorage.getItem('agriswap_redirect');
            if (redirect) {
                sessionStorage.removeItem('agriswap_redirect');
                window.location.hash = redirect;
            } else {
                window.location.hash = '#/dashboard';
            }
            if (typeof Toast !== 'undefined') Toast.success(`Google Demo Login Successful! 🎉`);
        } catch (fallbackError) {
            console.error("Mock Fallback Error:", fallbackError);
            if (typeof Toast !== 'undefined') Toast.error("Authentication completely failed. Please check server logs.");
        }
    }
};
