/* ===================================================================
   AgriSwap — Listing Detail Page
   =================================================================== */

function renderListingDetail() {
  const app = document.getElementById('app');
  const hash = window.location.hash; // #/listing/3?q=something
  const pathPart = hash.split('?')[0];
  const id = pathPart.split('/').pop();

  app.innerHTML = `<div class="loading-page"><div class="spinner"></div><span>Loading listing...</span></div>`;

  loadListingDetail(id);
}

async function loadListingDetail(id) {
  const app = document.getElementById('app');

  // Demo data lookup
  const demoListings = {}; // Cleared for fresh start from database

  let listing = null;
  try {
    listing = await Api.getListing(id);
    if (!listing || listing.error) {
      throw new Error("Listing not found from API");
    }
  } catch (err) {
    listing = demoListings[id] || null;
  }

  if (!listing) {
    app.innerHTML = `
      <div class="section"><div class="container">
        <div class="empty-state">
          <div class="empty-state__icon">😕</div>
          <h3 class="empty-state__title">Listing not found</h3>
          <p class="empty-state__desc">This listing may have been removed or doesn't exist.</p>
          <a href="#/browse" class="btn btn--primary">← Back to Barter Market</a>
        </div>
      </div></div>
    `;
    return;
  }

  const categoryLabels = { produce: '🌾 Produce', equipment: '🔧 Equipment', labor: '👷 Labor', raw_material: '📦 Raw Material' };

  app.innerHTML = `
    <div class="section">
      <div class="container">
        <a href="#/browse" class="btn btn--ghost" style="margin-bottom:var(--sp-6);">← Back to Browse</a>

        <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:var(--sp-8);align-items:start;">
          <!-- Left: Image & Info -->
          <div>
            <img src="${listing.imageUrl}" alt="${listing.title}" 
                 style="width:100%;height:400px;object-fit:cover;border-radius:var(--radius-lg);margin-bottom:var(--sp-6);"
                 onerror="this.src='https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=250&fit=crop'" />
            
            <div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-4);">
              <span class="badge badge--${listing.category}">${categoryLabels[listing.category] || listing.category}</span>
              <span class="text-xs text-muted">Listed ${new Date(listing.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>

            <h1 style="font-size:var(--fs-3xl);margin-bottom:var(--sp-3);">${listing.title}</h1>
            
            <div style="display:flex;gap:var(--sp-6);margin-bottom:var(--sp-6);">
              <div style="display:flex;align-items:center;gap:var(--sp-2);color:var(--clr-text-2);font-size:var(--fs-sm);">
                📍 ${listing.location?.district || 'India'}${listing.location?.pincode ? ' — ' + listing.location.pincode : ''}
              </div>
              <div style="display:flex;align-items:center;gap:var(--sp-2);color:var(--clr-text-2);font-size:var(--fs-sm);">
                📦 ${listing.quantity} ${listing.unit || 'kg'}
              </div>
            </div>

            <div style="margin-bottom:var(--sp-6);">
              <h3 style="font-size:var(--fs-md);margin-bottom:var(--sp-3);">Description</h3>
              <p style="color:var(--clr-text-2);line-height:1.8;">${listing.description || 'No description provided.'}</p>
            </div>

            ${listing.exchangePreference ? `
            <div style="margin-bottom:var(--sp-6);">
              <h3 style="font-size:var(--fs-md);margin-bottom:var(--sp-3);">Looking to exchange for</h3>
              <div style="display:flex;gap:var(--sp-2);flex-wrap:wrap;">
                ${listing.exchangePreference.split(',').map(p => `<span class="badge badge--produce">${p.trim()}</span>`).join('')}
              </div>
            </div>
            ` : ''}
          </div>

          <!-- Right: Owner Card + Actions -->
          <div>
            <!-- Owner Card -->
            <div class="card" style="margin-bottom:var(--sp-6);">
              <div style="display:flex;align-items:center;gap:var(--sp-4);margin-bottom:var(--sp-4);">
                <div class="avatar-circle" style="width:52px;height:52px;font-size:var(--fs-lg);">
                  ${listing.owner?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 style="font-size:var(--fs-md);">${listing.owner?.name || 'Unknown'}</h3>
                  <div style="display:flex;align-items:center;gap:var(--sp-3);margin-top:var(--sp-1);">
                    ${createStars(listing.owner?.rating || 4.5)}
                    <span class="text-xs text-muted">${listing.owner?.exchanges || 0} trades</span>
                  </div>
                </div>
              </div>
              <a href="#/profile/${listing.owner?.id || 'me'}" class="btn btn--ghost btn--block btn--sm">View Profile →</a>
            </div>

            <!-- Fair Value Estimator -->
            <div class="card" style="margin-bottom:var(--sp-6);background:var(--clr-accent-50);border-color:var(--clr-accent-200);">
              <h3 style="font-size:var(--fs-md);margin-bottom:var(--sp-3);color:var(--clr-primary-900);">💰 Estimated Market Value</h3>
              <p style="font-size:var(--fs-2xl);font-weight:800;color:var(--clr-primary-700);margin-bottom:var(--sp-2);">
                ₹${((listing.quantity || 1) * (listing.category === 'equipment' ? 200 : listing.category === 'labor' ? 500 : 25)).toLocaleString('en-IN')}
              </p>
              <p class="text-xs text-muted">Based on current mandi rates for ${listing.location?.district || 'your area'}</p>
            </div>

            <!-- Propose Exchange -->
            <button class="btn btn--primary btn--lg btn--block" id="propose-exchange-btn" onclick="handleProposeExchange()">
              🤝 Propose Exchange
            </button>
            <p class="text-xs text-muted text-center" style="margin-top:var(--sp-3);">Select one of your listings to offer in exchange</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Store listing ref for modal
  window._currentListing = listing;

  if (window.lucide) lucide.createIcons();
}

function handleProposeExchange() {
  if (!requireLogin('#/listing/' + (window._currentListing?.id || ''))) return;
  if (window._currentListing) {
    openExchangeModal(window._currentListing);
  }
}
