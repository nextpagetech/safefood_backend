const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

const sendEmail = (body, res, message) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE, //comment this line if you use custom server/domain
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    //comment out this one if you usi custom server/domain
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  transporter.verify(function (err, success) {
    if (err) {
      res.status(403).send({
        message: `Error happen when verify ${err.message}`,
      });
      console.log(err.message);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  transporter.sendMail(body, (err, data) => {
    if (err) {
      res.status(403).send({
        message: `Error happen when sending email ${err.message}`,
      });
    } else {
      res.send({
        message: message,
      });
    }
  });
};



//limit email verification and forget password
const minutes = 30;
const emailVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});


const sendMails = (body, res ) => {
  console.log("BODY", body)
  let message;
  const transporter = nodemailer.createTransport({
     host: process.env.HOST,
    port: process.env.EMAIL_PORT,
     secure: false,
    auth: {
      user: process.env.EMAIL_USER_NAME,
      pass: process.env.EMAIL_PASS,
    },
    debug:true
    // comment out this one if you use custom server/domain
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  transporter.verify(function (err, success) {
    if (err) {
      // res.status(403).send({
      //   message: `Error happen when verify ${err.message}`,
      // });
      console.log(err.message);
    } else {
      // res.status(200).send({
      //   message: `Successfully`,

      // })
      console.log("Server is ready to take our messages");
    }
  });

  transporter.sendMail(body, (err, data) => {
    if (err) {
      // res.status(403).send({
      //   message: `Error happen when sending email ${err.message}`,
      // });
      console.log("Error in SendMain", err)
    } else {
      // res.send({
      //   message: message,
      // });
      console.log("EMAIL SENT IN SENDMAIL")
    }
  });
}
const sendMailsAdmin = (body, res ) => {
  let message;
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER_NAME,
      pass: process.env.EMAIL_PASS,
    },
    debug:true
  });

  transporter.verify(function (err, success) {
    if (err) {
      // res.status(403).send({
      //   message: `Error happen when verify ${err.message}`,
      // })
      console.log(err.message);
    } else {
      // res.status(200).send({
      //   message: `Successfully`,

      // })
      console.log("Server is ready to take our messages");
    }
  });

  transporter.sendMail(body, (err, data) => {
    if (err) {
      // res.status(403).send({
      //   message: `Error happen when sending email ${err.message}`,
      // });
    } else {
      // res.send({
      //   message: message,
      // });
    }
  });
}

// module.exports = { sendMails };
 

  

const passwordVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const supportMessageLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

module.exports = {
  sendEmail,
  sendMails,
  sendMailsAdmin,
  emailVerificationLimit,
  passwordVerificationLimit,
  supportMessageLimit,
};