const mongoose = require("mongoose");
const Vendor_nameUpdate = require("../models/vendorname");

const { languageCodes } = require("../utils/data");


const vendor_nameUpdate = async (req, res) => {
  try {
    const { vendorId, products, vendorname } = req.body;

    if (!vendorId) {
      return res.status(400).send({ message: "vendorId is required!" });
    }
    if (!Array.isArray(products)) {
      return res.status(400).send({ message: "Products must be an array!" });
    }
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

    const vendorProduct = await Vendor_nameUpdate.findById(vendorId);

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
        existingProduct.vendorname = vendorname; // Update the vendor name
      } else {
        // Add the new product
        product.vendorname = vendorname; // Set the vendor name for the new product
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

module.exports = {
  vendor_nameUpdate, 
};
