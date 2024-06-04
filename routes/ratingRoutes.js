const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const verify = require('../middleware/verify');

router.post('/product/:id', verify.verifyToken, ratingController.createRating);
router.patch('/product/:id', verify.verifyToken, ratingController.updateRating);
router.get('/product/:id', verify.verifyToken, ratingController.getRatingByProductId);

module.exports = router;
