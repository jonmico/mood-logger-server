import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pool from "./db/connection.js";
import { userRouter } from "./routes/auth.js";
import { moodsRouter } from "./routes/moods.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT ?? 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

app.use(cors());
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

app.use("/api/auth", userRouter);
app.use("/api/moods", moodsRouter);

try {
  await pool.getConnection();
  console.log("Database connected successfully.");
} catch (err) {
  console.error("Database connection failed:", err);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
