const { Subject } = require('../models/subject.model');
const { Student } = require('../models/student.model');


const syncSubjects = async (id, subjects) => {
    const { chats } = await Student.findById(id).lean();

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
        const subject = await Subject.create({
            code: current.code,
            class: current.class,
            name: current.name
        });

        hasSubjects.push(subject);
    }

    const subscribe = [];
    const canSubscribe = [];

    hasSubjects.forEach((subject, index) => {
        const { id, messages } = subject;

        if(messages.length > 0) {
            subject.messages = [messages[messages.length - 1]];
        }

        if(chats.includes(id)) {
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

module.exports = {
    syncSubjects
}