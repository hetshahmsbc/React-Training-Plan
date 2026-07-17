// Add / edit a billing invoice — hand-built form.

import { useEffect, useState } from 'react';
import { Modal, Input, Dropdown, DatePicker, Button } from '@msbc/react-toolkit';
import { useApiRequest } from '@msbc/data-layer';
import { useCrud } from '../services/useCrud';
import { ApiUrls } from '../utils/constants';
import { parseISODate, toISODate } from '../utils/date';

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoiceToEdit?: Record<string, any> | null;
  prefill?: Record<string, any> | null; // seed a NEW invoice (e.g. from a pharmacy order)
}

const EMPTY = { patientName: '', appointmentId: '', amount: '', date: toISODate(new Date()), status: 'unpaid' };

export function InvoiceModal({ show, onClose, onSuccess, invoiceToEdit, prefill }: Props) {
  const isEditing = Boolean(invoiceToEdit);
  const { createItem, updateItem, loading } = useCrud(ApiUrls.invoices.list);
  const { data: patsResp } = useApiRequest({ url: ApiUrls.patients.list, method: 'get', params: { pageSize: 100 } });
  const patients: Record<string, any>[] = patsResp?.data ?? [];
  const [form, setForm] = useState<Record<string, any>>(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    if (invoiceToEdit) {
      setForm({
        patientName: invoiceToEdit.patientName || '',
        appointmentId: String(invoiceToEdit.appointmentId ?? ''),
        amount: String(invoiceToEdit.amount ?? ''),
        date: invoiceToEdit.date || '',
        status: invoiceToEdit.status || 'unpaid',
      });
    } else if (prefill) {
      // New invoice seeded from a pharmacy order (patient + amount).
      setForm({
        ...EMPTY,
        patientName: prefill.patientName ?? '',
        amount: prefill.amount != null ? String(prefill.amount) : '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [invoiceToEdit, prefill, show]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.patientName || !form.amount) {
      setError('Patient name and amount are required.');
      return;
    }
    const payload = {
      patientName: form.patientName,
      appointmentId: form.appointmentId ? Number(form.appointmentId) : undefined,
      amount: Number(form.amount),
      date: form.date,
      status: form.status,
    };
    try {
      if (isEditing) await updateItem(invoiceToEdit!.id, payload);
      else await createItem(payload);
      onSuccess();
      onClose();
    } catch {
      setError('Could not save the invoice. Please try again.');
    }
  };

  return (
    <Modal show={show} onClose={onClose} title={isEditing ? 'Edit Invoice' : 'Create Invoice'} size="md">
      <div style={{ padding: '16px 24px 24px' }}>
        {error && <div className="hms-form__error">{error}</div>}
        <div className="hms-form__grid">
          <Dropdown label="Patient" isRequired placeholder="Select patient" value={form.patientName} onChange={(o: any) => set('patientName', o?.value ?? '')} options={patients.map((p) => ({ label: `${p.firstName} ${p.lastName}`, value: `${p.firstName} ${p.lastName}` }))} />
          <Input label="Appointment #" variant="number" value={form.appointmentId} onChange={(e: any) => set('appointmentId', e.target.value)} />
          <Input label="Amount (₹)" variant="number" isRequired value={form.amount} onChange={(e: any) => set('amount', e.target.value)} />
          <DatePicker label="Date" value={form.date ? parseISODate(form.date) ?? null : null} onChange={(d: Date | null) => set('date', d ? toISODate(d) : '')} dateFormat="yyyy-MM-dd" placeholder="Select a date" />
          <Dropdown label="Status" value={form.status} onChange={(o: any) => set('status', o?.value ?? 'unpaid')} options={[{ label: 'Unpaid', value: 'unpaid' }, { label: 'Paid', value: 'paid' }]} />
        </div>
        <div className="hms-form__actions">
          <Button text="Cancel" variant="secondary" onClick={onClose} />
          <Button text={isEditing ? 'Save Changes' : 'Create Invoice'} onClick={submit} disabled={loading} />
        </div>
      </div>
    </Modal>
  );
}
