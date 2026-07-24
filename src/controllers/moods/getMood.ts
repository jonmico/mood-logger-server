import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import type { Mood } from "../../types/mood.js";
import pool from "../../db/connection.js";

interface MoodRow extends RowDataPacket, Mood {}

export async function getMood(req: Request, res: Response) {
  const { id } = req.params;

  const [mood] = await pool.query<MoodRow[]>(
    `select *
    from moods
    where id = ?`,
    [id],
  );

  if (!mood[0]) {
    return res.status(404).json({ error: "Mood not found." });
  }

  return res.json({ mood: mood[0] });
}
