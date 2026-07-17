// Turns any in-memory array into a REST resource with the 5 standard verbs.
// Used by doctors / patients / appointments / medicines / prescriptions / invoices.
//
//   GET    /            -> paginated list (search, sort, filter via query params)
//   GET    /:id         -> single record
//   POST   /            -> create
//   PUT    /:id         -> replace / update
//   DELETE /:id         -> remove

import { Router } from 'express';
import type { WithId } from './types';
import { queryCollection, nextId } from './store';

/** Returns the first unique field that clashes with an existing record, or null. */
function duplicateField<T extends WithId>(
  items: T[],
  body: Record<string, any>,
  uniqueFields: (keyof T)[],
  excludeId: number | null,
): string | null {
  for (const field of uniqueFields) {
    const value = String(body[field as string] ?? '').trim().toLowerCase();
    if (!value) continue; // ignore empty values (e.g. optional email)
    const clash = items.some(
      (r) =>
        r.id !== excludeId &&
        String((r as Record<string, any>)[field as string] ?? '').trim().toLowerCase() === value,
    );
    if (clash) return String(field);
  }
  return null;
}

export function createCrudRouter<T extends WithId>(
  name: string,
  items: T[],
  searchableFields: (keyof T)[],
  uniqueFields: (keyof T)[] = [],
) {
  const router = Router();

  router.get('/', (req, res) => {
    res.json(queryCollection(items, req, searchableFields));
  });

  router.get('/:id', (req, res) => {
    const row = items.find((r) => r.id === Number(req.params.id));
    if (!row) return res.status(404).json({ message: `${name} not found` });
    res.json(row);
  });

  router.post('/', (req, res) => {
    const dup = duplicateField(items, req.body ?? {}, uniqueFields, null);
    if (dup) return res.status(409).json({ message: `A ${name.toLowerCase()} with this ${dup} already exists.` });
    const record = { ...req.body, id: nextId(name, items) } as T;
    items.push(record);
    res.status(201).json(record);
  });

  router.put('/:id', (req, res) => {
    const idx = items.findIndex((r) => r.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ message: `${name} not found` });
    const dup = duplicateField(items, req.body ?? {}, uniqueFields, items[idx].id);
    if (dup) return res.status(409).json({ message: `A ${name.toLowerCase()} with this ${dup} already exists.` });
    items[idx] = { ...items[idx], ...req.body, id: items[idx].id };
    res.json(items[idx]);
  });

  router.delete('/:id', (req, res) => {
    const idx = items.findIndex((r) => r.id === Number(req.params.id));
    if (idx === -1) return res.status(404).json({ message: `${name} not found` });
    const [removed] = items.splice(idx, 1);
    res.json(removed);
  });

  return router;
}
