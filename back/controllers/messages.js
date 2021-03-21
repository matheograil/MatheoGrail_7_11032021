// Importation des modèles.
const { Message, Comment, User } = require('../sequelize');


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
 * Déclaration des règles pour vérifier les variables.
 */
function IdValidator(req) {
    const IdValidator = new Validator(req.params, {
        id: 'required|integer|maxLength:11'
    });
    return IdValidator;
};


/*
 * Les différentes fonctions de notre API.
 */
// Publication d'un message.
exports.newMessage = (req, res) => {
    const newMessageValidator = new Validator(req.body, {
        content: 'required|string|maxLength:3000'
    });
    globalFunctions.areVariablesValid(newMessageValidator).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const { content, userId } = req.body;   /* Variable 'userId' déjà vérifiée par le Middleware auth.js */
        Message.findOne({ where: { userId: userId }, order: [[ 'id', 'DESC' ]] }).then((message) => {
            if (message !== null && message.timestamp >= globalVariables.CURRENT_TIMESTAMP - 60) {      /* On autorise un message par minute */
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            const newMessage = Message.build({
                content: content,
                userId: userId,
                timestamp: globalVariables.CURRENT_TIMESTAMP
            });
            newMessage.save()
                .then(() => res.status(200).json({ message: globalVariables.SUCCESS }))
                .catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
        }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
};

// Affichage des messages.
exports.getAllMessages = (req, res) => {
    Message.findAll({ order: [[ 'id', 'DESC' ]] }).then((messages) => {
        res.status(200).json(messages);
    }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
};

// Affichage d'un message.
exports.getMessage = (req, res) => {
    globalFunctions.areVariablesValid(IdValidator(req)).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        Message.findOne({ where: { id: id } }).then((message) => {
            if (message === null) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            res.status(200).json(message);
        }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
};

// Modification d'un message.
exports.editMessage = (req, res) => {
    const editMessageValidator = new Validator({ id: req.params.id, content: req.body.content }, {
        id: 'required|integer|maxLength:11',
        content: 'required|string|maxLength:3000'
    });
    globalFunctions.areVariablesValid(editMessageValidator).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        const { userId, content } = req.body;
        Message.update({ content: content, timestamp: globalVariables.CURRENT_TIMESTAMP }, { where: { id: id, userId: userId }, limit: 1 }).then((message) => {
            if (message === 0) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            res.status(200).json({ message: SUCCESS });
        }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
};

// Suppression d'un message.
exports.delMessage = (req, res) => {
    globalFunctions.areVariablesValid(IdValidator(req)).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        const userId = req.body.userId;
        Message.destroy({ where: { id: id, userId: userId }, limit: 1 }).then((message) => {
            if (message === 0) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            Comment.destroy({ where: { linkedMessage: id, userId: userId } })
                .then(() => res.status(200).json({ message: globalVariables.SUCCESS }))
                .catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
        }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
};