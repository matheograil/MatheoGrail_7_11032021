// Importation des modèles.
const { Message, Comment } = require('../sequelize');


/*
 * Importation des modules.
 */
const { Validator } = require('node-input-validator');
const fs = require('fs');


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

// Permet supprimer une image.
async function deleteImage(filename) {
    fs.unlink(`./public/images/${filename}`, err => {
        if (err) {
            console.log(err);
        }
    });
};


/*
 * Les différentes fonctions de notre route.
 */
// Publication d'un message.
exports.newMessage = (req, res) => {
    const newMessageValidator = new Validator(req.body, {
        content: 'required|string|maxLength:3000'
    });
    globalFunctions.areVariablesValid(newMessageValidator).then(areVariablesValid => {
        let filename = null,
        imageUrl = null;
        if (!areVariablesValid) {
            if (req.file) {
                deleteImage(filename);
            }
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        } else if (req.file) {
            filename = req.file.filename;
            imageUrl = `${req.protocol}://${req.get('host')}/public/images/${filename}`;
        }
        const userId = req.headers.user_id,         /* Variable déjà vérifiée par le middleware 'auth.js' */
        content = req.body.content;
        Message.findOne({ where: { userId: userId }, order: [[ 'id', 'DESC' ]] }).then(message => {
            if (message && message.timestamp >= globalVariables.CURRENT_TIMESTAMP - 60) {          /* On autorise un message par minute */
                if (req.file) {
                    deleteImage(filename);
                }
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            const newMessage = Message.build({
                content: content,
                userId: userId,
                timestamp: globalVariables.CURRENT_TIMESTAMP,
                imageUrl: imageUrl
            });
            newMessage.save().then(() => res.status(200).json({ message: globalVariables.SUCCESS }));
        });
    });
};

// Affichage des messages.
exports.getAllMessages = (req, res) => {
    Message.findAll({ order: [[ 'id', 'DESC' ]] }).then(messages => {
        res.status(200).json(messages);
    });
};

// Affichage d'un message.
exports.getMessage = (req, res) => {
    globalFunctions.areVariablesValid(globalFunctions.idValidator(req)).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        globalFunctions.findOneMessage(id).then(message => {
            if (!message) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            res.status(200).json(message);
        });
    });
};

// Modification d'un message.
exports.editMessage = (req, res) => {
    globalFunctions.areVariablesValid(globalFunctions.idContentValidator(req)).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const userId = req.headers.user_id,         /* Variable déjà vérifiée par le middleware 'auth.js' */
        id = req.params.id,
        content = req.body.content;
        globalFunctions.findOneMessage(id).then(message => {
            if (!message) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            else if (req.file) {
                if (message.imageUrl) {
                    deleteImage(message.imageUrl.split('/public/images/')[1]);
                }
                const filename = req.file.filename,
                imageUrl = `${req.protocol}://${req.get('host')}/public/images/${filename}`;
                Message.update({ content: content, imageUrl: imageUrl }, { where: { id: id, userId: userId }, limit: 1 }).then((message) => {
                    if (!message) {
                        return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                    }
                    res.status(200).json({ message: globalVariables.SUCCESS });
                });
            } else {
                Message.update({ content: content }, { where: { id: id, userId: userId }, limit: 1 }).then(message => {
                    if (!message) {
                        return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                    }
                    res.status(200).json({ message: globalVariables.SUCCESS });
                });
            }
        })
    });
};

// Suppression d'un message.
exports.delMessage = (req, res) => {
    globalFunctions.areVariablesValid(globalFunctions.idValidator(req)).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const userId = req.headers.user_id,         /* Variable déjà vérifiée par le middleware 'auth.js' */
        id = req.params.id;
        globalFunctions.findOneMessage(id).then(message => {
            let filename = null;
            if (!message) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            } else if (message.imageUrl) {
                filename = message.imageUrl.split('/public/images/')[1];
            }
            globalFunctions.isAdmin(userId).then(isAdmin => {
                if (isAdmin) {
                    Message.destroy({ where: { id: id }, limit: 1 }).then(message => {
                        if (!message) {
                            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                        } else if (filename) {
                            deleteImage(filename);
                        }
                        Comment.destroy({ where: { linkedMessage: id } }).then(() => res.status(200).json({ message: globalVariables.SUCCESS }));
                    });
                } else {
                    Message.destroy({ where: { id: id, userId: userId }, limit: 1 }).then(message => {
                        if (!message) {
                            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                        } else if (filename) {
                            deleteImage(filename);
                        }
                        Comment.destroy({ where: { linkedMessage: id } }).then(() => res.status(200).json({ message: globalVariables.SUCCESS }));
                    });
                }
            });
        });
    });
};