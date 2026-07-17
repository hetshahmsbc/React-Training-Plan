// A small "⋮" dropdown menu — the React version of the grid's kebab toolbar
// (Edit / Delete / Refresh / Export). Closes on outside click or Escape.

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

export interface KebabAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export function KebabMenu({ actions }: { actions: KebabAction[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="kebab" ref={ref}>
      <button
        type="button"
        className="btn btn--icon"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="kebab" size={18} />
      </button>
      {open ? (
        <div className="kebab__menu" role="menu">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              className={`kebab__item${action.danger ? " kebab__item--danger" : ""}`}
              disabled={action.disabled}
              onClick={() => {
                setOpen(false);
                action.onClick();
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
