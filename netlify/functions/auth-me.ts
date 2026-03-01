import { getPool } from "./lib/db";
import { decodeToken } from "./lib/auth";
import { jsonResponse, errorResponse, corsHeaders } from "./lib/cors";

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse("Not authenticated. Please log in.", 401);
    }

    const token = authHeader.split(" ")[1];
    let payload: { sub: string; email: string };
    try {
      payload = decodeToken(token);
    } catch {
      return errorResponse("Session expired.", 401);
    }

    const pool = getPool();
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [payload.sub]
    );

    if (result.rows.length === 0) {
      return errorResponse("User not found.", 401);
    }

    const user = result.rows[0];
    return jsonResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (err: unknown) {
    console.error("Auth me error:", err);
    return errorResponse("Internal server error.", 500);
  }
};
