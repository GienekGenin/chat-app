const mongoose = require("mongoose");

const messages = mongoose.Schema({
    senderId: Number,
    receiverId: Number,
    message: String
},{ versionKey: false });

const Message = mongoose.model("messages", messages);

module.exports = Message;
