
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    
    message: {
        required: true,
        type: Object
    },
    
});

module.exports = messages = mongoose.model("messages", messageSchema);