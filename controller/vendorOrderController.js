// // const mongoose = require("mongoose");
// const mongoose = require('mongoose');
// const VendorOrder = require("../models/vendorOrder");
// const VendorProducts = require("../models/vendor_products");
// const nodemailer = require("nodemailer");

// const validateEmail = (email) => {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(String(email).toLowerCase());
// };

// const sendEmails = async (mailOptions1) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.HOST,
//     port: process.env.EMAIL_PORT,
//     secure: false, // Set to true if using a secure connection (e.g., SSL/TLS)
//     auth: {
//       user: process.env.EMAIL_USER_NAME,
//       pass: process.env.EMAIL_PASS,
//     },
//     debug: false, // Set to true if you want detailed logging
//   });

//   try {
//     // Validate `from` address
//     if (!mailOptions1.from || !validateEmail(mailOptions1.from)) {
//       throw new Error("Invalid MAIL FROM address provided");
//     }

//     // Validate `to` address
//     if (!mailOptions1.to || !validateEmail(mailOptions1.to)) {
//       throw new Error("Invalid MAIL TO address provided");
//     }

//     await transporter.verify(); // Check connection configuration
//     await transporter.sendMail(mailOptions1);
//     console.log("Email sent successfully");
//     return true;
//   } catch (error) {
//     console.error("Error sending email:", error.message);
//     return false;
//   }
// };

// // const generateEmailTemplate = (vendorName, productDetails) => {
// //   const productRows = productDetails.map(p => `
// //     <tr>
// //       <td style="border: 1px solid #ddd; padding: 8px;">${p.title}</td>
// //       <td style="border: 1px solid #ddd; padding: 8px;">${p.quantity}</td>
// //       <td style="border: 1px solid #ddd; padding: 8px;">${p.price}</td>
// //     </tr>
// //     ${p.customer.map(c => `
// //       <tr>
// //         <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">
// //           <strong>Customer:</strong> ${c.name} - ${c.contact}, ${c.email}<br>
// //           <strong>Address:</strong> ${c.address}, ${c.city}, ${c.country}
// //         </td>
// //       </tr>
// //     `).join('')}
// //   `).join('');

// //   return `
// //     <h2>Hello ${vendorName},</h2>
// //     <p>Here are the details of the products assigned to you:</p>
// //     <table style="border-collapse: collapse; width: 100%;">
// //       <thead>
// //         <tr>
// //           <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
// //           <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
// //           <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
// //         </tr>
// //       </thead>
// //       <tbody>
// //         ${productRows}
// //       </tbody>
// //     </table>
// //   `;
// // };

// const capitalizeFirstLetter = (string) => {
//   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
// };

// const generateEmailTemplate = (vendorName, productDetails) => {
//   // Group products by customer (email + name + address)
//   const customerMap = productDetails.reduce((acc, p) => {
//     p.customer.forEach((c) => {
//       const capitalizedCustomerName = capitalizeFirstLetter(c.name);
//       const customerKey = `${c.email}-${c.name}-${c.address}`;

//       if (!acc[customerKey]) {
//         acc[customerKey] = {
//           name: capitalizedCustomerName,
//           contact: c.contact,
//           email: c.email,
//           address: c.address,
//           city: c.city,
//           country: c.country,
//           products: [],
//         };
//       }

//       acc[customerKey].products.push({
//         title: p.title,
//         quantity: p.quantity,
//         price: p.displayPrice,
//       });
//     });
//     return acc;
//   }, {});

//   // Generate the product rows and address section for each customer
//   const customerSections = Object.values(customerMap)
//     .map(
//       (cust) => `
//       ${cust.products
//           .map(
//             (p) => `
//           <tr>
//             <td style="border: 1px solid #ddd; padding: 8px;">${p.title}</td>
//             <td style="border: 1px solid #ddd; padding: 8px;">${p.quantity}</td>
//             <td style="border: 1px solid #ddd; padding: 8px;">${p.price}</td>
//           </tr>
//         `
//           )
//           .join("")}
//       <tr>
//         <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">
//           <strong>Customer:</strong> ${cust.name} - ${cust.contact}, ${cust.email
//         }<br>
//           <strong>Address:</strong> ${cust.address}, ${cust.city}, ${cust.country
//         }
//         </td>
//       </tr>
//     `
//     )
//     .join("");

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
//         ${customerSections}
//       </tbody>
//     </table>
//   `;
// };

// // const vendor_orderadd = async (req, res) => {
// //   try {
// //     console.log("Request body:", req.body);

// //     const vendorProducts = req.body;

// //     await Promise.all(
// //       Object.keys(vendorProducts).map(async (vendorName) => {
// //         const products = vendorProducts[vendorName];
// //         let vendorEmails = null;

// //         await Promise.all(
// //           products.map(async (product) => {
// //             try {
// //               if (!product.productId) {
// //                 console.warn("Product ID is missing:", product);
// //                 return;
// //               }
// //               if (product.orderIds && Array.isArray(product.orderIds)) {
// //                 product.orderIds = product.orderIds.map(orderId => ({ id: orderId }));
// //               }

// //               // Check if the product already exists in any VendorOrder document
// //               const existingOrder = await VendorOrder.findOne({
// //                 "products.productId": product.productId,
// //               });

// //               if (existingOrder) {
// //                 // Product exists, update the existing product
// //                 await VendorOrder.updateOne(
// //                   { "products.productId": product.productId },
// //                   {
// //                     $set: {
// //                       "products.$.prices": product.prices,
// //                       "products.$.status": "unshow",
// //                       "products.$.image": product.image,
// //                       "products.$.tag": product.tag,
// //                       "products.$.sku": product.sku,
// //                       "products.$.barcode": product.barcode,
// //                       "products.$.title": product.title,
// //                       "products.$.category": product.category,
// //                       "products.$.stock": product.stock,
// //                       "products.$.isCombination": product.isCombination,
// //                       "products.$.sales": product.sales,
// //                       "products.$.variant": product.variant,
// //                       "products.$.price": product.price,
// //                       "products.$.originalPrice": product.originalPrice,
// //                       "products.$.quantity": product.quantity,
// //                       "products.$.itemTotal": product.itemTotal,
// //                       "products.$.totalQuantity": product.totalQuantity,
// //                       "products.$.count": product.count,
// //                       "products.$.userInfos": product.userInfos,
// //                       "products.$.carts": product.carts,
// //                       "products.$.displayVendorID": product.displayVendorID,
// //                       "products.$.displayVendorName": product.displayVendorName,
// //                       "products.$.displayPrice": product.displayPrice,
// //                       "products.$.updatedAt": new Date(),
// //                     },
// //                     $addToSet: {
// //                       "products.$.orderIds": { $each: product.orderIds || [] }, // Add only new orderIds
// //                     },
// //                   }
// //                 );
// //               } else {
// //                 // Product does not exist, add it to a new VendorOrder document
// //                 await VendorOrder.updateOne(
// //                   {},
// //                   {
// //                     $push: { products: product },
// //                   },
// //                   {
// //                     upsert: true,
// //                     runValidators: true,
// //                   }
// //                 );
// //               }

// //               // Fetch vendor email only once per vendor
// //               if (!vendorEmails) {
// //                 const vendorDetails = await VendorProducts.findOne({
// //                   _id: product.displayVendorID,
// //                 });
// //                 if (vendorDetails) {
// //                   vendorEmails = vendorDetails.email;
// //                 }
// //               }
// //               console.log("vendorEmails:", vendorEmails);
// //             } catch (err) {
// //               console.error("Error updating or creating vendor order:", err);
// //               throw err;
// //             }
// //           })
// //         );

// //         if (vendorEmails) {
// //           // Compose and send email with details of products and customers
// //           const productDetails = products.map((p) => ({
// //             title: p.title,
// //             quantity: p.quantity,
// //             price: p.price,
// //             displayPrice: p.displayPrice,
// //             customer: p.userInfos.map((u) => ({
// //               name: u.name,
// //               contact: u.contact,
// //               email: u.email,
// //               address: u.address,
// //               city: u.city,
// //               country: u.country,
// //             })),
// //           }));

// //           const emailTemplate = generateEmailTemplate(vendorName, productDetails);

// //           const mailOptions1 = {
// //             from: process.env.EMAIL_USER,
// //             to: vendorEmails,
// //             subject: `Order Details for ${vendorName}`,
// //             html: emailTemplate,
// //           };

// //           const emailSuccess = await sendEmails(mailOptions1);
// //           if (!emailSuccess) {
// //             console.log(`Failed to send email to ${vendorName}`);
// //           }
// //         }
// //       })
// //     );

// //     res.status(200).send({
// //       message: "Products Added/Updated Successfully!",
// //     });
// //   } catch (err) {
// //     console.error("Error in vendor_orderadd:", err);
// //     res.status(500).send({
// //       message: err.message || "An error occurred while processing the products.",
// //     });
// //   }
// // };


// // retyui// const vendor_orderadd = async (req, res) => {
// //   try {
// //     console.log("Request body:", req.body);

// //     const vendorProducts = req.body;

// //     await Promise.all(
// //       Object.keys(vendorProducts).map(async (vendorName) => {
// //         const products = vendorProducts[vendorName];
// //         let vendorEmails = null;

// //         await Promise.all(
// //           products.map(async (product) => {
// //             try {
// //               if (!product.productId) {
// //                 console.warn("Product ID is missing:", product);
// //                 return;
// //               }
// //               if (product.orderIds && Array.isArray(product.orderIds)) {
// //                 product.orderIds = product.orderIds.map(orderId => ({ id: orderId }));
// //               }

// //               // Check if the product already exists in any VendorOrder document
// //               const existingOrder = await VendorOrder.findOne({
// //                 "products.productId": product.productId,
// //               });

// //               if (existingOrder) {
// //                 // Product exists, update the existing product
// //                 await VendorOrder.updateOne(
// //                   { "products.productId": product.productId },
// //                   {
// //                     $set: {
// //                       "products.$.prices": product.prices,
// //                       "products.$.status": "Processing",
// //                       "products.$.image": product.image,
// //                       "products.$.tag": product.tag,
// //                       // "products.$.status": product.status,
// //                       "products.$.sku": product.sku,
// //                       "products.$.barcode": product.barcode,
// //                       "products.$.title": product.title,
// //                       "products.$.category": product.category,
// //                       "products.$.stock": product.stock,
// //                       "products.$.isCombination": product.isCombination,
// //                       "products.$.sales": product.sales,
// //                       "products.$.variant": product.variant,
// //                       "products.$.price": product.price,
// //                       "products.$.originalPrice": product.originalPrice,
// //                       "products.$.quantity": product.quantity,
// //                       "products.$.itemTotal": product.itemTotal,
// //                       "products.$.totalQuantity": product.totalQuantity,
// //                       "products.$.count": product.count,
// //                       "products.$.userInfos": product.userInfos,
// //                       "products.$.carts": product.carts,
// //                       "products.$.displayVendorID": product.displayVendorID,
// //                       "products.$.displayVendorName": product.displayVendorName,
// //                       "products.$.displayPrice": product.displayPrice,
// //                       'products.$.orderIds': product.orderIds,
// //                       "products.$.updatedAt": new Date(),
// //                     },
// //                   }
// //                 );
// //               } else {
// //                 // Product does not exist, add it to a new VendorOrder document
// //                 await VendorOrder.updateOne(
// //                   {},
// //                   {
// //                     $push: { products: product },
// //                   },
// //                   {
// //                     upsert: true,
// //                     runValidators: true,
// //                   }
// //                 );
// //               }

// //               // Fetch vendor email only once per vendor
// //               if (!vendorEmails) {
// //                 const vendorDetails = await VendorProducts.findOne({
// //                   _id: product.displayVendorID,
// //                 });
// //                 if (vendorDetails) {
// //                   vendorEmails = vendorDetails.email;
// //                 }
// //               }
// //               console.log("vendorEmailsvendorEmails", vendorEmails);
// //             } catch (err) {
// //               console.error("Error updating or creating vendor order:", err);
// //               throw err;
// //             }
// //           })
// //         );

// //         if (vendorEmails) {
// //           // Compose and send email with details of products and customers
// //           const productDetails = products.map((p) => ({
// //             title: p.title,
// //             quantity: p.quantity,
// //             price: p.price,
// //             displayPrice: p.displayPrice,
// //             customer: p.userInfos.map((u) => ({
// //               name: u.name,
// //               contact: u.contact,
// //               email: u.email,
// //               address: u.address,
// //               city: u.city,
// //               country: u.country,
// //             })),
// //           }));

// //           const emailTemplate = generateEmailTemplate(
// //             vendorName,
// //             productDetails
// //           );

// //           const mailOptions1 = {
// //             // from: `prasad@nextpagetechnologies.com`, // Ensure this is a valid email address
// //             from: process.env.EMAIL_USER,
// //             // to: `praveenkumar930316@gmail.com`,
// //             to: vendorEmails,
// //             // subject: `hi hello`,
// //             subject: `Order Details for ${vendorName}`,
// //             html: emailTemplate,
// //           };

// //           const emailSuccess = await sendEmails(mailOptions1);
// //           if (!emailSuccess) {
// //             console.log(`Failed to send email to ${vendorName}`);
// //           }
// //         }
// //       })
// //     );

// //     res.status(200).send({
// //       message: "Products Added/Updated Successfully!",
// //     });
// //   } catch (err) {
// //     console.error("Error in vendor_orderadd:", err);
// //     res.status(500).send({
// //       message:
// //         err.message || "An error occurred while processing the products.",
// //     });
// //   }
// // };
// // const vendor_orderadd = async (req, res) => {
// //   try {
// //     console.log("Request body:", req.body);

// //     const vendorProducts = req.body;

// //     // Process each vendor and their products
// //     await Promise.all(
// //       Object.keys(vendorProducts).map(async (vendorName) => {
// //         const products = vendorProducts[vendorName];
// //         let vendorEmails = null;

// //         // Process each product
// //         await Promise.all(
// //           products.map(async (product) => {
// //             try {
// //               if (!product.productId) {
// //                 console.warn("Product ID is missing:", product);
// //                 return;
// //               }

// //               // Ensure orderIds are in the correct format
// //               if (product.orderIds && Array.isArray(product.orderIds)) {
// //                 product.orderIds = product.orderIds.map(orderId => ({ id: orderId }));
// //               }

// //               // Add the product to the VendorOrder document
// //               await VendorOrder.updateOne(
// //                 {}, // Match all documents; adjust if you want to match specific documents
// //                 {
// //                   $push: { products: product },
// //                 },
// //                 {
// //                   upsert: true, // Create a new document if none matches
// //                   runValidators: true,
// //                 }
// //               );

// //               // Fetch vendor email only once per vendor
// //               if (!vendorEmails) {
// //                 const vendorDetails = await VendorProducts.findOne({
// //                   _id: product.displayVendorID,
// //                 });
// //                 if (vendorDetails) {
// //                   vendorEmails = vendorDetails.email;
// //                 }
// //               }
// //               console.log("Vendor email:", vendorEmails);
// //             } catch (err) {
// //               console.error("Error adding product to vendor order:", err);
// //               throw err;
// //             }
// //           })
// //         );

// //         // Send email with product details if vendor email is available
// //         if (vendorEmails) {
// //           const productDetails = products.map((p) => ({
// //             title: p.title,
// //             quantity: p.quantity,
// //             price: p.price,
// //             displayPrice: p.displayPrice,
// //             customer: p.userInfos.map((u) => ({
// //               name: u.name,
// //               contact: u.contact,
// //               email: u.email,
// //               address: u.address,
// //               city: u.city,
// //               country: u.country,
// //             })),
// //           }));

// //           const emailTemplate = generateEmailTemplate(
// //             vendorName,
// //             productDetails
// //           );

// //           const mailOptions = {
// //             from: process.env.EMAIL_USER, // Ensure this is a valid email address
// //             to: vendorEmails,
// //             subject: `Order Details for ${vendorName}`,
// //             html: emailTemplate,
// //           };

// //           const emailSuccess = await sendEmails(mailOptions);
// //           if (!emailSuccess) {
// //             console.error("Failed to send email");
// //           }
// //         }
// //       })
// //     );

// //     res.status(200).send({  
// //       message: "Products Added Successfully!",
// //     });
// //   } catch (err) {
// //     console.error("Error in vendor_orderadd:", err);
// //     res.status(500).send({
// //       message:
// //         err.message || "An error occurred while processing the products.",
// //     });
// //   }
// // };

// // const vendor_orderadd = async (req, res) => {
// //   try {
// //     console.log("Request body:", req.body);

// //     const vendorProducts = req.body;

// //     await Promise.all(
// //       Object.keys(vendorProducts).map(async (vendorName) => {
// //         const products = vendorProducts[vendorName];
// //         let vendorEmails = null;

// //         const productsToInsert = [];

// //         await Promise.all(
// //           products.map(async (product) => {
// //             try {
// //               if (!product.productId) {
// //                 console.warn("Product ID is missing:", product);
// //                 return;
// //               }

// //               // Ensure orderIds are in the correct format
// //               if (product.orderIds && Array.isArray(product.orderIds)) {
// //                 product.orderIds = product.orderIds.map(orderId => ({ id: orderId }));
// //               }

// //               // Add product to the array of products to be inserted
// //               productsToInsert.push(product);

// //               // Fetch vendor email only once per vendor
// //               if (!vendorEmails) {
// //                 const vendorDetails = await VendorProducts.findOne({
// //                   _id: product.displayVendorID,
// //                 });
// //                 if (vendorDetails) {
// //                   vendorEmails = vendorDetails.email;
// //                 }
// //               }
// //             } catch (err) {
// //               console.error("Error preparing product for vendor order:", err);
// //               // Handle the error but continue processing other products
// //             }
// //           })
// //         );

// //         // Insert all products for the current vendor
// //         if (productsToInsert.length > 0) {
// //           try {
// //             const result = await VendorOrder.updateOne(
// //               { _id: "your_vendor_order_id" }, // Make sure to specify the correct ID or criteria
// //               { $push: { products: { $each: productsToInsert } } },
// //               { upsert: true }
// //             );
// //             console.log("Products inserted:", result);
// //           } catch (err) {
// //             console.error("Error inserting products into VendorOrder:", err);
// //           }
// //         }

// //         if (vendorEmails) {
// //           const productDetails = productsToInsert.map((p) => ({
// //             title: p.title,
// //             quantity: p.quantity,
// //             price: p.price,
// //             displayPrice: p.displayPrice,
// //             customer: p.userInfos.map((u) => ({
// //               name: u.name,
// //               contact: u.contact,
// //               email: u.email,
// //               address: u.address,
// //               city: u.city,
// //               country: u.country,
// //             })),
// //           }));

// //           const emailTemplate = generateEmailTemplate(vendorName, productDetails);

// //           const mailOptions = {
// //             from: process.env.EMAIL_USER,
// //             to: vendorEmails,
// //             subject: `Order Details for ${vendorName}`,
// //             html: emailTemplate,
// //           };

// //           try {
// //             const emailSuccess = await sendEmails(mailOptions);
// //             if (!emailSuccess) {
// //               console.error("Failed to send email to:", vendorEmails);
// //             }
// //           } catch (err) {
// //             console.error("Error sending email:", err);
// //           }
// //         }
// //       })
// //     );

// //     res.status(200).send({
// //       message: "Products Added Successfully!",
// //     });
// //   } catch (err) {
// //     console.error("Error in vendor_orderadd:", err);
// //     res.status(500).send({
// //       message: err.message || "An error occurred while processing the products.",
// //     });
// //   }
// // };

// // const vendor_orderadd = async (req, res) => {
// //   try {
// //     console.log("Request body:", req.body);

// //     const vendorProducts = req.body;

// //     await Promise.all(
// //       Object.keys(vendorProducts).map(async (vendorName) => {
// //         const products = vendorProducts[vendorName];
// //         let vendorEmails = null;

// //         await Promise.all(
// //           products.map(async (product) => {
// //             try {
// //               if (!product.productId) {
// //                 console.warn("Product ID is missing:", product);
// //                 return;
// //               }
// //               if (product.orderIds && Array.isArray(product.orderIds)) {
// //                 product.orderIds = product.orderIds.map(orderId => ({ id: orderId }));
// //               }

// //               // Check if the product already exists in any VendorOrder document
// //               const existingOrder = await VendorOrder.findOne({
// //                 "products.productId": product.productId,
// //               });

// //               if (existingOrder) {
// //                 // Product exists, update the existing product
// //                 await VendorOrder.save(
// //                   { "products.productId": product.productId },
// //                   {
// //                     $set: {
// //                       "products.$.prices": product.prices,
// //                       "products.$.status": "unshow",
// //                       "products.$.image": product.image,
// //                       "products.$.tag": product.tag,
// //                       // "products.$.status": product.status,
// //                       "products.$.sku": product.sku,
// //                       "products.$.barcode": product.barcode,
// //                       "products.$.title": product.title,
// //                       "products.$.category": product.category,
// //                       "products.$.stock": product.stock,
// //                       "products.$.isCombination": product.isCombination,
// //                       "products.$.sales": product.sales,
// //                       "products.$.variant": product.variant,
// //                       "products.$.price": product.price,
// //                       "products.$.originalPrice": product.originalPrice,
// //                       "products.$.quantity": product.quantity,
// //                       "products.$.itemTotal": product.itemTotal,
// //                       "products.$.totalQuantity": product.totalQuantity,
// //                       "products.$.count": product.count,
// //                       "products.$.userInfos": product.userInfos,
// //                       "products.$.carts": product.carts,
// //                       "products.$.displayVendorID": product.displayVendorID,
// //                       "products.$.displayVendorName": product.displayVendorName,
// //                       "products.$.displayPrice": product.displayPrice,
// //                       'products.$.orderIds': product.orderIds,
// //                       "products.$.updatedAt": new Date(),
// //                     },
// //                   }
// //                 );
// //               } else {
// //                 // Product does not exist, add it to a new VendorOrder document
// //                 await VendorOrder.updateOne(
// //                   {},
// //                   {
// //                     $push: { products: product },
// //                   },
// //                   {
// //                     upsert: true,
// //                     runValidators: true,
// //                   }
// //                 );
// //               }

// //               // Fetch vendor email only once per vendor
// //               if (!vendorEmails) {
// //                 const vendorDetails = await VendorProducts.findOne({
// //                   _id: product.displayVendorID,
// //                 });
// //                 if (vendorDetails) {
// //                   vendorEmails = vendorDetails.email;
// //                 }
// //               }
// //               console.log("vendorEmailsvendorEmails", vendorEmails);
// //             } catch (err) {
// //               console.error("Error updating or creating vendor order:", err);
// //               throw err;
// //             }
// //           })
// //         );

// //         if (vendorEmails) {
// //           // Compose and send email with details of products and customers
// //           const productDetails = products.map((p) => ({
// //             title: p.title,
// //             quantity: p.quantity,
// //             price: p.price,
// //             displayPrice: p.displayPrice,
// //             customer: p.userInfos.map((u) => ({
// //               name: u.name,
// //               contact: u.contact,
// //               email: u.email,
// //               address: u.address,
// //               city: u.city,
// //               country: u.country,
// //             })),
// //           }));

// //           const emailTemplate = generateEmailTemplate(
// //             vendorName,
// //             productDetails
// //           );

// //           const mailOptions1 = {
// //             // from: `prasad@nextpagetechnologies.com`, // Ensure this is a valid email address
// //             from: process.env.EMAIL_USER,
// //             // to: `praveenkumar930316@gmail.com`,
// //             to: vendorEmails,
// //             // subject: `hi hello`,
// //             subject: `Order Details for ${vendorName}`,
// //             html: emailTemplate,
// //           };

// //           const emailSuccess = await sendEmails(mailOptions1);
// //           if (!emailSuccess) {
// //             console.log(`Failed to send email to ${vendorName}`);
// //           }
// //         }
// //       })
// //     );

// //     res.status(200).send({
// //       message: "Products Added/Updated Successfully!",
// //     });
// //   } catch (err) {
// //     console.error("Error in vendor_orderadd:", err);
// //     res.status(500).send({
// //       message:
// //         err.message || "An error occurred while processing the products.",
// //     });
// //   }
// // };






// // const vendor_orderadd = async (req, res) => {
// //   try {
// //     console.log("Request body:", req.body);
// //     const vendorProducts = req.body;

// //     await Promise.all(
// //       Object.keys(vendorProducts).map(async (vendorName) => {
// //         const products = vendorProducts[vendorName];
// //         await Promise.all(
// //           products.map(async (product) => {
// //             try {
// //               if (!product.productId) {
// //                 console.warn("Product ID is missing:", product);
// //                 return;
// //               }

// //               const productId = mongoose.Types.ObjectId(product.productId);
// //               console.log("Processing product with ID:", productId);

// //               const existingOrder = await VendorOrder.findOne({ 'products.displayVendorID': product.displayVendorID });

// //               if (existingOrder) {
// //                 console.log(`Existing order found for vendorID: ${product.displayVendorID}`);

// //                 // Check for duplicate userInfos within the product
// //                 const existingProduct = existingOrder.products.find(p => p.productId.toString() === productId.toString());
// //                 if (existingProduct) {
// //                   // Merge userInfos or handle duplicates as needed
// //                   product.userInfos.forEach(userInfo => {
// //                     if (!existingProduct.userInfos.some(u => u.email === userInfo.email)) {
// //                       existingProduct.userInfos.push(userInfo);
// //                     }
// //                   });
// //                 } else {
// //                   existingOrder.products.push(product);
// //                 }

// //                 await existingOrder.save();
// //                 console.log("Successfully updated existing order");
// //               } else {
// //                 console.log(`No existing order found, creating new order for productId: ${productId}`);
// //                 const newOrder = new VendorOrder({
// //                   products: [product],
// //                 });
// //                 await newOrder.save();
// //                 console.log("Successfully created new order");
// //               }

// //             } catch (error) {
// //               console.error(`Error processing product ${product.productId}:`, error);
// //             }
// //           })
// //         );
// //       })
// //     );

// //     res.status(200).send({ message: "Vendor orders processed successfully" });
// //   } catch (error) {
// //     console.error("Error processing vendor orders:", error);
// //     res.status(500).send({ message: "Error processing vendor orders" });
// //   }
// // };





// // const vendor_orderadd = async (req, res) => {
// //   try {
// //     console.log("Request body:", req.body);

// //     const vendorProducts = req.body;

// //     await Promise.all(Object.keys(vendorProducts).map(async (vendorName) => {
// //         const products = vendorProducts[vendorName];
// //         let vendorEmails = null;

// //         await Promise.all(
// //           products.map(async (product) => {
// //             try {
// //               if (!product.productId) {
// //                 console.warn("Product ID is missing:", product);
// //                 return;
// //               }
// //               if (product.orderIds && Array.isArray(product.orderIds)) {
// //                 product.orderIds = product.orderIds.map(orderId => ({ id: orderId }));
// //               }

// //               // Check if the product already exists in any VendorOrder document
// //               const existingOrder = await VendorOrder.findOne({
// //                 "products.productId": product.productId,
// //               });

// //               if (existingOrder) {
// //                 // Product exists, update the existing product
// //                 await VendorOrder.updateOne(
// //                   { "products.productId": product.productId },
// //                   {
// //                     $set: {
// //                       "products.$.prices": product.prices,
// //                       "products.$.status": "unshow",
// //                       "products.$.image": product.image,
// //                       "products.$.tag": product.tag,
// //                       // "products.$.status": product.status,
// //                       "products.$.sku": product.sku,
// //                       "products.$.barcode": product.barcode,
// //                       "products.$.title": product.title,
// //                       "products.$.category": product.category,
// //                       "products.$.stock": product.stock,
// //                       "products.$.isCombination": product.isCombination,
// //                       "products.$.sales": product.sales,
// //                       "products.$.variant": product.variant,
// //                       "products.$.price": product.price,
// //                       "products.$.originalPrice": product.originalPrice,
// //                       "products.$.quantity": product.quantity,
// //                       "products.$.itemTotal": product.itemTotal,
// //                       "products.$.totalQuantity": product.totalQuantity,
// //                       "products.$.count": product.count,
// //                       "products.$.userInfos": product.userInfos,
// //                       "products.$.carts": product.carts,
// //                       "products.$.displayVendorID": product.displayVendorID,
// //                       "products.$.displayVendorName": product.displayVendorName,
// //                       "products.$.displayPrice": product.displayPrice,
// //                       'products.$.orderIds': product.orderIds,
// //                       "products.$.updatedAt": new Date(),
// //                     },
// //                   }
// //                 );
// //               } else {
// //                 // Product does not exist, add it to a new VendorOrder document
// //                 await VendorOrder.updateOne(
// //                   {},
// //                   {
// //                     $push: { products: product },
// //                   },
// //                   {
// //                     upsert: true,
// //                     runValidators: true,
// //                   }
// //                 );
// //               }

// //               // Fetch vendor email only once per vendor
// //               if (!vendorEmails) {
// //                 const vendorDetails = await VendorProducts.findOne({
// //                   _id: product.displayVendorID,
// //                 });
// //                 if (vendorDetails) {
// //                   vendorEmails = vendorDetails.email;
// //                 }
// //               }
// //               console.log("vendorEmailsvendorEmails", vendorEmails);
// //             } catch (err) {
// //               console.error("Error updating or creating vendor order:", err);
// //               throw err;
// //             }
// //           })
// //         );

// //         if (vendorEmails) {
// //           // Compose and send email with details of products and customers
// //           const productDetails = products.map((p) => ({
// //             title: p.title,
// //             quantity: p.quantity,
// //             price: p.price,
// //             displayPrice: p.displayPrice,
// //             customer: p.userInfos.map((u) => ({
// //               name: u.name,
// //               contact: u.contact,
// //               email: u.email,
// //               address: u.address,
// //               city: u.city,
// //               country: u.country,
// //             })),
// //           }));

// //           const emailTemplate = generateEmailTemplate(
// //             vendorName,
// //             productDetails
// //           );

// //           const mailOptions1 = {
// //             // from: `prasad@nextpagetechnologies.com`, // Ensure this is a valid email address
// //             from: process.env.EMAIL_USER,
// //             // to: `praveenkumar930316@gmail.com`,
// //             to: vendorEmails,
// //             // subject: `hi hello`,
// //             subject: `Order Details for ${vendorName}`,
// //             html: emailTemplate,
// //           };

// //           const emailSuccess = await sendEmails(mailOptions1);
// //           if (!emailSuccess) {
// //             console.log(`Failed to send email to ${vendorName}`);
// //           }
// //         }
// //       })
// //     );

// //     res.status(200).send({
// //       message: "Products Added/Updated Successfully!",
// //     });
// //   } catch (err) {
// //     console.error("Error in vendor_orderadd:", err);
// //     res.status(500).send({
// //       message:
// //         err.message || "An error occurred while processing the products.",
// //     });
// //   }
// // };


// const vendor_orderadd = async (req, res) => {
//   try {

//     let venders = Object.values(req.body)

//     console.log("Request body:", venders);


//     const vendorProducts = req.body;

//     // Create a map to store vendor details
//     const vendorDetailsMap = {};

//     // Collect all unique vendor IDs from the products
//     const vendorIDs = new Set();
//     Object.keys(vendorProducts).forEach(vendorName => {
//       vendorProducts[vendorName].forEach(product => {
//         if (product.displayVendorID) {
//           vendorIDs.add(product.displayVendorID);
//         }
//       });
//     });

//     console.log("Unique Vendor IDs:", Array.from(vendorIDs));

//     // Fetch vendor details in parallel
//     await Promise.all(
//       Array.from(vendorIDs).map(async (vendorID) => {
//         const vendorDetails = await VendorProducts.findOne({ _id: vendorID });
//         if (vendorDetails) {
//           vendorDetailsMap[vendorID] = vendorDetails.email;
//         } else {
//           console.warn(`Vendor with ID ${vendorID} not found.`);
//           vendorDetailsMap[vendorID] = null; // Handle case where vendor email is not found
//         }
//       })
//     );

//     console.log("Vendor details map:", vendorDetailsMap);

//     // Process each vendor's products
//     await Promise.all(
//       Object.keys(vendorProducts).map(async (vendorName) => {
//         const products = vendorProducts[vendorName];
//         const orders = {};

//         // Group products by order ID
//         products.forEach((product) => {
//           if (!product._id) {
//             product.productId=mongoose.Types.ObjectId.isValid(productId.trim())

//             console.warn("Product ID is missing:", product);
//             return;
//           }
//           if (!product.orderIds) {
//             console.warn("Order ID is missing:", product);
//             return;
//           }
//           if (!orders[product.orderIds]) {
//             orders[product.orderIds] = [];
//           }
//           orders[product.orderIds].push(product);
//         });

//         console.log(`Orders for vendor ${vendorName}:`, orders);

//         // Fetch the vendor email for the vendor of these products
//         const firstProduct = products[0];
//         const vendorEmail = vendorDetailsMap[firstProduct.displayVendorID];

//         // Create a VendorOrder document for each order ID
//         await Promise.all(
//           Object.keys(orders).map(async (orderId) => {
//             const orderProducts = orders[orderId];
//             console.log(`Creating VendorOrder for vendor: ${vendorName}, orderId: ${orderId}, products: ${JSON.stringify(orderProducts)}`);
//             await VendorOrder.create({
//               vendorName,
//               orderId,
//               products: orderProducts,
//             });
//             console.log(`Added ${orderProducts.length} products for vendor: ${vendorName} and order: ${orderId}`);
//           })
//         );

//         // Send email if vendor email exists
//         if (vendorEmail) {
//           const productDetails = products.map((p) => ({
//             title: p.title,
//             quantity: p.quantity,
//             price: p.price,
//             displayPrice: p.displayPrice,
//             customer: p.userInfos.map((u) => ({
//               name: u.name,
//               contact: u.contact,
//               email: u.email,
//               address: u.address,
//               city: u.city,
//               country: u.country,
//             })),
//           }));

//           const emailTemplate = generateEmailTemplate(vendorName, productDetails);

//           const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: vendorEmail,
//             subject: `Order Details for ${vendorName}`,
//             html: emailTemplate,
//           };

//           const emailSuccess = await sendEmails(mailOptions);
//           if (!emailSuccess) {
//             console.error('Failed to send email to:', vendorEmail);
//           }
//         }
//       })
//     );

//     res.status(200).send({
//       message: "Products Added Successfully!",
//     });
//   } catch (err) {
//     console.error("Error in vendor_orderadd:", err);
//     res.status(500).send({
//       message: err.message || "An error occurred while processing the products.",
//     });
//   }
// };




// // Placeholder function for sending an email - replace with actual email sending logic
// const sendEmailToVendor = async (email, vendorName, productDetails) => {
//   // Implement your email sending logic here using a library like nodemailer

//   // console.log(`Sending email to ${email} for vendor ${vendorName} with details:`, productDetails);

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: `Hello ${vendorName}`,
//     text: `Your Orders are ${productDetails}`,
//   };

//   // const mailAdminOptions = {
//   //   from: process.env.EMAIL_USER,
//   //   // to: process.env.EMAIL_USER,
//   //   to: 'saip8129@gmail.com',

//   //   subject: `${name}`,
//   //   text: `Dear Admin,\n\n${name} (${email}, ${contact}) has tried to reach us.`,
//   //   html: `
//   //   <h3>New Contact Form Submission</h3>
//   //   <table border="1" style="border-collapse: collapse; width: 100%;">
//   //     <tr>
//   //       <td style="padding: 8px; text-align: left;"><strong>Name</strong></td>
//   //       <td style="padding: 8px; text-align: left;">${name}</td>
//   //     </tr>
//   //     <tr>
//   //       <td style="padding: 8px; text-align: left;"><strong>Email</strong></td>
//   //       <td style="padding: 8px; text-align: left;">${email}</td>
//   //     </tr>
//   //     <tr>
//   //       <td style="padding: 8px; text-align: left;"><strong>Contact</strong></td>
//   //       <td style="padding: 8px; text-align: left;">${contact}</td>
//   //     </tr>
//   //   </table>
//   // `,
//   // };

//   try {
//     const success = await sendEmails(mailOptions);
//     if (success) {
//       res.status(200).send("Emails sent successfully.");
//       console.log("successful");
//     } else {
//       res.status(500).send("Failed to send emails.");
//       console.log("error");
//     }
//   } catch (error) {
//     console.error("Error sending emails:", error.message);
//     res.status(500).send(`Failed to send emails: ${error.message}`);
//   }
// };

// const vendor_orderget = async (req, res) => {
//   try {
//     const vendors = await VendorOrder.find({}).sort({ _id: -1 });
//     console.log("vendorsvendors", vendors);
//     res.send(vendors);
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

// // const vendor_ordergetId = async (req, res) => {
// //   try {
// //     const { vendorId } = req.body;
// //     console.log("req.body123:", req.body);

// //     const Vendordata = await VendorOrder.findById(vendorId);
// //     console.log("Vendordata", Vendordata);

// //     // const vendors = await VendorOrder.find({}).sort({ _id: -1 });
// //     // console.log("vendorsvendors", vendors);
// //     // res.send(vendors);
// //   } catch (err) {
// //     res.status(500).send({ message: err.message });
// //   }
// // };
// const vendor_ordergetId = async (req, res) => {
//   try {
//     const { vendorId } = req.body;
//     console.log("Requested vendorId:", vendorId);

//     // Fetch vendor data by vendorId
//     const vendorData = await VendorOrder.find({
//       "products.displayVendorID": vendorId
//     }).exec();
//     console.log("vendorData111", vendorData);

//     // Check if data is found
//     if (!vendorData || vendorData.length === 0) {
//       return res.status(404).send({ message: "No orders found for the given vendor." });
//     }

//     // Extract product details and customer details
//     const productDetails = [];
//     const customerDetails = new Set(); // Using Set to avoid duplicate customers

//     vendorData.forEach(order => {
//       order.products.forEach(product => {
//         if (product.displayVendorID === vendorId) {
//           // Count the total quantity of products assigned to the vendor
//           const productCount = product.quantity;

//           // Extract product and customer details
//           productDetails.push({
//             title: product.title,
//             quantity: productCount,
//             price: product.price
//           });

//           product.userInfos.forEach(user => {
//             customerDetails.add({
//               name: user.name,
//               contact: user.contact,
//               email: user.email,
//               address: user.address,
//               city: user.city,
//               country: user.country
//             });
//           });
//         }
//       });
//     });

//     // Format response data
//     const responseData = {
//       vendorId,
//       totalProducts: productDetails.length,
//       products: productDetails,
//       customers: Array.from(customerDetails)
//     };

//     console.log("Response Data:", responseData);
//     res.status(200).send(responseData);

//   } catch (err) {
//     console.error("Error in vendor_ordergetId:", err);
//     res.status(500).send({ message: err.message });
//   }
// };


// // const emailSend = async (req, res) => {
// //   console.log("Request received");

// //   const { email, name, contact } = req.body;
// //   console.log("Request body:", { email, name, contact });

// //   const mailOptions = {
// //     from: process.env.EMAIL_USER,
// //     to: email,
// //     subject: `Hello ${name}`,
// //     text: `Thank you, ${name}, for contacting Safe Food. We will get back to you later.`,
// //   };

// //   const mailAdminOptions = {
// //     from: process.env.EMAIL_USER,
// //     // to: process.env.EMAIL_USER,
// //     to: 'saip8129@gmail.com',

// //     subject: `${name}`,
// //     text: `Dear Admin,\n\n${name} (${email}, ${contact}) has tried to reach us.`,
// //     html: `
// //     <h3>New Contact Form Submission</h3>
// //     <table border="1" style="border-collapse: collapse; width: 100%;">
// //       <tr>
// //         <td style="padding: 8px; text-align: left;"><strong>Name</strong></td>
// //         <td style="padding: 8px; text-align: left;">${name}</td>
// //       </tr>
// //       <tr>
// //         <td style="padding: 8px; text-align: left;"><strong>Email</strong></td>
// //         <td style="padding: 8px; text-align: left;">${email}</td>
// //       </tr>
// //       <tr>
// //         <td style="padding: 8px; text-align: left;"><strong>Contact</strong></td>
// //         <td style="padding: 8px; text-align: left;">${contact}</td>
// //       </tr>
// //     </table>
// //   `,
// //   };

// //   try {
// //     const success = await sendEmails(mailOptions, mailAdminOptions);
// //     if (success) {
// //       res.status(200).send("Emails sent successfully.");
// //       console.log("successful")
// //     } else {
// //       res.status(500).send("Failed to send emails.");
// //       console.log("error");
// //     }
// //   } catch (error) {
// //     console.error("Error sending emails:", error.message);
// //     res.status(500).send(`Failed to send emails: ${error.message}`);
// //   }
// // };

// module.exports = {
//   vendor_orderadd,
//   vendor_orderget,
//   vendor_ordergetId
//   // emailSend,
// };




const mongoose = require('mongoose');
const VendorOrder = require("../models/vendorOrder");
// const Ordernew = require("../models/ordersnew");
const VendorProducts = require("../models/vendor_products");
const nodemailer = require("nodemailer");


// Validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Send emails using nodemailer
const sendEmails = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER_NAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    
    if (!mailOptions.from || !validateEmail(mailOptions.from)) {
      throw new Error("Invalid MAIL FROM address provided");
    }
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

// Generate the email template for vendors
const generateEmailTemplate = (vendorName, productDetails) => {
  const productRows = productDetails.map(p => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${p.title}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${p.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${p.price}</td>
    </tr>
    ${p.customer.map(c => `
      <tr>
        <td colspan="3" style="border: 1px solid #ddd; padding: 8px;">
          <strong>Customer:</strong> ${c.name} - ${c.contact}, ${c.email}<br>
          <strong>Address:</strong> ${c.address}, ${c.city}, ${c.country}
        </td>
      </tr>
    `).join('')}
  `).join('');

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
        ${productRows}
      </tbody>
    </table>
  `;
};

// Function to add vendor orders
const vendor_orderadd = async (req, res) => {
  try {
    const vendorProducts = req.body;

    // Validate request body structure
    if (typeof vendorProducts !== 'object' || !Object.keys(vendorProducts).length) {
      return res.status(400).send({ message: 'Invalid vendorProducts structure.' });
    }

    // Collect vendor emails and create VendorOrder entries
    await Promise.all(
      Object.keys(vendorProducts).map(async (vendorName) => {
        const products = vendorProducts[vendorName];
        if (!Array.isArray(products)) {
          console.error(`Invalid products data for vendor: ${vendorName}`);
          return;
        }

        // Store vendor email
        let vendorEmails = null;

        await Promise.all(
          products.map(async (product) => {
            try {
              // Fetch vendor email if not already fetched
              if (!vendorEmails) {
                const vendorDetails = await VendorProducts.findOne({
                  '_id': product.displayVendorID,
                  
                });
                if (vendorDetails) {
                  vendorEmails = vendorDetails.email;
                }
              }

              // Create the VendorOrder entry
              await VendorOrder.create({
                vendorName,
                orderId: product.orderIds,
                products: {
                  productId: mongoose.Types.ObjectId(product._id.trim()),
                  title: product.title,
                  quantity: product.quantity,
                  price: product.price,
                  displayPrice: product.displayPrice,
                  displayVendorID:product.displayVendorID,
                  userInfos: product.userInfos,
                  invoice: product.invoice,
                },
              });

            } catch (error) {
              console.error(`Failed to insert VendorOrder for product ID ${product._id}:`, error);
            }
          })
        );



        // Send email with product details if vendor email is available
        if (vendorEmails) {
          const productDetails = products.map((p) => ({
            title: p.title,
            quantity: p.quantity,
            price: p.price,
            displayPrice: p.displayPrice,
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

          const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: vendorEmails,
            subject: `Order Details for ${vendorName}`,
            html: emailTemplate,
          };

          const emailSuccess = await sendEmails(mailOptions);
          if (!emailSuccess) {
            console.error("Failed to send email to vendor:", vendorEmails);
          }
        }
      })
    );

    res.status(200).send({
      message: "Products Added Successfully!",
    });
  } catch (err) {
    console.error("Error in vendor_orderadd:", err);
    res.status(500).send({
      message: err.message || "An error occurred while processing the products.",
    });
  }
};

// Function to get all vendor orders
const vendor_orderget = async (req, res) => {
  try {
    const vendorOrders = await VendorOrder.find();
    res.status(200).json(vendorOrders);
  } catch (err) {
    console.error("Error in vendor_orderget:", err);
    res.status(500).send({
      message: err.message || "An error occurred while fetching vendor orders.",
    });
  }
};

// Function to get vendor order by ID
const vendor_ordergetId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid ID format.' });
    }

    const vendorOrder = await VendorOrder.findById(id);

    if (!vendorOrder) {
      return res.status(404).send({ message: 'Vendor order not found.' });
    }

    res.status(200).json(vendorOrder);
  } catch (err) {
    console.error("Error in vendor_ordergetId:", err);
    res.status(500).send({
      message: err.message || "An error occurred while fetching the vendor order.",
    });
  }
};

// Function to handle email sending for contact forms
const emailSend = async (req, res) => {
  console.log("Request received");

  const { email, name, contact } = req.body;
  console.log("Request body:", { email, name, contact });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Hello ${name}`,
    text: `Thank you, ${name}, for contacting us. We will get back to you soon.`,
  };

  const mailAdminOptions = {
    from: process.env.EMAIL_USER,
    to: 'rameshsoppari8@gmail.com',
    subject: `New Contact Form Submission: ${name}`,
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
    const userSuccess = await sendEmails(mailOptions);
    const adminSuccess = await sendEmails(mailAdminOptions);

    if (userSuccess && adminSuccess) {
      res.status(200).send("Emails sent successfully.");
    } else {
      res.status(500).send("Failed to send emails.");
    }
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send("An error occurred while sending emails.");
  }
};

module.exports = {
  vendor_orderadd,
  vendor_orderget,
  vendor_ordergetId,
  emailSend,
};









