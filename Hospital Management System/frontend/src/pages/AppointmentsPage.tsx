// Appointments — scoped + gated by role. Admin sees all; doctor/patient see
// only their own. Who can book/edit/cancel comes from the capability matrix.

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiRequest } from '@msbc/data-layer';
import { DataTable } from '../components/DataTable';
import { AppointmentModal } from '../components/AppointmentModal';
import { NameCell } from '../components/Avatar';
import { RowActions, IconVideo } from '../components/RowActions';
import { useAuth } from '../context/AuthContext';
import { can, scopeByRole } from '../lib/roles';
import { useCrud } from '../services/useCrud';
import { ApiUrls } from '../utils/constants';

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user!.role;
  const { data, loading, execute } = useApiRequest({ url: ApiUrls.appointments.list, method: 'get', params: { pageSize: 100 } });
  const rows = scopeByRole(data?.data ?? [], user, { doctorField: 'doctorName', patientField: 'patientName' });
  const { removeItem } = useCrud(ApiUrls.appointments.list);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Record<string, any> | null>(null);

  const refresh = () => execute({ params: { pageSize: 100 } });
  const handleCreate = () => { setSelected(null); setShowModal(true); };
  const handleEdit = (row: Record<string, any>) => { setSelected(row); setShowModal(true); };
  const handleDelete = async (row: Record<string, any>) => {
    if (!window.confirm(`Delete appointment for ${row.patientName}?`)) return;
    await removeItem(row.id);
    refresh();
  };
  const handleCall = (row: Record<string, any>) =>
    navigate('/meet', { state: { name: role === 'patient' ? row.doctorName : row.patientName, sub: `Consultation: ${row.patientName} with ${row.doctorName}` } });

  const columns = useMemo(
    () => [
      { field: 'patientName', headerName: 'Patient', flex: 1.5, cellRenderer: (p: any) => <NameCell name={p.data.patientName} /> },
      { field: 'doctorName', headerName: 'Doctor' },
      { field: 'date', headerName: 'Date', width: 130 },
      { field: 'time', headerName: 'Time', width: 100 },
      { field: 'reason', headerName: 'Reason', flex: 2 },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        cellRenderer: (p: any) => (
          <span className="hms-actioncell">
            <span className={`status-pill status-pill--${p.value}`}>{p.value}</span>
          </span>
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 160,
        sortable: false,
        cellRenderer: (p: any) => (
          <RowActions
            extras={[{ title: 'Join video call', icon: <IconVideo />, onClick: () => handleCall(p.data) }]}
            onEdit={can(role, 'appointments', 'edit') ? () => handleEdit(p.data) : undefined}
            onDelete={can(role, 'appointments', 'delete') ? () => handleDelete(p.data) : undefined}
          />
        ),
      },
    ],
    [role],
  );

  return (
    <>
      <DataTable
        title={role === 'admin' ? 'Appointments' : 'My Appointments'}
        addLabel="Book Appointment"
        onAdd={can(role, 'appointments', 'add') ? handleCreate : undefined}
        onRowDoubleClick={can(role, 'appointments', 'edit') ? handleEdit : undefined}
        columns={columns}
        rows={rows}
        loading={loading}
        searchKeys={['patientName', 'doctorName', 'reason', 'status']}
        searchPlaceholder="Search appointments…"
      />
      {showModal && (
        <AppointmentModal show={showModal} appointmentToEdit={selected} onClose={() => setShowModal(false)} onSuccess={refresh} />
      )}
    </>
  );
}
