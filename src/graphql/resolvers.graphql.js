const Unicap = require('../controllers/unicap.controller');
const Auth = require('../controllers/auth.controller');

module.exports = {
    Query: {
        test: (_) => Auth.login({ matricula: '201413227', digito: '1', senha: '211914'}),
    },
}