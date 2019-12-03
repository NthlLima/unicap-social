const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    value: {
       type: String,
       required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = {
    MessageSchema,
    Message
}