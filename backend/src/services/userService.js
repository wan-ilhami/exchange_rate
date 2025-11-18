const pool = require('../config/database');

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;
const MIN_LIMIT = 1;

/**
 * Validates and sanitizes limit parameter
 * @param {number} limit - Requested limit
 * @returns {number} - Valid limit between MIN_LIMIT and MAX_LIMIT
 */
const validateLimit = (limit) => {
  const parsed = parseInt(limit);
  if (isNaN(parsed) || parsed < MIN_LIMIT) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
};

/**
 * Validates page parameter
 * @param {number} page - Page number
 * @returns {number} - Valid page number (minimum 1)
 */
const validatePage = (page) => {
  const parsed = parseInt(page);
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
};

/**
 * Get all currencies with offset pagination and their latest rates
 * @param {Object} options - Pagination options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Number of items to return (default: 12, max: 100)
 * @returns {Object} - { success, data, pagination }
 */
const getAllCurrencies = async ({ page = 1, limit = DEFAULT_LIMIT } = {}) => {
  const validLimit = validateLimit(limit);
  const validPage = validatePage(page);
  const offset = (validPage - 1) * validLimit;

  const query = `
    SELECT 
      c.id,
      c.code,
      c.name,
      c.created_at,
      r.rate as latest_rate,
      r.effective_date as rate_date
    FROM currencies c
    LEFT JOIN LATERAL (
      SELECT rate, effective_date
      FROM rates
      WHERE target_currency_id = c.id
        AND base_currency_id = (SELECT id FROM currencies WHERE code = 'USD')
      ORDER BY effective_date DESC
      LIMIT 1
    ) r ON true
    ORDER BY c.code
    LIMIT $1 OFFSET $2
  `;

  const countQuery = `SELECT COUNT(*) as total FROM currencies`;

  try {
    const [currenciesResult, countResult] = await Promise.all([
      pool.query(query, [validLimit, offset]),
      pool.query(countQuery)
    ]);

    const total = parseInt(countResult.rows[0].total) || 0;
    const totalPages = Math.ceil(total / validLimit);

    return {
      success: true,
      data: currenciesResult.rows,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages,
        hasMore: validPage < totalPages,
        hasPrevious: validPage > 1
      }
    };
  } catch (error) {
    console.error('Error in getAllCurrencies:', error);
    throw new Error('Failed to fetch currencies');
  }
};

/**
 * Get historical rates with offset pagination
 * Returns the most recent rate for each currency on or before the specified date
 * @param {Object} options - Options object
 * @param {string} options.date - Date in format 'YYYY-MM-DD'
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Number of items to return (default: 12, max: 100)
 * @returns {Object} - { success, data, pagination, queryDate }
 */
const getHistoricalRates = async ({ date, page = 1, limit = DEFAULT_LIMIT }) => {

  if (date === null || date === undefined) {
    throw new Error('Date parameter is required');
  }

  const validLimit = validateLimit(limit);
  const validPage = validatePage(page);
  const offset = (validPage - 1) * validLimit;

  const query = `
    SELECT 
      r.id,
      base.code AS base_currency,
      target.code AS target_currency,
      target.name AS target_currency_name,
      r.rate,
      r.effective_date,
      r.created_at
    FROM rates r
    JOIN currencies base ON r.base_currency_id = base.id
    JOIN currencies target ON r.target_currency_id = target.id
    WHERE r.id IN (
      SELECT DISTINCT ON (target_currency_id) id
      FROM rates
      WHERE effective_date <= $1
        AND base_currency_id = (SELECT id FROM currencies WHERE code = 'USD')
      ORDER BY target_currency_id, effective_date DESC
    )
    ORDER BY target.code
    LIMIT $2 OFFSET $3
  `;

  const countQuery = `
    SELECT COUNT(DISTINCT target_currency_id) as total
    FROM rates
    WHERE effective_date <= $1
      AND base_currency_id = (SELECT id FROM currencies WHERE code = 'USD')
  `;

  try {
    const [ratesResult, countResult] = await Promise.all([
      pool.query(query, [date, validLimit, offset]),
      pool.query(countQuery, [date])
    ]);

    const total = parseInt(countResult.rows[0].total) || 0;
    const totalPages = Math.ceil(total / validLimit);

    return {
      success: true,
      data: ratesResult.rows,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages,
        hasMore: validPage < totalPages,
        hasPrevious: validPage > 1
      },
      queryDate: date
    };
  } catch (error) {
    console.error('Error in getHistoricalRates:', error);
    throw new Error('Failed to fetch historical rates');
  }
};

module.exports = {
  getAllCurrencies,
  getHistoricalRates,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  MIN_LIMIT
};