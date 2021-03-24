const express = require('express');
const router = express.Router();


/*
 * Importation des middlewares.
 */
// Authentification nécessaire.
const auth = require('../middlewares/auth');


const accountsCtrl = require('../controllers/accounts');


/*
 * Les différentes fonctions de notre route.
 */
// Récupération des détails d'un utilisateur.
router.get('/details/:id', auth, accountsCtrl.getDetails);          /* POST : api/accounts/details/:id */


module.exports = router;