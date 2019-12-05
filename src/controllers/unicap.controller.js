const { getForm, removeTags } = require('../libs/html.lib');
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
    const form = getForm(rotina);

    // const profile = {
    //     academic: {
    //         matriculation: removeTags(form[12]),
    //         course: removeTags(form[16]),
    //         curriculum: removeTags(form[20]),
    //         shift: removeTags(form[24])
    //     },
    //     personal: {
    //         name: removeTags(form[31]),
    //         birthdate: removeTags(form[39]),
    //         naturalness: removeTags(form[43]),
    //     }, 
    //     documentation: {
    //         identity: removeTags(form[66]),
    //         cpf: removeTags(form[70]),
    //     },
    //     contact: {
    //         email: removeTags(form[]),
    //         phone_1: removeTags(form[]),
    //         phone_2: removeTags(form[]),

    //     }
    // }

    return form;
}




module.exports = {
    getAction,
    getErros,
    getSessionId,
    getProfile
};