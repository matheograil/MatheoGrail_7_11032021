/*
 * Importation des modèles.
 */
const { User } = require('../sequelize');


/*
 * Importation des modules.
 */
const { Validator } = require('node-input-validator');
const jsonwebtoken = require('jsonwebtoken');


/*
 * Déclaration des erreurs.
 */
const ERROR_WRONG_DATA = 'Les données envoyées ne sont pas valides.';   /* Quand les données envoyées sont invalides */
const ERROR_SERVER = "Une erreur s'est produite.";                      /* Quand une erreur interne au serveur se produit */


/*
 * Middleware permettant de protéger certaines fonctions de l'API.
 * Par conséquent, on vérifie le jeton mais aussi l'existence de l'utilisateur. 
 * Car un compte peut avoir été supprimé alors que son jeton sera toujours valide.
 */
module.exports = (req, res, next) => {
    const AuthValidator = new Validator({ token: req.headers.authorization, userId: req.body.userId }, {
        token: 'required|string|maxLength:286',
        userId: 'required|integer|maxLength:11'
    });
    AuthValidator.check().then(matched => {
        if (!matched) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        const userId = req.body.userId;
        const token = req.headers.authorization;
        const decodedToken = jsonwebtoken.verify(token, process.env.JWT_TOKEN);
        if (userId !== decodedToken.userId) {                                   /* Vérification du jeton */
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
        User.findOne({ where: { id: decodedToken.userId } }).then((user) => {   /* Vérification de l'existence de l'utilisateur */
            if (user === null) {
                return res.status(400).json({ error: ERROR_WRONG_DATA });
            }
            next();
        }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};