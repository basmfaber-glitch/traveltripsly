import express from 'express';
import cors from 'cors';
import { getFlights } from './flights.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Flights endpoint via Aviasales
app.get('/api/flights', async (req, res) => {
  const q = (req.query.q || '').toString().toUpperCase(); // bv. AMS-BCN
  const month = (req.query.month || '').toString(); // YYYY-MM
  const maxPrice = parseFloat(req.query.maxPrice || '0');

  // Voorbeeld: q = 'AMS-BCN', split naar origin/destination
  const [origin, destination] = q.split('-');

  let flights = [];
  if (origin && destination) {
    flights = await getFlights(origin, destination, month ? `${month}-01` : undefined);
    if (!isNaN(maxPrice) && maxPrice > 0) {
      flights = flights.filter(f => f.price <= maxPrice);
    }
  }

  res.json(flights);
});

// Subscription endpoint
const subs = new Set();
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body || {};
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ ok: false, error: 'invalid_email' });
  subs.add(email.toLowerCase());
  res.json({ ok: true });
});

app.listen(PORT, () => console.log('Server running on port', PORT));
