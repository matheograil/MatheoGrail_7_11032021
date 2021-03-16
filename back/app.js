// Utilisation du framework Express.
const express = require('express');
const app = express();

// Protection contre les attaques par force brute (1 requête/seconde).
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60
});
app.use(limiter);

// Permet d'éviter les erreurs lors du développement.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

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

module.exports = app;