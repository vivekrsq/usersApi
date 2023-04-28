const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mob: {
        type: Number,
        required: true
    },
    image: {
        type: String
    }

})

const User = mongoose.model("user", userSchema);

module.exports = User;