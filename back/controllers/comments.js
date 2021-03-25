// Importation des modèles.
const { Comment } = require('../sequelize');


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
    const newCommentValidator = new Validator(req.body, {
        linkedMessage: 'required|integer|maxLength:11',
        content: 'required|string|maxLength:3000'
    });
    globalFunctions.areVariablesValid(newCommentValidator).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const userId = req.headers.user_id,         /* Variable déjà vérifiée par le middleware 'auth.js' */
        { content, linkedMessage } = req.body;
        globalFunctions.findOneMessage(linkedMessage).then(message => {
            if (message === null) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            Comment.findOne({ where: { userId: userId }, order: [[ 'id', 'DESC' ]] }).then(comment => {
                if (comment !== null && comment.timestamp >= globalVariables.CURRENT_TIMESTAMP - 60) {          /* On autorise un commentaire par minute */
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

// Affichage des commentaires.
exports.getComments = (req, res) => {
    globalFunctions.areVariablesValid(globalFunctions.idValidator(req)).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        globalFunctions.findOneMessage(id).then(message => {
            if (message === null) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            Comment.findAll({ where: { linkedMessage: id }, order: [[ 'id', 'DESC' ]] }).then(comments => {
                res.status(200).json(comments);
            });
        });
    });
};

// Modification d'un commentaire.
exports.editComment = (req, res) => {
    globalFunctions.areVariablesValid(globalFunctions.idContentValidator(req)).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const userId = req.headers.user_id,         /* Variable déjà vérifiée par le middleware 'auth.js' */
        id = req.params.id,
        content = req.body.content;
        Comment.update({ content: content }, { where: { id: id, userId: userId }, limit: 1 }).then(comment => {
            if (comment === 0) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            res.status(200).json({ message: globalVariables.SUCCESS });
        });
    });
};

// Suppression d'un commentaire.
exports.delComment = (req, res) => {
    globalFunctions.areVariablesValid(globalFunctions.idValidator(req)).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const userId = req.headers.user_id,         /* Variable déjà vérifiée par le middleware 'auth.js' */
        id = req.params.id;
        globalFunctions.isAdmin(userId).then(isAdmin => {
            if (isAdmin) {
                Comment.destroy({ where: { id: id }, limit: 1 }).then(comment => {
                    if (comment === 0) {
                        return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                    }
                    res.status(200).json({ message: globalVariables.SUCCESS });
                });
            } else {
                Comment.destroy({ where: { id: id, userId: userId }, limit: 1 }).then(comment => {
                    if (comment === 0) {
                        return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                    }
                    res.status(200).json({ message: globalVariables.SUCCESS });
                });
            }
        });
    });
};