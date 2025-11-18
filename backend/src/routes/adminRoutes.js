const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

/**
 * @route   GET /api/admin/currencies
 * @desc    Get all currencies without pagination
 * @access  Admin
 */
router.get('/currencies', adminController.getAllCurrencies);

/**
 * @route   POST /api/admin/currencies
 * @desc    Add a new currency with its exchange rate
 * @body    { code, name, rate }
 * @access  Admin
 */
router.post('/currencies', adminController.addCurrency);

/**
 * @route   PUT /api/admin/currencies/:code
 * @desc    Update an existing currency
 * @params  code - Currency code
 * @body    { name, rate }
 * @access  Admin
 */
router.put('/currencies/:id', adminController.updateCurrency);

/**
 * @route   DELETE /api/admin/currencies/:id
 * @desc    Delete a currency and all its rates
 * @params  id - Currency ID <-- FIX 3: Changed route path and parameter in comment
 * @access  Admin
 */
router.delete('/currencies/:id', adminController.deleteCurrency);

module.exports = router;