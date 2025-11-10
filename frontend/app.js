// Vluchten zoeken
const form = document.getElementById("searchForm");
const resultsDiv = document.getElementById("results");
const dealsContainer = document.getElementById('deals');
const emptyContainer = document.getElementById('empty');

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const origin = document.getElementById("origin").value.trim();
  const destination = document.getElementById("destination").value.trim();
  const month = document.getElementById('month').value; // 'YYYY-MM'
  const maxPrice = document.getElementById('maxPrice').value;
  resultsDiv.innerHTML = "Laden...";

  dealsContainer.innerHTML = '';
  emptyContainer.style.display = 'none';

  try {
    const res = await fetch(`/api/flights?origin=${origin}&destination=${destination}&month=${month}&maxPrice=${maxPrice}`);
    const flights = await res.json();

    if (!flights.length) {
      emptyContainer.style.display = 'block';
      return;
    }

    resultsDiv.innerHTML = flights
      .map(
        (f) => `
        <div class="card">
          <h3>${f.origin} ✈️ ${f.destination}</h3>
          <p>€${f.price} — ${f.duration}</p>
          <p>${f.date}</p>
          <a href="${f.link}" target="_blank">Bekijk</a>
        </div>
      `
      )
      .join("");
  } catch (err) {
    resultsDiv.innerHTML = "<p>Fout bij laden van data.</p>";
  }
});

// Prijsalerts
const alertForm = document.getElementById('alertForm');
const alertMsg = document.getElementById('alertMsg');

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
      alertMsg.textContent = 'Je bent succesvol geabonneerd!';
      alertForm.reset();
    } else {
      alertMsg.style.color = 'red';
      alertMsg.textContent = 'Fout bij abonnement. Controleer je gegevens.';
    }
  } catch (err) {
    console.error('Fout bij abonnement:', err);
    alertMsg.style.color = 'red';
    alertMsg.textContent = 'Er is een fout opgetreden.';
  }
});
