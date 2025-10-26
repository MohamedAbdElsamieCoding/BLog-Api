import app from "./src/app.js";
import dotenv from "dotenv";
import db from "./src/config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;
const startServer = async () => {
  const [results] = await db.query("SELECT * FROM USERS");
  console.log(`Database connection test successful :`, results);

  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
};

startServer();
