const DEFAULT_AI_BACKEND = "https://gap2growth-ff.up.railway.app";

const HOP_BY_HOP_HEADERS = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
];

const baseHeaders = (req: Request) => {
  const headers = new Headers(req.headers);
  for (const header of HOP_BY_HOP_HEADERS) {
    headers.delete(header);
  }
  return headers;
};

const corsHeaders = (req: Request) => {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    req.headers.get("Access-Control-Request-Headers") || "*",
  );
  return headers;
};

const normalizeBase = (value?: string | null) =>
  (value || DEFAULT_AI_BACKEND).replace(/\/$/, "");

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }

  const backendBase = normalizeBase(process.env.AI_BACKEND_URL);
  const requestUrl = new URL(req.url);
  const upstreamPath = requestUrl.pathname.replace(/^\/api\/ai/, "");
  const upstreamUrl = new URL(`${upstreamPath}${requestUrl.search}`, backendBase);

  try {
    const headers = baseHeaders(req);
    const body = req.method === "GET" || req.method === "HEAD" ? undefined : req.body;

    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers,
      body,
      duplex: "half",
    });

    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const headers = corsHeaders(req);
    return Response.json(
      { error: "AI service is unreachable. Please try again shortly." },
      { status: 502, headers },
    );
  }
};

export const config = {
  path: "/api/ai/*",
};
