import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import pool from "../../db/connection.js";

interface MoodsRows extends RowDataPacket {
  id: string;
  user_id: string;
  mood: number;
  notes: string;
  created_at: string;
}

export async function getMoods(req: Request, res: Response) {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

  const [moods] = await pool.query<MoodsRows[]>(
    `SELECT id, user_id, mood, notes, created_at
    FROM moods
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?`,
    [req.userId, limit],
  );

  return res.json({ moods });
}
