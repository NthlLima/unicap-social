// require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const path = require('path');
const cors = require('cors');

// const mongoose = require('mongoose');

// DATABASE
// mongoose.connect(
//     process.env.MONGO_URL,
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }
// );

// mongoose.set('useCreateIndex', true);

// SERVER
const typeDefs = path.resolve(__dirname, './graphql/schema.graphql');
const resolvers = require('./graphql/resolvers.graphql');

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: req => ({ ...req })
});

server.express.use(cors());
server.start();