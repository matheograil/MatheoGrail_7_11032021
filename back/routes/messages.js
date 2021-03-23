const express = require('express');
const router = express.Router();


/*
 * Importation des middlewares.
 */
// Authentification nécessaire.
const auth = require('../middlewares/auth');
// Téléchargement des images grâce à 'multer'.
const multer = require('../middlewares/multer');


const messagesCtrl = require('../controllers/messages');


/*
 * Les différentes fonctions de notre route.
 */
// Publication d'un message.
router.post('/', auth, multer, messagesCtrl.newMessage);            /* POST : api/publication/messages */
// Affichage des messages.
router.get('/', auth, messagesCtrl.getAllMessages);         /* GET : api/publication/messages */
// Affichage d'un message.
router.get('/:id', auth, messagesCtrl.getMessage);          /* GET : api/publication/messages/:id */
// Modification d'un message.
router.put('/:id', auth, multer, messagesCtrl.editMessage);         /* PUT : api/publication/messages/:id */
// Suppression d'un message.
router.delete('/:id', auth, messagesCtrl.delMessage);           /* DELETE : api/publication/messages/:id */


module.exports = router;