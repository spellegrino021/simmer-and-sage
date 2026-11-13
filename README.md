# Simmer & Sage

A fake cooking blog. Two parts:

- `frontend/` — React + Vite static site (recipes, posts). Builds to `frontend/dist`.
- `api/` — Express API serving recipes, posts, and newsletter signups on port `3000`.

## Local development

```bash
cd api && npm install && npm start          # http://localhost:3000
cd frontend && npm install && npm run dev   # http://localhost:5173 (proxies /api)
```

The frontend calls the API at `/api/*`. Set `VITE_API_BASE_URL` at build time to point it elsewhere.
