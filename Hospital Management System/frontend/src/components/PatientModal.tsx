// Add / edit a patient — hand-built form.

import { useEffect, useState } from 'react';
import { Modal, Input, Dropdown, DatePicker, Button } from '@msbc/react-toolkit';
import { useCrud } from '../services/useCrud';
import { ApiUrls } from '../utils/constants';
import { parseISODate, toISODate } from '../utils/date';

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientToEdit?: Record<string, any> | null;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const EMPTY = { firstName: '', lastName: '', email: '', phone: '', gender: 'male', dob: '', bloodGroup: 'O+' };

export function PatientModal({ show, onClose, onSuccess, patientToEdit }: Props) {
  const isEditing = Boolean(patientToEdit);
  const { createItem, updateItem, loading } = useCrud(ApiUrls.patients.list);
  const [form, setForm] = useState<Record<string, any>>(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    setForm(
      patientToEdit
        ? {
            firstName: patientToEdit.firstName || '',
            lastName: patientToEdit.lastName || '',
            email: patientToEdit.email || '',
            phone: patientToEdit.phone || '',
            gender: patientToEdit.gender || 'male',
            dob: patientToEdit.dob || '',
            bloodGroup: patientToEdit.bloodGroup || 'O+',
          }
        : EMPTY,
    );
  }, [patientToEdit, show]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.firstName || !form.lastName) {
      setError('First and last name are required.');
      return;
    }
    try {
      if (isEditing) await updateItem(patientToEdit!.id, form);
      else await createItem(form);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Could not save the patient. Please try again.');
    }
  };

  return (
    <Modal show={show} onClose={onClose} title={isEditing ? 'Edit Patient' : 'Register Patient'} size="md">
      <div style={{ padding: '16px 24px 24px' }}>
        {error && <div className="hms-form__error">{error}</div>}
        <div className="hms-form__grid">
          <Input label="First Name" variant="text" isRequired value={form.firstName} onChange={(e: any) => set('firstName', e.target.value)} />
          <Input label="Last Name" variant="text" isRequired value={form.lastName} onChange={(e: any) => set('lastName', e.target.value)} />
          <Input label="Email" variant="email" value={form.email} onChange={(e: any) => set('email', e.target.value)} />
          <Input label="Phone" variant="tel" value={form.phone} onChange={(e: any) => set('phone', e.target.value)} />
          <Dropdown label="Gender" options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]} value={form.gender} onChange={(o: any) => set('gender', o?.value ?? 'male')} />
          <DatePicker label="Date of Birth" value={form.dob ? parseISODate(form.dob) ?? null : null} onChange={(d: Date | null) => set('dob', d ? toISODate(d) : '')} dateFormat="yyyy-MM-dd" maxDate={new Date()} placeholder="Select date of birth" />
          <Dropdown label="Blood Group" options={BLOOD_GROUPS.map((g) => ({ label: g, value: g }))} value={form.bloodGroup} onChange={(o: any) => set('bloodGroup', o?.value ?? 'O+')} />
        </div>
        <div className="hms-form__actions">
          <Button text="Cancel" variant="secondary" onClick={onClose} />
          <Button text={isEditing ? 'Save Changes' : 'Register'} onClick={submit} disabled={loading} />
        </div>
      </div>
    </Modal>
  );
}
