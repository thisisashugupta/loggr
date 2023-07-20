import dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;
// import pg, { Pool, QueryResult } from 'pg';
dotenv.config();
const DBUSER = process.env.DBUSER || '';
const DATABASE = process.env.DATABASE || '';
const PASSWORD = process.env.PASSWORD || '';
const HOSTNAME = process.env.HOSTNAME || '';
const PORT_NUMBER = parseInt(process.env.PORT || '5432', 10);
// Creating a pool of connections
const pool = new Pool({
    user: DBUSER,
    host: HOSTNAME,
    database: DATABASE,
    password: PASSWORD,
    port: PORT_NUMBER,
});
// Throws an error on connection
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    console.log(client);
    process.exit(-1);
});
// User operations
export const showAllUsers = async () => {
    try {
        const query = 'SELECT * FROM users';
        const result = await pool.query(query);
        console.table(result.rows);
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching users:', error);
        // console.log(error);
        throw error; // Re-throw the error to be handled at a higher level
    }
};
export const getUser = async (user_id) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE user_id = $1;`, [user_id]);
        if (result.rows) {
            console.log(`user details of user_id=${user_id}`);
            console.table(result.rows);
        }
        else {
            console.log(`no user found with user_id=${user_id}`);
        }
        return result.rows;
    }
    catch (error) {
        console.log(`something went wrong in getUser \n${error}\nthis is not cool`);
    }
};
export const createUser = async (dob, username, email, passkey, name_first, name_last) => {
    try {
        const result = await pool.query(`INSERT INTO users (dateofbirth, username, email, passkey, name_first, name_last)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, [dob, username, email, passkey, name_first, name_last]);
        console.log(`new user added`);
        console.table(result.rows);
        return result.rows[0];
    }
    catch (error) {
        console.log(`something went wrong in createUser \n${error}\nthis is not cool`);
    }
};
export const updateUser = async (user_id, dateofbirth, username, email, passkey, name_first, name_last) => {
    try {
        const result = await pool.query(`UPDATE users SET 
      dateofbirth = $2,
      username = $3,
      email = $4,
      passkey = $5,
      name_first = $6,
      name_last = $7
    WHERE user_id = $1
    RETURNING *;
    `, [user_id, dateofbirth, username, email, passkey, name_first, name_last]);
        console.log(`user updated with id=${user_id}`);
        console.table(result.rows);
        return result.rows[0];
    }
    catch (error) {
        console.log(`something went wrong in updateUser \n${error}\nthis is not cool`);
    }
};
export const deleteUser = async (user_id, passkey) => {
    try {
        const result = await pool.query(`DELETE FROM users WHERE user_id = $1 and passkey = $2 RETURNING *;
    `, [user_id, passkey]);
        if (result.rows[0]) {
            console.log(`user deleted with id=${user_id}`);
            console.table(result.rows);
        }
        else {
            console.log(`user was not deleted with id=${user_id}`);
        }
        return result.rows[0];
    }
    catch (error) {
        console.log(`something went wrong in deleteUser \n${error}\nthis is not cool`);
    }
};
// task operations
export const getTasks = async (user_id) => {
    try {
        const result = await pool.query(`
    SELECT * FROM tasks WHERE user_id = $1;`, [user_id]);
        if (result.rows) {
            console.log(`showing all tasks`);
            console.table(result.rows);
        }
        else {
            console.log(`cannot show tasks`);
        }
        return result.rows;
    }
    catch (error) {
        console.log(`something went wrong in getTasks \n${error}\nthis is not cool`);
    }
};
export const createTask = async (user_id, title) => {
    try {
        const currentDate = new Date();
        const result = await pool.query(`
    INSERT INTO tasks (user_id, title, modified_at) VALUES ($1, $2, $3) RETURNING *;`, [user_id, title, currentDate]);
        if (result.rows[0]) {
            console.log(`added task`);
            console.table(result.rows);
        }
        else {
            console.log(`cannot add task`);
        }
        return result.rows[0];
    }
    catch (error) {
        console.log(`something went wrong in createTask \n${error}\nthis is not cool`);
    }
};
export const updateTask = async (task_id, title, checked) => {
    try {
        const currentDate = new Date();
        const result = await pool.query(`
    UPDATE tasks
    SET title = $2, checked = $3, modified_at = $4
    WHERE task_id = $1
    RETURNING *;`, [task_id, title, checked, currentDate]);
        if (result.rows[0]) {
            console.log(`updated task`);
            console.table(result.rows);
        }
        else {
            console.log(`cannot update task`);
        }
        return result.rows[0];
    }
    catch (error) {
        console.log(`something went wrong in updateTask \n${error}\nthis is not cool`);
    }
};
export const deleteTask = async (task_id) => {
    try {
        const result = await pool.query(`
    DELETE FROM tasks WHERE task_id = $1 RETURNING *;`, [task_id]);
        if (result.rows[0]) {
            console.log(`deleted task`);
            console.table(result.rows);
        }
        else {
            console.log(`cannot delete task`);
        }
        return result.rows[0];
    }
    catch (error) {
        console.log(`something went wrong in deleteTask \n${error}\nthis is not cool`);
    }
};
// bookmark operations
export const getBookmarks = async (user_id) => {
    try {
        const result = await pool.query(`
    SELECT * FROM bookmarks WHERE user_id = $1;`, [user_id]);
        if (result.rows) {
            console.log(`showing all bookmarks`);
            console.table(result.rows);
        }
        else {
            console.log(`cannot show bookmarks`);
        }
        return result.rows;
    }
    catch (error) {
        console.log(`something went wrong in getBookmarks \n${error}\nthis is not cool`);
    }
};
export const createBookmark = async (user_id, title, b_url, b_img) => {
    try {
        const currentDate = new Date();
        const result = await pool.query(`
    INSERT INTO bookmarks (title, b_url, b_img, user_id, modified_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [title, b_url, b_img, user_id, currentDate]);
        if (result.rows[0]) {
            console.log(`added bookmark`);
            console.table(result.rows);
        }
        else {
            console.log(`cannot add task`);
        }
        return result.rows[0];
    }
    catch (error) {
        console.log(`something went wrong in createBookmark \n${error}\nthis is not cool`);
    }
};
export const updateBookmark = async (bookmark_id, title, b_url, b_img) => {
    try {
        const currentDate = new Date();
        const result = await pool.query(`
    UPDATE bookmarks
    SET title = $2, b_url = $3, b_img = $4, modified_at = $5
    WHERE bookmark_id = $1
    RETURNING *;`, [bookmark_id, title, b_url, b_img, currentDate]);
        if (result.rows[0]) {
            console.log(`updated bookmark`);
            console.table(result.rows);
        }
        else {
            console.log(`cannot update bookmark`);
        }
        return result.rows[0];
    }
    catch (error) {
        console.log(`something went wrong in updateBookmark \n${error}\nthis is not cool`);
    }
};
export const deleteBookmark = async (bookmark_id) => {
    try {
        const result = await pool.query(`
    DELETE FROM bookmarks WHERE bookmark_id = $1 RETURNING *;`, [bookmark_id]);
        if (result.rows[0]) {
            console.log(`deleted bookmark`);
            console.table(result.rows);
        }
        else {
            console.log(`cannot delete bookmark`);
        }
        return result.rows[0];
    }
    catch (error) {
        console.log(`something went wrong in deleteBookmark \n${error}\nthis is not cool`);
    }
};
// Graceful shutdown
const closePool = async () => {
    console.log('Closing database pool...');
    try {
        await pool.end();
        console.log('Database pool closed.');
    }
    catch (error) {
        console.error('Error closing the database pool:', error);
    }
};
// Handle SIGINT signal for graceful shutdown
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Starting graceful shutdown...');
    await closePool();
    process.exit(0);
});
// const openClientConnection = async () => {
//   try {
//     await client.connect(); /* connecting to the database */
// console.log(
//   `Connected to PostgreSQL to database ${DATABASE} as user ${USER}`
// );
//   } catch (error) {
//   console.log(
//     `something went wrong in openConnection ${error} this is not cool`
//   );
// }
// };
// const closeClientConnection = async () => {
//   try {
//     await client.end(); /** finally will always be executed */
//     console.log("connection ended");
//   } catch (error) {
//     console.log(
//       `something went wrong in closeConnection \n ${error} this is not cool`
//     );
//   }
// };
// const createUser = async (
//   dob,
//   username,
//   email,
//   passkey,
//   name_first,
//   name_last
// ) => {
//   try {
//     // await openClientConnection();
//     // client.query(`BEGIN`);
//     const result = pool.query(
//       `INSERT INTO users (dateofbirth, username, email, passkey, name_first, name_last)
//     VALUES ($1, $2, $3, $4, $5, $6);`,
//       [dob, username, email, passkey, name_first, name_last]
//     );
//     console.log(`new user added, ${result}`);
//     // await client.query(`COMMIT`);
//   } catch (error) {
//     // await client.query(`ROLLBACK`);
//     console.log(
//       `something went wrong in createUser \n${error}\nthis is not cool`
//     );
//   }
//   //   await closeClientConnection();
//   // }
// };
// functions end here
// createUser(
//   `1973-12-21`,
//   "newusername",
//   "newusername@gmail.com",
//   "securepassword",
//   "Sunil Kumar",
//   "Gupta"
// );
// showAllUsers();
// updateUser(20, "1973-12-20", "Sunil", "G");
// deleteUser(20);
// at the end, close the pool
// (async () => {
//   await pool.end();
// })();
