import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from "./graphql/resolvers/resolvers.js";
import { typeDefs } from "./graphql/typeDefs/typeDefs.js";

const apolloserver = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(apolloserver, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);