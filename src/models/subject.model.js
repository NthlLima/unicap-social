const mongoose = require('mongoose');
const { MessageSchema } = require('./message.model');

const SubjectSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true, 
    },
    name: {
        type: String,
        required: true,
    },
    class: {
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