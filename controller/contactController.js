



const nodemailer = require('nodemailer');
// const { sendMails, sendMailsAdmin } = require("../lib/email-sender/sender");


const sendEmails = async (mailOptions, mailAdminOptions) => {

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

  try {

    transporter.verify(function (err, success) {
      if (err) {
        // res.status(403).send({
        //   message: `Error happen when verify ${err.message}`,
        // });
        console.log(err.message);
        return false;
      } else {
        console.log("Server is ready to take our messages");
      }
    });   


    const userResult = await transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("error mailOptions")
      }
    });


    const adminResult = await transporter.sendMail(mailAdminOptions, (err, data) => {
      if (err) {
        console.log("error mailOptions")
      }
    });

    return true;
  } catch (error) {
    console.error("Error sending emails:", error.message);
    return false;
  }
};

const emailSend = async (req, res) => {
  console.log("Request received");

  const { email, name, contact } = req.body;
  console.log("Request body:", { email, name, contact });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Hello ${name}`,
    text: `Thank you, ${name}, for contacting Safe Food. We will get back to you later.`,
  };

  const mailAdminOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `${name}`,
    text: `Dear Admin,\n\n${name} (${email}, ${contact}) has tried to reach us.`,
    html: `
    <h3>New Contact Form Submission</h3>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="padding: 8px; text-align: left;"><strong>Name</strong></td>
        <td style="padding: 8px; text-align: left;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; text-align: left;"><strong>Email</strong></td>
        <td style="padding: 8px; text-align: left;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 8px; text-align: left;"><strong>Contact</strong></td>
        <td style="padding: 8px; text-align: left;">${contact}</td>
      </tr>
    </table>
  `,
  };

  try {
    const success = await sendEmails(mailOptions, mailAdminOptions);
    if (success) {
      res.status(200).send("Emails sent successfully.");
      console.log("successful")
    } else {
      res.status(500).send("Failed to send emails.");
      console.log("error");
    }
  } catch (error) {
    console.error("Error sending emails:", error.message);
    res.status(500).send(`Failed to send emails: ${error.message}`);
  }
};

module.exports = {
  emailSend
};
