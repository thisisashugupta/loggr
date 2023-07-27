import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from "@apollo/server/express4";
import { resolvers } from "./graphql/resolvers/resolvers.js";
import { typeDefs } from "./graphql/typeDefs/typeDefs.js";
dotenv.config();
const app = express();
const port = 1337;
const bootstrapServer = async () => {
    const apolloserver = new ApolloServer({ typeDefs, resolvers });
    await apolloserver.start();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/graphql", expressMiddleware(apolloserver));
    app.get("/", (req, res) => {
        res.send("Response received from Home route");
    });
    app.listen(port, () => {
        console.log(`🚀  Express ready at http://localhost:${port}`);
        console.log(`🚀  Graphql ready at http://localhost:${port}/graphql`);
    });
};
bootstrapServer();
// import { startStandaloneServer } from '@apollo/server/standalone';
// const apolloserver = new ApolloServer({ typeDefs, resolvers });
// const { url } = await startStandaloneServer(apolloserver, {
//     listen: { port: port },
// });
// console.log(`🚀  Apollo Server ready at: ${url}`);
