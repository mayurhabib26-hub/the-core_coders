/* ===================================================================
   AgriSwap — Exchange Modal Component
   =================================================================== */

function openExchangeModal(targetListing) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-overlay" id="exchange-modal-overlay">
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title">Propose an Exchange</h2>
          <button class="modal__close" id="close-exchange-modal">&times;</button>
        </div>
        <div class="modal__body">
          <div style="background:var(--clr-primary-50);border-radius:var(--radius-md);padding:var(--sp-4);margin-bottom:var(--sp-6);">
            <p class="text-sm" style="font-weight:600;color:var(--clr-primary-800);">You want:</p>
            <p style="font-size:var(--fs-lg);font-weight:700;color:var(--clr-primary-900);margin-top:var(--sp-1);">${targetListing.title} — ${targetListing.quantity} ${targetListing.unit || 'kg'}</p>
            <p class="text-xs" style="color:var(--clr-primary-700);">by ${targetListing.owner?.name || 'Unknown'}</p>
          </div>

          <form id="exchange-form" class="auth-form">
            <div class="form-group">
              <label class="form-label">Select your listing to offer</label>
              <select class="form-select" id="offer-listing-select" required>
                <option value="">-- Choose from your listings --</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Quantity to offer</label>
              <input type="number" class="form-input" id="offer-quantity" min="1" placeholder="e.g. 30" required />
            </div>

            <div id="fair-value-box" class="hidden" style="background:var(--clr-accent-50);border-radius:var(--radius-md);padding:var(--sp-4);text-align:center;">
              <p class="text-sm text-muted">Estimated fairness</p>
              <p id="fairness-score" style="font-size:var(--fs-2xl);font-weight:800;color:var(--clr-primary-700);"></p>
              <p id="fairness-suggestion" class="text-xs text-muted"></p>
            </div>

            <div class="form-group">
              <label class="form-label">Message (optional)</label>
              <textarea class="form-textarea" id="offer-message" rows="2" placeholder="I'd like to trade my rice for your wheat..."></textarea>
            </div>
          </form>
        </div>
        <div class="modal__footer">
          <button class="btn btn--ghost" id="cancel-exchange">Cancel</button>
          <button class="btn btn--primary" id="submit-exchange">Send Proposal</button>
        </div>
      </div>
    </div>
  `;

  // Load user's listings into select
  loadUserListingsForModal();

  // Bind close
  document.getElementById('close-exchange-modal').onclick = closeExchangeModal;
  document.getElementById('cancel-exchange').onclick = closeExchangeModal;
  document.getElementById('exchange-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'exchange-modal-overlay') closeExchangeModal();
  });

  // Bind submit
  document.getElementById('submit-exchange').onclick = async () => {
    const offeredListingId = document.getElementById('offer-listing-select').value;
    const offeredQuantity = document.getElementById('offer-quantity').value;
    const message = document.getElementById('offer-message').value;

    if (!offeredListingId || !offeredQuantity) {
      Toast.warning('Please select a listing and enter quantity.');
      return;
    }

    try {
      await Api.proposeExchange({
        targetListingId: targetListing.id,
        offeredListingId,
        offeredQuantity: Number(offeredQuantity),
        message,
      });
      Toast.success('Exchange proposal sent! 🎉');
      closeExchangeModal();
    } catch (err) {
      Toast.error(err.message);
    }
  };
}

async function loadUserListingsForModal() {
  try {
    const data = await Api.getMyListings();
    const select = document.getElementById('offer-listing-select');
    if (!select) return;

    const listings = data.listings || data || [];
    listings.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.id;
      opt.textContent = `${l.title} (${l.quantity} ${l.unit || 'kg'})`;
      select.appendChild(opt);
    });
  } catch (err) {
    // User may not have listings
    console.log('Could not load user listings:', err.message);
  }
}

function closeExchangeModal() {
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) modalRoot.innerHTML = '';
}
