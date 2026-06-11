import type { Request, Response } from "express";
import pool from "../../db/connection.js";
import type { RowDataPacket } from "mysql2";
import * as argon2 from "argon2";

interface RegisterBody {
  email: string;
  password: string;
}

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  created_at: Date;
}

export default async function register(
  req: Request<unknown, unknown, RegisterBody>,
  res: Response,
) {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password.trim()
  ) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const [existingUser] = await pool.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
  );

  if (Array.isArray(existingUser) && existingUser.length > 0) {
    return res
      .status(400)
      .json({ error: "A user with that email already exists." });
  }

  // TODO: Add a salt to this.
  const password_hash = await argon2.hash(password);

  console.log(password_hash);

  await pool.query("INSERT INTO users (email, password_hash) VALUES (?, ?)", [
    email,
    password_hash,
  ]);

  const [user] = await pool.query<UserRow[]>(
    "SELECT email, id, created_at FROM users WHERE email = ?",
    [email],
  );

  console.log(user);

  return res.send({ user });
}
