import { type ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { NAV_BY_ROLE } from './lib/roles';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage';
import MeetPage from './pages/MeetPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientsPage from './pages/PatientsPage';
import PharmacyPage from './pages/PharmacyPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import BillingPage from './pages/BillingPage';

export default function App() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Login />;
  }

  // A route the current role isn't allowed to see redirects to the dashboard.
  const allowed = NAV_BY_ROLE[user.role];
  const guard = (path: string, el: ReactElement) =>
    allowed.includes(path) ? el : <Navigate to="/dashboard" replace />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/appointments" element={guard('/appointments', <AppointmentsPage />)} />
        <Route path="/doctors" element={guard('/doctors', <DoctorsPage />)} />
        <Route path="/patients" element={guard('/patients', <PatientsPage />)} />
        <Route path="/pharmacy" element={guard('/pharmacy', <PharmacyPage />)} />
        <Route path="/prescriptions" element={guard('/prescriptions', <PrescriptionsPage />)} />
        <Route path="/billing" element={guard('/billing', <BillingPage />)} />
        <Route path="/meet" element={<MeetPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}
