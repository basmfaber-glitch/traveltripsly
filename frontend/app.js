const form = document.getElementById('searchForm');
const dealsContainer = document.getElementById('deals');
const emptyContainer = document.getElementById('empty');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  dealsContainer.innerHTML = '';
  emptyContainer.style.display = 'none';

  const origin = document.getElementById('origin').value.trim().toUpperCase();
  const destination = document.getElementById('destination').value.trim().toUpperCase();

  try {
    const res = await fetch(` https://traveltripsly-1.onrender.com`);
    const flights = await res.json();

    if (!flights.length) {
      emptyContainer.style.display = 'block';
      return;
    }

    flights.forEach(flight => {
      const card = document.createElement('div');
      card.className = 'card';
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
    console.error('Error fetching flights:', err);
  }
});

// Alerts form
const alertForm = document.getElementById('alertForm');
const alertMsg = document.getElementById('alertMsg');
alertForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    alertMsg.style.color = data.ok ? 'green' : 'red';
    alertMsg.textContent = data.ok ? 'Succesvol geabonneerd!' : 'Fout bij abonnement.';
    if (data.ok) alertForm.reset();
  } catch (err) {
    alertMsg.style.color = 'red';
    alertMsg.textContent = 'Er is een fout opgetreden.';
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
