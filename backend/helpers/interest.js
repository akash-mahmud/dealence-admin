const moment = require("moment");
const plans = require("../constants/plans");
const rates = require("../constants/rates");

/**
 * This function calculates the interest payout,
 * returning both the accrued amount and an array
 * of expired increments, whose date should be reset
 *  
 * @param Array<Increment> increments: list of increments to be evalued
 */
function calculateAccruedInterest(increments) {
    const today = new Date();
    const todayMoment = moment(today);

    let userAccruedInterest = 0.0;
    let expiredIncrements = [];

    for (let j = 0; j < increments.length; j++) {
        // Check if the increment expired. If so add the accrued interest
        const increment = increments[j];
        const monthsElapsed = todayMoment.diff(moment(increment.startDate), "months", true);

        if (increment.plan == plans.BIMONTHLY && monthsElapsed >= 2) {
          userAccruedInterest += payoutForIncrement(increment);
          expiredIncrements.push(increment);
        } else if (increment.plan == plans.SEMIANNUAL && monthsElapsed >= 6) {
          userAccruedInterest += payoutForIncrement(increment);
          expiredIncrements.push(increment);
        }
    }

    return {
        interest: userAccruedInterest,
        expiredIncrements: expiredIncrements
    }
}

function payoutForIncrement(increment) {
  if (increment.plan == plans.BIMONTHLY) {
    return increment.principal * rates.BIMONTHLY;
  }

  // If not bi-monthly an increment is semi-annual
  return increment.principal * rates.SEMIANNUAL;
}

function daysUntilNextPayout(increment) {
  let expirationDate = null;

  if (increment.plan == plans.BIMONTHLY) {
    expirationDate = moment(increment.startDate).add(2, "months").toDate();
  } else {
    expirationDate = moment(increment.startDate).add(6, "months").toDate();
  }

  return moment(expirationDate).diff(new Date(), "days");
}

function calculatePayoutsOverTime(increments) {
  var totalPayoutPerDay = 0;

  for (const increment of increments) {
    if (increment.plan == plans.BIMONTHLY) {
      totalPayoutPerDay += payoutForIncrement(increment) / 60.0;
    } else if (increment.plan == plans.SEMIANNUAL) {
      totalPayoutPerDay += payoutForIncrement(increment) / 180.0;
    }
  }

  return {
    day: totalPayoutPerDay.toFixed(2),
    week: (totalPayoutPerDay * 7).toFixed(2),
    month: (totalPayoutPerDay * 30).toFixed(2),
    year: (totalPayoutPerDay * 365).toFixed(2)
  }
}

exports.calculateAccruedInterest = calculateAccruedInterest;
exports.payoutForIncrement = payoutForIncrement;
exports.daysUntilNextPayout = daysUntilNextPayout;
exports.calculatePayoutsOverTime = calculatePayoutsOverTime;