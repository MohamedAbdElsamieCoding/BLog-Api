import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "blog_api",
});
pool.getConnection((err, connection) => {
  if (err) {
    console.log(`DB connection failed : ${err}`);
  } else {
    console.log(`Connected to DB`);
    connection.release();
  }
});
const db = pool.promise();
export default db;
