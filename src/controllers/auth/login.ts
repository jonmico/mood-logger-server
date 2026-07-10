import type { Request, Response } from "express";
import pool from "../../db/connection.js";
import type { RowDataPacket } from "mysql2";
import * as argon2 from "argon2";
import signToken from "../../utils/signToken.js";
import { cookieOptions } from "../../utils/cookieOptions.js";

interface RequestBody {
  email: string;
  password: string;
}

interface ExistingUserRows extends RowDataPacket {
  email: string;
  password_hash: string;
  id: string;
}

export async function login(
  req: Request<unknown, unknown, RequestBody>,
  res: Response,
) {
  const { email, password } = req.body;

  const [existingUserRows] = await pool.query<ExistingUserRows[]>(
    "SELECT email, password_hash, id FROM users WHERE email = ?",
    [email],
  );

  const existingUser = existingUserRows[0];

  if (!existingUser) {
    return res.status(404).send({ message: "User does not exist." });
  }

  const result = await argon2.verify(existingUser.password_hash, password, {
    secret: Buffer.from(process.env.PEPPER!),
  });

  if (!result) {
    return res.status(403).send({ message: "Incorrect password." });
  }

  const jwt = await signToken(existingUser.id);

  return res
    .cookie("jwt", jwt, cookieOptions)
    .send({ message: "Successfully logged in." });
}
