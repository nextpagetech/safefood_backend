const mongoose = require("mongoose");
const Vendor_product = require("../models/vendor_products");
const Vendor_order = require("../models/vendorOrder");
const Product = require("../models/Product");
const { languageCodes } = require("../utils/data");
const Order = require("../models/Order");
const Ordernew = require("../models/ordersnew");
const admin = require("../models/Admin")

const vendor_productadd = async (req, res) => {
  try {

    const newVendor_product = new Vendor_product(req.body);
    await newVendor_product.save();
    res.status(200).send({
      message: "Vendor Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const getvendor_IdOrderDetails = async (req, res) => {
//   try {
//     const { displayVendorID } = req.body;
//     console.log("displayVendorID:", displayVendorID);

//     const vendorOrder = await Vendor_order.find({
//       'products.displayVendorID': displayVendorID,
//     });

//     if (!vendorOrder) {
//       return res.status(404).send({
//         message: "Vendor Order Details Not Found!",
//       });
//     }

//     let allOrderIds = [];
//     let totalVendorOrderAmount = 0;
//     const orderDetailsMap = {};
//     console.log("vendorOrder", vendorOrder)
//     // Iterate over the products in the vendor order to calculate totals and collect order IDs
//     vendorOrder.forEach(product => {
//       if (product.products.displayVendorID === displayVendorID) {
//         product.orderId.forEach(order => {
//           const orderId = order;

//           // If the orderId isn't in the map yet, initialize it
//           if (!orderDetailsMap[orderId]) {
//             orderDetailsMap[orderId] = {
//               orderId: orderId,
//               products: [],
//               orderTotal: 0,
//             };
//             allOrderIds.push(orderId); // Collect all order IDs
//           }

//           // Calculate the total amount for this product
//           const productTotal = product.products.displayPrice * product.products.quantity;
//           totalVendorOrderAmount += productTotal;

//           // Add product details to the specific order
//           orderDetailsMap[orderId].products.push({
//             title: product.title,
//             price: product.displayPrice,
//             quantity: product.quantity,
//             total: productTotal,
//           });

//           // Add the product total to the order total
//           orderDetailsMap[orderId].orderTotal += productTotal;
//         });

//         // console.log(Order IDs for product: ${product.title}, product.orderIds.map(order => order.id));
//       }
//     });

//     // Fetch the details of all orders using the collected order IDs
//     const fetchedOrders = await Ordernew.find({ _id: { $in: allOrderIds } });

//     // Map order details to each order in the response
//     const orderDetails = fetchedOrders.map(order => ({
//       ...orderDetailsMap[order._id.toString()],
//       orderInfo: order,
//     }));

//     console.log("Order Details:", orderDetails);
//     console.log("Total Vendor Order Amount:", totalVendorOrderAmount);

//     res.status(200).send({
//       message: "Vendor Order Details Found Successfully!",
//       orderDetails, // Send the products grouped by order with their respective details
//       totalAmount: totalVendorOrderAmount, // Include the calculated total amount
//     });
//   } catch (err) {
//     console.error("Error fetching vendor order details:", err);
//     res.status(500).send({
//       message: "An error occurred while fetching vendor order details.",
//       error: err.message,
//     });
//   }
// };


const getvendor_IdOrderDetails = async (req, res) => {
  try {
    const { displayVendorID } = req.body;
    console.log("displayVendorID:", displayVendorID);

    const vendorOrder = await Vendor_order.find({
      'products.displayVendorID': displayVendorID,
    });

    if (!vendorOrder || vendorOrder.length === 0) {
      return res.status(404).send({
        message: "Vendor Order Details Not Found!",
      });
    }

    let allOrderIds = [];
    let totalVendorOrderAmount = 0;
    const orderDetailsMap = {};
    console.log("vendorOrder", vendorOrder);

    // Iterate over the products in the vendor order to calculate totals and collect order IDs
    vendorOrder.forEach((product) => {
      if (product.products.displayVendorID === displayVendorID) {
        product.orderId.forEach((order) => {
          const orderId = order;

          // If the orderId isn't in the map yet, initialize it
          if (!orderDetailsMap[orderId]) {
            orderDetailsMap[orderId] = {
              orderId: orderId,
              products: [],
              orderTotal: 0,
            };
            allOrderIds.push(orderId); // Collect all order IDs
          }

          // Calculate the total amount for this product
          const productTotal = product.products.displayPrice * product.products.quantity;
          totalVendorOrderAmount += productTotal;

          // Add product details to the specific order
          orderDetailsMap[orderId].products.push({
            title: product.products.title,
            price: product.products.displayPrice,
            quantity: product.products.quantity,
            total: productTotal,
          });

          // Add the product total to the order total
          orderDetailsMap[orderId].orderTotal += productTotal;
        });
      }
    });

    // Fetch the details of all orders using the collected order IDs
    const fetchedOrders = await Ordernew.find({ _id: { $in: allOrderIds } });

    // Map order details to each order in the response
    const orderDetails = fetchedOrders.map((order) => ({
      ...orderDetailsMap[order._id.toString()],
      orderInfo: order,
    }));

    // Generate invoice details
    const invoices = orderDetails.map((order) => generateInvoice(order));

    console.log("Order Details:", orderDetails);
    console.log("Total Vendor Order Amount:", totalVendorOrderAmount);

    res.status(200).send({
      message: "Vendor Order Details Found Successfully!",
      orderDetails, // Send the products grouped by order with their respective details
      totalAmount: totalVendorOrderAmount, // Include the calculated total amount
      invoices, // Include the generated invoices
    });
  } catch (err) {
    console.error("Error fetching vendor order details:", err);
    res.status(500).send({
      message: "An error occurred while fetching vendor order details.",
      error: err.message,
    });
  }
};

// Function to generate an invoice for an order
const generateInvoice = (order) => {
  const { orderId, products, orderTotal, orderInfo } = order;

  // Define the invoice structure
  const invoice = {
    invoiceNumber: `INV-${orderId}`, // Generate a unique invoice number using order ID
    orderId: orderId,
    orderDate: orderInfo.orderDate, // Example field from order information
    vendor: orderInfo.vendorName, // Add the vendor name from order details
    items: products.map((product) => ({
      title: product.title,
      price: product.price,
      quantity: product.quantity,
      total: product.total,
    })),
    subtotal: orderTotal,
    tax: calculateTax(orderTotal), // Optionally, add a tax calculation
    totalAmount: orderTotal + calculateTax(orderTotal),
  };

  return invoice;
};

// Optional function to calculate tax
const calculateTax = (amount) => {
  const taxRate = 0.1; // 10% tax rate
  return amount * taxRate;
};







const vendor_productmapadd = async (req, res) => {
  try {
    const { vendorId, products } = req.body;

    if (!vendorId) {
      return res.status(400).send({ message: "vendorId is required!" });
    }

    if (!Array.isArray(products)) {
      return res.status(400).send({ message: "Products must be an array!" });
    }

    // Validate each product item
    for (const product of products) {
      if (!mongoose.Types.ObjectId.isValid(product.productId)) {
        return res
          .status(400)
          .send({ message: `Invalid productId: ${product.productId}` });
      }

      if (typeof product.title !== "object") {
        return res
          .status(400)
          .send({ message: "Product title must be an object!" });
      }

      if (product.prices) {
        if (
          typeof product.prices.price !== "number" ||
          typeof product.prices.originalPrice !== "number"
        ) {
          return res
            .status(400)
            .send({ message: "Product prices must be numbers!" });
        }
      }
    }

    const vendorProduct = await Vendor_product.findById(vendorId);

    if (!vendorProduct) {
      return res.status(404).send({ message: "Vendor not found!" });
    }

    // Create a map of existing products for quick lookup
    const existingProductsMap = new Map(
      vendorProduct.products.map((p) => [p.productId.toString(), p])
    );

    // Update existing products and add new ones
    for (const product of products) {
      if (existingProductsMap.has(product.productId)) {
        // Update the existing product
        const existingProduct = existingProductsMap.get(product.productId);
        existingProduct.title = product.title;
        existingProduct.prices = product.prices;
      } else {
        // Add the new product
        vendorProduct.products.push(product);
      }
    }

    const updatedVendorProduct = await vendorProduct.save();

    res.send({
      _id: updatedVendorProduct._id,
      products: updatedVendorProduct.products,
      message: "Vendor Updated Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while updating the vendor product.",
      error: err.message,
    });
  }
};



const vendor_productmapaddupdate = async (req, res) => {
  try {
    const { vendorId, products } = req.body;

    if (!vendorId) {
      return res.status(400).send({ message: "vendorId is required!" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).send({ message: "products array is required and should not be empty!" });
    }

    // Attempt to fetch the vendor data
    let vendordata = null;
    try {
      vendordata = await admin.findById(vendorId);
    } catch (error) {
      // Handle the case where vendordata cannot be retrieved
    }

    let vendorProduct = await Vendor_product.findById(vendorId);

    if (!vendorProduct) {
      // Vendor not found, create a new one
      vendorProduct = new Vendor_product({
        _id: vendorId,
        products: [],
      });
    } else {
      // Vendor found, clear existing products
      vendorProduct.products = [];
    }

    // Add the new products to the vendor's product list
    products.forEach(({ productId, stock, prices, title, variants }) => {
      if (!productId) {
        throw new Error("productId is required!");
      }

      vendorProduct.products.push({
        productId,
        stock,
        prices,
        title,
        variants,
        status: "unshow",
      });
    });

    // If vendordata exists, update the vendor's email and name
    if (vendordata) {
      vendorProduct.email = vendordata.email || vendorProduct.email; // Update only if email exists
      vendorProduct.name = vendordata.name || vendorProduct.name; // Update only if name exists
    }

    // Save the updated or newly created vendor product mapping
    const updatedVendorProduct = await vendorProduct.save();

    const response = {
      _id: updatedVendorProduct._id,
      products: updatedVendorProduct.products,
      message: "Vendor products updated successfully!",
    };

    if (vendordata) {
      response.email = vendordata.email;
      response.name = vendordata.name;
    }

    res.send(response);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({
        message: "Duplicate email error. The email must be unique.",
        error: err.message,
      });
    }
    res.status(500).send({
      message: "An error occurred while updating the vendor products.",
      error: err.message,
    });
  }
};




const getAllvendor_product = async (req, res) => {
  try {
    const vendors = await Vendor_product.find({}).sort({ _id: -1 });
    res.send(vendors);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


const getVenodrnamebyProductId = async (req, res) => {
  try {
    let productIds = req.query.productIds.split(',');
    const vendors = await Vendor_product.find({}).sort({ _id: -1 });
    const productVendorDetails = productIds.map(pid => {
      const vendorsWithProduct = vendors
        .map(vendor => {
          const product = vendor.products.find(product => product.productId.toString() === pid);
          return product ? {
            vendorId: vendor._id,
            vendorName: vendor.name,
            price: product.prices.price,
            updatedAt: vendor.updatedAt,
            productId: product.productId.toString()
          } : null;
        })
        .filter(vendor => vendor !== null);

      if (vendorsWithProduct.length === 0) {
        return { productId: pid, lowestPriceVendor: null };
      }
      const lowestPriceVendor = vendorsWithProduct.reduce((prev, curr) => {
        return prev.price < curr.price ? prev : curr;
      });
      return {
        productId: pid,
        vendors: vendorsWithProduct,
        lowestPriceVendor: {
          vendorId: lowestPriceVendor.vendorId,
          vendorName: lowestPriceVendor.vendorName,
          price: lowestPriceVendor.price,
          updatedAt: lowestPriceVendor.updatedAt
        }
      };
    });
    res.status(200).send(productVendorDetails);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};



const getvendor_productId = async (req, res) => {
  try {
    const customer = await Vendor_product.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};


const vendorDetailsByProductIds = async (req, res) => {
  try {
    const { productIds } = req.body;


    // Fetch all vendor products
    const vendorProducts = await Vendor_product.find({}).sort({ _id: -1 });


    // Filter the vendor products to include only those that have the product IDs provided
    const filteredVendorProducts = vendorProducts.filter((vendorProduct) => {

      return vendorProduct.products.some((product) => {
        return productIds.includes(product.productId.toString());
      });
    });


    if (filteredVendorProducts.length === 0) {
      return res
        .status(404)
        .send({
          message: "No vendor products found for the given product IDs.",
        });
    }

    const vendorDetails = filteredVendorProducts.map((vendorProduct) => {
      const matchingProducts = vendorProduct.products.filter((product) =>
        productIds.includes(product.productId.toString())
      );

      return {
        vendor: {
          _id: vendorProduct._id,
          name: vendorProduct.name,
          email: vendorProduct.email,
          phone: vendorProduct.phone,
          image: vendorProduct.image,
          status: vendorProduct.status,
        },
        products: matchingProducts,
      };
    });

    res.send(vendorDetails);
  } catch (err) {
    res.status(500).send({
      message:
        "An error occurred while fetching vendor details by product IDs.",
      error: err.message,
    });
  }
};

const getFpoqunatity = async (req, res) => {
  try {
    const { productIds } = req.body;

    // Fetch all orders sorted by _id in descending order
    const orders = await Order.find({}).sort({ _id: -1 });

    // Iterate through orders to find matches
    const matchingOrders = orders.filter((order) =>
      order.cart.some((cartItem) =>
        productIds.includes(cartItem._id.toString())
      )
    );

    if (matchingOrders.length === 0) {
      return res.status(404).send({
        message: "No orders found with matching product IDs.",
      });
    }

    // Prepare the response with the matching orders' details
    const response = matchingOrders.map((order) => ({
      orderId: order._id,
      user_info: {
        name: order.user_info.name,
        email: order.user_info.email,
        phone: order.user_info.contact,
        address: order.user_info.address,
        city: order.user_info.city,
        country: order.user_info.country,
        zipCode: order.user_info.zipCode,
      },
      cart: order.cart,
    }));

    res.status(200).send(response);
  } catch (err) {
    res.status(500).send({
      message:
        "An error occurred while fetching vendor details by product IDs.",
      error: err.message,
    });
  }
};

// const getFpoqunatity = async (req, res) => {
//   try {
//     const { productIds } = req.body;
//     console.log("productIdsorder", productIds);
//     const orders = await Order.find({}).sort({ _id: -1 });
//     console.log("orders", orders);
//     const filteredOrderProducts = orders.filter(vendorProduct => {
//       console.log("vendorProduct", vendorProduct.cart[0]._id);
//       return vendorProduct.products.some(product => {
//         console.log("product.productId", product.productId.toString());
//         return productIds.includes(product.productId.toString());
//       });
//     });

//     console.log("filteredVendorProducts", filteredVendorProducts);
//     if (filteredVendorProducts.length === 0) {
//       return res.status(404).send({ message: "No vendor products found for the given product IDs." });
//     }
//     const vendorDetails = filteredVendorProducts.map(vendorProduct => {
//       const matchingProducts = vendorProduct.products.filter(product =>
//         productIds.includes(product.productId.toString())
//       );

//       return {
//         vendor: {
//           _id: vendorProduct._id,
//           name: vendorProduct.name,
//           email: vendorProduct.email,
//           phone: vendorProduct.phone,
//           image: vendorProduct.image,
//           status: vendorProduct.status,
//         },
//         products: matchingProducts
//       };
//     });

//     res.send(vendorDetails);
//   } catch (err) {
//     console.error("Error:", err.message);
//     res.status(500).send({
//       message: "An error occurred while fetching vendor details by product IDs.",
//       error: err.message,
//     });
//   }
// };


const updatevendor_product = async (req, res) => {
  try {
    const vendorProduct = await Vendor_product.findById(req.params.id);
    if (vendorProduct) {
      vendorProduct.name = req.body.name;
      vendorProduct.image = req.body.image;
      vendorProduct.email = req.body.email;
      vendorProduct.password = req.body.password;
      vendorProduct.products = req.body.products;
      vendorProduct.role = req.body.role;
      vendorProduct.phone = req.body.phone;
      vendorProduct.status = req.body.status;
      vendorProduct.modified_by = req.body.modified_by || null;
      const updatedVendorProduct = await vendorProduct.save();

      res.send({
        _id: updatedVendorProduct._id,
        name: updatedVendorProduct.name,
        image: updatedVendorProduct.image,
        email: updatedVendorProduct.email,
        phone: updatedVendorProduct.phone,
        role: updatedVendorProduct.role,
        password: updatedVendorProduct.password,
        products: updatedVendorProduct.products,
        status: updatedVendorProduct.status,
        modified_by: updatedVendorProduct.modified_by,
        message: "Vendor Updated Successfully!",
      });
    } else {
      res.status(404).send({
        message: "Vendor not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while updating the vendor product.",
      error: err.message,
    });
  }
};

const deletevendor_product = (req, res) => {
  Vendor_product.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Vendor Deleted Successfully!",
      });
    }
  });
};

module.exports = {
  vendor_productadd,
  getAllvendor_product,
  getvendor_productId,
  updatevendor_product,
  deletevendor_product,
  vendor_productmapadd,
  vendorDetailsByProductIds,
  vendor_productmapaddupdate,
  getFpoqunatity,
  getVenodrnamebyProductId,
  getvendor_IdOrderDetails,
};