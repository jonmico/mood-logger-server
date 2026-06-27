import type { Request, Response, NextFunction } from "express";
import verifyToken from "../utils/verifyToken.js";
import * as jose from "jose";

export default async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { jwt } = req.signedCookies;

  if (!jwt) {
    return res.status(401).send({ message: "Not authenticated." });
  }

  try {
    const payload = await verifyToken(jwt);

    req.userId = payload.userId as string;

    return next();
  } catch (err) {
    if (err instanceof jose.errors.JWTExpired) {
      return res.status(401).send({ message: "Token expired." });
    } else if (err instanceof jose.errors.JWSInvalid) {
      return res.status(401).send({ message: "Token is malformed" });
    } else if (err instanceof jose.errors.JWSSignatureVerificationFailed) {
      return res.status(401).send({ message: "Token is tampered." });
    } else {
      return res
        .status(500)
        .send({ message: "Something went wrong verifying the token." });
    }
  }
}
