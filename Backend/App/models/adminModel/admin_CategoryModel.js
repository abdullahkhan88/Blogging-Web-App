const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    createAt:{
        type: Date,
        default: Date.now
    },
});

const CategoryModel = mongoose.model('admin_Category',CategorySchema);
module.exports = CategoryModel;
