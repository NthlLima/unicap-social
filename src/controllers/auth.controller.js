const { getSessionId, getErros, getProfile, getSubjects, sortSubjects, formatGrade } = require('../controllers/unicap.controller');
const { syncSubjects } = require('../controllers/subjects.controller');
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
            throw new Error(hasError);
        }

        // FAZER LOGIN OU FAZER CADASTRO
        const profile = await getProfile(data);
        const student = await Student.login(profile);
        
        return {
            student,
            session: profile.sessionId,
            token: generateToken({ id: student._id })
        };

    },

    async sync({ id, session }){
        const { sessionId, subjects } = await getSubjects(session);
        const { subscribe, canSubscribe } = await syncSubjects(id, subjects);

        return {
            session: sessionId,
            subscribe,
            canSubscribe
        }
    },

    async schedule({ session }) {
        const { sessionId, grade } = await sortSubjects(session);
        const formated = formatGrade(grade);

        return {
            session: sessionId,
            schedules: formated
        }
    },

    async test({ session }) {    
        const { sessionId, grade } = await sortSubjects(session);
        const formated = formatGrade(grade);
        


        return formated;
    }
}

