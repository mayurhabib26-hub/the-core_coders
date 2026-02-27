/* ===================================================================
   AgriSwap — Listing Card Component
   Reusable listing card HTML generator
   =================================================================== */

function createListingCard(listing) {
  const categoryColors = {
    produce: 'produce',
    equipment: 'equipment',
    labor: 'labor',
    raw_material: 'raw_material',
  };

  const categoryLabels = {
    produce: '🌾 Produce',
    equipment: '🔧 Equipment',
    labor: '👷 Labor',
    raw_material: '📦 Raw Material',
  };

  const badgeClass = categoryColors[listing.category] || 'produce';
  const badgeLabel = categoryLabels[listing.category] || listing.category;
  const ownerInitial = listing.owner?.name?.charAt(0)?.toUpperCase() || '?';
  const rating = listing.owner?.rating?.toFixed(1) || '—';
  const imgSrc = (listing.imageUrl && !listing.imageUrl.includes('undefined')) ? listing.imageUrl : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=250&fit=crop';

  return `
    <article class="listing-card" onclick="window.location.hash='#/listing/${listing.id}'" data-id="${listing.id}">
      <img class="listing-card__image" src="${imgSrc}" style="object-fit:cover;" alt="${listing.title}" loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=250&fit=crop'" />
      <div class="listing-card__body">
        <div class="listing-card__header">
          <h3 class="listing-card__title">${listing.title}</h3>
          <span class="badge badge--${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="listing-card__meta">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${listing.location?.district || 'India'}</span>
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> ${listing.quantity} ${listing.unit || 'kg'}</span>
        </div>
        <div class="listing-card__footer">
          <div class="listing-card__owner">
            <div class="avatar-sm">${ownerInitial}</div>
            <span>${listing.owner?.name || 'Unknown'}</span>
          </div>
          <div class="listing-card__rating">
            ⭐ ${rating}
          </div>
        </div>
      </div>
    </article>
  `;
}
