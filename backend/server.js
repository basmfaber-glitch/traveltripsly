import express from "express";
import cors from "cors";
import { getFlights } from "./flights.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Healthcheck endpoint
app.get("/api/health", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// Flights endpoint met filters
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

// Start server
app.listen(PORT, () => console.log("Server running on port", PORT));
