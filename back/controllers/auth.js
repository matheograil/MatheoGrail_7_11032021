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
async function checkCredentials(req, res) {
    const UserValidator = new Validator(req.body, {
        email: 'required|email|maxLength:50',
        password: 'required|string|lengthBetween:10,100'
    });
    UserValidator.check().then(matched => {
        if (!matched) {
            return false;
        }
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
}


/*
 * Les différentes fonctions de notre API.
 */
// Connexion.
exports.register = (req, res) => {
    checkCredentials(req, res).then((result) => {
        if (result === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA_INPUT });
        }
        const { email, password } = req.body;
        User.findOne({ where: { email: email } }).then((user) => {
            if (user !== null) {
                return res.status(400).json({ error: ERROR_WRONG_DATA_INPUT });
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

// Inscription.
exports.login = (req, res) => {
    checkCredentials(req, res).then(() => {
        const { email, password } = req.body;
        User.findOne({ where: { email: email } }).then((user) => {
            if (user === null) {
                return res.status(400).json({ error: ERROR_WRONG_DATA_INPUT });
            }
            bcrypt.compare(password, user.password).then(valid => {
                if (!valid) {
                    return res.status(400).json({ error: ERROR_WRONG_DATA_INPUT });
                }
                res.status(200).json({
                    userId: user.id,
                    token: jsonwebtoken.sign(
                        { userId: user.id },
                        process.env.JWT_TOKEN,
                        { expiresIn: '12h' }
                    )
                });
            }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
        }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};