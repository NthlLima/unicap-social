const config = require('../configs/unicap.config');
const axios = require('axios');

module.exports = {
    async rotina11(sessionId) {
        const params = new URLSearchParams();
        params.append('rotina', 11);

        try {
            const { data } = await axios.post(`${config.url}${sessionId}`, params);
            return data;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}