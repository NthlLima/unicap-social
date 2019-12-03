const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    matriculation: {
        type: String,
        unique: true, 
        required: true,
    },
    digit: {
        type: String,
        required: true,
    },
    chats: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Subject'
    }
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = {
    StudentSchema,
    Student
}