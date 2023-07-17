// define the schema of the GraphQL API
export const typeDefs = `#graphql
  type Query {
    getAllUsers: [User]
    getUser(user_id: Int!): User
  }

  type User {
    user_id: ID!
    dateofbirth: String!
    username: String!
    email: String!
    passkey: String!
    name_first: String!
    name_last: String
  }

  type Mutation {
    createUser(createUserInput: CreateUserInput!): User
    updateUser(updateUserInput: UpdateUserInput!): User
    deleteUser(deleteUserInput: DeleteUserInput!): User
  }

  input DeleteUserInput{
    user_id: Int!
    passkey: String!
  }

  input UpdateUserInput {
    user_id: Int!
    dateofbirth: String!
    username: String!
    email: String!
    passkey: String!
    name_first: String!
    name_last: String
  }

  input CreateUserInput {
    dateofbirth: String!
    username: String!
    email: String!
    passkey: String!
    name_first: String!
    name_last: String
  }
`;
