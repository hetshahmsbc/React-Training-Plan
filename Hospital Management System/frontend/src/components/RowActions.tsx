// Small icon-button action group for table rows (Edit / Delete + optional extras
// like "Join call" or "Buy"). Matches the wireframe's action-icon style.

import { type ReactNode } from 'react';

export interface ExtraAction {
  title: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'danger' | 'muted';
}

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
  extras?: ExtraAction[];
}

export function RowActions({ onEdit, onDelete, extras = [] }: Props) {
  const cls = (v?: string) =>
    'hms-iconbtn' + (v === 'danger' ? ' hms-iconbtn--danger' : v === 'muted' ? ' hms-iconbtn--muted' : '');
  return (
    <span className="hms-actioncell">
      {extras.map((e, i) => (
        <button key={i} className={cls(e.variant)} title={e.title} onClick={e.onClick}>
          {e.icon}
        </button>
      ))}
      {onEdit && (
        <button className="hms-iconbtn" title="Edit" onClick={onEdit}>
          <IconEdit />
        </button>
      )}
      {onDelete && (
        <button className="hms-iconbtn hms-iconbtn--danger" title="Delete" onClick={onDelete}>
          <IconTrash />
        </button>
      )}
    </span>
  );
}

function base(children: ReactNode) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
function IconEdit() {
  return base(<>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </>);
}
function IconTrash() {
  return base(<>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  </>);
}
export function IconVideo() {
  return base(<>
    <path d="m23 7-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </>);
}
export function IconCart() {
  return base(<>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </>);
}
