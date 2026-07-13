import { Button } from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  // Only one page? Then we don't need the controls at all.
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <Button variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        ← Prev
      </Button>

      <span className="pagination__info">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next →
      </Button>
    </div>
  );
}
