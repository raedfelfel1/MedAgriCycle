const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

router.post('/generate', recommendationController.generateRecommendations);
router.get('/farm/:user', recommendationController.getRecommendationsByUser);

module.exports = router;


