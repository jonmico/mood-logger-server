import type { Request, Response } from "express";
import pool from "../../db/connection.js";
import type { RowDataPacket } from "mysql2";

interface MeRows extends RowDataPacket {
  first_name: string;
}

export async function me(req: Request, res: Response) {
  const [userRow] = await pool.query<MeRows[]>(
    "SELECT first_name FROM users WHERE id = ?",
    [req.userId],
  );

  const user = userRow[0];

  if (!user) {
    return res.status(500).send({ error: "Error finding user." });
  }

  return res.send({ userId: req.userId, firstName: user.first_name });
}
