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

    flights.forEach(f => {
      const card = document.createElement('div');
      card.className = 'card deal';
      card.innerHTML = `
        <img src="${f.image}" alt="${f.origin}-${f.destination}" />
        <div class="price">
          <span>${f.origin} → ${f.destination}</span>
          <strong>€${f.price}</strong>
        </div>
        <p>${f.airline} — ${f.duration} ${f.direct ? '(Direct)' : ''}</p>
        <div class="cta"><a href="${f.link}" target="_blank">Boek nu</a></div>
      `;
      dealsContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Fout bij ophalen vluchten:', err);
    emptyContainer.style.display = 'block';
  }
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