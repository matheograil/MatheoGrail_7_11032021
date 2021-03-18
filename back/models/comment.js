// Modèle de la table des commentaires.
module.exports = (sequelize, type) => {
    return sequelize.define('comments', {
        id: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        linkedMessage: type.INTEGER(11),
        content: type.STRING(3000),
        userId: type.INTEGER(11),
        timestamp: type.STRING(20)
    });
};