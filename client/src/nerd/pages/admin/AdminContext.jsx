import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../../lib/api';
import { supabase } from '../../../lib/supabase';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [hasTeamMember, setHasTeamMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  const loadTeamMembership = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setHasTeamMember(false);
      return;
    }
    const { data } = await supabase
      .from('team_members')
      .select('id')
      .eq('auth_user_id', userId)
      .maybeSingle();
    setHasTeamMember(!!data);
  }, []);

  const loadProfile = useCallback(async (accessToken) => {
    const res = await fetch(apiUrl('/api/blog/admin/me'), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status === 403) {
      setDenied(true);
      setProfile(null);
      return;
    }
    if (!res.ok) {
      setProfile(null);
      return;
    }
    const data = await res.json();
    setDenied(false);
    setProfile({ name: data.name, role: data.role });
  }, []);

  /**
   * Bootstrap session — never imperatively navigate from here. AdminGate handles
   * the declarative redirect (<Navigate to="/admin/login">) once loading flips
   * to false. Two simultaneous redirects (imperative here + declarative in Gate)
   * can race in some browsers and land on the wrong route.
   */
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      const s = data.session;
      setSession(s);
      if (!s) {
        setLoading(false);
        return;
      }

      await Promise.all([loadProfile(s.access_token), loadTeamMembership(s.user.id)]);
      if (!cancelled) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'INITIAL_SESSION') return;
      setTimeout(async () => {
        if (cancelled) return;
        setSession(s);
        if (!s) {
          setProfile(null);
          return;
        }
        await Promise.all([loadProfile(s.access_token), loadTeamMembership(s.user.id)]);
      }, 0);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile, loadTeamMembership]);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    navigate('/admin/login');
  }, [navigate]);

  const authFetch = useCallback(
    async (path, options = {}) => {
      if (!session?.access_token) throw new Error('Not signed in');
      const res = await fetch(apiUrl(path), {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      return res;
    },
    [session],
  );

  const value = useMemo(
    () => ({
      session,
      profile,
      hasTeamMember,
      canAccessTeam: hasTeamMember,
      canAccessAdmin: !denied,
      loading,
      denied,
      signOut,
      authFetch,
      token: session?.access_token || null,
    }),
    [session, profile, hasTeamMember, loading, denied, signOut, authFetch],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
