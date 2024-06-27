
const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
    program_id: { type: Number, required: true }, 
    program_type: { type: String, required: false }, 
    program_caption_description: { type: String, required: false }, 
    program_title: { type: String, required: false }, 
    program_image: { type: String, required: false }, 
    program_description: { type: String, required: false }, 
    program_title_two: { type: String, required: false }, 
    image_two: { type: String, required: false }, 
    description_two: { type: String, required: false }, 
    program_video: { type: String, required: false }, 
    status: { type: String, required: false }, 
    created_on: { 
        type: Date, 
        required: false,
        set: dateStr => {
            if (typeof dateStr === 'string') {
                const [day, month, year] = dateStr.split('/');
                return new Date(`20${year}-${month}-${day}`);
            }
            return dateStr;
        }
    }, 
    created_by: { type: String, required: false }, 
    modified_on: { 
        type: Date, 
        required: false,
        set: dateStr => {
            if (typeof dateStr === 'string') {
                const [day, month, year] = dateStr.split('/');
                return new Date(`20${year}-${month}-${day}`);
            }
            return dateStr;
        }
    }, 
    modified_by: { type: String, required: false }, 
});

module.exports = mongoose.model('Our_Programs', ProgramSchema);
