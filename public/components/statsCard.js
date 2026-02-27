/* ===================================================================
   AgriSwap — Stats Card Component
   =================================================================== */

function createStatsCard(icon, value, label, colorClass = 'green') {
    return `
    <div class="stat-card">
      <div class="stat-card__icon stat-card__icon--${colorClass}">
        ${icon}
      </div>
      <div>
        <div class="stat-card__value">${value}</div>
        <div class="stat-card__label">${label}</div>
      </div>
    </div>
  `;
}
