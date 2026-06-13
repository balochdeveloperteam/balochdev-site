import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { AdminProvider, useAdmin } from './AdminContext';
import AdminLayout from './AdminLayout';

function AdminGate() {
  const { loading, denied } = useAdmin();

  if (!supabase) {
    return (
      <section className="ndx-section">
        <div className="ndx-container">
          <p>Configure Supabase env vars in client `.env`.</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="ndx-section ndx-admin-section">
        <div className="ndx-container">
          <p className="ndx-tech-blurb">Loading admin workspace…</p>
        </div>
      </section>
    );
  }

  if (denied) {
    return (
      <section className="ndx-section ndx-admin-section">
        <div className="ndx-container" style={{ maxWidth: '520px' }}>
          <p className="ndx-eyebrow">Admin</p>
          <h1 className="ndx-h2">Access denied</h1>
          <p className="ndx-lead">
            Blog CMS access requires an admin account or team manager role.
          </p>
          <Navigate to="/admin/login" replace />
        </div>
      </section>
    );
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export default function AdminGuard() {
  return (
    <AdminProvider>
      <AdminGate />
    </AdminProvider>
  );
}
