// Importation des modèles.
const { User } = require('../sequelize');


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

// Permet de renvoyer un utilisateur à partir de son 'id'.
function findOneUser(id) {
    return User.findOne({ where: { id: id } });
};


/*
 * Les différentes fonctions de notre route.
 */
// Récupération des détails d'un utilisateur.
exports.getDetails = (req, res) => {
    globalFunctions.areVariablesValid(globalFunctions.idValidator(req)).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        User.findOne({ where: { id: id }, attributes: ['firstName', 'lastName', 'description', 'isAdmin', 'isDisabled'] }).then(user => {
            if (!user) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            res.status(200).json(user);
        });
    });
};

// Modification des paramètres d'un utilisateur.
exports.editParameters = (req, res) => {
    const editParametersValidator = new Validator(req.body, {
        password: 'required|string|lengthBetween:10,100',
        newPassword: 'string|lengthBetween:10,100',
        description: 'required|string|maxLength:200'
    });
    globalFunctions.areVariablesValid(editParametersValidator).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const userId = req.headers.user_id,         /* Variable déjà vérifiée par le middleware 'auth.js' */
        password = req.body.password,
        description = req.body.description;
        findOneUser(userId).then(user => {
            if (!user) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            globalFunctions.arePasswordsValid(password, user.password).then(arePasswordsValid => {
                if (!arePasswordsValid) {
                    return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                } else if (!req.body.newPassword) {
                    User.update({ description: description }, { where: { id: userId }, limit: 1 }).then(user => {
                        if (!user) {
                            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                        }
                        res.status(200).json({ message: globalVariables.SUCCESS });
                    });
                }
                else if (req.body.newPassword) {
                    const newPassword = req.body.newPassword;
                    globalFunctions.passwordHash(newPassword).then(hash => {
                        User.update({ description: description, password: hash }, { where: { id: userId }, limit: 1 }).then(user => {
                            if (!user) {
                                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                            }
                            res.status(200).json({ message: globalVariables.SUCCESS });
                        });
                    });
                }
            });
        });
    });
};

// Désactivation du compte.
exports.deleteMyAccount = (req, res) => {
    const deleteMyAccountValidator = new Validator(req.body, {
        password: 'required|string|lengthBetween:10,100'
    });
    globalFunctions.areVariablesValid(deleteMyAccountValidator).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const userId = req.headers.user_id,         /* Variable déjà vérifiée par le middleware 'auth.js' */
        password = req.body.password;
        findOneUser(userId).then(user => {
            if (!user) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            globalFunctions.arePasswordsValid(password, user.password).then(arePasswordsValid => {
                if (!arePasswordsValid) {
                    return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                }
                User.update({ isDisabled: 1 }, { where: { id: userId }, limit: 1 }).then(user => {
                    if (!user) {
                        return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                    }
                    res.status(200).json({ message: globalVariables.SUCCESS });
                });
            });
        });
    });
};