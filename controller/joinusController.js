

const nodemailer = require('nodemailer');


const sendEmails = async (mailOptions, mailAdminOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER_NAME,
      pass: process.env.EMAIL_PASS,
    },
    debug: true,
  });

  try {
    await transporter.verify();

    await transporter.sendMail(mailOptions);
    console.log("User email sent successfully");

    await transporter.sendMail(mailAdminOptions);
    console.log("Admin email sent successfully");

    return true;
  } catch (error) {
    console.error("Error sending emails:", error.message);
    return false;
  }
};

const emailSend = async (req, res) => {
  console.log("Request received");

  const { name, email, contact_no, cities, pin_code } = req.body;
  console.log("Request body:", { name, email, contact_no, cities, pin_code });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Hello ${name}`,
    text: `Thank you, ${name}, for joining Safe Food. We will get back to you later.`,
  };

  const mailAdminOptions = {
    from: process.env.EMAIL_USER,
    to: 'rameshsoppari8@gmail.com',
    subject: `New Registration from ${name}`,
    text: `Dear Admin,\n\n${name} (${email}, ${contact_no}, ${cities}, ${pin_code}) has tried to reach us.`,
    html: `
      <h3>New joinus Form Submission</h3>
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
          <td style="padding: 8px; text-align: left;"><strong>Contact No</strong></td>
          <td style="padding: 8px; text-align: left;">${contact_no}</td>
        </tr>
        <tr>
          <td style="padding: 8px; text-align: left;"><strong>City</strong></td>
          <td style="padding: 8px; text-align: left;">${cities}</td>
        </tr>
        <tr>
          <td style="padding: 8px; text-align: left;"><strong>Pin Code</strong></td>
          <td style="padding: 8px; text-align: left;">${pin_code}</td>
        </tr>
      </table>
    `,
  };

  try {
    const success = await sendEmails(mailOptions, mailAdminOptions);
    if (success) {
      res.status(200).send("Emails sent successfully.");
      console.log("Emails sent successfully");
    } else {
      res.status(500).send("Failed to send emails.");
      console.log("Failed to send emails");
    }
  } catch (error) {
    console.error("Error sending emails:", error.message);
    res.status(500).send(`Failed to send emails: ${error.message}`);
  }
};

module.exports = {
  emailSend
};





















