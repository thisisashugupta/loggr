import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;
// import {Pool} from 'pg';
console.log(process.env.USER);
console.log(process.env.USERNAME);
const DBUSER = process.env.DBUSER;
const DATABASE = process.env.DATABASE;
const PASSWORD = process.env.PASSWORD;
const HOSTNAME = process.env.HOSTNAME;
const PORT_NUMBER = parseInt(process.env.PORT);

console.log(DBUSER, DATABASE, PASSWORD, HOSTNAME, PORT_NUMBER);
console.log(typeof DBUSER, typeof DATABASE, typeof PASSWORD, typeof HOSTNAME, typeof PORT_NUMBER);

// creating a pool of connections
const pool = new Pool({
  user: DBUSER,
  host: HOSTNAME,
  database: DATABASE,
  password: PASSWORD,
  port: PORT_NUMBER,
});

// thows error on connection
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err); // your callback here
  console.log(client);
  process.exit(-1);
});

// user operations

export const showAllUsers = async () => {
  try {
    const allUsers = await pool.query(`SELECT * FROM users`);
    console.table(allUsers.rows);
    return allUsers.rows;
  } catch (error) {
    console.log(error);
  }
};



export const getUser = async (user_id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE user_id = $1;`,
      [user_id]
    );
    if (result.rows[0]) {
      console.log(`user details of user_id=${user_id}`);
      console.log(result.rows[0]);
    }
    else {
      console.log(`no user found with user_id=${user_id}`);
    }
    return result.rows[0];
  } catch (error) {
    console.log(`something went wrong in getUser \n${error}\nthis is not cool`);
  }
}

export const createUser = async (
  dob,
  username,
  email,
  passkey,
  name_first,
  name_last
) => {
  try {
    const result = await pool.query(
      `INSERT INTO users (dateofbirth, username, email, passkey, name_first, name_last)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [dob, username, email, passkey, name_first, name_last]
    );
    console.log(`new user added`);
    console.log(result.rows[0]);
    return result.rows[0];

  } catch (error) {
    console.log(
      `something went wrong in createUser \n${error}\nthis is not cool`
    );
  }
};

export const updateUser = async (user_id, dateofbirth, username, email, passkey, name_first, name_last) => {
  try {
    const result = await pool.query(
      `UPDATE users SET 
      dateofbirth = $2,
      username = $3,
      email = $4,
      passkey = $5,
      name_first = $6,
      name_last = $7
    WHERE user_id = $1
    RETURNING *;
    `,
      [user_id, dateofbirth, username, email, passkey, name_first, name_last]
    );
    console.log(`user updated with id=${user_id}`);
    console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.log(`something went wrong in updateUser \n${error}\nthis is not cool`);
  }
}

export const deleteUser = async (user_id, passkey) => {
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE user_id = $1 and passkey = $2 RETURNING *;
    `,
      [user_id, passkey]
    );
    if (result.rows[0]) {
      console.log(`user deleted with id=${user_id}`);
      console.log(result.rows[0]);
    }
    else {
      console.log(`user was not deleted with id=${user_id}`);
    }
    return result.rows[0];
  } catch (error) {
    console.log(`something went wrong in deleteUser \n${error}\nthis is not cool`);
  }
}


// const openClientConnection = async () => {
//   try {
//     await client.connect(); /* connecting to the database */
//     console.log(
//       `Connected to PostgreSQL to database ${DATABASE} as user ${USER}`
//     );
//   } catch (error) {
//     console.log(
//       `something went wrong in openConnection ${error} this is not cool`
//     );
//   }
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

// const showAllUsers = async () => {
//   try {
//     const allUsers = await pool.query(`SELECT * FROM users`);
//     console.table(allUsers.rows);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const updateUser = async (
//   user_id,
//   dateofbirth,
//   // username,
//   // email,
//   // passkey
//   name_first,
//   name_last
// ) => {
//   try {
//     const result = await pool.query(
//       `UPDATE users SET dateofbirth = $2, name_first = $3, name_last = $4 WHERE user_id = $1 RETURNING *;`,
//       [user_id, dateofbirth, name_first, name_last]
//     );
//     console.log(`Updated user:`);
//     console.table(result.rows);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const deleteUser = async (user_id) => {
//   try {
//     await pool.query(`DELETE FROM users WHERE user_id = $1`, [user_id]);
//   } catch (error) {
//     console.log(error);
//   }
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