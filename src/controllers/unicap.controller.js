const { getForm, removeTags, getBetweenArray, getArrayWithoutTags } = require('../libs/html.lib');
const config = require('../configs/unicap.config');
const Rotina = require('./rotina.controller');
const axios = require('axios');

const getAction = (html) => {
    const [ _, url ] = html.match(new RegExp('action="' + '(.*)' + '">'));
    const [ __, jsessionid ] = url.split('=');
    return jsessionid;
}

const getErros = (data) => {
    if(data.includes('Senha Inv&aacute;lida')){
        return 'Senha Inválida';
    } else if(data.includes('D&iacute;gito verificador Inv&aacute;lido')){
        return 'Dígito Verificador Inválido';
    } else if(data.includes('A Matr&iacute;cula informada est&aacute; incorreta')){
        return 'Dígito Verificador Inválido';
    } else {
        return null;
    }
}

const getSessionId = async() => {
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
        if(index >= indexStart) {
            if(i < attributes.length) {
                if(i === 0) subjects.push({});
                subjects[s][attributes[i]] = current;
                i++;
            }

            if(i === attributes.length) {
                i = 0;
                s++;
            }
        }
    });

    subjects.pop();

    return { sessionId: newSessionId, subjects };
}

module.exports = {
    getAction,
    getErros,
    getSessionId,
    getProfile,
    getSubjects
};