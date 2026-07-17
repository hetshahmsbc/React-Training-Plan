// Prescriptions — scoped by role. Doctor writes/edits; patient views their own
// and can send them to the pharmacy ("Buy").

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiRequest } from '@msbc/data-layer';
import { DataTable } from '../components/DataTable';
import { PrescriptionModal } from '../components/PrescriptionModal';
import { NameCell } from '../components/Avatar';
import { RowActions, IconCart } from '../components/RowActions';
import { useAuth } from '../context/AuthContext';
import { can, scopeByRole } from '../lib/roles';
import { useCrud } from '../services/useCrud';
import { ApiUrls } from '../utils/constants';

export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user!.role;
  const { data, loading, execute } = useApiRequest({ url: ApiUrls.prescriptions.list, method: 'get', params: { pageSize: 100 } });
  const rows = scopeByRole(data?.data ?? [], user, { doctorField: 'doctorName', patientField: 'patientName' });
  const { removeItem } = useCrud(ApiUrls.prescriptions.list);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Record<string, any> | null>(null);

  const refresh = () => execute({ params: { pageSize: 100 } });
  const handleCreate = () => { setSelected(null); setShowModal(true); };
  const handleEdit = (row: Record<string, any>) => { setSelected(row); setShowModal(true); };
  const handleDelete = async (row: Record<string, any>) => {
    if (!window.confirm(`Delete this prescription for ${row.patientName}?`)) return;
    await removeItem(row.id);
    refresh();
  };
  const handleBuy = (row: Record<string, any>) =>
    navigate('/pharmacy', { state: { fromPrescription: { patientName: row.patientName, medicineIds: row.medicineIds ?? [] } } });

  // Patients (and admin) can buy the prescribed medicines.
  const canBuy = role === 'patient' || role === 'admin';

  const columns = useMemo(
    () => [
      { field: 'patientName', headerName: 'Patient', flex: 1.5, cellRenderer: (p: any) => <NameCell name={p.data.patientName} /> },
      { field: 'doctorName', headerName: 'Doctor' },
      { field: 'medicines', headerName: 'Medicines & Dosage', flex: 2 },
      { field: 'date', headerName: 'Date', width: 120 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 160,
        sortable: false,
        cellRenderer: (p: any) => (
          <RowActions
            extras={canBuy && p.data.medicineIds?.length ? [{ title: 'Buy at pharmacy', icon: <IconCart />, onClick: () => handleBuy(p.data) }] : []}
            onEdit={can(role, 'prescriptions', 'edit') ? () => handleEdit(p.data) : undefined}
            onDelete={can(role, 'prescriptions', 'delete') ? () => handleDelete(p.data) : undefined}
          />
        ),
      },
    ],
    [role, canBuy],
  );

  return (
    <>
      <DataTable
        title={role === 'admin' ? 'Prescriptions' : 'My Prescriptions'}
        addLabel="New Prescription"
        onAdd={can(role, 'prescriptions', 'add') ? handleCreate : undefined}
        onRowDoubleClick={can(role, 'prescriptions', 'edit') ? handleEdit : undefined}
        columns={columns}
        rows={rows}
        loading={loading}
        searchKeys={['patientName', 'doctorName', 'medicines']}
        searchPlaceholder="Search prescriptions…"
      />
      {showModal && (
        <PrescriptionModal show={showModal} prescriptionToEdit={selected} onClose={() => setShowModal(false)} onSuccess={refresh} />
      )}
    </>
  );
}
