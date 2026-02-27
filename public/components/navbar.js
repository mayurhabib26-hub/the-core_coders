/* ===================================================================
   AgriSwap — Navbar Component
   Handles hamburger, avatar dropdown, scroll shadow, active link
   =================================================================== */

const NavbarComponent = {
    init() {
        this.bindHamburger();
        this.bindAvatarDropdown();
        this.bindLogout();
        this.bindScrollShadow();
        this.highlightActiveLink();
        this.bindSearch();

        // Re-init Lucide icons
        if (window.lucide) lucide.createIcons();
    },

    bindHamburger() {
        const hamburger = document.getElementById('hamburger');
        const overlay = document.getElementById('mobile-nav-overlay');
        if (!hamburger || !overlay) return;

        hamburger.addEventListener('click', () => {
            overlay.classList.toggle('hidden');
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
            }
        });
    },

    bindAvatarDropdown() {
        const avatar = document.getElementById('user-avatar');
        const dropdown = document.getElementById('avatar-dropdown');
        if (!avatar || !dropdown) return;

        avatar.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            dropdown.classList.add('hidden');
        });
    },

    bindLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (!logoutBtn) return;

        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            AppState.clearAuth();
            Toast.success('Logged out successfully!');
            window.location.hash = '#/';
        });
    },

    bindScrollShadow() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    },

    bindSearch() {
        const searchInput = document.getElementById('global-search');
        if (!searchInput) return;

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.hash = '#/browse?q=' + encodeURIComponent(query);
                } else {
                    window.location.hash = '#/browse';
                }
                searchInput.blur();
            }
        });
    },

    highlightActiveLink() {
        const hashFull = window.location.hash || '#/';
        const hash = hashFull.split('?')[0];
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.classList.remove('active');
            const page = link.getAttribute('data-page');
            if (page && hash.includes(page === 'home' ? '#/' : `#/${page}`)) {
                if (page === 'home' && hash === '#/') link.classList.add('active');
                else if (page !== 'home' && hash.startsWith(`#/${page}`)) link.classList.add('active');
            }
        });
    },
};
