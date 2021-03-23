// Importation des modèles.
const { User, Message } = require('../sequelize');


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
        if (message === null) {
            return false;
        }
        return message;
    });
};


// Exportation des fonctions.
module.exports = {
    areVariablesValid,
    isAdmin,
    findOneMessage
};