// Book / edit an appointment — hand-built form. Doctor & patient options come
// from the API; date is a picker; time is a slot dropdown.

import { useEffect, useState } from 'react';
import { Modal, Input, Dropdown, DatePicker, Button } from '@msbc/react-toolkit';
import { useApiRequest } from '@msbc/data-layer';
import { useCrud } from '../services/useCrud';
import { ApiUrls } from '../utils/constants';
import { parseISODate, toISODate, TIME_SLOTS } from '../utils/date';

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  appointmentToEdit?: Record<string, any> | null;
}

const EMPTY = { patientId: '', doctorId: '', date: '', time: '', status: 'scheduled', reason: '' };

export function AppointmentModal({ show, onClose, onSuccess, appointmentToEdit }: Props) {
  const isEditing = Boolean(appointmentToEdit);
  const { createItem, updateItem, loading } = useCrud(ApiUrls.appointments.list);
  const { data: doctorsResp } = useApiRequest({ url: ApiUrls.doctors.list, method: 'get', params: { pageSize: 100 } });
  const { data: patientsResp } = useApiRequest({ url: ApiUrls.patients.list, method: 'get', params: { pageSize: 100 } });
  const doctors: Record<string, any>[] = doctorsResp?.data ?? [];
  const patients: Record<string, any>[] = patientsResp?.data ?? [];

  const [form, setForm] = useState<Record<string, any>>(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setForm(
      appointmentToEdit
        ? {
            patientId: String(appointmentToEdit.patientId ?? ''),
            doctorId: String(appointmentToEdit.doctorId ?? ''),
            date: appointmentToEdit.date || '',
            time: appointmentToEdit.time || '',
            status: appointmentToEdit.status || 'scheduled',
            reason: appointmentToEdit.reason || '',
          }
        : EMPTY,
    );
  }, [appointmentToEdit, show]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.patientId || !form.doctorId || !form.date || !form.time) {
      setError('Patient, doctor, date and time are required.');
      return;
    }
    const doctor = doctors.find((d) => String(d.id) === String(form.doctorId));
    const patient = patients.find((p) => String(p.id) === String(form.patientId));
    const payload = {
      patientId: Number(form.patientId),
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
      doctorId: Number(form.doctorId),
      doctorName: doctor ? `${doctor.firstName} ${doctor.lastName}` : '',
      date: form.date,
      time: form.time,
      status: form.status,
      reason: form.reason,
    };
    try {
      if (isEditing) await updateItem(appointmentToEdit!.id, payload);
      else await createItem(payload);
      onSuccess();
      onClose();
    } catch {
      setError('Could not save the appointment. Please try again.');
    }
  };

  return (
    <Modal show={show} onClose={onClose} title={isEditing ? 'Edit Appointment' : 'Book Appointment'} size="md">
      <div style={{ padding: '16px 24px 24px' }}>
        {error && <div className="hms-form__error">{error}</div>}
        <div className="hms-form__grid">
          <Dropdown label="Patient" isRequired placeholder="Select patient" value={form.patientId} onChange={(o: any) => set('patientId', o?.value ?? '')} options={patients.map((p) => ({ label: `${p.firstName} ${p.lastName}`, value: String(p.id) }))} />
          <Dropdown label="Doctor" isRequired placeholder="Select doctor" value={form.doctorId} onChange={(o: any) => set('doctorId', o?.value ?? '')} options={doctors.map((d) => ({ label: `Dr. ${d.firstName} ${d.lastName} — ${d.specialization}`, value: String(d.id) }))} />
          <DatePicker label="Appointment Date" value={form.date ? parseISODate(form.date) ?? null : null} onChange={(d: Date | null) => set('date', d ? toISODate(d) : '')} dateFormat="yyyy-MM-dd" minDate={new Date()} placeholder="Select a date" isRequired />
          <Dropdown label="Time Slot" isRequired placeholder="Select a time" value={form.time} onChange={(o: any) => set('time', o?.value ?? '')} options={TIME_SLOTS.map((t) => ({ label: t, value: t }))} />
          <Dropdown label="Status" value={form.status} onChange={(o: any) => set('status', o?.value ?? 'scheduled')} options={[{ label: 'Scheduled', value: 'scheduled' }, { label: 'Completed', value: 'completed' }, { label: 'Cancelled', value: 'cancelled' }]} />
          <div className="hms-form__full">
            <Input label="Reason for visit" variant="textarea" value={form.reason} onChange={(e: any) => set('reason', e.target.value)} />
          </div>
        </div>
        <div className="hms-form__actions">
          <Button text="Cancel" variant="secondary" onClick={onClose} />
          <Button text={isEditing ? 'Save Changes' : 'Book Appointment'} onClick={submit} disabled={loading} />
        </div>
      </div>
    </Modal>
  );
}
