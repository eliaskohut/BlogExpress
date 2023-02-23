const mongoose = require('mongoose');

const entrieSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['audio', 'image'],
        required: true
    },
    description:{
        type: String,
        required: false, 
        default: null
    },
    filename:{
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Entrie', entrieSchema);