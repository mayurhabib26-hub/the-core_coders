/* ===================================================================
   AgriSwap — Create Listing Page
   =================================================================== */

function renderCreateListing() {
  if (!requireLogin('#/create')) return;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="section">
      <div class="container" style="max-width:680px;">
        <h1 style="font-size:var(--fs-3xl);margin-bottom:var(--sp-2);">📋 List a New Item</h1>
        <p class="text-muted" style="margin-bottom:var(--sp-8);">Add your surplus produce, equipment, or services for exchange</p>

        <form id="create-listing-form" class="auth-form card" style="padding:var(--sp-8);">
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input type="text" class="form-input" id="cl-title" placeholder="e.g. Organic Wheat Grain" required />
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-4);">
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select class="form-select" id="cl-category" required>
                <option value="">Select category</option>
                <option value="produce">🌾 Produce</option>
                <option value="equipment">🔧 Equipment</option>
                <option value="labor">👷 Labor</option>
                <option value="raw_material">📦 Raw Material</option>
              </select>
            </div>
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--sp-2);">
              <div class="form-group">
                <label class="form-label">Quantity *</label>
                <input type="number" class="form-input" id="cl-quantity" min="1" placeholder="e.g. 50" required />
              </div>
              <div class="form-group">
                <label class="form-label">Unit</label>
                <select class="form-select" id="cl-unit">
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="ton">ton</option>
                  <option value="litre">litre</option>
                  <option value="pieces">pieces</option>
                  <option value="hours">hours</option>
                  <option value="days">days</option>
                  <option value="workers">workers</option>
                  <option value="unit">unit</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="cl-description" rows="4" placeholder="Describe your item, quality, and any other details..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Photo</label>
            <input type="file" class="form-input" id="cl-image" accept="image/*" />
            <span class="text-xs text-muted">Upload a clear photo of your item (optional)</span>
          </div>

          <div class="form-group">
            <label class="form-label">Exchange Preference</label>
            <input type="text" class="form-input" id="cl-exchange-pref" placeholder="e.g. Rice, Fertilizer, Equipment (comma-separated)" />
            <span class="text-xs text-muted">What would you like in exchange?</span>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-4);">
            <div class="form-group">
              <label class="form-label">District *</label>
              <input type="text" class="form-input" id="cl-district" value="${AppState.user?.district || ''}" placeholder="e.g. Varanasi" required />
            </div>
            <div class="form-group">
              <label class="form-label">Pincode</label>
              <input type="text" class="form-input" id="cl-pincode" value="${AppState.user?.pincode || ''}" placeholder="e.g. 221001" maxlength="6" />
            </div>
          </div>

          <button type="submit" class="btn btn--primary btn--lg btn--block" id="cl-submit">
            🚀 Publish Listing
          </button>
        </form>
      </div>
    </div>
  `;

  bindCreateListingForm();
}

function bindCreateListingForm() {
  const form = document.getElementById('create-listing-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('cl-submit');
    btn.disabled = true;
    btn.textContent = 'Publishing...';

    const formData = new FormData();
    formData.append('title', document.getElementById('cl-title').value.trim());
    formData.append('category', document.getElementById('cl-category').value);
    formData.append('quantity', document.getElementById('cl-quantity').value);
    formData.append('unit', document.getElementById('cl-unit').value);
    formData.append('description', document.getElementById('cl-description').value.trim());
    formData.append('exchangePreference', document.getElementById('cl-exchange-pref').value.trim());
    formData.append('district', document.getElementById('cl-district').value.trim());
    formData.append('pincode', document.getElementById('cl-pincode').value.trim());

    const imageInput = document.getElementById('cl-image');
    if (imageInput.files[0]) {
      formData.append('image', imageInput.files[0]);
    }

    // Attach current user's name and ID for mock backend
    if (AppState.user) {
      if (AppState.user.name) formData.append('ownerName', AppState.user.name);
      if (AppState.user.id) formData.append('ownerId', AppState.user.id);
    }

    try {
      await Api.createListing(formData);
      Toast.success('Listing published! 🎉');
      window.location.hash = '#/my-listings';
    } catch (err) {
      Toast.error(err.message || 'Failed to create listing');
      btn.disabled = false;
      btn.textContent = '🚀 Publish Listing';
    }
  });
}
