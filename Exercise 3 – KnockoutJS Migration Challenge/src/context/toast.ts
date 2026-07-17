// ---------------------------------------------------------------------------
// Toast context + hook.
//
// The React equivalent of the app-wide `Notification.success / error / warning`
// helpers used throughout the KnockoutJS code. Kept in a plain .ts file (no
// components) so the provider component lives on its own for Fast Refresh.
// ---------------------------------------------------------------------------

import { createContext, useContext } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

/** Read the toast API from anywhere in the tree. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
