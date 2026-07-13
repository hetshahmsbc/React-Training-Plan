import type { InputHTMLAttributes } from "react";

// Extend real <input> props, and require a visible label + id.
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export function Input({ label, id, ...rest }: InputProps) {
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <input className="field__input" id={id} {...rest} />
    </div>
  );
}
