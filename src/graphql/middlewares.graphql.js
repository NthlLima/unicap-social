const auth = require('../middlewares/auth.middleware');

module.exports = {
    Query: {
        sync: auth,
    },
    // Mutation: {

    // }
}