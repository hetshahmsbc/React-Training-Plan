import type { ButtonHTMLAttributes, ReactNode } from "react";

// Our bottom supports 3 looks.
type ButtonVariant = "primary" | "secondary" | "danger";

// Extend the real <button> props so onClick, type, disabled, etc. all work.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ variant = "primary", children, ...rest }: ButtonProps) {
  return (
    <button className={`btn btn--${variant}`} {...rest}>
      {children}
    </button>
  );
}
