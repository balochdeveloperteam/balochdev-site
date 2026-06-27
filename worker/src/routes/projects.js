import { Hono } from 'hono';
import { getAdmin } from '../db.js';
import { safeError } from '../utils.js';

const projects = new Hono();

projects.get('/', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ projects: [] });
  const { data, error } = await admin
    .from('projects')
    .select('id,title,slug,summary,image_path,category,sort_order,created_at')
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error) return safeError(c, 500, error.message);
  return c.json({ projects: data || [] });
});

projects.get('/:slug', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ project: null }, 404);
  const { data, error } = await admin
    .from('projects')
    .select('*')
    .eq('slug', c.req.param('slug'))
    .eq('published', true)
    .maybeSingle();
  if (error) return safeError(c, 500, error.message);
  if (!data) return c.json({ project: null }, 404);
  return c.json({ project: data });
});

export default projects;
