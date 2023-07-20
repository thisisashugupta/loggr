// define the schema of the GraphQL API
export const typeDefs = `#graphql

  type Query {
    getAllUsers: [User]!
    getUser(user_id: Int!): User
    getTasks(user_id: Int!): [Task]!
    getBookmarks(user_id: Int!): [Bookmark]!
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

  type Task {
    task_id: ID!
    title: String!
    checked: Boolean!
    modified_at: String!
    user_id: Int!
  }

  type Bookmark {
    bookmark_id: ID!
    title: String
    b_url: String!
    b_img: String
    modified_at: String!
    user_id: Int!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(input: UpdateUserInput!): User
    deleteUser(input: DeleteUserInput!): User
    createTask(input: CreateTaskInput): Task
    updateTask(input: UpdateTaskInput): Task
    deleteTask(input: DeleteTaskInput): Task
    createBookmark(input: CreateBookmarkInput): Bookmark
    updateBookmark(input: UpdateBookmarkInput): Bookmark
    deleteBookmark(input: DeleteBookmarkInput): Bookmark
  }

  input DeleteBookmarkInput {
    bookmark_id: Int!
  }

  input UpdateBookmarkInput {
    bookmark_id: Int!
    title: String
    b_url: String!
    b_img: String
  }

  input CreateBookmarkInput {
    title: String!
    b_url: String!
    b_img: String
    user_id: Int!
  }

  input DeleteTaskInput {
    task_id: Int!
  }

  input UpdateTaskInput {
    task_id: Int!
    title: String!
    checked: Boolean!
  }

  input CreateTaskInput {
    user_id: Int!
    title: String!
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
