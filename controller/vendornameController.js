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



const getVendorUpdateByVendorId = async (req, res) => {
  try {
    const vendorIds = req.query.vendorIds;
    console.log('Received vendorIds:', vendorIds);

    // Ensure vendorIds is not empty
    if (!vendorIds) {
      return res.status(400).send({
        message: "vendorIds should be a comma-separated string of IDs.",
      });
    }

    // Split the comma-separated string into an array
    const vendorIdsArray = vendorIds.split(',');
    console.log("vendorIdsArray", vendorIdsArray);

    // Find vendor products using the array of vendorIds
    const vendorProducts = await VendorNameUpdate.find({}).sort({ _id: -1 });
    console.log("Found vendorProducts:", vendorProducts);

    // If no vendor products are found, send a 404 response
    if (!vendorProducts.length) {
      return res.status(404).send({
        message: "Vendors not found with the provided vendorIds.",
      });
    }

    // Filter vendor products to match vendorIdsArray
    const matchedVendors = vendorProducts.filter(vendorProduct => 
      vendorIdsArray.includes(vendorProduct._id.toString())
    );

    // If no matching vendors are found, send a 404 response
    if (!matchedVendors.length) {
      return res.status(404).send({
        message: "No vendors found with the provided vendorIds.",
      });
    }

    // Prepare the response with the matched vendor products
    const response = matchedVendors.map(vendorProduct => ({
      vendorId: vendorProduct._id,
      vendorname: vendorProduct.vendorname,
      products: vendorProduct.products,
    }));

    // Send the vendor products in the response
    res.send({
      message: "Vendor products fetched successfully!",
      vendorProducts: response,
    });
  } catch (err) {
    // Handle any errors that occur during the process
    console.error("Error:", err.message);
    res.status(500).send({
      message: "An error occurred while fetching the vendor product details.",
      error: err.message,
    });
  }
};





module.exports = {
  vendor_nameUpdate,
  getVendorUpdateByVendorId,
};
