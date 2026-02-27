/* ===================================================================
   AgriSwap — Browse Listings Page
   =================================================================== */

function renderBrowse() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="section">
      <div class="container">
        <div class="section__header" style="text-align:left;">
          <h1 class="section__title">🌾 Barter Market</h1>
          <p class="section__subtitle" style="margin:0;">Discover available produce, equipment, labor, and raw materials near you</p>
        </div>
        <div class="browse-layout">
          ${createFilterSidebar(applyBrowseFilters)}
          <div>
            <div class="listings-grid" id="browse-listings">
              <div class="loading-page" style="grid-column:1/-1;"><div class="spinner"></div><span>Loading listings...</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  bindFilterEvents(applyBrowseFilters);

  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const searchParam = urlParams.get('q');

  if (searchParam) {
    document.getElementById('global-search').value = searchParam;
    loadBrowseListings({ search: searchParam });
  } else {
    loadBrowseListings({});
  }
}

async function loadBrowseListings(filters) {
  const container = document.getElementById('browse-listings');
  if (!container) return;

  container.innerHTML = '<div class="loading-page" style="grid-column:1/-1;"><div class="spinner"></div><span>Loading...</span></div>';

  const demoListings = []; // Removed all hardcoded demo items for a fresh start from database

  try {
    const data = await Api.getListings(filters);
    const listings = data.listings || data || [];
    if (listings.length > 0) {
      container.innerHTML = listings.map(l => createListingCard(l)).join('');
      return;
    }
  } catch (err) {
    // Use demo data
  }

  // Apply client-side demo filter
  let filtered = demoListings;

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      (l.location && l.location.district.toLowerCase().includes(q))
    );
  }

  if (filters.category) {
    const cats = filters.category.split(',');
    filtered = filtered.filter(l => cats.includes(l.category));
  }
  if (filters.district) {
    filtered = filtered.filter(l => l.location.district.toLowerCase().includes(filters.district.toLowerCase()));
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-state__icon">🔍</div>
        <h3 class="empty-state__title">No listings found</h3>
        <p class="empty-state__desc">Try adjusting your filters or check back later.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(l => createListingCard(l)).join('');
}

function applyBrowseFilters(filters) {
  loadBrowseListings(filters);
}
