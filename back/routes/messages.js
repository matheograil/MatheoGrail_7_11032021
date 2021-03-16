const express = require('express');
const router = express.Router();

// Authentification nécessaire.
const auth = require('../middlewares/auth');

const messagesCtrl = require('../controllers/messages');

// Publication d'un message.
router.post('/', auth, messagesCtrl.newMessage);    /* POST : api/publication/message */
// Affichage des messages.
router.get('/', auth, messagesCtrl.getAllMessages);    /* GET : api/publication/messages */

module.exports = router;