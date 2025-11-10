const API_KEY = "59099027a3bb2294ff7762bdb872cd2e";

export async function getFlights(origin, destination, month, maxPrice) {
  if (!origin || !destination) return [];

  // Using Travelpayouts / Aviasales prices endpoint - adjust if your plan uses other endpoints
  const url = `https://api.travelpayouts.com/v2/prices/latest?origin=${origin}&destination=${destination}&currency=EUR&token=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Aviasales API error ${response.status}`);
    const data = await response.json();

    // Adjust depending on returned structure; many endpoints use data.data or data.best_prices
    const items = data.data || data.best_prices || [];

    // Normalize & filter
    const results = (Array.isArray(items) ? items : Object.values(items))
      .filter(f => {
        if (month && f.departure_at && !f.departure_at.startsWith(month)) return false;
        if (maxPrice && f.value && f.value > maxPrice) return false;
        return true;
      })
      .map((f, i) => ({
        id: `${f.origin || origin}-${f.destination || destination}-${i}`,
        origin: f.origin || origin,
        destination: f.destination || destination,
        date: f.departure_at || f.departure_date || "",
        price: f.value || f.price || 0,
        direct: ("transfers" in f) ? (f.transfers === 0) : (f.direct || false),
        duration: f.duration ? `${Math.floor(f.duration/60)}u ${f.duration%60}m` : (f.flight_time || ""),
        airline: f.airline || f.airline_iata || "Onbekend",
        image: `https://source.unsplash.com/featured/?airplane,${f.destination || destination}`,
        link: f.link ? `https://aviasales.com/${f.link}` : "#"
      }));

    // sort by price asc
    results.sort((a,b) => (a.price||0)-(b.price||0));
    return results;
  } catch (err) {
    console.error("Error fetching flights:", err);
    return [];
  }
}