const fetch = require('node-fetch');

const AVIASALES_API_KEY = '59099027a3bb2294ff7762bdb872cd2e'; // jouw API-key

/**
 * Haal vluchten op van Aviasales
 * @param {string} origin - luchthaven code, bv. 'AMS'
 * @param {string} destination - luchthaven code, bv. 'BCN'
 * @param {string} date - YYYY-MM-DD
 */
export async function getFlights(origin, destination, date) {
  try {
    const url = `https://api.travelpayouts.com/v2/prices/latest?origin=${origin}&destination=${destination}&depart_date=${date}&currency=EUR&token=${AVIASALES_API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Aviasales API error: ${response.status}`);
    }

    const data = await response.json();

    // Data omvormen naar frontend-vriendelijk formaat
    const flights = data.data ? Object.values(data.data).map(f => ({
      id: `${f.origin}-${f.destination}-${f.depart_date}`,
      origin: f.origin,
      destination: f.destination,
      date: f.depart_date,
      price: f.value,
      direct: f.direct,
      airline: f.airline || 'Onbekend',
      duration: f.duration ? `${Math.floor(f.duration/60)}u ${f.duration%60}m` : '',
      image: `https://source.unsplash.com/featured/?airplane,${f.destination}`,
      link: `https://www.aviasales.com/search/${f.origin}${f.depart_date.replace(/-/g,'')}${f.destination}1`
    })) : [];

    return flights;

  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
}
