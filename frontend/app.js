const backendURL = 'https://jouw-backend.onrender.com'; // vervang door je Render-backend URL

const searchForm = document.getElementById('searchForm');
const dealsContainer = document.getElementById('deals');
const emptyContainer = document.getElementById('empty');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const q = document.getElementById('q').value.trim().toUpperCase(); // bv. AMS-BCN
  const month = document.getElementById('month').value; // bv. 2025-09
  const maxPrice = document.getElementById('maxPrice').value;

  // toegevoegd snippet
  const origin = "AMS";
  const destination = q || "BCN"; // wat gebruiker invult

  fetch(`https://traveltripsly-backend.onrender.com/api/flights?origin=${origin}&destination=${destination}`)
    .then(res => res.json())
    .then(showFlights)
    .catch(console.error);

  dealsContainer.innerHTML = '';
  emptyContainer.style.display = 'none';

  if (!q.includes('-')) {
    alert('Gebruik formaat: ORIGIN-DESTINATION, bv. AMS-BCN');
    return;
  }

  try {
    const url = `${backendURL}/api/flights?q=${encodeURIComponent(q)}&month=${encodeURIComponent(month)}&maxPrice=${encodeURIComponent(maxPrice)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const flights = await response.json();

    if (!Array.isArray(flights) || flights.length === 0) {
      emptyContainer.style.display = 'block';
      return;
    }

    flights.forEach(f => {
      const card = document.createElement('div');
      card.className = 'card deal';
      card.innerHTML = `
        <img src="${f.image || ''}" alt="Vlucht naar ${f.destination || ''}">
        <h3>${f.origin || ''} → ${f.destination || ''}</h3>
        <div class="price">
          <span>${f.price ? f.price + '€' : ''}</span>
          <span>${f.duration || ''}</span>
        </div>
        <p>${f.airline || ''} ${f.direct ? '(Direct)' : ''}</p>
        <div class="cta"><a href="${f.link || '#'}" target="_blank" rel="noopener">Boek nu</a></div>
      `;
      dealsContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching flights', err);
    alert('Kon geen resultaten ophalen.');
    emptyContainer.style.display = 'block';
  }
});
