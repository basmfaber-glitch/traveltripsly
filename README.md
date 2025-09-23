TravelTripsly - aesthetic MVP (frontend + backend)

Local run:
1) Backend
   cd backend
   npm install
   npm start
   # server on http://localhost:5000

2) Frontend
   Open frontend/index.html in browser (or use VS Code Live Server).

Deploy:
- Frontend -> Vercel (root: frontend). Set env BACKEND_URL to your backend URL.
- Backend -> Render (root: backend). Build: npm install. Start: npm start.

Notes:
- Travelpayouts tracking script is already included in <head> of frontend/index.html.
- Replace placeholder affiliate links in frontend if needed.
