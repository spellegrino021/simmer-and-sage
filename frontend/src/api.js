const base = import.meta.env.VITE_API_BASE_URL ?? '';

async function request(path, options) {
  const res = await fetch(`${base}/api${path}`, options);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const getRecipes = (tag) => request(tag ? `/recipes?tag=${encodeURIComponent(tag)}` : '/recipes');
export const getRecipe = (slug) => request(`/recipes/${slug}`);
export const getPosts = () => request('/posts');
export const subscribe = (email) =>
  request('/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
