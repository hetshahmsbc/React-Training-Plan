// Add / edit a prescription — hand-built form. Medicines are chosen from a
// multi-select whose options come from the catalog (drives "Buy at Pharmacy").

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
  prescriptionToEdit?: Record<string, any> | null;
}

const EMPTY = { patientName: '', doctorName: '', appointmentId: '', date: toISODate(new Date()), medicineIds: [] as string[], medicines: '', notes: '' };

export function PrescriptionModal({ show, onClose, onSuccess, prescriptionToEdit }: Props) {
  const isEditing = Boolean(prescriptionToEdit);
  const { createItem, updateItem, loading } = useCrud(ApiUrls.prescriptions.list);
  const { data: medsResp } = useApiRequest({ url: ApiUrls.medicines.list, method: 'get', params: { pageSize: 100 } });
  const { data: docsResp } = useApiRequest({ url: ApiUrls.doctors.list, method: 'get', params: { pageSize: 100 } });
  const { data: patsResp } = useApiRequest({ url: ApiUrls.patients.list, method: 'get', params: { pageSize: 100 } });
  const medicines: Record<string, any>[] = medsResp?.data ?? [];
  const doctors: Record<string, any>[] = docsResp?.data ?? [];
  const patients: Record<string, any>[] = patsResp?.data ?? [];

  const [form, setForm] = useState<Record<string, any>>(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setForm(
      prescriptionToEdit
        ? {
            patientName: prescriptionToEdit.patientName || '',
            doctorName: prescriptionToEdit.doctorName || '',
            appointmentId: String(prescriptionToEdit.appointmentId ?? ''),
            date: prescriptionToEdit.date || '',
            medicineIds: (prescriptionToEdit.medicineIds ?? []).map((id: number) => String(id)),
            medicines: prescriptionToEdit.medicines || '',
            notes: prescriptionToEdit.notes || '',
          }
        : { ...EMPTY, medicineIds: [] },
    );
  }, [prescriptionToEdit, show]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.patientName || !form.doctorName) {
      setError('Patient and doctor names are required.');
      return;
    }
    const ids: number[] = (form.medicineIds ?? []).map((v: any) => Number(v));
    const chosen = medicines.filter((m) => ids.includes(m.id));
    const payload = {
      patientName: form.patientName,
      doctorName: form.doctorName,
      appointmentId: form.appointmentId ? Number(form.appointmentId) : undefined,
      date: form.date,
      medicineIds: ids,
      medicines: form.medicines?.trim() ? form.medicines : chosen.map((m) => m.name).join(', '),
      notes: form.notes,
    };
    try {
      if (isEditing) await updateItem(prescriptionToEdit!.id, payload);
      else await createItem(payload);
      onSuccess();
      onClose();
    } catch {
      setError('Could not save the prescription. Please try again.');
    }
  };

  return (
    <Modal show={show} onClose={onClose} title={isEditing ? 'Edit Prescription' : 'New Prescription'} size="md">
      <div style={{ padding: '16px 24px 24px' }}>
        {error && <div className="hms-form__error">{error}</div>}
        <div className="hms-form__grid">
          <Dropdown label="Patient" isRequired placeholder="Select patient" value={form.patientName} onChange={(o: any) => set('patientName', o?.value ?? '')} options={patients.map((p) => ({ label: `${p.firstName} ${p.lastName}`, value: `${p.firstName} ${p.lastName}` }))} />
          <Dropdown label="Doctor" isRequired placeholder="Select doctor" value={form.doctorName} onChange={(o: any) => set('doctorName', o?.value ?? '')} options={doctors.map((d) => ({ label: `Dr. ${d.firstName} ${d.lastName}`, value: `${d.firstName} ${d.lastName}` }))} />
          <Input label="Appointment #" variant="number" value={form.appointmentId} onChange={(e: any) => set('appointmentId', e.target.value)} />
          <DatePicker label="Date" value={form.date ? parseISODate(form.date) ?? null : null} onChange={(d: Date | null) => set('date', d ? toISODate(d) : '')} dateFormat="yyyy-MM-dd" placeholder="Select a date" />
          <div className="hms-form__full">
            <Dropdown label="Prescribed Medicines" isMulti placeholder="Select medicines" value={form.medicineIds} onChange={(opts: any) => set('medicineIds', (opts ?? []).map((o: any) => o.value))} options={medicines.map((m) => ({ label: `${m.name} — ₹${m.price}`, value: String(m.id) }))} />
          </div>
          <div className="hms-form__full">
            <Input label="Dosage Instructions" variant="textarea" value={form.medicines} onChange={(e: any) => set('medicines', e.target.value)} />
          </div>
          <div className="hms-form__full">
            <Input label="Notes" variant="textarea" value={form.notes} onChange={(e: any) => set('notes', e.target.value)} />
          </div>
        </div>
        <div className="hms-form__actions">
          <Button text="Cancel" variant="secondary" onClick={onClose} />
          <Button text={isEditing ? 'Save Changes' : 'Create'} onClick={submit} disabled={loading} />
        </div>
      </div>
    </Modal>
  );
}
