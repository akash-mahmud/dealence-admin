module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
    },
    zip: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    isContractSigned: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isDocumentUploaded: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    notificationsEnabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
    },
  });

  User.hasOne(User, { as: 'referrer', foreignKey: 'referrer_code' });

  return User;
};
