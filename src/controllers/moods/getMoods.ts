import type { Request, Response } from "express";

export async function getMoods(req: Request, res: Response) {
  console.log(req);

  return res.json({ message: "You are in the getMoods controller!" });
}
