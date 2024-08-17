// const mongoose = require("mongoose");
const VendorOrder = require("../models/vendorOrder");
const VendorProducts = require("../models/vendor_products");
const nodemailer = require("nodemailer");

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const sendEmails = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Set to true if using a secure connection (e.g., SSL/TLS)
    auth: {
      user: process.env.EMAIL_USER_NAME,
      pass: process.env.EMAIL_PASS,
    },
    debug: false, // Set to true if you want detailed logging
  });

  try {
    // Validate `from` address
    if (!mailOptions.from || !validateEmail(mailOptions.from)) {
      throw new Error("Invalid MAIL FROM address provided");
    }

    // Validate `to` address
    if (!mailOptions.to || !validateEmail(mailOptions.to)) {
      throw new Error("Invalid MAIL TO address provided");
    }

    await transporter.verify(); // Check connection configuration
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false;
  }
};

// const generateEmailTemplate = (vendorName, productDetails) => {
//   const productRows = productDetails.map(p => `
//     <tr>
//       <td style="border: 1px solid #ddd; padding: 8px;">${p.title}</td>
//       <td style="border: 1px solid #ddd; padding: 8px;">${p.quantity}</td>
//       <td style="border: 1px solid #ddd; padding: 8px;">${p.price}</td>
//     </tr>
//     ${p.customer.map(c => `
//       <tr>
//         <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">
//           <strong>Customer:</strong> ${c.name} - ${c.contact}, ${c.email}<br>
//           <strong>Address:</strong> ${c.address}, ${c.city}, ${c.country}
//         </td>
//       </tr>
//     `).join('')}
//   `).join('');

//   return `
//     <h2>Hello ${vendorName},</h2>
//     <p>Here are the details of the products assigned to you:</p>
//     <table style="border-collapse: collapse; width: 100%;">
//       <thead>
//         <tr>
//           <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
//           <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
//           <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${productRows}
//       </tbody>
//     </table>
//   `;
// };

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const generateEmailTemplate = (vendorName, productDetails) => {
  // Group products by customer
  const customerMap = productDetails.reduce((acc, p) => {
    p.customer.forEach((c) => {
      const capitalizedCustomerName = capitalizeFirstLetter(c.name);
      if (!acc[c.email]) {
        acc[c.email] = {
          name: capitalizedCustomerName,
          contact: c.contact,
          email: c.email,
          address: c.address,
          city: c.city,
          country: c.country,
          products: [],
        };
      }
      acc[c.email].products.push({
        title: p.title,
        quantity: p.quantity,
        price: p.price,
      });
    });
    return acc;
  }, {});

  // Generate the product rows and address section for each customer
  const customerSections = Object.values(customerMap)
    .map(
      (cust) => `
    <tr>
      <td">${cust.products
        .map(
          (p) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${p.title}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${p.quantity}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${p.price}</td>
        </tr>
      `
        )
        .join("")}
    </tr>
    <tr>
      <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">
        <strong>Customer:</strong> ${cust.name} - ${cust.contact}, ${
        cust.email
      }<br>
        <strong>Address:</strong> ${cust.address}, ${cust.city}, ${cust.country}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <h2>Hello ${vendorName},</h2>
    <p>Here are the details of the products assigned to you:</p>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${customerSections}
      </tbody>
    </table>
  `;
};

const vendor_orderadd = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const vendorProducts = req.body;

    await Promise.all(
      Object.keys(vendorProducts).map(async (vendorName) => {
        const products = vendorProducts[vendorName];
        let vendorEmails = null;

        await Promise.all(
          products.map(async (product) => {
            try {
              if (!product.productId) {
                console.warn("Product ID is missing:", product);
                return;
              }

              // Check if the product already exists in any VendorOrder document
              const existingOrder = await VendorOrder.findOne({
                "products.productId": product.productId,
              });

              if (existingOrder) {
                // Product exists, update the existing product
                await VendorOrder.updateOne(
                  { "products.productId": product.productId },
                  {
                    $set: {
                      "products.$.prices": product.prices,
                      "products.$.image": product.image,
                      "products.$.tag": product.tag,
                      "products.$.status": product.status,
                      "products.$.sku": product.sku,
                      "products.$.barcode": product.barcode,
                      "products.$.title": product.title,
                      "products.$.category": product.category,
                      "products.$.stock": product.stock,
                      "products.$.isCombination": product.isCombination,
                      "products.$.sales": product.sales,
                      "products.$.variant": product.variant,
                      "products.$.price": product.price,
                      "products.$.originalPrice": product.originalPrice,
                      "products.$.quantity": product.quantity,
                      "products.$.itemTotal": product.itemTotal,
                      "products.$.totalQuantity": product.totalQuantity,
                      "products.$.count": product.count,
                      "products.$.userInfos": product.userInfos,
                      "products.$.carts": product.carts,
                      "products.$.displayVendorID": product.displayVendorID,
                      "products.$.displayVendorName": product.displayVendorName,
                      "products.$.displayPrice": product.displayPrice,
                      "products.$.updatedAt": new Date(),
                    },
                  }
                );
              } else {
                // Product does not exist, add it to a new VendorOrder document
                await VendorOrder.updateOne(
                  {},
                  {
                    $push: { products: product },
                  },
                  {
                    upsert: true,
                    runValidators: true,
                  }
                );
              }

              // Fetch vendor email only once per vendor
              if (!vendorEmails) {
                const vendorDetails = await VendorProducts.findOne({
                  _id: product.displayVendorID,
                });
                if (vendorDetails) {
                  vendorEmails = vendorDetails.email;
                }
              }
            } catch (err) {
              console.error("Error updating or creating vendor order:", err);
              throw err;
            }
          })
        );

        if (vendorEmails) {
          // Compose and send email with details of products and customers
          const productDetails = products.map((p) => ({
            title: p.title,
            quantity: p.quantity,
            price: p.price,
            customer: p.userInfos.map((u) => ({
              name: u.name,
              contact: u.contact,
              email: u.email,
              address: u.address,
              city: u.city,
              country: u.country,
            })),
          }));

          const emailTemplate = generateEmailTemplate(
            vendorName,
            productDetails
          );

          const mailOptions1 = {
            // from: `prasad@nextpagetechnologies.com`, // Ensure this is a valid email address
            from: process.env.EMAIL_USER,
            // to: `praveenkumar930316@gmail.com`,
            to: vendorEmails,
            // subject: `hi hello`,
            subject: `Order Details for ${vendorName}`,
            html: emailTemplate,
          };

          const emailSuccess = await sendEmails(mailOptions1);
          if (!emailSuccess) {
            console.log(`Failed to send email to ${vendorName}`);
          }
        }
      })
    );

    res.status(200).send({
      message: "Products Added/Updated Successfully!",
    });
  } catch (err) {
    console.error("Error in vendor_orderadd:", err);
    res.status(500).send({
      message:
        err.message || "An error occurred while processing the products.",
    });
  }
};

// Placeholder function for sending an email - replace with actual email sending logic
const sendEmailToVendor = async (email, vendorName, productDetails) => {
  // Implement your email sending logic here using a library like nodemailer

  // console.log(`Sending email to ${email} for vendor ${vendorName} with details:`, productDetails);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Hello ${vendorName}`,
    text: `Your Orders are ${productDetails}`,
  };

  // const mailAdminOptions = {
  //   from: process.env.EMAIL_USER,
  //   // to: process.env.EMAIL_USER,
  //   to: 'saip8129@gmail.com',

  //   subject: `${name}`,
  //   text: `Dear Admin,\n\n${name} (${email}, ${contact}) has tried to reach us.`,
  //   html: `
  //   <h3>New Contact Form Submission</h3>
  //   <table border="1" style="border-collapse: collapse; width: 100%;">
  //     <tr>
  //       <td style="padding: 8px; text-align: left;"><strong>Name</strong></td>
  //       <td style="padding: 8px; text-align: left;">${name}</td>
  //     </tr>
  //     <tr>
  //       <td style="padding: 8px; text-align: left;"><strong>Email</strong></td>
  //       <td style="padding: 8px; text-align: left;">${email}</td>
  //     </tr>
  //     <tr>
  //       <td style="padding: 8px; text-align: left;"><strong>Contact</strong></td>
  //       <td style="padding: 8px; text-align: left;">${contact}</td>
  //     </tr>
  //   </table>
  // `,
  // };

  try {
    const success = await sendEmails(mailOptions);
    if (success) {
      res.status(200).send("Emails sent successfully.");
      console.log("successful");
    } else {
      res.status(500).send("Failed to send emails.");
      console.log("error");
    }
  } catch (error) {
    console.error("Error sending emails:", error.message);
    res.status(500).send(`Failed to send emails: ${error.message}`);
  }
};

const vendor_orderget = async (req, res) => {
  try {
    const vendors = await VendorOrder.find({}).sort({ _id: -1 });
    console.log("vendorsvendors", vendors);
    res.send(vendors);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// const vendor_ordergetId = async (req, res) => {
//   try {
//     const { vendorId } = req.body;
//     console.log("req.body123:", req.body);

//     const Vendordata = await VendorOrder.findById(vendorId);
//     console.log("Vendordata", Vendordata);

//     // const vendors = await VendorOrder.find({}).sort({ _id: -1 });
//     // console.log("vendorsvendors", vendors);
//     // res.send(vendors);
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };
const vendor_ordergetId = async (req, res) => {
  try {
    const { vendorId } = req.body;
    console.log("Requested vendorId:", vendorId);

    // Fetch vendor data by vendorId
    const vendorData = await VendorOrder.find({
      "products.displayVendorID": vendorId
    }).exec();
     console.log("vendorData111",vendorData);
     
    // Check if data is found
    if (!vendorData || vendorData.length === 0) {
      return res.status(404).send({ message: "No orders found for the given vendor." });
    }

    // Extract product details and customer details
    const productDetails = [];
    const customerDetails = new Set(); // Using Set to avoid duplicate customers

    vendorData.forEach(order => {
      order.products.forEach(product => {
        if (product.displayVendorID === vendorId) {
          // Count the total quantity of products assigned to the vendor
          const productCount = product.quantity;

          // Extract product and customer details
          productDetails.push({
            title: product.title,
            quantity: productCount,
            price: product.price
          });

          product.userInfos.forEach(user => {
            customerDetails.add({
              name: user.name,
              contact: user.contact,
              email: user.email,
              address: user.address,
              city: user.city,
              country: user.country
            });
          });
        }
      });
    });

    // Format response data
    const responseData = {
      vendorId,
      totalProducts: productDetails.length,
      products: productDetails,
      customers: Array.from(customerDetails)
    };

    console.log("Response Data:", responseData);
    res.status(200).send(responseData);

  } catch (err) {
    console.error("Error in vendor_ordergetId:", err);
    res.status(500).send({ message: err.message });
  }
};


// const emailSend = async (req, res) => {
//   console.log("Request received");

//   const { email, name, contact } = req.body;
//   console.log("Request body:", { email, name, contact });

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: `Hello ${name}`,
//     text: `Thank you, ${name}, for contacting Safe Food. We will get back to you later.`,
//   };

//   const mailAdminOptions = {
//     from: process.env.EMAIL_USER,
//     // to: process.env.EMAIL_USER,
//     to: 'saip8129@gmail.com',

//     subject: `${name}`,
//     text: `Dear Admin,\n\n${name} (${email}, ${contact}) has tried to reach us.`,
//     html: `
//     <h3>New Contact Form Submission</h3>
//     <table border="1" style="border-collapse: collapse; width: 100%;">
//       <tr>
//         <td style="padding: 8px; text-align: left;"><strong>Name</strong></td>
//         <td style="padding: 8px; text-align: left;">${name}</td>
//       </tr>
//       <tr>
//         <td style="padding: 8px; text-align: left;"><strong>Email</strong></td>
//         <td style="padding: 8px; text-align: left;">${email}</td>
//       </tr>
//       <tr>
//         <td style="padding: 8px; text-align: left;"><strong>Contact</strong></td>
//         <td style="padding: 8px; text-align: left;">${contact}</td>
//       </tr>
//     </table>
//   `,
//   };

//   try {
//     const success = await sendEmails(mailOptions, mailAdminOptions);
//     if (success) {
//       res.status(200).send("Emails sent successfully.");
//       console.log("successful")
//     } else {
//       res.status(500).send("Failed to send emails.");
//       console.log("error");
//     }
//   } catch (error) {
//     console.error("Error sending emails:", error.message);
//     res.status(500).send(`Failed to send emails: ${error.message}`);
//   }
// };

module.exports = {
  vendor_orderadd,
  vendor_orderget,
  vendor_ordergetId
  // emailSend,
};
