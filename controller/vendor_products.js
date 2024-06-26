const mongoose = require("mongoose");
const Vendor_product = require("../models/vendor_products");
const { languageCodes } = require("../utils/data");

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



module.exports = {
    vendor_productadd,
 
};
