// A labelled form-field wrapper with a floating outlined label (matches the
// "pure-material-textfield-outlined" look of the original .cshtml). Was that
// markup copied dozens of times; now written once and reused for every input.

import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div className={`field${error ? " field--error" : ""}`}>
      <div className="field__control">
        {children}
        <label className="field__label">
          {label}
          {required ? <span className="field__required">*</span> : null}
        </label>
      </div>
      {error ? <span className="field__error">{error}</span> : null}
    </div>
  );
}
