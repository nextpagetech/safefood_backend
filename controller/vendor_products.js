const mongoose = require("mongoose");
const Vendor_product = require("../models/vendor_products");
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



const updatevendor_product = async (req, res) => {
  console.log("updateCustomer");
  try {
    const vendorProduct = await Vendor_product.findById(req.params.id);
    if (vendorProduct) {
      vendorProduct.name = req.body.name;
      vendorProduct.image = req.body.image;
      vendorProduct.email = req.body.email;
      vendorProduct.password = req.body.password;
      vendorProduct.phone = req.body.phone;
      vendorProduct.status = req.body.status;
      vendorProduct.modified_by = req.body.modified_by || null; // Ensure modified_by is set

      const updatedVendorProduct = await vendorProduct.save();

      res.send({
        _id: updatedVendorProduct._id,
        name: updatedVendorProduct.name,
        image: updatedVendorProduct.image,
        email: updatedVendorProduct.email,
        phone: updatedVendorProduct.phone,
        password: updatedVendorProduct.password,
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
};
