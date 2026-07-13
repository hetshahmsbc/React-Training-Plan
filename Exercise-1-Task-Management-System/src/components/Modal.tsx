import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, isOpen, onClose, children }: ModalProps) {
  // If it's not open, render nothing at all.
  if (!isOpen) {
    return null;
  }

  return (
    // Clicking the dark overlay closes the modal.
    <div className="modal__overlay" onClick={onClose}>
      {/* stopPropagation: clicks INSIDE the card should NOT close it. */}
      <div className="modal__card" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
