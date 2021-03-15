/*
 * Importation des modèles.
 */
const { Message } = require('../sequelize');

/*
 * Importation des modules.
 */
const { Validator } = require('node-input-validator');

/*
 * Déclaration des erreurs.
 */
const ERROR_WRONG_DATA = 'Les données envoyées ne sont pas valides.';   /* Quand les données envoyées sont invalides */
const ERROR_SERVER = "Une erreur s'est produite.";                      /* Quand une erreur interne au serveur se produit */
const SUCCESS = 'Succès.';                                              /* Quand tout se passe correctement */

/*
 * Les différentes fonctions de notre API.
 */
// Publication d'un message.
exports.message = (req, res) => {
}