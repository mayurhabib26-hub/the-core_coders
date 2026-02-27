/* ===================================================================
   AgriSwap — Toast Notification System
   =================================================================== */

const Toast = {
    show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
        };

        toast.innerHTML = `
      <span>${icons[type] || 'ℹ️'}</span>
      <span>${message}</span>
    `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, duration);
    },

    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error'); },
    warning(msg) { this.show(msg, 'warning'); },
    info(msg) { this.show(msg, 'info'); },
};
