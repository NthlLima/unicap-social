const config = require('../configs/unicap.config');
const { Unicap } = require('./unicap.controller');
const axios = require('axios');

module.exports = {
    async login({ matricula, digito ,senha }) {
        const sessionId = await Unicap.getSessionId();

        try {
            const { data } = await axios.post(`${config.url}${sessionId}`, {
                Matricula: matricula,
                Digito: digito,
                Senha: senha,
                rotina: '1'
            });

            console.log(data);
        } catch (error) {
            console.error(error);
        }

        return { result:'success'};
    }
}