// Doctors list — hand-built: we fetch, we refresh, we define the columns.

import { useMemo, useState } from 'react';
import { useApiRequest } from '@msbc/data-layer';
import { DataTable } from '../components/DataTable';
import { DoctorModal } from '../components/DoctorModal';
import { NameCell } from '../components/Avatar';
import { RowActions } from '../components/RowActions';
import { useCrud } from '../services/useCrud';
import { ApiUrls } from '../utils/constants';

export default function DoctorsPage() {
  const { data, loading, execute } = useApiRequest({ url: ApiUrls.doctors.list, method: 'get', params: { pageSize: 100 } });
  const rows: Record<string, any>[] = data?.data ?? [];
  const { removeItem } = useCrud(ApiUrls.doctors.list);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Record<string, any> | null>(null);

  const refresh = () => execute({ params: { pageSize: 100 } });
  const handleCreate = () => { setSelected(null); setShowModal(true); };
  const handleEdit = (row: Record<string, any>) => { setSelected(row); setShowModal(true); };
  const handleDelete = async (row: Record<string, any>) => {
    if (!window.confirm(`Delete Dr. ${row.firstName} ${row.lastName}?`)) return;
    await removeItem(row.id);
    refresh();
  };

  const columns = useMemo(
    () => [
      { field: 'firstName', headerName: 'Doctor', flex: 1.5, cellRenderer: (p: any) => <NameCell name={`${p.data.firstName} ${p.data.lastName}`} /> },
      {
        field: 'specialization',
        headerName: 'Specialization',
        // Guard against legacy records where specialization was saved as an
        // object {label,value} instead of a plain string.
        valueFormatter: (p: any) =>
          p.value && typeof p.value === 'object' ? p.value.value ?? p.value.label ?? '' : p.value,
      },
      { field: 'email', headerName: 'Email' },
      { field: 'phone', headerName: 'Phone' },
      { field: 'fee', headerName: 'Fee (₹)', width: 110 },
      { field: 'available', headerName: 'Available', width: 120, cellRenderer: (p: any) => (p.value ? 'Yes' : 'No') },
      { field: 'actions', headerName: 'Actions', width: 120, sortable: false, cellRenderer: (p: any) => <RowActions onEdit={() => handleEdit(p.data)} onDelete={() => handleDelete(p.data)} /> },
    ],
    [],
  );

  return (
    <>
      <DataTable
        title="Doctors"
        addLabel="Add Doctor"
        onAdd={handleCreate}
        onRowDoubleClick={handleEdit}
        columns={columns}
        rows={rows}
        loading={loading}
        searchKeys={['firstName', 'lastName', 'specialization', 'email']}
        searchPlaceholder="Search doctors…"
      />
      {showModal && (
        <DoctorModal show={showModal} doctorToEdit={selected} onClose={() => setShowModal(false)} onSuccess={refresh} />
      )}
    </>
  );
}
