import type { NextFunction, Request, Response } from "express";

export default function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // TODO: Write register controller.
  const { email, password } = req.body;

  console.log(email, password);

  res.send({ email, password });
}
