const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth');


/*
 * Les différentes fonctions de notre route.
 */
// Inscription.
router.post('/register', authCtrl.register);    /* POST : api/auth/register */
// Connexion.
router.post('/login', authCtrl.login);          /* POST : api/auth/login */


module.exports = router;