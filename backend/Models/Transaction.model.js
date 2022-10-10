const transactionsType = require("../constants/transactionsType");

module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        type: {
            type: Sequelize.ENUM(transactionsType.DEPOSIT, transactionsType.WITHDRAWAL),
            allowNull: false
        },
        amount: {
            type: Sequelize.REAL,
            allowNull: false
        }
    });

    return Transaction;
}