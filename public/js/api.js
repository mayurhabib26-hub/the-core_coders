/* ===================================================================
   AgriSwap — API Communication Layer
   All fetch() wrappers for backend endpoints
   =================================================================== */

const API_BASE = 'http://localhost:5000/api';

const Api = {
    // ── Helper: Build headers ──
    _headers(isFormData = false) {
        const headers = {
            'x-api-key': 'agriswap-hackathon-2026'
        };
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        if (AppState.token) {
            headers['Authorization'] = `Bearer ${AppState.token}`;
        }
        if (AppState.user && AppState.user.id) {
            headers['x-user-id'] = AppState.user.id;
        }
        return headers;
    },

    // ── Helper: Handle response ──
    async _handleResponse(res) {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const errMsg = data.message || data.error || `Request failed (${res.status})`;
            throw new Error(errMsg);
        }
        return data;
    },

    // ── Generic Methods ──
    async get(path) {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'GET',
            headers: this._headers(),
        });
        return this._handleResponse(res);
    },

    async post(path, body) {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'POST',
            headers: this._headers(),
            body: JSON.stringify(body),
        });
        return this._handleResponse(res);
    },

    async patch(path, body) {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'PATCH',
            headers: this._headers(),
            body: JSON.stringify(body),
        });
        return this._handleResponse(res);
    },

    async put(path, body) {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'PUT',
            headers: this._headers(),
            body: JSON.stringify(body),
        });
        return this._handleResponse(res);
    },

    async del(path) {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'DELETE',
            headers: this._headers(),
        });
        return this._handleResponse(res);
    },

    async postFormData(path, formData) {
        const res = await fetch(`${API_BASE}${path}`, {
            method: 'POST',
            headers: this._headers(true),
            body: formData,
        });
        return this._handleResponse(res);
    },

    // ── AUTH ──
    register(data) {
        return this.post('/auth/register', data);
    },

    login(data) {
        return this.post('/login', data);
    },

    // ── LISTINGS ──
    getListings(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return this.get(`/listings${params ? '?' + params : ''}`);
    },

    getListing(id) {
        return this.get(`/listings/${id}`);
    },

    getMyListings() {
        return this.get('/listings/me');
    },

    createListing(formData) {
        return this.postFormData('/listings', formData);
    },

    updateListing(id, data) {
        return this.put(`/listings/${id}`, data);
    },

    deleteListing(id) {
        return this.del(`/listings/${id}`);
    },

    // ── EXCHANGES ──
    proposeExchange(data) {
        return this.post('/exchanges/propose', data);
    },

    getExchanges(status = '') {
        return this.get(`/exchanges${status ? '?status=' + status : ''}`);
    },

    getExchange(id) {
        return this.get(`/exchanges/${id}`);
    },

    updateExchange(id, action) {
        return this.patch(`/exchanges/${id}`, { action });
    },

    // ── VALUATION ──
    getEstimate(data) {
        return this.post('/valuation/estimate', data);
    },

    // ── USERS & REVIEWS ──
    getUserProfile(id) {
        return this.get(`/users/${id}/profile`);
    },

    getUserReviews(id) {
        return this.get(`/users/${id}/reviews`);
    },

    submitReview(data) {
        return this.post('/reviews', data);
    },
};
