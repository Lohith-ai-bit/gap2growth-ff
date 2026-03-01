function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async () => {
  return json({ status: "ok" });
};

export const config = {
  path: "/api/health",
};
