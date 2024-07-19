const mongoose = require("mongoose");




const { sendMails, sendMailsAdmin } = require("../lib/email-sender/sender");

const emailSend =  (req, res) => {
  console.log(1);
 
  const { email ,name, contact} = req.body;
  console.log("res1234",email,name);

  

  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
      // to:'saip8129@gmail.com',
    subject: "Safe Food" ,
    text: `Thank you, ${name}, for contacting Safe Food. We will get back to you later.`,
  };

console.log("mailOptions",mailOptions);




  const mailAdminOptions = {
    from: process.env.EMAIL_USER,
    to: 'penugondapranathisai11@gmail.com',
      // to:'saip8129@gmail.com',
    subject: "Safe Food" ,
    text: `Dear Admin, ${name}, ${email}, ${contact} has tried to reach us` ,
  };
  console.log("mailAdminOptions",mailAdminOptions);

 
   
   sendMails(mailOptions,res)
  sendMailsAdmin(mailAdminOptions,res) 

  
};
module.exports = {
  emailSend
 
};
