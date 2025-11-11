// backend/server.js
import express from "express";
import cors from "cors";
import { getFlights } from "./flights.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("../frontend")); // serve frontend

// Health check
app.get("/api/health", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// Flights endpoint
app.get("/api/flights", async (req, res) => {
  const origin = (req.query.origin || "").toUpperCase();
  const destination = (req.query.destination || "").toUpperCase();
  const maxPrice = parseFloat(req.query.maxPrice || "0");

  try {
    const flights = await getFlights(origin, destination, maxPrice);
    res.json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "API_ERROR" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
