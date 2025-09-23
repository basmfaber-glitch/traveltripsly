import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const flights = [
  { id:"AMS-BCN-1", origin:"AMS", destination:"Barcelona", date:"2025-09-18", price:78, direct:true, duration:"2u 15m", airline:"Transavia", image:"https://images.unsplash.com/photo-1505764706515-aa95265c5abc?q=80&w=1200&auto=format&fit=crop", link:"#"},
  { id:"AMS-LIS-1", origin:"AMS", destination:"Lissabon", date:"2025-10-03", price:72, direct:false, duration:"3u 05m", airline:"KLM", image:"https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop", link:"#"},
  { id:"AMS-ROM-1", origin:"AMS", destination:"Rome", date:"2025-09-27", price:92, direct:true, duration:"2u 25m", airline:"KLM", image:"https://images.unsplash.com/photo-1531572753322-ad063cecc140?q=80&w=1200&auto=format&fit=crop", link:"#"},
  { id:"AMS-LON-1", origin:"AMS", destination:"Londen", date:"2025-09-21", price:64, direct:true, duration:"1u 10m", airline:"easyJet", image:"https://images.unsplash.com/photo-1488747279002-c8523379faaa?q=80&w=1200&auto=format&fit=crop", link:"#"},
];

app.get('/api/health',(req,res)=>res.json({ok:true,time:new Date().toISOString()}));

app.get('/api/flights',(req,res)=>{
  const q=(req.query.q||'').toString().toLowerCase();
  const month=(req.query.month||'').toString();
  const maxPrice=parseFloat(req.query.maxPrice||'0');
  let out = flights;
  if(q) out = out.filter(f=> f.destination.toLowerCase().includes(q) || f.origin.toLowerCase().includes(q));
  if(month && month.length===7) out = out.filter(f=> f.date.startsWith(month));
  if(!isNaN(maxPrice) && maxPrice>0) out = out.filter(f=> f.price<=maxPrice);
  out = out.sort((a,b)=>a.price-b.price);
  res.json(out);
});

const subs = new Set();
app.post('/api/subscribe',(req,res)=>{
  const { email } = req.body||{};
  if(!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ok:false,error:'invalid_email'});
  subs.add(email.toLowerCase());
  res.json({ok:true});
});

app.listen(PORT,()=>console.log('Server running on port',PORT));
