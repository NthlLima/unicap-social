// require('dotenv').config();

import { GraphQLServer } from 'graphql-yoga';
import path from 'path';
// import mongoose from 'mongoose';
import resolvers from './graphql/resolvers.graphql';

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

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    // context: req => ({ ...req })
});

server.express.use(cors());
server.start();