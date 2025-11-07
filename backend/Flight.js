import fetch from 'node-fetch'; // alleen nodig als Node <18

const API_KEY = '59099027a3bb2294ff7762bdb872cd2e';

/**
 * Haal vluchten op van Aviasales
 * @param {string} origin - luchthaven code, bv. 'AMS'
 * @param {string} destination - luchthaven code, bv. 'BCN'
 */
export async function getFlights(origin, destination) {
  const url = `https://api.aviasales.com/v2/prices?origin=${origin}&destination=${destination}&token=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  // data aanpassen naar jouw frontend structuur
  return (data || []).map(f => ({
    id: f.id,
    origin: f.origin,
    destination: f.destination,
    date: f.departure_at,
    price: f.price,
    direct: f.direct,
    duration: f.duration,
    airline: f.airline,
    image: f.image || 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=1200&auto=format&fit=crop',
    link: f.link
  }));
}
