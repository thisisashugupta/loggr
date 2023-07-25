/*

client will send a request to fetch url's title and favicon
- client will send the title to the database 
- client will store the favicon in browser's local storage

const { Pool } = require("pg");

const pool = new Pool({
  user: "your_username",
  password: "your_password",
  host: "your_host",
  port: "your_port",
  database: "your_database",
});

const getUsers = async () => {
  try {
    const result = await pool.query("SELECT * FROM users");
    const users = result.rows;
    console.log(users);
  } catch (error) {
    console.error("Error executing SQL query:", error);
  }
};

getUsers();

const insertUser = async (username, email, password) => {
  try {
    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, password]
    );
    console.log("User inserted successfully");
  } catch (error) {
    console.error("Error executing SQL query:", error);
  }
};

insertUser("john", "john@example.com", "password");

const updateUser = async (userId, newUsername) => {
  try {
    await pool.query("UPDATE users SET username = $1 WHERE user_id = $2", [
      newUsername,
      userId,
    ]);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Error executing SQL query:", error);
  }
};

updateUser(1, "newusername");

const deleteUser = async (userId) => {
  try {
    await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error executing SQL query:", error);
  }
};

deleteUser(1);
 */
