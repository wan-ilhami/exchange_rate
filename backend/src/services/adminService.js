const pool = require('../config/database');

/**
 * Get all currencies without pagination (admin view)
 * @returns {Object} - { data }
 */
const getAllCurrencies = async () => {
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
    ORDER BY c.id
  `;

  try {
    const result = await pool.query(query);

    return {
      success: true,
      data: result.rows,
      total: result.rows.length
    };
  } catch (error) {
    console.error('Error in getAllCurrencies (admin):', error);
    throw new Error('Failed to fetch currencies');
  }
};

/**
 * Add a new currency with its exchange rate
 * @param {string} code - Currency code (e.g., 'THB')
 * @param {string} name - Currency name (e.g., 'Thai Baht')
 * @param {number} rate - Exchange rate from USD
 * @returns {Object} - { currency, rate }
 */
const addCurrency = async (code, name, rate) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const currencyQuery = `
      INSERT INTO currencies (code, name)
      VALUES ($1, $2)
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
      RETURNING id, code, name, created_at
    `;
    const currencyResult = await client.query(currencyQuery, [code.toUpperCase(), name]);
    const currency = currencyResult.rows[0];

    const rateQuery = `
      INSERT INTO rates (base_currency_id, target_currency_id, rate, effective_date)
      VALUES (
        (SELECT id FROM currencies WHERE code = 'USD'),
        $1,
        $2,
        CURRENT_DATE
      )
      ON CONFLICT (base_currency_id, target_currency_id, effective_date) 
      DO UPDATE SET rate = EXCLUDED.rate, created_at = CURRENT_TIMESTAMP
      RETURNING id, rate, effective_date, created_at
    `;
    const rateResult = await client.query(rateQuery, [currency.id, rate]);
    const rateData = rateResult.rows[0];

    await client.query('COMMIT');

    return {
      success: true,
      message: 'Currency added successfully',
      data: {
        currency,
        rate: rateData
      }
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in addCurrency:', error);

    if (error.code === '23505') {
      throw new Error('Currency code already exists');
    }
    throw new Error('Failed to add currency');
  } finally {
    client.release();
  }
};

/**
 * Update an existing currency and its exchange rate
 * @param {string} id - Currency ID (Primary Key)
 * @param {string} code - Currency code
 * @param {string} name - New currency name
 * @param {number} rate - New exchange rate from USD
 * @returns {Object} - { currency, rate }
 */
const updateCurrency = async (id, code, name, rate) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const checkQuery = `SELECT id, code FROM currencies WHERE id = $1`;
        const checkResult = await client.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            throw new Error('Currency not found');
        }

        const currencyQuery = `
            UPDATE currencies
            SET name = $2
            WHERE id = $1 
            RETURNING id, code, name, created_at
        `;
        const currencyResult = await client.query(currencyQuery, [id, name]);
        const currency = currencyResult.rows[0];

        const rateQuery = `
            INSERT INTO rates (base_currency_id, target_currency_id, rate, effective_date)
            VALUES (
                (SELECT id FROM currencies WHERE code = 'USD'),
                $1,
                $2,
                CURRENT_DATE
            )
            ON CONFLICT (base_currency_id, target_currency_id, effective_date) 
            DO UPDATE SET rate = EXCLUDED.rate, created_at = CURRENT_TIMESTAMP
            RETURNING id, rate, effective_date, created_at
        `;
        const rateResult = await client.query(rateQuery, [currency.id, rate]);
        const rateData = rateResult.rows[0];

        await client.query('COMMIT');

        return {
            success: true,
            message: 'Currency updated successfully',
            data: {
                currency,
                rate: rateData
            }
        };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in updateCurrency:', error);

        if (error.message === 'Currency not found') {
            throw error;
        }
        throw new Error('Failed to update currency');
    } finally {
        client.release();
    }
};

/**
 * Delete a currency and all its associated rates
 * @param {string} id - Currency ID to delete (Primary Key)
 * @returns {Object} - { deletedCurrency }
 */
const deleteCurrency = async (id) => {
    if (!id) {
        throw new Error('Currency ID is required for deletion.');
    }

    const query = `
      DELETE FROM currencies
      WHERE id = $1
      RETURNING code; 
    `;

    try {
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            throw new Error(`Currency with ID ${id} not found.`);
        }
        const deletedCode = result.rows[0].code;
        return { message: `Currency ${deletedCode} (ID: ${id}) deleted successfully` };
    } catch (error) {
        console.error('Error deleting currency by ID:', error);
        throw error;
    }
};

module.exports = {
  getAllCurrencies,
  addCurrency,
  updateCurrency,
  deleteCurrency
};