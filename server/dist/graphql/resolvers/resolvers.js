// import sql query functions from index.js module
import { showAllUsers, getUser, createUser, updateUser, deleteUser } from "../../database/postg.js";
export const resolvers = {
    Query: {
        getAllUsers: async (parent, args) => {
            try {
                return await showAllUsers();
            }
            catch (error) {
                console.log(`Something went wrong in getAllUsers query: \n${error}`);
                throw new Error('Failed to get all users.');
            }
        },
        getUser: async (parent, args) => {
            try {
                const { user_id } = args;
                return await getUser(user_id);
            }
            catch (error) {
                console.log(`Something went wrong in getUser query: \n${error}`);
                throw new Error('Failed to get user.');
            }
        },
    },
    Mutation: {
        createUser: async (parent, args) => {
            try {
                const { createUserInput } = args;
                console.log(`createUserInput recceived from client`);
                console.log(createUserInput);
                const { dateofbirth, username, email, passkey, name_first, name_last } = createUserInput;
                const result = await createUser(dateofbirth, username, email, passkey, name_first, name_last);
                console.log(`create user result form mutation in resolvers`);
                console.log(result);
                return result;
            }
            catch (error) {
                console.log(`Something went wrong in createUser mutation: \n${error}`);
                throw new Error('Failed to create user.');
            }
        },
        updateUser: async (parent, args) => {
            try {
                const { updateUserInput } = args;
                console.log(`updateUserInput recceived from client`);
                console.log(updateUserInput);
                const { user_id, dateofbirth, username, email, passkey, name_first, name_last } = updateUserInput;
                const result = await updateUser(user_id, dateofbirth, username, email, passkey, name_first, name_last);
                return result;
            }
            catch (error) {
                console.log(`Something went wrong in updateUser mutation: \n${error}`);
                throw new Error('Failed to update user.');
            }
        },
        deleteUser: async (parent, args) => {
            try {
                const { user_id, passkey } = args.deleteUserInput;
                // console.log(`deleteUserInput recceived from client`);
                // console.log(deleteUserInput);
                // const { user_id, dateofbirth, username, email, passkey, name_first, name_last } = deleteUserInput;
                const result = await deleteUser(user_id, passkey);
                return result;
            }
            catch (error) {
                console.log(`Something went wrong in deleteUser mutation: \n${error}`);
                throw new Error('Failed to delete user.');
            }
        },
    }
};
