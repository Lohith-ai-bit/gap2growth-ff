import crypto from "crypto";
import jwt from "jsonwebtoken";

const SALT = "gap2growth_salt";
const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-gap2growth";

export function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + SALT, "utf-8")
    .digest("hex");
}

export function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): boolean {
  return hashPassword(plainPassword) === hashedPassword;
}

export function createAccessToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

export function decodeToken(
  token: string
): { sub: string; email: string } {
  return jwt.verify(token, SECRET_KEY, {
    algorithms: ["HS256"],
  }) as { sub: string; email: string };
}
