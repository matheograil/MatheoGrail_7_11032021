// Modèle de la table des messages.
module.exports = (sequelize, type) => {
    return sequelize.define('messages', {
        id: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        message: type.STRING(3000),
        user: type.STRING(50),
        timestamp: type.STRING(20)
    });
};