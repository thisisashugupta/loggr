// import sql query functions from index.js module
import { showAllUsers, getUser, createUser, updateUser, deleteUser, getTasks, createTask, updateTask, deleteTask, getAllTaskGroups, getTaskGroup, createTaskGroup, updateTaskGroup, deleteTaskGroup, getBookmarks, createBookmark, updateBookmark, deleteBookmark } from "../../database/postg.js";
import { fetchWebpageInfo } from "../../fetching.js";
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
        getAllTaskGroups: async (parent, args) => {
            try {
                const { user_id } = args;
                return await getAllTaskGroups(user_id);
            }
            catch (error) {
                console.log(`Something went wrong in getTaskGroups query: \n${error}`);
                throw new Error('Failed to get All TaskGroups.');
            }
        },
        getTaskGroup: async (parent, args) => {
            try {
                const { tg_id } = args;
                return await getTaskGroup(tg_id);
            }
            catch (error) {
                console.log(`Something went wrong in getTaskGroup query: \n${error}`);
                throw new Error('Failed to get TaskGroup.');
            }
        },
        getTasks: async (parent, args) => {
            try {
                const { user_id } = args;
                return await getTasks(user_id);
            }
            catch (error) {
                console.log(`Something went wrong in getTasks query: \n${error}`);
                throw new Error('Failed to get tasks.');
            }
        },
        getBookmarks: async (parent, args) => {
            try {
                const { user_id } = args;
                return await getBookmarks(user_id);
            }
            catch (error) {
                console.log(`Something went wrong in getBookmarks query: \n${error}`);
                throw new Error('Failed to get bookmarks.');
            }
        }
    },
    Mutation: {
        // user
        createUser: async (parent, args) => {
            try {
                const { dateofbirth, username, email, passkey, name_first, name_last } = args.input;
                return await createUser(dateofbirth, username, email, passkey, name_first, name_last);
            }
            catch (error) {
                console.log(`Something went wrong in createUser mutation: \n${error}`);
                throw new Error('Failed to create user.');
            }
        },
        updateUser: async (parent, args) => {
            try {
                const { user_id, dateofbirth, username, email, passkey, name_first, name_last } = args.input;
                return await updateUser(user_id, dateofbirth, username, email, passkey, name_first, name_last);
            }
            catch (error) {
                console.log(`Something went wrong in updateUser mutation: \n${error}`);
                throw new Error('Failed to update user.');
            }
        },
        deleteUser: async (parent, args) => {
            try {
                const { user_id, passkey } = args.input;
                return await deleteUser(user_id, passkey);
            }
            catch (error) {
                console.log(`Something went wrong in deleteUser mutation: \n${error}`);
                throw new Error('Failed to delete user.');
            }
        },
        // TaskGroups
        createTaskGroup: async (parent, args) => {
            try {
                const { user_id, tg_name } = args.input;
                return await createTaskGroup(user_id, tg_name);
            }
            catch (error) {
                console.log(`Something went wrong in createTaskGroup mutation: \n${error}`);
                throw new Error('Failed to create TaskGroup.');
            }
        },
        updateTaskGroup: async (parent, args) => {
            try {
                const { tg_id, tg_name } = args.input;
                return await updateTaskGroup(tg_id, tg_name);
            }
            catch (error) {
                console.log(`Something went wrong in updateTaskGroup mutation: \n${error}`);
                throw new Error('Failed to update taskGroup.');
            }
        },
        deleteTaskGroup: async (parent, args) => {
            try {
                const { tg_id } = args.input;
                return await deleteTaskGroup(tg_id);
            }
            catch (error) {
                console.log(`Something went wrong in deleteTaskGroup mutation: \n${error}`);
                throw new Error('Failed to delete taskGroup.');
            }
        },
        // tasks
        createTask: async (parent, args) => {
            try {
                const { user_id, title } = args.input;
                return await createTask(user_id, title);
            }
            catch (error) {
                console.log(`Something went wrong in createTask mutation: \n${error}`);
                throw new Error('Failed to create task.');
            }
        },
        updateTask: async (parent, args) => {
            try {
                const { task_id, title, checked } = args.input;
                return await updateTask(task_id, title, checked);
            }
            catch (error) {
                console.log(`Something went wrong in updateTask mutation: \n${error}`);
                throw new Error('Failed to update task.');
            }
        },
        deleteTask: async (parent, args) => {
            try {
                const { task_id } = args.input;
                return await deleteTask(task_id);
            }
            catch (error) {
                console.log(`Something went wrong in deleteTask mutation: \n${error}`);
                throw new Error('Failed to delete task.');
            }
        },
        // bookmarks
        createBookmark: async (parent, args) => {
            try {
                const { user_id, b_url, title } = args.input;
                const answer = await fetchWebpageInfo(b_url);
                if (title)
                    return await createBookmark(user_id, title, b_url, answer.favicon);
                return await createBookmark(user_id, answer.title, b_url, answer.favicon);
            }
            catch (error) {
                console.log(`Something went wrong in createBookmark mutation: \n${error}`);
                throw new Error('Failed to create bookmark.');
            }
        },
        updateBookmark: async (parent, args) => {
            try {
                const { bookmark_id, title, b_url, b_img } = args.input;
                return await updateBookmark(bookmark_id, title, b_url, b_img);
            }
            catch (error) {
                console.log(`Something went wrong in updateBookmark mutation: \n${error}`);
                throw new Error('Failed to update bookmark.');
            }
        },
        deleteBookmark: async (parent, args) => {
            try {
                const { bookmark_id } = args.input;
                return await deleteBookmark(bookmark_id);
            }
            catch (error) {
                console.log(`Something went wrong in deleteBookmark mutation: \n${error}`);
                throw new Error('Failed to delete bookmark.');
            }
        },
    }
};
