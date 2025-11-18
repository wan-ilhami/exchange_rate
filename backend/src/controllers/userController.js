const userService = require('../services/userService');

/**
 * Get all currencies with pagination
 * GET /api/user/currencies?page=1
 */
const getAllCurrencies = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const result = await userService.getAllCurrencies({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined
    });

    res.json(result);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * GET /api/currencies/historical
 * Query params:
 *   - date: YYYY-MM-DD (required)
 *   - page: page number (optional, default: 1)
 *   - limit: number of items (optional, default: 12, max: 100)
 */
const getHistoricalRates = async (req, res) => {
  try {
    const { date, page, limit } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date parameter is required'
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }

    const result = await userService.getHistoricalRates({
      date,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined
    });

    res.json(result);
  } catch (error) {
    console.error('Controller error:', error);

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllCurrencies,
  getHistoricalRates
};