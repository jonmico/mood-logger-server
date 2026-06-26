import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

const secret = new TextEncoder().encode(JWT_SECRET);

export default async function signToken(userId: string) {
  const jwt = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2 weeks")
    .sign(secret);

  return jwt;
}
