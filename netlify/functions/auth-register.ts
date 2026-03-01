import { getPool } from "./lib/db";
import { hashPassword, createAccessToken } from "./lib/auth";
import { jsonResponse, errorResponse, corsHeaders } from "./lib/cors";
import { randomUUID } from "crypto";

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("", { headers: corsHeaders });
  }

  try {
    const { name, email, password } = await req.json();

    if (!name?.trim()) {
      return errorResponse("Name is required.", 400);
    }
    if (!password || password.length < 6) {
      return errorResponse("Password must be at least 6 characters.", 400);
    }

    const pool = getPool();

    // Check if email already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    if (existing.rows.length > 0) {
      return errorResponse(
        "An account with this email already exists.",
        409
      );
    }

    const userId = randomUUID();
    const now = new Date().toISOString();

    await pool.query(
      "INSERT INTO users (id, name, email, password_hash, created_at) VALUES ($1, $2, $3, $4, $5)",
      [userId, name.trim(), email.toLowerCase().trim(), hashPassword(password), now]
    );

    const token = createAccessToken(userId, email.toLowerCase().trim());

    // Create session record
    await pool.query(
      "INSERT INTO sessions (id, user_id, token, is_active) VALUES ($1, $2, $3, $4)",
      [randomUUID(), userId, token, true]
    );

    return jsonResponse({
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        created_at: now,
      },
    });
  } catch (err: unknown) {
    console.error("Register error:", err);
    return errorResponse("Internal server error.", 500);
  }
};
