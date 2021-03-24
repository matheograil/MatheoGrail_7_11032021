// Importation des modèles.
const { User, Message } = require('../sequelize');


/*
 * Importation des modules.
 */
const { Validator } = require('node-input-validator');


/*
 * Déclaration des fonctions globales.
 */
// Permet de vérifier des variables à partir de règles.
async function areVariablesValid(rules) {
    return rules.check().then(matched => {
        if (!matched) {
            return false;
        }
    });
};

// Permet de savoir si un utilisateur est administrateur.
async function isAdmin(userId) {
    return User.findOne({ where: { id: userId } }).then((user) => {
        if (user.isAdmin === 1) {
            return true;
        }
    });
};

// Permet de renvoyer un message à partir de son 'id'.
async function findOneMessage(id) {
    return Message.findOne({ where: { id: id } }).then((message) => {
        return message;
    });
};

// Permet de vérifier les variables des routes 'get' et 'delete'.
function idValidator(req) {
    const idValidator = new Validator(req.params, {
        id: 'required|integer|maxLength:11'
    });
    return idValidator;
};

// Permet de vérifier les variables des routes 'put'.
function idContentValidator(req) {
    const idContentValidator = new Validator({ id: req.params.id, content: req.body.content }, {
        id: 'required|integer|maxLength:11',
        content: 'required|string|maxLength:3000'
    });
    return idContentValidator;
};


// Exportation des fonctions.
module.exports = {
    areVariablesValid,
    isAdmin,
    findOneMessage,
    idValidator,
    idContentValidator
};