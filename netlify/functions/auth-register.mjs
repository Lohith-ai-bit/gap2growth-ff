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

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return json({ detail: "Name, email, and password are required." }, 400);
  }

  if (password.length < 6) {
    return json({ detail: "Password must be at least 6 characters." }, 400);
  }

  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}`;
    if (existing.length > 0) {
      return json({ detail: "An account with this email already exists." }, 409);
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    await sql`
      INSERT INTO users (id, name, email, password_hash, created_at)
      VALUES (${userId}, ${name.trim()}, ${email.toLowerCase().trim()}, ${passwordHash}, NOW())
    `;

    // Generate JWT token
    const token = jwt.sign({ userId, email: email.toLowerCase().trim() }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return json({
      token,
      user: { id: userId, name: name.trim(), email: email.toLowerCase().trim() },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return json({ detail: "Registration failed. Please try again." }, 500);
  }
};

export const config = {
  path: "/api/auth/register",
  method: "POST",
};
