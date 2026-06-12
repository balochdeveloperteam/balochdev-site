import { createContext, useContext } from 'react';

/** @typedef {'admin' | 'manager' | 'member'} TeamAccessRole */

/**
 * @typedef {Object} TeamMember
 * @property {string} id
 * @property {string} full_name
 * @property {string} role_title
 * @property {string} department
 * @property {TeamAccessRole} access_role
 * @property {string | null} email
 * @property {string | null} avatar_url
 * @property {string} status
 * @property {string | null} trial_start_date
 * @property {string | null} trial_end_date
 * @property {string | null} joined_date
 */

/**
 * @typedef {Object} TeamContextValue
 * @property {import('@supabase/supabase-js').Session | null} session
 * @property {TeamMember | null} member
 * @property {TeamAccessRole | null} accessRole
 * @property {boolean} isAdmin
 * @property {boolean} isManager
 * @property {boolean} canManageTeam
 * @property {() => Promise<void>} refreshMember
 * @property {() => Promise<void>} signOut
 * @property {(message: string, type?: 'success' | 'error') => void} showToast
 */

export const TeamContext = createContext(/** @type {TeamContextValue | null} */ (null));

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used within TeamGuard');
  return ctx;
}
