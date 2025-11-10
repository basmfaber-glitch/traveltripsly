import express from "express";
import cors from "cors";
import { getFlights } from "./flights.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("✅ Flight API is running");
});

// Flights endpoint
app.get("/api/flights", async (req, res) => {
  const { origin, destination } = req.query;
  try {
    const flights = await getFlights(origin, destination);
    res.json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API_ERROR" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
