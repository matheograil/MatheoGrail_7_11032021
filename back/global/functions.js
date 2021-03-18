/*
 * Déclaration des fonctions globales.
 */
// Permet de vérifier des variables à partir de règles.
async function areVariablesValid(res, rules) {
    return rules.check().then(matched => {
        if (!matched) {
            return false;
        }
    });
};
module.exports.areVariablesValid = areVariablesValid;