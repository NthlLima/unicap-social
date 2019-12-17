const { getForm, removeTags, getBetweenArray, getArrayWithoutTags } = require('../libs/html.lib');
const config = require('../configs/unicap.config');
const Rotina = require('./rotina.controller');
const axios = require('axios');

const getAction = (html) => {
    const [_, url] = html.match(new RegExp('action="' + '(.*)' + '">'));
    const [__, jsessionid] = url.split('=');
    return jsessionid;
}

const getErros = (data) => {
    if (data.includes('Senha Inv&aacute;lida')) {
        return 'Senha Inválida';
    } else if (data.includes('D&iacute;gito verificador Inv&aacute;lido')) {
        return 'Dígito Verificador Inválido';
    } else if (data.includes('A Matr&iacute;cula informada est&aacute; incorreta')) {
        return 'Dígito Verificador Inválido';
    } else {
        return null;
    }
}

const getSessionId = async () => {
    try {
        const { data } = await axios.get(config.prefix);
        return getAction(data);
    } catch (error) {
        console.error(error);
        return error;
    }
}

const getProfile = async (html) => {
    const sessionId = getAction(html);
    const rotina = await Rotina.rotina11(sessionId);
    const newSessionId = getAction(rotina);
    const form = getForm(rotina);

    const profile = {
        sessionId: newSessionId,
        academic: {
            matriculation: removeTags(form[12]),
            course: removeTags(form[16]),
            curriculum: removeTags(form[20]),
            shift: removeTags(form[24])
        },
        personal: {
            name: removeTags(form[31]),
            birthdate: removeTags(form[39]),
            naturalness: removeTags(form[43]),
        },
        documentation: {
            identity: removeTags(form[66]),
            cpf: removeTags(form[70]),
        },
        contact: {
            email: removeTags(form[108]),
            phone_1: removeTags(form[112]),
            phone_2: removeTags(form[116]),
        }
    }

    return profile;
}

const getSubjects = async (sessionId) => {
    const rotina = await Rotina.rotina21(sessionId);
    const newSessionId = getAction(rotina);
    const formatted = getArrayWithoutTags(getBetweenArray(getForm(rotina), '<table class="tab-main">', '</table>'));

    const indexStart = 8;
    const subjects = [];
    const attributes = ['code', 'name', 'class', 'classroom', 'schedule', 'charge_time', 'credits', 'period'];
    let i = 0, s = 0;

    formatted.forEach((current, index) => {
        if (index >= indexStart) {
            if (i < attributes.length) {
                if (i === 0) subjects.push({});
                subjects[s][attributes[i]] = current;
                i++;
            }

            if (i === attributes.length) {
                i = 0;
                s++;
            }
        }
    });

    subjects.pop();

    return { sessionId: newSessionId, subjects };
}

const sortSubjects = async (session) => {
    const { sessionId, subjects } = await getSubjects(session);

    const days = [];

    subjects.forEach((subject) => {
        const { schedule } = subject;
        const shifts = getShift(schedule);

        for (let s = 0; s < shifts.length; s++) {
            const shift = shifts[s];

            if (days.length > 0) {
                for (let i = 0; i < days.length; i++) {
                    const day = days[i];

                    if (shift !== day.shift) {
                        if (shift < day.shift) {
                            days.splice(i, 0, {
                                shift,
                                subject
                            });
                            break;
                        } else {
                            if (!days[i + 1]) {
                                days.push({
                                    shift,
                                    subject
                                });
                            }
                        }
                    }
                }

            } else {
                days.push({
                    shift,
                    subject
                });
            }
        }
    });

    return {
        sessionId,
        grade: days
    }
}
const formatGrade = (grade) => {
    const monday = [];
    const tuesday = [];
    const wednesday = [];
    const thursday = [];
    const friday = [];
    const saturday = [];

    grade.forEach((current, index) => {
        const { shift, subject } = current;
        const [ day, first, second ] = shift.split('');

        switch (day) {
            case '2':
                monday.push({
                    schedule: `${getSchedule(first, 0)} - ${getSchedule(second, 1)}`,
                    subject
                })                
                break;
            case '3':
                tuesday.push({
                    schedule: `${getSchedule(first, 0)} - ${getSchedule(second, 1)}`,
                    subject
                })                
                break;
            case '4':
                wednesday.push({
                    schedule: `${getSchedule(first, 0)} - ${getSchedule(second, 1)}`,
                    subject
                })                
                break;
            case '5':
                thursday.push({
                    schedule: `${getSchedule(first, 0)} - ${getSchedule(second, 1)}`,
                    subject
                })                
                break;
            case '6':
                friday.push({
                    schedule: `${getSchedule(first, 0)} - ${getSchedule(second, 1)}`,
                    subject
                })                
                break;
            case '7':
                saturday.push({
                    schedule: `${getSchedule(first, 0)} - ${getSchedule(second, 1)}`,
                    subject
                })                
                break;
        }  
    });

    return [ 
        {
            title: 'Segunda-feira',
            grade: monday
        }, {
            title: 'Terça-feira',
            grade: tuesday
        }, {
            title: 'Quarta-feira',
            grade: wednesday
        }, {
            title: 'Quinta-feira',
            grade: thursday
        }, {
            title: 'Sexta-feira',
            grade: friday
        }, {
            title: 'Sábado',
            grade: saturday
        }
    ];
}

const getShift = (schedule) => {
    const [ first, second ] = schedule.split(' ');
    return [ first, second ];
}

const getSchedule = (type, index) => {
    const schedules = {
        A: ['07:30', '08:20'],
        B: ['08:20', '09:10'],
        C: ['09:20', '10:10'],
        D: ['10:10', '11:00'],
        E: ['11:10', '12:00'],
        F: ['12:00', '12:50'],
        G: ['13:00', '13:50'],
        H: ['13:50', '14:40'],
        I: ['14:50', '15:40'],
        J: ['15:40', '16:30'],
        L: ['16:40', '17:30'],
        M: ['17:30', '18:20'],
        N: ['18:30', '19:20'],
        O: ['19:20', '20:10'],
        P: ['20:20', '21:10'],
        Q: ['21:10', '22:00'],
    }

    return schedules[type][index];
}

module.exports = {
    getAction,
    getErros,
    getSessionId,
    getProfile,
    getSubjects,
    sortSubjects,
    formatGrade
};