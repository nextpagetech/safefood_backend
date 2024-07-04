
const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({

    program_caption_description: { type: String, required: false }, 
    program_title: { type: String, required: false }, 
    program_type: { type: String, required: false }, 
    program_image: { type: String, required: false }, 
    program_description: { type: String, required: false }, 
    program_title_two: { type: String, required: false }, 
    image_two: { type: String, required: false }, 
    description_two: { type: String, required: false }, 
    program_video: { type: String, required: false }, 
    status: { type: String, required: false }, 
     
    created_by: { type: String, required: false }, 
    
    modified_by: { type: String, required: false }, 
}
,{
    timestamps: true,
});

module.exports = mongoose.model('Our_Programs', ProgramSchema);
