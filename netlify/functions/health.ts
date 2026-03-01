import { jsonResponse, corsHeaders } from "./lib/cors";

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("", { headers: corsHeaders });
  }

  return jsonResponse({ status: "ok", model_ready: true });
};
