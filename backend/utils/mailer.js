const nodemailer = require('nodemailer');

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });
  }

  async getUpDAteInfoMail(user) {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: user.email,
      subject: 'Nuovo deposito',
      text:
        `Your information is not correct. Mail us with your proper document`,
    };

    return mailOptions;
  }

  async getUpAprooveInfoMail(user) {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: user.email,
      subject: 'Nuovo deposito',
      text: `The account is approved`,
    };

    return mailOptions;
  }

  sendMailAsync(mailOptions, callback) {
    this.transporter.sendMail(mailOptions, callback);
  }

  sendMailSync(mailOptions) {
    const mailer = this;

    return new Promise(function (resolve, reject) {
      mailer.transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }
}

module.exports = Mailer;
