const mongoose = require("mongoose");
const Vendor_product = require("../models/vendor_products");
const Product = require("../models/Product");
const { languageCodes } = require("../utils/data");
const Order = require("../models/Order");
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

// const vendor_productmapadd = async (req, res) => {
//   try {
//     const { vendorId, products } = req.body;
//     console.log("vendorId, products", vendorId, products);
//     if (!vendorId) {
//       return res.status(400).send({ message: "vendorId is required!" });
//     }
//     const vendorProduct = await Vendor_product.findById(vendorId);
//     if (!vendorProduct) {
//       return res.status(404).send({ message: "Vendor not found!" });
//     }
//     vendorProduct.products = products;
//   const updatedVendorProduct = await vendorProduct.save();

//     res.send({
//       _id: updatedVendorProduct._id,
//       products: updatedVendorProduct.products,
//       message: "Vendor Updated Successfully!",
//     });
//   } catch (err) {
//     console.error("Error:", err.message);
//     res.status(500).send({
//       message: "An error occurred while updating the vendor product.",
//       error: err.message,
//     });
//   }
// };

// const vendor_productmapaddupdate = async (req, res) => {
//   try {
//     const { vendorId, products } = req.body;
//     console.log("req.bodyreq.body",req.body);

//     if (!vendorId) {
//       return res.status(400).send({ message: "vendorId is required!" });
//     }

//     if (!Array.isArray(products) || products.length === 0) {
//       return res
//         .status(400)
//         .send({
//           message: "products array is required and should not be empty!",
//         });
//     }

//     let vendorProduct = await Vendor_product.findById(vendorId);

//     if (!vendorProduct) {
//       // Vendor not found, create a new one
//       vendorProduct = new Vendor_product({
//         _id: vendorId,
//         products: [],
//       });
//     } else {
//       // Vendor found, clear existing products
//       vendorProduct.products = [];
//     }

//     products.forEach(({ productId,stock, prices, title, variants }) => {
//       if (!productId) {
//         throw new Error("productId is required!");
//       }

//       // if (!prices || typeof prices.price !== "number") {
//       //   throw new Error(
//       //     "prices should contain price (Number) and discount (Number)!"
//       //   );
//       // }

   

//       vendorProduct.products.push({
//         productId,
//         stock,
//         prices,
//         title,
//         variants,
//       });
//     });

//     const updatedVendorProduct = await vendorProduct.save();

//     res.send({
//       _id: updatedVendorProduct._id,
//       products: updatedVendorProduct.products,
//       message: "Vendor products updated successfully!",
//     });
//   } catch (err) {
//     res.status(500).send({
//       message: "An error occurred while updating the vendor products.",
//       error: err.message,
//     });
//   }
// };

const vendor_productmapaddupdate = async (req, res) => {
  try {
    const { vendorId, products } = req.body;

    // Fetch vendor data from the admin table
    const vendordata = await admin.findById(vendorId);

    if (!vendordata) {
      return res.status(404).send({ message: "Vendor not found in the admin table!" });
    }

    const email = vendordata.email;
    const name = vendordata.name;

    if (!vendorId) {
      return res.status(400).send({ message: "vendorId is required!" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).send({ message: "products array is required and should not be empty!" });
    }

    if (!email) {
      return res.status(400).send({ message: "Email is required!" });
    }

    let vendorProduct = await Vendor_product.findById(vendorId);

    if (!vendorProduct) {
      // Vendor not found, create a new one
      vendorProduct = new Vendor_product({
        _id: vendorId,
        email,
        name,
        products: [],
      });
    } else {
      // Vendor found, update the email, name, and clear existing products
      vendorProduct.email = email;
      vendorProduct.name = name;
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
      });
    });

    // Save the updated or newly created vendor product mapping
    const updatedVendorProduct = await vendorProduct.save();

    res.send({
      _id: updatedVendorProduct._id,
      email: updatedVendorProduct.email,
      name: updatedVendorProduct.name,
      products: updatedVendorProduct.products,
      message: "Vendor products updated successfully!",
    });

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



// const getVenodrnamebyProductId = async (req, res) => {
//   try {
//     let productIds = req.query.productIds.split(',');

//     if (typeof productIds === 'string') {
//       productIds = productIds.split(',');
//     } else if (!Array.isArray(productIds)) {
//       productIds = [productIds];
//     }

//     const vendors = await Vendor_product.find({}).sort({ _id: -1 });

//     const filteredVendorProducts = vendors.filter(vendorProduct =>
//       vendorProduct.products.some(product =>
//         productIds.includes(product.productId.toString())
//       )
//     );
//     console.log("Received productIds123:", filteredVendorProducts);

//     const productVendorDetails = productIds.map(pid => {
//       const vendorsWithProduct = filteredVendorProducts
//         .map(vendorProduct => {
//           const product = vendorProduct.products.find(
//             product => product.productId.toString() === pid
//           );
//           console.log("vendorsWithProduct", vendorsWithProduct);

//           return product ? {
//             vendorId: vendorProduct._id,
//             vendorName: vendorProduct.name,
//             price: parseFloat(product.price),
//             productId: product.productId.toString()
//           } : undefined;
//         })
//         .filter(vendor => vendor !== undefined);

//       if (vendorsWithProduct.length === 0) {
//         return { productId: pid, lowestPriceVendor: null };
//       }

//       const lowestPriceVendor = vendorsWithProduct.reduce((prev, curr) =>
//         prev.price < curr.price ? prev : curr
//       );
// console.log("lowestPriceVendor.vendorName",lowestPriceVendor.vendorName)
//       return {
//         productId: pid,
//         lowestPriceVendor: {
//           vendorId: lowestPriceVendor.vendorId,
//           vendorName: lowestPriceVendor.vendorName,
//           price: lowestPriceVendor.price
//         }
//       };
//     });

//     res.status(200).send(productVendorDetails);
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

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

// const vendorDetailsByProductIds = async (req, res) => {
//   try {
//     const { productIds } = req.body;

//     if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
//       return res.status(400).send({ message: "Product IDs are required and should be provided as an array." });
//     }

//     const vendorProducts = await Vendor_product.find({ products: { $in: productIds } })
//       .populate('vendor')
//       .exec();

//     if (!vendorProducts || vendorProducts.length === 0) {
//       return res.status(404).send({ message: "No vendors found for the provided product IDs." });
//     }
//     console.log("vendorProducts",vendorProducts);

//     const vendors = vendorProducts.map(vp => ({
//       vendorId: vp._id.toString(),
//       vendorName: vp.name,
//       products: vp.products,
//       createdBy: vp.created_by ? vp.created_by.name : '',
//       modifiedBy: vp.modified_by ? vp.modified_by.name : '',
//     }));

//     res.send({ vendors });
//   } catch (err) {
//     console.error("Error:", err.message);
//     res.status(500).send({
//       message: "An error occurred while fetching vendor details by product IDs.",
//       error: err.message,
//     });
//   }
// };

// const vendorDetailsByProductIds = async (req, res) => {
//   try {
//     const { productIds } = req.body;

//     console.log("productIds",productIds);
//     if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
//       return res.status(400).send({ message: "Product IDs are required and should be provided as an array." });
//     }

//     const vendorProducts = await Vendor_product.find({ products: { $in: productIds } })
//       .populate('vendor')
//       .exec();

//     if (!vendorProducts || vendorProducts.length === 0) {
//       return res.status(404).send({ message: "No vendors found for the provided product IDs." });
//     }

//     // Function to get product details
//     const getProductDetails = async (productId) => {
//       try {
//         const product = await Product.findOne({ _id: productId, status: "show" });
//         return product; // Assuming product is already the desired data
//       } catch (error) {
//         console.error(`Error fetching product details for ID ${productId}:`, error.message);
//         return null;
//       }
//     };

//     // Get product details only for the specific product IDs in the request
//     const productDetailsPromises = productIds.map(productId => getProductDetails(productId));
//     const productDetailsArray = await Promise.all(productDetailsPromises);

//     // Create a map for quick lookup of product details
//     const productDetailsMap = new Map();
//     productDetailsArray.forEach(product => {
//       if (product) {
//         productDetailsMap.set(product._id.toString(), product);
//       }
//     });

//     // Combine vendor and product details
//     const vendors = vendorProducts.map(vp => ({
//       vendorId: vp._id.toString(),
//       vendorName: vp.name,
//       vendorEmail: vp.email,
//       vendorPhone: vp.phone,
//       vendorImage: vp.image,
//       vendorStatus: vp.status,
//       createdBy: vp.created_by ? vp.created_by.name : '',
//       modifiedBy: vp.modified_by ? vp.modified_by.name : '',
//       products: vp.products
//         .filter(productId => productDetailsMap.has(productId.toString()))
//         .map(productId => productDetailsMap.get(productId.toString()) || { productId })
//     }));

//     res.send({ vendors });
//   } catch (err) {
//     console.error("Error:", err.message);
//     res.status(500).send({
//       message: "An error occurred while fetching vendor details by product IDs.",
//       error: err.message,
//     });
//   }
// };
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
};
