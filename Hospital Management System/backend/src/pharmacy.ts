// Pharmacy checkout is more than plain CRUD: placing an order must check stock,
// reduce it, and compute the total. So orders get their own router.

import { Router } from 'express';
import { medicines, orders } from './db';
import { queryCollection, nextId } from './store';
import type { Order, OrderItem } from './types';

export const pharmacyRouter = Router();

// List past orders (paginated) — used by the Billing/Orders dashboard.
pharmacyRouter.get('/orders', (req, res) => {
  res.json(queryCollection(orders, req, ['patientName', 'status']));
});

// Place an order. Body: { patientName, items: [{ medicineId, qty }] }
pharmacyRouter.post('/orders', (req, res) => {
  const { patientName, items } = req.body ?? {};
  if (!patientName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'patientName and at least one item are required' });
  }

  const lineItems: OrderItem[] = [];
  for (const item of items) {
    const med = medicines.find((m) => m.id === Number(item.medicineId));
    if (!med) return res.status(400).json({ message: `Medicine ${item.medicineId} not found` });
    const qty = Number(item.qty) || 0;
    if (qty <= 0) return res.status(400).json({ message: `Invalid quantity for ${med.name}` });
    if (med.stock < qty) {
      return res.status(400).json({ message: `Not enough stock for ${med.name} (have ${med.stock})` });
    }
    lineItems.push({ medicineId: med.id, name: med.name, qty, price: med.price });
  }

  // All good — reduce stock and record the order.
  for (const li of lineItems) {
    const med = medicines.find((m) => m.id === li.medicineId)!;
    med.stock -= li.qty;
  }

  const total = lineItems.reduce((sum, li) => sum + li.price * li.qty, 0);
  const order: Order = {
    id: nextId('orders', orders),
    patientName,
    items: lineItems,
    total,
    status: 'placed',
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});
