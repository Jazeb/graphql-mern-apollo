require('dotenv').config();
/* eslint-disable no-console */
const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config');

const pubsub = new PubSub();

const PORT = process.env.NODE_PORT;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // so we can access the request body in the context, so we can do stuff like checking for authentication in protected routes
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.log('CANNOT connect to mongodb')
    console.error(err);
  });
