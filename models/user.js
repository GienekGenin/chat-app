const mongoose = require("mongoose");

const users = mongoose.Schema({
    id: Number,
    name: String,
    email: String
},{ versionKey: false });

const User = mongoose.model("users", users);

module.exports = User;
