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

// Importation de la configuration.
require('dotenv').config();

// Connexion à la base de données.
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});
try {
    sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
} catch {
    console.error('Connexion à la base de données échouée.');
}

module.exports = app;