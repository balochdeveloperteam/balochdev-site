import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { AdminProvider, useAdmin } from './AdminContext';
import AdminLayout from './AdminLayout';

function AdminGate() {
  const location = useLocation();
  const { loading, denied, session } = useAdmin();

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
      <section className="ndx-section ndx-admin-section ndx-page-rich">
        <div className="ndx-container">
          <p className="ndx-admin-loading">Loading admin workspace</p>
        </div>
      </section>
    );
  }

  if (!session || denied) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
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
