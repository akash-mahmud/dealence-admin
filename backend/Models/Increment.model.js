const plans = require("../constants/plans");

/**
 * Increment object. Records amounts invested
 * by an user, the plan and the date
 */
module.exports = (sequelize, Sequelize) => {
    const Increment = sequelize.define("increment", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        plan: {
            type: Sequelize.ENUM(plans.BIMONTHLY, plans.SEMIANNUAL),
            allowNull: false
        },
        principal: {
            type: Sequelize.REAL,
            allowNull: false
        },
        startDate: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });

    return Increment;
}