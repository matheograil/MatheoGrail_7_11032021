// Utilisation du framework Express.
const express = require('express');
const app = express();

// Utilisation de 'helmet' pour contrer les attaques connues.
const helmet = require('helmet');
app.use(helmet());

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
const bodyParser = require('body-parser');
app.use(bodyParser.json());


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


module.exports = app;