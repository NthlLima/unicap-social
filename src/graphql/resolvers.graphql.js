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
        message: (_, { chat, message }, { userId, pubsub }) => Message.send({ pubsub, id: userId, chat, message }),
        schedule: (_, { session }, ctx) => Auth.schedule({ session }),
        send: (_, { chat, message }, ctx) => Message.send({ id: ctx.userId, chat, message }),
        subscription: (_, { subject }, { userId, pubsub }) => Subject.subscription({ subject, id: userId, pubsub }),
        sync: (_, { session }, ctx) => Auth.sync({ id: ctx.userId, session }),
    },
    Subscription: {
        messageSent: {
            subscribe: (root, args, { pubsub }) => {
                return pubsub.asyncIterator('CHAT_CHANNEL');
              }
        },
        subjectSubscribed: {
            subscribe: (root, args, { pubsub }) => {
                return pubsub.asyncIterator('SUBJECT_SUBSCRIBED');
              }
        },
    }
}