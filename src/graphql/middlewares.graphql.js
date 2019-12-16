const auth = require('../middlewares/auth.middleware');

module.exports = {
    Query: {
        messages: auth,
        subjects: auth,
        subscribes: auth,
        sent: auth,
    },
    Mutation: {
        subscription: auth,
        send: auth,
        sync: auth,
        message: auth,
    }
}