// Importation des modèles.
const { User } = require('../sequelize');


/*
 * Importation des modules.
 */
const { Validator } = require('node-input-validator');


/*
 * Déclaration des constantes.
 */
// Importation des variables globales.
const globalVariables = require('../global/variables');


/*
 * Déclaration des fonctions.
 */
// Importation des functions globales.
const globalFunctions = require('../global/functions');


/*
 * Les différentes fonctions de notre route.
 */
// Récupération des détails d'un utilisateur.
exports.getDetails = (req, res) => {
    globalFunctions.areVariablesValid(globalFunctions.idValidator(req)).then(areVariablesValid => {
        if (areVariablesValid === false) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const id = req.params.id;
        User.findOne({ where: { id: id }, attributes: ['firstName', 'lastName', 'description', 'isAdmin'] }).then(user => {
            if (user === null) {
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            res.status(200).json(user);
        });
    });
};