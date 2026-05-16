# SerpSide

**Find food. Find deals. All in one place.**

A two-mode conference companion built with SerpApi — search restaurants near your venue, or swipe through products to find the best price.

Built for the **SerpApi PyCon US Raffle** (May 2026).

---

## Features

### Food Explorer
Search for restaurants near any conference venue. Filter by cuisine, price level, and rating. Uses SerpApi Google Maps search.

### Swag or Pass
Search any product and get prices across the web sorted by the best deal. Swipe through results — Smash to open the link, Pass to skip. Smashed items are saved to a final roundup.

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Backend | Python 3.13, FastAPI, `uv`, `serpapi` SDK |
| Frontend | Nuxt 3, Vue 3, DaisyUI, Tailwind CSS |
| Build | `uv` (Python), npm (Node 23) |
| Deploy | Docker Compose |

---

## Quick Start

### Prerequisites

- [Python 3.13+](https://www.python.org/)
- [Node.js 23+](https://nodejs.org/)
- [uv](https://docs.astral.sh/uv/)
- A [SerpApi API key](https://serpapi.com/manage-api-key) (free tier: 250 searches)

### 1. Set up the backend

```bash
cd backend
cp .env.example ../.env
# Edit ../.env and add your SerpApi key:
#   SERPAPI_API_KEY=your_key_here
uv run uvicorn main:app --reload
```

The API starts at `http://127.0.0.1:8000`.

### 2. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts at `http://localhost:3000`.

### 3. Open the app

Visit **http://localhost:3000** — you'll see the landing page, then click into either Food Explorer or Swag or Pass.

---

## Docker Deployment (Bonus Entry)

```bash
docker compose up --build
```

The backend runs on `http://localhost:8000` and the frontend on `http://localhost:3000`.

Deploy to any Docker host (Railway, Fly.io, Render) for the hosted demo bonus raffle entry.

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/restaurants?q=...&location=...` | Search restaurants via SerpApi Google Maps |
| `GET /api/products?q=...` | Search products via SerpApi Google Shopping |
| `GET /api/health` | Health check + API key status |

---

## Raffle Entry

Built by Joseph Osei Yaw Nyarko for the **SerpApi PyCon US Raffle**.

- App: [serpside.osei.app](https://serpside.osei.app)
- Repo: [SerpSide](https://github.com/Joe342wise/serpside.git)
