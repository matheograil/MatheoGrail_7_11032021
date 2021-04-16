// Connexion à la base de données.
const Sequelize = require('sequelize');
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


/*
 * Les différents modèles.
 */
// Table 'users'.
const UserModel = require('./models/user');
const User = UserModel(sequelize, Sequelize);
// Table 'messages'.
const MessageModel = require('./models/message');
const Message = MessageModel(sequelize, Sequelize);
// Table 'comments'.
const CommentModel = require('./models/comment');
const Comment = CommentModel(sequelize, Sequelize);


// Synchronisation de la base de données avec les modèles.
sequelize.sync({ force: true }).then(() => {
    console.log('Connexion à la base de données réussie.');
}).catch(() => {
    console.log('Connexion à la base de données échouée.');
});

// Exportation des modèles.
module.exports = {
    User,
    Message,
    Comment
};