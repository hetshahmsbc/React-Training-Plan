// Provides the toast API and renders the stacked toast viewport (top-right).
// Toasts auto-dismiss after a few seconds and can be closed manually.

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "../components/icons";
import { ToastContext, type ToastApi, type ToastType } from "./toast";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const ICONS: Record<ToastType, string> = {
  success: "check",
  error: "x",
  warning: "alert",
  info: "info",
};

const AUTO_DISMISS_MS = 4200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type: ToastType, message: string) => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, type, message }]);
      setTimeout(() => remove(id), AUTO_DISMISS_MS);
    },
    [remove],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      warning: (m) => push("warning", m),
      info: (m) => push("info", m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-viewport" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
            <span className="toast__icon">
              <Icon name={ICONS[toast.type]} size={18} />
            </span>
            <span className="toast__msg">{toast.message}</span>
            <button
              type="button"
              className="toast__close"
              onClick={() => remove(toast.id)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
