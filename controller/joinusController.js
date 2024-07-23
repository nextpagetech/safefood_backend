


// const mongoose = require("mongoose");



// const { sendMails, sendMailsAdmin } = require("../lib/email-sender/sender");

// const emailSend =  (req, res) => {
//   console.log(1);
 
//   const { email ,name, contact_no,cities,pincode} = req.body;
//   console.log("res1234",email,name);

  

  
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//        to:'soppariramesh919@gmail.com',
//     subject: "Safe Food" ,
//     text: `Thank you, ${name},${email},${contact_no},${cities},${pincode} for contacting Safe Food. We will get back to you later.`,
//   };

// console.log("mailOptions",mailOptions);




//   const mailAdminOptions = {
//     from: process.env.EMAIL_USER,
//     to: 'rameshsoppari8@gmail.com',

//     subject: "Safe Food" ,
//     text: `Dear Admin, ${name},${email},${contact_no},${cities},${pincode} has tried to reach us` ,
//   };
//   console.log("mailAdminOptions",mailAdminOptions);

 
   
//    sendMails(mailOptions,res)
//   sendMailsAdmin(mailAdminOptions,res) 

  
// };
// module.exports = {
//   emailSend
 
// };





// const mongoose = require("mongoose");
// const { sendMails, sendMailsAdmin } = require("../lib/email-sender/sender");

// const emailSend = (req, res) => {
//   console.log(1);

//   const { email, name, contact_no, cities, pincode } = req.body;
//   console.log("res1234", email, name);

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Safe Food",
//     text: `Thank you, ${name}, ${email}, ${contact_no}, ${cities}, ${pincode} for contacting Safe Food. We will get back to you later.`,
//     html: `
//       <h3>Thank you for contacting Safe Food</h3>
//       <p>Dear ${name},</p>
//       <p>Thank you for reaching out to Safe Food. Here are the details we received:</p>
//       <table border="1" style="border-collapse: collapse; width: 100%;">
//         <tr>
//           <th style="padding: 8px; text-align: left;">Field</th>
//           <th style="padding: 8px; text-align: left;">Details</th>
//         </tr>
//         <tr>
//           <td style="padding: 8px; text-align: left;">Name</td>
//           <td style="padding: 8px; text-align: left;">${name}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px; text-align: left;">Email</td>
//           <td style="padding: 8px; text-align: left;">${email}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px; text-align: left;">Contact No</td>
//           <td style="padding: 8px; text-align: left;">${contact_no}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px; text-align: left;">City</td>
//           <td style="padding: 8px; text-align: left;">${cities}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px; text-align: left;">Pin Code</td>
//           <td style="padding: 8px; text-align: left;">${pincode}</td>
//         </tr>
//       </table>
//       <p>We will get back to you shortly.</p>
//     `,
//   };

//   console.log("mailOptions", mailOptions);

//   const mailAdminOptions = {
//     from: process.env.EMAIL_USER,
//     to: 'rameshsoppari8@gmail.com',
//     subject: "Safe Food",
//     text: `Dear Admin, ${name}, ${email}, ${contact_no}, ${cities}, ${pincode} has tried to reach us.`,
//     html: `
//       <h3>New Registration Form Submission</h3>
//       <table border="1" style="border-collapse: collapse; width: 100%;">
//         <tr>
//           <td style="padding: 8px; text-align: left;">Name</td>
//           <td style="padding: 8px; text-align: left;">${name}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px; text-align: left;">Email</td>
//           <td style="padding: 8px; text-align: left;">${email}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px; text-align: left;">Contact No</td>
//           <td style="padding: 8px; text-align: left;">${contact_no}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px; text-align: left;">City</td>
//           <td style="padding: 8px; text-align: left;">${cities}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px; text-align: left;">Pin Code</td>
//           <td style="padding: 8px; text-align: left;">${pincode}</td>
//         </tr>
//       </table>
//     `,
//   };

//   console.log("mailAdminOptions", mailAdminOptions);

//   sendMails(mailOptions, res);
//   sendMailsAdmin(mailAdminOptions, res);
// };

// module.exports = {
//   emailSend,
// };



const mongoose = require("mongoose");
const { sendMails, sendMailsAdmin } = require("../lib/email-sender/sender");

const emailSend = (req, res) => {
  console.log(1);

  const { email, name, contact_no, cities, pincode } = req.body;
  console.log("res1234", email, name);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    to:'soppariramesh919@gmail.com',
    subject: "Safe Food",
    text: `Thank you, ${name}, ${email}, ${contact_no}, ${cities}, ${pincode} for contacting Safe Food. We will get back to you later.`,
    html: `
      <h3>Thank you for contacting Safe Food</h3>
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to Safe Food. Here are the details we received:</p>
      <table border="1" style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="padding: 8px; text-align: left;"><strong>Field</strong></th>
          <th style="padding: 8px; text-align: left;"><strong>Details</strong></th>
        </tr>
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
          <td style="padding: 8px; text-align: left;">${pincode}</td>
        </tr>
      </table>
      <p>We will get back to you shortly.</p>
    `,
  };

  console.log("mailOptions", mailOptions);

  const mailAdminOptions = {
    from: process.env.EMAIL_USER,
    to: 'rameshsoppari8@gmail.com',
    subject: "Safe Food",
    text: `Dear Admin, ${name}, ${email}, ${contact_no}, ${cities}, ${pincode} has tried to reach us.`,
    html: `
      <h3>New Registration Form Submission</h3>
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
          <td style="padding: 8px; text-align: left;">${pincode}</td>
        </tr>
      </table>
    `,
  };

  console.log("mailAdminOptions", mailAdminOptions);

  sendMails(mailOptions, res);
  sendMailsAdmin(mailAdminOptions, res);
};

module.exports = {
  emailSend,
};



