/**
 * Payout object. Represents an amount paid
 * out as a result of an increment expiring
 */
module.exports = (sequelize, Sequelize) => {
    const Payout = sequelize.define("payout", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        amount: {
            type: Sequelize.REAL,
            allowNull: false
        }
    });

    return Payout;
}