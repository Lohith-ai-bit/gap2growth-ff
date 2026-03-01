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
  if (req.method !== "POST") {
    return json({ detail: "Method not allowed" }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ detail: "Invalid request body" }, 400);
  }

  const { resumeText, jobRole, jobDescription, fileName } = body;

  if (!resumeText || !jobRole) {
    return json({ detail: "resumeText and jobRole are required." }, 400);
  }

  // Return a 503 so the frontend falls back to its local rule-based analysis engine.
  // The frontend's analyzeResumeAI() catches errors and uses the local analyzeResume() instead.
  return json({ detail: "AI analysis not available. Using local engine." }, 503);
};

export const config = {
  path: "/api/analyze",
  method: "POST",
};
