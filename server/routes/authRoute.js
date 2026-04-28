const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/login', authController.login);
router.post('/mfa/send', authController.sendMfaCode);
router.post('/mfa/verify', authController.verifyMfaCode);
router.post('/google', authController.loginWithGoogle);
module.exports = router;
