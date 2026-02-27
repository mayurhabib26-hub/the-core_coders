/* ===================================================================
   AgriSwap — Landing Page
   Exact replica of agri-flow-intro reference design
   - CinematicLoader (shutter reveal, SVG icon, progress bar)
   - HeroSection (bg image, particles, glows, stats)
   - HowItWorks, FeaturedSection, CTASection, Footer
   =================================================================== */

const HERO_IMAGE = "https://images.pexels.com/photos/5671675/pexels-photo-5671675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const FEATURED_IMAGES = [];

/* ── Cinematic Loader ────────────────────────────────── */
function showCinematicLoader(onComplete) {
  const loader = document.createElement('div');
  loader.id = 'cinematic-loader';
  loader.innerHTML = `
    <div class="cine-shutter cine-shutter--top"></div>
    <div class="cine-shutter cine-shutter--bottom"></div>
    <div class="cine-glow-orb"></div>
    <div class="cine-center">
      <div class="cine-icon">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
          <path d="M12 22V12M12 12C12 12 8 8 4 7M12 12C12 12 16 8 20 7M12 12C12 12 9 6 7 2M12 12C12 12 15 6 17 2" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="4" cy="7" r="1.5" fill="#22c55e" opacity="0.6"/>
          <circle cx="20" cy="7" r="1.5" fill="#22c55e" opacity="0.6"/>
          <circle cx="7" cy="2" r="1.5" fill="#fbbf24" opacity="0.6"/>
          <circle cx="17" cy="2" r="1.5" fill="#fbbf24" opacity="0.6"/>
        </svg>
      </div>
      <div class="cine-title">
        <h1><span class="cine-title__light">Agri</span><span class="cine-title__green">Swap</span></h1>
      </div>
      <div class="cine-bar-wrap">
        <div class="cine-bar-track"><div class="cine-bar-fill" id="cine-bar-fill"></div></div>
      </div>
      <p class="cine-percent" id="cine-percent">0%</p>
    </div>
    <div class="cine-particles" id="cine-particles"></div>
  `;
  document.body.appendChild(loader);

  // Spawn floating particles
  const particlesWrap = document.getElementById('cine-particles');
  for (let i = 0; i < 12; i++) {
    const dot = document.createElement('div');
    dot.className = 'cine-particle';
    const sz = Math.random() * 3 + 1;
    dot.style.width = sz + 'px';
    dot.style.height = sz + 'px';
    dot.style.background = i % 3 === 0 ? '#22c55e' : 'rgba(255,255,255,0.15)';
    dot.style.left = (Math.random() * 100) + '%';
    dot.style.animationDuration = (Math.random() * 4 + 3) + 's';
    dot.style.animationDelay = (Math.random() * 3) + 's';
    particlesWrap.appendChild(dot);
  }

  // Progress animation
  const barFill = document.getElementById('cine-bar-fill');
  const percentEl = document.getElementById('cine-percent');
  const duration = 2200;
  let start = null;

  function animateProgress(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    const pct = Math.min(elapsed / duration * 100, 100);
    barFill.style.width = pct + '%';
    percentEl.textContent = Math.round(pct) + '%';
    if (pct < 100) {
      requestAnimationFrame(animateProgress);
    } else {
      // Reveal phase — shutter opens, content fades
      setTimeout(() => {
        loader.classList.add('revealing');
      }, 300);
      setTimeout(() => {
        loader.classList.add('done');
        setTimeout(() => {
          loader.remove();
          if (onComplete) onComplete();
        }, 500);
      }, 1200);
    }
  }
  requestAnimationFrame(animateProgress);
}


/* ── Particles Canvas (Hero) ─────────────────────────── */
function initHeroParticles(container) {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particles-canvas';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = [];

  function resize() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.7 ? '#22c55e' : 'rgba(255,255,255,0.3)'
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  window.addEventListener('resize', () => { resize(); createParticles(); });
  animate();
}


/* ── Intersection Observer Animations ─────────────────── */
function observeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.anim-on-scroll').forEach(el => observer.observe(el));
}


/* ── Render Landing Page ──────────────────────────────── */
function renderLanding() {
  const app = document.getElementById('app');

  // Show cinematic loader first
  showCinematicLoader(() => {
    // After loader completes, trigger hero animations
    setTimeout(() => {
      document.querySelectorAll('.hero-anim').forEach((el, i) => {
        setTimeout(() => el.classList.add('anim-visible'), i * 150);
      });
      observeAnimations();
    }, 100);
  });

  app.innerHTML = `
    <!-- ═══════ HERO SECTION ═══════ -->
    <section class="hero-section" id="home">
      <!-- Background layers -->
      <div class="hero-bg">
        <div class="hero-bg__image" style="background-image: url('${HERO_IMAGE}')"></div>
        <div class="hero-bg__overlay"></div>
        <div class="hero-bg__gradient"></div>
      </div>

      <!-- Vignette -->
      <div class="hero-vignette"></div>

      <!-- Floating glows -->
      <div class="hero-glow hero-glow--green"></div>
      <div class="hero-glow hero-glow--amber"></div>

      <!-- Content -->
      <div class="hero-content">
        <div class="hero-anim">
          <span class="hero-badge">Farm Exchange Platform</span>
        </div>

        <h1 class="hero-title hero-anim">
          Cultivating Trust, <span class="gradient-text">Harvesting Growth.</span>
        </h1>

        <p class="hero-desc hero-anim">
          The first trust-enabled agricultural exchange platform. Transparently barter surplus produce, equipment, labor, and resources with verified farmers.
        </p>

        <div class="hero-actions hero-anim">
          <a href="#/register" class="btn-hero btn-hero--primary">
            Get Started <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#/browse" class="btn-hero btn-hero--outline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            How it Works
          </a>
        </div>

        <div class="hero-stats hero-anim">
          <div class="hero-stat">
            <p class="hero-stat__value">0+</p>
            <p class="hero-stat__label">Active Farmers</p>
          </div>
          <div class="hero-stat">
            <p class="hero-stat__value">₹0+</p>
            <p class="hero-stat__label">Exchange Volume</p>
          </div>
          <div class="hero-stat">
            <p class="hero-stat__value">5.0</p>
            <p class="hero-stat__label">Trust Score</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════ SECTION DIVIDER ═══════ -->
    <div class="section-divider"></div>

    <!-- ═══════ HOW IT WORKS ═══════ -->
    <section class="section-how anim-on-scroll" id="how-it-works">
      <div class="section-container">
        <div class="section-header anim-on-scroll">
          <span class="section-badge">Simple & Secure</span>
          <h2 class="section-title">How <span class="gradient-text">AgriSwap</span> Works</h2>
          <p class="section-subtitle">Three simple steps to start exchanging agricultural resources with trusted farmers</p>
        </div>
        <div class="how-grid">
          <div class="how-card anim-on-scroll">
            <div class="how-card__number">01</div>
            <div class="how-card__icon-wrap how-card__icon-wrap--green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 class="how-card__title">Create Profile</h3>
            <p class="how-card__desc">Register and verify your farming profile. Add your location, specializations, and trust score begins building automatically.</p>
          </div>
          <div class="how-card anim-on-scroll">
            <div class="how-card__number">02</div>
            <div class="how-card__icon-wrap how-card__icon-wrap--amber">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <h3 class="how-card__title">List Resources</h3>
            <p class="how-card__desc">Post surplus produce, available equipment, or labor capacity with photos and quantities. AI suggests fair exchange values.</p>
          </div>
          <div class="how-card anim-on-scroll">
            <div class="how-card__number">03</div>
            <div class="how-card__icon-wrap how-card__icon-wrap--blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
            </div>
            <h3 class="how-card__title">Exchange & Grow</h3>
            <p class="how-card__desc">Match with nearby farmers, negotiate fair trades, and complete exchanges. Rate each transaction to build community trust.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════ SECTION DIVIDER ═══════ -->
    <div class="section-divider"></div>

    <!-- ═══════ FEATURED SECTION ═══════ -->
    <section class="section-featured anim-on-scroll">
      <div class="section-container">
        <div class="section-header anim-on-scroll">
          <span class="section-badge">Browse Market</span>
          <h2 class="section-title">Featured <span class="gradient-text">Exchanges</span></h2>
          <p class="section-subtitle">Discover what farmers in your region are currently offering for exchange</p>
        </div>
        <div class="featured-grid">
          ${FEATURED_IMAGES.map((img, i) => `
            <div class="featured-card anim-on-scroll" style="transition-delay:${i * 100}ms">
              <div class="featured-card__img-wrap">
                <img src="${img.src}" alt="${img.alt}" class="featured-card__img" loading="lazy"/>
                <div class="featured-card__overlay">
                  <span class="featured-card__label">${img.label}</span>
                  <span class="featured-card__badge badge--${img.category}">${img.category.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- ═══════ SECTION DIVIDER ═══════ -->
    <div class="section-divider"></div>

    <!-- ═══════ STATS SECTION ═══════ -->
    <section class="section-stats anim-on-scroll">
      <div class="section-container">
        <div class="stats-row">
          <div class="stat-block anim-on-scroll">
            <p class="stat-block__value gradient-text">0+</p>
            <p class="stat-block__label">Verified Farmers</p>
          </div>
          <div class="stat-block anim-on-scroll">
            <p class="stat-block__value gradient-text">₹0+</p>
            <p class="stat-block__label">Resources Exchanged</p>
          </div>
          <div class="stat-block anim-on-scroll">
            <p class="stat-block__value gradient-text">0+</p>
            <p class="stat-block__label">Districts Covered</p>
          </div>
          <div class="stat-block anim-on-scroll">
            <p class="stat-block__value gradient-text">5.0/5</p>
            <p class="stat-block__label">Average Rating</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════ SECTION DIVIDER ═══════ -->
    <div class="section-divider"></div>

    <!-- ═══════ CTA SECTION ═══════ -->
    <section class="section-cta anim-on-scroll">
      <div class="section-container">
        <div class="cta-card">
          <div class="cta-card__glow"></div>
          <div class="cta-card__inner">
            <h2 class="cta-card__title">Ready to <span class="gradient-text">Grow Together?</span></h2>
            <p class="cta-card__desc">Join thousands of farmers already exchanging produce, equipment, and labor on the most trusted agricultural platform.</p>
            <div class="hero-actions">
              <a href="#/register" class="btn-hero btn-hero--primary">
                Start Trading <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href="#/browse" class="btn-hero btn-hero--outline">Browse Market</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Init hero particles
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    initHeroParticles(heroSection);
  }

  // Slow zoom on hero bg image
  const heroBgImg = document.querySelector('.hero-bg__image');
  if (heroBgImg) {
    heroBgImg.style.animation = 'heroZoom 20s linear infinite alternate';
  }
}
