import express from 'express';
import cors from 'cors';
import recipes from './data/recipes.js';
import posts from './data/posts.js';

const app = express();
const port = process.env.PORT || 3000;
const subscribers = new Set();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/recipes', (req, res) => {
  const { tag } = req.query;
  const list = tag ? recipes.filter((r) => r.tags.includes(tag)) : recipes;
  res.json(list.map(({ slug, title, summary, minutes, tags }) => ({ slug, title, summary, minutes, tags })));
});

app.get('/api/recipes/:slug', (req, res) => {
  const recipe = recipes.find((r) => r.slug === req.params.slug);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  res.json(recipe);
});

app.get('/api/posts', (_req, res) => res.json(posts));

app.post('/api/newsletter', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' });
  }
  subscribers.add(email);
  res.status(201).json({ message: 'You are on the list. See you Sunday!' });
});

app.listen(port, () => console.log(`Simmer & Sage API listening on ${port}`));
