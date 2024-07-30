const mongoose = require("mongoose");
const VendorNameUpdate = require("../models/vendorname");
const VendorProducts = require("../models/vendor_products");

const vendor_nameUpdate = async (req, res) => {
  try {
    const { vendorId, products } = req.body;

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

      if (product.prices) {
        if (typeof product.prices.price !== 'number' || (product.prices.originalPrice && typeof product.prices.originalPrice !== 'number')) {
          return res.status(400).send({ message: "Product prices must be numbers!" });
        }
      }
    }

    // Fetch vendor details to get vendorname
    let vendor = await VendorProducts.findById(vendorId);
    let vendorname;

    if (vendor) {
      vendorname = vendor.name; // Assuming 'name' field contains the vendor name
    } else {
      // Create a new vendor if not found
      vendor = new VendorProducts({ _id: vendorId, name: 'New Vendor' }); // Adjust 'New Vendor' as needed
      await vendor.save();
      vendorname = vendor.name;
    }

    // Collect updated products
    const updatedProducts = [];

    // Loop through each product to check if it exists and update or add accordingly
    for (const product of products) {
      const vendorProduct = await VendorNameUpdate.findOne({ 'products.productId': product.productId });
      if (vendorProduct) {
        // Update the specific product
        vendorProduct.products = vendorProduct.products.map(p => {
          if (p.productId.toString() === product.productId) {
            p.vendorId = vendorId;
            p.vendorname = vendorname;
            p.prices = product.prices;
            updatedProducts.push(p); // Add to updated products
          }
          return p;
        });

        await vendorProduct.save();
      } else {
        // Add the new product
        const newProduct = {
          vendorId: vendorId,
          vendorname: vendorname,
          productId: product.productId,
          prices: product.prices,
        };

        await VendorNameUpdate.updateOne(
          { _id: vendorId },
          { $push: { products: newProduct }},
          { upsert: true }
        );

        updatedProducts.push(newProduct); // Add to updated products
      }
    }

    res.send({
      message: "Products updated with new vendor details successfully!",
      updatedProducts: updatedProducts,
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
