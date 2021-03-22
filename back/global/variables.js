/*
 * Déclaration des variables globales.
 */
// Message affiché quand les données envoyées sont invalides.
const ERROR_WRONG_DATA = 'Les données envoyées ne sont pas valides.';
// Message affiché quand tout se passe correctement.
const SUCCESS = 'Opération achevée avec succès.';
// Timestamp actuel.
const CURRENT_TIMESTAMP = Math.floor(Date.now()/1000);


// Exportation des variables.
module.exports = {
    ERROR_WRONG_DATA,
    SUCCESS,
    CURRENT_TIMESTAMP
};