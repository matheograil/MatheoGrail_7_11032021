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


/*
 * Les différentes fonctions de notre route.
 */
// Récupération des détails d'un utilisateur.
exports.getDetails = (req, res) => {
    globalFunctions.areVariablesValid(globalFunctions.idValidator(req)).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        User.findOne({ where: { id: id }, attributes: ['firstName', 'lastName', 'description', 'isAdmin'] }).then(user => {
            if (user === null) {
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
        description: 'string|maxLength:200'
    });
    globalFunctions.areVariablesValid(editParametersValidator).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const userId = req.headers.user_id,         /* Variable déjà vérifiée par le middleware 'auth.js' */
        password = req.body.password;
        User.findOne({ where: { id: userId } }).then(user => {
            if (user === null) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            globalFunctions.arePasswordsValid(password, user.password).then(arePasswordsValid => {
                if (arePasswordsValid === false) {
                    return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                }


                User.update({ description: description }, { where: { userId: userId }, limit: 1 }).then(user => {
                    if (user === 0) {
                        return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                    }
                    res.status(200).json({ message: globalVariables.SUCCESS });
                });

            });
        });
    });
};