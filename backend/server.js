import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getFlights } from "./flights.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve frontend (frontend directory is sibling of backend)
app.use(express.static(path.join(__dirname, "../frontend")));

// Healthcheck
app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Flights endpoint with filters
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

// Subscribe endpoint (simple in-memory)
const subs = new Set();
app.post("/api/subscribe", (req, res) => {
  const { email, origin, destination, maxPrice } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ ok: false, error: "invalid_email" });
  subs.add(email.toLowerCase());
  console.log("Subscribed:", email, origin, destination, maxPrice);
  res.json({ ok: true });
});

// Fallback - serve index.html for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));