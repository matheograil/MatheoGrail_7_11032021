/*
 * Importation des modèles.
 */
const { User } = require('../sequelize');


/*
 * Importation des modules.
 */
const bcrypt = require('bcrypt');
const { Validator } = require('node-input-validator');
const jsonwebtoken = require('jsonwebtoken');


/*
 * Déclaration des erreurs.
 */
const ERROR_WRONG_DATA = 'Les données envoyées ne sont pas valides.';   /* Quand les données envoyées sont invalides */
const ERROR_SERVER = "Une erreur s'est produite.";                      /* Quand une erreur interne au serveur se produit */
const SUCCESS = 'Succès.';                                              /* Quand tout se passe correctement */


/*
 * Déclaration des fonctions.
 */
// Permet de vérifier les identifiants envoyées.
async function areCredentialsValid(req, res) {
    const UserValidator = new Validator(req.body, {
        email: 'required|email|maxLength:50',
        password: 'required|string|lengthBetween:10,100'
    });
    return UserValidator.check().then(matched => {
        if (!matched) {
            return false;
        }
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};

// Permet de savoir si une adresse électronique est dans la base de données.
async function doesUserExist(res, email) {
    return User.findOne({ where: { email: email } }).then((user) => {
        if (user === null) {
            return false;
        }
        return user;   /* Permet de vérifier la correspondance du mot de passe, mais aussi pour démarrer la session */
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};


/*
 * Les différentes fonctions de notre API.
 */
// Inscription.
exports.register = (req, res) => {
    areCredentialsValid(req, res).then(areCredentialsValid => {
        if (areCredentialsValid === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        const { email, password } = req.body;
        doesUserExist(res, email).then(doesUserExist => {
            if (doesUserExist !== false) {
                return res.status(400).json({ error: ERROR_WRONG_DATA });
            }
            bcrypt.hash(password, 10).then(hash => {
                const newUser = User.build({
                    email: email,
                    password: hash
                });
                newUser.save()
                    .then(() => res.status(200).json({ message: SUCCESS }))
                    .catch(() => res.status(500).json({ error: ERROR_SERVER }));
            }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
        }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};

// Connexion.
exports.login = (req, res) => {
    areCredentialsValid(req, res).then(areCredentialsValid => {
        if (areCredentialsValid === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        const { email, password } = req.body;
        doesUserExist(res, email).then(doesUserExist => {
            if (doesUserExist === false) {
                return res.status(400).json({ error: ERROR_WRONG_DATA });
            }
            bcrypt.compare(password, doesUserExist.password).then(valid => {
                if (!valid) {
                    return res.status(400).json({ error: ERROR_WRONG_DATA });
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
            }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
        }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};