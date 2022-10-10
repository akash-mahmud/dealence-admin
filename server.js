// const express = require('express');
import express from 'express'
const moment = require('moment');
const {
  Transaction,
  Investment,
  Increment,
  Earned,
  Payout,
} = require('./backend/Models');
const jwt = require('jsonwebtoken')
const transactionsType = require('./backend/constants/transactionsType');
const plans = require('./backend/constants/plans');
const cors = require('cors');
const Joi = require('joi');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { User, Account } = require('./backend/Models');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const myPlaintextPassword = '@#1Matteo254';

// bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
//  console.log(hash);
// });
// $2b$10$KsURlwzDp/QfOhalteJcUe64TRFbGQAci4EzdLO.9MIDBSrp/kB2m
const Mailer = require('./backend/utils/mailer');
dotenv.config();

// const { User, Account, Increment, Payout, Investment } = require('./models');

const path = require('path');

const app = express();
app.use(morgan('dev'));
const schema = Joi.object().keys({
  plan: Joi.string().valid(plans.BIMONTHLY, plans.SEMIANNUAL).required(),
  amount: Joi.number().required(),
  startDate: Joi.any(),
  reinvestIncome: Joi.boolean(),
});

// Allow larger JSON bodies to handle document verification,
// where documents are sent in base64 format
app.use(bodyParser.urlencoded({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const admin = {
  email: process.env.ADMIN_EMAIL,
  password: '$2b$10$KsURlwzDp/QfOhalteJcUe64TRFbGQAci4EzdLO.9MIDBSrp/kB2m',
};



const verify = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(
      token,
      '$%myadmi@#kjnvxjkfrkeurfdgbfuhsdbfuhbg764526@!~@@#$%&*^^&*(fdsefcD$#W!@13%$d$#55dfvh@3',
      (err, user) => {
        if (err) {
          return res.status(403).send('Token is not valid');
        } else {
          req.user = user;
          next();
        }
      }
    );
  } else {
    return res.status(404).send('You are not authenticated');
  }
};

app.get('/ea/users',verify, async (req, res) => {
  const users = await User.findAll({
    where: { isActive: false, isDocumentUploaded: true },
  });
  res.send(users);
});
app.post('/ea/users/search', verify, async (req, res) => {
  const user = await User.findAll({
    where: { email: req.body.searchEmail },
  });
  res.send(user);
});

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, users, totalPages, currentPage };
};

app.get('/ea/users/verified',verify, async (req, res) => {
  // const users = await User.findAll({
  //   where: { isActive: true, isDocumentUploaded: true },
  // });
  // res.send(users);
const  condition =  { isActive: true, isDocumentUploaded: true} 
  const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

      const users = await User.findAndCountAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });
    
       const response = getPagingData(users, page, limit);
    res.send(response);

});

app.get('/ea/users/verified/:id',verify, async (req, res) => {
  const user = await User.findAll({
    where: { id: req.params.id },
  });
  res.send(user);
});

app.post('/ea/user/transaction/add/:id', verify, async (req, res) => {
  // const user = await User.findAll({
  //   where: { id: req.params.id },
  // });
  const { startDate, amount } = req.body;

  console.log(parseFloat(amount));
  console.log(new Date(startDate));

        await Transaction.create({
          userId: req.params.id,
          date: new Date(startDate),
          type: transactionsType.DEPOSIT,
          amount: amount,
        });

        await Account.increment('balance', {
          by: parseFloat(amount),
          where: { userId: req.params.id },
        });
 return res.send('success');
});



app.post('/ea/user/update/details/:id',verify, async (req, res) => {
  const user = await User.findAll({
    where: { id: req.params.id },
  });
  const {
    first_name,
    last_name,
    email,
    phone_number,
    address,
    city,
    state,
    zip,
    country,
  } = req.body;

  console.log(req.body);
 if (user) {
   await User.update(
     {
       first_name: first_name,
       last_name: last_name,
       email: email,
       phone_number: phone_number,
       address: address,
       state: state,
       city: city,
       zip: zip,
       country: country,
     },
     { where: { id: req.params.id } }
   );

return res.send('success')



 
 }


  // return res.send('success');
});

app.get('/ea/user/investment/list/:id',verify, async (req, res) => {
  const user = await User.findAll({
    where: { id: req.params.id },
  });



  var investment = await Investment.findOne({
    where: { userId: req.params.id },
  });

  const increments = await Increment.findAll({
    order: [['createdAt', 'ASC']],
    where: { userId: req.params.id },
  });

  if (increments.length > 0) {
    const principal = increments
      .reduce((prev, curr) => prev + curr.principal, 0.0)
      .toFixed(2);

   return res.status(202).send({
      createdAt: investment.createdAt,
      id: investment.id,
      reinvestIncome: investment.reinvestIncome,
      tacitRenewal: investment.tacitRenewal,
      updatedAt: investment.updatedAt,
      userId: investment.userId,
      principal: principal,
      plan: increments[0].plan,
    });
  } else {
  return  res.status(202).send('');
  }
  // return res.send('success');
});

// /ea/user/transaction/add/${id}

app.post('/ea/users',verify, async (req, res) => {
  const user = await User.findOne({ where: { id: req.body.id } });

  console.log(user.dataValues.isDocumentUploaded);
  if (!user) {
    res.send('User does not exists');
  }
  if (user.dataValues.isDocumentUploaded === false) {
    res.status(403).send('User does not exists');
  }

  if (user) {
    await User.update(
      {
        isActive: true,
      },
      { where: { id: req.body.id } }
    );

    const mailer = new Mailer();
    let documentApprove = await mailer.getUpAprooveInfoMail(user);
    try {
      await mailer.sendMailSync(documentApprove);

      console.log('Document verification email sent');
      res.send({ message: 'User updated successfully' });
    } catch (error) {
      const errorString = `Error sending email: ${error}`;

      console.log(errorString);
      res.send({ message: errorString });
    }
  }
});

app.get('/ea/user/account/:id', verify, async (req, res) => {

  var account = await Account.findOne({
    where: {
      userId: req.params.id,
    },
  });
  const payouts = await Payout.findAll({
    where: { userId: req.params.id },
  });
  const interestEarned = payouts
    .reduce((prev, curr) => prev + curr.amount, 0.0)
    .toFixed(2);



  res.send({
    balance: account.balance,
    credit: account.availableCredit,
    interestEarned: interestEarned,
  
  });
});


// /ea/user/plan/create/${id}
app.post('/ea/user/plan/create/:id',verify, async (req, res) => {

  let { startDate, amount  } = req.body;
amount = parseInt(amount)
    var account = await Account.findOne({
      where: {
        userId: req.params.id,
      },
    });

    var investments = await Investment.findAll({
      where: { userId: req.params.id },
    });

    if (investments.length > 0) {
      res.send('Investment already present. Please update instead');
    } else {
      const validBody = schema.validate(req.body);

      if (validBody.error == null) {
        if (req.body.amount <= account.balance) {
          // Create investment object
          const initialInvestment = await Investment.create({
            userId: req.params.id,
            reinvestIncome: req.body.reinvestIncome,
            createdAt: new Date(startDate),
            updatedAt: new Date(startDate),
          });
          await Earned.create({
            plan: req.body.plan,
            principal: parseFloat(req.body.amount),
            startDate: new Date(startDate),
            userId: req.params.id,
            investmentId: initialInvestment.id,
            createdAt: new Date(startDate),
            updatedAt: new Date(startDate),
          });
          // Create initial increment
          await Increment.create({
            plan: req.body.plan,
            principal: parseFloat(req.body.amount),
            startDate: new Date(startDate),
              createdAt: new Date(startDate),
            updatedAt: new Date(startDate),
            userId: req.params.id,
            investmentId: initialInvestment.id,
          });

          // Remove amount from the user's balance
          await Account.decrement('balance', {
            by: req.body.amount,
            where: { userId: req.params.id },
          });

          res.send('success');
        } else {
          res.send('Not enough balance');
        }
      } else {
        console.log(validBody.error);
        res.send('Bad request');
      }
    }

});


app.post('/ea/user/data/withdraw/payOut/:id', verify, async (req, res) => {
  let { startDate, amount } = req.body;
  amount = parseInt(amount);

  var account = await Account.findOne({
    where: {
      userId: req.params.id,
    },
  });
  if (amount <= account.availableCredit) {
    await Transaction.create({
      userId: req.params.id,
      date: new Date(startDate),
      createdAt: new Date(startDate),
      updatedAt: new Date(startDate),
      type: transactionsType.WITHDRAWAL,
      amount: amount,
      iban: 'Added by admin',
    });

    await Account.decrement('availableCredit', {
      by: amount,
      where: { userId: req.params.id },
    });





    return res.status(201).send('success');
  } else {
    res.send('Not enough balance');
  }
});

app.post('/ea/user/data/withdraw/balance/:id', verify, async (req, res) => {
  let {  amount } = req.body;
  amount = parseInt(amount);

  var account = await Account.findOne({
    where: {
      userId: req.params.id,
    },
  });
  if (amount <= account.balance) {
 

    await Account.decrement('balance', {
      by: amount,
      where: { userId: req.params.id },
    });

    return res.status(201).send('success');
  } else {
    res.send('Not enough balance');
  }
});

app.post('/ea/user/data/decrease/balance/data/:id', verify, async (req, res) => {
  let { amount } = req.body;
  amount = parseInt(amount);

  var account = await Account.findOne({
    where: {
      userId: req.params.id,
    },
  });
  if (amount <= account.balance) {
    await Account.decrement('balance', {
      by: amount,
      where: { userId: req.params.id },
    });

    return res.status(201).send('success');
  } else {
    res.send('Your entered amount is bigger than his balance');
  }
});
app.post('/ea/user/data/decrease/payout/data/:id', verify, async (req, res) => {
  let { amount } = req.body;
  amount = parseInt(amount);

  var account = await Account.findOne({
    where: {
      userId: req.params.id,
    },
  });
  if (amount <= account.availableCredit) {
    await Account.decrement('availableCredit', {
      by: amount,
      where: { userId: req.params.id },
    });

    return res.status(201).send('success');
  } else {
    res.send('Your entered amount is bigger than his total payout');
  }
});
const getPagingDataPlans = (data, page, limit) => {
  const { count: totalItems, rows: increment } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, increment, totalPages, currentPage };
};

app.get('/ea/users/verified/plans/:id',verify, async (req, res) => {
  console.log('hi');
  // const users = await User.findAll({
  //   where: { isActive: true, isDocumentUploaded: true },
  // });
  // res.send(users);
const  condition =  {userId: req.params.id  } 
  const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

      const plansData  = await Increment.findAndCountAll({
        where: condition,
        order: [['createdAt', 'ASC']],
        limit,
        offset,
      });
  
      // let plans = [];
      // for (const plans of plansData) {
      //   plans.push({
      //     id: plans.id,
      //     createdAt: moment(plans.createdAt).format("DD/MM/YYYY"),
      //     plan: plans.plan,
      //     principal: plans.principal,
      //     // daysUntilPayout: daysUntilNextPayout(increment),
      //     // interest: payoutForIncrement(increment).toFixed(2)
      //   })
      // }
       
       const response = getPagingDataPlans(plansData, page, limit);
       console.log(response);
    res.send(response);

});

app.delete('/ea/users/verified/plan/delete/:id',verify, async (req, res) => {

  // const users = await User.findAll({
  //   where: { isActive: true, isDocumentUploaded: true },
  // });
  // res.send(users);
  console.log(req.params.id);
const  condition =  {id: req.params.id  } 
const data =await Increment.findAll({
  where: condition

});
console.log(data);

      const deleted  = await Increment.destroy({
        where: condition

      });
  

    res.status(201).send('success');

});
app.post('/ea/user/data/add/payout/direct/:id', verify, async (req, res) => {
  let { amount } = req.body;
  amount = parseFloat(amount);

  var account = await Account.findOne({
    where: {
      userId: req.params.id,
    },
  });
  // if (amount <= account.balance) {
  //   await Account.decrement('balance', {
  //     by: amount,
  //     where: { userId: req.params.id },
  //   });

  //   return res.status(201).send('success');
  // } else {
     account.availableCredit += amount;
  
  
      await account.save();
  return res.status(201).send('success');
  // }
});



app.post('/ea/user/updatePlan/:id',verify, async (req, res) => {

  let { startDate, amount } = req.body;
  amount = parseInt(amount);
  var account = await Account.findOne({
    where: {
      userId: req.params.id,
    },
  });



    const validBody = schema.validate(req.body);

    if (validBody.error == null) {
      if (req.body.amount <= account.balance) {
        var investment = await Investment.findOne({
          where: { userId: req.params.id },
        });

        if (investment == null) {
          res.status(400).send({
            message: 'User has no investment yet. Please create one first',
          });

          return;
        }
        await Earned.create({
          plan: req.body.plan,
          principal: parseFloat(req.body.amount),
          startDate: new Date(startDate),
          createdAt: new Date(startDate),
          updatedAt: new Date(startDate),
          userId: req.params.id,
          investmentId: investment.id,
        });
     
        const daysElapsed = moment(new Date()).diff(
          investment.createdAt,
          'days'
        );
        const increments = await Increment.findAll({
          order: [['createdAt', 'ASC']],
          where: { userId: req.params.id },
        });

        if (increments.length == 1 && daysElapsed <= 15) {
          // If the user has only made a single investment
          // and less than 15 days have passed update the
          // first increment's principal, plan and start
          // date
          const firstIncrement = increments[0];

          await firstIncrement.update({
            plan: req.body.plan,
            principal: firstIncrement.principal + parseFloat(req.body.amount),
            startDate: new Date(startDate),
            createdAt: new Date(startDate),
          });
        } else {
          // If more than 15 days have elapsed or the user
          // has more than a single increment create a new
          // increment with the invested amount as the principal
          await Increment.create({
            plan: req.body.plan,
            principal: parseFloat(req.body.amount),
            startDate: new Date(startDate),
            createdAt: new Date(startDate),
            updatedAt: new Date(startDate),
            userId: req.params.id,
            investmentId: investment.id,
          });
        }

        await Account.decrement('balance', {
          by: req.body.amount,
          where: { userId: req.params.id },
        });

        res.send({
          message: 'success',
        });
      } else {
        res.status(400).send({
          message: 'not enough balance',
        });
      }
    } else {
      res.status(400).send({
        message: 'invalid payload',
      });
    }
});

app.post('/ea/users/discard',verify, async (req, res) => {
  const user = await User.findOne({ where: { id: req.body.id } });
  const mailer = new Mailer();
  let documentDiscard = await mailer.getUpDAteInfoMail(user);
  try {
    await mailer.sendMailSync(documentDiscard);

    console.log('Document verification email sent');
    res.send({ message: 'User update mail send' });
  } catch (error) {
    const errorString = `Error sending email: ${error}`;

    console.log(errorString);
    res.send({ message: errorString });
  }
});


app.post('/ea/users/login', async (req, res) => {
  console.log(req.body);

  if (!req.body) {
    return res.send('Enter Data properly');
  }

  if (req.body.email !== process.env.ADMIN_EMAIL) {
    return res.status(404).send('Invalid Credential');
  }

  else  {
bcrypt.compare(req.body.password, admin.password, function (err, result) {
  console.log(result);
  if (result===false) {
        return res.status(404).send('Invalid Credential');
  }else{
 const accesToken = jwt.sign(
   { email: admin.email },
   '$%myadmi@#kjnvxjkfrkeurfdgbfuhsdbfuhbg764526@!~@@#$%&*^^&*(fdsefcD$#W!@13%$d$#55dfvh@3'
   // ,

   // { expiresIn: '10h' }
 );
 return res.send({
   email: admin.email,
   token: accesToken,
 });
  }
});
   
  } 
  // else {
  //   return res.status(404).send('Invalid Credential');
  // }
});


app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.use('/employee', express.static(path.join(__dirname, 'frontend', 'build')));
app.use('/employee/', express.static(path.join(__dirname, 'frontend', 'build')));

// /employee/login
app.get('/employee', function (req, res) {
  res.redirect('/employee/login');
});
app.get('/employee/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});




const port = process.env.PORT || 4001;

app.listen(port, async () => {
  console.log('Server Has Started 🚀');
});
