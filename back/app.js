// Framework Express.
const express = require('express');
const app = express();

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
const registerRoutes = require('./routes/auth');
app.use('/api/auth', registerRoutes);

module.exports = app;