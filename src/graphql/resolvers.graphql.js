const Unicap = require('../controllers/unicap.controller');
const Auth = require('../controllers/auth.controller');

module.exports = {
    Query: {
        login: (_, { matricula, digito, senha }) => Auth.login({ matricula, digito, senha }),
        sync: (_, { session }, ctx) => Auth.sync({ id: ctx.userId, session }),
        test: (_, { session }) => Auth.test({ session }),
    },
}