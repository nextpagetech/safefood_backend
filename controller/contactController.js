// const mongoose = require("mongoose");

// const { sendMails, sendMailsAdmin } = require("../lib/email-sender/sender");

// const emailSend =  (req, res) => {
//   console.log(1);
 
//   const { email ,name, contact} = req.body;
//   console.log("res1234",email,name);

  
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//       // to:'saip8129@gmail.com',
//     subject: "Safe Food" ,
//     text: `Thank you, ${name}, for contacting Safe Food. We will get back to you later.`,
//   };

// console.log("mailOptions",mailOptions);




//   const mailAdminOptions = {
//     from: process.env.EMAIL_USER,
//     to: 'penugondapranathisai11@gmail.com',
//       // to:'saip8129@gmail.com',
//     subject: "Safe Food" ,
//     text: `Dear Admin, ${name}, ${email}, ${contact} has tried to reach us` ,
//   };
//   console.log("mailAdminOptions",mailAdminOptions);

 
   
//    sendMails(mailOptions,res)
//    sendMailsAdmin(mailAdminOptions,res) 

  
// };
// module.exports = {
//   emailSend
 
// };




const mongoose = require("mongoose");

const { sendMails, sendMailsAdmin } = require("../lib/email-sender/sender");

const emailSend = async (req, res) => {
  console.log(1);

  const { email, name, contact } = req.body;
  console.log("res1234", email, name);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Safe Food  ${name}`,
    text: `Thank you, ${name}, for contacting Safe Food.`,
  };

  console.log("mailOptions", mailOptions);

  const mailAdminOptions = {
    from: process.env.EMAIL_USER,
    to: 'penugondapranathisai11@gmail.com',
    subject:` Safe Food  ${name}`,
    text: ` ${name}, ${email}, ${contact} has tried to reach us`,
  };
  console.log("mailAdminOptions", mailAdminOptions);

  try {
    let user_email = await sendMails(mailOptions);
    console.log("User email sent successfully.",user_email);

    let admin_email = await sendMailsAdmin(mailAdminOptions);
    console.log("Admin email sent successfully.",admin_email);
      res.status(200).send("Emails sent successfully.");


  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send("Failed to send emails.");
  }
};

module.exports = {
  emailSend
};
