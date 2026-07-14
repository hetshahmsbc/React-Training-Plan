export function Spinner() {
  return (
    <div className="spinner" role="status" aria-label="Loading">
      <div className="spinner__circle" />
      <span>Loading…</span>
    </div>
  );
}
