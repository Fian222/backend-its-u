const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/google', authController.loginGoogle);
router.get('/google/callback', authController.callbackGoogle);

module.exports = router;
