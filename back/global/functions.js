// Importation des modèles.
const { User, Message } = require('../sequelize');


/*
 * Importation des modules.
 */
const bcrypt = require('bcrypt');
const { Validator } = require('node-input-validator');


/*
 * Déclaration des fonctions globales.
 */
// Permet de vérifier des variables à partir de règles.
function areVariablesValid(rules) {
    return rules.check();
};

// Permet de comparer deux mots de passe.
function arePasswordsValid(firstPassword, lastPassword) {
    return bcrypt.compare(firstPassword, lastPassword);
};

// Permet de savoir si un utilisateur est administrateur.
function isAdmin(userId) {
    return User.findOne({ where: { id: userId } }).then(user => {
        if (user.isAdmin === 1) {
            return true;
        }
    });
};

// Permet de hacher un mot de passe.
function passwordHash(password) {
    return bcrypt.hash(password, 10);
};

// Permet de renvoyer un message à partir de son 'id'.
function findOneMessage(id) {
    return Message.findOne({ where: { id: id } });
};

// Permet de vérifier les variables des routes 'get' et 'delete'.
function idValidator(req) {
    return new Validator(req.params, {
        id: 'required|integer|maxLength:11'
    });
};

// Permet de vérifier les variables des routes 'put'.
function idContentValidator(req) {
    return new Validator({ id: req.params.id, content: req.body.content }, {
        id: 'required|integer|maxLength:11',
        content: 'required|string|maxLength:3000'
    });
};


// Exportation des fonctions.
module.exports = {
    areVariablesValid,
    arePasswordsValid,
    isAdmin,
    passwordHash,
    findOneMessage,
    idValidator,
    idContentValidator
};