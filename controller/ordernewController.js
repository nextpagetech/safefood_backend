require("dotenv").config();

const mongoose = require("mongoose");
const Ordernew = require("../models/ordersnew");
const Order = require("../models/Order");
const { handleProductQuantity } = require("../lib/stock-controller/others");

const addOrdernew = async (req, res) => {
  try {
    console.log("req.bodyuser", req.user);
    console.log("req.bodyuser", req.body);
    const newOrder = new Ordernew({
      ...req.body,
      user: req.user._id,
    });
    const order = await newOrder.save();
    res.status(201).send(order);
    handleProductQuantity(order.cart);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const requests = req.body; // Assuming req.body is an array of objects
    const results = [];

    for (const { productId, orderId } of requests) {
      if (!productId || !orderId) {
        console.log(`Invalid productId or orderId. Skipping...`);
        continue;
      }

      console.log(`Processing productId: ${productId}, orderId: ${orderId}`);

      // Find the order by ID
      const orderDetails = await Ordernew.findById(orderId);

      if (orderDetails && orderDetails.cart) {
        // Find the item to update in the cart
        const itemToUpdate = orderDetails.cart.find(item => item._id === productId);
        console.log("itemToUpdate:", itemToUpdate);

        if (itemToUpdate) {
          // Update status to 'Processing'
          itemToUpdate.status = 'Processing';
          console.log(`Updating productId: ${productId} to status: Processing`);

          // Check if all items in the cart are processed
          const allProcessed = orderDetails.cart.every(item => item.status === 'Processing');
          orderDetails.status = allProcessed ? 'Delivered' : 'Processing';

          // Save the updated order
          const savedOrder = await orderDetails.save();
          console.log('Order saved:', savedOrder);

          // Verify that the item status was updated
          const updatedItem = savedOrder.cart.find(item => item._id.toString() === productId);
          if (updatedItem && updatedItem.status === 'Processing') {
            console.log(`Successfully updated status for productId: ${productId}`);
            results.push({ productId, orderDetails: savedOrder.toObject() });
          } else {
            console.log(`Failed to update status for productId: ${productId}`);
          }
        } else {
          console.log(`ProductId: ${productId} not found in orderId: ${orderId}`);
        }
      } else {
        console.log(`No cart details found for orderId: ${orderId}`);
      }
    }

    res.send(results);
  } catch (err) {
    console.error('Error processing updateProductStatus:', err.message);
    res.status(500).send({
      message: err.message,
    });
  }
};



// const updateProductStatus = async (req, res) => {
//   try {
//     const requests = req.body; // Assuming req.body is an array of objects
//     const results = [];

//     for (const { productId, orderId } of requests) {
//       console.log(`Processing productId: ${productId}, orderId: ${orderId}`);

//       // Find the order by ID
//       const orderDetails = await Ordernew.findById(orderId);

//       if (orderDetails && orderDetails.cart) {
//         const statusesAndProductIds = orderDetails.cart.map((item) => ({
//           status: item.status,
//           productId: item.productId,
//         }));
//         console.log(
//           `Fetched order details for orderId: ${orderId}, statuses and productIds:`,
//           statusesAndProductIds
//         );

//         const itemToUpdate = orderDetails.cart.find(
//           (item) => item.productId.toString() === productId
//         );
//         console.log("itemToUpdateitemToUpdate", itemToUpdate);

//         if (itemToUpdate) {
//           itemToUpdate.status = "Processing";
//           console.log(`Updating productId: ${productId} to status: Processing`);

//           const allProcessed = orderDetails.cart.every(
//             (item) => item.status === "Processing"
//           );
//           orderDetails.status = allProcessed ? "Delivered" : "Processing"; // Ensure this is valid

//           // Save the updated order
//           await orderDetails.save();

//           // Verify that the order was updated
//           const updatedOrder = await Ordernew.findById(orderId);
//           console.log(
//             "Successfully saved updated order details:",
//             updatedOrder
//           );

//           results.push({ productId, orderDetails: updatedOrder.toObject() });
//         } else {
//           console.log(
//             `ProductId: ${productId} not found in orderId: ${orderId}`
//           );
//         }
//       } else {
//         console.log(`No cart details found for orderId: ${orderId}`);
//       }
//     }

//     res.send(results);
//   } catch (err) {
//     console.error("Error processing updateProductStatus:", err.message);
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const getAllOrdersnew = async (req, res) => {
  const {
    day,
    status,
    page,
    limit,
    method,
    endDate,
    // download,
    // sellFrom,
    startDate,
    customerName,
  } = req.query;

  //  day count
  let date = new Date();
  const today = date.toString();
  date.setDate(date.getDate() - Number(day));
  const dateTime = date.toString();

  const beforeToday = new Date();
  beforeToday.setDate(beforeToday.getDate() - 1);
  // const before_today = beforeToday.toString();

  const startDateData = new Date(startDate);
  startDateData.setDate(startDateData.getDate());
  const start_date = startDateData.toString();

  // console.log(" start_date", start_date, endDate);

  const queryObject = {};

  if (!status) {
    queryObject.$or = [
      { status: { $regex: `Pending`, $options: "i" } },
      { status: { $regex: `Processing`, $options: "i" } },
      { status: { $regex: `Delivered`, $options: "i" } },
      { status: { $regex: `Cancel`, $options: "i" } },
    ];
  }

  if (customerName) {
    queryObject.$or = [
      { "user_info.name": { $regex: `${customerName}`, $options: "i" } },
      { invoice: { $regex: `${customerName}`, $options: "i" } },
    ];
  }

  if (day) {
    queryObject.createdAt = { $gte: dateTime, $lte: today };
  }

  if (status) {
    queryObject.status = { $regex: `${status}`, $options: "i" };
  }

  if (startDate && endDate) {
    queryObject.updatedAt = {
      $gt: start_date,
      $lt: endDate,
    };
  }
  if (method) {
    queryObject.paymentMethod = { $regex: `${method}`, $options: "i" };
  }

  const pages = Number(page) || 1;
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    // total orders count
    const totalDoc = await Ordernew.countDocuments(queryObject);
    const orders = await Ordernew.find(queryObject)
      .select(
        "_id invoice paymentMethod subTotal total user_info discount shippingCost status createdAt updatedAt"
      )
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits);

    let methodTotals = [];
    if (startDate && endDate) {
      // console.log("filter method total");
      const filteredOrders = await Ordernew.find(queryObject, {
        _id: 1,
        // subTotal: 1,
        total: 1,

        paymentMethod: 1,
        // createdAt: 1,
        updatedAt: 1,
      }).sort({ updatedAt: -1 });
      for (const order of filteredOrders) {
        const { paymentMethod, total } = order;
        const existPayment = methodTotals.find(
          (item) => item.method === paymentMethod
        );

        if (existPayment) {
          existPayment.total += total;
        } else {
          methodTotals.push({
            method: paymentMethod,
            total: total,
          });
        }
      }
    }

    res.send({
      orders,
      limits,
      pages,
      totalDoc,
      methodTotals,
      // orderOverview,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrdernewById = async (req, res) => {
  try {
    const order = await Ordernew.findById(req.params.id);
    console.log("orderorder", order);
    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addOrdernew,
  updateProductStatus,
  getAllOrdersnew,
  getOrdernewById,
};
