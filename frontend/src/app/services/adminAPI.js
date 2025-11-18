import { api } from './api'; // Import the core instance

/**
 * API Service for Admin exchange rate management (CRUD)
 */
const adminAPI = {
    // --- CURRENCY MANAGEMENT ---

    /**
     * Fetches all supported currencies without pagination (Admin only).
     * GET /api/admin/currencies
     * @returns {Promise<Object>} Response data containing the list of currencies.
     */
    getAllCurrencies: async () => {
        const response = await api.get('/api/admin/currencies');
        return response.data;
    },

    /**
     * Adds a new currency to the system.
     * POST /api/admin/currencies
     * @param {string} code 3-letter currency code (e.g., "EUR").
     * @param {string} name Full currency name (e.g., "Euro").
     * @param {number} rate Exchange rate against the base currency.
     * @returns {Promise<Object>} Response data confirming the addition.
     */
    addCurrency: async (code, name, rate) => {
        const response = await api.post('/api/admin/currencies', { code, name, rate });
        return response.data;
    },

    /**
    * Updates the name and rate of an existing currency.
    * PUT /api/admin/currencies/:id <-- FIX 1: Updated URL in comment
    * @param {string} id The database ID of the currency to update.
    * @param {string} code 3-letter currency code (required by service logic).
    * @param {string} name New full currency name.
    * @param {number} rate New exchange rate against the base currency.
    * @returns {Promise<Object>} Response data confirming the update.
    */
    updateCurrency: async (id, code, name, rate) => {
        const response = await api.put(`/api/admin/currencies/${id}`, { code, name, rate });
        return response.data;
    },

    /**
    * Deletes a currency.
    * DELETE /api/admin/currencies/:id
    * @param {number} id - The database ID of the currency.
    */
    deleteCurrency: async (id) => {
        const response = await api.delete(`/api/admin/currencies/${id}`);
        return response.data;
    }
};

export default adminAPI;