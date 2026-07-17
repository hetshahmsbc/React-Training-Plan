// A dependency-free donut chart drawn with plain SVG. Each segment is a circle
// with a stroke-dasharray sized to its share of the total, offset so they sit
// end-to-end around the ring.

export interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
}

export function DonutChart({ segments, size = 180, thickness = 22, centerLabel = 'Total' }: Props) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {/* background ring */}
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2f7" strokeWidth={thickness} />
          {total > 0 &&
            segments.map((seg, i) => {
              const len = (seg.value / total) * circumference;
              const el = (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${len} ${circumference - len}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                />
              );
              offset += len;
              return el;
            })}
        </g>
        <text x="50%" y="47%" textAnchor="middle" fontSize="26" fontWeight="800" fill="currentColor">
          {total}
        </text>
        <text x="50%" y="60%" textAnchor="middle" fontSize="11" fill="#8a94a6">
          {centerLabel}
        </text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 140 }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: seg.color }} />
            <span style={{ flex: 1, color: '#8a94a6', textTransform: 'capitalize' }}>{seg.label}</span>
            <strong>{seg.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
