/**
 * Payout object. Represents an amount paid
 * out as a result of an increment expiring
 */
module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define('notification', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    message: {
      type: Sequelize.STRING,
    },

  });

  return Notification;
};
