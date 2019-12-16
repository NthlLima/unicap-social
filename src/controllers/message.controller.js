const { Student } = require('../models/student.model');
const { Subject } = require('../models/subject.model');
const { format, formatDistance, addDays, isToday } = require('date-fns');
const { ptBR } = require('date-fns/locale/pt-BR');
// import { format, formatDistance, formatRelative, subDays } from 'date-fns'


const getLastMessage = (messages) => {
    if(messages.length > 0) {
        const message = messages[messages.length - 1];
        message.created_at = formatDate(message.created_at)
        return message;
    }

    return null;
}

const formatDate = (date) => {
    if(isToday(addDays(new Date(date), 1))) {
        return 'Ontem';
    } else if(isToday(new Date(date))) {
        return format(new Date(date), 'HH:mm', {
            locale: ptBR
        }).toString();
    } else {
        return format(new Date(date), 'dd/MM/yyyy', {
            locale: ptBR
        }).toString();
    }
}

const formatDateMessages = (messages) => {
    const items = [];

    for (let i = 0; i < messages.length; i++) {
        const m = messages[i];
        m.created_at = formatDate(m.created_at);
        items.push(m);
    }

    return items
}


module.exports = {
    getLastMessage,
    async index({ chat }){
        const subject = await Subject.findById(chat).populate('messages.sender').lean();
        
        if(!subject) {
            // ERROR
        }

        const { messages } = subject;

        return formatDateMessages(messages);
    },
    async send({ id, chat, message, pubsub }) {
        const subject = await Subject.findById(chat);

        if(!subject) {
            // ERROR
        }

        subject.messages.push({
            value: message, 
            sender: id
        });

        await subject.save();

        const { messages } = await Subject.findById(chat).populate('messages.sender').lean();
        const formated = formatDateMessages(messages);
        
        pubsub.publish('CHAT_CHANNEL', { messageSent: formated[formated.length - 1] });

        return formated;
    }
}