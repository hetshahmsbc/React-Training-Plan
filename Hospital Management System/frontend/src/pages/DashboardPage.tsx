// Dashboard overview — role-aware. Admin sees clinic-wide stats; doctor/patient
// see their own. Data is scoped with scopeByRole.

import { useApiRequest } from '@msbc/data-layer';
import { DonutChart } from '../components/charts/DonutChart';
import { Avatar } from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { scopeByRole } from '../lib/roles';
import { ApiUrls } from '../utils/constants';

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user!.role;

  const { data: apptResp } = useApiRequest({ url: ApiUrls.appointments.list, method: 'get', params: { pageSize: 100 } });
  const { data: patientResp } = useApiRequest({ url: ApiUrls.patients.list, method: 'get', params: { pageSize: 1 } });
  const { data: doctorResp } = useApiRequest({ url: ApiUrls.doctors.list, method: 'get', params: { pageSize: 1 } });
  const { data: medResp } = useApiRequest({ url: ApiUrls.medicines.list, method: 'get', params: { pageSize: 100 } });
  const { data: invResp } = useApiRequest({ url: ApiUrls.invoices.list, method: 'get', params: { pageSize: 100 } });

  const appts = scopeByRole(apptResp?.data ?? [], user, { doctorField: 'doctorName', patientField: 'patientName' });
  const invoices = scopeByRole(invResp?.data ?? [], user, { patientField: 'patientName' });
  const meds: Record<string, any>[] = medResp?.data ?? [];

  const statusCount = (s: string) => appts.filter((a) => a.status === s).length;
  const segments = [
    { label: 'scheduled', value: statusCount('scheduled'), color: '#2f6bed' },
    { label: 'completed', value: statusCount('completed'), color: '#16a34a' },
    { label: 'cancelled', value: statusCount('cancelled'), color: '#ef4444' },
  ];
  const revenue = invoices.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const due = invoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + (Number(i.amount) || 0), 0);

  let tiles: { label: string; value: any; icon: string; cls: string }[];
  if (role === 'admin') {
    tiles = [
      { label: 'Appointments', value: apptResp?.totalRecords ?? appts.length, icon: '📅', cls: 'stat-tile--blue' },
      { label: 'Patients', value: patientResp?.totalRecords ?? 0, icon: '👥', cls: 'stat-tile--green' },
      { label: 'Doctors', value: doctorResp?.totalRecords ?? 0, icon: '🩺', cls: 'stat-tile--amber' },
      { label: 'Revenue', value: `₹${revenue}`, icon: '💰', cls: 'stat-tile--purple' },
    ];
  } else if (role === 'doctor') {
    tiles = [
      { label: 'My Appointments', value: appts.length, icon: '📅', cls: 'stat-tile--blue' },
      { label: 'My Patients', value: new Set(appts.map((a) => a.patientName)).size, icon: '👥', cls: 'stat-tile--green' },
      { label: 'Completed', value: statusCount('completed'), icon: '✅', cls: 'stat-tile--amber' },
      { label: 'Scheduled', value: statusCount('scheduled'), icon: '🕑', cls: 'stat-tile--purple' },
    ];
  } else {
    tiles = [
      { label: 'My Appointments', value: appts.length, icon: '📅', cls: 'stat-tile--blue' },
      { label: 'Completed', value: statusCount('completed'), icon: '✅', cls: 'stat-tile--green' },
      { label: 'Upcoming', value: statusCount('scheduled'), icon: '🕑', cls: 'stat-tile--amber' },
      { label: 'Amount Due', value: `₹${due}`, icon: '💰', cls: 'stat-tile--purple' },
    ];
  }

  const recentAppts = appts.slice(0, 6);
  const pendingFees = invoices.filter((i) => i.status !== 'paid').slice(0, 6);
  const lowStock = [...meds].sort((a, b) => a.stock - b.stock).slice(0, 6);
  const showFees = role === 'admin' || role === 'patient';
  const showStock = role === 'admin';

  return (
    <div className="dash">
      <div className="dash-row dash-row--stats">
        {tiles.map((t) => (
          <div key={t.label} className={`stat-tile ${t.cls}`}>
            <div className="stat-tile__icon">{t.icon}</div>
            <div>
              <div className="stat-tile__value">{t.value}</div>
              <div className="stat-tile__label">{t.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-row dash-row--split">
        <div className="hms-card">
          <div className="hms-card__title">{role === 'admin' ? 'Recent Appointments' : 'My Appointments'}</div>
          <div className="dash-list">
            {recentAppts.length === 0 && <Empty />}
            {recentAppts.map((a) => (
              <div key={a.id} className="dash-list__row">
                <Avatar name={role === 'patient' ? a.doctorName : a.patientName} size={38} />
                <div className="dash-list__main">
                  <div className="dash-list__name">{role === 'patient' ? a.doctorName : a.patientName}</div>
                  <div className="dash-list__sub">
                    {role === 'patient' ? a.patientName : a.doctorName} · {a.date} {a.time}
                  </div>
                </div>
                <span className={`status-pill status-pill--${a.status}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hms-card">
          <div className="hms-card__title">Appointments by Status</div>
          <DonutChart segments={segments} />
        </div>
      </div>

      {(showFees || showStock) && (
        <div className="dash-row dash-row--split">
          {showFees && (
            <div className="hms-card">
              <div className="hms-card__title">{role === 'patient' ? 'My Unpaid Bills' : 'Pending Fees'}</div>
              <div className="dash-list">
                {pendingFees.length === 0 && <Empty text="Nothing pending 🎉" />}
                {pendingFees.map((i) => (
                  <div key={i.id} className="dash-list__row">
                    <Avatar name={i.patientName} size={38} />
                    <div className="dash-list__main">
                      <div className="dash-list__name">{i.patientName}</div>
                      <div className="dash-list__sub" style={{ color: '#ef4444' }}>Unpaid</div>
                    </div>
                    <strong>₹{i.amount}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showStock && (
            <div className="hms-card">
              <div className="hms-card__title">Low Stock Medicines</div>
              <div className="dash-list">
                {lowStock.length === 0 && <Empty />}
                {lowStock.map((m) => (
                  <div key={m.id} className="dash-list__row">
                    <div className="dash-list__main">
                      <div className="dash-list__name">{m.name}</div>
                      <div className="dash-list__sub">{m.category}</div>
                    </div>
                    <span style={{ color: m.stock <= 10 ? '#ef4444' : '#d97706', fontWeight: 600, fontSize: 13 }}>{m.stock} left</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Empty({ text = 'No data yet' }: { text?: string }) {
  return <p style={{ color: '#9aa4b2', fontSize: 14, margin: '8px 0' }}>{text}</p>;
}
