import { neon } from "@neondatabase/serverless";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NETLIFY_SITE_ID || "g2g-default-secret";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getUserId(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(authHeader.slice(7), JWT_SECRET);
    return payload.userId;
  } catch {
    return null;
  }
}

export default async (req) => {
  const userId = getUserId(req);
  if (!userId) {
    return json([], 200);
  }

  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  try {
    const rows = await sql`
      SELECT id, job_role, skill_score, dna_score, matched_skills, missing_skills, result, created_at
      FROM analyses
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
    `;
    return json(rows);
  } catch (err) {
    console.error("Analyses fetch error:", err);
    return json([], 200);
  }
};

export const config = {
  path: "/api/analyses",
};
