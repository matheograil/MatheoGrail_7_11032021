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
const globalFunctions = require('../globalFunctions');


/*
 * Déclaration des règles pour vérifier les variables.
 */
function IdValidator(req) {
    const IdValidator = new Validator(req.params, {
        id: 'required|integer|maxLength:11'
    });
    return IdValidator;
}


/*
 * Les différentes fonctions de notre API.
 */
// Publication d'un message.
exports.newMessage = (req, res) => {
    const newMessageValidator = new Validator(req.body, {
        content: 'required|string|maxLength:3000'
    });
    globalFunctions.areVariablesValid(res, newMessageValidator).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        const { content, userId } = req.body;   /* Variable 'userId' déjà vérifiée par le Middleware auth.js */
        Message.findOne({ where: { userId: userId }, order: [[ 'id', 'DESC' ]] }).then((message) => {
            if (message !== null) {
                if (message.timestamp >= CURRENT_TIMESTAMP - 60) {       /* On autorise une publication par minute */
                    return res.status(400).json({ error: ERROR_WRONG_DATA });
                }
            }
            const newMessage = Message.build({
                content: content,
                userId: userId,
                timestamp: CURRENT_TIMESTAMP
            });
            newMessage.save()
                .then(() => res.status(200).json({ message: SUCCESS }))
                .catch(() => res.status(500).json({ error: ERROR_SERVER }));
        }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};

// Affichage des messages.
exports.getAllMessages = (req, res) => {
    Message.findAll({ order: [[ 'id', 'DESC' ]] }).then((messages) => {
        res.status(200).json(messages);
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};

// Affichage d'un message.
exports.getMessage = (req, res) => {
    globalFunctions.areVariablesValid(res, IdValidator(req)).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        Message.findOne({ where: { id: id } }).then((message) => {
            if (message === null) {
                return res.status(400).json({ error: ERROR_WRONG_DATA });
            }
            res.status(200).json(message);
        }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};

// Modification d'un message.
exports.editMessage = (req, res) => {
    const editMessageValidator = new Validator({ id: req.params.id, content: req.body.content }, {
        id: 'required|integer|maxLength:11',
        content: 'required|string|maxLength:3000'
    });
    globalFunctions.areVariablesValid(res, editMessageValidator).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        const { userId, content } = req.body;
        Message.update({ content: content, timestamp: CURRENT_TIMESTAMP }, { where: { id: id, userId: userId }, limit: 1 }).then((message) => {
            if (message === 0) {
                return res.status(400).json({ error: ERROR_WRONG_DATA });
            }
            res.status(200).json({ message: SUCCESS });
        }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};

// Suppression d'un message.
exports.delMessage = (req, res) => {
    globalFunctions.areVariablesValid(res, IdValidator(req)).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        const userId = req.body.userId;
        Message.destroy({ where: { id: id, userId: userId }, limit: 1 }).then((message) => {
            if (message === 0) {
                return res.status(400).json({ error: ERROR_WRONG_DATA });
            }
            Comment.destroy({ where: { linkedMessage: id, userId: userId } })
                .then(() => res.status(200).json({ message: SUCCESS }))
                .catch(() => res.status(500).json({ error: ERROR_SERVER }));
        }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};