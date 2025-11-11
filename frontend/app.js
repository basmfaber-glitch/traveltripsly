// frontend/app.js
const form = document.getElementById("searchForm");
const dealsContainer = document.getElementById("deals");
const emptyContainer = document.getElementById("empty");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const origin = document.getElementById("origin").value.trim().toUpperCase();
  const destination = document.getElementById("destination").value.trim().toUpperCase();
  const maxPrice = document.getElementById("maxPrice").value;

  dealsContainer.innerHTML = "";
  emptyContainer.style.display = "none";

  try {
    const res = await fetch(`/api/flights?origin=${origin}&destination=${destination}&maxPrice=${maxPrice}`);
    const flights = await res.json();

    if (!flights.length) {
      emptyContainer.style.display = "block";
      return;
    }

    flights.forEach(flight => {
      const card = document.createElement("div");
      card.className = "flight-card";
      card.innerHTML = `
        <img src="${flight.image}" alt="${flight.destination}">
        <h3>${flight.origin} ✈️ ${flight.destination}</h3>
        <p>Vertrek: ${new Date(flight.date).toLocaleDateString()}</p>
        <p>Prijs: <strong>€${flight.price}</strong></p>
        <p>Duur: ${flight.duration}</p>
        <p>Luchtvaartmaatschappij: ${flight.airline}</p>
        <a href="${flight.link}" target="_blank" class="book-btn">Boek nu</a>
      `;
      dealsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Fout bij ophalen:", err);
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
