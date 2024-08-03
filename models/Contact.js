

const mongoose = require("mongoose");


const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        contact_no: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        subject: {
            type: String,
            required: false,
        },
        message: {
            type: String,
            required: true,
        },
   status:{
    type :String,
    
    required:false
   },
   created_by:{
    type:String,
    required:false
   },
   modified_by:{
    type: String,
     required: false
   }
   
    },
    {
        timestamps: true,
    }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;







