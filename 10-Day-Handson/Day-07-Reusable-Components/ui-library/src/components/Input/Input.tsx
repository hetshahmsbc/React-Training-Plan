import "./Input.css";

type InputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number";
  error?: string;
};

function Input({ label, value, onChange, placeholder, type = "text", error }: InputProps) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        className={error ? "input-box input-error" : "input-box"}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}

export default Input;
