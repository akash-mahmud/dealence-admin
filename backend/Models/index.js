const Sequelize = require('sequelize');

// const sequelize = new Sequelize('sqlite::memory:', { logging: false });

const sequelize = new Sequelize(
  'postgres://postgres:1234@localhost:5432/delance',
  { logging: false }
);

const UserModel = require('./users.model');

const AccountModel = require('./acount.model');
const NotificationModel = require('./Notification.model');
const InvestmentModel = require('./Investment.model');
const IncrementModel = require('./Increment.model');
const TransactionModel = require('./Transaction.model');
const PayoutModel = require('./Payout.model');
const EarnedModel = require('./Earned.model');


const Earned = EarnedModel(sequelize, Sequelize);
const Investment = InvestmentModel(sequelize, Sequelize);
const Increment = IncrementModel(sequelize, Sequelize);
const Transaction = TransactionModel(sequelize, Sequelize);
const Payout = PayoutModel(sequelize, Sequelize);
const Notification = NotificationModel(sequelize, Sequelize);

const User = UserModel(sequelize, Sequelize);
const Account = AccountModel(sequelize, Sequelize);

Account.belongsTo(User);
User.hasOne(Account);

Notification.belongsTo(User);
User.hasOne(Notification);

Investment.belongsTo(User);
User.hasOne(Investment);

Earned.belongsTo(User);
User.hasMany(Earned);

Investment.hasMany(Increment);
Increment.belongsTo(Investment);

User.hasMany(Increment);
Increment.belongsTo(User);

Transaction.belongsTo(User);
User.hasMany(Transaction);

// An increment has many payouts (one per cycle)
// Payouts are associated with an user for easier
// retrieval
Payout.belongsTo(Increment);
Increment.hasMany(Payout);

Payout.belongsTo(User);
User.hasMany(Increment);

sequelize.sync().then(() => {
  console.log(`Database & tables created!`);
});
 
module.exports = {
  User,
  Transaction,
  Investment,
  Increment,
  Account,
  Payout,
  Notification,
  Earned,
};