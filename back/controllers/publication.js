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
 * Déclaration des fonctions.
 */
// Permet de vérifier les identifiants envoyées.
async function isContentValid(req, res) {
    const ContentValidator = new Validator(req.body, {
        content: 'required|string|maxLength:3000'
    });
    return ContentValidator.check().then(matched => {
        if (!matched) {
            return false;
        }
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};

// Permet de savoir si l'utilisateur peut envoyer son contenu (protection anti-spam).
// async function canUserSent(res, email) {
    // return Message.findOne({ where: { email: email } }).then((content) => {
    //     if (content === null) {
     //        return true;
     //    }
     //    return user;
   //  }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
// };


/*
 * Les différentes fonctions de notre API.
 */
// Publication d'un message.
exports.message = (req, res) => {
    isContentValid(req, res).then(isContentValid => {
        if (isContentValid === false) {
            return res.status(400).json({ error: ERROR_WRONG_DATA });
        }
    }).catch(() => res.status(500).json({ error: ERROR_SERVER }));
};