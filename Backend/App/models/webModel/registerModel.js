const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: false
    },
    dob: {
        type: String,
        required: false
    },
    profile: {
        type: String,
        required: false
    },
    mobile: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});
let userModel = mongoose.model("user", userSchema);
module.exports = userModel;