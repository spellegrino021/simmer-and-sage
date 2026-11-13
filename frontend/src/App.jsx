import { useEffect, useState } from 'react';
import { getPosts, getRecipe, getRecipes, subscribe } from './api.js';

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getRecipes(tag).then(setRecipes).catch((e) => setError(e.message));
  }, [tag]);

  useEffect(() => {
    getPosts().then(setPosts).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <header className="hero">
        <h1>Simmer &amp; Sage</h1>
        <p>Slow food, quick notes, and too much butter.</p>
      </header>
      <main>
        {error && <p className="error">Couldn&apos;t reach the kitchen: {error}</p>}
        <section>
          <div className="section-head">
            <h2>Recipes</h2>
            <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Filter by tag">
              <option value="">All</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="weeknight">Weeknight</option>
              <option value="baking">Baking</option>
              <option value="soup">Soup</option>
            </select>
          </div>
          <ul className="cards">
            {recipes.map((r) => (
              <li key={r.slug} className="card">
                <button type="button" onClick={() => getRecipe(r.slug).then(setSelected)}>
                  <h3>{r.title}</h3>
                  <p>{r.summary}</p>
                  <small>{r.minutes} min · {r.tags.join(', ')}</small>
                </button>
              </li>
            ))}
          </ul>
        </section>
        {selected && (
          <section className="recipe">
            <h2>{selected.title}</h2>
            <p>Serves {selected.serves} · {selected.minutes} minutes</p>
            <h3>Ingredients</h3>
            <ul>{selected.ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
            <h3>Steps</h3>
            <ol>{selected.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            <button type="button" onClick={() => setSelected(null)}>Close</button>
          </section>
        )}
        <section>
          <h2>From the blog</h2>
          {posts.map((p) => (
            <article key={p.id} className="post">
              <h3>{p.title}</h3>
              <time dateTime={p.date}>{new Date(p.date).toLocaleDateString()}</time>
              <p>{p.excerpt}</p>
            </article>
          ))}
        </section>
        <Newsletter />
      </main>
      <footer>© {new Date().getFullYear()} Simmer &amp; Sage. Recipes are fictional; calories are real.</footer>
    </>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const result = await subscribe(email);
      setStatus(result.message);
      setEmail('');
    } catch {
      setStatus('Something boiled over. Try again.');
    }
  }

  return (
    <section className="newsletter">
      <h2>Get the Sunday supper email</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Subscribe</button>
      </form>
      <p role="status">{status}</p>
    </section>
  );
}
