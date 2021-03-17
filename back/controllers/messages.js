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
const ERROR_SERVER = "Une erreur s'est produite.";                      /* Quand une erreur interne au serveur se produit */
const SUCCESS = 'Succès.';                                              /* Quand tout se passe correctement */


/*
 * Déclaration des fonctions.
 */
// Permet de vérifier les variables envoyées.
async function isContentValid(req, res) {
    const ContentValidator = new Validator(req.body, {
        content: 'required|string|maxLength:3000'
    });
    return ContentValidator.check().then(matched => {
        if (!matched) {
            return false;
        }
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};

// Permet de savoir si l'utilisateur peut envoyer son message (protection anti-spam).
async function canUserSent(res, userId) {
    return Message.findOne({ where: { userId: userId }, order: [[ 'id', 'DESC' ]] }).then((content) => {
        if (content === null) {
            return true;
        }
        const currentTimestamp = Math.floor(Date.now()/1000);
        if (content.timestamp <= currentTimestamp - 60) {       /* On autorise une publication par minute */
            return true;
        }
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};


/*
 * Les différentes fonctions de notre API.
 */
// Publication d'un message.
exports.newMessage = (req, res) => {
    isContentValid(req, res).then(isContentValid => {
        if (isContentValid === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        const content = req.body.content;
        const userId = req.body.userId;     /* Variable déjà vérifiée par le Middleware auth.js */
        canUserSent(res, userId).then(canUserSent => {
            if (canUserSent !== true) {
                return res.status(400).json({ error: ERROR_WRONG_DATA });
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