// Add / edit a doctor — hand-built form using react-toolkit inputs.

import { useEffect, useState } from 'react';
import { Modal, Input, Dropdown, Button } from '@msbc/react-toolkit';
import { useCrud } from '../services/useCrud';
import { ApiUrls } from '../utils/constants';

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  doctorToEdit?: Record<string, any> | null;
}

const SPECIALIZATIONS = ['Cardiology', 'Orthopedics', 'Dermatology', 'Pediatrics', 'Neurology', 'General Medicine', 'ENT', 'Gynecology'];
const EMPTY = { firstName: '', lastName: '', specialization: 'Cardiology', email: '', phone: '', fee: '', available: 'true' };

export function DoctorModal({ show, onClose, onSuccess, doctorToEdit }: Props) {
  const isEditing = Boolean(doctorToEdit);
  const { createItem, updateItem, loading } = useCrud(ApiUrls.doctors.list);
  const [form, setForm] = useState<Record<string, any>>(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setForm(
      doctorToEdit
        ? {
            firstName: doctorToEdit.firstName || '',
            lastName: doctorToEdit.lastName || '',
            specialization:
              (typeof doctorToEdit.specialization === 'object'
                ? doctorToEdit.specialization?.value ?? doctorToEdit.specialization?.label
                : doctorToEdit.specialization) || 'Cardiology',
            email: doctorToEdit.email || '',
            phone: doctorToEdit.phone || '',
            fee: String(doctorToEdit.fee ?? ''),
            available: doctorToEdit.available === false ? 'false' : 'true',
          }
        : EMPTY,
    );
  }, [doctorToEdit, show]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.fee) {
      setError('Please fill in all required fields.');
      return;
    }
    const payload = { ...form, fee: Number(form.fee), available: form.available === 'true' };
    try {
      if (isEditing) await updateItem(doctorToEdit!.id, payload);
      else await createItem(payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Could not save the doctor. Please try again.');
    }
  };

  return (
    <Modal show={show} onClose={onClose} title={isEditing ? 'Edit Doctor' : 'Add Doctor'} size="md">
      <div style={{ padding: '16px 24px 24px' }}>
        {error && <div className="hms-form__error">{error}</div>}
        <div className="hms-form__grid">
          <Input label="First Name" variant="text" isRequired value={form.firstName} onChange={(e: any) => set('firstName', e.target.value)} />
          <Input label="Last Name" variant="text" isRequired value={form.lastName} onChange={(e: any) => set('lastName', e.target.value)} />
          <Dropdown label="Specialization" isRequired options={SPECIALIZATIONS.map((s) => ({ label: s, value: s }))} value={form.specialization} onChange={(o: any) => set('specialization', o?.value ?? '')} />
          <Input label="Email" variant="email" isRequired value={form.email} onChange={(e: any) => set('email', e.target.value)} />
          <Input label="Phone" variant="tel" value={form.phone} onChange={(e: any) => set('phone', e.target.value)} />
          <Input label="Consultation Fee (₹)" variant="number" isRequired value={form.fee} onChange={(e: any) => set('fee', e.target.value)} />
          <Dropdown label="Availability" options={[{ label: 'Available', value: 'true' }, { label: 'Unavailable', value: 'false' }]} value={form.available} onChange={(o: any) => set('available', o?.value ?? 'true')} />
        </div>
        <div className="hms-form__actions">
          <Button text="Cancel" variant="secondary" onClick={onClose} />
          <Button text={isEditing ? 'Save Changes' : 'Add Doctor'} onClick={submit} disabled={loading} />
        </div>
      </div>
    </Modal>
  );
}
