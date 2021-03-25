// Table 'users'.
module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: type.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        firstName: type.STRING(50),
        lastName: type.STRING(50),
        description: type.STRING(200),
        email: type.STRING(50),
        password: type.STRING(120),
        isAdmin: type.INTEGER(1),
        isDisabled: type.INTEGER(1)
    });
};