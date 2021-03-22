// Importation des modèles.
const { Message, Comment } = require('../sequelize');


/*
 * Importation des modules.
 */
const { Validator } = require('node-input-validator');


/*
 * Déclaration des constantes.
 */
// Importation des variables globales.
const globalVariables = require('../global/variables');


/*
 * Déclaration des fonctions.
 */
// Importation des functions globales.
const globalFunctions = require('../global/functions');


/*
 * Les différentes fonctions de notre route.
 */
// Publication d'un commentaire.
exports.newComment = (req, res) => {
    const newMessageValidator = new Validator(req.body, {
        linkedMessage: 'required|integer|maxLength:11',
        content: 'required|string|maxLength:3000'
    });
    globalFunctions.areVariablesValid(newMessageValidator).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const userId = req.headers.user_id,     /* Variable déjà vérifiée par le middleware 'auth.js' */
        { content, linkedMessage } = req.body;
        Message.findOne({ where: { id: linkedMessage } }).then((message) => {
            if (message === null) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            Comment.findOne({ where: { userId: userId }, order: [[ 'id', 'DESC' ]] }).then((comment) => {
                if (comment !== null && comment.timestamp >= globalVariables.CURRENT_TIMESTAMP - 60) {      /* On autorise un commentaire par minute */
                    return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                }
                const newComment = Comment.build({
                    linkedMessage: linkedMessage,
                    content: content,
                    userId: userId,
                    timestamp: globalVariables.CURRENT_TIMESTAMP
                });
                newComment.save().then(() => res.status(200).json({ message: globalVariables.SUCCESS }));
            });
        });
    });
};