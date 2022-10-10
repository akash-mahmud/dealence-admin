const plans = require("../constants/plans");

module.exports = (sequelize, Sequelize) => {
    const Investment = sequelize.define("investment", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        tacitRenewal: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        reinvestIncome: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    return Investment;
}