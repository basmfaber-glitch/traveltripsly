import fetch from 'node-fetch';

const API_KEY = "59099027a3bb2294ff7762bdb872cd2e";

export async function getFlights(origin, destination) {
  if (!origin || !destination) return [];

  const url = `https://api.aviasales.com/v2/prices?origin=${origin}&destination=${destination}&currency=EUR&token=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Aviasales API error");
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) return [];

    return data.data.map((f, i) => ({
      id: `${f.origin}-${f.destination}-${i}`,
      origin: f.origin,
      destination: f.destination,
      date: f.departure_at,
      price: f.price,
      direct: f.transfers === 0,
      duration: `${Math.floor(f.duration / 60)}u ${f.duration % 60}m`,
      airline: f.airline || "Onbekend",
      image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1000&auto=format&fit=crop",
      link: `https://www.aviasales.com/${f.link || ""}`
    }));
  } catch (err) {
    console.error("Error fetching flights:", err.message);
    return [];
  }
}

