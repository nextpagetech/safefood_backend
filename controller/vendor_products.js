const mongoose = require("mongoose");
const Vendor_product = require("../models/vendor_products");
const Product = require("../models/Product");
const { languageCodes } = require("../utils/data");

const vendor_productadd = async (req, res) => {
  try {
    console.log("req", req);
    console.log("req.body", req.body);
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
        return res.status(400).send({ message: `Invalid productId: ${product.productId}` });
      }

      if (typeof product.title !== 'object') {
        return res.status(400).send({ message: "Product title must be an object!" });
      }

      if (product.prices) {
        if (typeof product.prices.price !== 'number' || typeof product.prices.originalPrice !== 'number') {
          return res.status(400).send({ message: "Product prices must be numbers!" });
        }
      }
    }

    const vendorProduct = await Vendor_product.findById(vendorId);

    if (!vendorProduct) {
      return res.status(404).send({ message: "Vendor not found!" });
    }

    // Create a map of existing products for quick lookup
    const existingProductsMap = new Map(vendorProduct.products.map(p => [p.productId.toString(), p]));

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
    console.error("Error:", err.message);
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

const vendor_productmapaddupdate = async (req, res) => {
  try {
    const { vendorId, productId, prices, title, variants } = req.body;
    console.log("Received data:", { vendorId, productId, prices, title, variants });

    if (!vendorId) {
      return res.status(400).send({ message: "vendorId is required!" });
    }

    if (!productId) {
      return res.status(400).send({ message: "productId is required!" });
    }

    if (!prices ||
        typeof prices.price !== 'number' ||
        isNaN(parseFloat(prices.originalPrice)) ||
        typeof prices.discount !== 'number') {
      return res.status(400).send({ message: "prices should contain price (Number), originalPrice (Number), and discount (Number)!" });
    }

    const originalPrice = parseFloat(prices.originalPrice);

    if (!title || typeof title.en !== 'string') {
      return res.status(400).send({ message: "title is required and should contain en (String)!" });
    }

    const vendorProduct = await Vendor_product.findById(vendorId);

    if (!vendorProduct) {
      return res.status(404).send({ message: "Vendor not found!" });
    }

    const productIndex = vendorProduct.products.findIndex(product => product.productId.toString() === productId.toString());

    if (productIndex === -1) {
      return res.status(404).send({ message: "Product not found in the vendor's list!" });
    } else {
      vendorProduct.products[productIndex].prices = { ...prices, originalPrice };
      vendorProduct.products[productIndex].title = title;

      // Handle variants if they are provided
      if (variants) {
        vendorProduct.products[productIndex].variants = variants;
      }
    }

    const updatedVendorProduct = await vendorProduct.save();

    res.send({
      _id: updatedVendorProduct._id,
      products: updatedVendorProduct.products,
      message: "Vendor product updated successfully!",
    });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send({
      message: "An error occurred while updating the vendor product.",
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

    console.log("productIds", productIds);

    // Fetch all vendor products
    const vendorProducts = await Vendor_product.find({}).sort({ _id: -1 });

    console.log("vendorProducts", vendorProducts);

    // Filter the vendor products to include only those that have the product IDs provided
    const filteredVendorProducts = vendorProducts.filter(vendorProduct => {
      console.log("vendorProduct.products", vendorProduct.products);
      return vendorProduct.products.some(productId => {
        console.log("productId", productId.toString());
        return productIds.includes(productId.toString());
      });
    });

    console.log("filteredVendorProducts", filteredVendorProducts);

    if (filteredVendorProducts.length === 0) {
      return res.status(404).send({ message: "No vendor products found for the given product IDs." });
    }

    const vendorDetails = filteredVendorProducts.map(vendorProduct => {
      const matchingProducts = vendorProduct.products.filter(productId => 
        productIds.includes(productId.toString())
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
        products: matchingProducts
      };
    });

    res.send(vendorDetails);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send({
      message: "An error occurred while fetching vendor details by product IDs.",
      error: err.message,
    });
  }
};











const updatevendor_product = async (req, res) => {
  console.log("updateCustomer");
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
};
