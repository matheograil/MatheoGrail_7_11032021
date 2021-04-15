// Meilleur affichage des erreurs.
require('pretty-error').start();

// Utilisation du framework Express.
const express = require('express');
const app = express();

// Configuration du port utilisé par le serveur.
app.listen(3000,() => {
    console.log('Serveur opérationnel.')
});

// Cross Origin Resource Sharing.
// À SUPPRIMER DANS UN ENVIRONNEMENT DE PRODUCTION.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, authorization_token, user_id');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// Utilisation de 'helmet' pour contrer les attaques connues.
// À ACTIVER DANS UN ENVIRONNEMENT DE PRODUCTION.
//const helmet = require('helmet');
//app.use(helmet());

// Protection contre les attaques par force brute (1 requête/seconde).
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60
});
app.use(limiter);

// Importation de la configuration.
require('dotenv').config();

// Permet de manipuler les données reçues.
app.use(express.json());


/*
 * Les différentes routes de notre application.
 */
// Authentification.
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
// Messages.
const messagesRoutes = require('./routes/messages');
app.use('/api/messages', messagesRoutes);
// Commentaires.
const commentsRoutes = require('./routes/comments');
app.use('/api/comments', commentsRoutes);
// Comptes.
const accountsRoutes = require('./routes/accounts');
app.use('/api/accounts', accountsRoutes);


// Permet d'accéder aux images statiques.
const path = require('path');
app.use('/public/images', express.static(path.join(__dirname, './public/images')));

module.exports = app;