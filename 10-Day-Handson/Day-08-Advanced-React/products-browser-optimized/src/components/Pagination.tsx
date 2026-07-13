// Pagination.tsx — Previous / Next buttons. Wrapped in React.memo (Day 8).
// Fill this in from the guide in chat.

import { memo } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null; // no buttons needed for a single page

  return (
    <nav className="pagination">
      <button className="page-btn" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Previous
      </button>

      <span className="page-info">
        Page <strong>{page}</strong> of {totalPages}
      </span>

      <button
        className="page-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}

export default memo(Pagination);
