// Importation des modèles.
const { User } = require('../sequelize');


/*
 * Importation des modules.
 */
const fs = require('fs');


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

// Permet supprimer une image.
async function deleteImage(filename) {
    return fs.unlink(`./public/images/${filename}`, err => {
        if (err) {
            return('Error');
        }
        return('Success');
    });
};


// Exportation des fonctions.
module.exports = {
    areVariablesValid,
    isAdmin,
    deleteImage
};