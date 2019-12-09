const { Student } = require('../models/student.model');
const { Subject } = require('../models/subject.model');

module.exports = {
    async index({ chat }){
        const subject = await Subject.findById(chat).populate('sender');
        
        if(!subject) {
            // ERROR
        }

        console.log(subject.messages);
        return subject.messages;
    },
    async send({ id, chat, message }) {
        const subject = await Subject.findById(chat);

        if(!subject) {
            // ERROR
        }

        subject.messages.push({
            value: message, 
            sender: id
        });

        subject.save();
        return subject.messages;
    }
}