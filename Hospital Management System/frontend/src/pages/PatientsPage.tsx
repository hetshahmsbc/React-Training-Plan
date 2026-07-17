// Patients — admin manages everyone; a doctor sees (read-only) only the patients
// they have appointments with.

import { useMemo, useState } from 'react';
import { useApiRequest } from '@msbc/data-layer';
import { DataTable } from '../components/DataTable';
import { PatientModal } from '../components/PatientModal';
import { NameCell } from '../components/Avatar';
import { RowActions } from '../components/RowActions';
import { useAuth } from '../context/AuthContext';
import { useCrud } from '../services/useCrud';
import { ApiUrls } from '../utils/constants';

export default function PatientsPage() {
  const { user } = useAuth();
  const isAdmin = user!.role === 'admin';
  const { data, loading, execute } = useApiRequest({ url: ApiUrls.patients.list, method: 'get', params: { pageSize: 100 } });
  // A doctor's patient list = the patients from their own appointments.
  const { data: apptData } = useApiRequest({ url: ApiUrls.appointments.list, method: 'get', params: { pageSize: 200 } });
  const { removeItem } = useCrud(ApiUrls.patients.list);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Record<string, any> | null>(null);

  const allPatients: Record<string, any>[] = data?.data ?? [];
  const rows = useMemo(() => {
    if (isAdmin) return allPatients;
    const mine = new Set(
      (apptData?.data ?? [])
        .filter((a: any) => a.doctorName === user!.name)
        .map((a: any) => a.patientName),
    );
    return allPatients.filter((p) => mine.has(`${p.firstName} ${p.lastName}`));
  }, [allPatients, apptData, isAdmin, user]);

  const refresh = () => execute({ params: { pageSize: 100 } });
  const handleCreate = () => { setSelected(null); setShowModal(true); };
  const handleEdit = (row: Record<string, any>) => { setSelected(row); setShowModal(true); };
  const handleDelete = async (row: Record<string, any>) => {
    if (!window.confirm(`Delete patient ${row.firstName} ${row.lastName}?`)) return;
    await removeItem(row.id);
    refresh();
  };

  const columns = useMemo(
    () => [
      { field: 'firstName', headerName: 'Patient', flex: 1.5, cellRenderer: (p: any) => <NameCell name={`${p.data.firstName} ${p.data.lastName}`} /> },
      { field: 'email', headerName: 'Email' },
      { field: 'phone', headerName: 'Phone' },
      { field: 'gender', headerName: 'Gender', width: 110 },
      { field: 'bloodGroup', headerName: 'Blood', width: 90 },
      { field: 'dob', headerName: 'DOB', width: 130 },
      ...(isAdmin
        ? [{
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            cellRenderer: (p: any) => <RowActions onEdit={() => handleEdit(p.data)} onDelete={() => handleDelete(p.data)} />,
          }]
        : []),
    ],
    [isAdmin],
  );

  return (
    <>
      <DataTable
        title={isAdmin ? 'Patient Info' : 'My Patients'}
        addLabel="Register Patient"
        onAdd={isAdmin ? handleCreate : undefined}
        onRowDoubleClick={isAdmin ? handleEdit : undefined}
        columns={columns}
        rows={rows}
        loading={loading}
        searchKeys={['firstName', 'lastName', 'email', 'phone', 'bloodGroup']}
        searchPlaceholder="Search patients…"
      />
      {showModal && (
        <PatientModal show={showModal} patientToEdit={selected} onClose={() => setShowModal(false)} onSuccess={refresh} />
      )}
    </>
  );
}
