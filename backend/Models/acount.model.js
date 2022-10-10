module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define('account', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    balance: {
      type: Sequelize.REAL,
      defaultValue: 0.0,
      allowNull: false,
    },
    availableCredit: {
      type: Sequelize.REAL,
      defaultValue: 0.0,
      allowNull: false,
    },
  });
  return Account;
};
