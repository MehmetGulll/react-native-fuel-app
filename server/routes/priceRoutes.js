const express = require('express');
const router = express.Router();
const priceControllers = require('../controllers/priceControllers');
router.post('/fetchOpetFuelPrice', priceControllers.getOpetPrices);
router.post('/fetchBPPrice', priceControllers.getBPPrices);
router.post('/fetchShellPrice', priceControllers.getShellPrices);
router.post('/fetchAlpetPrice', priceControllers.getAlpetPrices);
router.post('/fetchKadoilPrice', priceControllers.getKadoilPrices)
router.post('/fetchTotalPrice', priceControllers.getTotalPrices);
router.post('/fetchPetrolOfisiPrice', priceControllers.getPetrolOfisiPrices);
router.post('/fetchAytemizPrice',priceControllers.getAytemizPrices);

module.exports = router;