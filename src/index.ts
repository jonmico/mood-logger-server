import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/connection.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

try {
  await pool.getConnection();
  console.log("Database connected successfully.");
} catch (err) {
  console.error("Database connection failed:", err);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
