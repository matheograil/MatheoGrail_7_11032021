/*
 * Importation des modèles.
 */
const { Message } = require('../sequelize');


/*
 * Importation des modules.
 */
const { Validator } = require('node-input-validator');


/*
 * Déclaration des erreurs.
 */
const ERROR_WRONG_DATA = 'Les données envoyées ne sont pas valides.';   /* Quand les données envoyées sont invalides */
const ERROR_SERVER = 'Une erreur est survenue.';                        /* Quand une erreur interne au serveur se produit */
const SUCCESS = 'Opération achevée avec succès.';                       /* Quand tout se passe correctement */


/*
 * Déclaration des fonctions.
 */
// Importation des functions globales.
const globalFunctions = require('../globalFunctions');


/*
 * Déclaration des règles pour vérifier les variables.
 */
function MessageContentValidator(req) {
    const MessageContentValidator = new Validator(req.body, {
        content: 'required|string|maxLength:3000'
    });
    return MessageContentValidator;
}

function MessageIdValidator(req) {
    const MessageIdValidator = new Validator(req.params, {
        id: 'required|integer|maxLength:11'
    });
    return MessageIdValidator;
}


/*
 * Les différentes fonctions de notre API.
 */
// Publication d'un message.
exports.newMessage = (req, res) => {
    globalFunctions.areVariablesValid(res, MessageContentValidator(req)).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        const { content, userId } = req.body;   /* Variable 'userId' déjà vérifiée par le Middleware auth.js */
        Message.findOne({ where: { userId: userId }, order: [[ 'id', 'DESC' ]] }).then((message) => {
            if (message !== null) {
                const currentTimestamp = Math.floor(Date.now()/1000);
                if (message.timestamp >= currentTimestamp - 60) {       /* On autorise une publication par minute */
                    return res.status(400).json({ error: ERROR_WRONG_DATA });
                }
            }
            const newMessage = Message.build({
                content: content,
                userId: userId,
                timestamp: Math.floor(Date.now()/1000)
            });
            newMessage.save().then(() => {
                res.status(200).json({ message: SUCCESS });
            }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
        }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};

// Affichage des messages.
exports.getAllMessages = (req, res) => {
    Message.findAll({ order: [[ 'id', 'DESC' ]] }).then((messages) => {
        res.status(200).json(messages);
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};

// Suppression d'un message.
exports.delMessage = (req, res) => {
    globalFunctions.areVariablesValid(res, MessageIdValidator(req)).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        const userId = req.body.userId;
        Message.destroy({ where: { id: id, userId: userId } }).then((message) => {
            if (message === 0) {
                return res.status(400).json({ error: ERROR_WRONG_DATA });
            }
            res.status(200).json({ message: SUCCESS });
        }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};