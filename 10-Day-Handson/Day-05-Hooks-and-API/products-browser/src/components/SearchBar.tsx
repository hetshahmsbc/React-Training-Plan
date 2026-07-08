// SearchBar.tsx — a controlled text input for searching products.
// TODO: accept { value, onChange } props and render an <input>.

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}
export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search">
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className="search-bar"
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
