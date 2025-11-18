const adminService = require('../services/adminService');

/**
 * Get all currencies without pagination (admin)
 * GET /api/admin/currencies
 */
const getAllCurrencies = async (req, res) => {
  try {
    const result = await adminService.getAllCurrencies();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getAllCurrencies controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Add a new currency
 * POST /api/admin/currencies
 * Body: { code, name, rate }
 */
const addCurrency = async (req, res) => {
  try {
    const { code, name, rate } = req.body;

    // Validation
    if (!code || !name || !rate) {
      return res.status(400).json({
        success: false,
        message: 'Code, name, and rate are required'
      });
    }

    if (code.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Currency code must be exactly 3 characters'
      });
    }

    const rateNum = parseFloat(rate);
    if (isNaN(rateNum) || rateNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Rate must be a positive number'
      });
    }

    const result = await adminService.addCurrency(code, name, rateNum);
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error in addCurrency controller:', error);

    if (error.message === 'Currency code already exists') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Update an existing currency
 * PUT /api/admin/currencies/:id 
 * Body: { code, name, rate }
 */
const updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, rate } = req.body;

    
    if (!id || !code || !name || !rate) { 
      return res.status(400).json({
        success: false,
        message: 'ID, Code, Name, and Rate are required'
      });
    }

    const rateNum = parseFloat(rate);
    if (isNaN(rateNum) || rateNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Rate must be a positive number'
      });
    }

    const result = await adminService.updateCurrency(id, code, name, rateNum);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in updateCurrency controller:', error);

    if (error.message === 'Currency not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Delete a currency
 * DELETE /api/admin/currencies/:id 
 */
const deleteCurrency = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Currency ID is required'
      });
    }

    // Pass ID to the service
    const result = await adminService.deleteCurrency(id);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in deleteCurrency controller:', error);

    // Check if error message contains 'not found'
    if (error.message.toLowerCase().includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === 'Cannot delete base currency (USD)') {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};


module.exports = {
  getAllCurrencies,
  addCurrency,
  updateCurrency,
  deleteCurrency
};