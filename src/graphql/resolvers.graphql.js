const Unicap = require('../controllers/unicap.controller');
const Auth = require('../controllers/auth.controller');
const Subject = require('../controllers/subjects.controller');
const Message = require('../controllers/message.controller');

module.exports = {
    Query: {
        test: (_, { session }) => Auth.test({ session }),
        messages: (_, { chat }) => Message.index({ chat }),
        subjects: (_, {  }, ctx) => Subject.getSubjects({ id: ctx.userId }),
        subscribes: (_, {  }, ctx) => Subject.getSubscribes({ id: ctx.userId }),
        sent: (_, { chat, message }, ctx) => Message.send({ id: ctx.userId, chat, message }),
    },
    Mutation: {
        login: (_, { matricula, digito, senha }) => Auth.login({ matricula, digito, senha }),
        subscription: (_, { subject }, ctx) => Subject.subscription({ subject, id: ctx.userId }),
        send: (_, { chat, message }, ctx) => Message.send({ id: ctx.userId, chat, message }),
        sync: (_, { session }, ctx) => Auth.sync({ id: ctx.userId, session }),
        message: (_, { chat, message }, { userId, pubsub }) => Message.send({ pubsub, id: userId, chat, message }),
    },
    Subscription: {
        messageSent: {
            subscribe: (root, args, { pubsub }) => {
                return pubsub.asyncIterator('CHAT_CHANNEL');
              }
        }
    }
}