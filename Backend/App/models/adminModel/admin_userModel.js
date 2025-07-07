const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,  // Fix: Lowercase "type"
    required: true
  },
  username: {
    type: String,
    required: true,
    unique :true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  status:{
    type:String,
    required:true
  }
});

const userModel = mongoose.model('admin_user', UserSchema);
module.exports = userModel;