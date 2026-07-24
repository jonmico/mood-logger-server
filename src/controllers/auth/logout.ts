import type { Request, Response } from "express";
import { cookieOptions } from "../../utils/cookieOptions.js";

export async function logout(_: Request, res: Response) {
  res.clearCookie("jwt", cookieOptions).json({ message: "Logged out." });
}
