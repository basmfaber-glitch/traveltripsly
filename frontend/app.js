
const form = document.getElementById('searchForm');
const dealsContainer = document.getElementById('deals');
const emptyContainer = document.getElementById('empty');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const origin = document.getElementById('origin').value.trim().toUpperCase();
  const destination = document.getElementById('destination').value.trim().toUpperCase();
  const month = document.getElementById('month').value;
  const maxPrice = document.getElementById('maxPrice').value;

  dealsContainer.innerHTML = '';
  emptyContainer.style.display = 'none';

  try {
    const res = await fetch(`/api/flights?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&month=${encodeURIComponent(month)}&maxPrice=${encodeURIComponent(maxPrice)}`);
    const flights = await res.json();

    if (!flights.length) {
      emptyContainer.style.display = 'block';
      return;
    }

    flights.forEach(flight => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${flight.origin} ✈️ ${flight.destination}</h3>
        <p>Vertrek: ${new Date(flight.date).toLocaleDateString()}</p>
        <p>Prijs: €${flight.price}</p>
        <p>Duur: ${flight.duration}</p>
        <a href="${flight.link}" target="_blank" class="book-btn">Boek nu</a>
      `;
      dealsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Fout bij ophalen vluchten:", err);
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
