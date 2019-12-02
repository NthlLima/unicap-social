const config = require('../configs/unicap.config');
const { getSessionId } = require('../controllers/unicap.controller');
const axios = require('axios');

module.exports = {
    async login({ matricula, digito ,senha }) {
        const sessionId = await getSessionId();
        const params = new URLSearchParams();
        params.append('Matricula', matricula);
        params.append('Digito', digito);
        params.append('Senha', senha);
        params.append('rotina', 1);
        
        try {
            const { status, data } = await axios.post(`${config.url}${sessionId}`, params);
            return { result:data };
        } catch (error) {
            return { result:error };
        }
    }
}