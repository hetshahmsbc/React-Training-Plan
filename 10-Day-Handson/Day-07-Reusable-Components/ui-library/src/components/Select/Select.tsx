import "./Select.css";

type SelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
};

function Select({ label, value, onChange, options, error }: SelectProps) {
  return (
    <div className="select-group">
      {label && <label className="select-label">{label}</label>}
      <select
        className={error ? "select-box select-error" : "select-box"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="select-error-text">{error}</span>}
    </div>
  );
}

export default Select;
