import fetch from "node-fetch";

const API_KEY = "59099027a3bb2294ff7762bdb872cd2e";

export async function getFlights(origin, destination, maxPrice) {
  if (!origin || !destination) return [];

  const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&destination=${destination}&currency=EUR&token=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Aviasales API error");
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) return [];

    let flights = data.data.map((f, i) => ({
      id: `${f.origin}-${f.destination}-${i}`,
      origin: f.origin,
      destination: f.destination,
      date: f.departure_at,
      price: f.price,
      direct: f.transfers === 0,
      duration: `${Math.floor(f.duration / 60)}u ${f.duration % 60}m`,
      airline: f.airline || "Onbekend",
      image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1000&auto=format&fit=crop",
      link: f.link ? `https://aviasales.com${f.link}` : `https://aviasales.com`,
    }));

    if (maxPrice) flights = flights.filter(f => f.price <= maxPrice);
    return flights.sort((a, b) => a.price - b.price);
  } catch (err) {
    console.error("Error fetching flights:", err.message);
    return [];
  }
}