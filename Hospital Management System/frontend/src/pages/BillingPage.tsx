// Billing — admin manages invoices; a patient sees only their own bills. A
// pharmacy checkout can still raise the bill (pre-filled invoice) for any role.

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApiRequest } from '@msbc/data-layer';
import { DataTable } from '../components/DataTable';
import { InvoiceModal } from '../components/InvoiceModal';
import { NameCell } from '../components/Avatar';
import { RowActions } from '../components/RowActions';
import { useAuth } from '../context/AuthContext';
import { scopeByRole } from '../lib/roles';
import { useCrud } from '../services/useCrud';
import { ApiUrls } from '../utils/constants';

export default function BillingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user!.role;
  const isAdmin = role === 'admin';
  const { data, loading, execute } = useApiRequest({ url: ApiUrls.invoices.list, method: 'get', params: { pageSize: 100 } });
  const rows = scopeByRole(data?.data ?? [], user, { patientField: 'patientName' });
  const { removeItem } = useCrud(ApiUrls.invoices.list);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Record<string, any> | null>(null);
  const [prefill, setPrefill] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const incoming = (location.state as any)?.newInvoice;
    if (incoming) {
      setSelected(null);
      setPrefill(incoming);
      setShowModal(true);
      navigate('.', { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => execute({ params: { pageSize: 100 } });
  const handleCreate = () => { setSelected(null); setPrefill(null); setShowModal(true); };
  const handleEdit = (row: Record<string, any>) => { setSelected(row); setShowModal(true); };
  const handleDelete = async (row: Record<string, any>) => {
    if (!window.confirm(`Delete invoice for ${row.patientName}?`)) return;
    await removeItem(row.id);
    refresh();
  };

  const columns = useMemo(
    () => [
      { field: 'patientName', headerName: 'Patient', flex: 1.5, cellRenderer: (p: any) => <NameCell name={p.data.patientName} /> },
      { field: 'appointmentId', headerName: 'Appt #', width: 100 },
      { field: 'amount', headerName: 'Amount (₹)', width: 130 },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        cellRenderer: (p: any) => (
          <span className="hms-actioncell">
            <span
              className="status-pill"
              style={{
                background: p.value === 'paid' ? '#e4f5ea' : '#feecec',
                color: p.value === 'paid' ? '#16a34a' : '#ef4444',
              }}
            >
              {p.value}
            </span>
          </span>
        ),
      },
      { field: 'date', headerName: 'Date', width: 130 },
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
        title={isAdmin ? 'Billing' : 'My Bills'}
        addLabel="Create Invoice"
        onAdd={isAdmin ? handleCreate : undefined}
        onRowDoubleClick={isAdmin ? handleEdit : undefined}
        columns={columns}
        rows={rows}
        loading={loading}
        searchKeys={['patientName', 'status']}
        searchPlaceholder="Search invoices…"
      />
      {showModal && (
        <InvoiceModal
          show={showModal}
          invoiceToEdit={selected}
          prefill={prefill}
          onClose={() => {
            setShowModal(false);
            setPrefill(null);
          }}
          onSuccess={refresh}
        />
      )}
    </>
  );
}
