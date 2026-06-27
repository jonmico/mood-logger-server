import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

const secret = new TextEncoder().encode(JWT_SECRET);

export default async function verifyToken(jwt: string) {
  const { payload } = await jose.jwtVerify(jwt, secret);

  return payload;
}
