/* ===================================================================
   AgriSwap — Profile Page
   =================================================================== */

function renderProfile() {
  const app = document.getElementById('app');
  const hash = window.location.hash; // #/profile/u1 or #/profile/me
  const userId = hash.split('/').pop();

  const isMe = userId === 'me' || userId === AppState.user?.id;

  app.innerHTML = `<div class="loading-page"><div class="spinner"></div><span>Loading profile...</span></div>`;

  loadProfile(userId, isMe);
}

async function loadProfile(userId, isMe) {
  const app = document.getElementById('app');

  let profile = null;

  if (isMe && AppState.user) {
    profile = {
      ...AppState.user,
      rating: AppState.user.rating || 4.5,
      exchanges: AppState.user.exchanges || 12,
      bio: 'Small farmer passionate about organic farming and fair trade.',
    };
  }

  if (!profile) {
    try {
      const data = await Api.getUserProfile(userId);
      profile = data.user || data;
    } catch (err) {
      // Demo fallback
      profile = { id: userId, name: 'Farmer', rating: 5.0, exchanges: 0, bio: '', createdAt: new Date().toISOString() };
    }
  }

  const reviews = [];

  app.innerHTML = `
    <div class="section">
      <div class="container" style="max-width:800px;">
        <!-- Profile Header -->
        <div class="card" style="text-align:center;padding:var(--sp-10);">
          <div class="avatar-circle" style="width:80px;height:80px;font-size:var(--fs-3xl);margin:0 auto var(--sp-4);">
            ${profile.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <h1 style="font-size:var(--fs-2xl);">${profile.name || 'Unknown'}</h1>
          <p class="text-muted" style="margin-top:var(--sp-2);">
            📍 ${profile.district || ''}${profile.state ? ', ' + profile.state : ''} 
          </p>
          <div style="display:flex;justify-content:center;gap:var(--sp-8);margin-top:var(--sp-6);">
            <div>
              <div style="font-size:var(--fs-2xl);font-weight:800;color:var(--clr-primary-700);">${profile.rating?.toFixed(1) || '—'}</div>
              <div class="text-xs text-muted">Rating</div>
              <div style="margin-top:var(--sp-1);">${createStars(profile.rating || 0)}</div>
            </div>
            <div style="border-left:1px solid var(--clr-border);padding-left:var(--sp-8);">
              <div style="font-size:var(--fs-2xl);font-weight:800;color:var(--clr-accent-600);">${profile.exchanges || 0}</div>
              <div class="text-xs text-muted">Exchanges</div>
            </div>
          </div>
          ${profile.bio ? `<p style="margin-top:var(--sp-6);color:var(--clr-text-2);max-width:460px;margin-left:auto;margin-right:auto;">${profile.bio}</p>` : ''}
          ${isMe ? `<a href="#/my-listings" class="btn btn--outline" style="margin-top:var(--sp-6);">📦 My Listings</a>` : ''}
        </div>

        <!-- Reviews -->
        <div style="margin-top:var(--sp-8);">
          <h2 style="font-size:var(--fs-xl);margin-bottom:var(--sp-6);">⭐ Reviews</h2>
          <div style="display:flex;flex-direction:column;gap:var(--sp-4);" id="profile-reviews">
            ${reviews.map(r => `
              <div class="card card--flat">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--sp-2);">
                  <strong>${r.reviewer}</strong>
                  <span class="text-xs text-muted">${r.date}</span>
                </div>
                <div style="margin-bottom:var(--sp-2);">${createStars(r.rating)}</div>
                <p style="color:var(--clr-text-2);font-size:var(--fs-sm);">${r.comment}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
