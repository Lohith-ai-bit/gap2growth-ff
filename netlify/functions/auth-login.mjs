import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NETLIFY_SITE_ID || "g2g-default-secret";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req) => {
  if (req.method !== "POST") {
    return json({ detail: "Method not allowed" }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ detail: "Invalid request body" }, 400);
  }

  const { email, password } = body;

  if (!email || !password) {
    return json({ detail: "Email and password are required." }, 400);
  }

  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    const rows = await sql`SELECT id, name, email, password_hash FROM users WHERE email = ${email.toLowerCase().trim()}`;
    if (rows.length === 0) {
      return json({ detail: "Invalid email or password." }, 401);
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return json({ detail: "Invalid email or password." }, 401);
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return json({ detail: "Login failed. Please try again." }, 500);
  }
};

export const config = {
  path: "/api/auth/login",
  method: "POST",
};
