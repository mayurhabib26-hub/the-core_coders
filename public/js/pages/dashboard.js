/* ===================================================================
   AgriSwap — Dashboard Page
   Premium AgriTech restyled with 3 key sections:
   1. Live Market Rates (ticker table with animations)
   2. Smart Barter Matches (card feed with Accept Deal)
   3. Quick Actions (prominent CTAs)
   All original IDs preserved for backend integration.
   =================================================================== */

/* ── Dummy Market Data ─────────────────────────────── */
/* ── Market Data (Fetched from API) ─────────────────────────── */
const MARKET_RATES = [];

/* ── Dummy Barter Matches ─────────────────────────────── */
/* ── Barter Matches (Fetched from API) ─────────────────────────── */
const BARTER_MATCHES = [];


function renderDashboard() {
  if (!requireLogin('#/dashboard')) return;
  const app = document.getElementById('app');
  const user = AppState.user;

  app.innerHTML = `
    <div class="dash">
      <div class="container">

        <!-- ═══════ HEADER ═══════ -->
        <div class="dash-header">
          <div>
            <h1 class="dash-header__title">Welcome back, <span class="gradient-text">${user?.name || 'Farmer'}</span> 👋</h1>
            <p class="dash-header__sub">Here's your farm exchange overview for today</p>
          </div>
          <div class="dash-header__actions">
            <a href="#/create" class="btn-hero btn-hero--primary" id="post-barter-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Post Barter Request
            </a>
          </div>
        </div>

        <!-- ═══════ STATS ROW ═══════ -->
        <div class="stats-grid" id="dashboard-stats">
          ${createStatsCard('📦', '—', 'My Listings', 'green')}
          ${createStatsCard('🔄', '—', 'Active Exchanges', 'amber')}
          ${createStatsCard('⭐', '—', 'Trust Rating', 'blue')}
          ${createStatsCard('✅', '—', 'Completed Trades', 'purple')}
        </div>

        <!-- ═══════ SECTION 1: LIVE MARKET RATES ═══════ -->
        <div class="dash-section">
          <div class="dash-section__header">
            <div class="dash-section__badge">📊 Live Mandi Rates</div>
            <h2 class="dash-section__title">Today's Market <span class="gradient-text">Prices</span></h2>
            <p class="dash-section__sub">Real-time rates from government mandis across India</p>
          </div>

          <div class="market-ticker" id="market-ticker-container">
               <div class="loading-page"><div class="spinner"></div><span>Loading rates...</span></div>
          </div>

          <div class="market-table-wrap" id="market-table-container">
          </div>
        </div>

        <!-- ═══════ SECTION 2: SMART BARTER MATCHES ═══════ -->
        <div class="dash-section">
          <div class="dash-section__header">
            <div class="dash-section__badge">🤝 AI-Powered Matching</div>
            <h2 class="dash-section__title">Smart Barter <span class="gradient-text">Matches</span></h2>
            <p class="dash-section__sub">Intelligent suggestions based on your surplus and needs</p>
          </div>

          <div class="barter-feed" id="barter-feed">
             <div class="loading-page"><div class="spinner"></div><span>Loading matches...</span></div>
          </div>
        </div>

        <!-- ═══════ SECTION 3: QUICK ACTIONS ═══════ -->
        <div class="dash-section">
          <div class="dash-section__header">
            <div class="dash-section__badge">⚡ Quick Actions</div>
            <h2 class="dash-section__title">Get Things <span class="gradient-text">Done</span></h2>
          </div>

          <div class="quick-actions-grid">
            <a href="#/create" class="quick-action-card" id="qa-post-barter">
              <div class="quick-action-card__icon quick-action-card__icon--green">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <h3 class="quick-action-card__title">Post Barter Request</h3>
              <p class="quick-action-card__desc">List your surplus produce or equipment for exchange with nearby farmers</p>
            </a>

            <div class="quick-action-card" id="qa-ai-quality" onclick="openAIQualityCheck()">
              <div class="quick-action-card__icon quick-action-card__icon--amber">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
              </div>
              <h3 class="quick-action-card__title">AI Crop Quality Check</h3>
              <p class="quick-action-card__desc">Upload a photo and let our AI assess crop quality, freshness, and grading</p>
            </div>

            <a href="#/browse" class="quick-action-card" id="qa-browse">
              <div class="quick-action-card__icon quick-action-card__icon--blue">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <h3 class="quick-action-card__title">Browse Barter Market</h3>
              <p class="quick-action-card__desc">Explore what's available near you — produce, equipment, labor & more</p>
            </a>

            <a href="#/exchanges" class="quick-action-card" id="qa-export">
              <div class="quick-action-card__icon quick-action-card__icon--purple">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3 class="quick-action-card__title">Export Connect</h3>
              <p class="quick-action-card__desc">Connect with international buyers and explore export opportunities</p>
            </a>
          </div>
        </div>

        <!-- ═══════ RECENT ACTIVITY ═══════ -->
        <div class="dash-section">
          <div class="dash-section__header">
            <h2 class="dash-section__title">Recent <span class="gradient-text">Activity</span></h2>
          </div>
          <div id="recent-activity">
            <div class="loading-page"><div class="spinner"></div><span>Loading activity...</span></div>
          </div>
        </div>

        <!-- ═══════ MY LISTINGS ═══════ -->
        <div class="dash-section">
          <div class="dash-section__header" style="display:flex;justify-content:space-between;align-items:center;">
            <h2 class="dash-section__title">My <span class="gradient-text">Listings</span></h2>
            <a href="#/my-listings" class="btn-hero btn-hero--outline" style="font-size:0.8rem;padding:0.4rem 1rem;">View All →</a>
          </div>
          <div class="listings-grid" id="dashboard-listings">
            <div class="loading-page"><div class="spinner"></div><span>Loading...</span></div>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══════ FLOATING QUICK-ACTION BUTTON ═══════ -->
    <!-- Removed as requested -->
  `;

  loadDashboardData();
}


/* ── Accept Deal Handler ──────────────────────────── */
function acceptDeal(barterIdStr, farmerName) {
  const btn = document.getElementById('accept-deal-' + barterIdStr);
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Processing...';
    setTimeout(() => {
      btn.innerHTML = '🤝 Deal Accepted!';
      btn.classList.add('btn-deal--accepted');
      Toast.success(`Barter deal with ${farmerName} accepted! They'll be notified.`);
    }, 1200);
  }
}

/* ── AI Quality Check Modal ──────────────────────────── */
function openAIQualityCheck() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-overlay" id="ai-modal-overlay" onclick="if(event.target===this)closeAIModal()">
      <div class="modal" style="max-width:480px;">
        <div class="modal__header">
          <h3 class="modal__title">🔬 AI Crop Quality Check</h3>
          <button class="modal__close" onclick="closeAIModal()">&times;</button>
        </div>
        <div class="modal__body" style="text-align:center;">
          <div style="padding:2rem 0;">
            <div style="width:80px;height:80px;border-radius:1rem;background:rgba(34,197,94,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:2.5rem;">🌿</div>
            <p style="color:#6b8a6b;margin-bottom:1.5rem;">Upload a photo of your crop, and our AI will analyze quality, detect diseases, and suggest grading.</p>
            <label class="btn-hero btn-hero--primary" style="cursor:pointer;display:inline-flex;">
              📸 Upload Crop Photo
              <input type="file" id="ai-crop-upload" accept="image/*" style="display:none;" onchange="simulateAICheck()"/>
            </label>
          </div>
        </div>
      </div>
    </div>
  `;
}

function closeAIModal() {
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) modalRoot.innerHTML = '';
}

function simulateAICheck() {
  Toast.success('🤖 AI Analysis complete: Grade A — Premium quality detected!');
  setTimeout(() => closeAIModal(), 500);
}


async function loadDashboardData() {
  const statsContainer = document.getElementById('dashboard-stats');
  const listingsContainer = document.getElementById('dashboard-listings');
  const activityContainer = document.getElementById('recent-activity');
  const marketTickerContainer = document.getElementById('market-ticker-container');
  const marketTableContainer = document.getElementById('market-table-container');
  const barterFeedContainer = document.getElementById('barter-feed');

  // Load Market Rates from API
  if (marketTickerContainer && marketTableContainer) {
    try {
      const res = await fetch('http://localhost:5000/api/market/rates', {
        headers: {
          'x-api-key': 'agriswap-hackathon-2026'
        }
      });
      if (!res.ok) throw new Error('Network error');
      const rates = await res.json();

      const getEmoji = (crop) => {
        const lower = crop.toLowerCase();
        if (lower.includes('wheat')) return '🌾';
        if (lower.includes('rice')) return '🍚';
        if (lower.includes('tomato')) return '🍅';
        if (lower.includes('sugar')) return '🎋';
        if (lower.includes('cotton')) return '☁️';
        return '🌱';
      };

      // Render Ticker
      marketTickerContainer.innerHTML = `
        <div class="market-ticker__scroll">
          ${rates.map(m => `
            <div class="market-chip">
              <span class="market-chip__emoji">${getEmoji(m.crop)}</span>
              <span class="market-chip__name">${m.crop}</span>
              <span class="market-chip__price">${m.price}</span>
              <span class="market-chip__change ${m.trend === 'up' ? 'up' : 'down'}">${m.trend === 'up' ? '▲' : '▼'} ${m.trend}</span>
            </div>
          `).join('')}
        </div>
      `;

      // Render Table
      marketTableContainer.innerHTML = `
        <table class="market-table">
          <thead>
            <tr>
              <th>Crop</th>
              <th>Price</th>
              <th>Location</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            ${rates.map(m => `
              <tr>
                <td><span class="market-table__crop">${getEmoji(m.crop)} ${m.crop}</span></td>
                <td class="market-table__price">${m.price}</td>
                <td style="color: #6b8a6b;">${m.location}</td>
                <td>
                  <span class="market-change ${m.trend === 'up' ? 'up' : (m.trend === 'down' ? 'down' : 'stable')}">${m.trend.toUpperCase()}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (err) {
      console.error("Market rates API failed", err);
      marketTickerContainer.innerHTML = `<p style="color:var(--danger);padding:1rem;">Failed to load market rates.</p>`;
    }
  }

  // Load Barter Posts from API
  if (barterFeedContainer) {
    try {
      const res = await fetch('http://localhost:5000/api/barter/list', {
        headers: {
          'x-api-key': 'agriswap-hackathon-2026'
        }
      });
      if (!res.ok) throw new Error('Network error');
      const barters = await res.json();

      if (barters.length === 0) {
        barterFeedContainer.innerHTML = `<p style="padding:2rem;color:#6b8a6b;text-align:center;">No barter posts available yet. Be the first to post!</p>`;
      } else {
        barterFeedContainer.innerHTML = barters.map(b => `
          <div class="barter-card">
            <div class="barter-card__img-wrap">
              <img src="${b.img || b.imageUrl || '/images/rice.jpeg'}" alt="Crop" class="barter-card__img" loading="lazy"/>
              <div class="barter-card__score">Active</div>
            </div>
            <div class="barter-card__body">
              <div class="barter-card__farmer">
                <div class="barter-card__avatar">🌾</div>
                <div>
                  <p class="barter-card__name">${b.farmerName || 'Unknown Farmer'}</p>
                </div>
              </div>
              <div class="barter-card__exchange">
                <div class="barter-card__has">
                  <span class="barter-label">OFFERED</span>
                  <span class="barter-value">${b.cropOffered || 'Something'} (${b.qtyOffered || 'N/A'})</span>
                </div>
                <div class="barter-card__arrow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                </div>
                <div class="barter-card__wants">
                  <span class="barter-label">EXPECTED</span>
                  <span class="barter-value">${b.itemExpected || 'Any'}</span>
                </div>
              </div>
              <div class="barter-card__footer">
                <span class="barter-card__time">New</span>
                <button class="btn-deal" id="accept-deal-${b.id}" onclick="acceptDeal('${b.id}','${b.farmerName}')">
                  ✅ Accept Deal
                </button>
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error("Barter list API failed", err);
      barterFeedContainer.innerHTML = `<p style="color:var(--danger);padding:1rem;">Failed to load barter matches. Backend might be down or missing Firebase key.</p>`;
    }
  }

  // Load User Specific Data (Listings & Stats)
  try {
    const listingData = await Api.getMyListings();
    const myListings = listingData.listings || listingData || [];

    // Update stats cards
    if (statsContainer) {
      statsContainer.innerHTML = `
        ${createStatsCard('📦', myListings.length, 'My Listings', 'green')}
        ${createStatsCard('🔄', '0', 'Active Exchanges', 'amber')}
        ${createStatsCard('⭐', '5.0', 'Trust Rating', 'blue')}
        ${createStatsCard('✅', '0', 'Completed Trades', 'purple')}
      `;
    }

    // Render real listings
    if (listingsContainer) {
      if (myListings.length === 0) {
        listingsContainer.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1; padding:2rem;">
            <p class="text-muted">You haven't created any listings yet.</p>
            <a href="#/create" class="btn btn--primary btn--sm" style="margin-top:1rem;">Post First Barter</a>
          </div>
        `;
      } else {
        listingsContainer.innerHTML = myListings.map(l => createListingCard(l)).join('');
      }
    }

    // Clear static activity if empty
    if (activityContainer) {
      activityContainer.innerHTML = `
        <div class="empty-state" style="padding:1rem;">
          <p class="text-muted" style="font-size:var(--fs-xs);">No recent activity to show.</p>
        </div>
      `;
    }

  } catch (err) {
    console.error("Failed to load user dashboard data", err);
    if (listingsContainer) {
      listingsContainer.innerHTML = `<p style="padding:1rem;color:var(--danger);">Error loading your listings.</p>`;
    }
  }
}
