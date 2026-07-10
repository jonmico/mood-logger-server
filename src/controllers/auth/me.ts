import type { Request, Response } from "express";

export async function me(req: Request, res: Response) {
  return res.send({ userId: req.userId });
}
