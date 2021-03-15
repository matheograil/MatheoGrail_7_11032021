const { User } = require('../sequelize');

// Modules nécessaires.
const bcrypt = require('bcrypt');
const { Validator } = require('node-input-validator');
const jsonwebtoken = require('jsonwebtoken');

// GET : api/auth/signup.
exports.register = (req, res) => {
    const UserValidator = new Validator(req.body, {
        email: 'required|email|maxLength:50',
        password: 'required|string|lengthBetween:10,100'
    });
    // Vérification des données reçues.
    UserValidator.check().then(matched => {
        if (!matched) {
            return res.status(400).json({ error: 'Les identifiants sont incorrects.' });
        }
        // Définition des variables.
        const { email, password } = req.body;
        // L'utilisateur existe-t-il ?
        User.findOne({ where: { email: email } }).then((user) => {
            if (user !== null) {
                return res.status(400).json({ error: 'Les identifiants sont incorrects.' });
            }
            // Chiffrement du mot de passe.
            bcrypt.hash(password, 10).then(hash => {
                const newUser = User.build({
                    email: email,
                    password: hash
                });
                // Enregistrement dans la base de données.
                newUser.save()
                    .then(() => res.status(200).json({ message: "L'utilisateur a été enregistré." }))
                    .catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
            }).catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
        }).catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
    }).catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
};

// POST : api/auth/login.
exports.login = (req, res) => {
    const UserValidator = new Validator(req.body, {
        email: 'required|email|maxLength:50',
        password: 'required|string|lengthBetween:10,100'
    });
    // Vérification des données reçues.
    UserValidator.check().then(matched => {
        if (!matched) {
            return res.status(400).json({ error: 'Les identifiants sont incorrects.' });
        }
        // Définition des variables.
        const { email, password } = req.body;
        // L'utilisateur existe-t-il ?
        User.findOne({ where: { email: email } }).then((user) => {
            if (user === null) {
                return res.status(400).json({ error: 'Les identifiants sont incorrects.' });
            }
            // Le mot de passe correspond-t-il ?
            bcrypt.compare(password, user.password).then(valid => {
                if (!valid) {
                    return res.status(400).json({ error: 'Les identifiants sont incorrects.' });
                }
                // Enregistrement du jeton d'accès.
                res.status(200).json({
                    userId: user.id,
                    token: jsonwebtoken.sign(
                        { userId: user.id },
                        process.env.JWT_TOKEN,
                        { expiresIn: '12h' }
                    )
                });
            }).catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
        }).catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
    }).catch(() => res.status(500).json({ error: "Une erreur s'est produite." }));
};