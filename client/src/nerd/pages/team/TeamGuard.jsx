import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import Seo from '../../seo/Seo';
import { PRIVATE_ROUTES } from '../../seo/siteSeo';
import { TeamContext } from './TeamContext';
import { TeamToastProvider, useTeamToast } from './components/TeamToast';

const TEAM_META = 'BalochDev team workspace — not indexed.';

function TeamGuardInner() {
  const nav = useNavigate();
  const location = useLocation();
  const { showToast } = useTeamToast();
  const reduceMotion = useReducedMotion();
  const authSubRef = useRef(null);
  const [session, setSession] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notMember, setNotMember] = useState(false);

  const loadMember = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setMember(null);
      setNotMember(true);
      return;
    }
    const { data, error } = await supabase
      .from('team_members')
      .select(
        'id, full_name, role_title, department, access_role, email, avatar_url, status, trial_start_date, trial_end_date, joined_date',
      )
      .eq('auth_user_id', userId)
      .maybeSingle();
    if (error) {
      setMember(null);
      setNotMember(true);
      return;
    }
    if (!data) {
      setMember(null);
      setNotMember(true);
      return;
    }
    setMember(data);
    setNotMember(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;

        if (!data.session) {
          nav('/admin/login', { replace: true, state: { from: location.pathname } });
          return;
        }

        setSession(data.session);
        await loadMember(data.session.user.id);
      } catch {
        /* auth bootstrap errors surface via empty session / notMember */
      } finally {
        if (!cancelled) setLoading(false);
      }

      if (cancelled) return;

      const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
        // Session at mount is handled by getSession above — avoid duplicate work and auth lock deadlock.
        if (event === 'INITIAL_SESSION') return;
        if (cancelled) return;

        if (!s) {
          nav('/admin/login', { replace: true, state: { from: location.pathname } });
          return;
        }

        setSession(s);
        setTimeout(() => {
          if (cancelled) return;
          loadMember(s.user.id).catch(() => {});
        }, 0);
      });

      authSubRef.current = sub.subscription;
    })();

    return () => {
      cancelled = true;
      authSubRef.current?.unsubscribe();
      authSubRef.current = null;
    };
  }, [loadMember, location.pathname, nav]);

  const refreshMember = useCallback(async () => {
    if (session?.user?.id) await loadMember(session.user.id);
  }, [loadMember, session?.user?.id]);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    nav('/admin/login', { replace: true });
  }, [nav]);

  const accessRole = member?.access_role ?? null;
  const contextValue = useMemo(
    () => ({
      session,
      member,
      accessRole,
      isAdmin: accessRole === 'admin',
      isManager: accessRole === 'manager',
      canManageTeam: accessRole === 'admin' || accessRole === 'manager',
      refreshMember,
      signOut,
      showToast,
    }),
    [session, member, accessRole, refreshMember, signOut, showToast],
  );

  if (!supabase) {
    return (
      <>
        <Seo title="Team | BalochDev" description={TEAM_META} canonicalPath={PRIVATE_ROUTES.TEAM_ROOT} noindex />
        <section className="ndx-section">
          <div className="ndx-container">
            <p>Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client `.env`.</p>
          </div>
        </section>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Seo title="Team | BalochDev" description={TEAM_META} canonicalPath={PRIVATE_ROUTES.TEAM_ROOT} noindex />
        <section className="ndx-section ndx-team-loading">
          <div className="ndx-container">
            <p className="ndx-tech-blurb">Loading workspace…</p>
          </div>
        </section>
      </>
    );
  }

  if (!session) {
    return null;
  }

  if (notMember || !member) {
    return (
      <>
        <Seo title="Team | BalochDev" description={TEAM_META} canonicalPath={PRIVATE_ROUTES.TEAM_ROOT} noindex />
        <section className="ndx-section" style={{ paddingTop: '4rem', minHeight: '60vh' }}>
          <div className="ndx-container" style={{ maxWidth: '480px' }}>
            <p className="ndx-eyebrow">Team workspace</p>
            <h1 className="ndx-h2">Not a team member</h1>
            <p className="ndx-lead">
              Your account is signed in but not linked to a roster row in{' '}
              <code>team_members</code>. Ask an admin to link your Supabase user.
            </p>
            <button type="button" className="ndx-btn ndx-btn-primary" onClick={signOut} style={{ marginTop: '1.5rem' }}>
              Sign out
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <TeamContext.Provider value={contextValue}>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Outlet />
      </motion.div>
    </TeamContext.Provider>
  );
}

export default function TeamGuard() {
  return (
    <TeamToastProvider>
      <TeamGuardInner />
    </TeamToastProvider>
  );
}
