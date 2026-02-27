/* ===================================================================
   AgriSwap — Filter Sidebar Component
   =================================================================== */

function createFilterSidebar(onFilter) {
    return `
    <aside class="filter-sidebar card card--flat">
      <h3 style="font-size:var(--fs-md);margin-bottom:var(--sp-6);">🔍 Filters</h3>

      <div class="filter-group">
        <div class="filter-group__title">Category</div>
        <label class="filter-check"><input type="checkbox" name="category" value="produce" /> 🌾 Produce</label>
        <label class="filter-check"><input type="checkbox" name="category" value="equipment" /> 🔧 Equipment</label>
        <label class="filter-check"><input type="checkbox" name="category" value="labor" /> 👷 Labor</label>
        <label class="filter-check"><input type="checkbox" name="category" value="raw_material" /> 📦 Raw Material</label>
      </div>

      <div class="filter-group">
        <div class="filter-group__title">Location</div>
        <input type="text" class="form-input" id="filter-district" placeholder="Enter district..." />
      </div>

      <div class="filter-group">
        <div class="filter-group__title">Availability</div>
        <label class="filter-check"><input type="checkbox" id="filter-available" checked /> Available only</label>
      </div>

      <button class="btn btn--primary btn--block" id="apply-filters">Apply Filters</button>
      <button class="btn btn--ghost btn--block" id="clear-filters" style="margin-top:var(--sp-2);">Clear All</button>
    </aside>
  `;
}

function bindFilterEvents(onFilter) {
    const applyBtn = document.getElementById('apply-filters');
    const clearBtn = document.getElementById('clear-filters');

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const checked = document.querySelectorAll('input[name="category"]:checked');
            const categories = Array.from(checked).map(c => c.value);
            const district = document.getElementById('filter-district')?.value || '';
            onFilter({ category: categories.join(','), district });
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.querySelectorAll('input[name="category"]').forEach(c => c.checked = false);
            const districtInput = document.getElementById('filter-district');
            if (districtInput) districtInput.value = '';
            onFilter({});
        });
    }
}
