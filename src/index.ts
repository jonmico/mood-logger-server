import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/connection.js";
import { userRouter } from "./routes/auth.js";
import cookieParser from "cookie-parser";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT ?? 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

app.use(cors());
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

app.use("/api/auth", userRouter);

try {
  await pool.getConnection();
  console.log("Database connected successfully.");
} catch (err) {
  console.error("Database connection failed:", err);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
