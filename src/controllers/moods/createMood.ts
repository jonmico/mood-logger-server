import type { Request, Response } from "express";
import pool from "../../db/connection.js";
import type { ResultSetHeader } from "mysql2";

interface RequestBody {
  mood: number;
  text: string;
  userId: string;
}

export async function createMood(
  req: Request<unknown, unknown, RequestBody>,
  res: Response,
) {
  const { mood, text } = req.body;

  if (!mood) {
    return res.status(400).json({ error: "A mood rating is required." });
  }

  if (mood < 1 || mood > 5) {
    return res
      .status(400)
      .json({ error: "The mood rating must fall between 1 and 5." });
  }

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO moods (mood, notes, user_id) VALUES (?, ?, ?)",
    [mood, text, req.userId],
  );

  if (result.affectedRows !== 1) {
    return res
      .status(500)
      .json({ error: "Something went wrong adding this mood." });
  }

  return res.status(201).json({ message: "Mood created successfully." });
}
