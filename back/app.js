// Framework Express.
const express = require('express');
const app = express();

// Protection contre les attaques par force brute.
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60
});
app.use(limiter);

// Cross Origin Resource Sharing.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Permet de manipuler les données reçues via POST.
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Les différentes routes.
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

module.exports = app;