// Circular initials avatar with a stable per-name color.

const COLORS = ['#2f6bed', '#16a34a', '#db2777', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#0d9488'];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return COLORS[hash % COLORS.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <span
      className="hms-avatar"
      style={{ width: size, height: size, background: colorFor(name || '?'), fontSize: size * 0.36 }}
    >
      {initials(name || '?')}
    </span>
  );
}

/** Name cell for grids: avatar + name, vertically centered. */
export function NameCell({ name }: { name: string }) {
  return (
    <span className="hms-namecell">
      <Avatar name={name} size={34} />
      <span>{name}</span>
    </span>
  );
}
