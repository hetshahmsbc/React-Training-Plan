// Pharmacy — buy medicine. Hand-built catalog + cart + checkout (backend
// validates & reduces stock). Class-based styling so it adapts to dark mode.

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApiRequest } from '@msbc/data-layer';
import { Button, Dropdown } from '@msbc/react-toolkit';
import { useAuth } from '../context/AuthContext';
import { ApiUrls } from '../utils/constants';

interface Medicine {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export default function PharmacyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState<Record<number, number>>({});
  // A patient buys for themselves by default.
  const [patientName, setPatientName] = useState(user?.role === 'patient' ? user.name : '');
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const { data: medsResp, loading, execute: refetchMeds } = useApiRequest({
    url: ApiUrls.medicines.list,
    method: 'get',
    params: { pageSize: 100 },
  });
  const { execute: placeOrder, loading: placing } = useApiRequest({
    url: ApiUrls.pharmacy.checkout,
    method: 'post',
    autoFetch: false,
  });

  const { data: patientsResp } = useApiRequest({ url: ApiUrls.patients.list, method: 'get', params: { pageSize: 100 } });
  const patients: Record<string, any>[] = patientsResp?.data ?? [];

  const medicines: Medicine[] = medsResp?.data ?? [];

  // Pre-fill the cart when we arrive from a prescription's "Buy" button.
  useEffect(() => {
    const incoming = (location.state as any)?.fromPrescription;
    if (incoming?.medicineIds?.length) {
      const seeded: Record<number, number> = {};
      for (const id of incoming.medicineIds as number[]) seeded[id] = (seeded[id] ?? 0) + 1;
      setCart(seeded);
      if (incoming.patientName) setPatientName(incoming.patientName);
      setMessage({ type: 'ok', text: `Loaded ${incoming.medicineIds.length} medicine(s) from a prescription${incoming.patientName ? ` for ${incoming.patientName}` : ''}.` });
      navigate('.', { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = (med: Medicine) => {
    setMessage(null);
    setCart((c) => (c[med.id] ?? 0) >= med.stock ? c : { ...c, [med.id]: (c[med.id] ?? 0) + 1 });
  };
  const changeQty = (id: number, delta: number) => {
    setCart((c) => {
      const next = (c[id] ?? 0) + delta;
      const updated = { ...c };
      if (next <= 0) delete updated[id];
      else updated[id] = next;
      return updated;
    });
  };

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const med = medicines.find((m) => m.id === Number(id));
          return med ? { med, qty } : null;
        })
        .filter(Boolean) as { med: Medicine; qty: number }[],
    [cart, medicines],
  );
  const total = cartLines.reduce((sum, l) => sum + l.med.price * l.qty, 0);

  const handleCheckout = async () => {
    setMessage(null);
    if (!patientName.trim()) return setMessage({ type: 'err', text: 'Please enter the patient name.' });
    if (cartLines.length === 0) return setMessage({ type: 'err', text: 'Your cart is empty.' });
    try {
      const items = cartLines.map((l) => ({ medicineId: l.med.id, qty: l.qty }));
      const res = await placeOrder({ body: { patientName: patientName.trim(), items } });
      const order = res?.data ?? res;
      refetchMeds(); // reflect reduced stock for next time
      // Continue the flow: hand the order total to Billing to raise an invoice.
      navigate('/billing', {
        state: {
          newInvoice: {
            patientName: patientName.trim(),
            amount: order?.total ?? total,
            orderId: order?.id,
          },
        },
      });
    } catch {
      setMessage({ type: 'err', text: 'Could not place the order (check stock and try again).' });
    }
  };

  return (
    <div>
      {message && <div className={`med-msg med-msg--${message.type}`}>{message.text}</div>}

      <div className="med-layout">
        <div>
          {loading ? (
            <div className="hms-empty">Loading medicines…</div>
          ) : (
            <div className="med-grid">
              {medicines.map((med) => {
                const out = med.stock <= 0;
                return (
                  <div key={med.id} className="med-card">
                    <div className="med-card__name">{med.name}</div>
                    <div className="med-card__cat">{med.category}</div>
                    <div className="med-card__desc">{med.description}</div>
                    <div className="med-card__meta">
                      <span className="med-card__price">₹{med.price}</span>
                      <span style={{ fontSize: 12, color: out ? '#ef4444' : '#16a34a' }}>
                        {out ? 'Out of stock' : `${med.stock} in stock`}
                      </span>
                    </div>
                    <button className="med-card__btn" disabled={out} onClick={() => addToCart(med)}>
                      Add to cart
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="hms-card cart">
          <h3 className="cart__title">🛒 Cart</h3>
          {cartLines.length === 0 ? (
            <p style={{ color: '#8a94a6', fontSize: 14 }}>No items yet.</p>
          ) : (
            cartLines.map(({ med, qty }) => (
              <div key={med.id} className="cart__row">
                <span style={{ flex: 1 }}>{med.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="hms-linkbtn" onClick={() => changeQty(med.id, -1)}>−</button>
                  {qty}
                  <button className="hms-linkbtn" onClick={() => changeQty(med.id, +1)} disabled={qty >= med.stock}>+</button>
                </span>
                <span style={{ width: 56, textAlign: 'right' }}>₹{med.price * qty}</span>
              </div>
            ))
          )}

          <hr className="cart__divider" />
          <div className="cart__total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div style={{ marginBottom: 12 }}>
            <Dropdown
              label="Patient"
              placeholder="Select patient"
              value={patientName}
              onChange={(o: any) => setPatientName(o?.value ?? '')}
              options={patients.map((p) => ({ label: `${p.firstName} ${p.lastName}`, value: `${p.firstName} ${p.lastName}` }))}
            />
          </div>

          <Button text={placing ? 'Placing…' : 'Place Order'} onClick={handleCheckout} disabled={placing || cartLines.length === 0} />
        </div>
      </div>
    </div>
  );
}
