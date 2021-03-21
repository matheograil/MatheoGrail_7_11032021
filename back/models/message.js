// Table 'messages'.
module.exports = (sequelize, type) => {
    return sequelize.define('messages', {
        id: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        content: type.STRING(3000),
        userId: type.INTEGER(11),
        timestamp: type.STRING(20)
    });
};