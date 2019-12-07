require('dotenv').config();

const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

//DATABASE
mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

mongoose.set('useCreateIndex', true);
console.log('Database Connected');

// SERVER
const typeDefs = path.resolve(__dirname, './graphql/schema.graphql');
const resolvers = require('./graphql/resolvers.graphql');
const middlewares = require('./graphql/middlewares.graphql');

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: req => ({ ...req }),
    middlewares: [middlewares],
});

server.express.use(cors());
server.start();