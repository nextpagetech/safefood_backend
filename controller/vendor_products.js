const mongoose = require("mongoose");
const Vendor_product = require("../models/vendor_products");
const { languageCodes } = require("../utils/data");

const vendor_productadd = async (req, res) => {
    try {
      console.log("req",req);
      console.log("req.body",req.body);
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
      const customer = await Vendor_product.findById(req.params.id);
      if (customer) {
        customer.vendor_id = req.body.vendor_id;
        customer.product_id = req.body.product_id;
        customer.status = req.body.status;
       
        // customer.password = bcrypt.hashSync("12345678");
        const updatedUser = await Vendor_product.save();
        // const token = signInToken(updatedUser);
        res.send({
          token,
          _id: updatedUser._id,
          vendor_id: updatedUser.vendor_id,
          product_id: updatedUser.product_id,
          status: updatedUser.status,
       
          message: "Vendor Updated Successfully!",
        });
      }
    } catch (err) {
      res.status(404).send({
        message: "Your details are not valid!",
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
