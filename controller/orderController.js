const Order = require("../models/Order");
const Product = require("../models/Product");

const getAllOrders = async (req, res) => {
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
    const totalDoc = await Order.countDocuments(queryObject);
    const orders = await Order.find(queryObject)
      .select(
        "_id invoice paymentMethod subTotal total user_info discount shippingCost status createdAt updatedAt"
      )
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits);

    let methodTotals = [];
    if (startDate && endDate) {
      // console.log("filter method total");
      const filteredOrders = await Order.find(queryObject, {
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

const getOrderAdminInvoiceById = async (req, res) => {
  try {
    const { id, productId, quantity } = req.body;
    console.log("req.body123:", req.body);

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }

    console.log("order.cart:", order.cart);
    const productIdString = productId.toString();
    const productInCart = order.cart.find((item) => item.productId.toString() === productIdString);
    console.log("productIdString:", productIdString);
    console.log("productInCart:", productInCart);

    if (productInCart) {
      return res.status(400).send({ message: "Product already exists in the cart." });
    } else {
      const product = await Product.findById(productId)
        .populate({ path: "category", select: "_id name" })
        .populate({ path: "categories", select: "_id name" });

      if (!product) {
        return res.status(404).send({ message: "Product not found." });
      }

      // Log the fetched product to check the fields
      console.log("Fetched product:", product);

      const newCartItem = {
        prices: product.prices || {}, // Use an empty object as fallback
        image: product.image || [], // Use an empty array as fallback
        tag: product.tag || [], // Use an empty array as fallback
        status: product.status || "unknown", // Default status if not present
        productId: product._id.toString(),
        _id: product._id.toString(),
        title: product.title.en || "Untitled", // Default title if not present
        category: product.category || { _id: null, name: "Uncategorized" }, // Default category if not present
        stock: product.stock || 0, // Default stock if not present
        isCombination: product.isCombination || false, // Default to false
        price: product.prices.price || 0, // Default price to 0
        originalPrice: product.prices.originalPrice || 0, // Default original price to 0
        quantity: quantity, // Use the quantity provided in the request body
        displayPrice: product.displayPrice, // Use the quantity provided in the request body
        itemTotal: ( product.prices.price || 0) * quantity, 
       // Calculate the total for this item
      };

      console.log("newCartItem:", newCartItem); // Log the newCartItem object

      order.cart.push(newCartItem);
      order.total = order.cart.reduce((sum, item) => sum + item.itemTotal, 0);
      await order.save();
      res.send(order);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getOrderCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ _id: -1 });
    res.send(orders);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    console.log("orderorder",order);
    res.send(order);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateOrder = (req, res) => {
  const newStatus = req.body.status;
  Order.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: "Order Updated Successfully!",
        });
      }
    }
  );
};

const deleteOrder = (req, res) => {
  Order.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Order Deleted Successfully!",
      });
    }
  });
};

// get dashboard recent order
const getDashboardRecentOrder = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const pages = Number(page) || 1;
    const limits = Number(limit) || 8;
    const skip = (pages - 1) * limits;

    const queryObject = {};

    queryObject.$or = [
      { status: { $regex: `Pending`, $options: "i" } },
      { status: { $regex: `Processing`, $options: "i" } },
      { status: { $regex: `Delivered`, $options: "i" } },
      { status: { $regex: `Cancel`, $options: "i" } },
    ];

    const totalDoc = await Order.countDocuments(queryObject);

    // query for orders
    const orders = await Order.find(queryObject)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limits);

    // console.log('order------------<', orders);

    res.send({
      orders: orders,
      page: page,
      limit: limit,
      totalOrder: totalDoc,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get dashboard count
const getDashboardCount = async (req, res) => {
  try {
    const totalDoc = await Order.countDocuments();

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total processing order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "Processing",
        },
      },
      {
        $group: {
          _id: null,
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total delivered order count
    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    res.send({
      totalOrder: totalDoc,
      totalPendingOrder: totalPendingOrder[0] || 0,
      totalProcessingOrder: totalProcessingOrder[0]?.count || 0,
      totalDeliveredOrder: totalDeliveredOrder[0]?.count || 0,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getDashboardAmount = async (req, res) => {
  // console.log('total')
  let week = new Date();
  week.setDate(week.getDate() - 10);

  const currentDate = new Date();
  currentDate.setDate(1); // Set the date to the first day of the current month
  currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

  const lastMonthStartDate = new Date(currentDate); // Copy the current date
  lastMonthStartDate.setMonth(currentDate.getMonth() - 1); // Subtract one month

  let lastMonthEndDate = new Date(currentDate); // Copy the current date
  lastMonthEndDate.setDate(0); // Set the date to the last day of the previous month
  lastMonthEndDate.setHours(23, 59, 59, 999); // Set the time to the end of the day

  try {
    // total order amount
    const totalAmount = await Order.aggregate([
      {
        $group: {
          _id: null,
          tAmount: {
            $sum: "$total",
          },
        },
      },
    ]);
    // console.log('totalAmount',totalAmount)
    const thisMonthOrderAmount = await Order.aggregate([
      {
        $project: {
          year: { $year: "$updatedAt" },
          month: { $month: "$updatedAt" },
          total: 1,
          subTotal: 1,
          discount: 1,
          updatedAt: 1,
          createdAt: 1,
          status: 1,
        },
      },
      {
        $match: {
          $or: [{ status: { $regex: "Delivered", $options: "i" } }],
          year: { $eq: new Date().getFullYear() },
          month: { $eq: new Date().getMonth() + 1 },
          // $expr: {
          //   $eq: [{ $month: "$updatedAt" }, { $month: new Date() }],
          // },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$updatedAt",
            },
          },
          total: {
            $sum: "$total",
          },
          subTotal: {
            $sum: "$subTotal",
          },

          discount: {
            $sum: "$discount",
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    const lastMonthOrderAmount = await Order.aggregate([
      {
        $project: {
          year: { $year: "$updatedAt" },
          month: { $month: "$updatedAt" },
          total: 1,
          subTotal: 1,
          discount: 1,
          updatedAt: 1,
          createdAt: 1,
          status: 1,
        },
      },
      {
        $match: {
          $or: [{ status: { $regex: "Delivered", $options: "i" } }],

          updatedAt: { $gt: lastMonthStartDate, $lt: lastMonthEndDate },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: "$updatedAt",
            },
          },
          total: {
            $sum: "$total",
          },
          subTotal: {
            $sum: "$subTotal",
          },

          discount: {
            $sum: "$discount",
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    // console.log("thisMonthlyOrderAmount ===>", thisMonthlyOrderAmount);

    // order list last 10 days
    const orderFilteringData = await Order.find(
      {
        $or: [{ status: { $regex: `Delivered`, $options: "i" } }],
        updatedAt: {
          $gte: week,
        },
      },

      {
        paymentMethod: 1,
        paymentDetails: 1,
        total: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    );

    res.send({
      totalAmount:
        totalAmount.length === 0
          ? 0
          : parseFloat(totalAmount[0].tAmount).toFixed(2),
      thisMonthlyOrderAmount: thisMonthOrderAmount[0]?.total,
      lastMonthOrderAmount: lastMonthOrderAmount[0]?.total,
      ordersData: orderFilteringData,
    });
  } catch (err) {
    // console.log('err',err)
    res.status(500).send({
      message: err.message,
    });
  }
};

const bestSellerProductChart = async (req, res) => {
  try {
    const totalDoc = await Order.countDocuments({});
    const bestSellingProduct = await Order.aggregate([
      {
        $unwind: "$cart",
      },
      {
        $group: {
          _id: "$cart.title",

          count: {
            $sum: "$cart.quantity",
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 4,
      },
    ]);

    res.send({
      totalDoc,
      bestSellingProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getDashboardOrders = async (req, res) => {
  const { page, limit } = req.query;

  const pages = Number(page) || 1;
  const limits = Number(limit) || 8;
  const skip = (pages - 1) * limits;

  let week = new Date();
  week.setDate(week.getDate() - 10);

  const start = new Date().toDateString();

  // (startDate = '12:00'),
  //   (endDate = '23:59'),
  // console.log("page, limit", page, limit);

  try {
    const totalDoc = await Order.countDocuments({});

    // query for orders
    const orders = await Order.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limits);

    const totalAmount = await Order.aggregate([
      {
        $group: {
          _id: null,
          tAmount: {
            $sum: "$total",
          },
        },
      },
    ]);

    // total order amount
    const todayOrder = await Order.find({ createdAt: { $gte: start } });

    // this month order amount
    const totalAmountOfThisMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
          total: {
            $sum: "$total",
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    // total padding order count
    const totalPendingOrder = await Order.aggregate([
      {
        $match: {
          status: "Pending",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total delivered order count
    const totalProcessingOrder = await Order.aggregate([
      {
        $match: {
          status: "Processing",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // total delivered order count
    const totalDeliveredOrder = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    //weekly sale report
    // filter order data
    const weeklySaleReport = await Order.find({
      $or: [{ status: { $regex: `Delivered`, $options: "i" } }],
      createdAt: {
        $gte: week,
      },
    });

    res.send({
      totalOrder: totalDoc,
      totalAmount:
        totalAmount.length === 0
          ? 0
          : parseFloat(totalAmount[0].tAmount).toFixed(2),
      todayOrder: todayOrder,
      totalAmountOfThisMonth:
        totalAmountOfThisMonth.length === 0
          ? 0
          : parseFloat(totalAmountOfThisMonth[0].total).toFixed(2),
      totalPendingOrder:
        totalPendingOrder.length === 0 ? 0 : totalPendingOrder[0],
      totalProcessingOrder:
        totalProcessingOrder.length === 0 ? 0 : totalProcessingOrder[0].count,
      totalDeliveredOrder:
        totalDeliveredOrder.length === 0 ? 0 : totalDeliveredOrder[0].count,
      orders,
      weeklySaleReport,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};



// const getOrderByIdVendorName = async (req, res) => {
//   try {
//     // Fetch the order details by ID
//     const order = await Order.findById(req.params.id).exec();

//     if (!order) {
//       return res.status(404).send({ message: 'Order not found' });
//     }

//     // Fetch all vendors
//     const vendors = await Vendor.getAllvendor_product(); // Adjust method name as per actual implementation

//     // Create a map for fast vendor lookup by product ID
//     const vendorMap = {};
//     vendors.forEach(vendor => {
//       vendor.products.forEach(product => {
//         vendorMap[product._id] = vendor.name;
//       });
//     });

//     // Include vendor name in order details
//     const enrichedOrder = {
//       ...order._doc,
//       products: order.products.map(product => ({
//         ...product,
//         vendorName: vendorMap[product.productId] || 'Unknown Vendor'
//       }))
//     };

//     res.send(enrichedOrder);

//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };


const getVendorOrderDetails = async (req, res) => {
  console.log("Request received:", req.params.id);
  console.log("Request body:", req.body);
  try {
   

    // Fetch the order by ID
    const order = await Order.findById(req.params.id);
    console.log("Order details:", order);

    if (!order) {
      console.log("Order not found:", order);
      return res.status(404).send({ message: "Order not found" });
    }

    // Extract product IDs from the order's cart
    const productIds = order.cart.map(item => item.productId);
    console.log("Extracted product IDs:", productIds);

    // Fetch vendors whose products match the product IDs from the order
    const vendors = await Vendor.find({
      'products.productId': { $in: productIds }
    }).sort({ _id: -1 });

    console.log("Fetched vendors:", vendors);

    // Create a map to hold vendor details by product ID
    const vendorDetailsMap = {};

    // Iterate over each vendor and map the products to vendor details
    vendors.forEach(vendor => {
      vendor.products.forEach(product => {
        if (productIds.includes(product.productId.toString())) {
          vendorDetailsMap[product.productId] = {
            vendorId: vendor._id,
            vendorName: vendor.name, // Adjust based on your Vendor schema
            productDetails: product // Include the product details if needed
          };
        }
      });
    });

    console.log("Vendor details map:", vendorDetailsMap);

    // Prepare the response object
    const response = {
      order,
      vendors: vendorDetailsMap
    };

    res.send(response);

  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const getOrderUpdateAdminInvoiceById = async (req, res) => {
  
  try {
    console.log("Starting getOrderUpdateAdminInvoiceById");

    const { id, productId, quantity } = req.body;

    const sanitizedProductId = productId.trim().replace(/^,/, '');

    console.log("Sanitized Product ID:", sanitizedProductId);
    console.log("Request Body:", req.body);

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }

    console.log("order.cart:", order.cart);

    const productInCart = order.cart.find(
      (item) => item.productId.toString() === sanitizedProductId
    );

    console.log("productInCart:", productInCart);

    if (!productInCart) {
      return res.status(404).send({ message: "Product not found in the cart." });
    }

    console.log("Before update:", productInCart);

    productInCart.quantity = Number(quantity); 
    productInCart.itemTotal = productInCart.quantity * productInCart.prices.price;

    order.markModified('cart');

    order.subTotal = order.cart.reduce((acc, item) => acc + item.itemTotal, 0);
    order.total = order.subTotal + 60; 

    order.status = order.status || "Pending"; 

    const updatedOrder = await order.save();

    console.log("Updated order:", updatedOrder);

    res.send(updatedOrder);

    console.log("Order updated successfully");

  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getOrderCustomer,
  updateOrder,
  deleteOrder,
  getOrderAdminInvoiceById,
  bestSellerProductChart,
  getDashboardOrders,
  getDashboardRecentOrder,  
  getDashboardCount,
  getDashboardAmount,
  // getOrderByIdVendorName,
  getVendorOrderDetails,
  getOrderUpdateAdminInvoiceById,
};
