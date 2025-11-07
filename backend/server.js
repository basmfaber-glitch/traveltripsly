import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // npm install node-fetch@2

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Aviasales API key
const API_KEY = '59099027a3bb2294ff7762bdb872cd2e';

// Health endpoint
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Flights endpoint via Aviasales
app.get('/api/flights', async (req, res) => {
  try {
    const q = (req.query.q || '').toString().toLowerCase();
    const month = (req.query.month || '').toString();
    const maxPrice = parseFloat(req.query.maxPrice || '0');

    // Basis API URL (pas evt. parameters aan)
    const API_URL = `https://api.aviasales.com/v2/prices/latest?token=${API_KEY}`;

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Aviasales API error: ${response.status}`);
    let flights = await response.json();

    // Filteren lokaal op bestemming/origin, maand, maxPrice
    if (q) flights = flights.filter(f => 
      (f.destination && f.destination.toLowerCase().includes(q)) || 
      (f.origin && f.origin.toLowerCase().includes(q))
    );
    if (month && month.length === 7) flights = flights.filter(f => f.date.startsWith(month));
    if (!isNaN(maxPrice) && maxPrice > 0) flights = flights.filter(f => f.price <= maxPrice);

    // Sorteer op prijs
    flights = flights.sort((a, b) => a.price - b.price);

    res.json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kan vluchten niet ophalen' });
  }
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
