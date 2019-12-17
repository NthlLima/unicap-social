const { Subject } = require('../models/subject.model');
const { Student } = require('../models/student.model');
const { getLastMessage } = require('./message.controller');

const syncSubjects = async (id, subjects) => {
    const student = await Student.findById(id);
    // const { chats, subjects } = student;

    const hasSubjects  = [];
    const saveSubjects = [];

    for (let i = 0; i < subjects.length; i++) {
        const current = subjects[i];
        const subject = await Subject.findOne({ class: current.class, code: current.code }).lean();

        if(subject) {
            hasSubjects.push(subject);
        } else {
            saveSubjects.push(current);
        }
    }

    for (let j = 0; j < saveSubjects.length; j++) {
        const current = saveSubjects[j];
        const initial = generateInitials(current.name);
        const subject = await Subject.create({
            code: current.code,
            class: current.class,
            name: current.name,
            initial
        });

        hasSubjects.push(subject);
    }

    for (let h = 0; h < hasSubjects.length; h++) {
        const { _id } = hasSubjects[h];

        if(!student.subjects.includes(_id)) {
            student.subjects.push(_id);
        }     
    }
    student.save();
    
    const subscribe = [];
    const canSubscribe = [];

    hasSubjects.forEach((subject, index) => {
        const { id, messages } = subject;

        if(messages.length > 0) {
            subject.messages = [messages[messages.length - 1]];
        }

        if(student.chats.includes(id)) {
            subscribe.push(subject);
        } else {
            canSubscribe.push(subject);
        }
    });

    return {
        subscribe,
        canSubscribe
    };
}

const contain = (item, array) => {
    const convert = JSON.stringify(item)
    for (let i = 0; i < array.length; i++) {
        const e = array[i];
        const c = JSON.stringify(e)
        
        if(c == convert) {
            return true;
        }
    }

    return false;
}

const generateInitials = (word) => {
    const split = word.split(' ');
    const words = split.filter((wrd) => {
        return (wrd !== 'DE' && wrd !== 'de');
    });

    const loop = words.length > 3 ? 3 : words.length;
    let initial = '';

    for (let i = 0; i < loop; i++) {
        const w = words[i];

        initial += w.charAt(0);        
    }

    return initial;
}

module.exports = {
    syncSubjects,
    async getSubjects ({ id }) {
        const { chats } = await Student.findById(id).lean();
        const itens = [];

        for (let i = 0; i < chats.length; i++) {
            const s = chats[i];
            const subject = await Subject.findById(s).populate('messages.sender').lean();
            subject.message = getLastMessage(subject.messages);
            delete subject.messages; 
            subject.messages = [];
            
            if(subject) itens.push(subject);
        }
        
        return itens;
    },
    async getSubscribes ({ id }) {
        const { subjects, chats } = await Student.findById(id).lean();
        const itens = [];
        
        for (let i = 0; i < subjects.length; i++) {
            const s = subjects[i];
            const subject = await Subject.findById(s)
            
            if(subject) {
                if(!contain(s, chats)) itens.push(subject);
            }
        }

        return itens;
    },
    async subscription({ id, subject, pubsub }) {
        const student = await Student.findById(id);
        const find = await Subject.findById(subject);

        if(find) {
            student.chats.push(subject);
            student.save();
        }

        const { subjects, chats } = student;
        const itens = [];

        for (let i = 0; i < subjects.length; i++) {
            const s = subjects[i];
            const subject = await Subject.findById(s)
            
            if(subject) {
                if(!contain(s, chats)) itens.push(subject);
            }
        }

        pubsub.publish('SUBJECT_SUBSCRIBED', { subjectSubscribed: { response: 'success' } });

        return itens;
    }
}