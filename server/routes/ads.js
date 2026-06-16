const {
  buildAdsByPlacement,
  latestAdPerPlacement,
  normalizeAdBody,
} = require('../services/ads');

async function resolveTeamMemberId(adminClient, authUserId) {
  const { data } = await adminClient
    .from('team_members')
    .select('id')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  return data?.id || null;
}

function registerAdsRoutes(app, { admin, safeError, requireBlogAdmin }) {
  app.get('/api/ads', async (_req, res) => {
    if (!admin) return res.json({ ads: {} });
    try {
      const { data, error } = await admin.from('ads').select('*');
      if (error) {
        if (/relation.*ads.*does not exist|ads.*does not exist/i.test(error.message || '')) {
          return res.json({ ads: {} });
        }
        return safeError(res, 500, error.message);
      }
      res.json({ ads: buildAdsByPlacement(data || []) });
    } catch (err) {
      safeError(res, 500, err.message);
    }
  });

  app.get('/api/ads/admin', requireBlogAdmin, async (_req, res) => {
    if (!admin) return res.status(503).json({ error: 'No DB' });
    try {
      const { data, error } = await admin.from('ads').select('*').order('updated_at', { ascending: false });
      if (error) return safeError(res, 500, error.message);
      res.json({ placements: latestAdPerPlacement(data || []), all: data || [] });
    } catch (err) {
      safeError(res, 500, err.message);
    }
  });

  app.post('/api/ads/admin', requireBlogAdmin, async (req, res) => {
    if (!admin) return res.status(503).json({ error: 'No DB' });
    try {
      const row = normalizeAdBody(req.body || {});
      const createdBy = await resolveTeamMemberId(admin, req.user.id);
      const { data, error } = await admin
        .from('ads')
        .insert({ ...row, created_by: createdBy })
        .select()
        .single();
      if (error) return safeError(res, 500, error.message);
      res.status(201).json({ ad: data });
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ error: err.message });
      safeError(res, 500, err.message);
    }
  });

  app.put('/api/ads/admin/:id', requireBlogAdmin, async (req, res) => {
    if (!admin) return res.status(503).json({ error: 'No DB' });
    try {
      const row = normalizeAdBody(req.body || {});
      const { data, error } = await admin
        .from('ads')
        .update(row)
        .eq('id', req.params.id)
        .select()
        .single();
      if (error) return safeError(res, 500, error.message);
      if (!data) return res.status(404).json({ error: 'Ad not found' });
      res.json({ ad: data });
    } catch (err) {
      if (err.status === 400) return res.status(400).json({ error: err.message });
      safeError(res, 500, err.message);
    }
  });

  app.delete('/api/ads/admin/:id', requireBlogAdmin, async (req, res) => {
    if (!admin) return res.status(503).json({ error: 'No DB' });
    const { error } = await admin.from('ads').delete().eq('id', req.params.id);
    if (error) return safeError(res, 500, error.message);
    res.json({ ok: true });
  });
}

module.exports = { registerAdsRoutes };
