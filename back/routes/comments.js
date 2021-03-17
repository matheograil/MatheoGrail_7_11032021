const express = require('express');
const router = express.Router();

// Authentification nécessaire.
const auth = require('../middlewares/auth');

const commentsCtrl = require('../controllers/comments');

// Publication d'un message.
router.post('/', auth, commentsCtrl.newComment);    /* POST : api/publication/comments */

module.exports = router;