const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');

// Inscription.
router.post('/register', authCtrl.register);    /* POST : api/auth/signup */
// Connexion.
router.post('/login', authCtrl.login);          /* POST : api/auth/login */

module.exports = router;