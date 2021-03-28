// Importation des modèles.
const { User } = require('../sequelize');


/*
 * Importation des modules.
 */
const { Validator } = require('node-input-validator');
const jsonwebtoken = require('jsonwebtoken');


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

// Permet de savoir si une adresse électronique est dans la base de données.
function doesUserExist(email) {
    return User.findOne({ where: { email: email } });
};


/*
 * Les différentes fonctions de notre route.
 */
// Inscription.
exports.register = (req, res) => {
    const registerValidator = new Validator(req.body, {
        firstName: 'required|string|maxLength:50',
        lastName: 'required|string|maxLength:50',
        email: 'required|email|maxLength:50',
        password: 'required|string|lengthBetween:10,100'
    });
    globalFunctions.areVariablesValid(registerValidator).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const { email, password, firstName, lastName } = req.body;
        doesUserExist(email).then(doesUserExist => {
            if (doesUserExist) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            globalFunctions.passwordHash(password).then(hash => {
                const newUser = User.build({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hash
                });
                newUser.save().then(() => res.status(200).json({ message: globalVariables.SUCCESS }));
            });
        });
    });
};

// Connexion.
exports.login = (req, res) => {
    const loginValidator = new Validator(req.body, {
        email: 'required|email|maxLength:50',
        password: 'required|string|lengthBetween:10,100'
    });
    globalFunctions.areVariablesValid(loginValidator).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const { email, password } = req.body;
        doesUserExist(email).then(doesUserExist => {
            if (!doesUserExist || doesUserExist.isDisabled) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            globalFunctions.arePasswordsValid(password, doesUserExist.password).then(arePasswordsValid => {
                if (!arePasswordsValid) {
                    return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                }
                res.status(200).json({
                    userId : doesUserExist.id,
                    token: jsonwebtoken.sign(
                        { userId: doesUserExist.id },
                        process.env.JWT_TOKEN,
                        { expiresIn: '12h' }
                    )
                });
            });
        });
    });
};