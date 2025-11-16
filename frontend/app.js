document.addEventListener("DOMContentLoaded", () => {
  // --------- UI elements ----------
  const form = document.getElementById("searchForm");
  const dealsContainer = document.getElementById("deals");
  const emptyContainer = document.getElementById("empty");
  const loading = document.getElementById("loading");
  const yearEl = document.getElementById("year");
  const modeToggle = document.getElementById("modeToggle");
  const dayNightToggle = document.getElementById("dayNightToggle");

  yearEl.textContent = new Date().getFullYear();

  // restore toggles from localStorage
  const state = {
    glow: localStorage.getItem("trip_glow") === "1",
    day: localStorage.getItem("trip_day") === "1",
  };

  function applyTheme() {
    document.body.classList.toggle("glow", state.glow);
    document.body.classList.toggle("day", state.day);
    modeToggle.checked = state.glow;
    dayNightToggle.checked = state.day;
  }
  applyTheme();

  modeToggle.addEventListener("change", () => {
    state.glow = modeToggle.checked;
    localStorage.setItem("trip_glow", state.glow ? "1" : "0");
    applyTheme();
  });

  dayNightToggle.addEventListener("change", () => {
    state.day = dayNightToggle.checked;
    localStorage.setItem("trip_day", state.day ? "1" : "0");
    applyTheme();
  });

  // --------- Flight search ----------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const origin = document.getElementById("origin").value.trim().toUpperCase();
    const destination = document.getElementById("destination").value.trim().toUpperCase();
    const maxPrice = document.getElementById("maxPrice").value.trim();

    dealsContainer.innerHTML = "";
    emptyContainer.classList.add("hidden");
    loading.classList.remove("hidden");

    if (origin.length !== 3 || destination.length !== 3) {
      alert("Gebruik geldige IATA-codes (bijv. AMS, JFK, DXB)");
      loading.classList.add("hidden");
      return;
    }

    try {
      const q = new URLSearchParams({ origin, destination, maxPrice }).toString();
      const res = await fetch(`/api/flights?${q}`);
      if (!res.ok) throw new Error("API error");
      const flights = await res.json();
      loading.classList.add("hidden");

      if (!flights.length) {
        emptyContainer.classList.remove("hidden");
        return;
      }

      flights.forEach(renderFlightCard);
    } catch (err) {
      console.error("Fout bij ophalen:", err);
      loading.classList.add("hidden");
      emptyContainer.textContent = "Er ging iets mis bij het laden van de resultaten.";
      emptyContainer.classList.remove("hidden");
    }
  });

  function renderFlightCard(f) {
    const card = document.createElement("article");
    card.className = "flight-card";
    card.innerHTML = `
      <img src="${escapeHtml(f.image)}" alt="${escapeHtml(f.destination)}">
      <h3>${escapeHtml(f.origin)} ✈️ ${escapeHtml(f.destination)}</h3>
      <div class="flight-meta">
        <span>📅 ${new Date(f.date).toLocaleDateString()}</span>
        <span>💰 €${escapeHtml(f.price)}</span>
        <span>⏱ ${escapeHtml(f.duration)}</span>
        <span>🛫 ${escapeHtml(f.airline)}</span>
      </div>
      <a class="book-btn" target="_blank" rel="noopener" href="${escapeAttr(f.link)}">Boek nu</a>
    `;
    dealsContainer.appendChild(card);
  }

  function escapeHtml(s){ if(!s && s!==0) return ""; return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function escapeAttr(s){ return escapeHtml(s); }

  // ---------- Particles Canvas (bioluminescent) ----------
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let width=0,height=0,particles=[];

  function resizeCanvas(){
    width = canvas.width = canvas.clientWidth = document.documentElement.clientWidth;
    height = canvas.height = document.querySelector(".hero").clientHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const PARTICLE_COUNT = Math.round(Math.max(30, window.innerWidth/30));
  const COLORS = [{r:0,g:210,b:255},{r:80,g:190,b:255},{r:90,g:80,b:255},{r:0,g:255,b:180}];

  function rand(min,max){return Math.random()*(max-min)+min;}

  function createParticle(i){
    const c = COLORS[Math.floor(Math.random()*COLORS.length)];
    return {
      x: rand(0,width),
      y: rand(height*0.1,height*0.95),
      vx: rand(-0.1,0.1)*(i%2?1:-1),
      vy: rand(-0.15,-0.03),
      r: rand(0.8,3.4),
      hue:c,
      life:rand(90,420),
      age:0,
      phase:Math.random()*Math.PI*2
    };
  }

  function initParticles(force=false){
    if(particles.length && !force) return;
    particles=[];
    for(let i=0;i<PARTICLE_COUNT;i++) particles.push(createParticle(i));
  }
  initParticles();

  let mouse={x:width/2,y:height/2,active:false};
  canvas.addEventListener("mousemove",e=>{
    const rect=canvas.getBoundingClientRect();
    mouse.x=e.clientX-rect.left;
    mouse.y=e.clientY-rect.top;
    mouse.active=true;
  });
  canvas.addEventListener("mouseleave",()=>mouse.active=false);

  function drawGlow(x,y,r,color,alpha){
    const grd=ctx.createRadialGradient(x,y,0,x,y,r*2);
    grd.addColorStop(0, `rgba(${color.r},${color.g},${color.b},${alpha})`);
    grd.addColorStop(0.35, `rgba(${color.r},${color.g},${color.b},${alpha*0.35})`);
    grd.addColorStop(1, `rgba(${color.r},${color.g},${color.b},0)`);
    ctx.fillStyle=grd;
    ctx.beginPath();
    ctx.arc(x,y,r*2,0,Math.PI*2);
    ctx.fill();
  }

  function frame(){
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = state.day ? "rgba(255,255,255,0.02)" : "rgba(0,6,12,0.18)";
    ctx.fillRect(0,0,width,height);

    particles.forEach((p,i)=>{
      p.x+=p.vx+Math.sin((p.phase+p.age/50))*0.12;
      p.y+=p.vy;
      p.age++;
      if(p.y<-10||p.age>p.life){particles[i]=createParticle(i);return;}
      if(mouse.active){
        const dx=mouse.x-p.x;
        const dy=mouse.y-p.y;
        const d2=dx*dx+dy*dy;
        if(d2<20000){p.vx+=dx*0.0004;p.vy+=dy*0.0004;}
      }
      const glowMult=state.glow?1.6:0.9;
      const alpha=Math.max(0.05,(1-p.age/p.life)*0.9)*glowMult;
      drawGlow(p.x,p.y,p.r*6,p.hue,alpha);
      ctx.beginPath();
      ctx.fillStyle=`rgba(${p.hue.r},${p.hue.g},${p.hue.b},${Math.min(1,alpha*1.6)})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });

    const t=Date.now()/1200;
    const orbX=width*0.5+Math.cos(t)*40;
    const orbY=height*0.36+Math.sin(t*0.8)*18;
    drawGlow(orbX,orbY,60,{r:3,g:150,b:255},0.06*(state.glow?1.6:1));
    ctx.beginPath();
    ctx.fillStyle=state.day?"rgba(3,70,120,0.9)":"rgba(0,160,255,0.98)";
    ctx.arc(orbX,orbY,8,0,Math.PI*2);
    ctx.fill();

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ---------- Animated SVG Waves ----------
  (function animateWaves(){
    const path=document.getElementById("wavePath");
    const glowGroup=document.querySelector(".wave-glow");

    function makePath(offset){
      const w=1440,h=120;
      let d=`M0 ${h+60}`;
      const segments=12;
      for(let i=0;i<=segments;i++){
        const x=(i/segments)*w;
        const y=Math.sin((i/segments)*Math.PI*2+offset)*18+h/2;
        d+=` L ${x} ${y}`;
      }
      d+=` L ${w} ${h+60} Z`;
      return d;
    }

    let off=0;
    function step(){
      off+=0.02;
      if(path) path.setAttribute("d",makePath(off));
      if(glowGroup){
        glowGroup.innerHTML="";
        for(let i=0;i<3;i++){
          const p=document.createElementNS("http://www.w3.org/2000/svg","path");
          p.setAttribute("d",makePath(off+i*0.6));
          p.setAttribute("fill","none");
          p.setAttribute("stroke","#00d1ff");
          p.setAttribute("stroke-opacity","0.06");
          p.setAttribute("stroke-width",String(80-i*20));
          glowGroup.appendChild(p);
        }
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  })();

  // resize canvas to hero
  function fit(){
    const hero=document.querySelector(".hero");
    if(!hero) return;
    const rect=hero.getBoundingClientRect();
    canvas.width=Math.max(window.innerWidth,300);
    canvas.height=Math.max(rect.height,200);
    canvas.style.width="100%";
    canvas.style.height=rect.height+"px";
  }
  window.addEventListener("load",fit);
  window.addEventListener("resize",fit);
  fit();
  setTimeout(()=>initParticles(true),250);
});
