/*
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { readFileSync } from "fs";
import path from 'path';
*/
import { resolvers } from "./resolvers/resolvers.js";
import { typeDefs } from "./typeDefs/typeDefs.js";

export { typeDefs, resolvers }
/*
const userTypes = readFileSync(path.join(__dirname, "./typeDefs/user.graphql"), {
    encoding: "utf-8",
});
const taskTypes = readFileSync(path.join(__dirname, "./typeDefs/task.graphql"), {
    encoding: "utf-8",
});
const bookmarkTypes = readFileSync(path.join(__dirname, "./typeDefs/bookmark.graphql"), {
    encoding: "utf-8",
});

export const typeDefs = `
    ${userTypes}
    ${taskTypes}
    ${bookmarkTypes}
`;

export const resolvers = {
    Query: {},
    Mutation: {},
};
*/

