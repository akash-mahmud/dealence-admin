

/**
 * Increment object. Records amounts invested
 * by an user, the plan and the date
 */
module.exports = (sequelize, Sequelize) => {
  const Earned = sequelize.define('earned', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    plan: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    principal: {
      type: Sequelize.REAL,
      allowNull: false,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  return Earned;
};
