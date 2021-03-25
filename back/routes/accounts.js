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
router.get('/details/:id', auth, accountsCtrl.getDetails);          /* GET : api/accounts/details/:id */
// Modification des paramètres d'un utilisateur.
router.put('/me', auth, accountsCtrl.editParameters);            /* PUT : api/accounts/me */
// Désactivation du compte.
router.delete('/me', auth, accountsCtrl.deleteMyAccount);            /* DELETE : api/accounts/me */


module.exports = router;