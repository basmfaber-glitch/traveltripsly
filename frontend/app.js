// frontend/app.js
const form = document.getElementById("searchForm");
const dealsContainer = document.getElementById("deals");
const emptyContainer = document.getElementById("empty");
const loading = document.getElementById("loading");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const origin = document.getElementById("origin").value.trim().toUpperCase();
  const destination = document.getElementById("destination").value.trim().toUpperCase();
  const maxPrice = document.getElementById("maxPrice").value.trim();

  dealsContainer.innerHTML = "";
  emptyContainer.classList.add("hidden");

  if (origin.length !== 3 || destination.length !== 3) {
    alert("Gebruik geldige IATA-codes (bijv. AMS, DXB)");
    return;
  }

  loading.classList.remove("hidden");

  try {
    const res = await fetch(`/api/flights?origin=${origin}&destination=${destination}&maxPrice=${maxPrice}`);
    const flights = await res.json();

    loading.classList.add("hidden");

    if (!flights.length) {
      emptyContainer.classList.remove("hidden");
      return;
    }

    flights.forEach((flight) => {
      const card = document.createElement("div");
      card.className = "flight-card";

      card.innerHTML = `
        <img src="${flight.image}">
        <h3>${flight.origin} ✈️ ${flight.destination}</h3>

        <p>📅 Vertrek: <strong>${new Date(flight.date).toLocaleDateString()}</strong></p>
        <p>💰 Prijs: <strong>€${flight.price}</strong></p>
        <p>⏱️ Duur: ${flight.duration}</p>
        <p>🛫 Airline: ${flight.airline}</p>

        <a target="_blank" href="${flight.link}" class="book-btn">Boek nu</a>
      `;

      dealsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Fout bij ophalen:", err);
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
