import { api } from './api';

/**
 * API Service for customer-facing exchange rates (Read-Only)
 */
const userAPI = {

    // --- CURRENCY MANAGEMENT ---
    /**
     * Get a paginated list of all supported currencies.
     * GET /api/user/currencies
     */
    getAllCurrencies: async (page = 1, limit = 12) => {
        const response = await api.get('/api/user/currencies', {
            params: { page, limit }
        });
        return response.data;
    },

    /**
     * Get historical exchange rates for a specific date with pagination.
     * GET /api/currencies/historical
     */
    getHistoricalRates: async (date, page = 1, limit = 12) => {
        const response = await api.get('/api/user/currencies/historical', {
            params: { date, page, limit }
        });
        return response.data;
    },

};

export default userAPI;