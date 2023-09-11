const nodemailer = require('nodemailer');


const smtpTransport = nodemailer.createTransport({
    service: "Naver",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PW
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  module.exports={
      smtpTransport
  }