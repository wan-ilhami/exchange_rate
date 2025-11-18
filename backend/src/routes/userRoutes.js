const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/currencies', userController.getAllCurrencies);
router.get('/currencies/historical', userController.getHistoricalRates);

module.exports = router;