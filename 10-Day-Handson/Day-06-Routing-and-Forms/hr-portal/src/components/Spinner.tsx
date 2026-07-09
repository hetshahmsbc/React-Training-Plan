// Spinner — a small reusable loading indicator.

interface SpinnerProps {
  label?: string;
}

export default function Spinner({ label = "Loading…" }: SpinnerProps) {
  return (
    <div className="loading">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}
