// Importation des modèles.
const { User } = require('../sequelize');


/*
 * Importation des modules.
 */
const bcrypt = require('bcrypt');
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
async function doesUserExist(email) {
    return User.findOne({ where: { email: email } }).then((user) => {
        if (user === null) {
            return false;
        }
        return user;   /* Permet de vérifier la correspondance du mot de passe, mais aussi pour démarrer la session */
    });
};


/*
 * Les différentes fonctions de notre API.
 */
// Inscription.
exports.register = (req, res) => {
    const RegisterValidator = new Validator(req.body, {
        firstName: 'required|string|maxLength:50',
        lastName: 'required|string|maxLength:50',
        email: 'required|email|maxLength:50',
        password: 'required|string|lengthBetween:10,100'
    });
    globalFunctions.areVariablesValid(RegisterValidator).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const { email, password, firstName, lastName } = req.body;
        doesUserExist(email).then(doesUserExist => {
            if (doesUserExist !== false) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            bcrypt.hash(password, 10).then(hash => {
                const newUser = User.build({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hash
                });
                newUser.save()
                    .then(() => res.status(200).json({ message: globalVariables.SUCCESS }))
                    .catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
            }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
        }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
};

// Connexion.
exports.login = (req, res) => {
    const LoginValidator = new Validator(req.body, {
        email: 'required|email|maxLength:50',
        password: 'required|string|lengthBetween:10,100'
    });
    globalFunctions.areVariablesValid(LoginValidator).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const { email, password } = req.body;
        doesUserExist(email).then(doesUserExist => {
            if (doesUserExist === false) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            bcrypt.compare(password, doesUserExist.password).then(valid => {
                if (!valid) {
                    return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                }
                res.status(200).json({
                    userId : doesUserExist.id,
                    token: jsonwebtoken.sign(
                        {
                            userId: doesUserExist.id
                        },
                        process.env.JWT_TOKEN,
                        {
                            expiresIn: '12h'
                        }
                    )
                });
            }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
        }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: globalVariables.ERROR_SERVER }));
};