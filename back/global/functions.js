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
async function isAdmin(model, userId) {
    return model.findOne({ where: { id: userId } }).then((user) => {
        if (user.isAdmin === 1) {
            return true;
        }
    });
};


// Exportation des fonctions.
module.exports = {
    areVariablesValid,
    isAdmin
};