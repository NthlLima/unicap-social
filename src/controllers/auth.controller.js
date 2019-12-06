const { getSessionId, getErros, getProfile, getSubjects } = require('../controllers/unicap.controller');
const Student = require('../controllers/student.controller');
const config = require('../configs/unicap.config');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const generateToken = (params = {}) => { 
    return jwt.sign(params, process.env.SECRET_JWT, { expiresIn: 86400 });
}

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

        // FAZER LOGIN OU FAZER CADASTRO
        const profile = await getProfile(data);
        const student = await Student.login(profile);
        
        return {
            student,
            session: profile.sessionId,
            token: generateToken({ id: student.id })
        };

    },

    async test({ session }) {
        // TEM QUE RETIRAR O Total de Cr&eacute;ditos 
        console.log(await getSubjects(session));
        return { result: ['success'] };
    }
}