const config = require('../configs/unicap.config');
const auth = require('./auth.controller');
const axios = require('axios');

const getAction = (html) => {
    const [ action, url ] = html.match(new RegExp('action="' + '(.*)' + '">'));
    const [ prefix, jsessionid ] = url.split('=');
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

const Unicap = {
    async getSessionId() {
        
        try {
            const { data } = await axios.get(config.prefix);
            return getAction(data);
        } catch (error) {
            console.error(error);
            return error;
        }
    },
    async index() {
        console.log(auth.login({ matricula: '201413227', digito: '1', senha: '211914'}))

        return { result:'success'};
    },
}
module.exports = {
    getAction,
    getErros,
    Unicap
}