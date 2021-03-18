/*
 * Importation des modèles.
 */
const { Message, Comment } = require('../sequelize');


/*
 * Importation des modules.
 */
const { Validator } = require('node-input-validator');


/*
 * Déclaration des constantes.
 */
const ERROR_WRONG_DATA = 'Les données envoyées ne sont pas valides.';   /* Quand les données envoyées sont invalides */
const ERROR_SERVER = 'Une erreur est survenue.';                        /* Quand une erreur interne au serveur se produit */
const SUCCESS = 'Opération achevée avec succès.';                       /* Quand tout se passe correctement */
const CURRENT_TIMESTAMP = Math.floor(Date.now()/1000);


/*
 * Déclaration des fonctions.
 */
// Importation des functions globales.
const globalFunctions = require('../global/functions');


/*
 * Les différentes fonctions de notre API.
 */
// Publication d'un commentaire.
exports.newComment = (req, res) => {
    const newMessageValidator = new Validator(req.body, {
        linkedMessage: 'required|integer|maxLength:11',
        content: 'required|string|maxLength:3000'
    });
    globalFunctions.areVariablesValid(res, newMessageValidator).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        const { userId, content, linkedMessage } = req.body;
        Message.findOne({ where: { id: linkedMessage } }).then((message) => {
            if (message === null) {
                return res.status(400).json({ error: ERROR_WRONG_DATA });
            }
            Comment.findOne({ where: { userId: userId }, order: [[ 'id', 'DESC' ]] }).then((comment) => {
                if (comment !== null) {
                    if (comment.timestamp >= CURRENT_TIMESTAMP - 60) {       /* On autorise un commentaire par minute */
                        return res.status(400).json({ error: ERROR_WRONG_DATA });
                    }
                }
                const newComment = Comment.build({
                    linkedMessage: linkedMessage,
                    content: content,
                    userId: userId,
                    timestamp: CURRENT_TIMESTAMP
                });
                newComment.save()
                    .then(() => res.status(200).json({ message: SUCCESS }))
                    .catch(() => res.status(500).json({ error: ERROR_SERVER }));
            }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
        }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};