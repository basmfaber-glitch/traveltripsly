import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getFlights } from "./flights.js";

const app = express();
const PORT = process.env.PORT || 5000;

// __dirname fix voor ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// --- API Routes ---

// Healthcheck
app.get("/api/health", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// Flights endpoint
app.get("/api/flights", async (req, res) => {
  const origin = (req.query.origin || "").toUpperCase();
  const destination = (req.query.destination || "").toUpperCase();
  const month = req.query.month || "";
  const maxPrice = parseFloat(req.query.maxPrice) || 0;

  try {
    const flights = await getFlights(origin, destination, month, maxPrice);
    res.json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "API_ERROR" });
  }
});

// Subscription endpoint
const subs = new Set();
app.post("/api/subscribe", (req, res) => {
  const { email } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return res.status(400).json({ ok: false, error: "invalid_email" });
  subs.add(email.toLowerCase());
  res.json({ ok: true });
});

// --- Serve frontend ---
app.use(express.static(path.join(__dirname, "frontend")));

// Alle niet-API routes → index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// --- Start server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
