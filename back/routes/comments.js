const express = require('express');
const router = express.Router();

// Authentification nécessaire.
const auth = require('../middlewares/auth');

const commentsCtrl = require('../controllers/comments');


/*
 * Les différentes fonctions de notre route.
 */
// Publication d'un commentaire.
router.post('/', auth, commentsCtrl.newComment);            /* POST : api/publication/comments */
// Affichage des commentaires.
router.get('/:id', auth, commentsCtrl.getComments);         /* GET : api/publication/comments/:id */
// Suppression d'un commentaire.
router.delete('/:id', auth, commentsCtrl.delComment);           /* DELETE : api/publication/comments/:id */

module.exports = router;