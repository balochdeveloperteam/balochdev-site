import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { useTeam } from './TeamContext';
import PolicyEditorModal from './components/PolicyEditorModal';
import TeamMarkdown from './components/TeamMarkdown';
import { TeamBlockSkeleton } from './components/TeamSkeleton';

const CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'ethics', label: 'Ethics' },
  { id: 'data_safety', label: 'Data safety' },
  { id: 'social_boundaries', label: 'Social boundaries' },
  { id: 'trial', label: 'Trial' },
  { id: 'conduct', label: 'Conduct' },
];

export default function TeamPolicies() {
  const { isAdmin, showToast } = useTeam();
  const reduceMotion = useReducedMotion();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [editorPolicy, setEditorPolicy] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const loadPolicies = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('policies')
      .select('id, slug, title, category, content, ordering, updated_at')
      .order('ordering', { ascending: true });
    if (err) {
      setError(err.message);
      showToast('Could not load policies', 'error');
      setPolicies([]);
    } else {
      setPolicies(data || []);
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  const grouped = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((c) => [c.id, []]));
    for (const p of policies) {
      if (map[p.category]) map[p.category].push(p);
      else map.general.push(p);
    }
    return map;
  }, [policies]);

  const activePolicies = grouped[activeCategory] || [];

  const openCreate = () => {
    setEditorPolicy(null);
    setShowEditor(true);
  };

  const openEdit = (policy) => {
    setEditorPolicy(policy);
    setShowEditor(true);
  };

  const onDelete = async (policy) => {
    if (!supabase || !isAdmin) return;
    if (!window.confirm(`Delete policy “${policy.title}”?`)) return;
    const { error: err } = await supabase.from('policies').delete().eq('id', policy.id);
    if (err) {
      showToast(err.message || 'Could not delete', 'error');
      return;
    }
    showToast('Policy deleted', 'success');
    loadPolicies();
  };

  return (
    <div className="ndx-page-rich">
      <motion.div
        className="ndx-team-page-head ndx-team-page-head--row"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <p className="ndx-eyebrow">Handbook</p>
          <h2 className="ndx-h2">Policies</h2>
          <p className="ndx-lead">Team guidelines by category. Paste your policy markdown after setup.</p>
        </div>
        {isAdmin ? (
          <div className="ndx-team-page-head-actions">
            <button type="button" className="ndx-btn ndx-btn-primary" onClick={openCreate}>
              New policy
            </button>
          </div>
        ) : null}
      </motion.div>

      {error ? <p className="ndx-team-alert" role="alert">{error}</p> : null}

      <div className="ndx-team-tabs" role="tablist" aria-label="Policy categories">
        {CATEGORIES.map((cat) => {
          const count = grouped[cat.id]?.length || 0;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`ndx-team-tab${activeCategory === cat.id ? ' ndx-team-tab--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
              {count ? ` (${count})` : ''}
            </button>
          );
        })}
      </div>

      {loading ? (
        <TeamBlockSkeleton />
      ) : activePolicies.length === 0 ? (
        <div className="ndx-team-empty">
          <p className="ndx-lead">No policies in this category yet.</p>
          {isAdmin ? (
            <p className="ndx-tech-blurb">Create one with “New policy” — you can add the full text yourself.</p>
          ) : (
            <p className="ndx-tech-blurb">Your admin will publish policies here.</p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activePolicies.map((policy, index) => (
            <motion.article
              key={policy.id}
              className="ndx-card ndx-glass-section ndx-team-policy-card"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: reduceMotion ? 0 : index * 0.04 }}
            >
              <div className="ndx-team-policy-head">
                <div>
                  <h3 className="ndx-h3">{policy.title}</h3>
                  <p className="ndx-team-policy-slug">
                    {policy.slug}
                    {policy.updated_at
                      ? ` · updated ${new Date(policy.updated_at).toLocaleDateString()}`
                      : ''}
                  </p>
                </div>
                {isAdmin ? (
                  <div className="ndx-team-page-head-actions">
                    <button type="button" className="ndx-btn" onClick={() => openEdit(policy)}>
                      Edit
                    </button>
                    <button type="button" className="ndx-btn" onClick={() => onDelete(policy)}>
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
              <TeamMarkdown content={policy.content} />
            </motion.article>
          ))}
        </div>
      )}

      {showEditor ? (
        <PolicyEditorModal
          policy={editorPolicy}
          onClose={() => setShowEditor(false)}
          onSaved={loadPolicies}
        />
      ) : null}
    </div>
  );
}
