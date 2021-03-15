const Sequelize = require('sequelize');
const UserModel = require('./models/user');

// Importation de la configuration.
require('dotenv').config();

// Connexion à la base de données.
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});

const User = UserModel(sequelize, Sequelize);

sequelize.sync({ force: true }).then(() => {
    console.log('Connexion à la base de données réussie.');
});

module.exports = {
    User
};