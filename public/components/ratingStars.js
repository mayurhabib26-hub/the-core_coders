/* ===================================================================
   AgriSwap — Rating Stars Component
   =================================================================== */

function createStars(rating, maxStars = 5) {
    let html = '<span class="stars">';
    for (let i = 1; i <= maxStars; i++) {
        html += i <= Math.round(rating) ? '⭐' : '☆';
    }
    html += `<span class="text-xs text-muted" style="margin-left:4px">(${Number(rating).toFixed(1)})</span></span>`;
    return html;
}

function createRatingInput(name = 'rating') {
    return `
    <div class="rating-input" id="rating-input">
      ${[1, 2, 3, 4, 5].map(i => `
        <span class="star-btn" data-value="${i}" style="cursor:pointer;font-size:1.8rem;opacity:0.4;transition:opacity 0.15s;" 
              onmouseenter="this.style.opacity='1'" 
              onmouseleave="if(!this.classList.contains('selected'))this.style.opacity='0.4'"
              onclick="document.querySelectorAll('.star-btn').forEach((s,idx)=>{if(idx<${i}){s.style.opacity='1';s.classList.add('selected')}else{s.style.opacity='0.4';s.classList.remove('selected')}});document.getElementById('rating-value').value=${i}">⭐</span>
      `).join('')}
      <input type="hidden" id="rating-value" name="${name}" value="0" />
    </div>
  `;
}
