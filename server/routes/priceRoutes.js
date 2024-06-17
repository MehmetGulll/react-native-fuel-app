const express = require('express');
const router = express.Router();
const priceControllers = require('../controllers/priceControllers');
router.post('/fetchOpetFuelPrice', priceControllers.getOpetPrices);
router.post('/fetchBPPrice', priceControllers.getBPPrices);

module.exports = router;