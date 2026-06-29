// proxy.js — minimal CORS proxy for the WHOOP dashboard.
// Forwards requests to the WHOOP API so the browser doesn't hit CORS errors.
//
//   node proxy.js
//
// Then open the dashboard and it will call http://localhost:8787 instead of
// the WHOOP API directly. No dependencies — Node 18+ only.

const http = require("http");

const PORT = 8787;
const TARGET = "https://api.prod.whoop.com";

const server = http.createServer(async (req, res) => {
  // Preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

  try {
    const upstream = await fetch(TARGET + req.url, {
      method: req.method,
      headers: { Authorization: req.headers["authorization"] || "" },
    });
    const body = await upstream.text();
    res.writeHead(upstream.status, { "Content-Type": "application/json" });
    res.end(body);
  } catch (err) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "proxy_failed", message: String(err) }));
  }
});

server.listen(PORT, () => {
  console.log(`WHOOP proxy running at http://localhost:${PORT}`);
  console.log(`Forwarding to ${TARGET}`);
});
