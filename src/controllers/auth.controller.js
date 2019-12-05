const { getSessionId, getErros, getProfile } = require('../controllers/unicap.controller');
const config = require('../configs/unicap.config');
const axios = require('axios');

module.exports = {
    async login({ matricula, digito, senha }) {
        const sessionId = await getSessionId();
        const params = new URLSearchParams();
        params.append('Matricula', matricula);
        params.append('Digito', digito);
        params.append('Senha', senha);
        params.append('rotina', 1);

        const { data } = await axios.post(`${config.url}${sessionId}`, params);
        const hasError = getErros(data);
        if(hasError) {
            return { result: hasError };
        }


        // console.log(await getProfile(data));
        

        return { result: await getProfile(data) };
    }
}