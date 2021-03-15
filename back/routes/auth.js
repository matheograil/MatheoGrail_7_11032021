const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');

// Connexion.
router.post('/register', authCtrl.register);    /* POST : api/auth/signup */
// Inscription.
router.post('/login', authCtrl.login);          /* POST : api/auth/login */

module.exports = router;