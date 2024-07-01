const mongoose = require("mongoose");
const Shipping_address = require("../models/shipping_address");
const { languageCodes } = require("../utils/data");

const shipping_addressadd = async (req, res) => {
  try {
    const newShipping_address = new Shipping_address(req.body);
    await newShipping_address.save();
    res.status(200).send({
      message: "Shipping Address Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};


const getshipping_address = async (req, res) => {
  try {
    const vendors = await Shipping_address.find({}).sort({ _id: -1 });
    res.send(vendors);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getshippingaddressId = async (req, res) => {
  try {
    const customer = await Shipping_address.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const updateshippingaddress = async (req, res) => {
  console.log("updateShippinaddress");
  try {
    const customer = await Shipping_address.findById(req.params.id);
    if (customer) {
      customer.name = req.body.name;
      customer.contact = req.body.contact;
      customer.email = req.body.email;
      customer.address = req.body.address;
      customer.country = req.body.country;
      customer.city = req.body.city;
      customer.Landmark = req.body.Landmark;
      customer.zipcode = req.body.zipcode;
      customer.status = req.body.status;
      customer.modified_by = req.body.modified_by; 

      // customer.password = bcrypt.hashSync("12345678");
      const updatedUser = await customer.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        contact: updatedUser.contact,
        email: updatedUser.email,
        address: updatedUser.address,
        country: updatedUser.country,
        city: updatedUser.city,
        Landmark: updatedUser.Landmark,
        zipcode: updatedUser.zipcode,
        status: updatedUser.status,
        modified_by: updatedUser.modified_by,
        message: "Shipping Address Updated Successfully!",
      });
    } else {
      res.status(404).send({
        message: "User not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while updating the shipping address.",
      error: err.message,
    });
  }
};



// const updateshippingaddress = async (req, res) => {
//   console.log("updateShippinaddress");
//   try {
//     const customer = await Shipping_address.findById(req.params.id);
//     if (customer) {
//       customer.name = req.body.name;
//       customer.contact = req.body.contact;
//       customer.email = req.body.email;
//       customer.address = req.body.address;
//       customer.country = req.body.country;
//       customer.city = req.body.city;
//       customer.Landmark = req.body.Landmark;
//       customer.zipcode = req.body.zipcode;
//       customer.status = req.body.status;

//       // customer.password = bcrypt.hashSync("12345678");
//       const updatedUser = await customer.save();
//       const token = signInToken(updatedUser);
//       res.send({
//         token,
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         contact: updatedUser.contact,
//         email: updatedUser.email,
//         address: updatedUser.address,
//         country: updatedUser.country,
//         city: updatedUser.city,
//         Landmark: updatedUser.Landmark,
//         zipcode: updatedUser.zipcode,
//         status: updatedUser.status,
//         message: "Shipping Address Updated Successfully!",
//       });
//     }
//   } catch (err) {
//     res.status(404).send({
//       message: "Your Email is not valid!",
//     });
//   }
// };

const deleteshippingaddress = (req, res) => {
  Shipping_address.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Shipping address Deleted Successfully!",
      });
    }
  });
};



module.exports = {
  shipping_addressadd,
  getshipping_address,
  getshippingaddressId,
  updateshippingaddress,
  deleteshippingaddress

};
