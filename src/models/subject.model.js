const mongoose = require('mongoose');
const { MessageSchema } = require('./message.model');

const SubjectSchema = new mongoose.Schema({
    class: {
        type: String,
        required: true,        
    },
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    messages: [MessageSchema],
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = {
    SubjectSchema,
    Subject
}