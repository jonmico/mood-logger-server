import pool from "../../db/connection.js";
import * as argon2 from "argon2";
import type { RowDataPacket } from "mysql2";
import signToken from "../../utils/signToken.js";
import { cookieOptions } from "../../utils/cookieOptions.js";
import type { Request, Response } from "express";

interface RegisterBody {
  email: string;
  firstName: string;
  password: string;
}

interface ExistingUserRows extends RowDataPacket {
  email: string;
}

interface UserRows extends RowDataPacket {
  id: string;
  email: string;
  first_name: string;
}

export async function register(
  req: Request<unknown, unknown, RegisterBody>,
  res: Response,
) {
  const { email, firstName, password } = req.body;

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

  await pool.query(
    "INSERT INTO users (email, first_name, password_hash) VALUES (?,?, ?)",
    [email, firstName, password_hash],
  );

  const [user] = await pool.query<UserRows[]>(
    "SELECT id, email, first_name FROM users WHERE email = ?",
    [email],
  );

  if (!user[0]) {
    return res
      .status(400)
      .send({ error: "Something has gone terribly wrong." });
  }

  const jwt = await signToken(user[0].id);

  return res
    .status(201)
    .cookie("jwt", jwt, cookieOptions)
    .send({ userId: user[0].id, firstName: user[0].first_name });
}
