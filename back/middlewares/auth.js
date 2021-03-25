// Importation des modèles.
const { User } = require('../sequelize');


/*
 * Importation des modules.
 */
const { Validator } = require('node-input-validator');
const jsonwebtoken = require('jsonwebtoken');


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
 * Middleware permettant de protéger certaines fonctions de l'API.
 * Par conséquent, on vérifie le jeton mais aussi l'existence de l'utilisateur. 
 * Car un compte peut avoir été supprimé alors que son jeton sera toujours valide.
 */
module.exports = (req, res, next) => {
    const AuthValidator = new Validator({ authorizationToken: req.headers.authorization_token, userId: req.headers.user_id }, {
        authorizationToken: 'required|string|maxLength:286',
        userId: 'required|integer|maxLength:11'
    });
    globalFunctions.areVariablesValid(AuthValidator).then(areVariablesValid => {
        if (!areVariablesValid) {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
        const userId = req.headers.user_id,
        authorizationToken = req.headers.authorization_token;
        try {
            const decodedToken = jsonwebtoken.verify(authorizationToken, process.env.JWT_TOKEN);
            if (userId != decodedToken.userId) {            /* Vérification du jeton */
                return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
            }
            User.findOne({ where: { id: decodedToken.userId } }).then(user => {           /* Vérification de l'existence de l'utilisateur */
                if (!user || user.isDisabled) {
                    return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
                }
                next();
            });
        } catch {
            return res.status(400).json({ error: globalVariables.ERROR_WRONG_DATA });
        }
    });
};