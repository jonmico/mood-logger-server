import type { Request, Response } from "express";
import pool from "../../db/connection.js";
import * as argon2 from "argon2";
import type { RowDataPacket } from "mysql2";
import signToken from "../../utils/signToken.js";
import { cookieOptions } from "../../utils/cookieOptions.js";
interface RegisterBody {
  email: string;
  password: string;
}

interface ExistingUserRows extends RowDataPacket {
  email: string;
}

interface UserRows extends RowDataPacket {
  id: string;
  email: string;
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

  const [existingUser] = await pool.query<ExistingUserRows[]>(
    "SELECT email FROM users WHERE email = ?",
    [email],
  );

  if (existingUser.length > 0) {
    return res
      .status(400)
      .json({ error: "A user with that email already exists." });
  }

  const password_hash = await argon2.hash(password, {
    secret: Buffer.from(process.env.PEPPER!),
  });

  await pool.query("INSERT INTO users (email, password_hash) VALUES (?, ?)", [
    email,
    password_hash,
  ]);

  const [user] = await pool.query<UserRows[]>(
    "SELECT id, email FROM users WHERE email = ?",
    [email],
  );

  if (!user[0]) {
    return res
      .status(400)
      .send({ message: "Something has gone terribly wrong." });
  }

  const jwt = await signToken(user[0].id);

  return res
    .status(201)
    .cookie("jwt", jwt, cookieOptions)
    .send({ message: "User successfully created." });
}
