
const mongoose = require("mongoose");
const Shipping_address = require("../models/shipping_address");

// Add a new shipping address
const shipping_addressadd = async (req, res) => {
  try {
    // Check if the email already exists
    const existingAddress = await Shipping_address.findOne({ email: req.body.email });
    if (existingAddress) {
      return res.status(200).send({
        message: "Shipping Address Added Successfully!",
        data: existingAddress,
      });
    }

    // If defaultAddress is set, update existing default addresses to false
    if (req.body.defaultAddress) {
      await Shipping_address.updateMany(
        { created_by: req.body.created_by, defaultAddress: true },
        { $set: { defaultAddress: false } }
      );
    }

    // Create a new shipping address
    const newShipping_address = new Shipping_address(req.body);
    const savedAddress = await newShipping_address.save();

    res.status(200).send({
      message: "Shipping Address Added Successfully!",
      data: savedAddress,
    });
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while adding the shipping address.",
      error: err.message,
    });
  }
};

// Get all shipping addresses
const getshipping_address = async (req, res) => {
  try {
    const addresses = await Shipping_address.find({}).sort({ _id: -1 });
    res.status(200).send(addresses);
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while retrieving shipping addresses.",
      error: err.message,
    });
  }
};

// Get a specific shipping address by ID
const getshippingaddressId = async (req, res) => {
  try {
    const address = await Shipping_address.findById(req.params.id);
    if (address) {
      res.status(200).send(address);
    } else {
      res.status(404).send({
        message: "Address not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while retrieving the shipping address.",
      error: err.message,
    });
  }
};

// Update a shipping address
const updateshippingaddress = async (req, res) => {
  try {
    const address = await Shipping_address.findById(req.params.id);
    if (address) {
      // Check if the updated email already exists and does not belong to the current address
      if (req.body.email && req.body.email !== address.email) {
        const existingAddress = await Shipping_address.findOne({ email: req.body.email });
        if (existingAddress) {
          return res.status(200).send({
            message: "Shipping Address Updated Successfully!",
            data: existingAddress,
          });
        }
      }

      // Update address fields
      address.name = req.body.name || address.name;
      address.contact = req.body.contact || address.contact;
      address.email = req.body.email || address.email;
      address.address = req.body.address || address.address;
      address.country = req.body.country || address.country;
      address.city = req.body.city || address.city;
      address.Landmark = req.body.Landmark || address.Landmark;
      address.zipcode = req.body.zipcode || address.zipcode;
      address.status = req.body.status || address.status;
      address.defaultAddress = req.body.defaultAddress || address.defaultAddress;
      address.modified_by = req.body.modified_by || address.modified_by;

      // If defaultAddress is set, update existing default addresses to false
      if (req.body.defaultAddress) {
        await Shipping_address.updateMany(
          { created_by: address.created_by, _id: { $ne: req.params.id }, defaultAddress: true },
          { $set: { defaultAddress: false } }
        );
      }

      // Save updated address
      const updatedAddress = await address.save();
      res.status(200).send({
        message: "Shipping Address Updated Successfully!",
        data: updatedAddress,
      });
    } else {
      res.status(404).send({
        message: "Address not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while updating the shipping address.",
      error: err.message,
    });
  }
};

// Delete a shipping address
const deleteshippingaddress = async (req, res) => {
  try {
    const address = await Shipping_address.findById(req.params.id);
    if (address) {
      // If deleting a defaultAddress, unset defaultAddress for the user
      if (address.defaultAddress) {
        await Shipping_address.updateMany(
          { created_by: address.created_by, _id: { $ne: req.params.id }, defaultAddress: true },
          { $set: { defaultAddress: false } }
        );
      }

      // Delete the address
      await Shipping_address.deleteOne({ _id: req.params.id });
      res.status(200).send({
        message: "Shipping Address Deleted Successfully!",
      });
    } else {
      res.status(404).send({
        message: "Address not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while deleting the shipping address.",
      error: err.message,
    });
  }
};

module.exports = {
  shipping_addressadd,
  getshipping_address,
  getshippingaddressId,
  updateshippingaddress,
  deleteshippingaddress,
};

