// Helpers for the toolkit DatePicker, whose value is a JS `Date`, while our API
// stores plain 'YYYY-MM-DD' strings. These convert between the two safely
// (parsing/formatting in LOCAL time so the day never shifts across timezones).

export function parseISODate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = String(value).split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d); // local midnight
}

export function toISODate(value: unknown): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  if (isNaN(date.getTime())) return typeof value === 'string' ? value : '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 30-minute clinic slots from 09:00 to 17:00.
export const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 9; h <= 17; h++) {
    for (const min of ['00', '30']) {
      if (h === 17 && min === '30') break; // stop at 17:00
      slots.push(`${String(h).padStart(2, '0')}:${min}`);
    }
  }
  return slots;
})();
