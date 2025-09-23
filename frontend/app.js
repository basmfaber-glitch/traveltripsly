const backendUrl = (window.BACKEND_URL) || "http://localhost:5000";

const resultsEl = document.getElementById('deals');
const emptyEl = document.getElementById('empty');
const countEl = document.getElementById('count');
document.getElementById('year').textContent = new Date().getFullYear();

function renderCards(items){
  resultsEl.innerHTML = items.map(d=>`
    <article class="card deal">
      <img src="${d.image}" alt="${d.destination}">
      <div class="price"><strong>€${d.price}</strong><span>${d.origin} → ${d.destination}</span></div>
      <div class="meta">${d.date} • ${d.direct ? 'Direct' : 'Overstap'}</div>
      <div class="cta"><a class="book" href="${d.link}" target="_blank" rel="noopener">Boek deal</a>
      <button onclick="saveFav('${d.id}')">♡</button></div>
    </article>
  `).join('');
  emptyEl.style.display = items.length ? 'none' : 'block';
  countEl.textContent = items.length;
}

function saveFav(id){ const k='tt:favs'; const s=new Set(JSON.parse(localStorage.getItem(k)||'[]')); if(s.has(id)) s.delete(id); else s.add(id); localStorage.setItem(k,JSON.stringify([...s])); alert('Opgeslagen!'); }

document.getElementById('searchForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const q=document.getElementById('q').value.trim();
  const month=document.getElementById('month').value;
  const maxPrice=document.getElementById('maxPrice').value;
  const params=new URLSearchParams({ q, month, maxPrice });
  try{
    const res=await fetch(`${backendUrl}/api/flights?${params.toString()}`);
    if(!res.ok) throw new Error('Netwerkfout');
    const data=await res.json();
    renderCards(data);
  }catch(err){
    alert('Kon geen resultaten ophalen.');
  }
});

document.getElementById('alertForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const email=document.getElementById('email').value;
  const q=document.getElementById('alert_q').value;
  const maxPrice=document.getElementById('alert_max').value;
  try{
    const res=await fetch(`${backendUrl}/api/subscribe`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,q,maxPrice})});
    if(!res.ok) throw new Error('fail');
    alert('Je bent geabonneerd!');
    e.target.reset();
  }catch(e){ alert('Kon niet abonneren.'); }
});
