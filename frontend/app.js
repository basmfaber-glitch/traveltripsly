// frontend/app.js
const form = document.getElementById("searchForm");
const dealsContainer = document.getElementById("deals");
const emptyContainer = document.getElementById("empty");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const origin = document.getElementById("origin").value.trim().toUpperCase();
  const destination = document.getElementById("destination").value.trim().toUpperCase();
  const month = document.getElementById("month").value;
  const maxPrice = document.getElementById("maxPrice").value;

  dealsContainer.innerHTML = "";
  emptyContainer.style.display = "none";

  try {
    const res = await fetch(
      `/api/flights?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&month=${encodeURIComponent(month)}&maxPrice=${encodeURIComponent(maxPrice)}`
    );
    const flights = await res.json();

    if (!flights.length) {
      emptyContainer.style.display = "block";
      return;
    }

    flights.forEach((flight) => {
      const card = document.createElement("div");
      card.className = "flight-card glass";
      card.innerHTML = `
        <img src="${flight.image}" alt="Flight image">
        <div class="info">
          <h3>${flight.origin} ✈️ ${flight.destination}</h3>
          <p>Vertrek: ${new Date(flight.date).toLocaleDateString()}</p>
          <p>Duur: ${flight.duration}</p>
          <p><strong>€${flight.price}</strong></p>
          <a href="${flight.link}" target="_blank" rel="noopener noreferrer" class="book-btn">Boek nu</a>
        </div>
      `;
      dealsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Fout bij ophalen van vluchten:", err);
    emptyContainer.style.display = "block";
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
