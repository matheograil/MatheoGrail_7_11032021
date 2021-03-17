const express = require('express');
const router = express.Router();

// Authentification nécessaire.
const auth = require('../middlewares/auth');

const messagesCtrl = require('../controllers/messages');

// Publication d'un message.
router.post('/', auth, messagesCtrl.newMessage);    /* POST : api/publication/message */
// Affichage des messages.
router.get('/', auth, messagesCtrl.getAllMessages);    /* GET : api/publication/messages */
// Affichage d'un message.
router.get('/:id', auth, messagesCtrl.getMessage);    /* GET : api/publication/messages/:id */
// Suppression d'un message.
router.delete('/:id', auth, messagesCtrl.delMessage);    /* DELETE : api/publication/messages/:id */

module.exports = router;