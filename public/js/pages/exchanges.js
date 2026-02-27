/* ===================================================================
   AgriSwap — Exchanges Page
   =================================================================== */

function renderExchanges() {
  if (!requireLogin('#/exchanges')) return;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="section">
      <div class="container">
        <h1 style="font-size:var(--fs-3xl);margin-bottom:var(--sp-2);">🔄 My Exchanges</h1>
        <p class="text-muted" style="margin-bottom:var(--sp-8);">Track your trade proposals and completed exchanges</p>

        <div class="tabs" id="exchange-tabs">
          <button class="tab active" data-status="pending" onclick="switchExchangeTab('pending')">📩 Incoming</button>
          <button class="tab" data-status="outgoing" onclick="switchExchangeTab('outgoing')">📤 Outgoing</button>
          <button class="tab" data-status="completed" onclick="switchExchangeTab('completed')">✅ Completed</button>
        </div>

        <div id="exchanges-list">
          <div class="loading-page"><div class="spinner"></div><span>Loading exchanges...</span></div>
        </div>
      </div>
    </div>
  `;

  loadExchanges('pending');
}

function switchExchangeTab(status) {
  // Update active tab
  document.querySelectorAll('#exchange-tabs .tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`#exchange-tabs .tab[data-status="${status}"]`)?.classList.add('active');
  loadExchanges(status);
}

async function loadExchanges(status) {
  const container = document.getElementById('exchanges-list');
  if (!container) return;

  container.innerHTML = '<div class="loading-page"><div class="spinner"></div><span>Loading...</span></div>';

  // Demo exchanges
  const demoExchanges = { pending: [], outgoing: [], completed: [] };

  try {
    const data = await Api.getExchanges(status);
    const exchanges = data.exchanges || data || [];
    if (exchanges.length > 0) {
      container.innerHTML = renderExchangeList(exchanges, status);
      return;
    }
  } catch (err) {
    // Fallback to demo
  }

  const exchanges = demoExchanges[status] || [];
  if (exchanges.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">📭</div>
        <h3 class="empty-state__title">No ${status} exchanges</h3>
        <p class="empty-state__desc">Browse the market and propose exchanges to get started!</p>
        <a href="#/browse" class="btn btn--primary">Browse Market</a>
      </div>
    `;
    return;
  }

  container.innerHTML = renderExchangeList(exchanges, status);
}

function renderExchangeList(exchanges, currentTab) {
  return exchanges.map(ex => `
    <div class="exchange-card" style="margin-bottom:var(--sp-4);">
      <div class="exchange-card__items">
        <div class="exchange-card__item">
          <span>📦</span>
          <div>
            <strong>${ex.offeredItem?.title || 'Item'}</strong><br/>
            <span class="text-xs text-muted">${ex.offeredItem?.quantity || '?'} ${ex.offeredItem?.unit || 'kg'}</span>
          </div>
        </div>
        <div class="exchange-card__arrow">⇄</div>
        <div class="exchange-card__item">
          <span>🎯</span>
          <div>
            <strong>${ex.targetItem?.title || 'Item'}</strong><br/>
            <span class="text-xs text-muted">${ex.targetItem?.quantity || '?'} ${ex.targetItem?.unit || 'kg'}</span>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--sp-2);min-width:160px;">
        <span class="badge badge--${ex.status}">${ex.status}</span>
        <span class="text-xs text-muted">Fairness: ${ex.fairnessScore || '—'}%</span>
        ${currentTab === 'pending' ? `
          <div class="exchange-card__actions">
            <button class="btn btn--primary btn--sm" onclick="handleExchangeAction('${ex.id}','accept')">✅ Accept</button>
            <button class="btn btn--danger btn--sm" onclick="handleExchangeAction('${ex.id}','reject')">❌ Reject</button>
          </div>
        ` : ''}
        ${ex.status === 'completed' ? `
          <button class="btn btn--accent btn--sm" onclick="openRatingModal('${ex.id}')">⭐ Rate</button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

async function handleExchangeAction(exchangeId, action) {
  try {
    await Api.updateExchange(exchangeId, action);
    Toast.success(`Exchange ${action}ed! 🎉`);
    loadExchanges(action === 'accept' ? 'pending' : 'pending');
  } catch (err) {
    Toast.error(err.message);
  }
}

function openRatingModal(exchangeId) {
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)document.getElementById('modal-root').innerHTML=''">
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title">⭐ Rate This Exchange</h2>
          <button class="modal__close" onclick="document.getElementById('modal-root').innerHTML=''">&times;</button>
        </div>
        <div class="modal__body">
          ${createRatingInput('rating')}
          <div class="form-group" style="margin-top:var(--sp-4);">
            <label class="form-label">Review (optional)</label>
            <textarea class="form-textarea" id="review-text" rows="3" placeholder="How was the exchange experience?"></textarea>
          </div>
        </div>
        <div class="modal__footer">
          <button class="btn btn--ghost" onclick="document.getElementById('modal-root').innerHTML=''">Cancel</button>
          <button class="btn btn--primary" onclick="submitRating('${exchangeId}')">Submit Rating</button>
        </div>
      </div>
    </div>
  `;
}

async function submitRating(exchangeId) {
  const rating = document.getElementById('rating-value')?.value || 0;
  const comment = document.getElementById('review-text')?.value || '';

  if (rating < 1) {
    Toast.warning('Please select a rating.');
    return;
  }

  try {
    await Api.submitReview({ exchangeId, rating: Number(rating), comment });
    Toast.success('Rating submitted! Thank you 🙏');
    document.getElementById('modal-root').innerHTML = '';
  } catch (err) {
    Toast.error(err.message);
  }
}
