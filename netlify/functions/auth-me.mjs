import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NETLIFY_SITE_ID || "g2g-default-secret";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return json({ detail: "Unauthorized" }, 401);
  }

  const token = authHeader.slice(7);
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return json({ detail: "Session expired." }, 401);
  }

  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    const rows = await sql`SELECT id, name, email FROM users WHERE id = ${payload.userId}`;
    if (rows.length === 0) {
      return json({ detail: "User not found." }, 404);
    }

    return json(rows[0]);
  } catch (err) {
    console.error("Auth me error:", err);
    return json({ detail: "Server error." }, 500);
  }
};

export const config = {
  path: "/api/auth/me",
};
