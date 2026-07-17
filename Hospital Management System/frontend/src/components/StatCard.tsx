// A KPI tile for the dashboard: coloured icon + big value + label.

import { type ReactNode } from 'react';

interface Props {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  accent: string; // hex colour, e.g. '#2563eb'
}

export function StatCard({ label, value, icon, accent }: Props) {
  return (
    <div className="card stat-card">
      <div className="stat-card__icon" style={{ background: `${accent}1a`, color: accent }}>
        {icon}
      </div>
      <div>
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
}
