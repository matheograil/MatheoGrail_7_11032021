const express = require('express');
const router = express.Router();

// Authentification nécessaire.
const auth = require('../middlewares/auth');

const publicationCtrl = require('../controllers/publication');

// Publication d'un message.
router.post('/message', auth, publicationCtrl.message);    /* POST : api/publication/message */

module.exports = router;