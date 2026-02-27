/* ===================================================================
   AgriSwap — My Listings Page
   =================================================================== */

function renderMyListings() {
  if (!requireLogin('#/my-listings')) return;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="section">
      <div class="container">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp-8);">
          <div>
            <h1 style="font-size:var(--fs-3xl);">📦 My Listings</h1>
            <p class="text-muted" style="margin-top:var(--sp-2);">Manage your listed items</p>
          </div>
          <a href="#/create" class="btn btn--primary">➕ New Listing</a>
        </div>
        <div class="listings-grid" id="my-listings-grid">
          <div class="loading-page" style="grid-column:1/-1;"><div class="spinner"></div><span>Loading your listings...</span></div>
        </div>
      </div>
    </div>
  `;

  loadMyListings();
}

async function loadMyListings() {
  const container = document.getElementById('my-listings-grid');
  if (!container) return;

  try {
    const data = await Api.getMyListings();
    const listings = data.listings || data || [];

    if (listings.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div class="empty-state__icon">📋</div>
          <h3 class="empty-state__title">No listings yet</h3>
          <p class="empty-state__desc">Start by listing your surplus produce, equipment, or labor.</p>
          <a href="#/create" class="btn btn--primary">Create First Listing</a>
        </div>
      `;
      return;
    }

    container.innerHTML = listings.map(l => createListingCard(l)).join('');
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-state__icon">🔌</div>
        <h3 class="empty-state__title">Backend not connected</h3>
        <p class="empty-state__desc">Start the backend server to see your listings. <code>node server.js</code></p>
      </div>
    `;
  }
}
