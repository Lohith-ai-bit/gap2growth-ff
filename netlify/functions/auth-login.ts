import { getPool } from "./lib/db";
import { verifyPassword, createAccessToken } from "./lib/auth";
import { jsonResponse, errorResponse, corsHeaders } from "./lib/cors";
import { randomUUID } from "crypto";

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("", { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();
    const pool = getPool();

    const userResult = await pool.query(
      "SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );

    if (userResult.rows.length === 0) {
      return errorResponse("Invalid email or password.", 401);
    }

    const user = userResult.rows[0];

    if (!verifyPassword(password, user.password_hash)) {
      return errorResponse("Invalid email or password.", 401);
    }

    const token = createAccessToken(user.id, user.email);

    // Create session record
    await pool.query(
      "INSERT INTO sessions (id, user_id, token, is_active) VALUES ($1, $2, $3, $4)",
      [randomUUID(), user.id, token, true]
    );

    return jsonResponse({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    return errorResponse("Internal server error.", 500);
  }
};
