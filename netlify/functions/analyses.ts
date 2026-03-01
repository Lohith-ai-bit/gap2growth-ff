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
      "SELECT id, file_name, job_role, result, ai_powered, created_at FROM resume_analyses WHERE user_id = $1 ORDER BY created_at DESC",
      [payload.sub]
    );

    return jsonResponse(result.rows);
  } catch (err: unknown) {
    console.error("Analyses error:", err);
    return errorResponse("Internal server error.", 500);
  }
};
