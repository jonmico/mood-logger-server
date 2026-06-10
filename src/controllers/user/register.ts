import type { Request, Response } from "express";
import pool from "../../db/connection.js";

export default async function register(req: Request, res: Response) {
  // TODO: Write register controller.
  const { email, password } = req.body;

  console.log(email, password);

  await pool.query("INSERT INTO users (email, password_hash) VALUES (?, ?)", [
    email,
    password,
  ]);

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  console.log(rows);

  res.send({ rows });
}
