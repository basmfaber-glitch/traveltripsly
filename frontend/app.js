// frontend app.js
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

    data.forEach(flight => {
  const card = document.createElement("div");
  card.className = "flight-card";
  card.innerHTML = `
    <h3>${flight.origin} ✈️ ${flight.destination}</h3>
    <p>Vertrek: ${new Date(flight.date).toLocaleDateString()}</p>
    <p>Prijs: €${flight.price}</p>
    <p>Duur: ${flight.duration}</p>
    <a href="${flight.link}" target="_blank" class="book-btn">Boek nu</a>
  `;
  resultsContainer.appendChild(card);
});

// Alerts form
const alertForm = document.getElementById('alertForm');
const alertMsg = document.getElementById('alertMsg');
if (alertForm) {
  alertForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const origin = document.getElementById('alert_origin').value.trim().toUpperCase();
    const destination = document.getElementById('alert_destination').value.trim().toUpperCase();
    const maxPrice = document.getElementById('alert_max').value;

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, origin, destination, maxPrice })
      });
      const data = await res.json();
      if (data.ok) {
        alertMsg.style.color = 'green';
        alertMsg.textContent = 'Je bent succesvol geabonneerd!';
        alertForm.reset();
      } else {
        alertMsg.style.color = 'red';
        alertMsg.textContent = 'Fout bij abonnement.';
      }
    } catch (err) {
      console.error('Fout bij abonnement:', err);
      alertMsg.style.color = 'red';
      alertMsg.textContent = 'Er is een fout opgetreden.';
    }
  });
}

// set year
document.getElementById('year').textContent = new Date().getFullYear();
