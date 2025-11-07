// backend/flights.js
const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
const router = express.Router();

// Gebruik hier jouw Aviasales API key
const API_KEY = '59099027a3bb2294ff7762bdb872cd2e';

// Basis endpoint voor Aviasales (voorbeeld, pas eventueel aan volgens hun docs)
const API_URL = `https://api.aviasales.com/v2/prices/latest?token=${API_KEY}`;

// Endpoint om vluchten op te halen
router.get('/flights', async (req, res) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Aviasales API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data); // stuurt JSON terug naar frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kan vluchten niet ophalen' });
  }
});

module.exports = router;

